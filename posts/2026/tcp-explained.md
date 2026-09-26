---
title: "TCP: how a connection actually works"
path: "tcp-explained"
excerpt: "What TCP does on top of IP: ports, the three-way handshake, sequence numbers, ACKs, retransmission, closing a connection, and the costs that pushed HTTP/3 onto QUIC."
date: 2026-09-26
draft: false
tags: ["Networking"]
---

Almost everything I work with on the backend sits on TCP. HTTP/1.1 and HTTP/2, Postgres and MySQL connections, Redis, SSH, gRPC, the TLS session in front of all of them. You rarely touch TCP directly, but when something is slow or flaky, it's often TCP doing exactly what it was designed to do, and it helps to know what that is.

TCP stands for Transmission Control Protocol. It's a layer 4 protocol, in the transport layer, and it sits right on top of IP. In the [OSI post](/post/osi-model-explained) I described it in one line as the reliable option next to UDP. This post goes into what "reliable" actually costs.

### What IP gives you, and what it doesn't

IP gets a packet to a host. That's all it promises, and it doesn't promise it very hard. Packets can be dropped, duplicated, delayed or arrive in a different order than they were sent. IP also has no idea which program on the host the packet is for. The address in the header is `10.0.0.2`, not "the Postgres process on 10.0.0.2".

TCP adds the missing pieces:

- **Ports**, so a segment reaches the right process on the host.
- **Connections**, so both sides agree to talk before any data moves.
- **Ordering**, so bytes come out in the order they went in.
- **Acknowledgments and retransmission**, so lost data gets sent again.
- **Flow and congestion control**, so a fast sender doesn't drown a slow receiver or the network in between.

UDP gives you the first item and nothing else. It sends whatever you hand it and doesn't care what happens next. TCP controls the transmission, which is where the name comes from.

### Ports and multiplexing

A single machine runs lots of programs that want the network at the same time. My laptop might have a browser tab, an SSH session and a `psql` shell open, all talking to the same server. They share one network interface and one IP address, so the host needs a way to tell their traffic apart.

That's what ports are for. Each TCP segment carries a source port and a destination port, 16 bits each. Servers listen on well-known ports (443 for HTTPS, 22 for SSH, 5432 for Postgres). Clients get a random high port from the OS, called an ephemeral port.

![Three apps on a laptop at 10.0.0.1 (browser on port 51514, ssh client on 51522, psql on 51530) share one network link to a server at 10.0.0.2, where segments are split back out to nginx on 443, sshd on 22 and postgres on 5432](/images/2026/tcp-multiplexing.svg)

The sender multiplexes: it takes data from all of its apps and sends it down the same link, with ports in each segment. The receiver demultiplexes: it looks at each incoming segment and hands it to the right socket.

The lookup isn't just by destination port, though. A busy web server has thousands of connections, and every one of them has destination port 443. The kernel tells them apart by four values:

```
(source IP, source port, destination IP, destination port)

10.0.0.1 : 51514  ->  10.0.0.2 : 443
10.0.0.1 : 51515  ->  10.0.0.2 : 443   <- same client, different connection
10.0.0.9 : 51514  ->  10.0.0.2 : 443   <- different client, same ports
```

Each line is a separate connection. Change any one of the four values and it's a different connection. (Strictly it's a five-tuple, since the protocol is part of it too. A TCP socket and a UDP socket can both use port 53 without clashing.)

This is also why a client runs out of connections to a single server before it runs out of anything else. If the source IP, destination IP and destination port are all fixed, only the source port can vary, and Linux hands out roughly 28,000 of them by default (`net.ipv4.ip_local_port_range` is `32768 60999`). A service that opens a new connection per request to the same upstream can hit that limit, especially with connections stuck in `TIME_WAIT`, which I'll get to below.

### What a connection is

A TCP connection is an agreement between two hosts. Both sides keep some state about it: the four-tuple, the next sequence number to send, the next one expected, buffer sizes, timers. Nothing crosses the network to "hold" the connection. It exists only as those two chunks of memory, one in each kernel, that happen to agree with each other.

A few rules follow from that:

- You have to create a connection before you can send data.
- You can't send data outside of a connection.
- Segments inside a connection are numbered, acknowledged, and retransmitted if lost.

In the OSI model, managing a session is technically a layer 5 job. TCP does it at layer 4 anyway, which is one of the places where the OSI layers and real protocols don't line up neatly.

From your program's point of view, a connection is a socket. On Linux and macOS a socket is a file descriptor, the same kind of integer you get from `open()`, so you `read()` and `write()` it like a file. When people say "socket", "connection" and "file descriptor" loosely in the same sentence, this is why.

A server actually uses two kinds of socket. The listening socket is bound to port 443 and only accepts new connections. Every call to `accept()` returns a new socket for one specific client, identified by that client's four-tuple.

```python
import socket

srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # SOCK_STREAM = TCP
srv.bind(("0.0.0.0", 9000))
srv.listen()

while True:
    conn, addr = srv.accept()   # handshake is already done by now
    print("new connection from", addr, "fd", conn.fileno())
    data = conn.recv(1024)
    conn.sendall(data)          # echo it back
    conn.close()
```

Notice that `accept()` returns after the handshake. The kernel does the whole handshake on its own and puts finished connections in a queue. Your code just picks them up.

### The three-way handshake

Before any data flows, the two sides exchange three segments.

![Sequence diagram of the three-way handshake: the client sends SYN with seq 1000, the server replies SYN+ACK with seq 7000 and ack 1001, the client sends ACK with seq 1001 and ack 7001, and both sides move to ESTABLISHED](/images/2026/tcp-handshake.svg)

1. **SYN.** The client picks an initial sequence number and sends a segment with the SYN flag set. SYN is short for synchronize, as in "here's my starting number, sync up with it".
2. **SYN-ACK.** The server picks its own initial sequence number, sends it with SYN set, and also acknowledges the client's number by sending back that number plus one.
3. **ACK.** The client acknowledges the server's number the same way.

Now both sides know both starting numbers and both are in the `ESTABLISHED` state. Each side keeps the four-tuple `10.0.0.1:5555 <-> 10.0.0.2:22` and the file descriptor for it.

I used 1000 and 7000 to keep the diagram readable. Real initial sequence numbers are 32-bit values generated to be hard to guess. There's a good reason for that. If an attacker could predict the server's number, they could fake the client's final ACK from a spoofed IP address without ever seeing the SYN-ACK. With random numbers, you have to actually receive the SYN-ACK, which means you have to really own that IP address. That's most of why TCP connections are hard to spoof.

It's worth being clear about the cost. The client can't send any application data until it has received the SYN-ACK, so every new connection pays one full round trip up front. If the server is 80 ms away, that's 80 ms before the first byte of your request leaves. Add TLS on top and you pay one or two more round trips. That's why connection pools and HTTP keep-alive exist: reusing a connection means you pay for the handshake once instead of on every request.

You can watch a handshake happen with `tcpdump`:

```
$ sudo tcpdump -n -i lo0 'tcp port 9000'
IP 127.0.0.1.51514 > 127.0.0.1.9000: Flags [S],  seq 3868193840, win 65535, options [mss 16344,...]
IP 127.0.0.1.9000 > 127.0.0.1.51514: Flags [S.], seq 1219384401, ack 3868193841, win 65535, ...
IP 127.0.0.1.51514 > 127.0.0.1.9000: Flags [.],  ack 1219384402, win 6379, ...
```

`[S]` is SYN, `[S.]` is SYN-ACK (the dot means ACK), and `[.]` is a plain ACK. You can see the random-looking sequence numbers and the plus-one in each acknowledgment.

### Sending data

Once the connection is up, the client can send. Say I type `ls` in an SSH session. The client wraps those bytes in a TCP segment, puts the source and destination ports on it, and hands it to IP. The server receives it and replies with an ACK.

Sequence numbers count bytes, not segments. If the client's current sequence number is 1001 and it sends 100 bytes, the server acknowledges with `ack = 1101`, which means "I have everything before byte 1101, send me 1101 next". This is called a cumulative ACK.

That leads to a question: does the client have to wait for each ACK before it sends the next segment?

It could. That's called stop-and-wait, and it's painfully slow. With an 80 ms round trip you'd get one segment through every 80 ms no matter how fast your link is.

![Two sequence diagrams side by side: on the left, stop and wait sends a segment and waits for its ACK three times in a row; on the right, the sender sends segments 1, 2 and 3 back to back and gets one ACK 3 that covers all of them, finishing much sooner](/images/2026/tcp-pipelining.svg)

TCP doesn't wait. It keeps several segments in flight at once, and because ACKs are cumulative, the receiver can send a single ACK that covers all of them. In the diagram I've numbered segments 1, 2, 3 to keep it simple. In real traffic the ACK would carry a byte offset, but the idea is the same: acknowledging segment 3 implies you have 1 and 2 as well.

How much can be in flight is limited by two windows:

- **The receive window (flow control).** Every segment the receiver sends includes a window size, the amount of free space in its receive buffer. The sender must not have more unacknowledged data in flight than that. If the application on the receiving side stops reading, the buffer fills, the window drops to zero and the sender stops. This protects a slow receiver from a fast sender.
- **The congestion window (congestion control).** This one is kept by the sender and never sent over the wire. It's the sender's guess at how much the network between the two hosts can handle. A new connection starts small (Linux uses 10 segments, about 14 KB) and roughly doubles it every round trip while ACKs keep coming back. That phase is called slow start. When loss shows up, the sender takes it as a sign the network is overloaded and cuts the window down.

The sender uses whichever of the two is smaller. Slow start is why a fresh connection can't use your full bandwidth right away, and it's one more reason reusing a warm connection is faster than opening a new one.

### When a segment gets lost

Now say the client sends three segments and a router drops the third one.

![Sequence diagram: the client sends seg 1 and seg 2, which arrive, then seg 3, which is dropped by a router. The server replies ACK 2. After the retransmit timer runs out, the client sends seg 3 again and the server replies ACK 3](/images/2026/tcp-retransmit.svg)

The server received 1 and 2, so it acknowledges 2. It can't acknowledge 3 because it never saw it. The client notices that 3 was never acknowledged and sends it again. Once it arrives, the server acknowledges 3 and things carry on.

How does the client "notice"? There are two ways:

- **Retransmission timeout (RTO).** Every time the sender sends data it starts a timer, based on how long ACKs have been taking on this connection. If the timer expires without an ACK, it resends. On Linux the minimum RTO is 200 ms, and it doubles after each failed attempt. A timeout is expensive: the connection sits idle for the whole wait, and the congestion window gets reset to almost nothing.
- **Fast retransmit.** If segments 4, 5 and 6 arrive after 3 went missing, the receiver keeps sending "I still need 3" for each of them. These are called duplicate ACKs. When the sender sees three duplicates it resends 3 right away, without waiting for the timer. This is the common case on a busy connection.

Modern stacks also support selective acknowledgments (SACK), which let the receiver say "I'm missing 3, but I already have 4 to 6", so the sender resends only the hole and not everything after it.

All of this happens in the kernel. Your application never sees the loss. It just sees that `recv()` took longer than usual.

### Closing a connection

Closing is a bit different from opening, because each direction closes on its own.

![Sequence diagram of the connection close: the client sends FIN and goes to FIN_WAIT_1, the server ACKs and goes to CLOSE_WAIT while the client moves to FIN_WAIT_2, later the server sends its own FIN and moves to LAST_ACK, the client ACKs and sits in TIME_WAIT for 2 x MSL before CLOSED](/images/2026/tcp-close.svg)

1. The client is done sending and sends a **FIN**.
2. The server **ACKs** it. At this point the client-to-server direction is closed, but the server can still send whatever it has left.
3. When the server is also done, it sends its own **FIN**.
4. The client **ACKs** that, and the connection is closed.

That's four segments, so people call it a four-way handshake. In practice steps 2 and 3 often go out together as a single FIN-ACK segment when the server has nothing more to send.

Two of the states in that diagram come up a lot in production:

**`TIME_WAIT`** is on the side that closed first. It waits for twice the maximum segment lifetime (60 seconds on Linux) before it frees the four-tuple. This is so that stray segments from the old connection that are still somewhere in the network can't be mistaken for part of a new connection that happens to reuse the same ports. A client that opens and closes lots of short connections to the same server ends up with thousands of sockets in `TIME_WAIT` and can run out of ephemeral ports. The usual fix isn't to tune `TIME_WAIT` down, it's to reuse connections.

**`CLOSE_WAIT`** is on the side that received the FIN but hasn't closed its own socket yet. If you see sockets piling up in `CLOSE_WAIT`, it's almost always a bug in the application. The other side hung up and your code never called `close()`, often a connection leaked on some error path.

You can check both with `ss`:

```
$ ss -tan state time-wait | wc -l
$ ss -tan state close-wait
```

There's also a shortcut. Either side can send a **RST** (reset) segment, which kills the connection immediately with no graceful close. You get one when you connect to a port nothing is listening on (that's the "connection refused" error), when a process crashes with open sockets, or when a load balancer drops an idle connection. "Connection reset by peer" in your logs means an RST arrived.

### The header

All of this state goes in the TCP header. It's 20 bytes without options and can grow to 60.

![The TCP header drawn as 32-bit rows: source port and destination port, sequence number, acknowledgment number, data offset, reserved bits, flags and window size, then checksum and urgent pointer, for 20 bytes. Below it an optional options field of up to 40 bytes. The flags are CWR, ECE, URG, ACK, PSH, RST, SYN and FIN, with ACK, RST, SYN and FIN highlighted as the common ones](/images/2026/tcp-header.svg)

Going through it row by row:

- **Source and destination port.** 16 bits each, which is why ports stop at 65535.
- **Sequence number.** The byte offset of the first data byte in this segment.
- **Acknowledgment number.** The next byte this side expects to receive. Only valid when the ACK flag is set.
- **Data offset.** The header length in 32-bit words. 5 means 20 bytes, 15 means 60, which is where the 60-byte maximum comes from.
- **Flags.** SYN, ACK, FIN and RST are the ones from this post. PSH asks the receiver to hand data to the application right away. ECE and CWR are for explicit congestion notification, where routers mark packets instead of dropping them.
- **Window size.** The receive window from the flow control section. 16 bits only allows 64 KB, which is far too small for modern links, so a window scale option negotiated during the handshake multiplies it.
- **Checksum.** Covers the header, the data and parts of the IP header. A corrupted segment is dropped and later retransmitted, so the application never sees corrupted bytes.
- **Options.** Maximum segment size, window scale, SACK and timestamps are the common ones, and most of them are only negotiated in the SYN and SYN-ACK.

For comparison, the UDP header is 8 bytes: two ports, a length and a checksum. That gap is basically a list of everything TCP does that UDP doesn't.

### What TCP is good for

TCP makes sense whenever you need every byte to arrive, in order, and you'd rather wait than get a gap:

- Web traffic over HTTP/1.1 and HTTP/2
- Database connections
- Remote shells like SSH
- File transfers
- Message brokers and RPC
- Pretty much any two-way conversation where losing data would break things

What you get:

- **Delivery is guaranteed**, or at least you get an error if it can't be done. Data doesn't silently vanish.
- **Nobody can send you data without a handshake first.** The server always knows who it's talking to, at the IP and port level.
- **Flow control and congestion control** are built in, so you don't have to write your own pacing.
- **Ordered, uncorrupted bytes.** You don't need sequence numbers or checksums in your application protocol.
- **It's hard to spoof**, thanks to random sequence numbers and the handshake round trip.

### What it costs

None of that is free.

**Header overhead.** 20 to 60 bytes per segment against UDP's 8. For large transfers this doesn't matter. For lots of tiny messages it adds up.

**More packets.** ACKs travel in the opposite direction even when that side has nothing to say, and every connection starts with a handshake and ends with a close.

**State on both ends.** Every connection costs memory in both kernels: buffers, timers, the socket itself. A server holding a million idle WebSocket connections is really holding a million chunks of kernel state. This is also what SYN floods target. An attacker sends lots of SYNs and never completes the handshake, filling the server's queue of half-open connections. SYN cookies are the usual defense: the server encodes the connection details in its initial sequence number and doesn't store anything until the final ACK comes back.

**Latency.** The handshake costs a round trip, slow start holds back new connections, and a single lost segment can stall everything behind it until it's retransmitted. For a request-response API this is usually fine. For games, voice or video, a late packet is worth less than no packet, so those use UDP.

**It does too much at a low level.** This one takes a bit more explaining.

### Head-of-line blocking

HTTP/2 sends many requests over one TCP connection at the same time. Each request is its own stream, and the streams have nothing to do with each other. Stream A might be a CSS file and stream B an image.

TCP doesn't know any of that. As far as it's concerned there's one ordered byte stream, and it will not hand bytes to the application out of order.

![Two lanes of packets A1, B1, A2, B2, A3 where B1 is lost. In the TCP lane, the app gets A1 and then nothing until B1 is resent, because A2, B2 and A3 sit in the kernel buffer. In the QUIC lane, ordering is per stream, so the app still gets A1, A2 and A3 and only stream B waits](/images/2026/tcp-hol-blocking.svg)

So if one packet from stream B is lost, the packets for stream A that arrived after it sit in the kernel buffer too. They're already on the machine, correct and complete, but the application can't have them until B1 is retransmitted. One lost packet stalls every stream on the connection. This is called head-of-line blocking.

You can't fix this inside TCP without changing every operating system and every middlebox on the internet. So QUIC fixed it by moving the whole thing up a level. QUIC runs over UDP and implements connections, ordering, retransmission and congestion control itself, in user space, with ordering tracked per stream. A loss in stream B only holds up stream B. HTTP/3 runs on QUIC for this reason. Folding the TLS handshake into the connection handshake, which saves round trips, is a nice bonus.

### TCP meltdown

The last one bites people who build VPNs. If you tunnel TCP traffic through a VPN that itself runs over TCP, you have two TCP stacks stacked on top of each other, and both of them retransmit.

When the outer connection loses a packet, it stops and retransmits. Meanwhile the inner connections see their segments taking longer than expected, so their own retransmit timers fire and they send duplicate data into a tunnel that is already backed up. The outer connection now has more to deliver, gets slower, and the inner timers fire again. Each layer's recovery makes the other layer's problem worse, and throughput can collapse. This is called TCP meltdown.

That's why WireGuard only runs over UDP, and why OpenVPN's docs recommend UDP mode. The tunnel should just carry packets and let the TCP connections inside it handle reliability.

### Summary

- TCP is a layer 4 protocol that adds ports, connections and reliability on top of IP.
- Ports let many processes share one IP address. A connection is identified by source IP, source port, destination IP and destination port.
- A connection is state on both ends, created by a three-way handshake (SYN, SYN-ACK, ACK) and closed by a FIN and ACK from each side.
- Sequence numbers count bytes, ACKs are cumulative, and lost segments are retransmitted after a timeout or three duplicate ACKs.
- Flow control protects the receiver, and congestion control protects the network.
- The costs are header overhead, per-connection memory, handshake latency, and head-of-line blocking. The last one is why HTTP/3 moved to QUIC.

In practice most of this comes down to one habit: reuse connections. Pools, keep-alive and long-lived HTTP/2 or gRPC channels all exist because opening a TCP connection is expensive. Once it's open and warmed up, TCP is very good at its job.
