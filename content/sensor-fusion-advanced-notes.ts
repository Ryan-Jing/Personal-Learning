import type { Note, Source } from "./library";

const julierUkf: Source = {
  title: "Unscented Filtering and Nonlinear Estimation",
  publisher: "Julier & Uhlmann, Proceedings of the IEEE",
  url: "https://ieeexplore.ieee.org/document/1271397",
  kind: "Reference",
};

const probRoboticsAdv: Source = {
  title: "Probabilistic Robotics",
  publisher: "Thrun, Burgard & Fox, MIT Press",
  url: "https://mitpress.mit.edu/9780262201629/probabilistic-robotics/",
  kind: "Book",
};

const madgwickReport: Source = {
  title: "An Efficient Orientation Filter for Inertial and Inertial/Magnetic Sensor Arrays",
  publisher: "Sebastian Madgwick, University of Bristol",
  url: "https://x-io.co.uk/downloads/madgwick_internal_report.pdf",
  kind: "Reference",
};

const ahrsDocs: Source = {
  title: "AHRS: Attitude and Heading Reference Systems — filter documentation",
  publisher: "Mayitzin (ahrs.readthedocs.io)",
  url: "https://ahrs.readthedocs.io/en/latest/filters/madgwick.html",
  kind: "Documentation",
};

const zadehFuzzy: Source = {
  title: "Fuzzy Sets",
  publisher: "Lotfi Zadeh, Information and Control",
  url: "https://www.sciencedirect.com/science/article/pii/S001999586590241X",
  kind: "Reference",
};

const matlabFuzzy: Source = {
  title: "Fuzzy Logic Toolbox — Mamdani and Sugeno Systems",
  publisher: "MathWorks",
  url: "https://www.mathworks.com/help/fuzzy/mamdani-and-sugeno-fuzzy-inference-systems.html",
  kind: "Documentation",
};

const goodfellowDl: Source = {
  title: "Deep Learning",
  publisher: "Goodfellow, Bengio & Courville, MIT Press",
  url: "https://www.deeplearningbook.org/",
  kind: "Book",
};

const mitDeepLearning: Source = {
  title: "6.7960 Deep Learning — lecture notes",
  publisher: "MIT OpenCourseWare",
  url: "https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/",
  kind: "Course",
};

export const sensorFusionAdvancedNotes: Note[] = [
  {
    slug: "nonlinear-filters-ekf-ukf-particle",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Nonlinear filters: EKF, UKF & particle filter",
    summary: "What breaks when models go nonlinear, the EKF's Jacobian linearization and its failure modes, the unscented transform's sigma-point alternative, and the particle filter that drops the Gaussian assumption entirely through sampling, importance weighting, and resampling.",
    readingTime: 20,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Nonlinearity breaks the Gaussian contract",
        body: [
          "The Kalman filter rests on two assumptions: Gaussian distributions and linear models. Most engineering systems violate the second — a pendulum's dynamics carry sin(θ), a rangefinder's response is hyperbolic in distance, a bearing sensor involves atan2 — and the violation is structural: pushing a Gaussian through a nonlinear function does not yield a Gaussian. The mean of the output is not the function of the input mean; the output can skew, curve, even split. The nonlinear filter family is a sequence of increasingly honest answers to one question — how do you propagate a mean and covariance (or a whole distribution) through f(x) and h(x) when the exact answer is no longer closed-form?",
          "The general nonlinear models are xₖ = f(xₖ₋₁, uₖ) + wₖ and zₖ = h(xₖ) + vₖ, with the same Gaussian noise terms as before. Everything that follows keeps the two-step predict/update template of the Bayes filter; the filters differ only in how they approximate the moment propagation through f and h.",
        ],
      },
      {
        type: "formula",
        heading: "EKF: linearize locally with the Jacobian",
        formula: "A_k = ∂f/∂x |x̂ₖ₋₁|ₖ₋₁      C_k = ∂h/∂x |x̂ₖ|ₖ₋₁      then run the standard KF equations with x̂ = f(x̂), ẑ = h(x̂), and A_k, C_k in the covariance/gain terms",
        explanation: "The extended Kalman filter — developed for and flown in the Apollo program — approximates f and h by first-order Taylor expansion around the current estimate: f(x) ≈ f(x̂) + A·(x − x̂), where A is the Jacobian matrix of partial derivatives evaluated at the estimate. Means propagate through the true nonlinear functions (x̂ₖ|ₖ₋₁ = f(x̂), ẑ = h(x̂)); covariances propagate through the linearization (P → A P Aᵀ + Q), because the variance of a linearly-transformed Gaussian is exactly the sandwich formula. The pendulum makes it concrete: state [θ, θ̇], dynamics [θ̇, −(g/ℓ)sin θ], Jacobian [[0, 1], [−(g/ℓ)cos θ, 0]] — re-evaluated at every step because the linearization moves with the estimate. The EKF is cheap and everywhere, but its guarantees are gone: optimality is lost, the linearization is only as good as the function is locally straight, and the covariance is systematically underestimated — the filter grows overconfident, and overconfidence compounding over steps is the classic route to divergence.",
        terms: [
          { symbol: "∂f/∂x", meaning: "Process Jacobian — n×n partials at the estimate", unit: "—" },
          { symbol: "∂h/∂x", meaning: "Measurement Jacobian at the predicted state", unit: "—" },
          { symbol: "APAᵀ + Q", meaning: "Covariance projection through the linearization", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "UKF: sample the distribution, not the derivative",
        body: [
          "The unscented Kalman filter starts from an empirical observation: it is easier to approximate a distribution than a nonlinear function. Instead of linearizing, the unscented transform picks a small, deterministic set of sigma points that jointly encode the current mean and covariance — 2n+1 points for an n-dimensional state: the mean itself, plus a pair along each principal axis of the covariance, placed at ±√(n+λ) times the matrix square root (Cholesky factor L, or eigenvector scaling), with matched mean-weights and covariance-weights. Each sigma point is pushed through the true nonlinear function — no derivatives anywhere — and the transformed points' weighted sample mean and covariance become the predicted moments. The spread parameter (α, with λ = (α²−1)n, plus β = 2 for Gaussian priors) tunes how far the points probe the function's curvature.",
          "The UKF's update step mirrors the KF structurally but computes every ingredient from the transformed sigma points: the predicted measurement is the weighted mean of h(sigma points); the innovation covariance S adds R to their weighted spread; the state-measurement cross-covariance replaces PCᵀ; and the gain is K = C^{xz}S⁻¹ with the covariance update P = P − KSKᵀ. The practical wins over the EKF: accuracy to second order rather than first (means match to third order for Gaussian inputs), no Jacobians to derive or debug — a genuine engineering advantage for messy models — and better-behaved covariances on strongly curved functions. The cost: 2n+1 function evaluations per step and a Cholesky factorization, plus the sigma-point parameters to choose. When a system is nearly linear both filters agree; as curvature grows, the UKF degrades gracefully where the EKF degrades confidently.",
        ],
      },
      {
        type: "prose",
        heading: "Particle filter: drop the Gaussian entirely",
        body: [
          "When the belief itself is non-Gaussian — multimodal (several candidate locations), heavily skewed, or wrapped (angles) — parameterizing it with a mean and covariance discards exactly the structure that matters. The particle filter represents the belief as a population of samples: M candidate states (particles), each with an importance weight. It generalizes the UKF's insight to its limit — the sigma points become thousands of random samples, and the Gaussian bookkeeping disappears entirely. Any distribution a histogram can represent, a particle cloud can represent, including the noise distributions: process and sensor noise need only be sampleable and evaluable, not Gaussian.",
          "The cycle is the Bayes filter enacted by a population. Predict: draw M particles from the current set with replacement, with probability proportional to weight (resampling — concentrating the population where probability mass lives), then simulate each forward through the process model with independently sampled process noise, spreading the population per the dynamics' uncertainty. Update: evaluate each particle's likelihood under the sensor model at the observed measurement, set the new importance weights proportional to likelihood (normalized to sum to one), and output the weighted mean (and spread) of the population as the estimate. The visual: a cloud of hypotheses drifts and diffuses with the motion model, then the measurement re-scores the cloud, resampling culls the implausible and multiplies the plausible, and over cycles the cloud tracks the state — splitting across ambiguous hypotheses and collapsing when evidence disambiguates, which is precisely what no Gaussian filter can do.",
        ],
      },
      {
        type: "diagram",
        heading: "One particle-filter cycle",
        art: "  particles + weights           resample                simulate forward\n  o    O    o   O  o      -->   O O O O o        -->    O  O   O  O  o\n  (size = weight)               (heavy particles         (each moved by f(x)+w,\n                                 duplicated, light        cloud spreads per\n                                 ones dropped)            process noise)\n                                        |\n                                        v\n                                weight by likelihood p(z|x)\n                                O    o    O    .    o\n                                        |\n                                        v\n                        estimate = weighted mean of the cloud",
        caption: "Resample → simulate → reweight: the Bayes filter's predict and update, performed by a population of hypotheses. The cloud's shape is the belief — multimodal, skewed, or wrapped as the problem demands.",
      },
      {
        type: "prose",
        heading: "Particle-filter practicalities",
        body: [
          "Two failure modes dominate practice. Weight degeneracy: without resampling, after a few cycles one particle carries nearly all the weight and the rest are computational dead weight — resampling exists to fight this, and implementations track the effective sample size (roughly 1/Σwᵢ²) to decide when to resample rather than doing it blindly every step. Sample impoverishment is resampling's own side effect: aggressive resampling duplicates a few parents until diversity collapses, especially with low process noise — mitigations include resampling only when the effective sample size drops, and roughening (adding small jitter to duplicated particles). Particle count trades accuracy against compute linearly, and the curse of dimensionality applies: the particles needed to cover a state space grow exponentially with its dimension, which is why particle filters shine in low-dimensional, ambiguous problems (2-D/3-D localization) and struggle as full-state filters for high-dimensional systems.",
          "Choosing among the family is an engineering decision with a clean decision tree: linear models → Kalman filter (it is optimal; nothing beats it there). Mildly nonlinear, unimodal → EKF (cheapest, ubiquitous, needs derivable models and watchfulness for divergence). Strongly nonlinear, still unimodal → UKF (derivative-free, second-order accurate, modest extra cost). Multimodal or non-Gaussian belief, low-dimensional state → particle filter (represents anything, costs the most). The hybrid patterns matter too: marginalized/Rao-Blackwellized filters run particles over the nonlinear few states and Kalman filters over the linear rest.",
        ],
      },
      {
        type: "table",
        heading: "The nonlinear filter family",
        columns: ["Filter", "Handles nonlinearity by", "Belief form", "Cost", "Fails when"],
        rows: [
          ["KF", "— (linear only)", "Gaussian", "One matrix pass", "Models are nonlinear"],
          ["EKF", "Jacobian linearization at the estimate", "Gaussian", "+ Jacobian evaluations", "Strong curvature; overconfidence → divergence"],
          ["UKF", "Sigma points through the true function", "Gaussian", "2n+1 evaluations + Cholesky", "Belief genuinely non-Gaussian/multimodal"],
          ["Particle", "Sampling the full distribution", "Arbitrary (particle cloud)", "M simulations + likelihoods", "High-dimensional states; impoverishment"],
        ],
      },
      {
        type: "callout",
        heading: "The EKF fails confidently",
        body: "First-order covariance projection systematically underestimates uncertainty on curved functions — the EKF's error bars shrink faster than its errors do, gains collapse, and the filter ignores the measurements that would save it. Monitor innovation consistency, inflate Q where curvature is strong, and reach for the UKF when Jacobians are painful or the linearization is visibly bending: the sigma points cost little and honor the curvature the derivative cannot see.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Nonlinear-filter review",
        items: [
          "Write f and h explicitly; identify where their curvature is strong over the operating envelope.",
          "For the EKF: derive Jacobians, re-evaluate them at every step, and monitor innovation consistency for overconfidence.",
          "For the UKF: generate 2n+1 sigma points from the Cholesky factor, propagate through the true functions, reconstruct moments with mean/covariance weights.",
          "For the particle filter: resample by effective sample size, simulate with sampled process noise, weight by sensor likelihood.",
          "Guard against degeneracy (resample) and impoverishment (conditional resampling, roughening).",
          "Choose by the decision tree: linear→KF, mild→EKF, curved→UKF, multimodal/low-D→particle.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How does the EKF handle nonlinear models, and what are its three known problems?", answer: "Means propagate through the true f and h; covariances propagate through first-order Taylor linearizations (Jacobians evaluated at the estimate) via APAᵀ+Q. Problems: optimality is lost, covariance is systematically underestimated (→ overconfidence and divergence), and strong nonlinearity violates the Gaussian assumption outright." },
          { question: "What is the unscented transform?", answer: "Approximate the distribution, not the function: choose 2n+1 deterministic sigma points (mean ± scaled columns of the covariance's Cholesky factor) with mean/covariance weights, push each through the true nonlinear function, and take the weighted sample mean and covariance of the results — derivative-free, second-order accurate." },
          { question: "Walk one particle-filter cycle.", answer: "Resample M particles with probability proportional to weight; simulate each through the process model with sampled noise (predict); evaluate each particle's sensor-model likelihood at the measurement and normalize into new weights (update); output the weighted mean. The cloud is the belief — it can be multimodal." },
          { question: "What are degeneracy and impoverishment, and their mitigations?", answer: "Degeneracy: weights collapse onto one particle — fight with resampling, triggered by effective sample size 1/Σw². Impoverishment: resampling clones few parents until diversity dies — mitigate with conditional resampling and roughening jitter on duplicates." },
        ],
      },
    ],
    sources: [julierUkf, probRoboticsAdv],
    related: ["kalman-filter", "imu-and-orientation-estimation", "bayesian-filtering-fundamentals", "sensor-fusion-case-studies"],
  },
  {
    slug: "imu-and-orientation-estimation",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "IMUs & orientation estimation",
    summary: "What an IMU measures and why MEMS noise looks the way it does, the four representations of rotation and why orientation resists naive integration, quaternion kinematics, and the fusion filters — Madgwick's gradient-descent update and the complementary-filter idea — that keep attitude honest.",
    readingTime: 20,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Three sensors in one package, one estimation problem",
        body: [
          "An inertial measurement unit bundles three triaxial sensors: an accelerometer (linear acceleration, including gravity), a gyroscope (angular velocity), and often a magnetometer (magnetic field). Its defining application is estimating spatial orientation — attitude — plus detecting motion and vibration. MEMS construction dominates: a proof mass on springs whose deflection is read capacitively, with higher-grade alternatives (ring-laser and fiber-optic gyros exploiting the Sagnac effect) reserved for navigation-grade budgets. The MEMS physics shapes the noise you fight: thermal expansion and hysteresis of the springs produce bias (a slowly wandering offset), while the mass-spring resonance and supply electrical noise produce zero-mean Gaussian noise on top. That decomposition — bias plus white noise — is the standard IMU error model and the reason gyro-only orientation drifts without bound.",
          "Orientation is observable because two reference directions are known in the world frame: gravity (the accelerometer, when the sensor is not accelerating, reports a constant vector opposite Earth's pull) and magnetic North (the magnetometer reports Earth's field, whose local direction is known from magnetic models). One vector fixes two rotational degrees of freedom; the second nails the third (heading). The gyroscope, meanwhile, measures how orientation changes. The entire attitude-estimation problem is fusing these: fast-but-drifting rate integration corrected by slow-but-absolute reference directions — the complementary structure every attitude filter shares, and precisely the gyro-plus-aiding hierarchy the drone-platform note leans on.",
        ],
      },
      {
        type: "table",
        heading: "Four representations of orientation",
        columns: ["Representation", "Form", "Strength", "Weakness"],
        rows: [
          ["Rotation matrix", "3×3 matrix of body-axis directions", "Easiest to physically interpret; rotates vectors by multiplication", "9 numbers, 6 constraints; renormalization is awkward"],
          ["Euler angles (yaw/pitch/roll)", "Three ordered rotations about body axes", "Easiest to store and read; human-friendly", "Gimbal lock, angle jumps, order ambiguity (six conventions)"],
          ["Axis-angle", "Vector v = θ·û (axis û, angle θ)", "Easiest motion to interpret; minimal (3 numbers)", "Awkward composition; Rodrigues formula to apply"],
          ["Quaternion", "q = w + xi + yj + zk, |q| = 1", "Simplest numerical methods; smooth, no gimbal lock", "Not human-readable; double-cover (q and −q same rotation)"],
        ],
      },
      {
        type: "prose",
        heading: "Why orientation is genuinely hard",
        body: [
          "Rotations refuse to behave like vectors, in two specific ways. They do not commute: yaw-then-pitch-then-roll lands differently than roll-then-pitch-then-yaw, so 'adding' rotations in the wrong order is simply wrong — a property scalar addition never prepared you for. And they alias: yaw γ and yaw γ+2π are the same orientation, Euler-angle triples wrap and jump, and at pitch ±90° gimbal lock collapses a degree of freedom — yaw and roll become the same rotation, and naive angle arithmetic near that configuration produces wild, meaningless swings. Quaternions exist precisely to fix this: extending complex numbers to three imaginary units (i² = j² = k² = −1), a unit quaternion represents orientation smoothly and without singularities, the same way a unit complex number represents planar angle continuously where the raw angle θ wraps. Rotating a vector is the conjugation v' = q*vq; composition is quaternion multiplication; the only maintenance is renormalizing to unit modulus against numerical drift.",
          "The subtler trap is integration. It is tempting to integrate the gyro's angular velocity into Euler angles directly — and it is wrong, because at each instant the gyro reports rates about the current body axes, and that frame itself rotates as the body moves. Angular velocity integrates on the rotation manifold, not in angle coordinates. The clean formulation is the quaternion kinematic equation: q̇ = ½·Ω(ω)·q, where Ω is the 4×4 skew matrix assembled from the body rates. First-order integration — qₖ₊₁ = qₖ + Δt·½·Ω·qₖ, renormalize — is the workhorse of every AHRS: cheap, singularity-free, and exactly what runs inside flight controllers at kilohertz rates.",
        ],
      },
      {
        type: "formula",
        heading: "Quaternion rate integration",
        formula: "q̇ = ½ Ω(ω) q,   Ω = [[0, −ωx, −ωy, −ωz], [ωx, 0, ωz, −ωy], [ωy, −ωz, 0, ωx], [ωz, ωy, −ωx, 0]]      qₖ₊₁ = normalize( qₖ + Δt·½·Ω·qₖ )",
        explanation: "The quaternion derivative is linear in the current quaternion, with the body-frame angular velocity packed into the skew-symmetric Ω matrix — the rotational analogue of integrating position along a circle's tangent in Cartesian coordinates rather than adding raw angles. Each step advances the quaternion along the manifold's tangent and renormalizes back onto the unit sphere. This predict step inherits the gyro's virtues and vices: it is smooth, fast, and correct over short horizons, and it drifts without bound as gyro bias integrates — which is why every practical filter pairs it with an absolute correction from reference vectors.",
        terms: [
          { symbol: "ω", meaning: "Body-frame angular velocity from the gyro", unit: "rad/s" },
          { symbol: "Ω(ω)", meaning: "4×4 skew matrix of the rates", unit: "—" },
          { symbol: "normalize", meaning: "Rescale to |q| = 1 every step", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "The Madgwick filter: gradient descent against reference vectors",
        body: [
          "The Madgwick algorithm is the widely-used lightweight fusion of gyro integration with accelerometer (and optionally magnetometer) correction, structured exactly as predict/update. Predict: integrate the gyro via the quaternion kinematics above. Update: exploit that the reference directions are known in the Earth frame — gravity points down, magnetic North has a known direction from the world magnetic model — so the current quaternion predicts what the accelerometer and magnetometer should read; the error e(q) between predicted and measured reference directions (the reference rotated into the sensor frame by q*dq, minus the actual measurement) is a cost to minimize. Madgwick's move is a single gradient-descent step per sample: compute the Jacobian of the error with respect to the quaternion, step opposite the normalized gradient with a step size γ, renormalize. The analytic error vector and Jacobian for the gravity update are small closed-form expressions — a handful of multiplies — which is why the filter runs comfortably on microcontrollers.",
          "The step size γ is the filter's single tuning knob, and it is exactly a complementary-filter crossover in disguise: large γ trusts the accelerometer (fast bias correction, but linear accelerations — which the accelerometer cannot distinguish from gravity — leak into attitude), small γ trusts the gyro (smooth through dynamics, slower drift correction). This is the complementary-filter idea in general: blend a high-rate signal that is good at high frequency (gyro integration) with an absolute signal that is good at low frequency (gravity/mag direction), each covering the other's weakness — the same architecture whether implemented as Madgwick's gradient step, a classical fixed-gain complementary filter, or a full EKF with bias states. The engineering failure modes are shared too: sustained linear acceleration corrupts the gravity reference (centripetal acceleration in a turn tilts the 'down' the filter sees), and magnetic disturbances corrupt heading — the toilet-bowling mechanism of the drone notes, now with its algorithmic root exposed.",
        ],
      },
      {
        type: "diagram",
        heading: "Attitude filter structure",
        art: "  gyro ω  ──────────────►  Quaternion       q(k|k-1)   ┌──────────────────┐\n  (fast, drifts)           integration  ─────────────► │  Update step:     │\n                           q̇ = ½Ωq                     │  rotate reference │──► q(k|k)\n                                                       │  d_E into sensor  │     posterior\n  accel a (gravity ref) ──────────────────────────────►│  frame, compare,  │     orientation\n  mag m (North ref)   ────────────────────────────────►│  gradient-descend │\n  (slow, absolute)                                     └──────────────────┘",
        caption: "Every attitude estimator shares this shape: fast gyro integration predicts; slow absolute references (gravity, magnetic North) correct. The blend ratio — Madgwick's γ, a complementary crossover, or a Kalman gain — sets how drift correction trades against dynamic disturbance rejection.",
      },
      {
        type: "callout",
        heading: "The references are only conditionally true",
        body: "The accelerometer measures gravity only when the sensor isn't accelerating — in a coordinated turn or a hard launch, 'down' lies. The magnetometer measures Earth's field only away from currents and iron — near power wiring it lies. Robust attitude systems gate or de-weight the corrections when reference validity is doubtful (acceleration magnitude far from 1 g, field magnitude far from local norm) and coast on the gyro through the disturbance.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Orientation-estimation review",
        items: [
          "Model IMU error as bias (slow, from spring thermal/hysteresis physics) plus zero-mean Gaussian noise.",
          "Pick the representation for the job: matrices to reason, Euler to display, quaternions to compute.",
          "Never integrate body rates into Euler angles; integrate q̇ = ½Ωq and renormalize each step.",
          "Correct drift with reference vectors: gravity for tilt, magnetic North (world-model direction) for heading.",
          "Tune the blend (γ / crossover / gain) as the gyro-vs-reference trust trade.",
          "Gate corrections when references are invalid: |a| ≠ 1 g, magnetic anomalies.",
          "Respect the double cover (q ≡ −q) and renormalization in any quaternion code you write.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why can't you integrate gyro rates into Euler angles directly?", answer: "The gyro reports rates about the current body axes, and that frame rotates with the body — angular velocity lives on the rotation manifold, not in angle coordinates. Integrate the quaternion kinematics q̇ = ½Ω(ω)q (renormalizing each step) instead." },
          { question: "Compare the four orientation representations in one line each.", answer: "Rotation matrix: easiest to physically show, 9 redundant numbers. Euler angles: easiest to store/read, but gimbal lock, jumps, and order ambiguity. Axis-angle: easiest motion to interpret, awkward to compose. Quaternion: simplest numerics — smooth, singularity-free, needs renormalization and tolerates the q/−q double cover." },
          { question: "How does the Madgwick update correct gyro drift?", answer: "Known Earth-frame references (gravity, magnetic North) are rotated by the current quaternion into the sensor frame and compared with the actual accel/mag readings; the mismatch defines an error whose Jacobian gives a gradient, and one normalized gradient-descent step of size γ per sample pulls the quaternion toward agreement." },
          { question: "What is the complementary-filter principle, and where do attitude filters break?", answer: "Blend a signal good at high frequency (gyro integration — smooth, drifts) with one good at low frequency (reference vectors — absolute, noisy/conditional); each covers the other's weakness. They break when references lie: sustained linear acceleration tilts the gravity reference, magnetic disturbance corrupts heading — hence validity gating." },
        ],
      },
    ],
    sources: [madgwickReport, ahrsDocs],
    related: ["kalman-filter", "nonlinear-filters-ekf-ukf-particle", "drone-platform-electronics", "vibration-environmental-and-flight-testing", "sensor-fusion-case-studies"],
  },
  {
    slug: "fuzzy-logic-and-inference",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Fuzzy sets, logic & inference systems",
    summary: "Reasoning with vague propositions: membership functions and α-cuts, the T-norm/S-norm families generalizing AND and OR, defuzzification, Mamdani vs Sugeno inference, Type-II sets for uncertain memberships — and where fuzzy fusion earns its place beside probability.",
    readingTime: 19,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Degrees of truth, not probabilities of truth",
        body: [
          "Classical propositions are true or false: 'today is Wednesday,' 'the voltage exceeds 500 mV.' Human reasoning routinely runs on propositions that are true to a degree: 'the voltage is higher than usual,' 'the room is warm.' Fuzzy logic formalizes this — modeling linguistic, imprecise reasoning with vague statements — and it is worth separating cleanly from probability at the outset: probability quantifies uncertainty about a crisp fact (the voltage either exceeds 500 mV or not; we may not know which), while fuzziness quantifies partial membership in a vague category (22 °C simply is 'warm' to degree 0.6 and 'mild' to degree 0.4 — no experiment resolves it further). The two are complementary tools, and fusion systems use both: probabilistic filters for state estimation, fuzzy systems for turning graded evidence into decisions and weights.",
          "The core object is the fuzzy set: a universe of discourse 𝒳 paired with a membership function μ: 𝒳 → [0,1] assigning each element its degree of membership — 0 outside, 1 fully in, anything between partially in. A crisp set is the special case where μ only takes 0 and 1. The standard membership shapes are triangular, trapezoidal, and Gaussian, and a linguistic variable like temperature carries several overlapping sets (cold, mild, hot) whose memberships sum to a soft partition of the range. The vocabulary that recurs: the support (where μ > 0), the core (where μ = 1), height (the supremum of μ — a normalized set reaches 1), width, the α-cut (elements with μ ≥ α, turning a fuzzy set back into a crisp one at any threshold), and convexity (no dips between any two points — memberships along a line between x and y never fall below the smaller endpoint membership).",
        ],
      },
      {
        type: "prose",
        heading: "T-norms and S-norms: families of AND and OR",
        body: [
          "Fuzzy logic needs AND and OR that operate on degrees, and the generalizations are axiomatic families rather than single formulas. A T-norm (fuzzy AND / intersection) is any function T(a,b) that is commutative, associative, monotonic, bounded by T(a,1) = a and T(a,0) = 0 — and every T-norm lies between the drastic product (the pointwise smallest) and the minimum (the pointwise largest). The everyday members: Gödel minimum min(a,b), the product ab, the Łukasiewicz norm max(a+b−1, 0), plus nilpotent-minimum and Hamacher variants. S-norms (fuzzy OR / union) are their duals through ⊥(a,b) = 1 − T(1−a, 1−b): maximum max(a,b), the probabilistic sum a+b−ab, the bounded sum min(a+b, 1), and the Einstein sum among them.",
          "The choice of norm pair is a modeling decision with visible consequences: min/max propagate the single dominant membership untouched (decisions have flat plateaus; a rule is exactly as true as its weakest condition), while product/probabilistic-sum let every condition contribute multiplicatively (smoother, more compromise-shaped outputs) — the same input memberships can rank options differently under the two pairs. On binary inputs every T-norm reproduces the classical AND truth table and every S-norm the OR table; the families only diverge in between, which is exactly where fuzzy systems live.",
        ],
      },
      {
        type: "diagram",
        heading: "The fuzzy inference pipeline",
        art: "  crisp inputs (sensor values)\n        |\n        v\n  +--------------+     +-----------------+     +--------------+     +----------------+\n  | FUZZIFY      | --> | RULE EVALUATION | --> | AGGREGATE    | --> | DEFUZZIFY      |\n  | memberships  |     | IF x is A AND   |     | combine rule |     | centroid /     |\n  | mu_A(x) ...  |     | y is B THEN ... |     | outputs      |     | bisector / MOM |\n  +--------------+     | (T/S-norms)     |     | (max, sum)   |     +----------------+\n                       +-----------------+                                 |\n                                                                           v\n                                                                  crisp output (action,\n                                                                  weight, command)",
        caption: "Fuzzification turns measurements into degrees of membership; rules combine them with T/S-norms; aggregation merges the fired rules; defuzzification collapses the result to one actionable number. Mamdani systems defuzzify a fuzzy output set; Sugeno systems skip to a weighted sum of per-rule crisp outputs.",
      },
      {
        type: "prose",
        heading: "Mamdani vs Sugeno, and defuzzification",
        body: [
          "A fuzzy inference system automates the pipeline: fuzzify the measurements into memberships, evaluate a rule base ('IF home is COLD THEN INCREASE heat'), aggregate the fired rules, and defuzzify to a single crisp action. The two canonical architectures differ at the output. A Mamdani system's rules output fuzzy sets: each rule's firing strength clips or scales its consequent membership function, aggregation overlays them (typically by max), and a defuzzification operator collapses the composite shape — the centroid (center of mass, the standard choice), the bisector (equal areas either side), or the maximum family (smallest/middle/largest of maximum). Mamdani is the interpretable one — every rule and output reads as language — at the cost of computing centroids over membership functions. A Sugeno system's rules output crisp values directly: each rule carries a candidate output (a constant or a linear function of the inputs) and a degree of applicability λ (the AND of its condition memberships), and the system output is simply the applicability-weighted average of the candidates — no defuzzification integral, guaranteed continuity of output in input, low cost. The division of labor is conventional wisdom: Mamdani for human-like decision-making where interpretability matters, Sugeno for continuous control and anywhere a smooth, cheap surface is the goal.",
          "Type-II fuzzy sets add a second level of honesty: if the membership function itself is uncertain (experts disagree where 'warm' begins), interval Type-II sets bound it between a lower and upper membership function, the region between them being the footprint of uncertainty, and the same logic runs with interval arithmetic; general Type-II extends the idea with a full distribution over memberships. The cost is computation; the payoff is robustness when the linguistic model itself is contested.",
        ],
      },
      {
        type: "prose",
        heading: "Fuzzy fusion in practice",
        body: [
          "Where does this earn a place in a fusion system? Wherever graded, rule-shaped knowledge must become weights or decisions and a full probabilistic model is unavailable or overkill. The canonical pattern — used in the barometer case study — computes a running certainty estimate per sensor (say, the inverse of windowed noise variance), fuzzifies each into low/medium/high certainty sets, applies a rule base ('IF sensor 1 certainty is HIGH and others LOW, THEN weight 1 HIGH…'), and defuzzifies into fusion weights for a weighted-sum combination. The result behaves like inverse-variance weighting where the statistics are good and like an expert's judgment where they are not — and every rule remains inspectable, which matters in systems that must be reviewed. The fuzzy layer is also a natural home for heterogeneous evidence that resists a common probabilistic footing: vision confidence scores, link quality, temperature derating, and staleness can all be fuzzified onto one commensurate [0,1] scale and combined by rules.",
        ],
      },
      {
        type: "table",
        heading: "Mamdani vs Sugeno",
        columns: ["Aspect", "Mamdani", "Sugeno"],
        rows: [
          ["Rule output", "Fuzzy set (clipped/scaled membership)", "Crisp value: constant or linear in inputs"],
          ["Final step", "Aggregate then defuzzify (centroid…)", "Applicability-weighted average"],
          ["Interpretability", "High — reads as language", "Lower — outputs are functions"],
          ["Output continuity", "Not guaranteed", "Continuous in inputs"],
          ["Cost", "Centroid integral over memberships", "Cheap weighted sum"],
          ["Natural home", "Human-like decision making", "Continuous control surfaces"],
        ],
      },
      {
        type: "callout",
        heading: "Fuzziness is not probability",
        body: "Probability says 'this crisp statement is true with chance p'; membership says 'this statement is true to degree μ' — vagueness that no further data resolves. Confusing them leads to double-counting uncertainty or defending fuzzy weights as if they were calibrated likelihoods. Use probability where you have distributions and want optimality; use fuzzy inference where you have linguistic, graded rules and want inspectable decisions — and be explicit about which regime each block of your system is in.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Fuzzy-systems review",
        items: [
          "Define universes of discourse and overlapping membership functions per linguistic variable; know support, core, height, α-cuts.",
          "Choose the T/S-norm pair deliberately (min/max vs product/probabilistic-sum) and note the behavioral difference.",
          "Structure the FIS: fuzzify → rules → aggregate → defuzzify; pick centroid unless there is a reason otherwise.",
          "Choose Mamdani for interpretability, Sugeno for continuous, cheap control outputs.",
          "Reach for interval Type-II sets when the membership functions themselves are contested.",
          "Use fuzzy weight generation for fusion when evidence is graded and rule-shaped; compare against inverse-variance weights as a sanity check.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How does fuzziness differ from probability?", answer: "Probability quantifies uncertainty about crisp facts (true-or-false, unknown which); membership quantifies degree of belonging to a vague category — 22 °C is 'warm' to degree 0.6, and no experiment sharpens it. They answer different questions and coexist in one system." },
          { question: "What are T-norms and S-norms, and name the common pairs.", answer: "Axiomatic generalizations of AND and OR to degrees: T-norms (commutative, associative, monotonic, T(a,1)=a) bounded between drastic and min; S-norms their duals via 1−T(1−a,1−b). Common pairs: min/max, product/probabilistic-sum (a+b−ab), Łukasiewicz/bounded-sum." },
          { question: "Contrast Mamdani and Sugeno inference.", answer: "Mamdani rules output fuzzy sets, aggregated then defuzzified (centroid/bisector/max family) — interpretable, costlier, continuity not guaranteed. Sugeno rules output crisp constants or linear functions weighted by applicability — cheap, continuous, suited to control; less linguistic." },
          { question: "Give the fuzzy sensor-fusion pattern.", answer: "Estimate per-sensor certainty (e.g. inverse windowed noise variance), fuzzify into low/med/high sets, run a rule base mapping certainty patterns to weight levels, defuzzify into fusion weights, and combine sensors by normalized weighted sum — inspectable weighting that mimics inverse-variance where statistics hold." },
        ],
      },
    ],
    sources: [zadehFuzzy, matlabFuzzy],
    related: ["weighted-average-fusion", "neural-networks-for-sensor-fusion", "sensor-fusion-case-studies"],
  },
  {
    slug: "neural-networks-for-sensor-fusion",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Neural networks for sensor fusion",
    summary: "The multilayer perceptron as a universal function approximator: layers and activations, loss functions (MSE, cross-entropy, softmax), gradient descent and backpropagation, the optimizer family, and the workflow discipline — data analysis, normalization, splits, early stopping — that decides whether any of it works.",
    readingTime: 20,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "When to reach for a network",
        body: [
          "Neural networks earn their place where relationships are too complex, too high-dimensional, or too poorly understood for analytical models or simple regression: estimating a quantity from image pixels, fusing many heterogeneous features whose interactions defy hand modeling. They are universal function approximators — compact machines for computing values of functions impractical to derive — and within a fusion system they slot in exactly where the linear sensor models sat: mapping raw or preprocessed sensor data to estimates or class probabilities, trained on the same supervised datasets, evaluated with the same splits and metrics. The lifecycle is unchanged too: pre-training (collect data, choose architecture, optimize parameters) then frozen inference. What changes is expressiveness — and the corresponding weight of the workflow discipline needed to keep that expressiveness honest.",
          "A caveat the linear notes earn back here: a network can only fit functions. A many-to-one mapping is fine; a one-to-many relation — the same input demanding different outputs — is not a function, and no architecture fixes ill-posed data. Feature selection determines whether the mapping from chosen inputs to targets is well-defined at all; when two identical feature vectors carry different labels, the missing discriminating feature is the problem, not the network.",
        ],
      },
      {
        type: "prose",
        heading: "The multilayer perceptron",
        body: [
          "The MLP is a series of simple blocks. A linear (dense, fully-connected) layer computes z = Wx + b — trainable weights and bias. An activation function applies an elementwise nonlinearity: sigmoid 1/(1+e⁻ᶻ) squashing to (0,1), tanh to (−1,1), ReLU max(0,z), and leaky ReLU which keeps a small slope αz for negative inputs (curing ReLU's dead-unit problem). A perceptron layer is the pair a = σ(Wx + b); stacking layers makes the network, the intermediate dimensions being the hidden units. The nonlinearity is the whole point: a stack of purely linear layers collapses to one linear map, while interleaved nonlinearities let compositions build arbitrarily complex functions.",
          "Universal function approximation makes that precise: a two-layer network can approximate any continuous function on a bounded region (Stone–Weierstrass reasoning), and error bounds tighten with sufficient hidden units. But the theorem says nothing about efficiency, and there the deep-vs-wide trade lives: wide-shallow networks may need exponentially many units to match what depth composes cheaply, train more parallelizably, and are easier to optimize; deep networks approximate compositional structure with far fewer parameters but pay in sequential computation and trickier training. Each unit's contribution is geometrically legible — one sigmoid unit is a soft ramp across a hyperplane; sums of ramps build ridges, bumps, and ultimately any surface — which is a useful intuition for sizing: the wiggliness of the target function suggests how many units the approximation needs.",
        ],
      },
      {
        type: "formula",
        heading: "Losses: MSE, cross-entropy, softmax",
        formula: "MSE: J = Σᵢ ‖yᵢ − f(xᵢ)‖²      BCE: J = −Σᵢ [ yᵢ ln ŷᵢ + (1−yᵢ) ln(1−ŷᵢ) ]      softmax: σ(z)ᵢ = e^{zᵢ} / Σⱼ e^{zⱼ}",
        explanation: "Regression trains on mean squared error — the same squared-error criterion as least squares, now over a nonlinear model. Binary classification trains on binary cross-entropy, best read through surprise: −ln p is how surprised you are when an event of probability p occurs, so BCE penalizes the model for assigning low probability to what actually happened — class-1 samples punish low ŷ, class-0 samples punish high ŷ, and confident wrong answers cost unboundedly. Multi-class outputs pass through softmax, which exponentiates and normalizes a vector of scores into categorical probabilities (a soft, differentiable argmax — structurally akin to fuzzification onto a probability simplex), paired with categorical cross-entropy. Matching loss to task is not stylistic: MSE on classification probabilities trains slowly and mis-calibrates; cross-entropy's gradients are exactly shaped for probability outputs.",
        terms: [
          { symbol: "−ln ŷ", meaning: "Surprise — unbounded penalty for confident errors", unit: "nats" },
          { symbol: "softmax", meaning: "Scores → categorical probabilities (sums to 1)", unit: "—" },
          { symbol: "J(θ)", meaning: "Total loss over the training set", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Training: gradient descent, backpropagation, optimizers",
        body: [
          "Training solves θ* = argmin J(θ) by gradient descent: the gradient ∇J points in parameter space toward steepest loss increase, so iterate θ ← θ − γ∇J with learning rate γ. Backpropagation computes that gradient efficiently, and its essence is dynamic programming on the chain rule: the loss gradient with respect to layer i's parameters shares all its downstream factors with layer i−1's — so one backward pass accumulates a running activation gradient from the output toward the input, and each layer peels off its parameter gradients as the pass goes by (for a linear layer: the running gradient outer-multiplied with the layer's input gives ∂J/∂W; the running gradient times W propagates backward). Nothing is recomputed; the cost of all gradients is one forward plus one backward pass.",
          "The optimizer family refines raw descent. Stochastic gradient descent computes gradients on mini-batches — computationally necessary at scale, and the gradient noise usefully blurs the loss landscape, helping escape shallow local minima. Momentum accumulates a velocity (vₖ = βvₖ₋₁ − γ∇J), smoothing the descent direction through ravines. RMSprop normalizes each parameter's step by a running average of its gradient magnitude — an implicit per-parameter learning rate that tames wildly different gradient scales. Adam combines both — momentum on the gradient, normalization by gradient magnitude, with bias-corrected running averages — and is the sensible default. All share the learning-rate caveat: too large diverges, too small crawls, and validation curves arbitrate.",
        ],
      },
      {
        type: "prose",
        heading: "The workflow is most of the work",
        body: [
          "Practitioner consensus: preparing and understanding data is 80–90 % of a successful project. Before any architecture, look at the data — plot random samples, histograms (ranges, imbalance, multimodality), input-output scatterplots, PCA projections for shape and effective dimensionality, and the outliers against their neighbours (many 'outliers' are dataset bugs). Standard preprocessing: feature-wise z-score normalization (subtract mean, divide by standard deviation, per feature) so no feature dominates by scale; data augmentation (noise, shifts, rescaling, rotations for images) to grow effective data and fight imbalance. Build the dataset once with scripts — preprocessing, feature extraction, outlier rejection — and save it training-ready; keep training and testing in separate scripts operating on saved artifacts.",
          "Then the honest loop, inherited from the classifier-evaluation note and sharpened: split train/validation/test with no reuse; train while monitoring validation loss; stop by patience — halt when validation loss stops improving for a set number of epochs and restore the parameters from the best epoch (the practical guard against overfitting, visible as training loss falling while validation loss climbs); select hyperparameters (depth, width, activations, learning rate, batch size, regularization) by grid search over cross-validation folds, reporting mean ± spread; and only then touch the test set once. A network trained this way learns exactly what the loss, features, and data distribution ask of it — no more, and often revealingly less: every quiet choice of split, preprocessing, and loss is part of the specification the model actually optimizes.",
        ],
      },
      {
        type: "table",
        heading: "The optimizer family",
        columns: ["Optimizer", "Update idea", "Hyperparameters", "Character"],
        rows: [
          ["SGD (mini-batch)", "Step against batch gradient", "γ, batch size", "Noisy steps; escapes shallow minima; the baseline"],
          ["Momentum", "Velocity accumulates gradients", "γ, β", "Smooths ravines; accelerates consistent directions"],
          ["RMSprop", "Normalize by running gradient magnitude", "γ, β, ε", "Per-parameter learning rates; tames scale spread"],
          ["Adam", "Momentum + magnitude normalization, bias-corrected", "γ, β₁, β₂, ε", "Robust default; both benefits combined"],
        ],
      },
      {
        type: "callout",
        heading: "The network learns your dataset, not your intent",
        body: "A model optimizes the loss on the training features and labels — nothing else. Class imbalance becomes a learned prior; leakage between splits becomes fake accuracy; a proxy feature becomes the decision rule; a one-to-many labeling becomes irreducible error. Before blaming the architecture, audit the specification you actually gave it: the data, the split, the loss, and the features.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Neural-network review",
        items: [
          "Confirm the input→target mapping is a function; fix features, not architecture, when it isn't.",
          "Compose linear layers with nonlinear activations (ReLU default); size by the target function's complexity; weigh deep vs wide.",
          "Match loss to task: MSE for regression, BCE/softmax-cross-entropy for classification.",
          "Understand backprop as chain-rule dynamic programming: one backward pass, shared running gradients.",
          "Default to Adam; tune learning rate first; let validation curves arbitrate.",
          "Spend the effort on data: visualize, z-score normalize, augment, build-once with scripts.",
          "Split honestly, stop by validation patience (restore best epoch), grid-search over CV folds, test once.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why do networks need nonlinear activations, and what does UFA promise?", answer: "Stacked linear layers collapse into one linear map; interleaved nonlinearities make compositions expressive. Universal approximation says a two-layer network can approximate any continuous function on a bounded region with enough hidden units — an existence result, silent on efficiency, which is where depth beats width for compositional structure." },
          { question: "Why cross-entropy instead of MSE for classification?", answer: "BCE is the surprise −ln p of the observed outcome: it penalizes assigning low probability to what happened, unboundedly for confident errors, and its gradients suit probability outputs. MSE on probabilities trains slowly and mis-calibrates. Multi-class: softmax turns scores into categorical probabilities, paired with categorical cross-entropy." },
          { question: "What makes backpropagation efficient?", answer: "Chain-rule factors are shared across layers: a single backward pass maintains a running gradient of the loss with respect to activations, from which each layer extracts its parameter gradients as the pass reaches it — all gradients for the cost of one forward plus one backward pass; nothing recomputed." },
          { question: "Name the workflow guards against overfitting and self-deception.", answer: "Exclusive train/validation/test splits; z-score normalization and augmentation; early stopping by validation patience with best-epoch restoration; hyperparameter grid search over cross-validation folds reporting mean ± spread; the test set touched exactly once. And the meta-guard: audit data, loss, and features before blaming the model." },
        ],
      },
    ],
    sources: [goodfellowDl, mitDeepLearning],
    related: ["probabilistic-classifiers", "model-selection-and-robust-regression", "fuzzy-logic-and-inference", "sensor-fusion-case-studies"],
  },
];
