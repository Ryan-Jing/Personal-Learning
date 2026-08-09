import type { Note, Source } from "./library";

const probabilisticRobotics: Source = {
  title: "Probabilistic Robotics",
  publisher: "Thrun, Burgard & Fox, MIT Press",
  url: "https://mitpress.mit.edu/9780262201629/probabilistic-robotics/",
  kind: "Book",
};

const bishopPrml: Source = {
  title: "Pattern Recognition and Machine Learning",
  publisher: "Christopher Bishop, Springer",
  url: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/",
  kind: "Book",
};

const eslHastie: Source = {
  title: "The Elements of Statistical Learning",
  publisher: "Hastie, Tibshirani & Friedman, Springer",
  url: "https://hastie.su.domains/ElemStatLearn/",
  kind: "Book",
};

const hallLlinas: Source = {
  title: "An Introduction to Multisensor Data Fusion",
  publisher: "Hall & Llinas, Proceedings of the IEEE",
  url: "https://ieeexplore.ieee.org/document/554205",
  kind: "Reference",
};

export const sensorFusionFoundationsNotes: Note[] = [
  {
    slug: "sensor-fusion-foundations",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Sensor fusion foundations & probability",
    summary: "What sensors and fusion actually are, the competitive/cooperative/complementary configurations and centralized-vs-distributed architectures, and the probability toolkit everything rests on — random variables, joint/conditional densities, the law of total probability, Bayes' rule, and moments.",
    readingTime: 19,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The whole subject in one sentence",
        body: [
          "Sensor fusion is the discipline of extracting, representing, and manipulating information and its uncertainty to make informed decisions. Every system in the field — a soil-moisture estimator scheduling irrigation, a thermocouple loop holding a cooking temperature, a camera-and-lidar stack deciding whether to brake — follows the same pipeline: sensors collect data from the environment, processing extracts information (and, critically, a measure of how certain that information is), and a decision layer acts. What distinguishes fusion from plain signal processing is the second half of the sentence: uncertainty is a first-class object, carried through every stage, because a decision-maker that knows how much to trust each input makes better decisions than one handed bare numbers.",
          "It pays to define 'sensor' broadly. A concrete sensor is a device quantifying a physical phenomenon — a thermocouple converting a temperature difference to a voltage through the Seebeck effect, a strain gauge converting deformation to resistance. But an abstract data source that quantifies a theoretical phenomenon is a sensor too: a stock index sensing market volatility, a hazard function sensing remaining lifetime. The fusion machinery does not care where the numbers come from; it cares that each source has a model relating its output to the quantity of interest and a characterization of its uncertainty. That framing is what lets the same mathematics serve a robot, a factory, and a forecast.",
        ],
      },
      {
        type: "diagram",
        heading: "The fusion pipeline",
        intro: "Every fusion system, from a rice cooker to an autonomous car, instantiates the same loop:",
        art: "  Environment\n      |\n      v\n  +----------------+     +---------------------------+     +-----------------+\n  | Data collection| --> | Information extraction     | --> | Informed        |\n  | (sensors)      |     | + uncertainty (processing) |     | decision-making |\n  +----------------+     +---------------------------+     +-----------------+\n                                                                  |\n                                    enacts decisions              v\n  Environment  <--------------------------------------------  End user",
        caption: "Sensors quantify the environment; processing turns raw data into estimates with uncertainty; decisions act on the environment and the loop closes. Fusion lives in the middle box — combining multiple sources into estimates better than any single source provides.",
      },
      {
        type: "prose",
        heading: "Why fuse, and in what configuration",
        body: [
          "Fusion is the process of integrating multiple sources to produce information that is more consistent, accurate, and useful than any individual source provides. The concrete motivations: single sensors are noisy, biased, and fail; data has gaps (outliers, temporal misalignment, spatial distortion); gathering data has hardware and computational cost; and sensors behave differently across environments, so calibration against other sources is often the only anchor. Fusing lets a system increase the breadth of what it estimates, decrease uncertainty, and buy robustness against any one source lying.",
          "How multiple sensors relate to each other has a standard taxonomy worth using precisely. Competitive configuration: several sensors measure the same quantity independently — redundancy that increases robustness and shrinks uncertainty (two rangefinders staring at the same target). Cooperative configuration: sensors of the same type combine to produce information none could alone (two cameras forming a stereo depth estimate). Complementary configuration: sensors measure different aspects of the scene and their union gives a more complete picture (a camera for appearance plus a lidar for geometry, or the accelerometer/gyroscope/magnetometer trio inside an IMU). Real systems mix all three, and naming which relationship a sensor pair has tells you which fusion mathematics applies — competitive pairs get averaged with weights, complementary pairs get stacked into a joint state estimate.",
        ],
      },
      {
        type: "prose",
        heading: "Centralized vs distributed architectures",
        body: [
          "Where the fusion computation happens is an architectural decision with real trade-offs. A centralized architecture ships all raw data to one processor that fuses everything: decisions are based on the maximum possible information (nothing was discarded en route), which is statistically optimal — but it demands time synchronization of every source, pays the full data-transmission cost, and concentrates a processing bottleneck at one node. A distributed architecture processes locally at or near each sensor and exchanges distilled information (estimates, tracks, features) between nodes: transmission and central load shrink, dissimilar sensors keep their specialized local processing, and the system degrades gracefully — but local processing costs more at the edges, node errors propagate into everything downstream, and the system design is substantially more complex (who trusts whom, and how do you avoid double-counting shared information?).",
          "The choice recurs at every scale: a drone fusing its IMU on the flight controller while offloading vision to a companion computer is making this decision; so is a factory with smart sensors versus a central PLC. The engineering answer is usually a hybrid — fuse tightly-coupled, high-rate signals centrally and distill slow, high-volume ones locally — chosen by bandwidth, latency, and failure-mode budgets rather than ideology.",
        ],
      },
      {
        type: "prose",
        heading: "Random variables: value plus certainty",
        body: [
          "The mathematical object underneath everything is the random variable: a quantity that carries not a single value but a range of possible values with a probability density describing which are likely. 'There are 11 players on the team' is deterministic; 'the forecast calls for 8 ± 2 mm of snow' is a random variable — a support (the possible values) and a density (the certainty over them). The probability density function p(x) assigns higher values to more likely points; the cumulative distribution F(x) integrates it to give the probability the variable lands at or below x. Committing to random variables as the working representation is the paradigm shift the whole subject rests on: a sensor reading is not a number, it is a distribution, and fusion is arithmetic on distributions.",
          "With several variables, three densities matter constantly. The joint density p(x, y) is the likelihood of two variables taking values together. The conditional density p(x|y) is the likelihood of x when y is known — the workhorse of inference, because a sensor model is exactly a conditional density (likelihood of the measurement given the state). The marginal density integrates a variable out — p(x) = ∫ p(x, y) dy — eliminating a quantity you don't care about by summing over everything it could have been. Independence is the special structure p(x, y) = p(x)·p(y): knowing one tells you nothing about the other, and it is the assumption that lets measurements from separate sensors be multiplied together.",
        ],
      },
      {
        type: "formula",
        heading: "The two rules that generate everything",
        formula: "Total probability:  p(A) = Σᵢ p(A|Xᵢ)·p(Xᵢ)      Bayes' rule:  p(x|z) = p(z|x)·p(x) / p(z),   p(z) = ∫ p(z|x)·p(x) dx",
        explanation: "The law of total probability computes the probability of an event by conditioning on a mutually exclusive, exhaustive cover of cases and summing — e.g. the probability of a solder defect across a board is the defect rate of each joint type weighted by how many of each type exist. Bayes' rule is the engine of all estimation: it swaps the conditioning direction, turning a sensor model p(z|x) — how measurements behave given the state, which you can characterize in the lab — into the thing you actually want, p(x|z), the state given the measurement. Its four pieces have names used throughout the field: the posterior p(x|z) is the updated belief; the likelihood p(z|x) is the sensor model evaluated at the observed measurement; the prior p(x) is what was believed before; and the evidence p(z) is the normalizer that makes the posterior integrate to one.",
        terms: [
          { symbol: "posterior", meaning: "p(x|z) — belief after the measurement", unit: "—" },
          { symbol: "likelihood × prior", meaning: "p(z|x)·p(x) — sensor model times prior belief", unit: "—" },
          { symbol: "evidence", meaning: "p(z) — normalizer, integrates likelihood×prior", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Moments: summarizing distributions with numbers",
        body: [
          "A density is an infinite-dimensional object; moments compress it into a few numbers the algorithms can carry. The expected value E[f(x)] = ∫ f(z)p(z)dz averages any function over the distribution; the mean E[x] is the center of mass; the variance V[x] = E[(x − E[x])²] measures spread — the square of the typical deviation from the mean. In multiple dimensions the mean becomes a vector and the variance becomes the covariance matrix Σ, whose diagonal entries are per-component variances and whose off-diagonal entries capture how components move together. Conditional moments use the same formulas with conditional densities — E[x|y] is the mean of x once y is known — and they are what filters actually compute and store.",
          "Two linear-algebra facts about covariance matrices earn their keep daily. A covariance matrix is symmetric positive (semi)definite, which is exactly the condition that the quadratic form (x−μ)ᵀΣ⁻¹(x−μ) — the multivariate generalization of the scalar (x−μ)²/σ² appearing in every Gaussian — is a sensible squared distance. And its eigendecomposition reads off the geometry of uncertainty: eigenvectors are the principal directions of spread, eigenvalues the variances along them, so the uncertainty ellipse of an estimate is drawn directly from the covariance's eigenstructure. When a later note asks 'how uncertain is this state estimate, and in which direction' — the covariance eigenvalues are the answer.",
        ],
      },
      {
        type: "table",
        heading: "Sensor configurations and architectures",
        columns: ["Concept", "Definition", "Example", "Fusion consequence"],
        rows: [
          ["Competitive", "Same quantity, independent sensors", "Two rangefinders on one target", "Weighted averaging; redundancy against failure"],
          ["Cooperative", "Same type, combined for new information", "Stereo cameras → depth", "Joint processing creates a derived measurement"],
          ["Complementary", "Different aspects of the scene", "Camera + lidar; accel + gyro + mag", "Stacked into one state estimate"],
          ["Centralized", "All raw data to one fusion node", "Single ECU fusing all sensors", "Optimal information; sync, bandwidth, bottleneck costs"],
          ["Distributed", "Local processing, distilled exchange", "Smart sensors sharing tracks", "Scalable, robust; error propagation, design complexity"],
        ],
      },
      {
        type: "callout",
        heading: "Uncertainty is the product, not a footnote",
        body: "A fusion system's output is an estimate and its certainty, and downstream decisions consume both. Every algorithm in this collection — weighted averaging, Bayesian grids, Kalman filters, fuzzy systems — is at bottom a rule for combining values in proportion to their certainty. If you find yourself carrying numbers without their variances, you have left the discipline.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Foundations review",
        items: [
          "Frame any fusion problem as the pipeline: collection → extraction with uncertainty → decision.",
          "Classify each sensor pair as competitive, cooperative, or complementary; the class picks the math.",
          "Choose centralized vs distributed by bandwidth, synchronization, bottleneck, and failure budgets.",
          "Treat every reading as a random variable: support plus density, never a bare number.",
          "Keep joint/conditional/marginal straight; independence is what licenses multiplying sensor likelihoods.",
          "Use total probability to case-split; use Bayes to invert sensor models into state beliefs.",
          "Summarize with moments; read covariance eigenstructure as the geometry of uncertainty.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Name and distinguish the three sensor configurations.", answer: "Competitive: independent sensors measure the same quantity (redundancy, lower uncertainty). Cooperative: same-type sensors combine to create information none has alone (stereo depth). Complementary: different aspects fused for a fuller picture (camera + lidar). The configuration determines the fusion method." },
          { question: "What are the trade-offs between centralized and distributed fusion?", answer: "Centralized fuses all raw data at one node: maximum information and optimality, but time-sync requirements, transmission cost, and a processing bottleneck. Distributed processes locally and exchanges distilled estimates: scalable and robust, but higher edge cost, propagating node errors, and harder system design." },
          { question: "State Bayes' rule and name its four parts.", answer: "p(x|z) = p(z|x)·p(x)/p(z). Posterior (updated belief in the state) equals likelihood (sensor model at the observed measurement) times prior (belief before), normalized by the evidence (integral of likelihood × prior over all states)." },
          { question: "Why does the law of total probability matter in fusion?", answer: "It computes an event's probability by conditioning over a mutually exclusive, exhaustive set of cases and weighting by their probabilities — e.g. overall defect probability across joint types, or a prediction integral marginalizing over all previous states. It is the marginalization step inside every recursive filter." },
        ],
      },
    ],
    sources: [hallLlinas, probabilisticRobotics],
    related: ["probabilistic-classifiers", "bayesian-filtering-fundamentals", "weighted-average-fusion", "drone-platform-electronics"],
  },
  {
    slug: "probabilistic-classifiers",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Probabilistic classifiers & their evaluation",
    summary: "Maximum-likelihood vs Bayesian classification — why priors change the answer — fitting class-conditional Gaussians, the log-domain optimization trick, and the evaluation discipline: train/validation/test splits, cross-validation, confusion matrices, and probability of error.",
    readingTime: 17,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Two problems, one machinery",
        body: [
          "Supervised estimation splits into regression — estimate a continuous value from observed data (expected sales from inventory, target distance from a sensor voltage) — and classification — assign an observation to one of a discrete set of types (which algae species, defect or no defect). Both follow the same two-phase lifecycle: pre-training, where labeled data is collected, a model form is chosen, and its parameters are fitted; and inference, where the frozen model is applied to new data. The labels' availability defines the learning setting: supervised (all data labeled), unsupervised (none), semi-supervised (some), and reinforcement learning (the model gathers its own data by acting). The classifiers here are supervised and probabilistic — they model the data's distribution per class and decide by comparing probabilities, which makes their confidence exactly as trustworthy as their distributional assumptions.",
          "The standard probabilistic classifier models each class's data with a class-conditional likelihood — typically a Gaussian with its own mean and covariance fitted from that class's training samples (the sample mean and sample covariance). Inference then reduces to evaluating each class's density at the new point and comparing. Everything that distinguishes the classifiers below is what else, beyond the likelihood, enters the comparison.",
        ],
      },
      {
        type: "prose",
        heading: "Maximum likelihood, and why rarity must matter",
        body: [
          "The maximum-likelihood (ML) classifier assigns a new observation x to whichever class makes the data most likely: compare p(x|A) against p(x|B) and pick the larger. It is simple and often works, but it has a structural blindness: it treats every class as equally probable a priori. The classic counterexample: manufacturer A is a huge producer cutting bar stock to any length; manufacturer B is a small shop that only sells 1-inch parts. A part measuring exactly 1.00 inch has high likelihood under B's tight distribution — but if A produces a thousand times more parts, most 1.00-inch parts in the world still came from A. Likelihood describes typical values within a class; it says nothing about how often the class occurs.",
          "The Bayesian classifier repairs this by comparing posteriors instead: p(A|x) versus p(B|x), which by Bayes' rule (the shared evidence p(x) cancels) is the comparison of weighted likelihoods p(x|A)·p(A) against p(x|B)·p(B). The prior p(c) — fitted as each class's fraction of the training data, or known from production volumes — rescales each likelihood by how common the class is. With equal priors, Bayesian and ML decisions coincide; with imbalanced classes they diverge exactly where it matters, near the decision boundary. A point can be more typical of class A yet more probably from class B because B dominates the population — the worked two-class example in the case-studies note lands on precisely that reversal.",
        ],
      },
      {
        type: "formula",
        heading: "The decision rule, and the log-domain shortcut",
        formula: "choose A iff  p(x|A)·p(A) > p(x|B)·p(B)      in logs:  2·ln p(A) − ln|Σ_A| − (x−μ_A)ᵀΣ_A⁻¹(x−μ_A)  vs  same for B",
        explanation: "With Gaussian class conditionals, the posterior comparison expands into means, covariances, and priors. Taking logarithms turns products into sums and kills the exponential, and dropping terms shared by both sides (the 2π constants, the factor of −½) leaves a cheap quadratic score per class: a prior term, a log-determinant term penalizing diffuse classes, and the Mahalanobis distance (x−μ)ᵀΣ⁻¹(x−μ) measuring how many 'standard deviations' the point sits from the class center in the metric of its covariance. This log-domain form is not just computational hygiene — products of many small likelihoods underflow floating point, and sums of logs do not, which is why every practical implementation scores in logs.",
        terms: [
          { symbol: "(x−μ)ᵀΣ⁻¹(x−μ)", meaning: "Mahalanobis distance to the class center", unit: "—" },
          { symbol: "ln|Σ|", meaning: "Volume penalty for diffuse classes", unit: "—" },
          { symbol: "ln p(c)", meaning: "Prior weight for class frequency", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Fusing a second, independent sensor",
        body: [
          "Classification is where fusion first pays off concretely. Suppose a roughness sensor gives a marginal decision and a color sensor is added. If the two measurements are independent given the class — knowing the fruit, roughness tells you nothing extra about color — the joint likelihood factors: p(roughness, color | class) = p(roughness|class)·p(color|class). The posterior update then simply multiplies in the second sensor's contribution, and a decision that was ambiguous on one feature can become decisive on two. This 'naive Bayes' structure — assume conditional independence, multiply per-sensor likelihoods — is the simplest genuinely multi-sensor classifier, and its conditional-independence assumption is the one to interrogate: sensors sharing a physical cause (two features both driven by size) violate it and get double-counted.",
        ],
      },
      {
        type: "prose",
        heading: "Evaluation: splits, cross-validation, and honest metrics",
        body: [
          "A classifier's worth is established empirically, and the discipline is strict: split the dataset into mutually exclusive subsets and use each for exactly one purpose. The training set fits model parameters; the validation set tunes model choices (which features, which model order, which hyperparameters) and justifies that the fitted parameters generalize; the test set is touched once, at the end, to compute the reported metrics. Reusing data across roles — tuning on test data, reporting on training data — silently inflates every number. Cross-validation strengthens the estimate: repeat the split over different permutations (folds), train and evaluate on each, and report the mean and spread of the metric — turning a single lucky (or unlucky) split into a distribution with error bars.",
          "The metrics themselves: the confusion matrix tabulates predicted class against actual class, showing exactly where errors occur (which classes get mistaken for which — far more diagnostic than any single number); the average correct classification rate summarizes its diagonal into one figure; a confidence measure reports how strongly the model believed each decision (the posterior margin); and the probability of error integrates, over the feature space, the probability mass that falls on the wrong side of the decision boundary — the theoretical risk implied by the fitted models themselves, before any test set is drawn. For Gaussian classes this is the overlap of the class densities weighted by priors: the irreducible error the model structure predicts for itself.",
        ],
      },
      {
        type: "table",
        heading: "ML vs Bayesian classification",
        columns: ["Aspect", "Maximum likelihood", "Bayesian"],
        rows: [
          ["Compares", "p(x|A) vs p(x|B)", "p(x|A)·p(A) vs p(x|B)·p(B)"],
          ["Uses class frequency", "No — classes implicitly equiprobable", "Yes — priors from data or knowledge"],
          ["When they agree", "Equal priors", "Always differ only via priors"],
          ["Failure mode", "Rare-class false alarms (ignores rarity)", "Bad priors bias decisions"],
          ["Extra data needed", "Per-class likelihood models", "Same, plus class frequencies"],
        ],
      },
      {
        type: "callout",
        heading: "Never let data serve two masters",
        body: "Train, validation, and test sets must be mutually exclusive, and the test set is spent the moment it is used — evaluate on it once and report. Tuning anything against test performance converts it into a validation set and the reported metric into an optimistic fiction. Cross-validation exists so that model selection can be done honestly, with uncertainty bars, before the final test.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Classifier review",
        items: [
          "Fit class-conditional Gaussians per class (sample mean, sample covariance); fit priors as class fractions.",
          "Decide with posteriors (likelihood × prior); reserve pure ML for genuinely equiprobable classes.",
          "Score in the log domain: prior term, log-determinant, Mahalanobis distance.",
          "Fuse independent sensors by multiplying class-conditional likelihoods; interrogate the independence assumption.",
          "Split train/validation/test with no reuse; cross-validate for metrics with uncertainty.",
          "Read the confusion matrix before any summary number; report probability of error where models permit.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why can a Bayesian classifier overturn a maximum-likelihood decision?", answer: "ML compares only p(x|class) — how typical the point is per class. The Bayesian classifier weights by priors p(class); a point more typical of a rare class can still more probably belong to a common class. Likelihood measures typicality, the posterior measures origin." },
          { question: "Why classify in the log domain?", answer: "Logs turn likelihood products into sums (no floating-point underflow), the exponential disappears, and shared constants cancel — leaving a cheap per-class quadratic score: 2·ln p(c) − ln|Σ_c| − Mahalanobis distance. Same decision, robust arithmetic." },
          { question: "What licenses multiplying two sensors' likelihoods in a classifier?", answer: "Conditional independence given the class: p(z₁, z₂|c) = p(z₁|c)·p(z₂|c). It fails when sensors share a physical cause, which double-counts evidence — the naive-Bayes assumption to always interrogate." },
          { question: "What are the three data splits for, and what does cross-validation add?", answer: "Training fits parameters; validation tunes model choices and checks generalization; test is used once for reported metrics. Cross-validation repeats the split across folds to give metrics as mean ± spread instead of one lucky draw." },
        ],
      },
    ],
    sources: [bishopPrml, eslHastie],
    related: ["sensor-fusion-foundations", "sensor-models-and-least-squares", "neural-networks-for-sensor-fusion", "sensor-fusion-case-studies"],
  },
  {
    slug: "sensor-models-and-least-squares",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Sensor models & least-squares regression",
    summary: "Turning raw sensor output into calibrated estimates: the sensor model as regression plus certainty, physics-informed model forms, additive Gaussian noise, the linear parametric model and the ordinary least squares solution, and evaluating models by error bias and variance.",
    readingTime: 18,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A sensor model is a regression with a certainty attached",
        body: [
          "Raw sensor output is rarely the quantity you want: a rangefinder emits volts, not meters; a thermocouple emits microvolts, not degrees. A sensor model is the bridge — a regression that converts raw output into an estimate of the desired measurement, together with a measure of certainty about that estimate. The data-driven recipe: collect pairs of sensor outputs and reference values across the operating range, define an estimation rule from the collected data, and extend it to future readings. Both halves matter equally; the calibration curve without its error model is half a sensor model, because every downstream fusion algorithm will ask not just 'what does this sensor say' but 'how much should I trust it.'",
          "Knowing the physics improves the model. A Hall sensor's output is linear in field by the Lorentz force; a magnetoresistor goes as B²; a strain gauge follows stress-strain linearity. Physics tells you which functional form to fit (fewer parameters, better extrapolation), predicts where linearity fails, and explains noise and artifacts. When physics is unavailable or intractable, the model form is chosen empirically — which is exactly the model-selection problem of the next note. Either way the standard noise assumption is additive: y(t) = ȳ(t) + ε(t), with ε white noise — independent samples from a zero-mean, finite-variance normal distribution. Zero-mean matters (bias is a model error, not noise), independence matters (correlated noise breaks the averaging arithmetic later), and normality matters (it makes the likelihoods Gaussian, powering everything from Bayesian grids to Kalman filters).",
        ],
      },
      {
        type: "prose",
        heading: "The linear parametric model: linear in weights, not in x",
        body: [
          "The workhorse model is a weighted sum of regressors: ŷ = Σ wᵢ·fᵢ(x), where each regressor fᵢ is any function of the raw input — 1, x, x², sin(x), 1/x, log(x). The crucial subtlety is what 'linear' means here: the model is linear in the weights, not in the input. Choosing regressors [1, x, x², x³] fits a cubic; choosing [1, 1/x] fits the hyperbolic falloff of an IR rangefinder — all with the same linear machinery, because the fitting problem sees only the matrix of regressor values, never x itself. This is why linear least squares is far more expressive than 'fitting a line': the nonlinearity is packed into the regressors and the optimization stays convex with a closed-form solution.",
          "Stacking the training data builds the standard objects: the target vector y (N reference values) and the regressor data matrix X (N rows, one per sample; m columns, one per regressor evaluated at that sample). The model is then ŷ = Xw and fitting is choosing w to make Xw close to y.",
        ],
      },
      {
        type: "formula",
        heading: "Ordinary least squares",
        formula: "w* = argmin_w (y − Xw)ᵀ(y − Xw)  =  (XᵀX)⁻¹ Xᵀ y",
        explanation: "The sum of squared errors is a quadratic bowl in w, so setting its gradient to zero gives the unique minimum in closed form: the normal equations XᵀXw = Xᵀy, solved by the pseudo-inverse expression above. Reading it as machinery: XᵀX is the m×m Gram matrix of regressor correlations, and Xᵀy correlates each regressor with the targets — OLS solves for the weight combination that explains the target using each regressor in proportion to its unique correlation. The solution exists when XᵀX is invertible, which requires at least as many samples as regressors (in practice many more) and regressors that are not redundant — the failure cases the next note treats. Squared error is chosen not just for convenience: under additive Gaussian noise, minimizing squared error is exactly maximum-likelihood estimation of the weights.",
        terms: [
          { symbol: "X", meaning: "N×m regressor data matrix", unit: "—" },
          { symbol: "XᵀX", meaning: "Gram matrix — must be invertible", unit: "m×m" },
          { symbol: "w*", meaning: "Optimal weight vector", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Evaluating the fitted model: bias, variance, and R²",
        body: [
          "A fitted model is evaluated by the statistics of its errors on data it was not trained on. The error bias E[y − Xw] should be approximately zero — a systematic offset means the model form is wrong (a missing regressor, an uncaptured nonlinearity), not that the sensor is noisy. The error variance Var[y − Xw] estimates the noise floor: it becomes the σ² of the sensor model's certainty, the number every fusion algorithm downstream consumes as this sensor's trustworthiness. The coefficient of determination R² summarizes fit quality as the fraction of target variance the model explains — but it is a summary, not a diagnosis: a model can post a high R² on training data while extrapolating absurdly (the model-selection note's cautionary examples), so R² on held-out test data, alongside the error histogram, is the honest report.",
          "The complete sensor model that leaves this process has three parts: the estimation equation (the fitted regression), the error model (zero-mean Gaussian with the measured variance — after verifying the residual histogram actually looks Gaussian and the variance is stable across the range), and the domain of validity (the input range the training data covered). Checking the Gaussian assumption against residual histograms per operating point, and checking whether variance is constant or grows across the range, is precisely what the sensor-characterization case study walks through with real rangefinder data — and where the assumption fails, the model must say so, because downstream algorithms will trust whatever variance it declares.",
        ],
      },
      {
        type: "table",
        heading: "What each evaluation statistic diagnoses",
        columns: ["Statistic", "Question it answers", "A bad value means"],
        rows: [
          ["Error bias E[e]", "Is the model systematically off?", "Wrong model form — missing regressor or physics"],
          ["Error variance Var[e]", "How noisy is the calibrated sensor?", "This is the σ² fusion will use — measure it honestly"],
          ["R² (held-out)", "What fraction of variance is explained?", "Underfit (low) — or misleadingly high if judged on training data"],
          ["Residual histogram", "Is the Gaussian noise assumption valid?", "Skew/outliers → robust methods or better model needed"],
          ["Variance vs operating point", "Is one σ² enough for the whole range?", "Heteroscedastic sensor — state-dependent R needed"],
        ],
      },
      {
        type: "callout",
        heading: "The variance you fit here is the trust everything else uses",
        body: "The error variance measured during sensor modeling becomes the sensor's noise covariance R in every downstream algorithm — the weights in inverse-variance fusion, the likelihood width in Bayesian grids, the Kalman gain's denominator. Understate it and the fusion over-trusts a noisy sensor; overstate it and good information is ignored. Sensor characterization is not a lab formality; it is where the fusion system's numbers come from.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Sensor-model review",
        items: [
          "Collect calibration pairs across the full operating range, holding conditions fixed except the measured quantity.",
          "Choose regressors from physics where known; keep the model linear in weights.",
          "Fit with OLS: w* = (XᵀX)⁻¹Xᵀy; verify XᵀX is well-conditioned.",
          "Evaluate on held-out data: bias ≈ 0, variance measured, R² reported honestly.",
          "Verify the Gaussian residual assumption with histograms; check variance stability across the range.",
          "Record the model's domain of validity; never extrapolate silently beyond the calibration range.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What makes a 'linear' model able to fit curves?", answer: "Linearity is in the weights: ŷ = Σ wᵢfᵢ(x) with arbitrary regressor functions fᵢ (x², 1/x, sin x…). The fitting machinery sees only the regressor matrix, so nonlinear input relationships fit with convex, closed-form least squares." },
          { question: "Derive what OLS solves and when the solution exists.", answer: "Minimize (y−Xw)ᵀ(y−Xw); the zero-gradient condition gives the normal equations XᵀXw = Xᵀy, so w* = (XᵀX)⁻¹Xᵀy. It exists when XᵀX is invertible: more samples than regressors and no redundant (correlated) regressors." },
          { question: "Why is squared-error fitting 'probabilistically correct' for sensors?", answer: "Under additive zero-mean Gaussian noise, the likelihood of the data given weights is a Gaussian in the residuals, so maximizing likelihood is exactly minimizing the sum of squared errors — OLS is maximum likelihood for the standard sensor noise model." },
          { question: "What three things constitute a complete sensor model?", answer: "The estimation equation (fitted regression from raw output to desired quantity), the error model (verified zero-mean Gaussian with measured variance — the σ² downstream fusion consumes), and the domain of validity (the calibrated range)." },
        ],
      },
    ],
    sources: [eslHastie, bishopPrml],
    related: ["model-selection-and-robust-regression", "weighted-average-fusion", "probabilistic-classifiers", "sensor-fusion-case-studies", "lab-instruments-and-measurement"],
  },
  {
    slug: "model-selection-and-robust-regression",
    libraryId: "technical",
    collectionId: "sensor-fusion",
    title: "Model selection & robust regression",
    summary: "Choosing regressors without fooling yourself: singular Gram matrices and correlated features, forward selection, backward elimination, and PCA/SVD model reduction — then ridge regularization, weighted least squares, and the robust weight functions that defang outliers.",
    readingTime: 18,
    updatedAt: "Aug 9",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The wrong regressors fail quietly, then loudly",
        body: [
          "Give least squares the wrong regressor set and it will still return a solution — one that fits the training data plausibly and extrapolates disastrously. A quadratic process fitted with [1, x², x³, x⁴] posts a decent-looking training R² while its test error balloons and its high-order coefficients thrash to cancel each other inside the training window. Two lessons generalize. First, judge models on held-out data, where wrong forms reveal themselves. Second, prefer the fewest, simplest regressors that fit: every unnecessary regressor adds variance to the fit, an axis of overfitting, and a conditioning risk.",
          "The conditioning risk is concrete: OLS requires inverting XᵀX, and XᵀX is singular (or nearly so) when regressors are redundant — linearly dependent or highly correlated over the sampled domain. The classic trap is regressors that look different but behave identically where the data lives: x and sin(x) are indistinguishable for small x, so their columns are nearly parallel, the Gram matrix is nearly rank-deficient, and the inversion amplifies noise into enormous, meaningless weights. A necessary condition is more samples than regressors (m < N, in practice m ≪ N), but sufficiency demands regressors that carry independent information over the actual operating range.",
        ],
      },
      {
        type: "prose",
        heading: "Three systematic selection methods",
        body: [
          "Forward selection grows the model from nothing: start with a bias-only model, compute each candidate regressor's correlation with the current residual error, add the most correlated one, refit, and repeat until the improvement stops justifying the addition. Because each round targets the error the model still makes, it naturally picks regressors carrying new information and skips ones redundant with those already chosen. Backward elimination runs the reverse: start with all candidates fitted, remove each in turn to see which subtraction degrades performance least, drop it, and repeat — effective when the candidate pool is small enough to fit jointly in the first place. Both are greedy searches: neither guarantees the globally best subset, but both beat manual guessing and both use validation error, not training error, as the stopping criterion.",
          "Model reduction takes a different route: instead of choosing among the candidate regressors, transform them. Center the regressor matrix, compute its principal components — the orthogonal directions of greatest variance, obtainable as eigenvectors of XᵀX or directly from the singular value decomposition X = USVᵀ — and replace the original regressors with the projections onto the top-k components, chosen so the variance accounted for crosses a threshold (0.90, 0.95: plot the normalized singular values and pick the knee). The reduced matrix Xₖ = UₖSₖ has orthogonal, well-conditioned columns by construction. The trade: perfect conditioning and automatic dimensionality choice, at the cost of interpretability — each new 'regressor' is a blend of the originals, so the fitted weights no longer map to named physical effects.",
        ],
      },
      {
        type: "formula",
        heading: "Ridge regression: buying invertibility with bias",
        formula: "L = ‖y − Xw‖² + λ‖w‖²      w* = (XᵀX + nλI)⁻¹ Xᵀ y",
        explanation: "Regularization repairs a singular or ill-conditioned Gram matrix by adding λ down its diagonal, which makes the inversion unconditionally well-posed — the scalar analogy: x/(x²) blows up as x→0, but x/(x²+λ) stays finite. The cost function view says the same thing: penalizing the squared norm of the weights trades a little fitting accuracy for bounded, stable coefficients. The trade is explicit and tunable: as λ grows, the weight norm shrinks smoothly (a polynomial fit whose OLS weights were in the tens of thousands collapses to order-one weights), training error rises slightly, and wild extrapolation is tamed. The penalty norm also matters: the ℓ₂ (ridge) penalty shrinks all weights smoothly, while an ℓ₁ (lasso) penalty's corner geometry drives small weights exactly to zero — performing selection and regularization at once.",
        terms: [
          { symbol: "λ", meaning: "Regularization strength (chosen by validation)", unit: "≥ 0" },
          { symbol: "‖w‖²", meaning: "ℓ₂ penalty — smooth shrinkage (ridge)", unit: "—" },
          { symbol: "‖w‖₁", meaning: "ℓ₁ penalty — sparsity (lasso)", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Outliers, weighted least squares, and robust weights",
        body: [
          "Squared error has a structural vulnerability: it penalizes quadratically, so one wild point exerts enormous pull — the fit bends toward outliers precisely because their errors are large, biasing every estimate. When some data is visibly lower-quality, weighted least squares makes the judgment explicit: attach a weight qᵢ to each sample's squared error, assembling a diagonal weight matrix Q, and the solution becomes w* = (XᵀQX)⁻¹XᵀQy — samples with small weights barely influence the fit. The weights can encode anything known about per-sample quality: measurement conditions, sensor variance at that operating point, or staleness.",
          "Robust regression automates the weighting against outliers with an iterative loop: fit OLS, compute each point's residual, assign weights that shrink with residual size, refit with those weights, and iterate until stable. The classic weight functions differ in how aggressively they discount: Cauchy weights 1/(1+αe²) decay smoothly and never reach zero; Welsch weights exp(−αe²) decay faster; bisquare weights (1−(αe)²)² inside a cutoff and exactly zero beyond it — points past the cutoff are excluded outright. The parameter α sets the scale separating 'noise' from 'outlier' and is typically tied to the residual spread (a multiple of the standard deviation). The effect on real data is dramatic: a fitted curve dragged visibly toward a cluster of bad points snaps back onto the bulk of the data, and the recovered weights double as an outlier report.",
        ],
      },
      {
        type: "table",
        heading: "The least-squares family",
        columns: ["Method", "Cost function", "Solution", "Use when"],
        rows: [
          ["Ordinary LS", "‖y − Xw‖²", "(XᵀX)⁻¹Xᵀy", "Clean data, well-conditioned regressors"],
          ["Ridge (regularized)", "‖y − Xw‖² + λ‖w‖²", "(XᵀX + nλI)⁻¹Xᵀy", "Correlated/near-singular regressors, overfitting"],
          ["Weighted LS", "(y − Xw)ᵀQ(y − Xw)", "(XᵀQX)⁻¹XᵀQy", "Known per-sample quality differences"],
          ["Robust (IRLS)", "Weighted LS with residual-driven Q, iterated", "Iterate weight ↔ fit", "Outlier-contaminated data"],
        ],
      },
      {
        type: "callout",
        heading: "Training error cannot pick the model",
        body: "Adding regressors never worsens training fit — a higher-order polynomial always fits the training points at least as well — so training R² monotonically rewards complexity right into overfitting. Model order and λ must be chosen on validation data (or by cross-validation), where superfluous complexity finally shows its cost. The reasonable model orders are the ones whose validation error sits at the plateau: past the underfit cliff, before the overfit climb.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Selection & robustness review",
        items: [
          "Check regressor correlation over the actual operating domain; near-parallel columns mean a near-singular XᵀX.",
          "Keep m ≪ N and prefer the fewest, simplest regressors that fit validation data.",
          "Grow with forward selection (correlate candidates with residuals) or prune with backward elimination.",
          "Use PCA/SVD model reduction when conditioning matters more than interpretability; pick k by variance accounted for.",
          "Regularize with ridge when XᵀX is ill-conditioned; choose λ by validation, watching the ‖w‖ vs error trade.",
          "Weight samples by known quality (WLS); iterate robust weights (Cauchy/Welsch/bisquare) against outliers.",
          "Select model order where validation error plateaus — never by training fit.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "When is XᵀX singular, and what are the two fixes?", answer: "When regressors are redundant — linearly dependent or highly correlated over the sampled domain (x and sin x at small x), or fewer samples than regressors. Fixes: reselect/remove correlated regressors (or reduce via PCA/SVD), or regularize — ridge adds λI to make inversion well-posed at the cost of shrinkage bias." },
          { question: "How does forward selection decide what to add next?", answer: "It correlates every remaining candidate regressor with the current model's residual error and adds the most correlated one — targeting information the model still lacks, automatically skipping regressors redundant with those already included. Stop when validation improvement ends." },
          { question: "What does ridge regression trade for stability?", answer: "Accuracy of the unconstrained fit: penalizing ‖w‖² shrinks weights smoothly (bias) in exchange for a well-conditioned inversion, bounded coefficients, and tamed extrapolation. λ tunes the trade; ℓ₁ instead yields sparsity — exact zeros — doing selection simultaneously." },
          { question: "How does robust regression neutralize outliers?", answer: "Iteratively reweighted least squares: fit, compute residuals, assign weights that shrink with residual magnitude (Cauchy 1/(1+αe²), Welsch exp(−αe²), bisquare with a hard cutoff), refit weighted, iterate. Outliers end with near-zero influence and the weights double as an outlier report." },
        ],
      },
    ],
    sources: [eslHastie, bishopPrml],
    related: ["sensor-models-and-least-squares", "weighted-average-fusion", "neural-networks-for-sensor-fusion", "sensor-fusion-case-studies"],
  },
];
