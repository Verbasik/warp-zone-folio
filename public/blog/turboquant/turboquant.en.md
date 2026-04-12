# TurboQuant from Google: AI Breakthrough or Masterful Marketing Trick?

## Part I. Context and Critique

### 1. Introduction: The Illusion of a Free Lunch in the AI World

In the deep learning industry, headlines about "revolutionary breakthroughs" have become a kind of currency that tech giants actively speculate on. Google's recent announcement of the TurboQuant algorithm was no exception: the company loudly proclaimed an 8x inference speedup and a 6x reduction in memory consumption. The market reacted instantly: against the backdrop of this news, shares of Micron — a key memory supplier for AI servers — demonstrated volatility, and analysts began drawing parallels to how China's DeepSeek "crashed" Nvidia's stock price.

However, behind the blinding facade of numbers lies a classic attempt to pass off wishful thinking as reality. Has Google truly found a way to free up 83% of resources on all servers in the world, or are we looking at a masterfully packaged marketing product designed to reassure investors in an era of fierce competition for efficiency?

### 2. The Baseline Trap: How to Get the Coveted "8x Speedup"

The main problem with the claim of "8x speedup" is that it is built on a foundation of deliberate distortion of reality. To obtain this attractive number, Google compared TurboQuant (in 4-bit mode) against an unquantized 32-bit baseline.

For any specialist working on LLM inference, this choice looks absurd: in real production environments, 32-bit weights have not been used for years. This is not a scientific comparison — it is metric manipulation. Imagine a professional sprinter boasting that he runs a hundred times faster than a one-year-old baby. Technically, that is true. But what is the point when you need to compete with Usain Bolt? The true competitors should have been modern quantization methods, but they were deliberately ignored in the main headline.

> "This is the cleanest headline on paper you can imagine, because going from 32 bits to 4 bits is exactly an eightfold reduction in the amount of data transferred. But this has nothing to do with the real inference speed of modern LLMs."

### 3. What Does TurboQuant Actually Compress? (Spoiler: Not the Model Weights)

It is important to understand that TurboQuant does not make the neural network itself "lighter." The model weights remain untouched. The algorithm targets exclusively the KV cache (Key-Value cache) — a data structure that grows linearly with each new token in the context window.

The KV cache problem is the "bottleneck" of modern transformers. Every word in a conversation turns into a set of vectors that must be stored in expensive GPU memory. Compressing this data is extremely risky. If the Key vectors (keys) are distorted, the attention mechanism simply cannot correctly compute the dot product. As a result, the model loses the thread of the conversation, begins to hallucinate, and confuses facts.

### 4. The Secret Sauce: Random Rotation and the Magic of One Bit

The technical novelty of TurboQuant (which, by the way, is largely borrowed from earlier Google works — PolarQuant and QJL) is built on a two-stage process designed to circumvent mathematical limitations.

- **Stage 1: Random Rotation.** Data in LLMs is distributed extremely unevenly: some dimensions are overloaded with signal, others are nearly empty. Direct compression here is inefficient. TurboQuant applies a random invertible rotation that "shuffles" the information. This makes the data distribution uniform across all axes, allowing the use of the simplest quantization without losing structure.
- **Stage 2: Sign Bit.** After compression, there is always a residual error. To minimize it, the authors use just 1 bit per dimension, storing only the sign of the error. Thanks to the rotation, these micro-errors are distributed evenly and simply cancel each other out when computing the dot product.

The math behind the "magical" 83% savings looks like this: Google takes the standard 16-bit format and compares it to TurboQuant at 2.5 bits per value. Dividing 16 by 2.5 gives a factor of 6.4. That is exactly where the claim of sixfold memory reduction comes from. At 3.5 bits, accuracy remains ideal, and at 2.5 bits, model degradation is minimal — which is genuinely a good scientific result, if you set aside the marketing fluff.

### 5. The Dark Side of the Research: "Bleeding Out" the Competition

If there are few complaints about the algorithm's mathematics, there are plenty about the authors' scientific ethics. The community discovered signs of "unfair play" in the paper. Google essentially ignored the existence of RabbitQ — an algorithm published a year earlier that uses the same rotation idea.

The most egregious moment was the performance comparison. To make TurboQuant look better, the authors took the optimized C++ code of the competitors (RabbitQ) and manually rewrote it in Python, intentionally making it single-threaded. As a result, the "baseline" was run on a CPU in the slowest possible mode, while TurboQuant ran on a powerful Nvidia A100 accelerator. Such a comparison in the scientific community is called "shooting a sitting duck" and carries no objective value.

Even the peer-review process at ICLR raises questions: one reviewer gave the paper a score of 10 out of 10, while others gave 4 and 6. Such an anomalous spread often indicates either a reviewer's misunderstanding of the material or bias that helped the paper pass the selection process.

### 6. Real Market Impact: Should You Dump Your Chipmaker Stocks?

Micron's stock recovered fairly quickly, and there are good reasons for that. Investors realized the panic was premature. First, DDR5 was already getting cheaper (prices had fallen 30% even before the announcement), and second, TurboQuant does not reduce the need for hardware.

We live in an "intelligence economy." Any memory optimization does not free up servers — it merely allows us to cram more tokens into them. If we learn to store 6x more data, we will simply use context windows that are 6x longer. The need for memory will not disappear — it will transform into more complex tasks. The 83% savings is a theoretical upper bound for Key vectors in a vacuum, not a real emptying of racks in data centers.

### 7. Conclusion: A Lesson in Information Hygiene in the Age of Hype

TurboQuant is a solid academic work that offers an elegant way to handle Key vectors through rotation and sign bits. But it is also a vivid example of corporate "misdirection."

Behind the loud headlines about an eightfold speedup lies baseline manipulation and unfair comparison with competitors. The real revolution in AI is not an instant leap, but a quiet process of gradual optimization. The main lesson for us today is simple: in a world where every press release claims to be historic, critical thinking and the ability to distinguish 32-bit "straw" from real innovation become the most important survival tools.

---

## Part II. Technical Breakdown

### What's Under the Hood?

`TurboQuant` proposes a `data-oblivious` quantization scheme for high-dimensional vectors that is simultaneously suitable for vector reconstruction and for tasks where preserving dot products is critical. The core idea of the paper: randomly rotate the vector, quantize coordinates as nearly independent scalar quantities, and if inner product accuracy is needed, add a 1-bit residual correction via QJL.

The practical significance of the paper is that the method requires no codebook training on a dataset, works well online, nearly achieves the information-theoretic lower bound, and shows strong results on KV cache compression and nearest neighbor search.

### Formal Problem Statement

The bit budget is defined as

$$
B = b d.
$$

Where:

- $B$ — total number of bits per vector,
- $b$ — number of bits per coordinate,
- $d$ — vector dimensionality.

### Example:

Let the vector dimensionality be

$$
d = 1536.
$$

If each coordinate is stored in `float32` format, the full size of the vector is

$$
B_{\mathrm{float}} = 32 d = 32 \cdot 1536 = 49152 \text{ bits} = 6144 \text{ bytes}.
$$

Where:

- $B_{\mathrm{float}}$ — memory size of the original vector in `float32` format,
- $32$ — number of bits per coordinate in `float32` format,
- $d=1536$ — vector dimensionality.

If we now use quantization with budget

$$
b = 4,
$$

the size of the quantized representation becomes

$$
B = b d = 4 \cdot 1536 = 6144 \text{ bits} = 768 \text{ bytes}.
$$

Where:

- $B$ — memory size of the quantized vector,
- $b=4$ — number of bits per coordinate after quantization,
- $d=1536$ — vector dimensionality.

The compression ratio in this case equals

$$
\frac{B_{\mathrm{float}}}{B} = \frac{32d}{bd} = \frac{32}{4} = 8.
$$

Where:

- $B_{\mathrm{float}}$ — size of the original `float32` vector,
- $B$ — size of the quantized vector,
- $\frac{B_{\mathrm{float}}}{B}$ — the factor by which memory usage has been reduced.

For illustration, let us take the short vector

$$
x = (0.72,\,-1.31,\,0.18,\,2.44).
$$

After 4-bit quantization it is no longer stored as a set of precise real numbers, but as a set of short codes per coordinate, for example:

$$
Q(x) = (1011,\;0011,\;1000,\;1110).
$$

Where:

- $x$ — original real-valued vector,
- $Q(x)$ — its bit representation after quantization,
- each 4-bit block encodes one coordinate,
- `1011`, `0011`, `1000`, `1110` — quantized level indices for the four coordinates.

After decoding we obtain not the original vector but its approximation:

$$
Q^{-1}(Q(x)) = (0.75,\,-1.25,\,0.25,\,2.50).
$$

Where:

- $Q^{-1}(Q(x))$ — the reconstructed vector after reading the bit code,
- $0.75,\,-1.25,\,0.25,\,2.50$ — admissible quantization levels,
- each original coordinate is replaced by the nearest or specially chosen representative of its quantized range.

Important: the exact bit codes and reconstructed values depend on the specific codebook. The illustration shown here is a conceptual scheme whose purpose is to visually demonstrate how a real-valued vector is converted into a short bit string and then into an approximate reconstructed vector.

Visual interpretation in space:

- before quantization, the vector is an arbitrary point in the continuous space $\mathbb{R}^d$;
- in `float32` format, each coordinate is stored with high precision;
- after introducing the budget $B=bd$, each coordinate can no longer take an arbitrary real value;
- instead of a continuous space, a coarser partition into admissible regions appears;
- the vector still lives in $\mathbb{R}^d$, but is now described not exactly, but through a short bit code.

Illustration for the example:

![Figure 01](/warp-zone-folio/blog/turboquant/Figure-01.png)

The quantizer is defined as an encoder-decoder pair:

$$
Q : \mathbb{R}^d \to \{0,1\}^{b d}, \qquad Q^{-1} : \{0,1\}^{b d} \to \mathbb{R}^d.
$$

Where:

- $Q$ — the encoding operator,
- $\mathbb{R}^d$ — space of original vectors,
- $\{0,1\}^{bd}$ — space of bit codes,
- $Q^{-1}$ — the approximate reconstruction operator,
- $b$ — number of bits per coordinate,
- $d$ — dimensionality.

### Example: How the Encoder and Decoder Work

Consider the vector

$$
x =
\begin{pmatrix}
0.72 \\
-1.31
\end{pmatrix}
\in \mathbb{R}^2.
$$

Let the number of bits allocated per coordinate be

$$
b = 2
$$

bits. Then the entire vector requires

$$
B = b d = 2 \cdot 2 = 4 \text{ bits}.
$$

Where:

- $x$ — original vector,
- $d=2$ — vector dimensionality,
- $b=2$ — number of bits per coordinate,
- $B=4$ — total budget for the entire vector.

Assume that the encoder uses the following scalar codebook for each coordinate:

$$
\mathcal{C} = \{-1.5,\,-0.5,\,0.5,\,1.5\}.
$$

And the following partition of the real line into intervals:

$$
(-\infty,-1)\to 00,\qquad [-1,0)\to 01,\qquad [0,1)\to 10,\qquad [1,\infty)\to 11.
$$

Where:

- $\mathcal{C}$ — set of admissible values after decoding,
- `00`, `01`, `10`, `11` — two-bit codes for one coordinate,
- each interval corresponds to one quantized level.

Now we encode the coordinates of vector $x$ separately:

$$
0.72 \in [0,1) \Rightarrow 10,
\qquad
-1.31 \in (-\infty,-1) \Rightarrow 00.
$$

Consequently, the entire vector is encoded as

$$
Q(x) = (10,\;00) \in \{0,1\}^4.
$$

Where:

- $Q(x)$ — bit code of the original vector,
- `10` — code for the first coordinate,
- `00` — code for the second coordinate,
- $\{0,1\}^4$ — space of all 4-bit codes for this example.

During decoding, each pair of bits is replaced by its representative from the codebook:

$$
Q^{-1}(Q(x)) =
\begin{pmatrix}
0.5 \\
-1.5
\end{pmatrix}.
$$

Where:

- $Q^{-1}(Q(x))$ — reconstructed vector,
- $0.5$ — representative of interval $[0,1)$,
- $-1.5$ — representative of interval $(-\infty,-1)$.

The reconstruction error in this example equals

$$
x - Q^{-1}(Q(x)) =
\begin{pmatrix}
0.72 - 0.5 \\
-1.31 - (-1.5)
\end{pmatrix}
=
\begin{pmatrix}
0.22 \\
0.19
\end{pmatrix}.
$$

And the squared Euclidean norm of the error equals

$$
\|x - Q^{-1}(Q(x))\|_2^2 = 0.22^2 + 0.19^2 = 0.0845.
$$

Where:

- $\left\|x - Q^{-1}(Q(x))\right\|_2^2$ — distortion for one specific run of the quantizer,
- $0.0845$ — numerical value of the reconstruction error in this example.

If the quantizer is randomized, different runs may yield slightly different error values. For example:

$$
0.081,\qquad 0.089,\qquad 0.084,\qquad 0.086.
$$

Then the expectation in the formula

$$
\mathbb{E}_Q\|x - Q^{-1}(Q(x))\|_2^2
$$

denotes the average error over such possible quantizer runs.

Visual interpretation of "before/after":

- before encoding, vector $x$ is an arbitrary point in the continuous plane $\mathbb{R}^2$;
- the encoder $Q$ determines which rectangular cell of the partition this point fell into;
- only the short bit index of this cell is stored;
- the decoder $Q^{-1}$ returns not the original point, but a fixed representative of the chosen cell;
- therefore, after quantization we store not the point itself, but the address of the region it lay in.

Illustration for the example:

![Figure 02](/warp-zone-folio/blog/turboquant/Figure-02.png)

The paper uses two main metrics.

For vector reconstruction quality:

$$
D_{\mathrm{mse}} := \mathbb{E}_Q\|x - Q^{-1}(Q(x))\|_2^2.
$$

Where:

- $x$ — original vector,
- $Q(x)$ — quantized code,
- $Q^{-1}(Q(x))$ — reconstructed vector,
- $\|\cdot\|_2^2$ — squared Euclidean norm,
- $\mathbb{E}_Q$ — expectation over the quantizer's randomness.

Visual interpretation:

- vector $x$ is the original point in continuous space;
- quantization replaces it with a nearby but non-coincident point;
- `MSE` measures how far the reconstructed point has moved from the original;
- the smaller this distance, the more accurately the quantizer preserves the geometry of the data.

Illustration for the metric $D_{\mathrm{mse}}$:

![Figure 03](/warp-zone-folio/blog/turboquant/Figure-03.png)

> On the second step, the first point is the original vector, and the second is the reconstructed one... (Generation artifact)

For retrieval and attention tasks:

$$
D_{\mathrm{prod}} := \mathbb{E}_Q\big(\langle y, x\rangle - \langle y, Q^{-1}(Q(x))\rangle\big)^2.
$$

Where:

- $y$ — query vector,
- $x$ — database vector,
- $Q(x)$ — quantized code of vector $x$,
- $Q^{-1}(Q(x))$ — reconstructed vector,
- $\langle y, x\rangle$ — true dot product,
- $\langle y, Q^{-1}(Q(x))\rangle$ — approximate dot product,
- $\mathbb{E}_Q$ — expectation over the algorithm's randomness.

### Example: How the Dot Product Error Is Computed

Consider two specific vectors: a query vector $y$ and a database vector $x$.

Let the query vector be

$$
y =
\begin{pmatrix}
1.0 \\
2.0
\end{pmatrix},
$$

and the database vector be

$$
x =
\begin{pmatrix}
0.72 \\
-1.31
\end{pmatrix}.
$$

Where:

- $y$ — query vector (e.g., question embedding in a retrieval system),
- $x$ — vector from the database (e.g., document embedding).

The true dot product equals

$$
\langle y, x \rangle = 1.0 \cdot 0.72 + 2.0 \cdot (-1.31) = 0.72 - 2.62 = -1.90.
$$

Where:

- $\langle y, x \rangle$ — exact dot product before quantization,
- $-1.90$ — numerical value of this product.

Now suppose vector $x$ has gone through quantization and reconstruction, and we obtained

$$
Q^{-1}(Q(x)) =
\begin{pmatrix}
0.50 \\
-1.50
\end{pmatrix}.
$$

Where:

- $Q^{-1}(Q(x))$ — reconstructed vector after encoding and decoding,
- $0.50$ — reconstructed value of the first coordinate,
- $-1.50$ — reconstructed value of the second coordinate.

The approximate dot product equals

$$
\langle y, Q^{-1}(Q(x)) \rangle = 1.0 \cdot 0.50 + 2.0 \cdot (-1.50) = 0.50 - 3.00 = -2.50.
$$

Where:

- $\langle y, Q^{-1}(Q(x)) \rangle$ — dot product with the reconstructed vector,
- $-2.50$ — numerical value of the approximate product.

The dot product error in this run equals

$$
\langle y, x \rangle - \langle y, Q^{-1}(Q(x)) \rangle = -1.90 - (-2.50) = 0.60.
$$

Where:

- $0.60$ — difference between the true and approximate dot product.

The square of this error equals

$$
\big(\langle y, x \rangle - \langle y, Q^{-1}(Q(x)) \rangle\big)^2 = 0.60^2 = 0.36.
$$

Where:

- $0.36$ — distortion for this particular quantizer run.

If the quantizer contains randomness (e.g., a random rotation), different runs may yield different reconstructed vectors and different errors. For example:

$$
0.35,\qquad 0.38,\qquad 0.34,\qquad 0.37.
$$

Then the expectation in the formula

$$
\mathbb{E}_Q\big(\langle y, x \rangle - \langle y, Q^{-1}(Q(x)) \rangle\big)^2
$$

denotes the average squared error over such possible quantizer runs:

$$
\mathbb{E}_Q[\ldots] = \frac{0.35 + 0.38 + 0.34 + 0.37}{4} = \frac{1.44}{4} = 0.36.
$$

Where:

- $\mathbb{E}_Q$ — averaging over all possible realizations of the random algorithm,
- $0.36$ — average dot product error.

Visual interpretation:

- vector $y$ is the query (a question, user embedding, attention query),
- vector $x$ is the database (a document, embedding, transformer value),
- the dot product $\langle y, x \rangle$ measures relevance, similarity, or attention weight,
- quantization compresses vector $x$ but introduces an error in the relevance estimate,
- $D_{\mathrm{prod}}$ quantitatively measures how large this relevance error is,
- the smaller $D_{\mathrm{prod}}$, the more accurately the quantized database preserves ranking order and attention patterns.

Illustration for the metric $D_{\mathrm{prod}}$:

![Figure 04](/warp-zone-folio/blog/turboquant/Figure-04.png)

For inner-product tasks, the unbiasedness condition is separately important:

$$
\mathbb{E}_Q\langle y, Q^{-1}(Q(x))\rangle = \langle y, x\rangle.
$$

Where:

- $\mathbb{E}_Q$ — expectation over the quantizer's randomness,
- $y$ — query vector,
- $Q^{-1}(Q(x))$ — reconstruction of vector $x$,
- $\langle y, Q^{-1}(Q(x))\rangle$ — inner product estimate after quantization,
- $\langle y, x\rangle$ — true inner product value.

Short example: if $d=1536$ and $b=4$, then $B=6144$ bits, i.e., `768` bytes per vector instead of the usual float representation.

### Why TurboQuant Works

The key step is random orthogonal rotation. After applying it, coordinates behave like coordinates of a random point on a sphere, and one coordinate has the density

$$
f_X(x)=\frac{\Gamma(d/2)}{\sqrt{\pi}\,\Gamma((d-1)/2)}(1-x^2)^{(d-3)/2}.
$$

Where:

- $f_X(x)$ — density of one coordinate after rotation,
- $x$ — coordinate value on the interval $[-1,1]$,
- $\Gamma(\cdot)$ — gamma function,
- $d$ — space dimensionality,
- $(1-x^2)^{(d-3)/2}$ — geometric factor of a spherical cross-section.

The intuition is simple: rotation "spreads" the energy of the vector across coordinates. Therefore, instead of complex vector quantization, one can use coordinate-wise scalar quantization with almost no loss in asymptotic quality.

Short example: if the original vector has several large coordinates, without rotation uniform quantization will be unstable. After random rotation the coordinates become more uniform in scale, and the scalar codebook starts working predictably.

### Example: Coordinate Equalization After Rotation

Consider a vector on the unit sphere in $\mathbb{R}^4$:

$$
v = (0.98,\; 0.10,\; 0.05,\; 0.05).
$$

Where:

- $v$ — normalized vector on the unit sphere ($\|v\|_2 \approx 1$),
- the first coordinate $0.98$ dominates over the others.

Without rotation this is a problem for a uniform scalar quantizer: the uniform grid covers the entire interval $[-1, 1]$, but almost all values of vector $v$ are concentrated in the narrow region $[0.05, 0.98]$. Most of the grid is wasted, and the resolution around the dominant coordinate turns out to be too coarse.

Applying a random orthogonal matrix $R$:

$$
Rv = (0.53,\; -0.51,\; 0.47,\; -0.50).
$$

Where:

- $R$ — random orthogonal matrix ($RR^\top = I$),
- $Rv$ — rotated vector with equalized coordinates,
- all four coordinates now have a similar scale $\approx 0.5$.

A scalar quantizer with a uniform grid now covers each coordinate equally effectively.

### Example: Numerical Computation of Density $f_X$

Let us see how the density formula works for a specific dimensionality. For $d = 4$ the exponent equals

$$
\frac{d-3}{2} = \frac{1}{2},
$$

and the gamma functions simplify to:

$$
\Gamma\!\left(\frac{d}{2}\right) = \Gamma(2) = 1, \qquad \Gamma\!\left(\frac{d-1}{2}\right) = \Gamma\!\left(\frac{3}{2}\right) = \frac{\sqrt{\pi}}{2}.
$$

Where:

- $\Gamma(2) = 1! = 1$ — value of the gamma function at an integer point,
- $\Gamma(3/2) = \frac{\sqrt{\pi}}{2} \approx 0.886$ — standard value,
- $\sqrt{\pi} \approx 1.772$ — square root of pi.

Substituting into the formula:

$$
f_X(x) = \frac{1}{1.772 \cdot 0.886}(1 - x^2)^{1/2} = \frac{2}{\pi}(1 - x^2)^{1/2} \approx 0.637 \cdot \sqrt{1 - x^2}.
$$

Computing $f_X(x)$ for several coordinate values $x$ at $d = 4$:

| $x$   | $(1 - x^2)^{1/2}$ | $f_X(x)$ |
|-------|-------------------|----------|
| $0.0$ | $1.000$           | $0.637$  |
| $0.5$ | $0.866$           | $0.552$  |
| $0.9$ | $0.436$           | $0.278$  |
| $1.0$ | $0$               | $0$      |

Where:

- row $x = 0.0$ — center of the distribution: coordinates near zero are most probable,
- row $x = 0.9$ — edge of the sphere: probability is low,
- row $x = 1.0$ — at the pole the probability is zero.

Now consider a large dimensionality $d = 128$. The exponent becomes

$$
\frac{d-3}{2} = \frac{125}{2} = 62.5,
$$

and the factor $(1 - x^2)^{62.5}$ decays very rapidly:

| $x$   | $(1 - x^2)^{62.5}$          |
|-------|-----------------------------|
| $0.0$ | $1.000$                     |
| $0.1$ | $0.99^{62.5} \approx 0.535$ |
| $0.3$ | $0.91^{62.5} \approx 0.003$ |
| $0.5$ | $0.75^{62.5} \approx 0.000$ |

Where:

- at $d = 128$ the density is concentrated in a very narrow band $|x| \ll 1$,
- almost all coordinates of the rotated vector take values close to zero,
- a scalar quantizer with a uniform grid covers them predictably and efficiently.

Conclusion: at large dimensionality $d$, rotation not only equalizes the scale of coordinates but also guarantees that they become small and statistically independent. This is precisely what allows replacing complex vector quantization with a simple coordinate-wise scalar quantizer with almost no loss.

Illustration for the example: how random rotation transforms the coordinate distribution

![Figure 05](/warp-zone-folio/blog/turboquant/Figure-05.png)

### Theoretical Lower Bound

The paper uses the Shannon Lower Bound:

$$
D(B)\ge 2^{-2B/d}=4^{-b}.
$$

Where:

- $D(B)$ — lower bound on achievable distortion at budget $B$,
- $B$ — total number of bits per vector,
- $d$ — dimensionality,
- $b$ — number of bits per coordinate, where $B=bd$,
- $2^{-2B/d}$ — bound expressed via total budget,
- $4^{-b}$ — same bound expressed via bits per coordinate.

This is the main theoretical benchmark of the paper. It states that no algorithm can, in the worst case, decrease the distortion (squared reconstruction error) faster than the order $4^{-b}$. The paper then shows that TurboQuant matches this bound in terms of the exponential order and falls short only in the constant factor.

Short example:

- at $b=1$ the lower bound is of order $1/4$,
- at $b=2$ — already of order $1/16$,
- each additional bit per coordinate reduces the error exponentially.

### Example: Computing the Shannon Lower Bound

Fix the parameters: dimensionality $d = 128$, bits per coordinate $b = 4$, so the total budget is

$$
B = b \cdot d = 4 \cdot 128 = 512 \text{ bits}.
$$

**Via the first form** $D(B) \ge 2^{-2B/d}$:

$$
2^{-2B/d} = 2^{-2 \cdot 512 / 128} = 2^{-8} = \frac{1}{256} \approx 0.0039.
$$

Where:

- the exponent $-2B/d = -8$ — this is twice the bits per coordinate with a minus sign,
- $\frac{1}{256}$ — lower bound on achievable distortion at this budget.

**Via the second form** $D(B) \ge 4^{-b}$:

$$
4^{-b} = 4^{-4} = \frac{1}{4^4} = \frac{1}{256} \approx 0.0039.
$$

Both forms give the same result, since $4^{-b} = (2^2)^{-b} = 2^{-2b} = 2^{-2B/d}$.

**Table of values** of the lower bound at $d = 128$:

| $b$ (bits/coord.) | $B = bd$ (total bits) | $4^{-b}$ | Lower bound $D(B)$ |
|:-:|:-:|:-:|:-:|
| 1 | 128 | $1/4$ | $\ge 0.250$ |
| 2 | 256 | $1/16$ | $\ge 0.063$ |
| 4 | 512 | $1/256$ | $\ge 0.0039$ |
| 8 | 1024 | $1/65536$ | $\ge 0.000015$ |

Where:

- each additional bit per coordinate multiplies the lower bound by $1/4$,
- at the transition $b=1 \to b=2$ the bound drops 4-fold: $0.250 \to 0.063$,
- at the transition $b=2 \to b=4$ the bound drops 16-fold: $0.063 \to 0.0039$.

This is the **exponential decay**: each bit per coordinate adds two bits of distortion precision. It is precisely to this limit that TurboQuant asymptotically converges in terms of the exponential order — the difference lies only in the constant in front of $4^{-b}$.

Visualization of the exponential decay of the distortion lower bound:

![Figure 06](/warp-zone-folio/blog/turboquant/Figure-06.png)

### Basic 1-Bit Block: QJL

To correct the bias in the inner product, the paper uses QJL:

$$
Q_{\mathrm{qjl}}(x)=\operatorname{sign}(Sx), \qquad
Q_{\mathrm{qjl}}^{-1}(z)=\sqrt{\frac{\pi}{2}}\frac{1}{d}S^\top z.
$$

Where:

- $Q_{\mathrm{qjl}}$ — 1-bit QJL quantizer,
- $x$ — original vector,
- $S$ — random Gaussian projection matrix,
- $\operatorname{sign}(\cdot)$ — element-wise sign function,
- $z$ — binary code consisting of the signs of the coordinates of $Sx$,
- $Q_{\mathrm{qjl}}^{-1}$ — decoder,
- $S^\top$ — transposed projection matrix,
- $d$ — dimensionality,
- $\sqrt{\frac{\pi}{2}}\frac{1}{d}$ — normalization coefficient.

The meaning of QJL: it stores only the sign of each projection, i.e., one bit per coordinate. This is too coarse for full reconstruction, but very well suited as a correction layer for the small remaining quantization error (residual).

Example: if the MSE stage has already approximated $x$, QJL can be applied not to the entire vector but only to the remaining error. The cost of the correction is then minimal, while the benefit for the unbiased inner product is high.

### Example: QJL Computation Step by Step

Take $d = 4$ and vector $x$ to be encoded:

$$
x = (0.70,\; 0.50,\; -0.30,\; -0.40), \qquad \|x\| \approx 1.
$$

Matrix $S \in \mathbb{R}^{4 \times 4}$ — a specific realization of the random Gaussian projection matrix:

$$
S = \begin{pmatrix}
1.2 & -0.8 & \phantom{-}0.5 & \phantom{-}1.0 \\
-0.4 & \phantom{-}1.5 & -0.6 & \phantom{-}0.3 \\
\phantom{-}0.8 & \phantom{-}0.2 & \phantom{-}1.1 & -0.7 \\
-1.3 & \phantom{-}0.6 & -0.4 & \phantom{-}0.9
\end{pmatrix}
$$

**Step 1. Projection** $Sx$:

$$
Sx = \begin{pmatrix}
1.2(0.70) - 0.8(0.50) + 0.5(-0.30) + 1.0(-0.40) \\
-0.4(0.70) + 1.5(0.50) - 0.6(-0.30) + 0.3(-0.40) \\
\phantom{-}0.8(0.70) + 0.2(0.50) + 1.1(-0.30) - 0.7(-0.40) \\
-1.3(0.70) + 0.6(0.50) - 0.4(-0.30) + 0.9(-0.40)
\end{pmatrix}
= \begin{pmatrix} -0.11 \\ \phantom{-}0.53 \\ \phantom{-}0.61 \\ -0.85 \end{pmatrix}
$$

**Step 2. Encoding** — replace each projection with its sign:

$$
z = \operatorname{sign}(Sx) = \begin{pmatrix} -1 \\ +1 \\ +1 \\ -1 \end{pmatrix}
$$

Where:

- $z \in \{-1,+1\}^4$ — binary code: $4$ bits instead of $4 \times 32 = 128$ float bits,
- each bit stores only the sign of the projection, losing the amplitude.

**Step 3. Decoding** $Q_{\mathrm{qjl}}^{-1}(z) = \sqrt{\pi/2}\cdot(1/d)\cdot S^\top z$:

$$
S^\top z = \begin{pmatrix}
1.2(-1) + (-0.4)(+1) + 0.8(+1) + (-1.3)(-1) \\
(-0.8)(-1) + 1.5(+1) + 0.2(+1) + 0.6(-1) \\
0.5(-1) + (-0.6)(+1) + 1.1(+1) + (-0.4)(-1) \\
1.0(-1) + 0.3(+1) + (-0.7)(+1) + 0.9(-1)
\end{pmatrix}
= \begin{pmatrix} \phantom{-}0.5 \\ \phantom{-}1.9 \\ \phantom{-}0.4 \\ -2.3 \end{pmatrix}
$$

$$
Q_{\mathrm{qjl}}^{-1}(z) = \sqrt{\frac{\pi}{2}}\cdot\frac{1}{4}\begin{pmatrix} 0.5 \\ 1.9 \\ 0.4 \\ -2.3 \end{pmatrix}
\approx 1.2533 \cdot 0.25 \begin{pmatrix} 0.5 \\ 1.9 \\ 0.4 \\ -2.3 \end{pmatrix}
\approx \begin{pmatrix} \phantom{-}0.157 \\ \phantom{-}0.595 \\ \phantom{-}0.125 \\ -0.721 \end{pmatrix}
$$

Where:

- $\sqrt{\pi/2} \approx 1.2533$ — normalization coefficient for unbiasedness,
- $1/d = 1/4$ — normalization by dimensionality.

**Step 4. Checking the dot product with query $y = (0.6,\; -0.4,\; 0.5,\; 0.5)$:

$$
\langle y,\, x \rangle = 0.6(0.70) - 0.4(0.50) + 0.5(-0.30) + 0.5(-0.40) = 0.42 - 0.20 - 0.15 - 0.20 = -0.13.
$$

$$
\langle y,\, Q_{\mathrm{qjl}}^{-1}(z) \rangle = 0.6(0.157) - 0.4(0.595) + 0.5(0.125) + 0.5(-0.721) \approx -0.44.
$$

Where:

- $-0.13$ — true dot product,
- $-0.44$ — estimate from a single QJL run. The error $0.31$ is large at $d=4$,
- when averaged over many random matrices $S$, the estimate converges to $-0.13$.

**Why the constant $\sqrt{\pi/2}$ ensures unbiasedness.** For $s \sim \mathcal{N}(0,1)$:

$$
\mathbb{E}[|s|] = \sqrt{\frac{2}{\pi}} \approx 0.798.
$$

Taking $\operatorname{sign}(s)$ "removes" the amplitude, replacing $s$ with $\pm 1$. The reverse multiplication $S^\top z$ introduces a systematic underestimate by a factor of $\sqrt{2/\pi}$. The coefficient $\sqrt{\pi/2}$ compensates for it:

$$
\sqrt{\frac{\pi}{2}}\cdot\sqrt{\frac{2}{\pi}} = 1 \quad \Longrightarrow \quad \mathbb{E}_S\!\left[\langle y,\, Q_{\mathrm{qjl}}^{-1}(Q_{\mathrm{qjl}}(x))\rangle\right] = \langle y,\, x \rangle.
$$

Summary: with a single run the variance is high, but the estimate is unbiased — which is precisely why QJL is used as a correction layer rather than as a full quantizer.

Visualization of QJL steps: sign encoding, decoding, and inner product reconstruction:

![Figure 07](/warp-zone-folio/blog/turboquant/Figure-07.png)

### TurboQuant-mse Algorithm

The first version of the method optimizes the reconstruction error:

$$
D_{\mathrm{mse}} \lesssim \sqrt{\frac{3\pi}{2}}\cdot 4^{-b}.
$$

Where:

- $D_{\mathrm{mse}}$ — average reconstruction error,
- $b$ — number of bits per coordinate,
- $4^{-b}$ — exponential law of error decay,
- $\sqrt{\frac{3\pi}{2}}$ — constant factor of the upper bound,
- $\lesssim$ — upper bound up to a constant factor.

Algorithm idea:

1. Randomly rotate the vector using an orthogonal matrix.
2. Quantize each coordinate using the optimal scalar quantizer.
3. Assemble the quantized vector back.
4. Apply the inverse rotation.

This is nearly optimal for MSE, but does not guarantee unbiased inner products.

Short examples from the paper:

- at $b=1$ distortion is around `0.36`,
- at $b=2$ around `0.117`,
- at $b=3$ around `0.03`,
- at $b=4$ around `0.009`.

Conclusion: reconstruction improves very quickly, but for attention/retrieval this version alone may be insufficient due to bias.

### TurboQuant-prod Algorithm

The second version is needed for tasks where dot products matter. First an MSE approximation is constructed, then the remaining quantization error (residual) is encoded:

$$
r = x - \tilde x_{\mathrm{mse}}.
$$

Where:

- $r$ — residual remaining after the MSE stage,
- $x$ — original vector,
- $\tilde x_{\mathrm{mse}}$ — reconstruction after `TurboQuant-mse`.

At this level the paper achieves unbiasedness:

$$
\mathbb{E}\langle y,\tilde x\rangle=\langle y,x\rangle.
$$

Where:

- $\mathbb{E}$ — expectation over the algorithm's randomness,
- $y$ — query vector,
- $\tilde x$ — final reconstruction after `TurboQuant-prod`,
- $x$ — original vector,
- $\langle y,\tilde x\rangle$ — inner product estimate after quantization,
- $\langle y,x\rangle$ — true inner product.

Asymptotically, the distortion for the inner product is of the order

$$
D_{\mathrm{prod}} \lesssim \frac{\|y\|_2^2}{d}4^{-b}.
$$

Where:

- $D_{\mathrm{prod}}$ — inner product error,
- $\|y\|_2^2$ — squared norm of the query vector,
- $d$ — dimensionality,
- $b$ — number of bits per coordinate,
- $4^{-b}$ — exponential decay with bit depth,
- $\lesssim$ — upper bound in terms of order.

Short examples:

- at $b=1$ error of order `1.57/d`,
- at $b=2$ of order `0.56/d`,
- at $b=3$ of order `0.18/d`,
- at $b=4$ of order `0.047/d`.

Practical implication: `TurboQuant-prod` is better suited for retrieval, KV cache, and attention because it introduces no systematic bias in the value.

### Near-Optimality

The main theoretical contribution of the paper is that the lower and upper bounds coincide in terms of the dependence on $b$. This means near-optimality of the algorithm:

- for MSE the algorithm decays as $4^{-b}$,
- for inner product the same exponential law is preserved, supplemented by the factor $\|y\|_2^2/d$,
- the gap remains only in the constants.

This is exactly why the paper looks not like yet another heuristic tailored to a specific benchmark, but like a strong universal scheme.

### Experimental Results

### 1. Empirical Validation

On embeddings from DBpedia and OpenAI the paper shows:

- `TurboQuantmse` performs better in terms of MSE,
- `TurboQuantprod` remains unbiased with respect to inner product,
- observed errors are close to theoretical estimates.

### 2. KV Cache and LongBench

On Needle-In-A-Haystack and LongBench-E the paper shows that the method provides strong memory compression without serious quality loss.

Example for fractional effective bit-width:

$$
\frac{32\cdot 3 + 96\cdot 2}{128}=2.5.
$$

Where:

- $32$ — number of outlier channels,
- $3$ — number of bits for outlier channels,
- $96$ — number of regular channels,
- $2$ — number of bits for regular channels,
- $128$ — total number of channels,
- $2.5$ — average effective bit-width per channel.

Practical conclusions:

- at compression ratio `0.25` in Needle-In-A-Haystack quality remains at the full precision level,
- mode `3.5 bits` is nearly neutral in terms of quality,
- mode `2.5 bits` introduces small but controlled degradation.

### 3. Nearest Neighbor Search

On GloVe and OpenAI3 embeddings the paper shows:

- better recall compared to `PQ` and `RabitQ`,
- near-zero index quantization time,
- particularly strong behavior in online indexing, where codebooks cannot be retrained each time.

Key practical point: at dimensionalities `d=1536` and `d=3072` TurboQuant combines good recall with radically cheaper index preparation.

### Key Takeaways

`TurboQuant` is strong not because of any single heuristic, but because of a fortunate combination of three ideas:

1. random rotation eliminates the unfavorable input geometry,
2. scalar quantization provides near-optimal MSE reconstruction,
3. QJL corrects the inner product bias at almost no bit budget cost.

If the task is fast online quantization without training on a dataset, with theoretical guarantees and strong practical performance on retrieval/LLM inference, then the paper presents a very compelling design.

### Source

- Paper: [TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate](https://arxiv.org/abs/2504.19874)
