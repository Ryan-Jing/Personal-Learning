import type { Note, Source } from "./library";

const nationalGridEso: Source = {
  title: "Balancing the electricity system (frequency, reserve, inertia)",
  publisher: "National Energy System Operator (NESO)",
  url: "https://www.neso.energy/industry-information/balancing-services",
  kind: "Reference",
};

const enaConnections: Source = {
  title: "Engineering Recommendation G98 / G99 — connecting generation",
  publisher: "Energy Networks Association",
  url: "https://www.energynetworks.org/industry-hub/resource-library/",
  kind: "Reference",
};

const powerSystemAnalysis: Source = {
  title: "Power System Analysis and Design",
  publisher: "Glover, Overbye & Sarma, Cengage",
  url: "https://www.cengage.com/c/power-system-analysis-and-design-6e-glover/",
  kind: "Book",
};

const ieeeGridForming: Source = {
  title: "Grid-Forming Inverters and System Inertia (technical reports)",
  publisher: "IEEE Power & Energy Society",
  url: "https://www.ieee-pes.org/",
  kind: "Reference",
};

export const gridSystemsNotes: Note[] = [
  {
    slug: "power-grid-architecture",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "The power grid: architecture & voltage tiers",
    summary: "How the grid is built as a voltage hierarchy, why bulk power travels at hundreds of kilovolts, the role of transformers and three-phase, and the operators and connection standards that govern anything plugged into it.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The grid is a voltage hierarchy",
        body: [
          "The electricity grid is a hierarchy whose whole purpose is to move bulk power from a few large sources to millions of small loads while wasting as little as possible in the wires. It does that by transforming voltage up for the long haul and back down for safe local use, in tiers. Transmission carries bulk power over long distances at very high voltage (roughly 132–400 kV in the UK, up to 765 kV or more globally). Sub-transmission and primary distribution step that down to regional and city feeders (around 11–33 kV in the UK). Secondary or low-voltage distribution delivers the final drop to homes and small businesses (230 V single-phase, 400 V three-phase in the UK). Each tier exists because the right voltage for moving power a hundred kilometres is lethally wrong for a wall socket, and vice versa.",
          "The reason the whole structure is possible — and the reason the grid is AC rather than DC historically — is the transformer. A transformer changes AC voltage with very high efficiency and no moving parts, so a generator's output can be stepped up to hundreds of kilovolts for transport and stepped down again at each substation. That single device is what makes a voltage hierarchy practical, and it is why the argument that settled on alternating current a century ago still shapes every grid today.",
        ],
      },
      {
        type: "formula",
        heading: "Why bulk power travels at high voltage",
        formula: "P = V·I     P_loss = I²·R     (for fixed P: I = P/V, so P_loss = (P/V)²·R)",
        explanation: "Power is voltage times current, so a given amount of power can be sent as high voltage and low current or low voltage and high current. Line loss, however, is the current squared times the conductor resistance — it depends on current, not on the transmitted voltage. Raising the transmission voltage lets the same power flow at a proportionally lower current, and because loss scales with the square of current, doubling the voltage quarters the loss. That quadratic is the entire justification for hundreds of kilovolts on transmission towers: it is the cheapest lever there is for moving power a long way efficiently.",
        terms: [
          { symbol: "P", meaning: "Transmitted (real) power", unit: "W" },
          { symbol: "I", meaning: "Line current", unit: "A" },
          { symbol: "R", meaning: "Conductor resistance", unit: "Ω" },
        ],
      },
      {
        type: "table",
        heading: "The three grid tiers (UK typical values)",
        columns: ["Tier", "Typical voltage", "Purpose"],
        rows: [
          ["Transmission", "132 kV – 400 kV (up to 765 kV globally)", "Bulk power over long distance; minimize I²R loss"],
          ["Sub-transmission / primary distribution", "11 kV – 33 kV", "Regional and city-wide feeders"],
          ["Secondary / low-voltage distribution", "230 V single-phase, 400 V three-phase", "Final delivery to homes and small businesses"],
        ],
      },
      {
        type: "prose",
        heading: "Three-phase, frequency, and the numbers to know",
        body: [
          "Utilities distribute power as three-phase AC — three voltages 120° apart — for three linked reasons: the total instantaneous power delivered by a balanced three-phase system is constant rather than pulsating, three-phase uses conductor copper more efficiently than single-phase for the same power, and three phases naturally create the rotating magnetic field that industrial motors run on. The line-to-line voltage is √3 times the line-to-neutral voltage, which is exactly why the UK's 230 V phase-to-neutral supply appears as 400 V between phases (230 × √3 ≈ 400). A home usually gets one phase and neutral; a larger building gets all three.",
          "Grid frequency is a design constant, not a free parameter: 50 Hz across the UK and most of the world, 60 Hz in North America. That number propagates into everything — transformer and magnetics core sizing (volt-seconds scale inversely with frequency), the timing of any grid-synchronized PWM, filter corner frequencies, and motor speeds. Any calculation or firmware carried over from a 60 Hz region has to be re-checked against 50 Hz, because the grid's frequency sits underneath the whole design.",
        ],
      },
      {
        type: "prose",
        heading: "Who runs the grid, and the rules for connecting to it",
        body: [
          "Two kinds of operator matter. A transmission system operator (in Great Britain, the National Energy System Operator) balances generation against demand in real time across the whole network and keeps frequency in bounds. Distribution network operators (DNOs, evolving into more active DSOs) own and run the local medium- and low-voltage network that a consumer product actually connects to. Knowing which body owns which layer is the difference between understanding 'the grid' as a slogan and as a system with responsibilities.",
          "Anything that pushes power back into the network — a solar inverter, a battery, a microgenerator — must comply with connection standards, and these are worth naming precisely. In the UK, Engineering Recommendation G98 covers small embedded generation that can connect by simple notification (broadly up to 16 A per phase, about 3.68 kW single-phase — most residential solar and microinverters), while G99 covers larger installations that need explicit DNO approval; G100 governs export limitation, and BS 7671 (the IET Wiring Regulations) governs the installation itself. Internationally the analogous documents are IEEE 1547 and UL 1741. These standards specify voltage and frequency operating ranges, power quality limits, and — critically — anti-islanding behaviour, so they are not paperwork but hard design requirements for any grid-connected product.",
        ],
      },
      {
        type: "callout",
        heading: "Transmission is meshed; distribution is often radial",
        body: "High-voltage transmission is built as a mesh so power can reach a node by several paths and survive a line outage. Distribution feeders are frequently radial — a single path out to the loads — which is cheaper but means a fault upstream drops everything downstream. Distributed generation and storage on a radial feeder change its behaviour (reverse power flow, local voltage rise), which is part of why connection standards exist.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Grid-architecture review",
        items: [
          "Identify which voltage tier a device connects at and what transformer stages sit above it.",
          "Use P_loss = I²R to justify voltage level and conductor sizing; the loss follows current squared.",
          "Track single-phase vs three-phase and the √3 line-to-line relationship for the region.",
          "Design to the region's frequency (50 vs 60 Hz) everywhere it touches magnetics, PWM, and filters.",
          "Confirm the applicable connection standard (G98/G99, IEEE 1547/UL 1741) before exporting power.",
          "Consider whether the feeder is radial or meshed when reasoning about faults and reverse power flow.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does bulk power travel at hundreds of kilovolts?", answer: "Because line loss is I²R — it depends on current, not transmitted voltage. Raising voltage lowers current for the same power, and loss falls with the square of current, so high voltage is the cheapest way to move power efficiently over distance." },
          { question: "Why is the grid three-phase, and what is the √3 relationship?", answer: "Three-phase delivers constant (non-pulsating) power, uses conductor copper efficiently, and creates a rotating field for motors. The line-to-line voltage is √3 times the line-to-neutral, so 230 V phase-to-neutral gives ~400 V between phases." },
          { question: "What makes transformers central to the grid?", answer: "They change AC voltage efficiently with no moving parts, making the step-up-for-transport, step-down-for-use hierarchy practical — the historical reason grids are AC." },
          { question: "What do G98 and G99 govern?", answer: "UK connection of embedded generation: G98 for small devices that connect by notification (≈≤16 A/phase, ~3.68 kW single-phase), G99 for larger installs needing DNO approval. They set voltage/frequency ranges, power quality, and anti-islanding requirements." },
        ],
      },
    ],
    sources: [powerSystemAnalysis, enaConnections],
    related: ["ac-power-real-reactive-apparent", "transmission-lines-and-losses", "grid-tie-inverters", "transformers-and-isolation"],
  },
  {
    slug: "ac-power-real-reactive-apparent",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "Real, reactive & apparent power",
    summary: "The power triangle: why AC current can be out of phase with voltage, how real (W), reactive (VAR), and apparent (VA) power relate, what power factor means to a utility, and how reactive power sets voltage.",
    readingTime: 15,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Not all delivered current does work",
        body: [
          "In a purely resistive DC circuit, power is simply voltage times current. In AC systems with inductance and capacitance, the current can be shifted in phase relative to the voltage, and that phase shift means some of the delivered volt-amperes do no net work — they only shuttle energy back and forth between the source and the reactive elements. Separating the part of the power that does work from the part that merely occupies the wires is the single most important idea in AC power engineering, and it is captured by three quantities and the angle between them.",
          "Inductive loads (motors, transformers, most of the grid's load) draw current that lags the voltage; capacitive loads draw current that leads. The phase angle φ between voltage and current is what divides the total apparent power into a useful component and a reactive component. Understanding this is what lets you reason about why a utility cares how a load draws its current, not just how much power it consumes.",
        ],
      },
      {
        type: "formula",
        heading: "The power triangle",
        formula: "P = V·I·cos φ   (W)      Q = V·I·sin φ   (VAR)      S = V·I = √(P² + Q²)   (VA)      PF = P/S = cos φ",
        explanation: "Real power P is the average power that does actual work — the watts you are billed for and that turn into torque, heat, or light. Reactive power Q is the power that oscillates between the source and reactive elements every cycle, doing no net work but flowing as real current. Apparent power S is the vector sum, the total volt-amperes the source must actually supply, and it forms the hypotenuse of a right triangle with P along the horizontal and Q along the vertical. Power factor is the ratio of useful to apparent power, equal to the cosine of the phase angle; a power factor of 1 means voltage and current are in phase and every delivered volt-ampere does work.",
        terms: [
          { symbol: "P / Q / S", meaning: "Real / reactive / apparent power", unit: "W / VAR / VA" },
          { symbol: "φ", meaning: "Phase angle between voltage and current", unit: "degrees" },
          { symbol: "PF", meaning: "Power factor (cos φ)", unit: "0–1" },
        ],
      },
      {
        type: "table",
        heading: "The three powers compared",
        columns: ["Quantity", "Symbol / unit", "What it is", "Why it matters"],
        rows: [
          ["Real power", "P, watts (W)", "Average power doing work", "The energy actually consumed / billed"],
          ["Reactive power", "Q, volt-amperes reactive (VAR)", "Energy sloshing to/from L and C", "Occupies capacity; sets local voltage"],
          ["Apparent power", "S, volt-amperes (VA)", "Vector sum the source must supply", "Sizes conductors, transformers, ratings"],
          ["Power factor", "PF = cos φ", "Ratio P/S", "Low PF = more current for same work"],
        ],
      },
      {
        type: "prose",
        heading: "Why utilities care about power factor",
        body: [
          "A load with a poor power factor draws more current than its useful power alone would require, because part of that current is supplying reactive power that does no work. That extra current still flows through every generator, transformer, and conductor between the plant and the load, causing extra I²R loss and consuming capacity that could carry real power. This is why large consumers are penalised for low power factor and why factories install power-factor-correction capacitors: a capacitor bank supplies the reactive power an inductive plant needs locally, so the reactive current stops travelling all the way back through the network. Correcting power factor toward unity frees up capacity and cuts losses without changing the useful work done.",
          "There is a subtlety with modern non-linear loads (switching supplies, rectifiers): they distort the current waveform, adding harmonics. The full 'true' power factor then has two parts — a displacement factor (the cos φ of the fundamental) and a distortion factor (how non-sinusoidal the current is). A cheap rectifier can have near-unity displacement but a poor true power factor from harmonics, which is why active power-factor-correction front ends exist. For grid-scale reasoning, though, the P/Q/S triangle and cos φ are the working model.",
        ],
      },
      {
        type: "prose",
        heading: "Reactive power sets voltage — the control lever",
        body: [
          "Reactive power is not just an accounting nuisance; on the grid it is tightly coupled to voltage magnitude. Injecting reactive power at a point tends to raise the local voltage, and absorbing it tends to lower it, because of how reactive current interacts with the network's series reactance. Real power flow, by contrast, is more closely coupled to phase angle and frequency. This separation — real power with frequency, reactive power with voltage — is the foundation of how the grid is controlled: frequency is managed by balancing real power, and voltage is managed by managing reactive power.",
          "That is exactly why modern grid-connected inverters are increasingly required to control reactive power. A smart inverter can be commanded to supply or absorb VARs independently of the real power it is producing — volt-VAR control — to hold the local voltage within limits as distributed generation pushes it around. So the abstract power triangle becomes a concrete capability: an inverter sitting at the edge of a distribution feeder can help regulate the grid's voltage by choosing where it operates on that triangle, which is one of the ways inverter-based resources provide grid support.",
        ],
      },
      {
        type: "callout",
        heading: "Reactive power is real current that does no net work",
        body: "It is tempting to dismiss reactive power as 'imaginary,' but the reactive current is entirely real: it heats conductors, loads transformers, and must be supplied by the source. What is zero is only its net work over a cycle. That is why it is measured (in VAR), penalised, corrected with capacitors, and increasingly provided by inverters for voltage support.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "AC-power review",
        items: [
          "Separate real (W), reactive (VAR), and apparent (VA) power; know S = √(P²+Q²).",
          "Compute power factor as cos φ and reason about the extra current low PF forces.",
          "Attribute losses and equipment sizing to apparent power, not just real power.",
          "Distinguish displacement PF from distortion (harmonic) PF for switching loads.",
          "Map real power to frequency control and reactive power to voltage control.",
          "Consider volt-VAR capability when a grid-tie inverter must support local voltage.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Define real, reactive, and apparent power and their relationship.", answer: "Real power P = VI cos φ does work (W); reactive power Q = VI sin φ oscillates to/from L and C doing no net work (VAR); apparent power S = VI is their vector sum, S = √(P²+Q²) (VA). Power factor is P/S = cos φ." },
          { question: "Why does a utility penalise low power factor?", answer: "Low PF means more current for the same useful power, because part of the current supplies reactive power. That extra current causes I²R losses and consumes conductor/transformer capacity across the whole delivery path." },
          { question: "How is reactive power used to control the grid?", answer: "Reactive power is coupled to voltage magnitude — injecting VARs raises local voltage, absorbing lowers it. Smart inverters use volt-VAR control to supply or absorb reactive power and hold local voltage within limits." },
          { question: "Why isn't reactive power 'free'?", answer: "The reactive current is real: it heats conductors and loads equipment and must be supplied by the source. Only its net work per cycle is zero — which is why it is corrected with capacitors and now with inverter VAR support." },
        ],
      },
    ],
    sources: [powerSystemAnalysis, nationalGridEso],
    related: ["power-grid-architecture", "grid-stability-and-inverter-based-resources", "grid-tie-inverters", "transmission-lines-and-losses"],
  },
  {
    slug: "grid-stability-and-inverter-based-resources",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "Grid stability, inertia & inverter-based resources",
    summary: "Frequency as the real-time balance of supply and demand, the inertia that spinning generators provide and inverters do not, grid-following vs grid-forming control, synthetic inertia, and demand-side response.",
    readingTime: 17,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Frequency is the balance of supply and demand",
        body: [
          "Grid frequency is the single number that reports, in real time, whether the grid is generating exactly as much power as it is consuming. Every synchronous generator on the network spins in lockstep at the grid frequency, and their combined rotational speed is the frequency. When load exceeds generation, that extra demand is drawn from the generators' kinetic energy, they slow down, and the frequency dips below 50 Hz; when generation exceeds load, they speed up and frequency rises. The grid must hold frequency within tight bounds (in Great Britain, a statutory ±1% around 50 Hz, with normal operation kept far tighter, near ±0.2 Hz), because equipment and the generators themselves are designed around it. Frequency, in other words, is a live scoreboard of power balance, and keeping it steady is the moment-to-moment job of the system operator.",
          "Because frequency responds to imbalance continuously, it is also the signal that automatic controls act on: generators adjust their output in response to frequency deviations (governor response), and fast reserves are dispatched to arrest and correct excursions. The whole apparatus of balancing services exists to keep this one number where it belongs.",
        ],
      },
      {
        type: "prose",
        heading: "Inertia: the grid's flywheel",
        body: [
          "The reason a large grid does not swing wildly in frequency the instant a big load or generator trips is inertia. The synchronous generators' massive spinning rotors store enormous kinetic energy, and that energy instantaneously opposes any change in frequency — when a plant trips, the remaining machines momentarily give up some of their rotational energy to supply the deficit, slowing the rate at which frequency falls and buying seconds for controls and reserves to respond. This resistance to change is quantified as system inertia, and the initial slope of a frequency excursion after a disturbance is the rate of change of frequency (RoCoF). High inertia means a gentle RoCoF and time to react; low inertia means frequency moves fast and controls have less margin before protection trips.",
          "Here is the central challenge of a modern grid: solar and wind connect through power-electronic inverters, which have no inherent rotating mass and therefore contribute no natural inertia. As synchronous coal and gas plant retires and is replaced by inverter-based renewables, the grid's total inertia falls, RoCoF after a disturbance rises, and frequency becomes harder to hold. This is not a minor detail — it is the defining stability problem of a high-renewable grid, and it is why so much engineering attention is going into making inverters behave more like the machines they are replacing.",
        ],
      },
      {
        type: "formula",
        heading: "Rate of change of frequency",
        formula: "RoCoF = df/dt ≈ (f₀ · ΔP) / (2·H·S)",
        explanation: "Immediately after a power imbalance ΔP (a lost generator or a switched load), the frequency changes at a rate set by the system's inertia. H is the inertia constant — roughly the seconds of energy the spinning mass stores at rated power — and S is the connected capacity. More inertia (larger H·S) means a smaller RoCoF for the same disturbance: the frequency drifts gently and there is time to respond. As inverter-based generation with no rotating mass displaces synchronous machines, H·S falls and the same disturbance produces a steeper, more dangerous RoCoF — which is precisely why synthetic inertia and grid-forming inverters are being introduced.",
        terms: [
          { symbol: "ΔP", meaning: "Sudden power imbalance", unit: "W (or per-unit)" },
          { symbol: "H", meaning: "System inertia constant", unit: "s" },
          { symbol: "f₀ / S", meaning: "Nominal frequency / connected capacity", unit: "Hz / VA" },
        ],
      },
      {
        type: "prose",
        heading: "Grid-following vs grid-forming inverters",
        body: [
          "Inverters come in two control philosophies, and the distinction is now a central topic in power systems. A grid-following inverter uses a phase-locked loop to measure the existing grid's voltage and frequency and then injects current synchronised to it — it behaves like a controlled current source riding on a grid that something else is holding up. This is how almost all solar and wind has connected historically, and it works well as long as the grid is stiff, but a grid-following inverter cannot exist on its own: with no external voltage to lock to, it has nothing to synchronise against, so it cannot start a dead network.",
          "A grid-forming inverter instead actively sets its own voltage magnitude and frequency, behaving like a voltage source behind an impedance — the role synchronous generators play. Because it defines the voltage and frequency rather than following them, it can black-start a network, hold up a microgrid on its own, and provide synthetic (virtual) inertia by rapidly adjusting its power output in response to frequency change, emulating the flywheel effect it does not physically have. As the share of inverter-based generation rises, grid-forming capability shifts from a nice-to-have to a necessity, because someone has to define the grid's voltage and frequency once the big spinning machines are gone. This is one of the most active areas in grid engineering, and knowing the distinction — and that grid-forming plus fast storage is how a renewable grid stays stable — is a strong signal of current understanding.",
        ],
      },
      {
        type: "table",
        heading: "Grid-following vs grid-forming",
        columns: ["Aspect", "Grid-following", "Grid-forming"],
        rows: [
          ["Behaves like", "Current source injecting into the grid", "Voltage source setting V and f"],
          ["Needs an existing grid?", "Yes — locks to it via a PLL", "No — can define/black-start a grid"],
          ["Inertia contribution", "None inherently", "Synthetic/virtual inertia possible"],
          ["Islanded / microgrid operation", "Cannot form a grid alone", "Can hold up a microgrid"],
          ["Typical use today", "Most existing solar/wind", "Emerging requirement at high inverter share"],
        ],
      },
      {
        type: "prose",
        heading: "Demand-side response: balancing from the load end",
        body: [
          "Balance can be restored from either side of the meter, and shifting flexible demand is an increasingly important tool. Demand-side response (or load shifting) defers or advances flexible loads — EV charging, water and space heating, battery charging, industrial processes — to times when generation is abundant and cheap, typically the middle of a sunny or windy period, and away from demand peaks. Done at scale through smart devices responding to price signals or direct grid commands, this flattens the demand curve, reduces the need for expensive peaking plant, and can even provide fast frequency regulation by trimming or boosting aggregated load in seconds. It is the same balancing act as dispatching a generator, run from the consumption side.",
          "For a connected consumer energy product, this is a concrete design goal rather than an abstraction: a device that can safely and automatically move its energy use to off-peak, high-generation windows both saves its owner money and helps hold the grid's frequency. Combined with local storage, demand-side response turns a passive load into a controllable, grid-supportive resource.",
        ],
      },
      {
        type: "callout",
        heading: "Inertia is fading; inverters must fill the gap",
        body: "The move to renewables replaces spinning synchronous mass with inverters that have no natural inertia, so frequency now moves faster after a disturbance. The answers are grid-forming inverters that emulate inertia, fast-responding battery storage, and demand-side response — together reconstructing the stability the flywheels used to provide for free.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Grid-stability review",
        items: [
          "Read frequency as the real-time supply/demand balance; deviations mean imbalance.",
          "Reason about RoCoF from inertia: less inertia means faster, riskier frequency swings.",
          "Distinguish grid-following (needs a stiff grid, no inertia) from grid-forming (sets V/f, can black-start, gives synthetic inertia).",
          "Identify where synthetic inertia and fast frequency response come from as synchronous plant retires.",
          "Treat flexible loads as a balancing resource via demand-side response and time-of-use signals.",
          "For a connected product, design flexible loads to shift toward abundant-generation windows.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What does grid frequency tell you, and what keeps it steady?", answer: "It reports the real-time balance of generation and demand — falling when load exceeds generation, rising when generation exceeds load. Synchronous generators' spinning mass (inertia) and dispatched reserves keep it near 50 Hz." },
          { question: "Why is falling inertia the central challenge of a renewable grid?", answer: "Inverter-based solar and wind have no rotating mass, so as they displace synchronous generators the system's inertia falls, RoCoF after a disturbance rises, and frequency becomes harder to hold — risking faster trips and instability." },
          { question: "Grid-following vs grid-forming — what's the difference?", answer: "Grid-following locks to an existing grid with a PLL and injects current like a current source; it can't start a dead grid. Grid-forming sets its own voltage and frequency like a voltage source, so it can black-start, hold a microgrid, and provide synthetic inertia." },
          { question: "How does demand-side response help stability?", answer: "It shifts flexible loads (EV/water heating, battery charging) to times of abundant generation and away from peaks, flattening demand and even providing fast frequency regulation by trimming or boosting aggregated load in seconds." },
        ],
      },
    ],
    sources: [nationalGridEso, ieeeGridForming],
    related: ["ac-power-real-reactive-apparent", "grid-tie-inverters", "battery-storage-for-solar-and-grid", "power-grid-architecture"],
  },
  {
    slug: "transmission-lines-and-losses",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "Transmission lines: parameters, losses & HVDC",
    summary: "The RLGC line model and why 50 Hz lines are electrically short, the loss mechanisms (I²R, skin effect, corona, dielectric), AC voltage drop and the Ferranti effect, surge impedance loading, and when HVDC wins.",
    readingTime: 17,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A line is distributed R, L, C, and G",
        body: [
          "A transmission line is modelled as four distributed parameters spread along its length: series resistance R (the conductor's ohmic resistance), series inductance L (from the magnetic field around the current), shunt capacitance C (between conductors and to ground), and shunt conductance G (leakage and dielectric loss). These are given per unit length, and together they determine how voltage and current behave along the line. The relative importance of each is what distinguishes power-line engineering from the high-frequency transmission-line theory used in RF and high-speed digital design.",
          "The crucial simplification at power frequency is scale. A wavelength at 50 Hz is enormous — the speed of light divided by 50 Hz is about 6000 km — so a line of tens or a few hundred kilometres is only a tiny fraction of a wavelength and is electrically short. That means you do not, in general, treat a power line with characteristic-impedance matching and reflection the way you would a 50 Ω coax carrying gigahertz signals; instead you use lumped or medium-length π models built from the R, L, C, and G values and worry about voltage drop and losses. It is the utility-scale version of the rule that a line only 'becomes a transmission line' when its length is comparable to the signal's wavelength — at 50 Hz, most of the network is nowhere near that threshold.",
        ],
      },
      {
        type: "table",
        heading: "Loss mechanisms on a transmission line",
        columns: ["Mechanism", "Cause", "Mitigation"],
        rows: [
          ["I²R (ohmic) loss", "Conductor resistance carrying current", "High voltage / low current; larger conductor"],
          ["Skin effect", "AC crowds to conductor surface, raising effective R", "Stranded ACSR, bundled conductors"],
          ["Corona discharge", "Air ionizes at very high surface field", "Larger effective diameter, conductor bundling"],
          ["Dielectric loss", "Leakage/loss in cable insulation (G term)", "Better insulation; matters mainly underground"],
        ],
      },
      {
        type: "prose",
        heading: "Where the power goes",
        body: [
          "The dominant loss is ohmic I²R heating in the conductors, which is exactly why the whole system runs at high voltage and low current. On top of that sit several frequency- and voltage-dependent effects. Skin effect pushes alternating current toward the surface of a conductor, so the interior carries less and the effective resistance rises; at 50 Hz this is mild but not negligible on the large conductors used for transmission, and it is part of why transmission uses stranded aluminium-conductor steel-reinforced (ACSR) cable and sometimes several conductors bundled per phase. Corona discharge appears at very high voltage when the electric field at the conductor surface is strong enough to ionise the surrounding air, producing power loss, an audible hum, and radio interference; it is controlled by increasing the effective conductor diameter, again through bundling. Dielectric loss — the G term — matters mainly in underground and undersea cables, where the current continuously charges and discharges the insulation's capacitance and any loss in that dielectric shows up as heat.",
        ],
      },
      {
        type: "formula",
        heading: "AC voltage drop includes reactance",
        formula: "ΔV ≈ I·(R·cos φ + X·sin φ)      where X = 2π·f·L",
        explanation: "The voltage dropped along an AC line is not just I·R; it also includes the drop across the line's series reactance X, weighted by the load's power factor. On transmission lines the reactance X is often several times larger than the resistance R, so the reactive term dominates the voltage drop — which is why controlling reactive power flow is central to managing voltage on the grid, and why a purely resistive intuition from DC circuits understates how much voltage a line loses under a reactive load.",
        terms: [
          { symbol: "ΔV", meaning: "Voltage drop along the line", unit: "V" },
          { symbol: "R / X", meaning: "Series resistance / reactance per line", unit: "Ω" },
          { symbol: "cos φ / sin φ", meaning: "Load power factor terms", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Ferranti effect and surge impedance loading",
        body: [
          "Two behaviours capture how a line's inductance and capacitance interact with its loading. The Ferranti effect is the counterintuitive rise of voltage at the receiving end of a long, lightly loaded line above the sending-end voltage: with little load current, the line's own shunt capacitance draws a leading charging current that flows through the series inductance and, by the interaction, raises the far-end voltage. It is most pronounced on long, high-voltage, lightly loaded lines and underground cables (which have high capacitance), and it is one of the reasons networks include shunt reactors and active voltage regulation to pull the voltage back down.",
          "Surge impedance loading (SIL) is the loading at which a line's reactive absorption in its series inductance exactly equals the reactive power its shunt capacitance generates, producing a flat voltage profile from end to end. Loaded above its SIL, a line net-absorbs reactive power and its voltage tends to sag; loaded below SIL, it net-generates reactive power and its voltage tends to rise (the Ferranti regime). SIL is therefore a natural reference point for how a line will behave, and keeping heavily loaded lines supplied with reactive power (shunt capacitors, series compensation, FACTS devices like SVCs and STATCOMs) versus draining reactive power from lightly loaded ones (shunt reactors) is a large part of transmission voltage control.",
        ],
      },
      {
        type: "prose",
        heading: "When DC beats AC: HVDC",
        body: [
          "For most of the grid, AC's easy voltage transformation wins, but there are regimes where high-voltage DC is the better choice. Over very long overhead distances, HVDC has lower per-kilometre loss and avoids the reactive and skin-effect penalties AC accumulates. For undersea and long underground cables, AC is nearly unusable over distance because the cable's large shunt capacitance draws so much charging current that little capacity is left for real power — HVDC sidesteps this entirely because DC does not continuously charge and discharge the cable. And HVDC can link two AC grids that are not synchronised (or run at different frequencies), acting as a controllable, asynchronous tie between them, which is how cross-border interconnectors join separate national grids.",
          "The trade-off is the converter stations: HVDC needs expensive AC-to-DC and DC-to-AC conversion at each end (older line-commutated thyristor converters, or modern voltage-source converters using IGBTs, which can also provide grid-forming-like control). Those stations are a large fixed cost, so HVDC pays off only past a break-even distance — very roughly 500–800 km for overhead lines and around 50 km for subsea cable — beyond which the lower line losses and the absence of the AC cable-charging problem outweigh the converter cost. Knowing when a link should be DC rather than AC, and why undersea cables force the question, is a compact way to show you understand transmission at the system level.",
        ],
      },
      {
        type: "callout",
        heading: "At 50 Hz you design with R, L, C — not Z₀ matching",
        body: "Because a power line is electrically short at 50 Hz, the RF instinct to match characteristic impedance and chase reflections does not apply; you work with the line's resistance, inductance, capacitance, voltage drop (including the reactive term), and reactive-power behaviour. The transmission-line-as-antenna, impedance-matching mindset returns only at RF and high-speed digital.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Transmission-line review",
        items: [
          "Model the line from its R, L, C, G per unit length; use lumped/π models at 50 Hz, not Z₀ matching.",
          "Attribute losses to I²R first, then skin effect, corona, and (in cables) dielectric loss.",
          "Include the reactive term in voltage drop: ΔV ≈ I(R cos φ + X sin φ), with X often dominating.",
          "Expect voltage rise (Ferranti) on long, lightly loaded lines and cables; plan reactive compensation.",
          "Use surge impedance loading as the reference for whether a line absorbs or generates VARs.",
          "Consider HVDC for very long overhead runs, long subsea cables, and asynchronous grid ties.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why are 50 Hz power lines treated as electrically short?", answer: "The wavelength at 50 Hz is about 6000 km, so lines of tens to a few hundred km are a tiny fraction of a wavelength. You use lumped or π models built from R, L, C, G and worry about voltage drop and losses, not characteristic-impedance matching." },
          { question: "Name the main transmission loss mechanisms.", answer: "I²R ohmic loss (dominant, cut by high voltage), skin effect (AC crowding to the surface raising effective R), corona discharge (air ionizing at high field, managed by bundling), and dielectric loss in cable insulation." },
          { question: "What is the Ferranti effect?", answer: "On a long, lightly loaded line the shunt capacitance draws a leading charging current through the series inductance, raising the receiving-end voltage above the sending-end voltage — a reason shunt reactors and voltage regulation exist." },
          { question: "When is HVDC preferred over AC?", answer: "Very long overhead distances (lower per-km loss), long subsea/underground cables (no capacitive charging-current problem), and linking asynchronous grids. It needs costly converter stations, so it pays off past ~500–800 km overhead or ~50 km subsea." },
        ],
      },
    ],
    sources: [powerSystemAnalysis],
    related: ["power-grid-architecture", "ac-power-real-reactive-apparent", "transformers-and-isolation", "signals-and-power-over-distance"],
  },
];
