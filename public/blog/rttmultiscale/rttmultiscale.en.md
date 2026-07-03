# Riemannian-Token-Transformer-Multi-Scale: decoding imagined speech from EEG through SPD tokens

---

## 1. Why this class of models is needed at all

### What is under the hood?

Riemannian-Token-Transformer-Multi-Scale, or **RTTMultiScale** for short, is a pipeline for classifying **imagined speech** from non-invasive EEG. Its task is not to immediately reconstruct arbitrary text from the brain, but to build a reproducible baseline: take an EEG segment from the imagined speech phase and assign it to one of a fixed set of semantic meta-classes.

The main idea of the model is that the raw EEG signal is not fed directly into the Transformer. First, the signal is converted into a sequence of **SPD tokens**: each token describes inter-channel dependencies inside a short time window through a covariance/correlation matrix. Only after that are tokens from different temporal scales aggregated by a TransformerEncoder.

In other words, the model does not answer the question:

> *what text is the person mentally saying right now?*

but a more limited and methodologically controlled question:

> *which of the 8 predefined semantic classes does the current EEG segment of imagined speech correspond to?*

This limitation is exactly what makes the setup honest: at the current stage this is **closed-vocabulary EEG classification**, not full EEG-to-text.

---

## Formal Setup

Suppose there is a dataset of EEG trials:

$$
\mathcal{D} = \{(X_i, y_i, s_i)\}_{i=1}^{N}.
$$

Where:

- $X_i \in \mathbb{R}^{C \times T}$ is one EEG segment;
- $C$ is the number of active channels after excluding specified channels;
- $T$ is the length of the temporal segment;
- $y_i \in \{0,\dots,7\}$ is the label of one of the 8 meta-classes;
- $s_i$ is the subject identifier;
- $N$ is the number of trials.

In the current implementation, after excluding one channel, the input has the shape:

$$
X_i \in \mathbb{R}^{124 \times 1651}.
$$

The model implements the mapping:

$$
f_\theta : \mathbb{R}^{124 \times 1651} \rightarrow \mathbb{R}^{8},
$$

where the output is a vector of logits:

$$
z_i = f_\theta(X_i) = (z_{i,1}, z_{i,2}, \dots, z_{i,8}).
$$

The final class is determined as:

$$
\hat y_i = \arg\max_k z_{i,k}.
$$

---

## Visual Interpretation

![Figure 01](/warp-zone-folio/blog/rttmultiscale/Infographic/EN/Figure-01.png)

If simplified, the whole pipeline can be represented as follows:

```text
EEG segment
-> inter-channel geometry in windows
-> SPD tokens
-> Transformer over the token sequence
-> 8 meta-class logits
```

This is important because EEG is not an ordinary textual or visual signal. Here, informative content may reside not only in the amplitude of individual channels, but also in the structure of dependencies between channels. The SPD representation is precisely an attempt to describe this structure.

---

## 2. What exactly the model solves and what it does not solve

### What is under the hood?

The current setup is **8-class imagined-speech EEG classification**. The model works with a fixed dictionary of meta-classes obtained after coarsening the original 39 semantic classes of the Chisco dataset.

This is a fundamental point. The work does not solve the tasks of:

- generating arbitrary text;
- open-vocabulary decoding;
- speech synthesis;
- real-time online BCI;
- transfer to a completely new subject by default;
- processing OOD phrases outside the fixed vocabulary.

Therefore, the correct interpretation of the result is:

> RTTMultiScale is a reproducible baseline for classifying EEG segments of imagined speech into 8 semantic meta-classes.

And the incorrect interpretation is:

> the model reads thoughts and reconstructs text from EEG.

---

## Formal Boundary Definition

Suppose the original textual stimuli belong to 39 classes:

$$
\ell_i \in \{0,1,\dots,38\}.
$$

Next, a mapping is defined:

$$
g : \{0,\dots,38\} \rightarrow \{0,\dots,7\}.
$$

Then the final model label is:

$$
y_i = g(\ell_i).
$$

The model does not predict the original text $t_i$ and does not directly reconstruct the original class $\ell_i$. It predicts only the coarsened meta-class:

$$
\hat y_i \in \{0,\dots,7\}.
$$

---

## Why This Matters

In imagined-speech EEG, it is too easy to overpromise more than the experiment actually tests. If the model is trained on 8 meta-classes, then even a good result cannot be interpreted as open-vocabulary EEG-to-text.

But such a constrained setup is useful: it first allows us to check whether there is a reproducibly decodable signal above chance level, and only then move on to retrieval/open-vocabulary scenarios.

---

## 3. The Chisco Dataset and the Structure of One Trial

![Figure 02](/warp-zone-folio/blog/rttmultiscale/Infographic/RU/Figure-03.png)

### What is under the hood?

The data source is the **Chisco** dataset, dedicated to decoding imagined speech from EEG. In the experimental paradigm, the participant first reads a textual stimulus, then mentally reproduces it in a separate phase without articulation.

One trial consists of two semantic parts:

```text
reading phase             imagined speech phase
0-5 seconds               5-8.3 seconds
```

In the current pipeline, the **imagined speech** phase is used, that is, approximately the last 3.3 seconds.

After preprocessing and excluding one channel, one sample has the shape:

$$
X \in \mathbb{R}^{124 \times 1651}.
$$

Where:

- $124$ is the number of active EEG channels;
- $1651$ is the number of temporal samples;
- the sampling rate after preprocessing is $500$ Hz;
- the segment duration is approximately:

$$
\frac{1651}{500} \approx 3.302 \text{ seconds}.
$$

---

## Formal Setup

Suppose a continuous EEG recording is segmented into trials. For the $i$-th trial, the imagined-speech interval is taken:

$$
X_i = \mathrm{segment}_{\mathrm{imagine}}(\mathrm{EEG}_i).
$$

After reshaping:

$$
X_i \in \mathbb{R}^{C \times T},
\qquad C=124,\quad T=1651.
$$

If the sampling rate is $f_s=500$ Hz, the segment duration is:

$$
\Delta t = \frac{T}{f_s} = \frac{1651}{500} \approx 3.302 \text{ s}.
$$

---

## Visual Interpretation

You can think of $X$ as a table:

```text
124 channels  x  1651 temporal samples
```

Each row is the time series of one electrode. Each column is the state of all channels at a specific moment in time.

RTTMultiScale does not try to "read" this array immediately. First, it asks:

> how do the channels interact with each other inside short windows?

This very question leads to SPD matrices.

---

## 4. Why 39 Classes Are Reduced to 8 Meta-Classes

### What is under the hood?

In Chisco, the original sentences are annotated into 39 semantic types. For the current EEG task, this is too detailed a setup: there are many classes, few subjects, the signal is noisy, and imagined-speech patterns may be weakly distinguishable.

Therefore, the original classes are aggregated into 8 meta-classes:

```text
0 SOCIAL_INTERACTION
1 DAILY_LIFE
2 HEALTH_WELLNESS
3 FOOD_DINING
4 TRAVEL_TRANSPORT
5 WORK_EDUCATION
6 COMMERCE_SERVICES
7 ENTERTAINMENT_LEISURE
```

The idea is not to artificially simplify the task to a meaningless level, but to obtain a statistically more stable baseline setup.

---

## Formal Setup

Original class:

$$
\ell \in \{0,\dots,38\}.
$$

Meta-class:

$$
y \in \{0,\dots,7\}.
$$

Mapping:

$$
y = g(\ell).
$$

If 39 classes are distributed across 8 meta-classes on average, then each meta-class contains approximately:

$$
\frac{39}{8} \approx 4.875
$$

original classes.

---

## Why This Matters

Reducing the number of classes has several effects:

1. more examples for each final class;
2. lower risk of empty or nearly empty classes in folds;
3. more stable macro-F1 and balanced accuracy;
4. the setup becomes closer to a limited-vocabulary BCI interface.

But there is also a risk: semantically heterogeneous original categories may end up inside one meta-class. Then some errors will be caused not only by the model, but also by the $39 \rightarrow 8$ scheme itself.

---

## 5. Why SPD Representations Are Used Here

![Figure 03](/warp-zone-folio/blog/rttmultiscale/Infographic/EN/Figure-02.png)

### What is under the hood?

SPD means **Symmetric Positive-Definite**, that is, a symmetric positive-definite matrix. In this project, the final SPD representation of a token in the baseline pipeline arises as a **correlation matrix of inter-channel dependencies**, built from an **OAS-regularized covariance matrix** inside a short EEG window.

In other words, covariance here is an intermediate stabilized step, while the model receives the already formed correlation SPD matrix.

If we take a short EEG window:

$$
Z \in \mathbb{R}^{d_c \times L},
$$

where $d_c=24$ is the number of channels after projection and $L$ is the window length, then a regularized covariance matrix is first estimated:

First, the signal is centered over time:

$$
\widetilde{Z}
=

Z - \bar{Z},
$$

where $\bar{Z}$ is the mean value of each channel inside the window.

Then the sample covariance matrix is computed:

$$
S
=

\frac{1}{L-1}
\widetilde{Z}\widetilde{Z}^{\top}.
$$

Where:

* $S \in \mathbb{R}^{24 \times 24}$ is the sample covariance of the channels;
* $S_{ij}$ shows how coherently channels $i$ and $j$ changed inside the window;
* diagonal elements $S_{ii}$ correspond to the variances of individual channels.

The problem is that on a short window such covariance can be noisy and poorly conditioned. Therefore OAS shrinkage is used: the sample covariance is mixed with a more stable target matrix of the form $\mu I$:

$$
\Sigma_{\mathrm{OAS}}
=

(1-\alpha)S
+
\alpha \mu I.
$$

Where:

* $\Sigma_{\mathrm{OAS}}$ is the regularized covariance matrix;
* $S$ is the sample covariance;
* $I$ is the identity matrix;
* $\mu$ is the average variance across channels;
* $\alpha \in [0,1]$ is the shrinkage coefficient.

The average variance is computed as:

$$
\mu
=

\frac{\operatorname{tr}(S)}{d_c}.
$$

Where:

* $\operatorname{tr}(S)$ is the trace of the covariance matrix, that is, the sum of variances across channels;
* $d_c=24$ is the number of channels after projection.

Intuitively, OAS does the following:

$$
\text{noisy covariance}
\quad \longrightarrow \quad
\text{more stable SPD covariance}.
$$

If $\alpha=0$, ordinary sample covariance remains:

$$
\Sigma_{\mathrm{OAS}} = S.
$$

If $\alpha=1$, covariance is completely replaced by an isotropic matrix:

$$
\Sigma_{\mathrm{OAS}} = \mu I.
$$

In the project implementation, the coefficient $\alpha$ is computed analytically from the statistics of the matrix $S$ and is additionally lower-bounded:

$$
\alpha \ge 0.1.
$$

This means that even if the sample covariance looks stable enough, a minimum amount of regularization is still added to it. This technique improves the numerical stability of SPD representations on short EEG windows.

It is then normalized into a correlation matrix:

$$
R_{ij}
=

\frac{
(\Sigma_{\mathrm{OAS}})*{ij}
}{
\sqrt{
(\Sigma*{\mathrm{OAS}})*{ii}
(\Sigma*{\mathrm{OAS}})_{jj}
}
}.
$$

This matrix

$$
R \in \mathbb{R}^{24 \times 24}
$$

is used as the SPD representation of inter-channel dependencies before the Log-Euclidean mapping.

Such a matrix shows not merely channel amplitudes, but the structure of their joint variation: which channels change coherently, which change oppositely, and which are almost independent of one another.

---

## Formal Setup

A matrix $A \in \mathbb{R}^{d \times d}$ is SPD if two conditions hold:

$$
A = A^\top,
$$

and for any nonzero vector $v \in \mathbb{R}^{d}$:

$$
v^\top A v > 0.
$$

The set of such matrices is denoted:

$$
\mathcal{S}_{++}^{d}.
$$

In the project, after channel projection:

$$
d = 24.
$$

First, an OAS-regularized covariance is constructed:

$$
\Sigma_{\mathrm{OAS}} \in \mathcal{S}_{++}^{24},
$$

and then a correlation SPD matrix is obtained from it:

$$
R_{\mathrm{corr}} \in \mathcal{S}_{++}^{24}.
$$

In baseline mode, it is precisely

$$
R_{\mathrm{corr}}
$$

that is fed into the Log-Euclidean mapping:

$$
S = \log(R_{\mathrm{corr}}),
$$

after which the upper triangle of the matrix $S$ is vectorized and turned into a token for the Transformer.

---

## Visual Interpretation

If a raw EEG segment is "how each electrode changed over time", then the SPD representation is "how the electrodes changed jointly".

That is, we move from a temporal description:

```text
channel 1: wave
channel 2: wave
...
channel 124: wave
```

to a geometric description:

```text
channel 1 is connected to channel 2 like this
channel 1 is connected to channel 3 like this
...
```

An important detail: the current baseline uses not absolute channel covariance, but the correlation form. This reduces the dependence of features on the amplitude scale of individual channels and makes the representation more robust to inter-subject and inter-channel amplitude shifts.

This is especially useful for EEG, where spatial-channel structure is often more important than individual instantaneous amplitudes.

---

## 6. Channel Projection: Why 124 Channels Are Compressed to 24

### What is under the hood?

Before constructing SPD matrices, the model reduces the number of channels:

$$
124 \rightarrow 24.
$$

This is done with a trainable linear projection without bias. In code, this corresponds to `channel_proj`.

The main reason is computational and statistical stability. The SPD matrix for (n) channels has size:

$$
n \times n.
$$

But since an SPD matrix is symmetric, the following holds:

$$
A_{ij} = A_{ji}.
$$

This means that the lower and upper triangles of the matrix duplicate each other. Therefore, after the Log-Euclidean mapping, not the entire matrix is vectorized, but only the upper triangle, including the diagonal.

The number of elements in the upper triangle of a symmetric matrix of size $(n \times n)$ is:

$$
\frac{n(n+1)}{2}.
$$

Where:

* (n) is the number of channels;
* (n+1) appears from the formula for the sum $(1 + 2 + \dots + n)$;
* division by (2) arises because a symmetric matrix contains duplicated pairs $(A_{ij})$ and $(A_{ji})$.

If the SPD matrix were built directly on 124 channels, the dimensionality of the SPD vector would be:

$$
\frac{124 \cdot (124+1)}{2}
=
\frac{124 \cdot 125}{2}
=
7750.
$$

After projection to 24 channels, the dimensionality of the SPD vector becomes:

$$
\frac{24 \cdot (24+1)}{2}
=
\frac{24 \cdot 25}{2}
=
300.
$$

The difference is enormous: 7750 features versus 300 features per window.


---

## Formal Setup

Let the input signal be:

$$
X \in \mathbb{R}^{124 \times T}.
$$

The linear channel projection is defined by the matrix:

$$
W_c \in \mathbb{R}^{24 \times 124}.
$$

Then the projected signal is:

$$
Z = W_c X,
\qquad Z \in \mathbb{R}^{24 \times T}.
$$

After that, all covariance operations are already performed in the 24-dimensional channel space.

---

## Why This Matters

Channel projection does three things:

1. reduces the size of SPD matrices;
2. reduces the number of parameters in `Linear(300 -> 128)`;
3. allows the model to learnably mix the original electrodes before the Riemannian block.

This is not simply channel downsampling. It is a trainable transformation of the channel space that adapts to the classification task.

---

## 7. Two-Scale Window Tokenization

![Figure 04](/warp-zone-folio/blog/rttmultiscale/Infographic/EN/Figure-03.png)

### What is under the hood?

RTTMultiScale builds tokens not with a single window size, but with two:

```text
small scale: window = 128, stride = 96
large scale: window = 256, stride = 128
```

At $T=1651$, this gives:

```text
16 small windows
11 large windows
27 SPD tokens in total
```

Small windows provide more local temporal resolution, while large windows provide a smoother and longer description of inter-channel structure.

---

## Formal Setup

The number of windows for signal length $T$, window size $w$, and stride $s$ is:

$$
N_{\mathrm{win}} = 1 + \left\lfloor \frac{T-w}{s} \right\rfloor.
$$

For the small scale:

$$
N_s = 1 + \left\lfloor \frac{1651-128}{96} \right\rfloor
= 1 + \left\lfloor 15.864... \right\rfloor
= 16.
$$

For the large scale:

$$
N_l = 1 + \left\lfloor \frac{1651-256}{128} \right\rfloor
= 1 + \left\lfloor 10.898... \right\rfloor
= 11.
$$

In total:

$$
N = N_s + N_l = 16 + 11 = 27.
$$

After adding `[CLS]`, the Transformer sequence length becomes:

$$
N_{\mathrm{seq}} = 27 + 1 = 28.
$$

---

## Visual Interpretation

You can imagine that the model looks at the same EEG segment through two "magnifying glasses":

```text
short magnifying glass: 0.256 seconds
long magnifying glass:  0.512 seconds
```

Since the sampling rate is 500 Hz:

$$
\frac{128}{500}=0.256 \text{ s},
\qquad
\frac{256}{500}=0.512 \text{ s}.
$$

Small windows capture faster changes, while large ones capture more stable context.

---

## 8. OAS Covariance: Why Shrinkage Covariance Is Needed

![Figure 06](/warp-zone-folio/blog/rttmultiscale/assets/Figure-06.png)

### What is under the hood?

For each window, the channel covariance matrix must be estimated. The problem is that short EEG windows are noisy, and sample covariance can be poorly conditioned.

Therefore, **OAS covariance** is used: Oracle Approximating Shrinkage. The idea of shrinkage is simple: do not fully trust the sample covariance, and slightly pull it toward a stable diagonal structure.

---

## Formal Setup

Let the window after channel projection be:

$$
Z \in \mathbb{R}^{24 \times L}.
$$

First, we center over time:

$$
\bar Z = Z - \mathrm{mean}_t(Z).
$$

Sample covariance:

$$
\hat \Sigma = \frac{1}{L-1}\bar Z \bar Z^\top.
$$

OAS shrinkage defines the regularized covariance:

$$
\Sigma_{\mathrm{OAS}}
=
(1-\alpha)\hat\Sigma + \alpha \mu I.
$$

Where:

- $\alpha \in [0,1]$ is the shrinkage coefficient;
- $\mu$ is the mean value of the covariance diagonal;
- $I$ is the identity matrix.

---

## Intuition

If $\alpha=0$, we fully trust the sample covariance:

$$
\Sigma_{\mathrm{OAS}} = \hat\Sigma.
$$

If $\alpha=1$, we fully replace covariance with a spherical diagonal matrix:

$$
\Sigma_{\mathrm{OAS}} = \mu I.
$$

In practice, an intermediate value is used: the data structure is preserved, but the matrix becomes more numerically stable.

---

## 9. Correlation SPD Matrix: Why Covariance Is Converted into Correlation

![Figure 07](/warp-zone-folio/blog/rttmultiscale/assets/Figure-07.png)

### What is under the hood?

Covariance depends on the amplitude scale of the channels. For EEG, this is risky: different subjects, different electrodes, and different contact quality can change amplitude without necessarily changing the semantic structure of the signal.

Therefore, in default mode, covariance is converted into a correlation matrix:

$$
R = D^{-1/2}\Sigma D^{-1/2}.
$$

This way, the model focuses on relative inter-channel relationships rather than the absolute scale of the channels.

---

## Formal Setup

Let:

$$
D = \mathrm{diag}(\Sigma).
$$

Then an element of the correlation matrix is:

$$
R_{ij} = \frac{\Sigma_{ij}}{\sqrt{\Sigma_{ii}\Sigma_{jj}}}.
$$

In matrix form:

$$
R = D^{-1/2}\Sigma D^{-1/2}.
$$

If $\Sigma$ is positive definite and the diagonal is positive, then $R$ also preserves the SPD structure after numerical stabilization.

---

## Visual Interpretation

Covariance answers the question:

> how much do two channels change jointly in absolute units?

Correlation answers the question:

> how much do two channels change jointly after scale normalization?

For a multi-subject EEG task, the second question is usually more robust.

---

## 10. Log-Euclidean Map: Why Take the Matrix Logarithm

![Figure 08](/warp-zone-folio/blog/rttmultiscale/assets/Figure-08.png)

### What is under the hood?

SPD matrices do not live in an ordinary Euclidean space, but on the manifold of positive-definite matrices. If we simply vectorize an SPD matrix, we ignore its geometry.

The Log-Euclidean map solves this as follows: the matrix is mapped from the SPD manifold into a tangent Euclidean space through the matrix logarithm:

$$
S = \log(R).
$$

After that, $S$ can be vectorized and fed into an ordinary neural network.

---

## Formal Setup

For an SPD matrix $R$, a spectral decomposition exists:

$$
R = U\Lambda U^\top,
$$

where:

- $U$ is an orthonormal matrix of eigenvectors;
- $\Lambda = \mathrm{diag}(\lambda_1,\dots,\lambda_d)$ contains positive eigenvalues.

The matrix logarithm is:

$$
\log(R) = U \log(\Lambda) U^\top.
$$

Where:

$$
\log(\Lambda) = \mathrm{diag}(\log\lambda_1,\dots,\log\lambda_d).
$$

In the current pipeline:

$$
R \in \mathbb{R}^{24\times24},
\qquad
S = \log(R) \in \mathbb{R}^{24\times24}.
$$

---

## Geometric Interpretation

The SPD manifold can be imagined as a curved surface. On this surface, ordinary linear operations cannot be applied thoughtlessly in the same way as in $\mathbb{R}^d$.

The Log-Euclidean map performs a local "straightening":

```text
SPD matrix on curved manifold
-> matrix logarithm
-> symmetric matrix in Euclidean tangent-like space
```

After that, the features become more convenient for linear projection and Transformer aggregation.

---

## 11. Vectorization of the Upper Triangle

![Figure 09](/warp-zone-folio/blog/rttmultiscale/assets/Figure-09.png)

### What is under the hood?

After the Log-Euclidean map, a symmetric matrix is obtained:

$$
S \in \mathbb{R}^{24\times24}.
$$

Since $S=S^\top$, storing the entire matrix is redundant. It is enough to take the upper triangle with the diagonal.

Number of elements:

$$
\frac{24(24+1)}{2}=300.
$$

This is why the architecture uses the projection:

```text
Linear(300 -> 128)
```

---

## Formal Setup

Define the upper-triangle vectorization operator:

$$
\mathrm{vec}_{\Delta}(S)
=
(S_{11}, S_{12}, \dots, S_{1d}, S_{22}, S_{23}, \dots, S_{dd}).
$$

Then:

$$
v = \mathrm{vec}_{\Delta}(S)
\in \mathbb{R}^{d(d+1)/2}.
$$

At $d=24$:

$$
v \in \mathbb{R}^{300}.
$$

Next, the token is obtained by a linear projection:

$$
t = W_f v + b_f,
\qquad t \in \mathbb{R}^{128}.
$$

---

## Visual Interpretation

One SPD token is a compressed description of the inter-channel geometry of one window:

```text
EEG window
-> 24x24 SPD/correlation matrix
-> log matrix
-> 300 numbers from the upper triangle
-> 128-dimensional token
```

Thus, each temporal fragment is converted into an object resembling a token embedding in NLP.

---

## 12. One SPD Token Step by Step

### What is under the hood?

The complete chain for constructing one token looks like this:

```text
EEG window
-> channel projection
-> OAS covariance
-> correlation matrix
-> Log-Euclidean map
-> upper-triangle vectorization
-> Linear(300 -> 128)
-> SPD token
```

This is the central feature extractor of the entire architecture.

---

## Formal Chain

Let a window of the original signal be:

$$
X_{[a:b]} \in \mathbb{R}^{124 \times L}.
$$

1. Channel projection:

$$
Z = W_c X_{[a:b]},
\qquad Z \in \mathbb{R}^{24 \times L}.
$$

2. OAS covariance:

$$
\Sigma = \mathrm{OAS}(Z),
\qquad \Sigma \in \mathbb{R}^{24\times24}.
$$

3. Correlation normalization:

$$
R = D^{-1/2}\Sigma D^{-1/2}.
$$

4. Log-Euclidean map:

$$
S = \log(R).
$$

5. Vectorization:

$$
v = \mathrm{vec}_{\Delta}(S) \in \mathbb{R}^{300}.
$$

6. Token projection:

$$
t = W_f v + b_f \in \mathbb{R}^{128}.
$$

---

## Dimensionality Example

For a small window:

```text
[124 x 128]
-> [24 x 128]
-> [24 x 24]
-> [24 x 24]
-> [300]
-> [128]
```

For a large window:

```text
[124 x 256]
-> [24 x 256]
-> [24 x 24]
-> [24 x 24]
-> [300]
-> [128]
```

The token size is the same: 128. Only the temporal duration of the window from which it is built differs.

---

## 13. Overall RTTMultiScale Architecture

![Figure 10](/warp-zone-folio/blog/rttmultiscale/assets/Figure-10.png)

### What is under the hood?

After constructing 27 SPD tokens, the model adds:

1. **scale embeddings** to distinguish small and large windows;
2. a **[CLS] token** as a global summary token;
3. **sinusoidal positional encoding** as information about the token position;
4. a **TransformerEncoder** for contextual token aggregation;
5. **attention pooling** as additional weighted token reduction;
6. **subject embedding** for soft personalization of a known subject in SI mode;
7. an **MLP head** for classification into 8 meta-classes.

---

## Formal Setup

Suppose that after two-scale tokenization we have obtained the sequence:

$$
T = (t_1, t_2, \dots, t_{27}),
\qquad t_i \in \mathbb{R}^{128}.
$$

A scale embedding is added to each token:

$$
\tilde t_i = t_i + e_{\mathrm{scale}(i)}.
$$

Then `[CLS]` is added:

$$
Q = ([CLS], \tilde t_1, \dots, \tilde t_{27}).
$$

After positional encoding:

$$
H = \mathrm{TransformerEncoder}(Q + PE).
$$

Where:

$$
H \in \mathbb{R}^{28 \times 128}.
$$

The global `[CLS]` representation:

$$
h_{\mathrm{cls}} = H_0 \in \mathbb{R}^{128}.
$$

Attention pooling over the remaining tokens:

$$
h_{\mathrm{pool}} = \sum_{i=1}^{27} \alpha_i H_i,
\qquad h_{\mathrm{pool}} \in \mathbb{R}^{128}.
$$

In SI mode, subject embedding is added:

$$
e_s \in \mathbb{R}^{16}.
$$

The final representation:

$$
h = [h_{\mathrm{cls}}; h_{\mathrm{pool}}; e_s] \in \mathbb{R}^{272}.
$$

In SD mode, subject embedding is disabled:

$$
h = [h_{\mathrm{cls}}; h_{\mathrm{pool}}] \in \mathbb{R}^{256}.
$$

Classifier:

$$
z = \mathrm{MLP}(h) \in \mathbb{R}^{8}.
$$

---

## Architectural Details

Current configuration:

```text
n_classes = 8
proj_channels = 24
small window = 128, stride = 96
large window = 256, stride = 128
spd_vec_dim = 300
d_model = 128
n_layers = 2
n_heads = 4
ff_dim = 256
dropout = 0.1
subject_embed_dim = 16
```

The Transformer here does not work with a long sequence of 1651 temporal samples. It works with only 28 tokens:

```text
1 CLS + 16 small SPD tokens + 11 large SPD tokens = 28 tokens
```

This makes the architecture compact.

---

## 14. [CLS] — a Trainable Global Token Aggregator

![Figure 11](/warp-zone-folio/blog/rttmultiscale/assets/Figure-11.png)

In the current project, `[CLS]` is a **trainable global token aggregator** that is added to the beginning of the SPD-token sequence before the `TransformerEncoder`, then after the encoder it is taken as `h[:, 0]` and used as one of the two global summaries of the EEG example. Importantly, the model **does not classify using only `[CLS]`**: it combines `[CLS]` with separate `attention pooling` over the remaining tokens. The code explicitly does `combined = torch.cat([h_cls, h_attn], dim=-1)`.

### 1. Where `[CLS]` Comes From

In `RTTMultiScale.__init__`, it is created as a model parameter:

```python
self.cls_token = nn.Parameter(torch.zeros(1, 1, d_model))
```

At initialization, it is assigned a normal distribution with standard deviation `0.02`. That is, it is not a computed EEG feature, but a **learnable vector** that the model tunes by itself during training.

In the current config, `d_model = 128`, so one `[CLS]` vector has dimensionality:

```text
[CLS] ∈ R^128
```

### 2. How It Is Added to SPD Tokens

In `forward()`, tokens from the two scales are built first:

```python
t_s = self._tokens_for_scale(x, self.ws_s, self.st_s, 0)
t_l = self._tokens_for_scale(x, self.ws_l, self.st_l, 1)
tokens = torch.cat([t_s, t_l], dim=1)
```

That is, the sequence has the form:

```text
tokens = [small_1, small_2, ..., small_Ls, large_1, large_2, ..., large_Ll]
```

Then `[CLS]` is expanded for the batch:

```python
cls = self.cls_token.expand(x.size(0), -1, -1)
```

and placed **at the very beginning**:

```python
seq = self.pos_enc(torch.cat([cls, tokens], dim=1))
```

After that, the input to the Transformer looks like this:

```text
seq = [
  CLS,
  small_window_token_1,
  small_window_token_2,
  ...,
  large_window_token_1,
  large_window_token_2,
  ...
]
```

With the current windows from the config:

```text
small window = 128, stride = 96
large window = 256, stride = 128
```

and for EEG length `T = 1651`, we get:

```text
16 small tokens + 11 large tokens = 27 SPD tokens
```

So the real Transformer sequence is usually:

```text
[CLS] + 27 SPD tokens = 28 tokens
```

### 3. What Happens to `[CLS]` Inside the TransformerEncoder

After adding positional encoding, the whole sequence passes through:

```python
h = self.encoder(seq)
```

`TransformerEncoder` performs self-attention between all tokens. Therefore, at each layer, `[CLS]` can "look" at:

```text
small SPD tokens,
large SPD tokens,
their temporal positions,
their scale embeddings,
and itself.
```

In other words, `[CLS]` works as a **trainable memory slot** that gradually gathers information from the whole sequence through self-attention.

Intuitively:

```text
before Transformer:
CLS = empty trainable query/container

after the 1st layer:
CLS ≈ primary mixture of important SPD tokens

after the 2nd layer:
CLS ≈ more contextual global summary of the whole EEG example
```

In the current config, `n_layers = 2`, `n_heads = 4`, so `[CLS]` passes through two Transformer blocks with four-head self-attention.

### 4. Why `[CLS]` Becomes a Global Summary

Because it stands in the shared sequence and participates in self-attention on equal terms with the other tokens.

In simplified form, one Transformer layer can be represented as:

```text
CLS_new = CLS_old + Attention(query=CLS, keys=all_tokens, values=all_tokens)
```

That is, `[CLS]` uses its current state as a query and selects which SPD tokens are important as values.

If some SPD token encodes an important correlation structure of EEG channels in a certain time window, `[CLS]` can receive information from it through attention. If the large scale provides a stable low-frequency structure, and the small scale provides local dynamics, `[CLS]` can mix both sources.

Important: `[CLS]` is **not the arithmetic mean of tokens**. It is a trainable nonlinear aggregation that depends on attention patterns, TransformerEncoder weights, and the final loss function.

### 5. What Exactly `[CLS]` Stores in This Model

In this project, `[CLS]` can potentially encode:

```text
global pattern of EEG functional connectivity;
relationships between small and large windows;
information about the temporal structure of the sequence;
discriminative features for 8 meta-classes;
context obtained through Transformer self-attention.
```

But there is a subtle point: subject embedding is added **after** the TransformerEncoder, already at the classifier level:

```python
combined = torch.cat([h_cls, h_attn], dim=-1)

if self.use_subject_embed:
    subject_emb = self._lookup_subject_embeddings(subject_ids)
    combined = torch.cat([combined, subject_emb], dim=-1)
```

Therefore, `[CLS]` itself **does not know subject_id directly**. Subject information does not participate in self-attention inside the Transformer; it is added only to the final feature vector before the MLP classifier.

### 6. How `[CLS]` Differs from `attention pooling`

This is a very important point.

After the encoder, the code does:

```python
h_cls = h[:, 0]
toks = h[:, 1:]
```

That is:

```text
h_cls = processed CLS vector
toks = processed SPD tokens without CLS
```

Then attention pooling is computed separately:

```python
scores = self.attn_pool_W(toks)
weights_tok = torch.softmax(scores, dim=1)
h_heads = torch.einsum('blh,bld->bhd', weights_tok, toks)
head_alpha = torch.softmax(self.head_weights, dim=0)
h_attn = torch.einsum('h,bhd->bd', head_alpha, h_heads)
```

Thus, the model obtains **two global summaries**:

```text
h_cls  — global summary formed inside Transformer self-attention;
h_attn — explicit weighted sum of processed SPD tokens.
```

Then they are concatenated:

```text
combined = [h_cls ; h_attn]
```

If `d_model = 128`, then:

```text
h_cls  ∈ R^128
h_attn ∈ R^128

combined without subject embedding ∈ R^256
combined with subject embedding  ∈ R^(256 + 16) = R^272
```

Since the config has `use_subject_embed = True` and `subject_embed_dim = 16`, the standard SI variant uses classifier input dimensionality `272`. ([GitHub][2])

### 7. Why I Kept Both `[CLS]` and Attention Pooling

This is architecturally reasonable.

`[CLS]` is good because it learns to be a **global contextual summary** inside the Transformer. It can account for complex interactions between windows:

```text
"this small token is important only together with that large token"
"the pattern in the early segment resembles the pattern in the late segment"
"large-scale context strengthens a local feature"
```

And `attention pooling` is good because it explicitly builds a **weighted sum of tokens after the encoder**. This is a more direct mechanism:

```text
which specific SPD tokens have a stronger influence on the final decision
```

That is, `[CLS]` is an implicit/global contextual summary, while `attention pooling` is an explicit/token-weighted summary.

In the current model, the final classifier receives both views:

```text
Transformer CLS logic + explicit importance of individual SPD tokens
```

### 8. Geometric Intuition

You can imagine it this way:

```text
EEG signal
  ↓
27 SPD points/tokens on the Riemannian manifold after the log-map
  ↓
sequence of geometric observations
  ↓
[CLS] as a "virtual observer"
```

Each SPD token says:

```text
"in this time window, the correlation structure between EEG channels is like this"
```

And after the TransformerEncoder, `[CLS]` becomes something like:

```text
"a generalized picture of what type of imagined speech/intention is encoded in the whole 3.3-second EEG sequence"
```

But this is not an interpretable textual summary. It is a latent feature vector optimized for classification into 8 meta-classes.

### 9. Briefly in One Diagram

```text
SPD tokens:
  t1, t2, ..., t27 ∈ R^128

add:
  CLS ∈ R^128

obtain:
  [CLS, t1, t2, ..., t27]

TransformerEncoder:
  [h_CLS, h1, h2, ..., h27]

take:
  h_CLS = h[:, 0]

in parallel:
  h_attn = attention_pool([h1, ..., h27])

final feature:
  combined = [h_CLS ; h_attn ; subject_embedding]

classifier:
  logits ∈ R^8
```

### Main Point

In the current project, `[CLS]` is a **trainable global token** that gathers context from all SPD tokens of two temporal scales through self-attention. After `TransformerEncoder`, it becomes a compact 128-dimensional representation of the entire EEG example. But the model does not rely only on it: it additionally builds `attention pooling` over ordinary SPD tokens and feeds the concatenation into the classifier:

```text
[CLS-summary ; attention-pooled-summary ; optional subject embedding]
```

This is why the current architecture uses `[CLS]` not as the only source of the decision, but as one of two complementary global summaries.

---

## 15. Attention Pooling: Why a Second Summary Besides CLS Is Needed

### What is under the hood?

After the TransformerEncoder, the model has a `[CLS]` vector. Classical Transformer classifiers often use only it. But here **attention pooling** over SPD tokens is additionally applied.

---

## Formal Setup

Let the Transformer token outputs without `[CLS]` be:

$$
H_{1:N} = (h_1,\dots,h_N),
\qquad N=27.
$$

For each token, a score is computed:

$$
a_i = w^\top h_i.
$$

Then attention weights:

$$
\alpha_i = \frac{\exp(a_i)}{\sum_{j=1}^{N}\exp(a_j)}.
$$

And the pooled vector:

$$
h_{\mathrm{pool}} = \sum_{i=1}^{N}\alpha_i h_i.
$$

---

## Visual Interpretation

Attention pooling can be understood as the model's answer to the question:

> which time windows contain the most useful inter-channel geometry for classification?

If attention-statistics saving is enabled, this block also becomes a diagnostic tool.

---

## 16. Subject Embeddings: Soft Personalization of Known Subjects

### What is under the hood?

EEG strongly depends on the subject: anatomy, electrode contact quality, individual imagination strategy, noise level, and attention stability differ across people.

In SI mode, RTTMultiScale uses one shared model for all subjects, but adds a trainable **subject embedding**:

$$
e_s \in \mathbb{R}^{16}.
$$

This embedding is concatenated with the Transformer output before the classifier.

---

## Formal Setup

Suppose the model has obtained two summary vectors:

$$
h_{\mathrm{cls}} \in \mathbb{R}^{128},
\qquad
h_{\mathrm{pool}} \in \mathbb{R}^{128}.
$$

For subject $s$, an embedding is selected:

$$
e_s = E[s],
\qquad E \in \mathbb{R}^{S \times 16}.
$$

Where $S$ is the number of known subjects.

The final vector:

$$
h = [h_{\mathrm{cls}}; h_{\mathrm{pool}}; e_s]
\in \mathbb{R}^{272}.
$$

Classification:

$$
z = \mathrm{MLP}(h).
$$

---

## Important Limitation

Subject embedding does not mean that the model can transfer to a new subject.

If a new subject was not present in train, they do not have a trained embedding. Therefore, for a subject-held-out/LOSO protocol, a separate policy is needed:

```text
unknown_subject_policy = error | zero | mean
```

or subject embeddings must be disabled, or adaptation must be performed using a small calibration set.

<details>
<summary><strong>📌 Why SI with subject embeddings is not the same as true subject-independent transfer</strong></summary>

In the current within-subject protocol, every subject is present in both train and validation. This means that the model is evaluated on new trials of already known subjects.

This mode is correctly called:

```text
known-subject generalization
pooled personalized model
```

But it cannot be called strict transfer to a new user.

For a true subject-independent test, the following scenario is needed:

```text
train: sub-01, sub-02, sub-03, sub-04
validation/test: sub-05
```

and such a split must be repeated for each subject.

</details>

---

## 17. SI vs SD: Two Different Research Strategies

### What is under the hood?

The project compares two modes:

```text
SI: one shared model + subject embeddings
SD: separate model for each subject
```

These modes cannot be mixed into a single common headline metric because they answer different questions.

SI asks:

> can one shared model work on the data of all known subjects while using soft personalization?

SD asks:

> how well can a separate model be trained within each subject?

---

## Formal Setup

### SI Mode

Shared parameters:

$$
\theta_{\mathrm{shared}}
$$

and the subject embeddings table:

$$
E = \{e_1,\dots,e_S\}.
$$

Model:

$$
z_i = f_{\theta_{\mathrm{shared}}}(X_i, e_{s_i}).
$$

### SD Mode

For each subject $s$, a separate model is trained:

$$
z_i = f_{\theta_s}(X_i),
\qquad i: s_i=s.
$$

---

## Practical Interpretation

SI is more economical:

```text
one model + 5 subject embeddings
```

SD is more expensive:

```text
5 separate models
```

But SD may better adapt to the specific physiology of a subject.

In the current results, SD is indeed slightly better in macro F1 and balanced accuracy, but the gain is not radical. This makes SI a good baseline, and SD a useful subject-specific control.

---

## 18. Class-Balanced Focal Loss

### What is under the hood?

The task has class imbalance and difficult examples. Ordinary cross-entropy may optimize too strongly for frequent or easy classes. Therefore, **Class-Balanced Focal Loss** is used.

It combines two ideas:

1. class-balanced weights, to account for different class supports;
2. a focal multiplier, to focus more strongly on difficult examples.

---

## Formal Setup

Let $n_c$ be the number of train examples of class $c$.

The effective number of examples:

$$
E_c = \frac{1-\beta^{n_c}}{1-\beta}.
$$

Class-balanced weight:

$$
\alpha_c = \frac{1-\beta}{1-\beta^{n_c}}.
$$

Suppose the model outputs softmax probabilities:

$$
p_c = \frac{\exp(z_c)}{\sum_j \exp(z_j)}.
$$

For the true class $y$:

$$
p_t = p_y.
$$

Focal loss:

$$
L_{\mathrm{focal}}
= -(1-p_t)^\gamma \log p_t.
$$

Class-Balanced Focal Loss:

$$
L_{\mathrm{CB\text{-}Focal}}
= -\alpha_y(1-p_y)^\gamma \log p_y.
$$

In the current configuration:

$$
\beta = 0.999,
\qquad
\gamma = 1.75.
$$

---

## Intuition

If an example is easy and the model confidently gives the correct class, then $p_y \approx 1$, which means:

$$
(1-p_y)^\gamma \approx 0.
$$

Such an example has almost no influence on the loss.

If an example is difficult and $p_y$ is small, the focal multiplier remains large. The model receives a stronger gradient specifically on erroneous or uncertain examples.

---

## Example

Let $\gamma=2$.

For an easy example:

$$
p_y = 0.95,
\qquad
(1-p_y)^2 = 0.05^2 = 0.0025.
$$

For a difficult example:

$$
p_y = 0.30,
\qquad
(1-p_y)^2 = 0.70^2 = 0.49.
$$

The difficult example receives much greater weight in optimization.

---

## 19. Train-Only Normalization and the Anti-Leakage Protocol

### What is under the hood?

One of the most important engineering elements of the project is that normalization is computed only on the train part of the current fold.

This is critical: if validation/test is used to compute mean/std, the model receives information about the validation distribution before prediction. In EEG tasks, such leakage can noticeably inflate metrics.

---

## Formal Setup

Let the current fold be split into:

$$
\mathcal{D}_{\mathrm{train}},
\qquad
\mathcal{D}_{\mathrm{val}}.
$$

Normalization statistics are computed only on train:

$$
\mu = \mu(\mathcal{D}_{\mathrm{train}}),
\qquad
\sigma = \sigma(\mathcal{D}_{\mathrm{train}}).
$$

Then they are applied to both train and validation:

$$
\tilde X = \frac{X-\mu}{\sigma + \varepsilon}.
$$

It is forbidden to compute:

$$
\mu = \mu(\mathcal{D}_{\mathrm{train}} \cup \mathcal{D}_{\mathrm{val}}).
$$

---

## Hybrid Z-Score

In default mode, hybrid normalization is used:

```text
subject-centering + global scaling
```

Intuitively:

1. first, the mean shift of each subject is compensated;
2. then global scaling is applied using train data.

This helps reduce inter-subject amplitude differences without using validation statistics.

---

## 20. Evaluation Protocol and Metrics

### What is under the hood?

The main metric is **macro F1**. This is logical because the task is multiclass, classes may be imbalanced, and ordinary accuracy may hide failures on individual meta-classes.

Additionally, the following are computed:

```text
accuracy
balanced accuracy
precision macro
recall macro
validation loss
```

The best checkpoint is selected by maximum validation macro F1.

---

## Formal Setup

For class $k$:

$$
\mathrm{Precision}_k = \frac{TP_k}{TP_k + FP_k},
$$

$$
\mathrm{Recall}_k = \frac{TP_k}{TP_k + FN_k}.
$$

F1 for a class:

$$
F1_k =
\frac{2\cdot \mathrm{Precision}_k \cdot \mathrm{Recall}_k}
{\mathrm{Precision}_k + \mathrm{Recall}_k}.
$$

Macro-F1:

$$
F1_{\mathrm{macro}}
=
\frac{1}{K}\sum_{k=1}^{K}F1_k,
\qquad K=8.
$$

Accuracy:

$$
\mathrm{Accuracy} = \frac{N_{\mathrm{correct}}}{N}.
$$

Balanced accuracy:

$$
\mathrm{BalancedAccuracy}
=
\frac{1}{K}\sum_{k=1}^{K}\mathrm{Recall}_k.
$$

---

## Random Reference Point

For 8 classes, a rough random reference point is:

$$
\frac{1}{8}=0.125.
$$

This is a sanity check for accuracy and balanced accuracy. For macro-F1, a strict random baseline is better estimated empirically through a permutation/random-label protocol, especially under class imbalance.

---

## 21. Results: What Was Obtained

### What is under the hood?

In the full evaluation, two strategies were compared:

```text
SI: pooled personalized model with subject embeddings
SD: separate models for each subject
```

Final results:

| Pipeline | F1 macro | Accuracy | Balanced accuracy |
|---|---:|---:|---:|
| SI, pooled personalized | 0.2531 | 0.2831 | 0.2665 |
| SD, per-subject | 0.2665 | 0.2852 | 0.2854 |
| Random chance | ~0.125 | ~0.125 | ~0.125 |

Both strategies are noticeably above the random reference point.

---

## Interpretation

For SI:

$$
\frac{0.2531}{0.125} \approx 2.02.
$$

For SD:

$$
\frac{0.2665}{0.125} \approx 2.13.
$$

That is, by macro F1, both models are roughly twice as high as the rough random reference point.

The difference between SD and SI:

$$
\Delta F1_{\mathrm{macro}} = 0.2665 - 0.2531 = 0.0134.
$$

$$
\Delta \mathrm{BalancedAccuracy} = 0.2854 - 0.2665 = 0.0189.
$$

$$
\Delta \mathrm{Accuracy} = 0.2852 - 0.2831 = 0.0021.
$$

SD is slightly better on class-balanced metrics, but gains almost nothing on ordinary accuracy.

---

## Why the Result Should Not Be Overinterpreted

Quality above chance level means that the model is indeed extracting part of the informative signal.

But the absolute values remain moderate. This is expected for non-invasive imagined-speech EEG:

- the signal is noisy;
- there are few subjects;
- meta-classes are semantically heterogeneous;
- imagined speech is weaker and less observable than spoken speech;
- the within-subject protocol does not test transfer to a new subject.

Therefore, the result is better formulated as:

> RTTMultiScale provides a reproducible above-chance baseline for 8-class known-subject classification of imagined-speech EEG.

---

## 22. Confusion Matrix and Error Analysis

![Figure 12](/warp-zone-folio/blog/rttmultiscale/assets/Figure-12.png)

### What is under the hood?

Average metrics do not show exactly which classes the model confuses. Therefore, the following are important:

```text
confusion matrix
per-class precision
per-class recall
per-class F1
support by class
```

In EEG tasks, errors between classes can have different causes. For example, the model may confuse classes because of:

1. real similarity of neurophysiological patterns;
2. semantic overlap after $39 \rightarrow 8$;
3. class imbalance;
4. subject-specific noise;
5. insufficient expressiveness of the architecture.

---

## Formal Setup

Confusion matrix:

$$
M_{ij} = \#\{n: y_n=i, \hat y_n=j\}.
$$

Diagonal:

$$
M_{ii}
$$

shows correct predictions for class $i$.

Off-diagonal elements:

$$
M_{ij},\quad i\neq j
$$

show systematic confusions.

---

## Interpretation

If the model consistently confuses two meta-classes, this does not necessarily mean a "bad architecture". There are three possible explanations:

1. these classes are physiologically weakly distinguishable in EEG;
2. the meta-classes overlap semantically;
3. the current SPD+Transformer extractor is not powerful enough.

Therefore, the confusion matrix must be read together with the 39->8 mapping and the class distribution.

---

## 23. Numerical Stability of SPD Operations

### What is under the hood?

The SPD block is mathematically elegant, but numerically sensitive. Covariance matrices can be poorly conditioned. Eigenvalues can be too small. On GPU in low precision, eigendecomposition problems may arise.

Therefore, the implementation includes protective mechanisms:

```text
NaN/Inf sanitization
symmetrization
diagonal jitter
eigenvalue clamp
CUDA float32 promotion
CPU float64 fallback
diagonal SPD fallback
```

---

## Formal Setup

Before eigendecomposition, the matrix is symmetrized:

$$
A \leftarrow \frac{1}{2}(A + A^\top).
$$

Then jitter is added:

$$
A_\varepsilon = A + \varepsilon I.
$$

If eigenvalues are too small:

$$
\lambda_i \leftarrow \max(\lambda_i, \varepsilon).
$$

After that, the matrix is reconstructed:

$$
A_{\mathrm{spd}} = U \mathrm{diag}(\lambda_1,\dots,\lambda_d) U^\top.
$$

---

## Why This Matters

Without these stabilizers, a long multi-fold run can fail because of one bad window. For a research pipeline, this is critical: the model must be not only mathematically correct, but also engineering-resilient.

---

## 24. Inference and Confidence

### What is under the hood?

During inference, the model must use the same preprocessing as during train:

```text
same exclude_channels
same train-only normalization
same meta-class mapping
same architecture
same subject_id policy
```

The model output is logits:

$$
z \in \mathbb{R}^{8}.
$$

Softmax converts them into probabilities:

$$
p_i = \frac{\exp(z_i)}{\sum_{j=1}^{8}\exp(z_j)}.
$$

Prediction:

$$
\hat y = \arg\max_i p_i.
$$

---

## Confidence Is Not Equal to True Probability

The maximum softmax probability:

$$
p_{\max} = \max_i p_i
$$

can be used as proxy confidence, but it cannot automatically be considered the probability of correctness.

Reasons:

- Class-Balanced Focal Loss may worsen calibration;
- EEG has strong subject variability;
- the model may be overconfident on errors;
- meta-classes may be semantically close.

---

## Temperature Scaling

Basic post-hoc calibration:

$$
p'_i = \frac{\exp(z_i/T)}{\sum_{j=1}^{8}\exp(z_j/T)},
\qquad T>0.
$$

Where $T$ is selected on a validation/calibration set, usually by minimizing NLL:

$$
\mathrm{NLL} = -\frac{1}{N}\sum_{n=1}^{N}\log p'_{n,y_n}.
$$

Important: temperature scaling does not change $\arg\max$, and therefore does not change the class itself. It changes only the shape of the probability distribution.

---

## 25. Abstention Policy

### What is under the hood?

For a BCI system, it is important not only to predict a class, but also to understand when it is better to abstain from a decision.

The simplest policy:

$$
p_{\max} \geq \tau.
$$

If the condition is satisfied, the model makes a decision. If not, it marks the example as uncertain.

---

## Formal Setup

Coverage:

$$
\mathrm{Coverage} = \frac{N_{\mathrm{accepted}}}{N}.
$$

Selective risk:

$$
\mathrm{SelectiveRisk}
= \frac{N_{\mathrm{errors,accepted}}}{N_{\mathrm{accepted}}}.
$$

As the threshold $\tau$ increases, usually:

```text
coverage decreases
selective risk should also decrease
```

This is a trade-off between autonomy and safety.

---

## Visual Interpretation

For an applied BCI, it is better to have a system that sometimes says:

> I am not confident, please try again

than a system that confidently outputs the wrong command.

Therefore, calibration and abstention are not secondary analysis, but an important step toward practical use.

---

## 26. Pipeline Reproducibility

### What is under the hood?

The project is organized as a reproducible research pipeline. Repeating the experiment requires two layers:

```text
1. preprocessed pkl EEG segments
2. JSON dictionaries / mappings
```

Minimal data structure:

```text
json/
├── classnumber.json
├── textmaps.json
└── metaclasses.json

preprocessed_pkl/<subject>/eeg/
└── *task-imagine*run-*.pkl
```

Main commands:

```bash
python3 Pipeline/test_dryrun.py
python3 Pipeline/train.py
python3 Pipeline/run_full_evaluation.py --pipeline both
python3 Pipeline/train.py --save-attn
```

---

## Artifacts of One Run

Each run should save:

```text
best_model.pt
metrics.json
history.json
config_run.json
val_preds.npz
```

Where:

- `best_model.pt` is the best checkpoint;
- `metrics.json` contains the final metrics;
- `history.json` is the training dynamics;
- `config_run.json` is the full configuration;
- `val_preds.npz` contains logits, probabilities, true labels, and predictions.

For full evaluation, aggregated tables, plots, and a statistical report are additionally saved.

---

## Why This Matters

In EEG tasks, "getting a metric" is not enough. One must be able to answer:

- which subjects were used;
- what the split was;
- which normalization statistics were applied;
- which class weights were used;
- which seed was fixed;
- which checkpoint was selected;
- whether metrics can be recomputed from saved predictions.

This is exactly what turns an experiment from a one-off run into a verifiable research artifact.

---

## 27. Limitations of the Current Approach

### What is under the hood?

RTTMultiScale is a strong baseline, but not a final solution for imagined-speech EEG decoding.

Key limitations:

1. **Closed vocabulary**: the model predicts only 8 meta-classes.
2. **Known-subject protocol**: the main mode does not test transfer to a new subject.
3. **One dataset**: conclusions are limited to Chisco and its protocol.
4. **Semantic aggregation**: the 39->8 mapping may introduce heterogeneity.
5. **Low SNR**: imagined-speech EEG remains a very noisy task.
6. **Confidence is not calibrated by default**.
7. **No online decoding**.
8. **No open-vocabulary text generation**.

---

## Formal Interpretation of the Subject Transfer Limitation

In the current within-subject mode:

$$
S_{\mathrm{train}} = S_{\mathrm{val}}.
$$

That is, the sets of subjects coincide, although the specific trials do not overlap.

For subject-held-out, the following is needed:

$$
S_{\mathrm{train}} \cap S_{\mathrm{test}} = \varnothing.
$$

This is a fundamentally different experiment.

---

## Why This Matters

For a real BCI scenario, transfer to a new user is one of the main problems. Therefore, the current result is better viewed as a foundation:

```text
first known-subject baseline
then subject-held-out / LOSO
then adaptation / calibration
then online / open-vocabulary
```

---

## 28. What Ablations Are Needed Next

### What is under the hood?

To understand exactly what provides the gain, systematic ablations are needed. It is important to change one factor at a time and keep the same split indices.

Minimal directions:

```text
raw EEG baseline vs SPD tokens
covariance vs correlation
OAS vs Ledoit-Wolf
Log-Euclidean vs no-log
small-only vs large-only vs multi-scale
subject embedding on/off
CB-Focal vs CE vs Focal
zscore_hybrid vs other normalization
Transformer depth / heads / d_model
within_subject vs subject_heldout / LOSO
```

---

## Formal Ablation Scheme

Suppose there is a baseline configuration $C_0$ and a modified configuration $C_1$.

For the comparison to be correct, it is necessary that:

$$
\mathrm{splits}(C_0) = \mathrm{splits}(C_1),
$$

$$
\mathrm{seed}(C_0) = \mathrm{seed}(C_1),
$$

and all other parameters must match, except for the factor under study.

Then the difference:

$$
\Delta F1 = F1(C_1) - F1(C_0)
$$

can be interpreted as the effect of the specific modification.

---

## 29. The Mathematical Meaning of the Whole Construction as a Unified System

Now the whole model can be assembled into one chain.

RTTMultiScale performs three conceptual steps:

1. converts an EEG segment into inter-channel SPD representations;
2. turns SPD representations into tokens of two temporal scales;
3. aggregates tokens with a TransformerEncoder and classifies the semantic meta-class.

---

## Formal Composition

Original signal:

$$
X \in \mathbb{R}^{124\times1651}.
$$

Channel projection:

$$
Z = W_c X \in \mathbb{R}^{24\times1651}.
$$

Windowing:

$$
\{Z_m\}_{m=1}^{27}.
$$

SPD-token extractor:

$$
t_m
=
\mathrm{Linear}\left(
\mathrm{vec}_{\Delta}\left(
\log\left(
\mathrm{Corr}(\mathrm{OAS}(Z_m))
\right)
\right)
\right).
$$

Token sequence:

$$
T = (t_1,\dots,t_{27}),
\qquad t_m \in \mathbb{R}^{128}.
$$

Transformer aggregation:

$$
H = \mathrm{TransformerEncoder}([CLS;T] + PE + E_{\mathrm{scale}}).
$$

Classification representation:

$$
h = [H_{CLS}; \mathrm{AttnPool}(H_{1:27}); e_s].
$$

Logits:

$$
z = \mathrm{MLP}(h) \in \mathbb{R}^{8}.
$$

---

## Conceptual Formula

The meaning of the whole architecture can be expressed as:

$$
\text{imagined-speech EEG classification}
=
\text{inter-channel SPD geometry}
+
\text{multi-scale tokens}
+
\text{Transformer aggregation}
+
\text{subject-aware personalization}.
$$

---

## 30. Final Conclusion

RTTMultiScale is a carefully constructed baseline for imagined-speech EEG, where the main contribution lies not only in the architecture, but also in methodological discipline.

The model shows that:

1. above-chance signal can be extracted from imagined-speech EEG in an 8-class setup;
2. SPD representations provide a geometrically meaningful way to describe inter-channel dependencies;
3. multi-scale tokenization makes it possible to combine short and longer temporal contexts;
4. subject embeddings provide soft personalization of known subjects;
5. SD models gain slightly on balanced metrics, but do not radically outperform SI;
6. reproducibility, train-only normalization, and separate SI/SD reporting are just as important as the neural architecture itself.

---

## Final Summary in One Chain

$$
X \in \mathbb{R}^{124\times1651}
\rightarrow
W_cX \in \mathbb{R}^{24\times1651}
\rightarrow
\{\mathrm{SPD\ windows}\}_{27}
\rightarrow
\{t_i \in \mathbb{R}^{128}\}_{27}
\rightarrow
\mathrm{TransformerEncoder}
\rightarrow
\mathrm{CLS} + \mathrm{AttnPool} + e_s
\rightarrow
\mathbb{R}^{8}.
$$

The key idea of the project:

$$
\text{robust EEG representation}
=
\text{Riemannian geometry of SPD matrices}
+
\text{contextual Transformer aggregation}.
$$

This combination is exactly what makes RTTMultiScale a good starting point for the next stage: subject-held-out evaluation, confidence calibration, systematic ablations, subject-aware adaptation, and gradual transition toward retrieval/open-vocabulary decoding.

---

# 31. Source

Related dataset:

```bibtex
@article{zhang2024chisco,
  title   = {Chisco: An EEG-based BCI dataset for decoding of imagined speech},
  author  = {Zhang, Zihan and Ding, Xiao and Bao, Yu and Zhao, Yi and Liang, Xia and Qin, Bing and Liu, Ting},
  journal = {Scientific Data},
  volume  = {11},
  pages   = {1265},
  year    = {2024},
  doi     = {10.1038/s41597-024-04114-1}
}
```

# Citation

```bibtex
@thesis{verbetskii2026rttmultiscale,
title       = {Riemannian geometric features and transformer for decoding imagined speech from EEG},
author      = {Verbetskii, Eduard Igorevich},
institution = {Moscow Aviation Institute (National Research University)},
location    = {Moscow, Russia},
year        = {2026},
type        = {Master of Science},
note        = {Institute No. 8 `Computer Science and Applied Mathematics''; educational program `Machine Learning and Data Analysis''},
langid      = {russian}
}
```
