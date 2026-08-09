import type { Note, Source } from "./library";

const sharpIrDatasheet: Source = {
  title: "GP2Y0A distance measuring sensor datasheets",
  publisher: "Sharp Corporation",
  url: "https://global.sharp/products/device/lineup/selection/opto/haca/diagram.html",
  kind: "Documentation",
};

const probRoboticsCs: Source = {
  title: "Probabilistic Robotics",
  publisher: "Thrun, Burgard & Fox, MIT Press",
  url: "https://mitpress.mit.edu/9780262201629/probabilistic-robotics/",
  kind: "Book",
};

const matlabFuzzyCs: Source = {
  title: "Fuzzy Logic Designer — building Mamdani systems",
  publisher: "MathWorks",
  url: "https://www.mathworks.com/help/fuzzy/build-fuzzy-systems-using-fuzzy-logic-designer.html",
  kind: "Documentation",
};

export const sensorFusionCaseStudies: Note[] = [
  {
    slug: "sensor-fusion-case-studies",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Sensor fusion case studies",
    summary: "The theory exercised end to end: characterizing IR rangefinders on the bench, fusing rangefinders and thermocouples on a Bayesian grid to localize a heat source, tracking motion with an EKF designed in simulation first — plus classifier, regression, OWA, and fuzzy-fusion worked studies.",
    readingTime: 22,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Why case studies, and how to read them",
        body: [
          "Every algorithm in this collection was exercised against real hardware or real datasets in the studies below, and the sequence is deliberate: first characterize single sensors honestly (everything downstream consumes those variances), then fuse static sensors for a spatial estimate, then close the loop in time with a recursive filter — with side studies exercising the classifier, regression, rank-based, and fuzzy machinery. Read each study for its shape rather than its specifics: the pattern of model → certainty → fusion → validation transfers to any sensor suite, and the traps recorded here (non-Gaussian residuals, variance that changes with operating point, filters tuned on the data they're tested on) are the ones production systems actually hit.",
        ],
      },
      {
        type: "prose",
        heading: "Study 1 — Characterizing infrared rangefinders",
        body: [
          "The subject: triangulating infrared distance sensors (short-, medium-, and long-range variants of the classic Sharp family) whose analog output voltage falls off nonlinearly — roughly hyperbolically — with target distance. The procedure is the sensor-modeling recipe made physical. Bench setup: sensor fixed, target block centered in the field of view, distance swept across the rated operating range with a tape measure as reference; at each distance, record a multi-second voltage time series through a DAQ; keep lighting, alignment, and target height constant so distance is the only variable. First sanity check before leaving the bench: plot mean voltage versus distance and confirm monotonicity over the usable range — the response curve of these sensors famously peaks and reverses below the minimum rated distance, an ambiguity no downstream model can undo.",
          "Modeling and evaluation: fit a function (linear in weights — an inverse-distance regressor set fits the physics) mapping distance to voltage, overlay it on the calibration scatter, and quantify maximum and mean error. Then interrogate the noise: histogram the voltage samples at each distance, fit a Gaussian, and ask the two questions the fusion math depends on — are the residuals plausibly zero-mean Gaussian (outliers noted), and is the variance stable across distances or does it grow? If one variance must represent the whole range, choose it defensibly (the worst-case or a weighted typical value) and record the compromise. Comparing the fitted curve against the manufacturer's datasheet curve closes the loop — differences in absolute voltage are expected (part-to-part spread, supply, target reflectivity) and diagnosable. Extensions probe robustness: a second sensor of the same type (competitive pair — how well do two 'identical' sensors agree?), a tilted target, and a different surface material, each shifting the response enough to make the point that a sensor model is calibrated for the conditions it was trained in.",
        ],
      },
      {
        type: "prose",
        heading: "Study 2 — Localizing a heat source on a Bayesian grid",
        body: [
          "The subject: a complete multi-sensor fusion system locating a heated block on an aluminum plate in 2-D. Instrumentation: four IR rangefinders (from Study 1) aimed along the plate's axes, and four K-type thermocouples with amplifier boards at known positions — the amplifier's transfer function T = (V − 1.25)/0.005 converting output volts to degrees Celsius. A Peltier module under the block provides the heat; the plate's slow thermal dynamics add a real-world lesson in settling time (wait for steady state, and measure how long that takes — minutes, per a long recording made while the plate warms). Calibration data: measurements at nine known block positions to build a thermocouple model — temperature as a function of distance to the source — and to re-verify the IR models under this lab's conditions; test data at three fresh positions held out for evaluation.",
          "The fusion is grid-based Bayes at its most vivid, because the two sensor types produce differently-shaped likelihoods. An IR sensor measuring along one axis constrains that coordinate: its likelihood over the 2-D grid is a Gaussian ridge perpendicular to its axis. A thermocouple's temperature reading constrains distance to the source: its likelihood is a ring around the sensor at the radius its temperature implies. Neither shape is remotely Gaussian in 2-D — the ring especially — which is exactly why the grid representation earns its cost here. Assuming sensor independence, the posterior is the elementwise product of all eight likelihood grids, renormalized; visually, ridges and rings intersect, and the posterior mass concentrates where they agree. Evaluation compares the posterior's peak (and its spread — the certainty statement) against the measured true positions on the held-out test cases, and the discussion writes itself: complementary geometries (axial ridges plus radial rings) localize far better than either sensor type alone, and the slow thermocouples versus fast rangefinders preview every real system's mixed-rate fusion problem.",
        ],
      },
      {
        type: "prose",
        heading: "Study 3 — Tracking motion with an EKF, simulation first",
        body: [
          "The subject: an extended Kalman filter fusing two IR rangefinders (a competitive pair from Study 1) to track a target moved by hand along a rail through five motion patterns — stationary, smooth point-to-point, point-to-point with velocity variation, random motion, and motion with a tilted target surface. The design discipline is the transferable lesson: everything is designed and tuned in simulation before touching the recorded data. Choose the state vector to cover all five motions (position-velocity minimum; position-velocity-acceleration if the maneuvers demand it); write the linear process model xₖ₊₁ = Axₖ + ω with a justified timestep and a justified process covariance Q; take the nonlinear sensor model h(x) from Study 1's calibration (voltage as a function of distance), derive its Jacobian ∂h/∂x analytically, and set R from Study 1's measured variances — the earlier characterization literally becoming this filter's parameters.",
          "The simulation harness generates truth trajectories shaped like the real motions (linear ramps, sinusoid-modulated ramps, random Fourier-series wander, each plus integrated process noise), synthesizes sensor readings by passing truth through h(x) and adding calibrated noise, and runs the EKF against them. Tuning happens here, and so does sensitivity analysis — the experiments that build filter intuition: initialize the state near and far from truth (watch convergence), mismatch the simulated process noise against the filter's Q (watch lag or jitter), mismatch the simulated sensor noise against R (watch over- and under-trusting) — all while reading both the estimate and its covariance, using the diagonal elements for per-state uncertainty and the eigenvalues for the uncertainty ellipse's size and orientation. Only after the filter behaves in simulation does it meet the recorded experimental motions, where the report compares estimated against measured start/end positions and judges the covariance's honesty. The meta-lesson is the one production estimators live by: simulation is where you learn the filter's failure modes cheaply; hardware data is where you verify, not explore.",
        ],
      },
      {
        type: "diagram",
        heading: "The three bench studies as one pipeline",
        art: "  STUDY 1                    STUDY 2                       STUDY 3\n  Characterize sensors  -->  Fuse static sensors      -->  Fuse dynamic estimates\n\n  voltage = f(distance)      IR ridge x thermo ring        EKF: predict/update\n  residual histograms        x ... x  (8 grids)            h(x), Jacobian, R from\n  variance per distance      = posterior of source         Study 1; Q, x0 tuned in\n  (feeds R downstream)       position on 2-D grid          simulation, then hardware",
        caption: "Characterization feeds fusion; static fusion generalizes to recursive filtering. The variances measured on the bench in Study 1 are the same numbers appearing in Study 2's likelihood widths and Study 3's R matrix — the through-line of the whole discipline.",
      },
      {
        type: "prose",
        heading: "Study 4 — Classifier studies: fruit sorting with two sensors",
        body: [
          "A compact study exercising the classifier machinery end to end. A roughness sensor on a packaging line measures 20 samples each of two fruit classes; class-conditional Gaussians are fitted from the sample statistics. For a new reading between the class means, the maximum-likelihood decision compares p(x|class) alone — but the sampled batches came from a population with a 1:2 class imbalance, and folding in those priors (Bayesian classification) shifts the decision boundary toward the rarer class's territory, flipping the verdict for borderline readings: the textbook demonstration that likelihood measures typicality while the posterior measures origin. The study's second act adds a color sensor with known per-color class posteriors: assuming roughness and color are conditionally independent given the fruit, the joint update multiplies the evidence, and a reading ambiguous on roughness becomes decisive with color — naive-Bayes fusion in its simplest working form.",
          "Study 5 — Regression studies: polynomial fitting under stress. A noisy scalar dataset is fitted with a fourth-order polynomial by ordinary least squares, then refitted under an ℓ₂ (ridge) penalty — the weight-norm ratio between the two solutions quantifying how much regularization reins in the coefficients — and again with robust, residual-driven sample weights that discount outliers (a bisquare-style scheme with the scale tied to the residual spread, and R² recomputed with the weighted formulas so the metric matches the estimator). The closing question is the model-selection note in miniature: determine the reasonable model orders rigorously, which means comparing validation error across orders rather than admiring training fit.",
        ],
      },
      {
        type: "prose",
        heading: "Studies 6 & 7 — Estimator fusion: inverse variance, OWA, and fuzzy weights",
        body: [
          "Study 6 — magnet orientation from three magnetoresistive sensors. Three two-axis AMR sensors observe a rotating magnet; per the physics, each axis is linear not in the angle but in its sine and cosine, so per-sensor linear models are fitted (four weights each) and the angle recovered through atan2 of the modeled sine over cosine — a clean example of linearizing a problem by choosing the right output space, the same move as the linear-in-regressors trick. Each sensor's angle-estimate error statistics are then measured against reference, and the three estimators fused by inverse-variance weighting. The evaluation asks the sharp question: is the fused estimator better than the best individual sensor — in variance and in mean error? Variance, provably yes; mean error is a bias question that weighting cannot fix, a distinction worth internalizing.",
          "Study 7a — rank-based fusion of localization estimators. Three robot-localization estimators each carry a spatial map of expected RMS error (performance varies over the workspace); given three position estimates, each estimator's local RMS at the relevant location provides the ranking quantity, and OWA weights [0.55, 0.30, 0.15] fuse the sorted estimates. The study then iterates: re-evaluate each estimator's expected RMS at the first fused position, re-rank, re-fuse — a two-pass scheme where the fusion refines its own trust assignments. The design questions close it out: which weight vectors achieve a specified orness (infinitely many, since orness is one constraint on a simplex), and what are the maximum-entropy weights at that orness — MEOWA solved concretely. Study 7b — fuzzy fusion of three barometers. Each barometer's recent noise is estimated online (lowpass the signal, subtract to isolate noise, take windowed standard deviations); the three certainty signals feed a Mamdani fuzzy inference system — triangular and trapezoidal memberships, min/max operators, centroid defuzzification — whose rules map certainty patterns to per-sensor weight levels; the defuzzified weights, normalized, drive a weighted-sum fusion. The closing comparison against inverse-variance weights on the same windows is the point of the exercise: where the noise statistics are well-behaved the two agree, and where they aren't, the rule-based weights are the ones you can read, explain, and adjust.",
        ],
      },
      {
        type: "table",
        heading: "Study-to-theory map",
        columns: ["Study", "Hardware / data", "Theory exercised", "Transferable lesson"],
        rows: [
          ["1 — Rangefinder characterization", "3 IR sensors, DAQ, tape measure", "Sensor models, OLS, residual analysis", "Verify Gaussian/variance assumptions; conditions are part of the model"],
          ["2 — Heat-source localization", "4 IR + 4 thermocouples, heated plate", "Grid Bayes, likelihood shapes, independence", "Complementary geometries (ridge × ring) localize; grids handle non-Gaussian"],
          ["3 — EKF tracking", "2 IR sensors, moving target", "EKF, Jacobians, Q/R design, covariance reading", "Design and tune in simulation; hardware verifies"],
          ["4 — Fruit classification", "Two-class roughness + color data", "ML vs Bayes, priors, naive-Bayes fusion", "Priors flip borderline decisions; independent sensors multiply"],
          ["5 — Polynomial regression", "Noisy scalar dataset", "OLS, ridge, robust weights, order selection", "Validation error picks the order; robustness is a weighting"],
          ["6 — Magnet orientation", "3 two-axis AMR sensors", "Linear-in-sin/cos models, inverse-variance fusion", "Fusion beats every sensor in variance — not necessarily in bias"],
          ["7 — OWA & fuzzy weighting", "RMS maps; 3 barometers", "OWA/MEOWA, Mamdani FIS weight generation", "Rank- and rule-based trust when identity-based weights fall short"],
        ],
      },
      {
        type: "callout",
        heading: "The variances travel; so do the mistakes",
        body: "The through-line of every study: numbers measured early become load-bearing later — Study 1's variances are Study 2's likelihood widths and Study 3's R matrix; Study 6's error statistics are its fusion weights. Skimp on characterization and every downstream algorithm inherits the lie. The same propagation applies to mistakes: an unvalidated Gaussian assumption or an unnoticed non-monotonic sensor range surfaces two studies later as an unexplainable fusion failure.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Running your own version",
        items: [
          "Characterize each sensor across its full range; verify monotonicity, residual normality, and variance stability before modeling.",
          "Keep calibration conditions recorded and constant; re-verify models when conditions change.",
          "Choose the belief representation by likelihood shape: grids for ridges and rings, Gaussians for unimodal spots.",
          "Multiply independent sensor likelihoods; renormalize; report the posterior's spread, not just its peak.",
          "Build filters in simulation with truth available; sweep initial conditions and Q/R mismatches before hardware.",
          "Read covariances actively: diagonals per state, eigenvalues for the uncertainty ellipse.",
          "Hold out test positions/trajectories untouched by any tuning; report against them only.",
          "Compare fusion output against the best single sensor — the fused estimate must earn its complexity.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why do the rangefinder and thermocouple produce differently-shaped likelihoods, and why does it matter?", answer: "The rangefinder measures along one axis → a Gaussian ridge constraining that coordinate; the thermocouple's temperature implies a distance → a ring around the sensor. Neither is Gaussian in 2-D, so the grid representation (elementwise product of all eight grids) is what makes the fusion tractable — and their complementary geometry is what localizes." },
          { question: "What made the EKF study's simulation-first discipline valuable?", answer: "With truth available, tuning and sensitivity analysis are cheap and conclusive: initialization near/far tests convergence, deliberate Q and R mismatches show lag, jitter, over- and under-trust — failure modes learned safely. Hardware data then verifies the tuned filter rather than serving as the exploration ground." },
          { question: "In the magnet study, why fit sin θ and cos θ instead of θ?", answer: "The sensor axes are physically linear in sine and cosine of the angle, not in the angle itself — so linear least squares applies exactly in that output space, and atan2 of the two modeled components recovers θ without wrap problems. Choosing the space where the problem is linear is the same trick as choosing regressors." },
          { question: "When did fuzzy weights beat inverse-variance weights, and why?", answer: "When the windowed noise statistics were unstable or the certainty evidence was graded and rule-shaped: the Mamdani system's weights approximate inverse-variance behavior where statistics are good, but remain inspectable and adjustable where they aren't — trust policy you can read, at the cost of optimality guarantees." },
        ],
      },
    ],
    sources: [sharpIrDatasheet, probRoboticsCs, matlabFuzzyCs],
    related: ["sensor-models-and-least-squares", "bayesian-filtering-fundamentals", "kalman-filter", "nonlinear-filters-ekf-ukf-particle", "weighted-average-fusion", "fuzzy-logic-and-inference", "structured-hardware-debugging"],
  },
];
