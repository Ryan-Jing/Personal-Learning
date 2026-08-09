import type { Note, Source } from "./library";

const probRoboticsEst: Source = {
  title: "Probabilistic Robotics",
  publisher: "Thrun, Burgard & Fox, MIT Press",
  url: "https://mitpress.mit.edu/9780262201629/probabilistic-robotics/",
  kind: "Book",
};

const welchBishopKf: Source = {
  title: "An Introduction to the Kalman Filter",
  publisher: "Welch & Bishop, UNC-Chapel Hill TR 95-041",
  url: "https://www.cs.unc.edu/~welch/media/pdf/kalman_intro.pdf",
  kind: "Reference",
};

const barShalomEstimation: Source = {
  title: "Estimation with Applications to Tracking and Navigation",
  publisher: "Bar-Shalom, Li & Kirubarajan, Wiley",
  url: "https://onlinelibrary.wiley.com/doi/book/10.1002/0471221279",
  kind: "Book",
};

const yagerOwa: Source = {
  title: "On Ordered Weighted Averaging Aggregation Operators",
  publisher: "Ronald Yager, IEEE Trans. Systems, Man, and Cybernetics",
  url: "https://ieeexplore.ieee.org/document/87068",
  kind: "Reference",
};

export const sensorFusionEstimationNotes: Note[] = [
  {
    slug: "weighted-average-fusion",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Weighted-average fusion: inverse variance & OWA",
    summary: "The simplest fusion that provably works: why averaging N sensors cuts variance by N, why inverse-variance weights are optimal when sensors differ, and the ordered weighted averaging family — orness, entropy, and maximum-entropy OWA — for rank-based combining.",
    readingTime: 17,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Averaging is fusion's free lunch",
        body: [
          "Start with the cleanest multi-sensor setup: M sensors observe the same process, each reading the true value plus independent, identically distributed zero-mean Gaussian noise — the competitive configuration with equal-quality sensors. Simply averaging the readings already fuses: the mean passes through unchanged (each sensor is unbiased, so their average is), while the noise terms partially cancel. The arithmetic that makes this precise uses two properties of variance: scaling a variable by a scales its variance by a², and the variance of a sum of independent variables is the sum of their variances. The average of N noise terms therefore has variance (1/N²)·(N·σ²) = σ²/N — averaging N equal sensors divides the noise variance by N, shrinking the standard deviation by √N. Four sensors halve the noise; a hundred cut it tenfold. This √N law is the quantitative backbone of redundancy, and its fine print matters: the gain assumes the noises are independent — correlated noise (all sensors sharing a temperature drift or a supply ripple) does not cancel, which is why common-mode error sources cap what redundancy can buy.",
        ],
      },
      {
        type: "formula",
        heading: "Inverse-variance weighting: the optimal unequal average",
        formula: "ŷ = Σ wᵢyᵢ / Σ wᵢ,   wᵢ = 1/σᵢ²      Var[ŷ] = 1 / Σ (1/σᵢ²)  ≤  min σᵢ²",
        explanation: "When sensors have different (known) noise variances, the equal average is no longer best — it lets the noisiest sensor drag the estimate. Weighting each reading by the inverse of its variance is the minimum-variance unbiased linear combination: precise sensors get large weights, noisy ones small, and the normalization keeps the estimate unbiased. The fused variance is the reciprocal of the summed precisions (precision = 1/σ²), which is always at most the best single sensor's variance — adding even a mediocre sensor never hurts, it just helps little. This formula is the recurring motif of the whole subject: the Gaussian-Bayes posterior and the Kalman update are both, at heart, inverse-variance weighted averages between a prior and a measurement.",
        terms: [
          { symbol: "wᵢ = 1/σᵢ²", meaning: "Precision weight from the sensor model's variance", unit: "—" },
          { symbol: "Var[ŷ]", meaning: "Fused variance — reciprocal of summed precisions", unit: "—" },
          { symbol: "σ²/N", meaning: "Equal-sensor special case", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Where the weights come from, and what can go wrong",
        body: [
          "The weights are not free parameters — they are the error variances measured during sensor modeling, which is why honest sensor characterization matters so much: an understated σ² makes the fusion over-trust a noisy sensor and the 'optimal' average worse than ignoring it. Variances can also be state-dependent (a rangefinder noisier at long range), making the weights functions of the operating point rather than constants — the fusion then needs the sensor model's variance map, not a single number. And the independence assumption deserves standing suspicion: two sensors of the same type, on the same supply, in the same thermal environment share error components that no weighting scheme cancels.",
          "Estimator-level fusion is the same mathematics one level up: instead of fusing raw readings, fuse the outputs of several complete estimators (each perhaps its own sensor-plus-model chain), weighting by each estimator's error variance measured on reference data. The magnet-orientation case study does exactly this — three sensors each produce an angle estimate through their own calibrated model, the per-estimator error variances are measured, and inverse-variance fusion produces an estimate with lower variance than any single sensor achieves.",
        ],
      },
      {
        type: "prose",
        heading: "Ordered weighted averaging: weighting by rank, not identity",
        body: [
          "Inverse-variance weighting assigns weights by sensor identity. Ordered weighted averaging (OWA) assigns them by rank: each source provides an estimate yᵢ and a ranking quantity qᵢ (its current variance, its number of sub-measurements, the age of its data); sort the estimates by their ranking quantity; then apply a fixed weight vector to the sorted list — the first weight always goes to the best-ranked estimate, whichever sensor that happens to be this time. The weights are nonnegative and sum to one. OWA interpolates between the classical operators by choice of weight vector: all weight on the first element gives the MAX operator, all on the last gives MIN, uniform weights give the plain mean. It shines when which sensor is best changes with conditions — the fusion policy stays fixed while the sensors rotate through the ranks.",
          "Two scalar measures characterize a weight vector. Orness Ω(w) = (1/(n−1))·Σ(n−i)wᵢ measures how much the operator resembles MAX (orness 1) versus MIN (orness 0) — an 'optimism' dial: high orness leans on the top-ranked estimates, low orness hedges toward the worst case. Entropy H(w) = −Σ wᵢ ln wᵢ measures how uniformly the weights spread — how many sources genuinely participate. The two are in tension: extreme orness concentrates weight (low entropy), and a given orness can be achieved by many weight vectors of differing entropy.",
        ],
      },
      {
        type: "formula",
        heading: "Maximum-entropy OWA (MEOWA)",
        formula: "w* = argmax_w −Σ wᵢ ln wᵢ   s.t.   Ω(w) = Ω*,   Σwᵢ = 1,   0 ≤ wᵢ ≤ 1",
        explanation: "Designing an OWA system reduces to two choices: how to compute ranking quantities, and what weight vector to use. MEOWA answers the second principledly — specify the desired orness Ω* (how optimistic the fusion should be) and solve for the weights that maximize entropy subject to that orness. Maximum entropy is the least-commitment principle: among all weight vectors with the required optimism, choose the one that spreads weight most evenly, encoding no preference beyond what the orness constraint demands. The constrained optimization has a known analytical structure (the weights form a geometric-like progression), and the result is a fusion operator with exactly the designed optimism and no accidental extra structure.",
        terms: [
          { symbol: "Ω*", meaning: "Designed orness (MAX-likeness), 0–1", unit: "—" },
          { symbol: "H(w)", meaning: "Entropy — uniformity of participation", unit: "nats" },
          { symbol: "qᵢ", meaning: "Ranking quantity (variance, age, count…)", unit: "—" },
        ],
      },
      {
        type: "table",
        heading: "The weighted-averaging family",
        columns: ["Method", "Weights assigned by", "Optimal when", "Watch out for"],
        rows: [
          ["Equal average", "Nothing — uniform", "Sensors identical, noise iid", "One bad sensor drags everyone; √N assumes independence"],
          ["Inverse variance", "Sensor identity (known σᵢ²)", "Variances known and honest", "Understated σ² over-trusts; correlated errors don't cancel"],
          ["OWA", "Rank under a quantity qᵢ", "Best sensor changes with conditions", "Weight semantics depend on ranking design"],
          ["MEOWA", "Rank, with max-entropy weights at set orness", "Want principled optimism dial", "Orness choice is a design judgment, not data"],
        ],
      },
      {
        type: "callout",
        heading: "√N is a ceiling, not a promise",
        body: "The variance-over-N law holds only for independent noise. Sensors sharing a supply, a temperature, a mounting, or a calibration source share error components that averaging cannot touch — adding more of the same sensor then buys almost nothing. Before multiplying sensors, ask what error sources are common-mode; diversity of mechanism (different physics, different failure modes) buys more than multiplicity of copies.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Weighted-fusion review",
        items: [
          "Verify the independence assumption before counting on the σ²/N gain; identify common-mode error sources.",
          "Weight by inverse variance using honestly measured sensor-model variances; update weights if σ² is state-dependent.",
          "Fuse at estimator level the same way: measure each estimator's error variance on reference data.",
          "Use OWA when sensor quality shifts with conditions: rank by a designed quantity, weight by rank.",
          "Characterize weight vectors by orness (optimism) and entropy (participation); design with MEOWA for a chosen orness.",
          "Confirm the fused variance beats the best single sensor — if not, a variance estimate is lying.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Derive the variance of an N-sensor average.", answer: "ŷ = x + (1/N)Σηᵢ. Scaling by 1/N scales variance by 1/N²; summing N independent noises sums variances to Nσ². So Var = (1/N²)(Nσ²) = σ²/N — standard deviation falls as √N, and only for independent noise." },
          { question: "Why are inverse-variance weights optimal, and what is the fused variance?", answer: "They form the minimum-variance unbiased linear combination: each sensor weighted by its precision 1/σᵢ². The fused variance is 1/Σ(1/σᵢ²) — the reciprocal of summed precisions — always ≤ the best individual sensor's variance." },
          { question: "How does OWA differ from inverse-variance weighting?", answer: "Inverse-variance ties weights to sensor identity; OWA ties them to rank: estimates are sorted by a ranking quantity (variance, age, sub-measurement count) and a fixed weight vector applies to the sorted list — the first weight always hits the currently-best source." },
          { question: "What do orness and entropy measure, and what does MEOWA do?", answer: "Orness measures MAX-likeness (optimism: weight on top ranks); entropy measures weight uniformity (how many sources participate). MEOWA maximizes entropy subject to a designed orness — the least-committal weights with exactly the chosen optimism." },
        ],
      },
    ],
    sources: [yagerOwa, barShalomEstimation],
    related: ["sensor-models-and-least-squares", "bayesian-filtering-fundamentals", "fuzzy-logic-and-inference", "sensor-fusion-case-studies"],
  },
  {
    slug: "bayesian-filtering-fundamentals",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Bayesian filtering: grids to Gaussians",
    summary: "Estimation as belief over states: grid-based Bayes filters that multiply likelihood grids, the Markov assumption and the prediction integral, and the Gaussian shortcut whose closed-form posterior — a precision-weighted blend with gain K — is the seed of the Kalman filter.",
    readingTime: 18,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "From point estimates to beliefs",
        body: [
          "The estimation problem: a state x (a position, a temperature, a pose) is observed through measurements z = h(x) + noise at discrete times, and the goal is the best possible estimate of the state — leveraging every measurement so far, not just the latest. The Bayesian move is to maintain not a point estimate but a belief: a full probability density over the state, updated as measurements arrive. Bayes' rule is the update engine: the posterior p(x|z) is proportional to the likelihood p(z|x) — the sensor model evaluated at the observed measurement — times the prior p(x), what was believed before. The evidence denominator is just normalization, recoverable at any time because a density must integrate to one; this is why implementations track the proportional shape and normalize last.",
          "The most direct implementation discretizes the state space onto a grid: each cell holds the probability that the state lies there, normalized so the cells sum to one. The update is beautifully mechanical — compute the likelihood of the observed measurement for each cell's state value, multiply the prior grid by the likelihood grid elementwise, renormalize. Independent measurements compound the same way: because p(z₁,z₂|x) = p(z₁|x)·p(z₂|x), each sensor contributes one more elementwise multiplication — fusion across sensors and fusion across time are literally the same operation. A grid filter handles any distribution shape (multimodal, skewed, ring-shaped), which makes it the right tool when a single sensor leaves genuine ambiguity — a range-only sensor's likelihood over 2D position is an annulus, and only the product with other rings and constraints collapses it to a spot.",
        ],
      },
      {
        type: "diagram",
        heading: "The grid update, pictorially",
        intro: "One Bayesian update on a discretized state space:",
        art: "  Prior grid p(x)        Likelihood grid p(z|x)       Posterior grid p(x|z)\n  +---+---+---+---+      +---+---+---+---+           +---+---+---+---+\n  | . | . | + | . |      | . | + | + | . |           | . | . | * | . |\n  | . | + | # | + |  (x) | . | + | # | + |    -->    | . | + | # | + |\n  | . | . | + | . |      | . | . | + | . |  multiply | . | . | + | . |\n  +---+---+---+---+      +---+---+---+---+  & renorm +---+---+---+---+\n\n  ( # high probability, + medium, . low — cells multiply elementwise,\n    then the whole grid is rescaled to sum to 1 )",
        caption: "Belief times likelihood, cell by cell, then renormalize. Extra independent sensors — or the next time step's measurement — are additional elementwise multiplications: fusion over sensors and over time share one mechanism.",
      },
      {
        type: "prose",
        heading: "Time: the Markov assumption and the prediction integral",
        body: [
          "Tracking a moving state needs a prior for each new instant, and two options exist. An uninformed prior (all cells equal) encodes no knowledge beyond the measurements — correct but wasteful, discarding everything learned so far. The timeseries prior instead carries belief forward through a process model: under the Markov assumption — the current state depends only on the previous state, not the whole history — the predicted prior is p(xₖ) = ∫ p(xₖ|xₖ₋₁)·p(xₖ₋₁) dxₖ₋₁, the previous belief pushed through the transition density. Read it as an expectation: the new prior is the average of 'where could the state go from xₖ₋₁' over everywhere the state might have been. This integral is the predict step; the Bayes multiplication is the update step; alternating them forever is the recursive Bayes filter, the template every filter in this collection instantiates.",
          "Grids pay for their generality at exactly this step: prediction couples every cell to every cell (an O(n²) sweep over the discretization, per dimension), and grid resolution trades accuracy against memory and time exponentially in state dimension. For the many problems whose belief stays unimodal — one dominant hypothesis with symmetric spread — an enormous shortcut exists: parameterize the belief as a Gaussian and track only two moments, the mean and the (co)variance. The distribution is then two numbers (or a vector and a matrix) instead of a grid, and both filter steps become closed-form moment arithmetic.",
        ],
      },
      {
        type: "formula",
        heading: "The Gaussian fusion formulas",
        formula: "K = σ₀²/(σ₀² + σ₁²)      mean: x₀ + K(x₁ − x₀)      variance: (1 − K)σ₀²      (vector: K = Σ₀(Σ₀+Σ₁)⁻¹)",
        explanation: "When prior (moments x₀, σ₀²) and measurement likelihood (moments x₁, σ₁²) are both Gaussian, the posterior is Gaussian with these closed-form moments — no grids, no integrals. The gain K is the fraction of trust given to the measurement: a huge prior variance (you knew little) drives K→1 and the posterior jumps to the measurement; a huge measurement variance drives K→0 and the measurement is ignored. The posterior mean is the prior nudged toward the measurement by K times the disagreement; the posterior variance shrinks by (1−K) — information only ever tightens the belief. Expanding K shows this is exactly the inverse-variance weighted average of the weighted-fusion note: precision adds, and the blend weights each input by its certainty. The multivariate version replaces divisions with matrix inverses and reads identically.",
        terms: [
          { symbol: "K", meaning: "Gain — trust fraction assigned to the measurement", unit: "0–1" },
          { symbol: "x₁ − x₀", meaning: "Disagreement (innovation) between measurement and prior", unit: "state units" },
          { symbol: "(1−K)σ₀²", meaning: "Posterior variance — always ≤ prior variance", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "The recursive Gaussian filter",
        body: [
          "Assemble the pieces and the complete recursive filter appears. Objective: the belief b(xₖ) = p(xₖ | z₁:ₖ) — the state given all measurements up to now. Applying Bayes to the newest measurement and the Markov assumption to the history yields the recursion b(xₖ) ∝ p(zₖ|xₖ)·∫ p(xₖ|xₖ₋₁)·b(xₖ₋₁) dxₖ₋₁: the new belief is the sensor likelihood times the previous belief propagated through the process model. Every term is available — the likelihood from the sensor model built in calibration, the transition density from the process model, the previous belief from the last cycle — so the filter runs forever on two alternating steps: predict (marginalize the previous belief forward through the dynamics, inflating uncertainty) and update (multiply in the measurement, shrinking uncertainty by the Gaussian formulas above).",
          "With Gaussian parameterization the entire belief lives in a mean and covariance, so predict and update are a handful of matrix operations per cycle — constant memory, constant time, indefinitely. What remains is only to specify the two models concretely for linear dynamics and linear measurements, and to name the resulting moment equations. That is precisely the Kalman filter, and the next note derives it as nothing more than this recursion written out.",
        ],
      },
      {
        type: "table",
        heading: "Grid filters vs Gaussian filters",
        columns: ["Aspect", "Grid (histogram) filter", "Gaussian filter"],
        rows: [
          ["Belief representation", "Probability per cell", "Mean + covariance only"],
          ["Distribution shapes", "Anything — multimodal, rings, skew", "Unimodal, symmetric only"],
          ["Update cost", "O(cells) multiply + renormalize", "Closed-form moment formulas"],
          ["Predict cost", "O(cells²) coupling sweep", "Matrix arithmetic"],
          ["Dimensional scaling", "Exponential in state dimension", "Polynomial (matrix ops)"],
          ["Natural fit", "Ambiguous, multi-hypothesis problems", "Well-localized tracking"],
        ],
      },
      {
        type: "callout",
        heading: "The gain K is the whole story",
        body: "Every Bayesian fusion of two Gaussian opinions reduces to one number: K = σ₀²/(σ₀²+σ₁²), the fraction of trust the new evidence earns, set entirely by relative variances. Posterior mean = prior + K·(disagreement); posterior variance = (1−K)·prior. Understand this scalar case cold and the Kalman filter's matrix equations become bookkeeping around an idea you already own.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Bayesian-filtering review",
        items: [
          "Maintain beliefs, not point estimates; track the proportional shape and normalize last.",
          "Build likelihood grids from the calibrated sensor model; multiply independent sensors elementwise.",
          "Invoke the Markov assumption to carry belief forward: predict = marginalize through the process model.",
          "Alternate predict (uncertainty grows) and update (uncertainty shrinks) — the universal filter template.",
          "Use grids when belief is genuinely multimodal; switch to Gaussian moments when it is unimodal.",
          "Internalize K = σ₀²/(σ₀²+σ₁²) and the posterior formulas — the seed of the Kalman filter.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How does a grid Bayes filter update on a measurement, and how do multiple sensors enter?", answer: "Evaluate the sensor model's likelihood at each cell's state value, multiply the prior grid elementwise, renormalize so cells sum to one. Independent sensors factor — p(z₁,z₂|x) = p(z₁|x)p(z₂|x) — so each is one more elementwise multiplication; time steps compound identically." },
          { question: "State the prediction integral and the assumption behind it.", answer: "p(xₖ) = ∫ p(xₖ|xₖ₋₁)·p(xₖ₋₁)dxₖ₋₁ — the previous belief pushed through the transition density; equivalently the expectation of the process model over the old belief. It requires the Markov assumption: the current state depends only on the previous state." },
          { question: "Give the Gaussian posterior moments and interpret K.", answer: "K = σ₀²/(σ₀²+σ₁²); mean = x₀ + K(x₁−x₀); variance = (1−K)σ₀². K is the trust fraction for the measurement, set by relative variances — uncertain prior → K→1 (jump to measurement); noisy sensor → K→0 (ignore it). It is an inverse-variance weighted average." },
          { question: "Why abandon grids for Gaussians, and what does it cost?", answer: "Grid prediction is O(cells²) and resolution scales exponentially with state dimension; a Gaussian belief is just a mean and covariance with closed-form updates — constant cost forever. The price: only unimodal, symmetric beliefs can be represented — multimodal ambiguity is lost." },
        ],
      },
    ],
    sources: [probRoboticsEst, welchBishopKf],
    related: ["sensor-fusion-foundations", "weighted-average-fusion", "kalman-filter", "sensor-fusion-case-studies"],
  },
  {
    slug: "kalman-filter",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "The Kalman filter",
    summary: "The recursive Gaussian filter made concrete: linear process and sensor models, discretizing continuous dynamics, the predict and update equations with the Kalman gain, fusing multiple sensors and multiple motion models, and the tuning craft of Q, R, and the innovation.",
    readingTime: 20,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Two models in, optimal filter out",
        body: [
          "The Kalman filter is the recursive Gaussian Bayes filter specialized to linear models, and it is fully determined by two model equations. The process model describes how the state evolves: xₖ = A_d·xₖ₋₁ + B_d·uₖ + wₖ, with w ~ N(0, Q) — linear dynamics driven by a known input u plus zero-mean Gaussian process noise capturing everything the model doesn't. The sensor model describes what is observed: zₖ = C·xₖ + vₖ, with v ~ N(0, R) — measurements are a linear map of the state plus sensor noise, whose R is precisely the variance measured during sensor characterization. Under these assumptions the Gaussian belief propagates exactly, and the filter is the optimal (minimum-variance) estimator — not merely a good heuristic.",
          "The discrete matrices come from the physical, continuous dynamics. A linear system ẋ = Ax + Bu discretized over timestep Δt gives exactly A_d = e^{AΔt} and B_d = A⁻¹(e^{AΔt} − I)B; for short timesteps the first-order approximation A_d ≈ I + AΔt is standard. The classic kinematic examples are worth knowing cold: the constant-velocity model with state [p, v] has A_d = [[1, Δt],[0, 1]]; constant-acceleration with [p, v, a] adds the ½Δt² term. A position sensor then has C = [1, 0, 0] — the measurement picks position out of the state — and the filter's estimates of the unmeasured velocity and acceleration states emerge from the correlations the process model builds into P: this is how a filter 'measures' what no sensor touches.",
        ],
      },
      {
        type: "diagram",
        heading: "The predict–update cycle",
        intro: "Notation: x̂ₖ|ₖ₋₁ is the estimate for time k using measurements through k−1 (prior); x̂ₖ|ₖ uses measurements through k (posterior).",
        art: "                 +-----------------------------+\n   posterior     |          PREDICT            |    prior\n   x̂(k-1|k-1) -->|  x̂(k|k-1) = Ad·x̂ + Bd·u     |--> x̂(k|k-1)\n   P(k-1|k-1)    |  P(k|k-1) = Ad·P·Adᵀ + Q    |    P(k|k-1)\n                 +-----------------------------+       |\n                                                       v\n                 +-----------------------------+    UPDATE\n   measurement   |  K = P·Cᵀ(C·P·Cᵀ + R)⁻¹     |\n   z(k), R  ---->|  x̂(k|k) = x̂ + K(z − C·x̂)    |--> posterior x̂(k|k), P(k|k)\n                 |  P(k|k) = (I − K·C)·P       |         |\n                 +-----------------------------+         |\n                        ^                                |\n                        +--------- next timestep --------+",
        caption: "Predict pushes the belief through the dynamics (uncertainty grows by Q); update corrects it with the measurement (uncertainty shrinks through K). The loop runs forever on a mean vector and a covariance matrix.",
      },
      {
        type: "formula",
        heading: "The five equations",
        formula: "Predict:  x̂ₖ|ₖ₋₁ = A_d x̂ₖ₋₁|ₖ₋₁ + B_d uₖ,   Pₖ|ₖ₋₁ = A_d Pₖ₋₁|ₖ₋₁ A_dᵀ + Q      Update:  K = Pₖ|ₖ₋₁Cᵀ(CPₖ|ₖ₋₁Cᵀ + R)⁻¹,   x̂ₖ|ₖ = x̂ₖ|ₖ₋₁ + K(zₖ − Cx̂ₖ|ₖ₋₁),   Pₖ|ₖ = (I − KC)Pₖ|ₖ₋₁",
        explanation: "Predict is the moment arithmetic of pushing a Gaussian through linear dynamics: the mean follows the model exactly; the covariance is rotated and scaled by A_d (the sandwich A_d P A_dᵀ) and inflated by Q — prediction always adds uncertainty. Update is the Gaussian fusion formula of the previous note projected through the measurement map: CPCᵀ + R is the predicted measurement's total uncertainty (state uncertainty as seen by the sensor, plus sensor noise), the innovation zₖ − Cx̂ is the disagreement between what was measured and what the prior predicted would be measured, and the gain K distributes that disagreement back into the state in proportion to how uncertain the prior was relative to the sensor. Every term has the same reading as the scalar K = σ₀²/(σ₀²+σ₁²): trust is allocated by relative variance.",
        terms: [
          { symbol: "zₖ − Cx̂ₖ|ₖ₋₁", meaning: "Innovation — measurement minus predicted measurement", unit: "meas. units" },
          { symbol: "CPCᵀ + R", meaning: "Innovation covariance S — total predicted measurement uncertainty", unit: "—" },
          { symbol: "Q / R", meaning: "Process / measurement noise covariances — the tuning knobs", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Multiple sensors and multiple motion models",
        body: [
          "The filter extends naturally along both of its model axes. Multiple sensors: each sensor i brings its own measurement map Cᵢ and noise Rᵢ, and each gets its own gain in a combined update — equivalently (and often more simply), because the update is just Bayes, sensors can be applied sequentially within a timestep, each one's posterior serving as the next one's prior. This is the practical fusion pattern for heterogeneous sensors at different rates: predict to each measurement's timestamp, update with whichever sensor fired. The recursive structure is the point — the filter is always ready to absorb whatever evidence arrives next.",
          "Multiple motion models address the opposite uncertainty: not knowing how the target moves. A tracked object is autonomous — its maneuvers are unknown to the tracker — so a bank of candidate models runs in parallel: constant velocity (good for cruising), constant acceleration (good for maneuvers, at the cost of noisier estimates when cruising), and correlated-acceleration models of the Singer type that treat acceleration as a decaying random process, spanning the space between. Each model produces its own prior; the interacting multiple model (IMM) scheme updates each against the measurement, maintains a probability for each model based on how well its predictions match the innovations, and outputs a probability-weighted combination. The result adapts its dynamics assumption to the target's behavior — tight tracking during cruise, responsive tracking during maneuver — without committing to either.",
        ],
      },
      {
        type: "prose",
        heading: "Tuning: Q, R, and listening to the innovation",
        body: [
          "In practice the filter's quality is decided by its covariances. R is the honest one — measured sensor noise variance from characterization; inventing R instead of measuring it wastes the entire calibration effort. Q is the design knob: it encodes how much the state can change between steps beyond what the model predicts — unmodeled forces, disturbances, maneuvering. Small Q says 'trust the model': smooth estimates, sluggish response to real changes, and the risk that P collapses until measurements are effectively ignored. Large Q says 'trust the measurements': responsive but noisy estimates that track sensor jitter. Common practice shapes Q from the discretized effect of a white acceleration noise (so its structure follows the kinematics) and tunes its scale.",
          "The innovation sequence is the filter's built-in diagnostic. If the models and covariances are right, innovations should be zero-mean, white (uncorrelated in time), and consistent with their predicted covariance S = CPCᵀ + R — roughly, normalized innovations should look like unit-variance noise. Biased innovations reveal model error (wrong dynamics, sensor bias); correlated innovations reveal an under-tuned Q (the filter keeps being surprised the same way); innovations chronically larger than S predicts mean the filter is overconfident — the classic prelude to divergence, where P shrinks, gains collapse, and the filter serenely ignores reality. Checking innovation statistics against S (and, with ground truth, normalized estimation error against P) is the filter engineer's equivalent of margin testing: it verifies not just that estimates look good, but that the filter's confidence is calibrated.",
        ],
      },
      {
        type: "table",
        heading: "Reading the filter's behaviour",
        columns: ["Symptom", "Likely cause", "Adjustment"],
        rows: [
          ["Estimates lag real changes", "Q too small — over-trusting the model", "Increase Q; consider a maneuvering model / IMM"],
          ["Estimates jitter with sensor noise", "Q too large or R understated", "Decrease Q; re-measure R honestly"],
          ["Innovations biased (nonzero mean)", "Model error: wrong dynamics or sensor bias", "Fix the model; add bias states"],
          ["Innovations autocorrelated", "Dynamics mismatch being re-discovered each step", "Raise Q or improve the process model"],
          ["Innovations exceed S; divergence", "Overconfident filter (P collapsed)", "Raise Q; check A_d, C; verify R"],
          ["Unmeasured states drift", "Weak observability through C and dynamics", "Add a sensor that constrains them; revisit state choice"],
        ],
      },
      {
        type: "callout",
        heading: "R is measured; Q is designed; the innovation judges both",
        body: "Get R from sensor characterization — it is data, not a knob. Tune Q as the explicit statement of how much you distrust your own dynamics model. Then let the innovation sequence audit the result: zero-mean, white, S-consistent innovations are the certificate that the filter's confidence matches reality. A filter that is never surprised has usually stopped listening.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Kalman-filter review",
        items: [
          "Write the two models first: (A_d, B_d, Q) from discretized dynamics; (C, R) from sensor characterization.",
          "Know the five equations and the meaning of every term — especially innovation and its covariance S.",
          "Discretize properly: A_d = e^{AΔt}; know CV/CA kinematic models by heart.",
          "Fuse multiple sensors sequentially within a step, each with its own Cᵢ, Rᵢ; predict to each timestamp.",
          "Use model banks (CV/CA/Singer, IMM) when target dynamics are unknown or switching.",
          "Tune Q for the model-trust trade; verify with innovation statistics (zero-mean, white, S-consistent).",
          "Watch for divergence: collapsing P with growing real error means Q or the models are lying.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Write the Kalman predict and update equations and interpret K.", answer: "Predict: x̂ₖ|ₖ₋₁ = A_d x̂ + B_d u; P = A_d P A_dᵀ + Q. Update: K = PCᵀ(CPCᵀ+R)⁻¹; x̂ₖ|ₖ = x̂ + K(z − Cx̂); P = (I−KC)P. K allocates the innovation to the state in proportion to prior uncertainty versus sensor noise — the matrix form of σ₀²/(σ₀²+σ₁²)." },
          { question: "How does the filter estimate states no sensor measures?", answer: "The process model correlates states (position integrates velocity), and those correlations live in P's off-diagonals. A position measurement, through K, therefore corrects velocity and acceleration too — the filter infers unmeasured states from measured ones via the dynamics." },
          { question: "What do Q and R each represent, and where do they come from?", answer: "R is the sensor's noise covariance — measured during characterization, not invented. Q is process noise: how much the state can deviate from the model per step (disturbances, maneuvers) — a design parameter, often shaped from white-acceleration kinematics and scale-tuned." },
          { question: "What should a healthy innovation sequence look like, and what do violations mean?", answer: "Zero-mean, white, and consistent with S = CPCᵀ + R. Bias → model or sensor error; autocorrelation → dynamics mismatch (raise Q or fix the model); chronically large innovations → overconfident filter heading for divergence." },
          { question: "Why run multiple motion models, and how does IMM combine them?", answer: "A tracked target's maneuvers are unknown — CV is tight in cruise, CA responds in maneuvers, Singer-type models span between. IMM runs a bank, scores each model by innovation likelihood, and outputs the probability-weighted blend — adapting the dynamics assumption online." },
        ],
      },
    ],
    sources: [welchBishopKf, barShalomEstimation, probRoboticsEst],
    related: ["bayesian-filtering-fundamentals", "nonlinear-filters-ekf-ukf-particle", "imu-and-orientation-estimation", "motor-control-fundamentals", "sensor-fusion-case-studies"],
  },
];
