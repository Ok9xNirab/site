---
title: "N-grams: the language model before language models"
path: "n-grams-explained"
excerpt: "How N-grams turn text into countable sequences, how they predict the next word, and why counting eventually stopped being enough."
date: 2026-09-11
draft: false
tags: ["NLP"]
---

Before transformers, before word embeddings, before anyone said "attention is all you need", autocomplete worked. Your phone guessed the next word. Search engines finished your query. Spell checkers knew that "definately" was wrong and "definitely" was right.

All of that ran on counting.

An **N-gram** is a continuous sequence of N items pulled from a text. The items are usually words, sometimes characters. That is the entire idea. Everything else in this post is a consequence of it.

### Splitting a sentence

Take a sentence:

```
I love programming
```

Slide a window of size N across it, one position at a time, and collect what the window sees.

**Unigrams (N = 1)** — the window holds one word:

```
["I", "love", "programming"]
```

**Bigrams (N = 2)** — two words:

```
["I love", "love programming"]
```

**Trigrams (N = 3)** — three words:

```
["I love programming"]
```

A sentence of `L` words yields `L - N + 1` N-grams. Three words with a window of two gives two bigrams. Three words with a window of three gives one trigram. Push N to four and you get nothing at all, because the window is wider than the sentence.

In Python the whole operation is one zip:

```python
def ngrams(tokens, n):
    return [tuple(tokens[i:i + n]) for i in range(len(tokens) - n + 1)]

tokens = "I love programming".split()
ngrams(tokens, 2)
# [('I', 'love'), ('love', 'programming')]
```

`nltk` ships the same thing as `nltk.util.ngrams`, and scikit-learn exposes it as the `ngram_range` argument on `CountVectorizer` and `TfidfVectorizer`. You rarely need to write it yourself, but it helps to know there is nothing hiding under the hood.

### Why bother

A unigram model sees a document as a bag of loose words. "Dog bites man" and "man bites dog" are identical to it. Both are the same three words with the same counts, and the model has no way to tell a headline from its opposite.

Bigrams fix that specific failure. "Dog bites" and "bites dog" are different keys in the count table, so word order finally means something. Trigrams capture a little more: negation attaches ("not good" stops looking like praise), and fixed phrases hold together ("machine learning" is one concept, not two words that happen to be adjacent).

So N-grams buy you three things:

- **Word order**, within the width of the window.
- **Local context**, again only as wide as the window.
- **Common phrase patterns**, because frequent sequences accumulate high counts.

Notice how often the phrase "within the window" shows up. That constraint is the whole story of N-grams, and it comes back at the end of this post.

### Turning counts into predictions

Counting sequences is descriptive. To predict, you turn counts into probabilities.

The goal of a language model is to score a sentence: how likely is this string of words? The chain rule of probability breaks that into a product of next-word probabilities.

$$
P(w_1, w_2, \dots, w_n) = P(w_1) \cdot P(w_2 \mid w_1) \cdot P(w_3 \mid w_1, w_2) \cdots
$$

That last term is the problem. Conditioning on every previous word means you would need to have seen that exact prefix before, and for any sentence longer than a few words you never have.

The N-gram model makes an assumption to escape this, called the **Markov assumption**: only the last N-1 words matter. A bigram model throws away everything except the immediately preceding word.

$$
P(w_n \mid w_1, \dots, w_{n-1}) \approx P(w_n \mid w_{n-1})
$$

That approximation is wrong, and it is wrong on purpose. It is wrong in a way that makes the whole thing computable, because now the probability is just a ratio of two counts you can actually collect:

$$
P(\text{programming} \mid \text{love}) = \frac{\text{count}(\text{``love programming''})}{\text{count}(\text{``love''})}
$$

If "love" appears 1000 times in your corpus and "love programming" appears 40 of those, the probability is 0.04.

### Prediction, concretely

You type:

```
I love
```

A bigram model looks up every continuation it has ever seen after "love", ranked by count:

| Continuation | Count | P(word \| "love") |
| --- | --- | --- |
| love you | 820 | 0.082 |
| love it | 610 | 0.061 |
| love this | 450 | 0.045 |
| love programming | 40 | 0.004 |
| love pizza | 35 | 0.0035 |

It suggests the top of that list. That is old autocomplete, and it is also, structurally, what a modern language model does at the last step. The difference is entirely in how the distribution gets computed, not in what happens once you have it.

A minimal implementation:

```python
from collections import defaultdict, Counter

model = defaultdict(Counter)

for sentence in corpus:                    # corpus = list of token lists
    for w1, w2 in ngrams(sentence, 2):
        model[w1][w2] += 1

def predict(word, k=3):
    total = sum(model[word].values())
    return [(w, c / total) for w, c in model[word].most_common(k)]

predict("love")
# [('you', 0.082), ('it', 0.061), ('this', 0.045)]
```

Roughly fifteen lines, and you have a working language model. Train it on a large enough corpus and the suggestions stop looking random.

### Choosing N

N is a dial between two failure modes, and there is no setting that avoids both.

**Small N** generalises well and predicts poorly. A bigram model has seen almost every word pair it will encounter, so it rarely draws a blank. But it barely knows anything about what it is generating. Sampling from a bigram model produces text that is locally plausible and globally nonsense: each pair of adjacent words looks fine, and the sentence as a whole means nothing.

**Large N** predicts sharply and generalises terribly. A 5-gram model that has seen your exact four-word prefix gives an excellent guess. Most of the time it has not seen it, and it has nothing to say.

The counts make the tradeoff obvious. With a vocabulary of 50,000 words, there are $2.5 \times 10^{9}$ possible bigrams and $1.25 \times 10^{14}$ possible trigrams. No corpus covers a meaningful fraction of that space. Trigrams are the usual compromise for word-level models. Character-level N-grams can go much higher, often 4 to 6, because the alphabet is tiny and the space stays manageable.

### The sparsity problem

Here is where the counting approach starts to strain.

Suppose your model has never seen "love debugging". The count is zero, so the probability is zero. And because sentence probability is a product, one zero drags the entire sentence to zero. The model does not report low confidence in a plausible phrase. It reports that the sentence is impossible.

This is the **data sparsity** problem, and it is not an edge case. It is the normal condition. Most valid N-grams in any language never appear in any given corpus, because language is generative and corpora are finite.

The classical fix is **smoothing**: move a little probability mass away from things you have seen and give it to things you have not.

**Add-one (Laplace) smoothing** pretends every possible N-gram was seen one extra time:

$$
P(w_2 \mid w_1) = \frac{\text{count}(w_1, w_2) + 1}{\text{count}(w_1) + V}
$$

$V$ is the vocabulary size. Nothing is zero anymore. It is also crude, since it hands the same mass to every unseen sequence, and with a large vocabulary it steals far too much from the sequences you actually observed.

**Backoff** is smarter. If the trigram is missing, fall back to the bigram. If that is missing too, fall back to the unigram. Use the most specific evidence you have, and degrade gracefully instead of collapsing.

**Interpolation** blends all the orders at once rather than choosing between them:

$$
\hat{P}(w_3 \mid w_1, w_2) = \lambda_1 P(w_3 \mid w_1, w_2) + \lambda_2 P(w_3 \mid w_2) + \lambda_3 P(w_3)
$$

with the weights $\lambda_1 + \lambda_2 + \lambda_3 = 1$, usually tuned on held-out data.

**Kneser-Ney smoothing** is what serious N-gram systems actually used. Its insight is that raw frequency is the wrong signal for a backoff estimate. The word "Francisco" is common, but it appears almost exclusively after "San". It is a bad guess in a novel context despite its frequency. Kneser-Ney backs off on how many *distinct* contexts a word appears in, not how often it appears. It was the state of the art in statistical language modelling for well over a decade.

### Measuring the model

The standard metric is **perplexity**: the inverse probability the model assigns to a test set, normalised by length.

$$
PP(W) = P(w_1, w_2, \dots, w_n)^{-\frac{1}{n}}
$$

Read it as the model's average branching factor. A perplexity of 100 means the model is, on average, as uncertain as if it were choosing uniformly among 100 words at each position. Lower is better.

Word-level trigram models with good smoothing land somewhere around 100 to 200 perplexity on standard English benchmarks. Modern neural models sit well under 20 on the same data. That gap is the entire argument for what came next.

One rule that trips people up: always compute perplexity on held-out text. A model evaluated on its training corpus scores beautifully and tells you nothing, because it has memorised the answers.

### Where N-grams still show up

The N-gram *language model* is largely historical. The N-gram *feature* is alive and working in production everywhere.

**Text classification.** Feeding unigrams plus bigrams into a `TfidfVectorizer` and training logistic regression or a linear SVM on top is still a genuinely strong baseline for spam detection, sentiment, and topic labelling. It trains in seconds, it needs no GPU, and it is fully interpretable. You can point at the exact bigram that pushed a document into a class. Build this before you reach for a transformer, so you know what the transformer has to beat.

```python
from sklearn.feature_extraction.text import TfidfVectorizer

vec = TfidfVectorizer(ngram_range=(1, 2), min_df=2)
X = vec.fit_transform(documents)
```

**Search and autocomplete.** Query suggestion still leans heavily on N-gram frequency from query logs. It is fast, it reflects what people actually type, and it needs no inference server.

**Spell correction.** Context-sensitive correction is an N-gram job. Deciding between "their" and "there" means comparing the probability of the surrounding trigrams.

**Machine translation evaluation.** BLEU, the metric that dominated translation research for twenty years, is N-gram precision overlap between the candidate and the reference. ROUGE does the same for summarisation.

**Tokenisation itself.** Byte Pair Encoding, which feeds essentially every modern LLM, builds its vocabulary by repeatedly merging the most frequent adjacent character pair. That is character bigram counting, running inside the models that supposedly replaced N-grams.

**Plagiarism and near-duplicate detection.** Shingling documents into character or word N-grams and comparing the sets, usually with MinHash, is the standard approach.

**Language identification.** Character trigram profiles separate languages remarkably well, and the classifier fits in a few kilobytes.

### The limitation that ended the era

Everything an N-gram model knows lives inside a window of N-1 words. Move a dependency outside that window and the model cannot see it.

```
The keys that I left on the kitchen counter yesterday afternoon ___
```

The verb has to agree with "keys", which is eleven words back. A trigram model sees "yesterday afternoon" and nothing else. It has no mechanism for reaching further, because reaching further is precisely what the Markov assumption gave up in exchange for being computable.

There is a second, subtler failure. N-grams treat every sequence as an opaque symbol. To the model, "the cat sat" and "the dog sat" are two unrelated keys in a hash table. It learns nothing about the first from the second. There is no notion that "cat" and "dog" are similar, so evidence never transfers between related words. Every sequence has to be observed independently, which is exactly why sparsity bites so hard.

Neural language models attacked both problems at once. Embeddings replaced discrete symbols with dense vectors, so similar words occupy nearby positions and evidence generalises across them. Recurrent networks, and later attention, replaced the fixed window with a learned, unbounded reach over the context. Attention in particular lets position 400 look directly at position 12, which no amount of tuning N will ever do.

### What to take from it

N-grams are worth understanding in 2026 for reasons that have nothing to do with using them as a language model.

They make the *shape* of language modelling visible. Predicting the next token from context, scoring a sequence with a product of conditional probabilities, evaluating with perplexity, fighting the tension between memorisation and generalisation. All of it is right there in fifteen lines of Python you can read in one sitting. The same structure sits inside a transformer, buried under a great deal of machinery.

They are also still the right tool often enough to matter. When you need a classification baseline this afternoon, or a spell checker that runs on a device with no network, or a metric that anyone can reimplement, counting sequences is not a compromise. It is the correct choice.

The lesson is not that counting was replaced. It is that counting could only ever see as far as its window, and that seeing further turned out to be what mattered most.
