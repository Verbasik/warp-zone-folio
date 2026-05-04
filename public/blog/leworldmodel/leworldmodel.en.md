JEPA and Latent World Models Using LeWorldModel (LeWM) as an Example

---

## 1. Why This Class of Models Is Needed in the First Place

### Under the Hood?

LeWorldModel belongs to the class of **latent world models**, and more specifically—to the class of **JEPA** (*Joint Embedding Predictive Architectures*). The core idea of JEPA is that the model is not required to reconstruct every pixel of the next frame. Instead, it must learn to construct a latent representation of the observation in which **the future state becomes predictable**. In other words, the model learns not to "draw" the world, but to **model its dynamics in feature space**.

This is particularly important for world models because control and planning primarily require an answer to the question:

> *what will happen if I execute action $(a_t)$ in state $(s_t)$?*

In the JEPA approach, this question is translated into a more compact form:

> *how will the latent state $(z_t)$ change after action $(a_t)$?*

Thus, instead of expensive modeling in pixel space $(\mathbb{R}^{H \times W \times C})$, the model operates in a much more compact space $(\mathbb{R}^d)$, where $(d)$ is small compared to the dimensionality of the original image.

---

## Formal Formulation

![Figure 01](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-01.png)

Suppose we have a trajectory of observations and actions:

$$
(o_1, a_1, o_2, a_2, \dots, o_T, a_T).
$$

Where:

- $(o_t)$ — observation at time $(t)$, typically an image;
- $(a_t)$ — agent's action at time $(t)$;
- $(T)$ — trajectory length.

The JEPA model introduces a mapping

$$
z_t = \mathrm{enc}_\theta(o_t),
$$

followed by a dynamic predictor

$$
\hat z_{t+1} = \mathrm{pred}_\phi(z_t, a_t).
$$

Where:

- $\mathrm{enc}_\theta$ — encoder with parameters $\theta$;
- $z_t \in \mathbb{R}^d$ — latent representation of observation $o_t$;
- $\mathrm{pred}_\phi$ — dynamics predictor with parameters $\phi$;
- $\hat z_{t+1}$ — prediction of the next step's latent state.

The idea is for $(\hat z_{t+1})$ to be close to the true

$$
z_{t+1} = \mathrm{enc}_\theta(o_{t+1}).
$$

---

## Intuitive Interpretation

While a standard pixel-based world model tries to answer the question:

- “what will the next frame look like?”,

the JEPA architecture answers a more structural question:

- “what **state of the world** comes next, if we disregard irrelevant visual details?”

This makes the representation more suitable for:

- planning;
- generalization;
- control;
- evaluating the physical consistency of trajectories.

This is precisely the core idea of LeWM: to robustly learn such latent dynamics **end-to-end from pixels**, but without complex, multi-term stabilization heuristics like EMA, stop-gradient, and a large suite of regularizers.

---

## 2. The JEPA Problem: Why Representation Collapse Occurs

### What Goes Wrong Without Regularization?

If the model is trained solely on the prediction error of the next latent vector, a trivial solution emerges: the encoder can start mapping **all observations to the exact same point**. This makes it incredibly easy for the predictor to "predict the future," since all states are identical. From a loss perspective, this might look acceptable, but from the perspective of representation utility, it is a disaster. The paper explicitly identifies this issue as **representation collapse**.

---

## Formal Formulation

![Figure 02](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-02.png)

Suppose the loss contains only the prediction error:

$$
L_{\mathrm{pred}} = \lVert \hat z_{t+1} - z_{t+1} \rVert_2^2.
$$

Where:

- $L_{\mathrm{pred}}$ — predictive loss;
- $\hat z_{t+1}$ — predicted latent;
- $z_{t+1}$ — true latent of the next frame;
- $\lVert \cdot \rVert_2$ — Euclidean norm.

Then the trivial solution takes the form

$$
\mathrm{enc}_\theta(o) = c \quad \forall o,
$$

where $c \in \mathbb{R}^d$ is the same constant for all inputs.

Consequently,

$$
z_t = z_{t+1} = c,
$$

and it suffices for the predictor to output

$$
\hat z_{t+1} = c,
$$

which makes

$$
L_{\mathrm{pred}} = \lVert c - c \rVert_2^2 = 0.
$$

Where:

- $c$ — a constant, collapsed latent;
- a zero loss does not mean the model has understood the environment's dynamics.

---

## Why This Matters

This is precisely why it is not enough for JEPA to simply "predict the future latent." It is also necessary to impose structure on the embedding space so that it:

- does not collapse;
- preserves feature diversity;
- remains suitable for dynamic modeling.

LeWM addresses this via **SIGReg**—a regularizer that forces the distribution of latent embeddings to approximate an isotropic Gaussian distribution. This is the central mathematical idea of the paper.

---

## 3. Overall Architecture of LeWorldModel

### Under the Hood?

LeWM is built from two main components:

1. **Encoder** — maps an image to a compact latent.
2. **Predictor** — models dynamics in the latent space, predicting the next latent from the current hidden state and action.

The scheme is minimalist but fundamental: the model is trained **jointly**, end-to-end, without a frozen external encoder. This distinguishes LeWM from DINO-WM, where visual features come from a frozen foundation encoder.

---

## Formal Formulation

![Figure 03](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-03.png)

The architecture is defined by two mappings:

$$
z_t = \mathrm{enc}_\theta(o_t),
$$

$$
\hat z_{t+1} = \mathrm{pred}_\phi(z_t, a_t).
$$

Where:

- $o_t$ — input image;
- $z_t$ — its latent representation;
- $a_t$ — action;
- $\hat z_{t+1}$ — predicted latent of the next observation;
- $\theta$ — encoder parameters;
- $\phi$ — predictor parameters.

More generally, when using a history of length $N$, the predictor effectively operates on a sequence:

$$
\hat z_{t+1} = \mathrm{pred}_\phi(z_{t-N+1:t}, a_{t-N+1:t}),
$$

where:

- $z_{t-N+1:t}$ — history of latent states;
- $a_{t-N+1:t}$ — history of actions;
- $N$ — context length.

## 💡 What is $a_t$ and How Is It Fed into the Model

The formulas above describe the architecture at an abstract level. For correct implementation, it is important to understand how the action $a_t$ is represented **in practice** and how it is integrated into the predictor's computational graph.

### Action Format and Source

In LeWM, the action $a_t$ is a **continuous control vector** extracted from an offline dataset:

$$
a_t \in \mathbb{R}^{A},
$$

where $A$ is the dimensionality of the action space for a given environment (e.g., $A=2$ for navigation in Two-Room, $A=7$ for manipulation in Push-T).

**Key properties:**
- **Continuity**: actions are real-valued vectors rather than discrete classes;
- **Normalization**: before being fed into the model, actions are typically scaled to the range $[-1, 1]$ or standardized across the dataset;
- **Offline source**: $a_t$ is taken from recorded trajectories of a behavioral policy; the model does not generate actions during training.


---

## Architectural Details

![Figure 04](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-04.png)

### Encoder

According to the paper, the encoder is implemented as a **ViT-Tiny**:

- patch size = 14,
- 12 layers,
- 3 attention heads,
- hidden size = 192,
- approximately $5$M parameters.

At the output, the $[CLS]$ token embedding is used, followed by an additional projection through a single-layer MLP with BatchNorm.

This is a crucial detail: the final layer of the ViT uses **LayerNorm**, which hinders optimization of the anti-collapse objective. Therefore, the authors map the $[CLS]$ vector into a new space via a projection with BatchNorm.

### Predictor

The predictor is a transformer with approximately $10$M parameters:

- 6 layers,
- 16 attention heads,
- dropout $=0.1$,
- causal masking over time,
- action-conditioning via **Adaptive Layer Normalization (AdaLN)**.

If we denote the predictor's hidden state at layer $l$ as $h^{(l)}$, then action-conditioning can be viewed as a modulation of the normalization:

$$
\mathrm{AdaLN}(h^{(l)}, a_t) = \gamma(a_t) \odot \mathrm{LN}(h^{(l)}) + \beta(a_t),
$$

where:

- $\mathrm{LN}$ — standard layer normalization;
- $\gamma(a_t)$, $\beta(a_t)$ — scale and shift parameters dependent on the action;
- $\odot$ — element-wise multiplication.

The paper does not explicitly state this formula, but this is the standard interpretation of AdaLN. Here, it serves as a mathematical reconstruction of the mechanism based on the architectural description. Supporting details confirming the use of AdaLN and zero-initialization are provided in the paper.

---

## 4. Formal Training Objective

LeWM is trained entirely in an **offline, reward-free** setting. That is, the model does not use rewards, does not solve a specific RL task during training, and does not require a control objective function. Its task is to learn **predictable world dynamics** from offline trajectories of pixels and actions.

---

## Formal Formulation

![Figure 05](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-05.png)

The dataset consists of trajectories of length $T$:

$$
\mathcal{D} = \{(o_{1:T}^{(i)}, a_{1:T}^{(i)})\}_{i=1}^M.
$$

Where:

- $\mathcal{D}$ — offline dataset;
- $M$ — number of trajectories;
- $o_{1:T}^{(i)}$ — observations in the $i$-th trajectory;
- $a_{1:T}^{(i)}$ — actions in the $i$-th trajectory.

The training objective is to find parameters $(\theta,\phi)$ such that the latent representations are simultaneously:

1. **temporally predictable**;
2. **non-collapsing**.

In other words, the following optimization problem is solved:

$$
\min_{\theta,\phi} \; L_{\mathrm{LeWM}}(\theta,\phi).
$$


---

## 5. Predictive Loss: Dynamics in Latent Space

The primary useful signal in LeWM is the error between the predicted and true latent of the next frame. This is a teacher-forcing scheme: the true next latent is obtained from the encoder, while the predicted one comes from the predictor.

---

## Formal Formulation

![Figure 06](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-06.png)

The predictive loss in the paper is written as:

$$
L_{\mathrm{pred}} \coloneqq \lVert \hat z_{t+1} - z_{t+1} \rVert_2^2,
\qquad
\hat z_{t+1} = \mathrm{pred}_\phi(z_t, a_t).
$$

Where:

- $L_{\mathrm{pred}}$ — error in predicting the next latent;
- $\hat z_{t+1}$ — model's prediction;
- $z_{t+1}$ — latent of the next real observation;
- $z_t$ — current latent;
- $a_t$ — action between $t$ and $t+1$.

When averaging over the batch and time, the natural form becomes:

$$
L_{\mathrm{pred}}^{\mathrm{avg}}
=
\frac{1}{B(T-1)}
\sum_{i=1}^{B}
\sum_{t=1}^{T-1}
\left\|
\hat z_{t+1}^{(i)} - z_{t+1}^{(i)}
\right\|_2^2.
$$

Where:

- $B$ — batch size;
- $T$ — sub-trajectory length;
- $i$ — index of the sample in the batch.

---

## What Exactly Is Being Optimized

It is important to understand the geometry of this formula.

The model does not attempt to make the pixels match:

$$
\hat o_{t+1} \approx o_{t+1}.
$$

Instead, it attempts to ensure that **the geometry of the latent space aligns with the environment's dynamics**:

$$
\mathrm{pred}_\phi(\mathrm{enc}_\theta(o_t), a_t)
\approx
\mathrm{enc}_\theta(o_{t+1}).
$$

This represents a fundamentally different philosophy compared to reconstructive world models.

---

## Example

Suppose the latent space is two-dimensional purely for illustration:

$$
z_t = (1.2, -0.5), \qquad
z_{t+1} = (1.8, -0.1).
$$

After action $a_t$, the predictor outputs

$$
\hat z_{t+1} = (1.6, -0.2).
$$

Then the loss equals

$$
L_{\mathrm{pred}}
=
(1.6 - 1.8)^2 + (-0.2 - (-0.1))^2
=
(-0.2)^2 + (-0.1)^2
=
0.04 + 0.01
=
0.05.
$$

Where:

- the first error reflects an under-prediction along the first coordinate;
- the second reflects the error along the second coordinate.

---

## 6. SIGReg: Anti-Collapse via Gaussian Geometry

### Core Idea

Instead of a large suite of variance/covariance/time regularizers, as in PLDM, LeWM relies on a single principle:

> latent representations should follow a distribution close to an **isotropic Gaussian**.

Intuitively, this means:

- the feature space should be “filled out”;
- different directions should be utilized;
- the representation should not degenerate into a low-dimensional or near-constant structure.

But directly testing for normality in high dimensions is difficult. Therefore, the paper employs a clever trick:

1. random directions are sampled on the hypersphere;
2. high-dimensional embeddings are projected onto these directions;
3. for each 1D projection, it checks how closely the distribution resembles $\mathcal N(0,1)$;
4. the results are then averaged.

---

![Figure 07](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-07.png)

## Formal Formulation

Let

$$
Z \in \mathbb{R}^{N \times B \times d}
$$

be the tensor of latent embeddings.

Where:

- $N$ — history length;
- $B$ — batch size;
- $d$ — latent space dimensionality.

$M$ random unit directions are sampled:

$$
u^{(m)} \in \mathbb{S}^{d-1},
\qquad m=1,\dots,M.
$$

Where:

- $\mathbb{S}^{d-1}$ — unit sphere in $\mathbb{R}^d$;
- $u^{(m)}$ — $m$-th random direction.

The projection of embeddings onto such a direction is:

$$
h^{(m)} \coloneqq Z u^{(m)}.
$$

Where:

- $h^{(m)}$ — 1D projections of latents along direction $u^{(m)}$.

Next, the regularizer is defined as:

$$
\mathrm{SIGReg}(Z)
\coloneqq
\frac{1}{M}\sum_{m=1}^{M} T\!\left(h^{(m)}\right),
$$

where:

- $T(\cdot)$ — Epps–Pulley normality statistic for a 1D sample.

This is exactly the form presented in the paper.

---

## Why It Works: Cramér–Wold

A key theoretical fact from the paper:

> if all 1D projections of a multivariate distribution match the projections of a target Gaussian distribution, then the entire distributions coincide.

This is directly related to the Cramér–Wold theorem.

![Figure 08](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-08.png)

In the paper, this is expressed as a weak equivalence:

$$
\mathrm{SIGReg}(Z) \to 0
\quad \Longleftrightarrow \quad
P_Z \to \mathcal N(0, I).
$$

Where:

- $P_Z$ — distribution of latent embeddings;
- $\mathcal N(0, I)$ — isotropic normal distribution;
- $I$ — identity covariance matrix.

Thus, a zero regularizer value implies that the latent space distribution approaches a spherical Gaussian prior.

---

## Epps–Pulley Statistic

The paper further explains that each 1D projection uses the statistic:

$$
T^{(m)}
=
\int_{-\infty}^{\infty}
w(t)
\left|
\varphi_N(t; h^{(m)}) - \varphi_0(t)
\right|^2
dt.
$$

Where:

- $T^{(m)}$ — normality deviation statistic along the $m$-th direction;
- $w(t)$ — weight function;
- $\varphi_N(t; h^{(m)})$ — empirical characteristic function of the sample $h^{(m)}$;
- $\varphi_0(t)$ — characteristic function of the standard normal distribution.

The empirical characteristic function is defined as:

$$
\varphi_N(t; h)
=
\frac{1}{N}\sum_{n=1}^{N} e^{i t h_n}.
$$

Where:

- $h_n$ — $n$-th element of the 1D projection;
- $i$ — imaginary unit.

The weight function can be chosen as:

$$
w(t) = e^{-t^2/(2\lambda^2)}.
$$

Where:

- $\lambda$ here is the kernel parameter within the Epps–Pulley test;
- this is **not necessarily the same** $\lambda$ as the regularization weight in the full loss;
- the paper uses the same symbol, so context must be distinguished when reading.

---

## Intuition

If the embeddings collapsed to a single point, their projections onto random directions would also be nearly constant, rather than Gaussian variables. SIGReg explicitly penalizes this kind of degradation.

In other words, SIGReg accomplishes two things simultaneously:

1. **prevents collapse**;
2. **organizes the latent space in a geometrically “useful” way**.

---

## Example

Let $d=2$, and suppose the embeddings all lie almost on a single point:

$$
z^{(1)} = (0.01, 0.02), \quad
z^{(2)} = (0.02, 0.01), \quad
z^{(3)} = (0.01, 0.01).
$$

If we take the direction:

$$
u = \frac{1}{\sqrt{2}}(1,1),
$$

then the projections will be approximately:

$$
h = Zu \approx (0.021, 0.021, 0.014),
$$

which are nearly constant.

Such a distribution is very far from $\mathcal N(0,1)$, and $T(h)$ will be large.

If, however, the embeddings look like:

$$
z^{(1)}=(1.2,-0.5),\quad
z^{(2)}=(-0.7,0.3),\quad
z^{(3)}=(0.1,1.1),\quad
z^{(4)}=(-1.3,-0.8),
$$

then their projections along random directions will be much more diverse and closer to a Gaussian distribution.

---

## 7. Full LeWM Objective

## Formal Formulation

The full loss in the paper is:

$$
L_{\mathrm{LeWM}}
\coloneqq
L_{\mathrm{pred}} + \lambda \,\mathrm{SIGReg}(Z).
$$

Where:

- $L_{\mathrm{LeWM}}$ — total loss function;
- $L_{\mathrm{pred}}$ — next latent prediction loss;
- $\mathrm{SIGReg}(Z)$ — anti-collapse regularizer;
- $\lambda$ — regularization weight.

This is the central formula of the entire paper.

---

## Why This Matters

Unlike PLDM, where the objective consists of seven terms, here there are essentially only:

1. **a dynamic component**;
2. **a geometric anti-collapse component**.

This is precisely why the authors claim that tuning becomes simpler: effectively, only $\lambda$ needs to be tuned, while the number of random projections $M$ has a weak impact on downstream performance. The authors use $M=1024$ and $\lambda=0.1$.

---

## Computational Interpretation

If the parameter $\lambda$ is too small, the model risks collapsing or developing an overly weak geometric structure in the latent space.

If $\lambda$ is too large, the model may overfit the distribution to the Gaussian prior at the expense of dynamic informativeness.

Thus, training represents a balance:

$$
\min_{\theta,\phi}
\Big[
\underbrace{L_{\mathrm{pred}}}_{\text{dynamics}}
+
\lambda
\underbrace{\mathrm{SIGReg}(Z)}_{\text{anti-collapse}}
\Big].
$$

It is precisely this composition that makes LeWM simultaneously:

- end-to-end;
- stable;
- relatively simple in terms of hyperparameters.


---

## 8. Step-by-Step Training Algorithm

The paper provides pseudocode that clearly illustrates how compact the training procedure is. First, frames are encoded, then the predictor forecasts future embeddings, and finally, MSE and step-wise SIGReg are computed.

---

## Formal Scheme

Suppose the input has the shape:

$$
\mathrm{obs} \in \mathbb{R}^{B \times T \times C \times H \times W},
\qquad
\mathrm{actions} \in \mathbb{R}^{B \times T \times A}.
$$

Where:

- $B$ — batch size;
- $T$ — number of time steps;
- $C$ — number of channels;
- $H,W$ — frame height and width;
- $A$ — action dimensionality.

The computations then proceed as follows:

1. Encoding:
   $$
   \mathrm{emb} = \mathrm{encoder}(\mathrm{obs}) \in \mathbb{R}^{B \times T \times D}.
   $$

2. Prediction:
   $$
   \mathrm{next\_emb} = \mathrm{predictor}(\mathrm{emb}, \mathrm{actions}) \in \mathbb{R}^{B \times T \times D}.
   $$

3. Predictive loss:
   $$
   \mathrm{pred\_loss} = \mathrm{MSE}(\mathrm{emb}[:,1:],\; \mathrm{next\_emb}[:,:-1]).
   $$

4. Regularization:
   $$
   \mathrm{sigreg\_loss}
   =
   \mathrm{mean}\big(
   \mathrm{SIGReg}(\mathrm{emb}^{\top})
   \big).
   $$

5. Final loss:
   $$
   L = \mathrm{pred\_loss} + \lambda \,\mathrm{sigreg\_loss}.
   $$

This closely mirrors the training loop presented in the paper.

---

## 9. Practical Implementation Details

To understand the architecture, it is important not only to know the formulas but also to see the actual engineering numbers.

According to Appendix D:

- frame skip = 5;
- batch size = 128;
- sub-trajectories consist of 4 frames;
- images are $224 \times 224$;
- predictor history length:
  - $3$ for PushT and OGBench-Cube,
  - $1$ for Two-Room;
- the decoder is used only for diagnostics and visualization, and **not** for the training objective.

---

## Formal Interpretation of Frame Skip

If the original action sequence has a step of $\Delta t$, and frames are sampled every 5 actions, then each transition pair in the model actually corresponds to a macro-transition:

$$
(o_t, a_t^{(1)}, a_t^{(2)}, a_t^{(3)}, a_t^{(4)}, a_t^{(5)}, o_{t+1}).
$$

This can be viewed as an aggregated action block:

$$
\tilde a_t = (a_t^{(1)}, a_t^{(2)}, a_t^{(3)}, a_t^{(4)}, a_t^{(5)}),
$$

after which the system transitions from $o_t$ to $o_{t+1}$.

Where:

- $\tilde a_t$ is a block of 5 consecutive actions;
- such aggregation increases the “effective horizon” of modeling.

---

## Diagnostic Decoder

The paper clarifies that the decoder is not involved in the main training process. It takes the [CLS] embedding of dimension 192 and attempts to reconstruct the image solely for visual analysis of what information the latent carries. This is a crucial point: LeWM is **not a reconstruction-based model**.

---

## 10. From Training to Control: Latent Planning

After training, the model parameters are fixed. Subsequently, LeWM is used as a world model within the planning procedure. The goal is to find a sequence of actions that brings the system as close as possible to a target observation, but the search is conducted not in pixel space, but in latent space.

---

## Formal Formulation

Let:

- $o_1$ be the current observation;
- $o_g$ be the target observation;
- $z_1 = \mathrm{enc}_\theta(o_1)$;
- $z_g = \mathrm{enc}_\theta(o_g)$.

The rollout in latent space is then constructed recursively:

$$
\hat z_{t+1} = \mathrm{pred}_\phi(\hat z_t, a_t),
\qquad
\hat z_1 = \mathrm{enc}_\theta(o_1).
$$

Where:

- $\hat z_t$ is the predicted latent state at step $t$;
- $a_t$ is the candidate action.

The planning objective function:

$$
C(\hat z_H) = \lVert \hat z_H - z_g \rVert_2^2,
\qquad
z_g = \mathrm{enc}_\theta(o_g).
$$

Where:

- $H$ is the planning horizon;
- $C(\hat z_H)$ is the terminal cost;
- the goal is to make the final rollout as close as possible to the latent target.

Then the optimal control problem is written as:

$$
a_{1:H}^\ast
=
\arg\min_{a_{1:H}} C(\hat z_H).
$$

This is literally a finite-horizon trajectory optimization problem in latent space.

---

## Example

Let the horizon be $H=3$. Given a current latent:

$$
\hat z_1 = (0.5, -0.1),
$$

and a target:

$$
z_g = (2.0, 1.0).
$$

For two candidate action sequences, the model predicts:

### Candidate 1
$$
\hat z_3^{(1)} = (1.7, 0.7).
$$

Then the cost is:

$$
C_1
=
\lVert (1.7,0.7) - (2.0,1.0) \rVert_2^2
=
(-0.3)^2 + (-0.3)^2
=
0.18.
$$

### Candidate 2
$$
\hat z_3^{(2)} = (1.0, 0.4).
$$

Then the cost is:

$$
C_2
=
\lVert (1.0,0.4) - (2.0,1.0) \rVert_2^2
=
(-1.0)^2 + (-0.6)^2
=
1.36.
$$

Clearly, the first sequence is better.

---

## 11. Why MPC Is Used

If the rollout is projected too far into the future, prediction errors begin to accumulate. Therefore, the authors do not execute the entire found plan, but instead use **Model Predictive Control (MPC)**:

1. construct a plan of length $(H)$;
2. execute only the first $(K)$ actions;
3. receive a new real observation;
4. replan from scratch.

---

## Formal Interpretation

Suppose a plan is found:

$$
a_{1:H}^\ast = (a_1^\ast, a_2^\ast, \dots, a_H^\ast).
$$

Then, only the prefix is executed in the environment:

$$
(a_1^\ast, \dots, a_K^\ast),
\qquad K < H.
$$

After this, a new state $(o_{K+1})$ is observed, and the following is recomputed:

$$
z_{K+1} = \mathrm{enc}_\theta(o_{K+1}),
$$

and the optimization problem is restarted.

This reduces the impact of model bias and autoregressive drift.

---

## 12. Cross-Entropy Method (CEM) as a Plan Solver

LeWM does not optimize actions via gradients through the environment. Instead, it uses a **zero-order sampling-based optimizer**—the Cross-Entropy Method. It iteratively samples many action sequences, evaluates them in the world model, selects the best ones, and shifts the sampling distribution toward these elite solutions.

![Figure 09](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-09.png)

---

## Formal Formulation

Let the action distribution at iteration $t$ be parameterized as:

$$
a_{1:H}^{(i)} \sim \mathcal N(\mu_t, \Sigma_t),
\qquad i=1,\dots,N.
$$

Where:

- $N$ is the number of sampled action sequences;
- $\mu_t$ is the distribution mean;
- $\Sigma_t$ is the distribution covariance;
- $a_{1:H}^{(i)}$ is the $i$-th candidate plan.

For each candidate, the cost is computed:

$$
J^{(i)} = C\!\big(\hat z_H^{(i)}\big).
$$

Next, a set of elites is selected:

$$
E_t = \{ i_1, \dots, i_K \},
$$

corresponding to the $K$ best plans.

The parameters are then updated:

$$
\mu_{t+1}
=
\frac{1}{K}
\sum_{i \in E_t} a_{1:H}^{(i)},
$$

$$
\Sigma_{t+1}
=
\mathrm{Var}_{i \in E_t}\!\left(a_{1:H}^{(i)}\right).
$$

Where:

- $K$ is the number of elite plans;
- $\mathrm{Var}$ is the empirical covariance over the elites.

Iterations continue until a stopping criterion is met, after which either the best found plan or the mean of the final distribution is taken. This scheme directly follows from the paper's appendix.

<details>
<summary><strong>📌 Place and Role of CEM in the LeWorldModel Architecture</strong></summary>

### 🧠 Core Idea

**Cross-Entropy Method (CEM) is not used during model training, but rather at the planning stage (inference / control).**

---

### 🔁 Two Different Processes

#### 1. Model Training

The following parameters are optimized:
- encoder: $\theta$
- predictor: $\phi$

Loss function:

$$
L_{\mathrm{LeWM}} = L_{\mathrm{pred}} + \lambda \,\mathrm{SIGReg}(Z)
$$

Characteristics:
- uses **backpropagation**
- involves **gradients**
- optimization via **Adam / SGD**

🚫 **CEM is not applied here**

---

#### 2. Planning (After Training)

Model parameters are fixed:

$$
\theta, \phi \;\; \text{are frozen}
$$

The following problem is solved:

$$
a_{1:H}^\ast = \arg\min_{a_{1:H}} C(\hat z_H)
$$

Where:
- $a_{1:H}$ is the action sequence
- $\hat z_H$ is the predicted state via the world model

---

### ⚙️ Role of CEM

CEM is a **zero-order optimizer** that:

1. samples multiple plans $a_{1:H}^{(i)}$
2. evaluates them via the world model
3. selects the best ones (elites)
4. shifts the distribution toward them

---

### ⚠️ Why Not Gradients?

- **actions** are optimized, not network parameters  
- the cost function is highly **non-convex**  
- there may be **discontinuities and noise** in the dynamics  
- MPC breaks the end-to-end gradient  

👉 gradient-based methods become unstable

---

### 🧩 Intuition

> **Training = learn the world model**  
> **Planning = search for actions within this model**

---

### ✅ Summary

- LeWM is trained via **gradients**
- LeWM acts via **sampling (CEM)**

</details>

---

## Practical Numbers

In the paper's experiments, the following is used:

- 300 sampled action sequences per iteration;
- 30 optimization steps;
- the top-30 sequences as elites.

---

## CEM Limitations

The paper notes two key limitations:

1. in non-convex problems, there is no guarantee of reaching the global optimum;
2. CEM scales poorly in high-dimensional action spaces.

This is an important engineering remark: the quality of a world model does not yet guarantee easy online planning.

---

## 13. Complexity and Hyperparameter Simplicity

One of the strongest points of the paper is not just the good downstream result, but also the **simplicity of tuning**. For LeWM, only one main hyperparameter truly matters: the regularization weight $\lambda$. For PLDM, six weights must be tuned simultaneously. The authors explicitly compare:

- LeWM: essentially a one-dimensional tuning;
- PLDM: a multi-dimensional search over $6$ coefficients.

---

## Formal Interpretation

If $\lambda$ is searched using binary search or a bisection-like scheme over $n$ levels of precision, the complexity can be estimated as:

$$
O(\log n).
$$

For PLDM, with a brute-force search over 6 coefficients, this compares to:

$$
O(n^6).
$$

This is not a strict computational estimate of the full pipeline, but rather an argument about the **hyperparameter space**, explicitly emphasized in the paper.

---

## 14. Comparison with PLDM and DINO-WM

The paper positions LeWM as an intersection of desirable properties:

- **end-to-end**;
- **pixel-based**;
- **task-agnostic**;
- **reward-free**;
- **reconstruction-free**;
- **no frozen pre-trained encoder**;
- **provable anti-collapse guarantees** via SIGReg.

### DINO-WM
Uses frozen DINOv2 features, thus avoiding collapse through external pretraining, but does not learn visual representations end-to-end tailored to specific dynamics.

### PLDM
Trains end-to-end but relies on a complex objective:

$$
L_{\mathrm{PLDM}}
=
L_{\mathrm{pred}}
+ \alpha L_{\mathrm{var}}
+ \beta L_{\mathrm{cov}}
+ \gamma L_{\mathrm{time\text{-}sim}}
+ \zeta L_{\mathrm{time\text{-}var}}
+ \nu L_{\mathrm{time\text{-}cov}}
+ \mu L_{\mathrm{IDM}}.
$$

Where:

- $L_{\mathrm{var}}$ — variance regularization;
- $L_{\mathrm{cov}}$ — covariance regularization;
- $L_{\mathrm{time\text{-}sim}}$ — temporal similarity;
- $L_{\mathrm{time\text{-}var}}$ — temporal variance;
- $L_{\mathrm{time\text{-}cov}}$ — temporal covariance;
- $L_{\mathrm{IDM}}$ — inverse dynamics model term;
- $\alpha,\beta,\gamma,\zeta,\nu,\mu$ — balancing coefficients.

This formula is provided in the paper's appendix in the baseline PLDM section. It clearly demonstrates how much more mathematically compact LeWM is.

---

## 15. Benchmark Results and Why They Matter

The paper evaluates LeWM on four environments:

- **Two-Room**;
- **Reacher**;
- **Push-T**;
- **OGBench-Cube**.

The main result: LeWM achieves competitive or superior planning efficiency with a highly compact model of approximately $15$ million parameters, while planning up to **48× faster** than DINO-WM, with full planning taking less than a second.

---

## Why Planning Is Faster

The authors note that LeWM encodes an observation using approximately **200 times fewer tokens** than DINO-WM, and because of this, planning becomes much faster while maintaining strong quality. This is particularly important because for model-based control, planning time is just as critical as the world model's accuracy itself.

---

## Result Limitations

On **Two-Room**, LeWM underperforms, and the authors offer a clear explanation: the environment is too simple, its intrinsic dimensionality is small, and enforcing an isotropic Gaussian prior in a high-dimensional latent space may work less effectively. This is a strong point of the paper: the authors do not hide where their inductive prior might be excessive.

---

## 16. Probing: Does the Latent Space Actually Encode Physics?

A control success rate alone is not enough. It is possible to build a good planner even with a latent space that is not fully interpretable. Therefore, the paper additionally investigates whether **physical quantities** can be extracted from latent vectors. For this purpose, linear and nonlinear probes are trained.

![Figure 10](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-10.png)

---

## Formal Formulation

Let the latent be $z \in \mathbb{R}^d$, and let the physical quantity of interest be $y$.

Then the linear probe takes the form

$$
\hat y = W z + b.
$$

Where:

- $W$ is the linear mapping matrix;
- $b$ is the bias vector;
- $\hat y$ is the predicted physical quantity.

A nonlinear probe can be represented as an MLP:

$$
\hat y = f_{\psi}(z).
$$

Quality is evaluated using:

1. **MSE**
   $$
   \mathrm{MSE}
   =
   \frac{1}{n}\sum_{i=1}^{n} \lVert \hat y_i - y_i \rVert_2^2;
   $$

2. **Pearson correlation**
   $$
   r =
   \frac{\sum_{i=1}^{n}(\hat y_i-\bar{\hat y})(y_i-\bar y)}
   {\sqrt{\sum_{i=1}^{n}(\hat y_i-\bar{\hat y})^2}\sqrt{\sum_{i=1}^{n}(y_i-\bar y)^2}}.
   $$

Where:

- $n$ is the number of samples;
- $\bar y$, $\bar{\hat y}$ are the mean values.

---

## What the Results Showed

On Push-T, LeWM systematically outperforms PLDM in probing quality and remains competitive with DINO-WM, despite DINO-WM having a strong advantage from a pretrained foundation encoder. This indicates that LeWM indeed encodes essential physical variables into a compact latent space.

On Two-Room, probing shows that even where LeWM's planning is worse, the representation of the physical state is not necessarily inferior. This is an important conclusion: the issue may no longer lie in representation quality, but rather in the dynamics model or the planning setup.

---

## 17. Decoder and Reconstruction: Why It Is Not Needed in the Objective

The paper makes a crucial observation: adding a reconstruction loss does not improve downstream planning and may even degrade it. On Push-T, the model **without** a decoder loss achieved a higher success rate than the variant **with** a reconstruction loss.

---

## Formal Interpretation

If a reconstruction term were used, the overall objective could take the form:

$$
L = L_{\mathrm{pred}} + \lambda \,\mathrm{SIGReg}(Z) + \eta L_{\mathrm{rec}},
$$

where:

- $L_{\mathrm{rec}} = \lVert \hat o_t - o_t \rVert^2$ or a similar pixel-wise error;
- $\eta$ is the weight of the reconstruction term.

However, the experiment shows that this does not help. This means that a latent representation for control does not need to contain all visual details. Moreover, forcing pixel reconstruction may cause the model to encode redundant visual information that is irrelevant to control.

---

## 18. Latent Space Geometry: t-SNE and Decoding

Although LeWM is not trained with reconstruction, the paper shows that a decoder can be trained from a single latent vector to reasonably reconstruct the visual scene. This indicates that the compact latent does not lose the core physical structure of the scene. Additionally, t-SNE visualizations show that the embedding space preserves neighborhoods and relative positions of environment states.

---

## Geometric Interpretation

This can be understood as follows:

- the encoder does not need to explicitly reproduce pixels;
- but if the latent contains sufficient information about the environment's configuration, a weak decoder can extract a significant portion of it;
- therefore, the representation is sufficiently structured and informative.

From a mathematical perspective, this suggests that the mapping

$$
o_t \mapsto z_t
$$

preserves the essential degrees of freedom of the environment, even if it is not bijective with respect to all visual details.

---

## 19. Temporal Straightening: An Unexpected Property of Trajectories

One of the most interesting observations in the paper is **temporal latent path straightening**. The authors measure how collinear successive "velocities" in the latent space become. It turns out that during training, trajectories in the latent space become increasingly "straight," even though no explicit regularizer for straightness is used.

---

## Formal Formulation

Given a latent sequence

$$
z_{1:T} \in \mathbb{R}^{B \times T \times D}.
$$

Define velocity vectors:

$$
v_t = z_{t+1} - z_t.
$$

Where:

- $v_t$ is the change in the latent state between steps $t$ and $t+1$.

Then the straightness measure in the paper is defined as

$$
S_{\mathrm{straight}}
=
\frac{1}{B(T-2)}
\sum_{i=1}^{B}
\sum_{t=1}^{T-2}
\frac{
\langle v_t^{(i)}, v_{t+1}^{(i)} \rangle
}{
\lVert v_t^{(i)} \rVert \,\lVert v_{t+1}^{(i)} \rVert
}.
$$

Where:

- $\langle \cdot,\cdot \rangle$ is the dot product;
- the fraction represents the cosine similarity between adjacent velocity vectors;
- $S_{\mathrm{straight}} \approx 1$ indicates a nearly linear latent trajectory.

This corresponds to Equation (9) in the paper.

---

## Interpretation

If a trajectory in the latent space becomes straighter, then:

- the dynamics model becomes easier to extrapolate;
- planning in the latent space becomes geometrically more convenient;
- the world in representation space begins to resemble a smoother dynamical system.

The authors hypothesize that because SIGReg is applied across temporal slices but does not directly link time steps, the encoder gains the freedom to organize temporal evolution in an almost linear fashion. Surprisingly, this turns out to be beneficial rather than detrimental.

---

## 20. Violation of Expectation (VoE): Does the Model Detect “Unphysical” Behavior?

Another highly compelling section of the paper tests **intuitive physics** using violation-of-expectation. The idea is borrowed from developmental psychology: if the model has truly internalized physical laws, its surprise should sharply increase on "impossible" trajectories. The paper tests this using teleportation perturbations and visual perturbations.

---

## Formal Formulation

Surprise is measured as the discrepancy between the predicted future and the actually observed future. In its simplest interpretation, this can be written as the prediction error over time:

$$
\mathrm{Surprise}_t
=
\lVert \hat z_t - z_t \rVert_2^2
\quad\text{or}\quad
\lVert \hat o_t - o_t \rVert^2,
$$

depending on the evaluation level.

The paper graphically displays the MSE prediction error along the trajectory and compares:

1. unperturbed trajectory;
2. visual perturbation;
3. physical perturbation (teleportation).

---

## What the Experiment Showed

Physical violations—for example, teleporting an object—cause a noticeable spike in surprise. Moreover, this spike is statistically significant:

$$
p < 0.01
$$

in a paired t-test for teleportation perturbations. Meanwhile, visual perturbations, such as changing the cube's color, are noticeably weaker. This indicates that the model is more sensitive to **violations of physical continuity** than to purely superficial visual changes.

---

## Interpretation

This is a crucial property of a world model. A good world model should distinguish between:

- "the object changed color";
- "the object suddenly appeared in an impossible location".

LeWM demonstrates that the learned latent dynamics encode not only visual structure but also the **expected physical evolution of the scene**.

---

## 21. Ablations: What Truly Matters in LeWM

The paper investigates several ablation axes:

- number of random projections in SIGReg;
- number of integration knots;
- embedding dimensionality;
- predictor size;
- presence of a decoder loss;
- encoder type;
- predictor dropout.

---

## Ablation Findings

### 1. Internal SIGReg Parameters
The number of projections and integration knots has little impact on performance. This is a strong argument for the regularizer's robustness.

### 2. Embedding Dimensionality
A sufficiently large dimensionality is required, but performance saturates beyond that. Thus, the model does not require highly precise tuning of $d$.

### 3. Predictor Size
A ViT-S predictor offers the best trade-off. Reducing it degrades performance, while increasing it yields no additional benefit.

### 4. Decoder Loss
Adding a reconstruction objective degrades performance on Push-T.

### 5. Encoder Architecture
Both ViT and ResNet-18 perform competitively, with ViT slightly outperforming. This means the method is not rigidly tied to a single backbone.

### 6. Predictor Dropout
The best results are achieved with moderate dropout $p=0.1$. Both too low and too high dropout perform worse.

---

## 22. Mathematical Meaning of the Entire Architecture as a Unified System

![Figure 11](/warp-zone-folio/blog/leworldmodel/Infographic/EN/Figure-11.png)

We can now assemble everything into a single logical chain.

LeWM builds the world model in three stages:

1. **Compressing observations into a latent state**  
   $$
   z_t = \mathrm{enc}_\theta(o_t).
   $$

2. **Modeling dynamics in latent space**  
   $$
   \hat z_{t+1} = \mathrm{pred}_\phi(z_t, a_t).
   $$

3. **Forcing the latent distribution toward a non-collapsing geometry**  
   $$
   P_Z \approx \mathcal N(0, I)
   $$
   via SIGReg.

In other words, the entire model is built on joint optimization:

$$
\min_{\theta,\phi}
\left[
\underbrace{
\lVert \hat z_{t+1} - z_{t+1} \rVert_2^2
}_{\text{dynamic alignment}}
+
\lambda
\underbrace{
\frac{1}{M}\sum_{m=1}^M T(h^{(m)})
}_{\text{latent space structuring}}
\right].
$$

Where:

- the first term makes the representation useful for prediction;
- the second prevents the representation from collapsing;
- together, they yield a latent space suitable for planning.

---

## The Paper's Conceptual Formula

If we express the core idea of LeWM as a single conceptual equation, it becomes:

$$
\text{useful latent world model}
=
\text{predictability}
+
\text{geometric non-collapse}.
$$

In other words, the paper demonstrates that stable end-to-end world modeling from pixels does not require a complex mix of heuristics, provided one chooses a **simple yet theoretically grounded geometry for the latent variable distribution**.

---

## 23. Limitations of the Paper

The authors fairly honestly discuss the limitations:

1. planning currently remains short-horizon;
2. the offline dataset must adequately cover the environment's dynamics;
3. SIGReg may perform worse in very simple environments with low intrinsic dimensionality;
4. the model relies on action labels;
5. future directions include hierarchical world models and inverse dynamics-based future action representations.

---

## Formal Interpretation of the Short-Horizon Problem

If the model is rolled out over a long horizon $H$, the error accumulates recursively:

$$
\hat z_{t+1} = \mathrm{pred}_\phi(\hat z_t, a_t),
$$

and a small error

$$
\epsilon_t = \hat z_t - z_t
$$

can propagate further:

$$
\epsilon_{t+1}
=
\mathrm{pred}_\phi(\hat z_t, a_t)
-
\mathrm{pred}_\phi(z_t, a_t)
+
\text{model bias}.
$$

Over long horizons, this can lead to the rollout trajectory diverging from the real dynamics. Therefore, MPC here is not merely an engineering detail, but a fundamental mechanism for bounding error.

---

## 24. Final Conclusion

LeWorldModel is a highly representative work for the broader JEPA/world models lineage, as it demonstrates the following:

1. **JEPA can be trained end-to-end from pixels** without freezing an external encoder.  
2. **Collapse can be avoided without a suite of heuristics** by structuring the latent space via Gaussian-matching regularization.  
3. **Planning can be fast** if the dynamics model operates in a compact latent space.  
4. **Signs of physical understanding can emerge** without explicitly training the model on reconstruction or rewards.

---

## Final Summary in a Single Formula

The entire paper boils down to the following chain:

$$
o_t
\;\xrightarrow{\mathrm{enc}_\theta}\;
z_t
\;\xrightarrow[\text{cond. on } a_t]{\mathrm{pred}_\phi}\;
\hat z_{t+1}
\;\xrightarrow{\text{planning / probing / VoE}}\;
\text{control \& physics understanding}.
$$

At the same time, training is guided by a single unified objective:

$$
L_{\mathrm{LeWM}}
=
\underbrace{\lVert \hat z_{t+1} - z_{t+1}\rVert_2^2}_{\text{learning dynamics}}
+
\lambda
\underbrace{\mathrm{SIGReg}(Z)}_{\text{preventing latent collapse}}.
$$

It is precisely this mathematical simplicity—not at the expense of, but in favor of, practical robustness—that constitutes the main scientific contribution of the work.

---

# 25. Source

Citation (BibTeX)

```
@article{leworldmodel2026,
  author    = {Maes, Lucas and Le Lidec, Quentin and Scieur, Damien and LeCun, Yann and Balestriero, Randall},
  title     = {LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels},
  year      = {2026},
}
```