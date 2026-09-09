// Renders a 1200x630 social card with CanvasKit (Skia via WebAssembly).
//
// Written against CanvasKit directly rather than astro-og-canvas because that
// package can only draw a title, a description and a rectangular logo pinned to
// the top; there is no way to place the author's name beside their photo.
//
// Everything is read from disk. Nothing here touches the network, so the build
// stays deterministic and offline-safe.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import CanvasKitInit from "canvaskit-wasm";

const require = createRequire(import.meta.url);

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

// Design tokens, mirrored from src/styles/global.css.
const INK = [18, 18, 15];
const INK2 = [104, 104, 95];
const INK3 = [165, 165, 156];
const WASH = [247, 247, 245];
const LINE = [229, 229, 225];
const ACCENT = [0, 106, 202];

const PAD_X = 88;
const PAD_Y = 76;
const RULE_W = 18;
const AVATAR = 76;

const asset = (...p) => path.resolve(process.cwd(), ...p);

/** Buffer -> a standalone ArrayBuffer. A Buffer is a view into a shared pool,
 *  so handing `.buffer` straight to CanvasKit can pass neighbouring bytes. */
const toArrayBuffer = (buf) =>
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

let kitPromise;
const getCanvasKit = () =>
  (kitPromise ??= CanvasKitInit({
    locateFile: (file) => require.resolve(`canvaskit-wasm/bin/${file}`),
  }));

let cache;
function loadAssets() {
  if (cache) return cache;
  const fonts = [
    "src/assets/fonts/jetbrains-mono-500.ttf",
    "src/assets/fonts/jetbrains-mono-400.ttf",
  ].map((f) => toArrayBuffer(fs.readFileSync(asset(f))));
  const avatar = fs.readFileSync(asset("public/me-classic.jpeg"));
  cache = { fonts, avatar };
  return cache;
}

export async function renderCard({ title, description = "", author, site }) {
  const CanvasKit = await getCanvasKit();
  const { fonts, avatar } = loadAssets();

  const color = (rgb) => CanvasKit.Color(...rgb);
  const surface = CanvasKit.MakeSurface(CARD_WIDTH, CARD_HEIGHT);
  const canvas = surface.getCanvas();

  // Background.
  const bg = new CanvasKit.Paint();
  bg.setColor(color(WASH));
  canvas.drawRect(CanvasKit.XYWHRect(0, 0, CARD_WIDTH, CARD_HEIGHT), bg);

  // Accent rule down the leading edge.
  const rule = new CanvasKit.Paint();
  rule.setColor(color(ACCENT));
  canvas.drawRect(CanvasKit.XYWHRect(0, 0, RULE_W, CARD_HEIGHT), rule);

  const fontMgr = CanvasKit.FontMgr.FromData(...fonts);
  const family = ["JetBrains Mono"];
  const textWidth = CARD_WIDTH - PAD_X - 80;

  const layout = (text, { size, weight, rgb, lineHeight }) => {
    const style = new CanvasKit.ParagraphStyle({
      textAlign: CanvasKit.TextAlign.Left,
      textStyle: {
        color: color(rgb),
        fontFamilies: family,
        fontSize: size,
        fontStyle: { weight: CanvasKit.FontWeight[weight] },
        heightMultiplier: lineHeight,
      },
    });
    const builder = CanvasKit.ParagraphBuilder.Make(style, fontMgr);
    builder.addText(text);
    const p = builder.build();
    p.layout(textWidth);
    return p;
  };

  // Truncate to `maxLines` by hand rather than using ParagraphStyle's own
  // ellipsis, which draws a stray .notdef box after the ellipsis glyph in
  // CanvasKit 0.37. Binary-searches the longest prefix that still fits, then
  // backs up to a word boundary.
  const paragraph = (text, opts) => {
    const { maxLines } = opts;
    const lines = (t) => layout(t, opts).getLineMetrics().length;
    if (lines(text) <= maxLines) return layout(text, opts);

    let lo = 0;
    let hi = text.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (lines(`${text.slice(0, mid).trimEnd()}\u2026`) <= maxLines) lo = mid;
      else hi = mid - 1;
    }
    let cut = text.slice(0, lo).trimEnd();
    const lastSpace = cut.lastIndexOf(" ");
    if (lastSpace > cut.length * 0.6) cut = cut.slice(0, lastSpace);
    return layout(`${cut.trimEnd()}\u2026`, opts);
  };

  // Title, then description directly beneath it.
  const titlePara = paragraph(title, {
    size: 60,
    weight: "Medium",
    rgb: INK,
    maxLines: 3,
    lineHeight: 1.18,
  });
  canvas.drawParagraph(titlePara, PAD_X, PAD_Y);

  let y = PAD_Y + titlePara.getHeight() + 28;
  if (description) {
    const descPara = paragraph(description, {
      size: 28,
      weight: "Normal",
      rgb: INK2,
      // Two lines is the most that still clears the hairline when the title
      // itself runs to its full three lines.
      maxLines: 2,
      lineHeight: 1.45,
    });
    canvas.drawParagraph(descPara, PAD_X, y);
  }

  // Footer: hairline, author photo, name, domain.
  const footerY = CARD_HEIGHT - PAD_Y - AVATAR;

  const hairline = new CanvasKit.Paint();
  hairline.setColor(color(LINE));
  canvas.drawRect(CanvasKit.XYWHRect(PAD_X, footerY - 44, textWidth, 2), hairline);

  const img = CanvasKit.MakeImageFromEncoded(avatar);
  if (img) {
    canvas.save();
    const circle = CanvasKit.XYWHRect(PAD_X, footerY, AVATAR, AVATAR);
    canvas.clipRRect(CanvasKit.RRectXY(circle, AVATAR / 2, AVATAR / 2), CanvasKit.ClipOp.Intersect, true);
    canvas.drawImageRect(
      img,
      CanvasKit.XYWHRect(0, 0, img.width(), img.height()),
      circle,
      new CanvasKit.Paint()
    );
    canvas.restore();
  }

  const textX = PAD_X + AVATAR + 24;
  const namePara = paragraph(author, {
    size: 28,
    weight: "Medium",
    rgb: INK,
    maxLines: 1,
    lineHeight: 1.2,
  });
  canvas.drawParagraph(namePara, textX, footerY + 6);

  const sitePara = paragraph(site, {
    size: 24,
    weight: "Normal",
    rgb: INK3,
    maxLines: 1,
    lineHeight: 1.2,
  });
  canvas.drawParagraph(sitePara, textX, footerY + 42);

  const snapshot = surface.makeImageSnapshot();
  const bytes = snapshot.encodeToBytes(CanvasKit.ImageFormat.PNG, 90) || new Uint8Array();
  surface.dispose();
  return Buffer.from(bytes);
}
