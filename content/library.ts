export type Accent = "yellow" | "orange" | "aqua" | "blue" | "purple" | "green";

export type Library = {
  id: "technical" | "personal";
  title: string;
  description: string;
  mark: string;
  accent: Accent;
};

export type Collection = {
  id: string;
  libraryId: Library["id"];
  title: string;
  description: string;
  focus: string;
  mark: string;
  accent: Accent;
  noteSlugs: string[];
};

export type Source = {
  title: string;
  publisher: string;
  url: string;
  kind: "Course" | "Reference" | "Book" | "Documentation";
};

export type NoteBlock =
  | { type: "prose"; heading: string; body: string[] }
  | { type: "formula"; heading: string; formula: string; explanation: string; terms: { symbol: string; meaning: string; unit: string }[] }
  | { type: "circuit"; heading: string; intro: string; alt: string; voltage: string; resistance: string; current: string; caption: string }
  | { type: "table"; heading: string; columns: string[]; rows: string[][] }
  | { type: "callout"; heading: string; body: string; tone: "note" | "warning" }
  | { type: "checklist"; heading: string; items: string[] }
  | { type: "code"; heading: string; intro: string; language: string; code: string }
  | { type: "review"; heading: string; prompts: { question: string; answer: string }[] };

export type Note = {
  slug: string;
  libraryId: Library["id"];
  collectionId: string;
  title: string;
  summary: string;
  readingTime: number;
  updatedAt: string;
  stage: "Foundation" | "Reviewing" | "Working note" | "Reference";
  blocks: NoteBlock[];
  sources: Source[];
  related: string[];
};

const mitCircuits: Source = {
  title: "6.002 Circuits and Electronics",
  publisher: "MIT OpenCourseWare",
  url: "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/",
  kind: "Course",
};

const allAboutCircuits: Source = {
  title: "Voltage, Current, Resistance, and Ohm's Law",
  publisher: "All About Circuits",
  url: "https://www.allaboutcircuits.com/textbook/direct-current/chpt-2/voltage-current-resistance-relate/",
  kind: "Reference",
};

const freertosDocs: Source = {
  title: "The FreeRTOS Kernel Book",
  publisher: "FreeRTOS",
  url: "https://www.freertos.org/Documentation/02-Kernel/07-Books-and-manual/01-Mastering-the-FreeRTOS-Real-Time-Kernel",
  kind: "Documentation",
};

const analogMixedSignal: Source = {
  title: "Basic Guidelines for Layout Design of Mixed-Signal PCBs",
  publisher: "Analog Devices",
  url: "https://www.analog.com/en/resources/analog-dialogue/articles/what-are-the-basic-guidelines-for-layout-design-of-mixed-signal-pcbs.html",
  kind: "Reference",
};

const analogGrounding: Source = {
  title: "Successful PCB Grounding with Mixed-Signal Chips",
  publisher: "Analog Devices",
  url: "https://www.analog.com/en/resources/technical-articles/successful-pcb-grounding-with-mixedsignal-chips--follow-the-path-of-least-impedance.html",
  kind: "Reference",
};

const analogEmi: Source = {
  title: "Proper Layout and Component Selection Controls EMI",
  publisher: "Analog Devices",
  url: "https://www.analog.com/en/resources/technical-articles/proper-layout-and-component-selection-controls-emi.html",
  kind: "Reference",
};

const smartGateDrive: Source = {
  title: "Understanding Smart Gate Drive",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/an/slva714d/slva714d.pdf",
  kind: "Documentation",
};

const precisionOpAmps: Source = {
  title: "TI Precision Labs — Op Amps",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/video/series/precision-labs/ti-precision-labs-op-amps.html",
  kind: "Course",
};

const makeOutline = (heading: string, body: string, checklist: string[]): NoteBlock[] => [
  { type: "prose", heading, body: [body] },
  { type: "checklist", heading: "Review checklist", items: checklist },
  {
    type: "review",
    heading: "Explain it without the page",
    prompts: [
      { question: `What is the central idea behind ${heading.toLowerCase()}?`, answer: "State the mechanism first, then connect it to a concrete engineering decision." },
      { question: "What would make this fail in practice?", answer: "Look for violated assumptions, hidden state, timing, interfaces, and measurement limits." },
    ],
  },
];

const makeTechnicalGuide = ({
  heading,
  overview,
  variables,
  failure,
  checklist,
  prompts,
}: {
  heading: string;
  overview: string[];
  variables: string[][];
  failure: string;
  checklist: string[];
  prompts: { question: string; answer: string }[];
}): NoteBlock[] => [
  { type: "prose", heading, body: overview },
  {
    type: "table",
    heading: "Design variables",
    columns: ["Variable", "Why it matters", "What to verify"],
    rows: variables,
  },
  {
    type: "callout",
    heading: "Common failure mode",
    body: failure,
    tone: "warning",
  },
  { type: "checklist", heading: "Design and review checklist", items: checklist },
  { type: "review", heading: "Active recall", prompts },
];

export const libraries: Library[] = [
  {
    id: "technical",
    title: "Technical library",
    description: "Foundations and working knowledge for electronics, PCB design, embedded systems, firmware, and software architecture.",
    mark: "⌁",
    accent: "yellow",
  },
  {
    id: "personal",
    title: "Personal library",
    description: "Reading notes, project journals, durable ideas, and the questions that are worth returning to.",
    mark: "◇",
    accent: "aqua",
  },
];

export const collections: Collection[] = [
  {
    id: "electrical-fundamentals",
    libraryId: "technical",
    title: "Electrical fundamentals",
    description: "The physical models and circuit relationships everything else rests on.",
    focus: "Foundations",
    mark: "ϟ",
    accent: "yellow",
    noteSlugs: [
      "voltage-current-resistance",
      "resistors-and-passive-components",
      "capacitance-and-inductance",
      "diodes-and-rectifiers",
      "bipolar-junction-transistors",
      "mosfet-fundamentals",
      "operational-amplifiers",
      "analog-filters",
      "adc-dac-signal-conditioning",
      "power-supplies-and-regulation",
      "motor-control-fundamentals",
      "transformers-and-isolation",
      "protection-esd-and-transients",
      "power-and-energy",
    ],
  },
  {
    id: "pcb-design",
    libraryId: "technical",
    title: "PCB design",
    description: "Placement, stackup, power integrity, grounding, manufacturability, and review habits.",
    focus: "Design practice",
    mark: "▦",
    accent: "orange",
    noteSlugs: [
      "component-placement",
      "return-paths-and-stackup",
      "pcb-materials-and-impedance",
      "mixed-signal-pcb-layout",
      "pcb-noise-and-grounding",
      "decoupling-and-board-level-filtering",
      "high-voltage-pcb-design",
      "high-current-and-thermal-pcb-design",
      "emi-emc-pcb-design",
      "switching-power-layout",
      "connector-and-cable-interfaces",
      "dfm-dfa-and-testability",
      "power-delivery-networks",
    ],
  },
  {
    id: "embedded-firmware",
    libraryId: "technical",
    title: "Embedded & firmware",
    description: "Deterministic software close to hardware: scheduling, concurrency, C, memory, and peripherals.",
    focus: "Interview review",
    mark: "{·}",
    accent: "aqua",
    noteSlugs: ["rtos-task-scheduling", "semaphores-mutexes-queues", "c-at-the-hardware-boundary"],
  },
  {
    id: "software-architecture",
    libraryId: "technical",
    title: "Software architecture",
    description: "Boundaries, state, interfaces, reliability, and the trade-offs behind maintainable systems.",
    focus: "Systems thinking",
    mark: "⌘",
    accent: "blue",
    noteSlugs: ["embedded-software-architecture", "state-machines", "observability-for-devices"],
  },
  {
    id: "books-reading",
    libraryId: "personal",
    title: "Books & reading",
    description: "Ideas worth keeping from books, essays, and long-form reading.",
    focus: "Reading notes",
    mark: "▤",
    accent: "purple",
    noteSlugs: ["smart-notes", "design-of-everyday-things"],
  },
  {
    id: "personal-projects",
    libraryId: "personal",
    title: "Personal projects",
    description: "Project intent, decisions, discoveries, and clear next actions.",
    focus: "Build journal",
    mark: "△",
    accent: "green",
    noteSlugs: ["commonplace-project", "esp32-environment-monitor", "home-lab"],
  },
  {
    id: "ideas-reflections",
    libraryId: "personal",
    title: "Ideas & reflections",
    description: "Working beliefs and open questions that cut across individual subjects.",
    focus: "Thinking",
    mark: "∴",
    accent: "yellow",
    noteSlugs: ["engineering-judgment", "questions-worth-keeping"],
  },
];

export const notes: Note[] = [
  {
    slug: "voltage-current-resistance",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Voltage, current & resistance",
    summary: "A practical mental model for potential difference, charge flow, resistance, and the relationship between them.",
    readingTime: 8,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Start with the mental model",
        body: [
          "Voltage is a difference in electric potential between two points. It describes how much energy per unit charge is available to move charge; it is never meaningful at only one unreferenced point.",
          "Current is the rate at which charge passes a boundary. Resistance describes how strongly a component opposes that flow and converts electrical energy into other forms, commonly heat. These are related quantities, not independent labels.",
        ],
      },
      {
        type: "formula",
        heading: "Ohm's law",
        formula: "V = I × R",
        explanation: "For an ohmic element, any two known quantities determine the third. Keep the polarity and current direction consistent with the passive sign convention.",
        terms: [
          { symbol: "V", meaning: "Potential difference", unit: "volts (V)" },
          { symbol: "I", meaning: "Rate of charge flow", unit: "amperes (A)" },
          { symbol: "R", meaning: "Opposition to current", unit: "ohms (Ω)" },
        ],
      },
      {
        type: "circuit",
        heading: "Read the complete loop",
        intro: "A 9 V source across a 1 kΩ load produces 9 mA in the ideal lumped-element model.",
        alt: "A closed circuit with a 9 volt source, one kilo-ohm resistor, and nine milliamp current",
        voltage: "9 V",
        resistance: "1 kΩ",
        current: "9 mA",
        caption: "The source establishes a potential difference; the closed path permits current; the load sets the current for an ideal source.",
      },
      {
        type: "table",
        heading: "How each quantity behaves",
        columns: ["Quantity", "Measured", "Ideal instrument", "Useful question"],
        rows: [
          ["Voltage", "Across two points", "Infinite input resistance", "What is the reference?"],
          ["Current", "Through a branch", "Zero series resistance", "Where does the loop close?"],
          ["Resistance", "Across an unpowered element", "Known test excitation", "Is it linear here?"],
        ],
      },
      {
        type: "callout",
        heading: "A voltage measurement always has two leads",
        body: "Saying a node is “3.3 V” silently means 3.3 V relative to a chosen reference, usually circuit ground. Grounds separated by current, impedance, or isolation may not be at the same potential.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Use this during a circuit review",
        items: [
          "Mark the assumed current direction and voltage polarity before writing equations.",
          "Trace the full return path instead of stopping at a ground symbol.",
          "Check power with P = VI and confirm the component rating has margin.",
          "Ask whether the element is actually ohmic over the operating range.",
        ],
      },
      {
        type: "review",
        heading: "Interview prompts",
        prompts: [
          { question: "Why is voltage measured in parallel?", answer: "A voltmeter compares potential between two points. Its high input impedance minimizes the current it diverts from the circuit." },
          { question: "Why is current measured in series?", answer: "An ammeter must become part of the branch whose charge flow is being measured. Its low resistance minimizes the voltage it adds." },
          { question: "What happens if resistance doubles with voltage fixed?", answer: "In the ideal ohmic model, current halves and dissipated power P = V²/R also halves." },
        ],
      },
    ],
    sources: [mitCircuits, allAboutCircuits],
    related: ["power-and-energy", "capacitance-and-inductance"],
  },
  {
    slug: "resistors-and-passive-components",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Resistors & passive component reality",
    summary: "Tolerance, temperature coefficient, parasitics, noise, voltage rating, power rating, and choosing real parts instead of ideal symbols.",
    readingTime: 12,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: makeTechnicalGuide({
      heading: "The schematic value is only the starting point",
      overview: [
        "An ideal resistor has one number. A physical resistor has a nominal value, tolerance distribution, temperature coefficient, voltage coefficient, excess noise, parasitic capacitance and inductance, maximum working voltage, and a thermal path. Most designs need only a few of these parameters—but reliable design begins by knowing which few matter.",
        "Power rating is normally specified at an ambient temperature and with a derating curve. A resistor dissipating exactly its catalog rating may run hot enough to shift value, age nearby materials, or violate enclosure limits. Pulse capability is separate from steady-state power: a short surge can exceed average power limits while still damaging the resistive element through peak film temperature or voltage stress.",
        "Package size affects far more than assembly density. Larger packages generally support more voltage and power but add area and parasitics. Thin-film parts offer low noise and tight tracking; thick-film parts are inexpensive but can exhibit more excess noise and voltage coefficient. Resistor networks are valuable where ratio matching matters more than absolute accuracy.",
      ],
      variables: [
        ["Tolerance", "Sets initial value error", "Worst-case or statistical error budget"],
        ["Tempco", "Changes resistance with temperature", "ppm/°C across the real operating range"],
        ["Power / pulse", "Sets self-heating and surge survival", "Derating curve and pulse-energy graph"],
        ["Working voltage", "Can limit a high-value resistor before power does", "Maximum element and package voltage"],
      ],
      failure: "Selecting only by resistance and wattage misses the frequent case where voltage rating, pulse energy, or temperature rise is the actual limit. Series parts can share voltage, but only if tolerance, leakage, contamination, and transient distribution are considered.",
      checklist: [
        "Calculate nominal, minimum, and maximum dissipation for every operating mode.",
        "Check working voltage independently from power rating.",
        "Include tolerance and temperature drift in the system error budget.",
        "Use Kelvin connections when trace and contact resistance are comparable to the shunt value.",
        "Check pulse curves for inrush, snubbers, precharge, and discharge paths.",
      ],
      prompts: [
        { question: "Why can a 100 kΩ resistor fail at low power?", answer: "Its voltage rating can be exceeded even when V²/R produces modest power. Electric-field stress across the element or package becomes the constraint." },
        { question: "When is a resistor network preferable?", answer: "When gain, division, or common-mode performance depends on matched ratios and matched temperature drift more than absolute resistance." },
        { question: "What does Kelvin sensing remove?", answer: "It separates the measurement path from the load-current path so copper and contact voltage drops do not become part of the sensed shunt voltage." },
      ],
    }),
    sources: [mitCircuits],
    related: [],
  },
  {
    slug: "diodes-and-rectifiers",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Diodes, rectifiers & clamps",
    summary: "Forward conduction, reverse recovery, leakage, breakdown, rectification, freewheeling, and transient clamping.",
    readingTime: 13,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: makeTechnicalGuide({
      heading: "A diode is a nonlinear, charge-storing device",
      overview: [
        "A diode conducts strongly when forward biased and weakly when reverse biased until breakdown. The familiar constant forward-drop model is useful for a first pass, but forward voltage changes with current, junction temperature, construction, and process. For precision or wide-current analysis, use the datasheet curves or an exponential model.",
        "Switching behavior matters whenever current changes quickly. A PN diode can store minority-carrier charge while conducting; removing that charge creates reverse-recovery current and loss. Schottky diodes avoid minority-carrier recovery but usually trade higher leakage and lower reverse-voltage capability. Silicon-carbide diodes serve higher-voltage, high-temperature switching with different cost and forward-drop trade-offs.",
        "The circuit role determines the important rating. Rectifiers need average current, repetitive peak current, reverse voltage, loss, and thermal checks. Flyback paths need peak current and commutation behavior. TVS clamps need standoff voltage, breakdown range, clamping voltage at the specified pulse current, pulse shape, and a return path that does not inject the surge into sensitive ground.",
      ],
      variables: [
        ["Forward voltage", "Sets conduction loss and headroom", "At actual current and junction temperature"],
        ["Reverse recovery", "Creates switching loss and EMI", "Charge, time, test conditions, and commutation rate"],
        ["Leakage", "Can corrupt high-impedance nodes", "Worst case at maximum temperature"],
        ["Breakdown / clamp", "Sets protection behavior", "Standoff, avalanche, and clamping voltages"],
      ],
      failure: "A TVS selected by a headline voltage can still let the protected node exceed its absolute maximum. Include dynamic resistance, pulse current, lead and trace inductance, tolerances, and where the surge current returns.",
      checklist: [
        "Choose the diode technology for voltage, speed, leakage, and loss—not by habit.",
        "Check peak, average, repetitive, and surge-current ratings separately.",
        "Calculate junction temperature using conduction and switching loss.",
        "Keep protection loops short and route surge current away from logic references.",
        "Verify behavior during power-off, hot-plug, reverse polarity, and partial powering.",
      ],
      prompts: [
        { question: "Why does a flyback diode slow a relay release?", answer: "It clamps the coil to a small voltage, so inductive current decays slowly. A higher-voltage clamp dissipates stored energy faster." },
        { question: "Why can Schottky leakage matter?", answer: "Leakage grows strongly with temperature and can create significant error on high-impedance sensing or hold-up nodes." },
        { question: "What creates reverse-recovery EMI?", answer: "Rapid removal of stored charge produces a current spike; parasitic inductance converts its high di/dt into voltage ringing and radiated fields." },
      ],
    }),
    sources: [mitCircuits],
    related: [],
  },
  {
    slug: "bipolar-junction-transistors",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Bipolar junction transistors",
    summary: "BJT operating regions, bias, current gain limits, switching saturation, small-signal use, and thermal behavior.",
    readingTime: 12,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: makeTechnicalGuide({
      heading: "A BJT controls collector current through a forward-biased junction",
      overview: [
        "In forward-active operation, the base-emitter junction is forward biased and the collector-base junction is reverse biased. Collector current is exponentially related to base-emitter voltage; beta is a convenient but variable ratio, not a dependable device constant. Bias networks should make the desired operating point weakly dependent on beta.",
        "For analog stages, transconductance, collector resistance, emitter degeneration, load, and available voltage swing determine gain and linearity. Emitter degeneration introduces local feedback: it reduces gain but improves bias stability, input range, and predictability. A bypass capacitor can recover AC gain above a chosen frequency while preserving DC stabilization.",
        "For switching, provide enough base current to reach low VCE while recognizing that deep saturation stores charge and slows turn-off. A forced beta much lower than the catalog typical beta is common. Base-emitter discharge, clamp techniques, switching frequency, and driver current decide whether a BJT remains appropriate compared with a MOSFET.",
      ],
      variables: [
        ["VBE / bias current", "Sets operating current exponentially", "Temperature and device spread"],
        ["Beta", "Affects required base drive", "Minimum at the relevant current, not typical"],
        ["VCE(sat)", "Sets on-state loss", "Forced beta and collector current"],
        ["SOA", "Limits combined voltage, current, time", "Secondary breakdown and pulse duration"],
      ],
      failure: "Designing a switch around typical beta can leave the transistor partly on at cold temperature or high collector current. The resulting VCE and dissipation can increase rapidly, pushing the device outside its safe operating area.",
      checklist: [
        "Use a bias or drive design that works at minimum beta.",
        "Check base current against the source pin and base resistor limits.",
        "Verify safe operating area, not only absolute voltage and current maxima.",
        "Include thermal feedback and temperature range in analog bias analysis.",
        "Provide a defined off-state and a path to remove stored base charge.",
      ],
      prompts: [
        { question: "Why is beta a poor bias target?", answer: "It varies widely across parts, current, temperature, and manufacturing. Feedback or emitter degeneration creates a more predictable operating point." },
        { question: "What is saturation?", answer: "Both junctions are forward biased; collector current is no longer beta times base current, and stored charge can slow turn-off." },
        { question: "Why check SOA?", answer: "A device can be below separate voltage, current, and power limits yet fail from localized heating or secondary breakdown during their combination." },
      ],
    }),
    sources: [mitCircuits],
    related: [],
  },
  {
    slug: "mosfet-fundamentals",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "MOSFET fundamentals & gate drive",
    summary: "Regions of operation, RDS(on), gate charge, switching loss, body diode, safe operating area, and robust gate driving.",
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "The gate is capacitive, but switching it is a current problem",
      overview: [
        "An enhancement-mode power MOSFET conducts when gate-to-source voltage creates a channel. Threshold voltage only indicates a small test current; it does not mean the device is fully enhanced. Use RDS(on) specified at the actual gate voltage and estimate its rise with junction temperature. Conduction loss is approximately I²R for steady current, with RMS current used for switched waveforms.",
        "The driver must move gate charge through the Miller plateau on every transition. Average gate-drive power is roughly Qg × Vdrive × switching frequency, while peak driver current and total gate-loop impedance determine edge rate. Switching loss occurs while drain voltage and current overlap; package, common-source, and power-loop inductance add ringing and can create false turn-on.",
        "The intrinsic body diode provides a current path but may have significant forward drop and reverse recovery. Dead time in a half bridge avoids shoot-through, yet excessive dead time increases diode loss. Device selection is therefore a system trade among voltage margin, RDS(on), gate charge, capacitances, diode behavior, thermal impedance, avalanche capability, package inductance, and cost.",
      ],
      variables: [
        ["VDS rating", "Must survive bus plus overshoot", "Transient waveform and derating"],
        ["RDS(on)", "Sets conduction loss", "Specified VGS and hot junction multiplier"],
        ["Gate charge / Miller", "Sets driver demand and transition time", "Qg curves at comparable VDS and ID"],
        ["SOA / avalanche", "Limits abnormal and linear operation", "Pulse width, temperature, and repetition"],
      ],
      failure: "Using VGS(th) as the required gate voltage leaves a MOSFET only barely conducting. The resulting dissipation heats the die, raises RDS(on), and can cause thermal runaway or failure even though drain current is below its headline rating.",
      checklist: [
        "Choose voltage margin from measured or bounded overshoot, not nominal bus voltage.",
        "Calculate conduction, switching, diode, and gate-drive loss separately.",
        "Keep the gate-drive loop and commutation loop short; consider a Kelvin source package.",
        "Use a gate pulldown and verify power-up, reset, and driver-undervoltage behavior.",
        "Measure VGS and VDS with low-inductance probing before changing gate resistance.",
      ],
      prompts: [
        { question: "Why is a MOSFET voltage-driven but still needs a strong driver?", answer: "Steady gate current is tiny, but transitions require moving charge quickly through nonlinear capacitances, especially during the Miller plateau." },
        { question: "What sets switching loss?", answer: "The overlap of drain voltage and drain current during transitions, multiplied by switching frequency, plus capacitance and reverse-recovery energy." },
        { question: "What does a gate resistor trade?", answer: "Slower edges reduce ringing and EMI but increase switching loss and susceptibility to time spent in high-dissipation regions." },
      ],
    }),
    sources: [smartGateDrive, mitCircuits],
    related: [],
  },
  {
    slug: "operational-amplifiers",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Operational amplifiers in real circuits",
    summary: "Feedback, gain, bandwidth, stability, input and output limits, offset, noise, and selecting an op amp by the whole signal chain.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Feedback makes the ideal rules approximately true",
      overview: [
        "The ideal rules—negligible input current and nearly equal input voltages under negative feedback—are conclusions that require the amplifier to remain in its linear region with sufficient loop gain. They fail during saturation, slew limiting, common-mode violation, output-current limiting, unstable feedback, or operation outside the supply range.",
        "Closed-loop bandwidth is tied to noise gain, not always signal gain. An inverting stage with signal gain below one can still have noise gain above one. Source impedance interacts with input capacitance; capacitive loads add phase lag; feedback capacitance can stabilize or shape bandwidth. Gain-bandwidth product is a first-order estimate, while phase margin decides transient behavior.",
        "Precision comes from a complete error budget: input offset and drift, bias-current drops through unequal source resistance, voltage and current noise integrated over bandwidth, finite open-loop gain, common-mode rejection, power-supply rejection, resistor tolerance, output swing, and self-heating. Chopper amplifiers reduce offset but can introduce ripple and switching artifacts.",
      ],
      variables: [
        ["Input common mode", "Inputs must remain in a valid range", "Across supply and temperature"],
        ["Output swing / current", "Limits achievable signal", "At actual load, frequency, and supply"],
        ["GBW / slew rate", "Limits small- and large-signal response", "Required noise gain and peak dV/dt"],
        ["Offset / noise", "Sets DC and AC accuracy", "Integrated system error over bandwidth"],
      ],
      failure: "A part described as rail-to-rail may have rail-to-rail input, output, both, or neither under the actual load. Output swing often degrades with current, and some input stages change behavior near the crossover region.",
      checklist: [
        "Draw the expected input common-mode and output-swing ranges on the datasheet limits.",
        "Calculate noise gain and check minimum stable gain.",
        "Budget offset, bias current, resistor error, and integrated noise at the output.",
        "Check slew rate separately from small-signal bandwidth.",
        "Review capacitive load, feedback layout, supply decoupling, and saturation recovery.",
      ],
      prompts: [
        { question: "When is V+ approximately equal to V−?", answer: "When negative feedback is established and the amplifier has enough loop gain while remaining within input, output, bandwidth, and slew limits." },
        { question: "Why distinguish signal gain and noise gain?", answer: "Loop stability and bandwidth follow the gain seen by input-referred amplifier errors, which can differ from the desired source-to-output gain." },
        { question: "What causes slew limiting?", answer: "Internal stages have finite current available to charge compensation and node capacitances, limiting maximum output voltage change per unit time." },
      ],
    }),
    sources: [precisionOpAmps, mitCircuits],
    related: [],
  },
  {
    slug: "analog-filters",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Analog filters: RC to active topologies",
    summary: "Poles, zeros, cutoff, Q, damping, loading, anti-aliasing, reconstruction, and turning a frequency requirement into a circuit.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "A filter shapes magnitude, phase, noise, and time response together",
      overview: [
        "A first-order RC low-pass has one pole at 1/(2πRC), falls at 20 dB per decade above cutoff, and introduces phase lag. Real source and load impedances alter both gain and pole location. An RC network cannot be selected in isolation from the circuit that drives it and the input that receives it.",
        "Second-order stages add natural frequency and quality factor Q. Higher Q produces a sharper transition and more peaking or ringing; lower Q is more damped. Butterworth alignment maximizes flatness, Bessel prioritizes time-domain shape and group delay, and Chebyshev accepts ripple for a steeper transition. Cascaded stages require intentional Q and ordering.",
        "Anti-alias filters limit energy above Nyquist before sampling, but the required attenuation begins at the lowest unwanted frequency, not automatically at Nyquist. ADC acquisition current and switched-capacitor input behavior can disturb the network. Reconstruction filters after a DAC suppress images and switching energy while preserving the desired band.",
      ],
      variables: [
        ["Passband", "Defines wanted amplitude and phase", "Gain, ripple, and group delay"],
        ["Stopband", "Defines required rejection", "Frequency where attenuation must be met"],
        ["Order / Q", "Sets slope and transient response", "Tolerance sensitivity and ringing"],
        ["Impedance level", "Controls loading, noise, and current", "Source, load, op-amp, and ADC interaction"],
      ],
      failure: "Calling a single RC pole an anti-alias filter without comparing its attenuation at the first alias band can leave strong out-of-band energy folding directly into the measurement band.",
      checklist: [
        "Write passband, stopband, attenuation, phase, and settling requirements first.",
        "Include real source and load impedance in pole calculations.",
        "Run component-tolerance corners for cutoff and Q.",
        "Verify the op amp has sufficient GBW, slew rate, output drive, and stability.",
        "Simulate and measure both frequency response and step response.",
      ],
      prompts: [
        { question: "What does Q change in a second-order low-pass?", answer: "It controls damping: higher Q sharpens the knee and increases peaking and ringing; lower Q gives a more gradual, better-damped response." },
        { question: "Why does loading move an RC pole?", answer: "The effective resistance and division ratio are set by the network formed with source and load impedances, not the labeled resistor alone." },
        { question: "Why inspect step response?", answer: "Magnitude response alone can hide overshoot, ringing, long settling, and phase behavior that matters in sampled or control systems." },
      ],
    }),
    sources: [precisionOpAmps, mitCircuits],
    related: [],
  },
  {
    slug: "adc-dac-signal-conditioning",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "ADC, DAC & signal conditioning",
    summary: "Sampling, quantization, references, acquisition drive, aliasing, dynamic range, calibration, and protecting the analog boundary.",
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Conversion accuracy belongs to the complete signal chain",
      overview: [
        "An N-bit converter divides a full-scale range into nominal codes, but resolution is not accuracy. Offset, gain error, integral and differential nonlinearity, reference error, noise, distortion, clock jitter, input settling, source impedance, and PCB coupling determine usable performance. Effective number of bits is a dynamic result, not a package label.",
        "A SAR ADC briefly connects an internal sampling capacitor to the input. The external amplifier and RC network must settle that charge disturbance within the acquisition window. A low-pass network can reduce broadband noise and isolate the driver, but too much resistance prevents settling. The converter datasheet's drive circuit and timing model are the starting point.",
        "The reference is an analog power rail for the conversion transfer function. Reference noise and droop often appear directly as code error. Place its decoupling for the pulsed load, protect its quiet return, and account for reference output drive and start-up. Calibration can remove stable offset and gain errors but not aliasing, clipping, random noise, or time-varying interference.",
      ],
      variables: [
        ["Full-scale / reference", "Maps input to code", "Tolerance, drift, noise, and drive"],
        ["Acquisition time", "Sets available settling", "Source impedance and sampling capacitance"],
        ["Sample rate / bandwidth", "Sets alias regions and noise bandwidth", "Anti-alias attenuation and clock quality"],
        ["INL / DNL / ENOB", "Describe static and dynamic conversion quality", "Conditions matching the application"],
      ],
      failure: "A clean-looking DC simulation can hide acquisition kickback and incomplete settling. The result is input-dependent conversion error that looks like nonlinearity or noise and may change with sample rate.",
      checklist: [
        "Build an error budget from the sensor through the reference and converter.",
        "Verify driver settling within the actual acquisition window.",
        "Set analog bandwidth intentionally before choosing sample rate.",
        "Route reference and sensitive inputs away from clocks and switching nodes.",
        "Plan calibration points, temperature coverage, and production test limits.",
      ],
      prompts: [
        { question: "Why is 12-bit resolution not 12-bit accuracy?", answer: "Code width is only one term; reference error, noise, nonlinearity, settling, offset, gain, and layout can consume many bits of usable performance." },
        { question: "What is aliasing?", answer: "Sampling makes spectral replicas; energy above half the sample rate can fold into the baseband and become indistinguishable from a real in-band signal." },
        { question: "What can calibration not fix?", answer: "Clipping, unstable references, insufficient settling, aliasing, random noise, distortion, or errors that change unpredictably with time and operating state." },
      ],
    }),
    sources: [analogMixedSignal],
    related: [],
  },
  {
    slug: "power-supplies-and-regulation",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Power supplies & regulation",
    summary: "LDOs, buck and boost converters, efficiency, ripple, stability, transient response, sequencing, and choosing the right topology.",
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Regulation is a control problem wrapped around energy conversion",
      overview: [
        "An LDO uses a pass element to drop voltage and reject disturbances. Its loss is approximately (VIN − VOUT) × IOUT, making it quiet and simple when the ratio is modest but thermally expensive for large drops. Dropout depends on current and temperature; quiescent current matters in light-load and battery systems; stability may depend on output capacitance and ESR.",
        "A buck converter transfers energy through a switched inductor to reduce voltage; a boost raises it; buck-boost families handle ranges crossing the output. Duty cycle is a first-order relationship, while real efficiency includes MOSFET conduction and switching loss, inductor copper and core loss, diode or synchronous-rectifier loss, control power, and capacitor ripple current.",
        "The feedback loop must be stable across input, output, load, and component variation. Load transients expose the combined behavior of control bandwidth, output capacitance, ESR, current limit, and layout. Start-up, pre-bias, soft-start, sequencing, minimum load, discontinuous modes, pulse skipping, and fault retry can matter more than nominal steady state.",
      ],
      variables: [
        ["Input / output range", "Chooses feasible topology and duty cycle", "Startup, surge, dropout, and fault conditions"],
        ["Load profile", "Sets loss and transient needs", "Peak, average, sleep, and slew rate"],
        ["Ripple / noise", "Affects sensitive loads and EMI", "Frequency spectrum and measurement method"],
        ["Loop stability", "Determines transient and oscillation behavior", "Compensation and output-network corners"],
      ],
      failure: "A regulator that meets nominal voltage can still be unusable because of start-up overshoot, light-load burst noise, insufficient thermal margin, unstable output-capacitor conditions, or current-limit behavior during a real load transient.",
      checklist: [
        "Map every input, load, temperature, and sequencing state.",
        "Calculate loss by mechanism and estimate junction temperature.",
        "Check inductor saturation and capacitor bias, ripple, and ESR derating.",
        "Follow the reference layout for the hot loop and feedback network.",
        "Measure ripple with a short probe loop and test dynamic load steps.",
      ],
      prompts: [
        { question: "When is an LDO preferable to a switcher?", answer: "When the voltage drop and current keep loss acceptable and low noise, simplicity, size, or fast clean response outweigh efficiency." },
        { question: "What is the hot loop?", answer: "The loop carrying rapidly switched current. Its area and inductance strongly control ringing, switch-node noise, and EMI." },
        { question: "Why does capacitor DC bias matter?", answer: "High-k ceramic capacitance can fall substantially at operating voltage, changing ripple, transient response, and control-loop behavior." },
      ],
    }),
    sources: [analogEmi],
    related: [],
  },
  {
    slug: "motor-control-fundamentals",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Motor control fundamentals",
    summary: "DC, brushed, BLDC and stepper motors; torque, back-EMF, bridges, PWM, current control, sensing, commutation, and protection.",
    readingTime: 18,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Control current to control torque",
      overview: [
        "For many motors, torque is approximately proportional to winding current, while back-EMF rises with speed. At standstill there is little back-EMF, so winding resistance and inductance limit current; this is why stall is the highest electrical stress. Mechanical load, inertia, friction, torque constant, back-EMF constant, and thermal time constants connect the electrical and mechanical domains.",
        "A half bridge drives one terminal; an H bridge controls polarity and allows motoring, braking, and recirculation paths. PWM changes average applied voltage, but winding inductance shapes current ripple. Current regulation provides predictable torque and protection. Fast decay, slow decay, and mixed decay choose different freewheel paths and affect current tracking, acoustic noise, and loss.",
        "BLDC control commutates three phases using Hall sensors, back-EMF, an encoder, or an observer. Six-step control is simple but produces torque ripple; field-oriented control transforms measured phase currents to regulate torque and flux components. Regardless of algorithm, robust hardware needs dead time, gate-drive undervoltage protection, current sensing, bus-energy management, temperature monitoring, and a defined response to shoot-through or a disconnected motor.",
      ],
      variables: [
        ["Stall / peak current", "Sets bridge and supply stress", "Winding resistance, limit, and duration"],
        ["Bus voltage", "Sets speed range and transient energy", "Nominal, regenerated, and overshoot voltage"],
        ["PWM frequency", "Trades ripple, acoustics, and switching loss", "Motor inductance and gate-drive capability"],
        ["Current sensing", "Enables torque control and protection", "Range, bandwidth, common mode, blanking"],
      ],
      failure: "Testing only with a freely spinning motor misses stall, reversal, hard braking, cable disconnect, and regeneration. These states can produce maximum current or raise the DC bus above the supply rating.",
      checklist: [
        "Derive current and thermal limits from stall and acceleration, not free-run current.",
        "Trace every current path for each bridge state, including dead time and faults.",
        "Provide a destination for regenerated energy.",
        "Coordinate shunt range, amplifier bandwidth, ADC timing, and PWM blanking.",
        "Validate gate waveforms, phase current, bus voltage, and temperature under worst mechanics.",
      ],
      prompts: [
        { question: "Why is stall current high?", answer: "Back-EMF is proportional to speed and is near zero at stall, leaving winding resistance and the current controller to limit current." },
        { question: "Why is dead time required?", answer: "It prevents the high- and low-side devices in one bridge leg from conducting simultaneously, which would short the DC bus." },
        { question: "What is regenerative braking?", answer: "Mechanical energy is converted back to electrical energy and returned to the DC bus, which must absorb it without exceeding its voltage limit." },
      ],
    }),
    sources: [smartGateDrive],
    related: [],
  },
  {
    slug: "transformers-and-isolation",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Transformers, magnetics & isolation",
    summary: "Turns ratio, flux, magnetizing current, leakage, core loss, saturation, common-mode current, and safety isolation.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: makeTechnicalGuide({
      heading: "A transformer transfers changing field energy, not DC",
      overview: [
        "An ideal transformer scales voltage by turns ratio and current inversely while preserving power. A real transformer requires magnetizing current to establish core flux, has winding resistance, leakage inductance, interwinding capacitance, finite core permeability, and frequency-dependent loss. Volt-seconds determine flux swing; excessive volt-seconds drive the core toward saturation and a sharp current rise.",
        "Leakage inductance stores energy not coupled to the other winding and produces switching spikes that need clamps or snubbers. Interwinding capacitance carries common-mode displacement current across the isolation barrier. Winding arrangement trades leakage against capacitance, insulation, manufacturability, and safety spacing.",
        "Functional isolation only breaks an unwanted circuit relationship. Basic, supplementary, reinforced, and double insulation are safety concepts tied to standards, working voltage, transient category, pollution degree, material group, creepage, clearance, insulation thickness, and certification. A schematic isolation symbol is not evidence of a compliant barrier.",
      ],
      variables: [
        ["Volt-seconds", "Sets core flux swing", "Worst duty cycle, input, imbalance, and reset"],
        ["Core material / gap", "Sets loss, inductance, and saturation", "Frequency, temperature, and peak flux"],
        ["Leakage / capacitance", "Set spikes and common-mode current", "Winding geometry and measured parasitics"],
        ["Isolation rating", "Sets safety construction", "Applicable standard and working environment"],
      ],
      failure: "Core saturation is not a gentle reduction in inductance. Once incremental permeability collapses, current can rise very quickly and overstress the switch or winding before average-power protection reacts.",
      checklist: [
        "Check flux density from worst-case volt-seconds and reset balance.",
        "Calculate copper, core, fringing, and proximity-effect loss.",
        "Measure leakage spikes and design a rated clamp or snubber.",
        "Treat creepage, clearance, insulation system, and testing as one safety design.",
        "Review common-mode current through parasitic capacitance across the barrier.",
      ],
      prompts: [
        { question: "Why can a transformer not pass steady DC?", answer: "Induced voltage depends on changing magnetic flux. DC instead drives magnetizing current and can saturate the core." },
        { question: "What causes a switch-node spike at turn-off?", answer: "Current in leakage inductance cannot stop instantly, so it raises voltage until a clamp, capacitance, or avalanche path absorbs the energy." },
        { question: "Why does isolation capacitance matter?", answer: "Fast common-mode voltage changes drive displacement current through it, affecting EMI, touch current, and the quietness of the isolated side." },
      ],
    }),
    sources: [mitCircuits],
    related: [],
  },
  {
    slug: "protection-esd-and-transients",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Protection: ESD, surge & fault energy",
    summary: "Translate external threats into current paths using current limiting, clamps, fuses, reverse-polarity control, and coordinated energy handling.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "Protection is controlled failure and current routing",
      overview: [
        "A protection circuit must define the threat waveform, source impedance, repetition, acceptable residual voltage, and safe recovery. ESD is a fast, relatively low-energy event with extreme edge rate; surge and load dump last longer and carry much more energy; an accidental supply connection may persist indefinitely. One component rarely handles all three.",
        "A useful protection chain diverts current at the connector, limits what continues inward, clamps the protected node, and gives the diverted current a low-inductance return that avoids sensitive references. Trace inductance can create large residual voltage before a TVS responds at the component body, so placement is part of the circuit.",
        "Fuses protect conductors and contain fire risk; they do not necessarily protect fast semiconductors. Resettable PTCs have hold, trip, resistance, and temperature behavior that must be checked. Electronic fuses and hot-swap controllers add current limiting, inrush control, reverse protection, and telemetry, but their MOSFET safe operating area must cover the fault interval.",
      ],
      variables: [
        ["Threat waveform", "Defines peak, duration, and energy", "Standard level and source impedance"],
        ["Clamp voltage", "Sets residual stress", "At actual pulse current and layout inductance"],
        ["Series impedance", "Limits current into the clamp", "Normal loss and signal integrity"],
        ["Fault duration", "Sets thermal and SOA stress", "Protection response and upstream behavior"],
      ],
      failure: "Placing a TVS far from the connector or returning it through logic ground lets the surge current and high di/dt travel through the board before being clamped, coupling the event into the circuitry it was meant to protect.",
      checklist: [
        "List normal, abnormal, and standardized transient conditions for every external port.",
        "Draw the current path from the connector through the protector and back out.",
        "Check residual voltage at the protected pin, including inductive overshoot.",
        "Coordinate fuse, current limit, TVS, and downstream absolute maximum ratings.",
        "Test powered, unpowered, reverse, hot-plug, and repeated-event states.",
      ],
      prompts: [
        { question: "Why does TVS placement matter?", answer: "The current edge through trace inductance creates L·di/dt voltage. A longer shared path adds overshoot and injects transient current into the board." },
        { question: "Why will a fuse not protect every semiconductor?", answer: "Its clearing time and I²t may be far slower and larger than the semiconductor's energy tolerance." },
        { question: "What makes a protection design coordinated?", answer: "Each stage's current, clamp, time, and energy behavior keeps the next stage within its ratings across all specified faults." },
      ],
    }),
    sources: [analogEmi],
    related: [],
  },
  {
    slug: "rtos-task-scheduling",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "RTOS task scheduling",
    summary: "Priorities, readiness, blocking, preemption, and how to reason about whether work completes on time.",
    readingTime: 10,
    updatedAt: "Jul 16",
    stage: "Reviewing",
    blocks: [
      { type: "prose", heading: "A scheduler chooses from ready work", body: ["A task can be running, ready, or blocked. In a fixed-priority preemptive scheduler, the highest-priority ready task runs. A well-designed task spends most of its life blocked on a meaningful event rather than polling."] },
      { type: "code", heading: "Block on work, then finish quickly", intro: "A queue naturally couples an event source to a task without a busy loop.", language: "C / FreeRTOS", code: "for (;;) {\n    sensor_sample_t sample;\n    if (xQueueReceive(sample_queue, &sample, portMAX_DELAY) == pdPASS) {\n        process_sample(&sample);\n    }\n}" },
      { type: "callout", heading: "Priority is about urgency, not importance", body: "A high-priority task should have a short, bounded execution time. Long unbounded work at high priority increases latency everywhere below it.", tone: "warning" },
      { type: "checklist", heading: "Scheduling review", items: ["List every task's trigger, deadline, and worst-case execution time.", "Prefer event-driven blocking to periodic polling.", "Bound critical sections and high-priority work.", "Measure stack high-water marks and missed deadlines."] },
      { type: "review", heading: "Interview prompts", prompts: [{ question: "What makes a task ready?", answer: "It is not blocked on time or an event, and it has not been suspended." }, { question: "Why can adding a delay hide a bug?", answer: "It changes timing without expressing the dependency. A synchronization primitive makes the actual ordering requirement explicit." }] },
    ],
    sources: [freertosDocs],
    related: ["semaphores-mutexes-queues", "state-machines"],
  },
  {
    slug: "return-paths-and-stackup",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Return paths & PCB stackup",
    summary: "Why every signal is a loop, how reference planes control impedance, and what layer changes cost.",
    readingTime: 9,
    updatedAt: "Jul 15",
    stage: "Foundation",
    blocks: makeOutline("Think in current loops", "At low frequency, return current spreads through paths of least resistance. As edge rates rise, electromagnetic field energy concentrates the return near the signal path, favoring the path of least impedance on the adjacent reference plane.", ["Give fast signals a continuous adjacent reference plane.", "Place a nearby return via when a signal changes reference planes.", "Avoid plane splits beneath high-speed routes.", "Choose the stackup before detailed routing."]),
    sources: [{ title: "High-Speed Digital Design", publisher: "Howard Johnson & Martin Graham", url: "https://www.pearson.com/en-us/subject-catalog/p/high-speed-digital-design/P200000003500", kind: "Book" }],
    related: ["power-delivery-networks", "component-placement"],
  },
  {
    slug: "engineering-judgment",
    libraryId: "personal",
    collectionId: "ideas-reflections",
    title: "Engineering judgment",
    summary: "A working note on choosing what to model, what to measure, and where precision is actually valuable.",
    readingTime: 6,
    updatedAt: "Jul 14",
    stage: "Working note",
    blocks: makeOutline("Judgment is calibrated simplification", "Good engineering judgment is not intuition replacing analysis. It is the learned ability to select the smallest model that preserves the behavior relevant to the decision, then recognize the conditions that invalidate it.", ["Name the decision before choosing the model.", "Write down the model's assumptions.", "Measure the parameter with the most decision leverage.", "Leave evidence for the next person—including future you."]),
    sources: [],
    related: ["questions-worth-keeping", "embedded-software-architecture"],
  },
  {
    slug: "capacitance-and-inductance", libraryId: "technical", collectionId: "electrical-fundamentals", title: "Capacitance & inductance", summary: "Energy storage, transient behavior, impedance, and the intuition behind first-order circuits.", readingTime: 8, updatedAt: "Jul 12", stage: "Foundation", blocks: makeOutline("Storage changes over time", "Capacitors store energy in electric fields and resist instantaneous changes in voltage. Inductors store energy in magnetic fields and resist instantaneous changes in current.", ["Know the continuity variable for C and L.", "Relate time constant to settling.", "Separate initial and steady-state behavior.", "Check non-ideal ESR, ESL, and saturation."]), sources: [mitCircuits], related: ["voltage-current-resistance", "power-and-energy"],
  },
  {
    slug: "power-and-energy", libraryId: "technical", collectionId: "electrical-fundamentals", title: "Power, energy & thermal margin", summary: "Translate voltage and current into dissipation, energy use, heat, and component stress.", readingTime: 7, updatedAt: "Jul 11", stage: "Reference", blocks: makeOutline("Power is a rate", "Electrical power is the rate of energy transfer. Sign tells you whether an element absorbs or delivers power under the chosen polarity and current convention.", ["Calculate typical and worst-case power.", "Separate instantaneous power from energy over time.", "Follow the thermal path to ambient.", "Derate components instead of designing at the limit."]), sources: [mitCircuits], related: ["voltage-current-resistance", "power-delivery-networks"],
  },
  {
    slug: "power-delivery-networks", libraryId: "technical", collectionId: "pcb-design", title: "Power delivery networks", summary: "Source, planes, vias, decoupling, load transients, and keeping rail impedance controlled.", readingTime: 9, updatedAt: "Jul 10", stage: "Foundation", blocks: makeOutline("Design the path from source to die", "A power delivery network must keep supply deviation within tolerance across the frequency content of the load transient. Bulk capacitance, local decoupling, planes, package inductance, and control-loop response act over different ranges.", ["Set a target impedance from allowed ripple and load step.", "Keep high-frequency loops physically small.", "Check capacitor bias derating and mounting inductance.", "Measure at the load with a short ground spring."]), sources: [], related: ["return-paths-and-stackup", "power-and-energy"],
  },
  {
    slug: "component-placement", libraryId: "technical", collectionId: "pcb-design", title: "Component placement", summary: "Place around current flow, mechanical constraints, signal topology, and assembly—not just visual neatness.", readingTime: 6, updatedAt: "Jul 09", stage: "Reference", blocks: makeOutline("Placement is the first routing decision", "Good placement makes important current loops short, signal topology obvious, thermal paths viable, and assembly practical. Routing cannot fully repair poor placement.", ["Lock mechanical and connector constraints first.", "Cluster by functional current path.", "Place decoupling at the pins it serves.", "Leave room for probes, rework, and fabrication tolerances."]), sources: [], related: ["return-paths-and-stackup", "power-delivery-networks"],
  },
  {
    slug: "pcb-materials-and-impedance",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "PCB materials, stackup & controlled impedance",
    summary: "Choose laminate, copper, dielectric geometry, finish, and fabrication constraints as an electrical and manufacturing system.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "The stackup is an electrical component",
      overview: [
        "A PCB transmission line is defined by copper geometry and the surrounding dielectric and reference planes. Trace width alone does not set impedance. Dielectric thickness, local dielectric constant, copper thickness, solder mask, surface roughness, etch shape, reference-plane distance, and whether the route is microstrip or stripline all contribute.",
        "FR-4 describes a broad material family rather than one fixed dielectric. Tg indicates glass-transition behavior; decomposition temperature and z-axis expansion affect assembly reliability; dissipation factor controls dielectric loss; moisture absorption and CAF resistance matter in harsh or high-voltage environments. High-speed or RF designs may need a tightly controlled laminate, while many digital designs succeed on a fabricator's qualified low-cost stackup.",
        "Impedance should be designed with the board fabricator before routing. Specify target and tolerance, identify layer pairs and reference planes, and let the fabricator adjust geometry to its actual materials and process. Coupons and time-domain reflectometry verify the manufactured result. Over-constraining dimensions without discussing process can increase cost while reducing yield.",
      ],
      variables: [
        ["Dk / Df", "Set propagation and dielectric loss", "Frequency-dependent process values"],
        ["Dielectric height", "Strongly sets impedance and field confinement", "Finished thickness tolerance"],
        ["Copper / roughness", "Set conductor loss and final geometry", "Base plus plating and foil profile"],
        ["Tg / z-expansion", "Affect assembly and via reliability", "Reflow count and operating environment"],
      ],
      failure: "Copying a trace width from an online calculator before the fabricator defines the finished stackup can miss impedance because the real dielectric, plating, etch, and press thickness differ from the assumptions.",
      checklist: [
        "Get a fabricator-approved stackup before impedance routing.",
        "Assign every controlled trace an adjacent continuous reference plane.",
        "Specify impedance target, tolerance, coupon, and test method on the fabrication drawing.",
        "Review laminate loss, thermal class, moisture, CAF, and availability against requirements.",
        "Recalculate after any layer, material, copper, or dielectric change.",
      ],
      prompts: [
        { question: "Why is FR-4 not one dielectric constant?", answer: "It covers many resin and glass systems whose effective Dk changes with construction, resin content, frequency, and test method." },
        { question: "Why place fast routes close to a reference plane?", answer: "It confines fields, lowers loop inductance, makes return paths predictable, and allows practical controlled impedance." },
        { question: "What does an impedance coupon verify?", answer: "It samples the same process and stackup so the fabricator can measure whether finished geometry and materials met the controlled-impedance requirement." },
      ],
    }),
    sources: [analogMixedSignal],
    related: [],
  },
  {
    slug: "mixed-signal-pcb-layout",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Mixed-signal PCB layout",
    summary: "Partition by current flow, preserve reference planes, protect converters and references, and keep digital energy out of analog measurements.",
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Partition components and routes, not physics",
      overview: [
        "Mixed-signal layout begins with a functional floor plan. Place the connector, protection, analog front end, converter, reference, clock, processor, power conversion, and output stages so the signal path is short and noisy current loops do not share impedance with sensitive returns. Physical separation is useful only when the corresponding current paths remain controlled.",
        "A continuous low-impedance ground plane is usually safer than an arbitrary split. Fast return current follows the signal's electromagnetic field near its route; a trace crossing a plane gap forces a detour, enlarges loop area, and increases coupling. If a device or safety architecture truly requires separate domains, connect them at an intentional point and keep every crossing path—including shields, supplies, and programming cables—consistent with that boundary.",
        "Treat ADC and DAC references, inputs, and local supplies as analog nodes. Keep clocks and fast buses away, route differential signals together, decouple at pins, and locate the converter at the boundary between analog and digital placement regions. The converter's digital traces should leave toward the processor without passing through the analog region.",
      ],
      variables: [
        ["Current return", "Determines shared-impedance noise", "Complete loop for each signal and supply"],
        ["Partition", "Controls field and route proximity", "Placement by function and energy level"],
        ["Converter reference", "Directly affects transfer accuracy", "Quiet supply, return, and decoupling"],
        ["Clock edges", "Create broadband coupling", "Edge rate, route, reference, and distance"],
      ],
      failure: "Splitting a ground plane by label while routing digital traces across the split removes their adjacent return path. The resulting loop can radiate, couple into analog circuitry, and create more error than the split was intended to prevent.",
      checklist: [
        "Annotate every block by signal level, bandwidth, and current slew rate.",
        "Place in signal-flow order before routing individual nets.",
        "Keep sensitive analog paths over a continuous quiet reference region.",
        "Route clocks and switching nodes away from inputs, references, and high-impedance nodes.",
        "Review cable, shield, test, and power connections for unintended domain bridges.",
      ],
      prompts: [
        { question: "Should analog and digital ground always be split?", answer: "No. The decision follows current paths and device guidance; a continuous plane with good partitioning often provides the lowest high-frequency impedance." },
        { question: "Where should a mixed-signal converter be placed?", answer: "At the boundary of analog and digital placement regions, with analog pins facing the front end and digital pins facing the processor." },
        { question: "Why is clock edge rate often more important than clock frequency?", answer: "Fast edges contain high-frequency harmonics that couple and radiate even when the repetition rate is modest." },
      ],
    }),
    sources: [analogMixedSignal, analogGrounding],
    related: [],
  },
  {
    slug: "pcb-noise-and-grounding",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Reducing PCB noise & grounding correctly",
    summary: "Shared impedance, return paths, electric and magnetic coupling, guard and shield techniques, and measurement-aware grounding.",
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Noise is coupled through a specific impedance or field",
      overview: [
        "Ground is a conductor, not an infinite sink. Current through resistance and inductance creates voltage, so two circuits sharing a return path can modulate one another. At low frequency, resistance dominates and current spreads through available copper; at high edge rates, inductance and field geometry dominate, pulling return current toward the signal path on its adjacent plane.",
        "Electric-field coupling grows with mutual capacitance and dV/dt; magnetic coupling grows with mutual inductance, loop area, and di/dt. Reduce the aggressor's edge or amplitude where possible, reduce victim impedance, increase separation, route orthogonally across layers, provide a close reference plane, and minimize both source and victim loop area.",
        "Guard rings help only when driven or referenced appropriately and when leakage over the board is the problem. Shields must have a deliberate connection strategy over the frequency range of interest. Differential measurement rejects common-mode voltage only within amplifier input range and CMRR; poor pair symmetry or unequal filtering converts common mode into differential error.",
      ],
      variables: [
        ["Shared impedance", "Converts one current into another circuit's voltage", "DC resistance and frequency-dependent inductance"],
        ["dV/dt / capacitance", "Sets electric-field current", "Switch-node area and coupling geometry"],
        ["di/dt / loop area", "Sets magnetic coupling", "Forward and return path together"],
        ["Victim impedance", "Converts coupled current to voltage", "Frequency-dependent source and input impedance"],
      ],
      failure: "Adding ground copper without tracing where current enters and leaves can create a shared return, resonant island, or accidental antenna. More copper is useful when it forms a continuous low-impedance reference and controlled connection—not automatically.",
      checklist: [
        "Identify the aggressor, coupling path, victim, and required attenuation.",
        "Inspect both outgoing and return paths for every high-current or fast-edge net.",
        "Keep high-impedance analog nodes physically small and guarded when appropriate.",
        "Use differential routing and filtering symmetrically.",
        "Measure with probe loops and ground connections small enough not to create the noise observed.",
      ],
      prompts: [
        { question: "What is ground bounce?", answer: "Rapid current through shared package, via, plane, or trace inductance creates a transient difference between nominal ground points." },
        { question: "How do you reduce magnetic coupling?", answer: "Reduce di/dt, loop area, mutual coupling, or victim loop area; a close return plane is especially effective." },
        { question: "Why can differential sensing still fail?", answer: "Finite CMRR, input-range violation, asymmetry, and impedance mismatch can convert common-mode interference into differential error." },
      ],
    }),
    sources: [analogGrounding, analogEmi],
    related: [],
  },
  {
    slug: "decoupling-and-board-level-filtering",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Decoupling & board-level filtering",
    summary: "Place capacitors by current loop, understand anti-resonance, choose ferrites deliberately, and filter interfaces without creating new problems.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "A decoupling capacitor supplies a local transient current loop",
      overview: [
        "The capacitor value printed on the schematic is only one part of its impedance. Mounting inductance, via geometry, package, plane spacing, DC-bias capacitance loss, ESR, and frequency decide whether it can supply a fast load transient. Placement should minimize the loop from capacitor to power pin through the device and back to the capacitor ground connection.",
        "A range of capacitor values does not automatically create broadband low impedance. Different resonances can interact to produce anti-resonance peaks. Closely spaced power and ground planes add useful distributed capacitance and, more importantly, low inductance. Target-impedance analysis and measurement are stronger than a universal one-capacitor-per-pin rule.",
        "Ferrite beads are lossy frequency-dependent impedances, not magic one-way noise blockers. Their impedance changes with DC bias and frequency. A bead plus capacitors can resonate, isolate a regulator from its required output capacitance, or create a noisy local rail. Define the noise spectrum and current before choosing the bead and damping.",
      ],
      variables: [
        ["Loop inductance", "Dominates high-frequency response", "Package, trace, via, and plane geometry"],
        ["Effective capacitance", "Sets stored charge and resonance", "DC bias, tolerance, and temperature"],
        ["ESR / damping", "Controls resonance peaks", "Impedance across frequency"],
        ["Ferrite bias", "Changes isolation under load", "Impedance at actual DC current"],
      ],
      failure: "Placing a decoupling capacitor near a pin but connecting it through long traces or distant vias can leave a large inductive loop. Physical distance alone is not the metric; current-loop geometry is.",
      checklist: [
        "Trace the local transient-current loop for each critical supply pin.",
        "Use capacitor effective value at voltage and temperature.",
        "Check the combined impedance for resonance and anti-resonance peaks.",
        "Place filtering at the boundary where noise should be contained.",
        "Measure rail impedance or transient response with low-inductance fixtures.",
      ],
      prompts: [
        { question: "Why does a small capacitor help at high frequency?", answer: "Its package and mounting often have lower inductance, but geometry can matter more than nominal value." },
        { question: "What is anti-resonance?", answer: "Parallel capacitive branches with different resonances can interact so their inductive and capacitive impedances create a high-impedance peak." },
        { question: "When is a ferrite bead useful?", answer: "When its lossy impedance attenuates a known high-frequency noise band at the actual bias without destabilizing the source or creating a harmful resonance." },
      ],
    }),
    sources: [analogMixedSignal, analogGrounding],
    related: [],
  },
  {
    slug: "high-voltage-pcb-design",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "High voltage PCB design",
    summary: "Creepage, clearance, insulation coordination, slots, contamination, partial discharge, controlled discharge, and safe review practices.",
    readingTime: 18,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "High voltage is an insulation system, not a spacing guess",
      overview: [
        "Clearance is the shortest distance through air; creepage is the shortest distance along an insulating surface. Required values depend on the applicable safety standard, working voltage, transient overvoltage, pollution degree, material group or CTI, altitude, field conditions, and whether insulation is functional, basic, supplementary, or reinforced. A generic online table is not a compliance decision.",
        "Copper pours, pads, vias, mounting hardware, heat sinks, test points, component bodies, solder mask openings, board edges, and fabrication tolerances all participate in the barrier. Solder mask is not normally credited as primary insulation without specific qualification. Slots can increase creepage, but their width and manufacturing process must meet the chosen standard.",
        "High-impedance dividers need voltage grading, resistor working-voltage checks, leakage control, and enough spacing to remain accurate under humidity and contamination. Bulk capacitors require discharge paths and a verified safe time to touch. Isolation transformers, optocouplers, digital isolators, and isolated converters must all meet the same system working-voltage and transient requirements.",
      ],
      variables: [
        ["Working voltage", "Sets continuous insulation stress", "RMS, DC, repetitive peak, and domain definition"],
        ["Transient category", "Sets impulse withstand", "Installation and upstream protection"],
        ["Pollution / material", "Sets surface creepage", "Environment, coating, and CTI group"],
        ["Altitude", "Reduces air breakdown margin", "Required clearance correction"],
      ],
      failure: "Measuring only copper-to-copper distance in the CAD tool can miss a shorter path through a component courtyard, mounting screw, board edge, internal plane, connector, or unreviewed test fixture.",
      checklist: [
        "Name the governing product and insulation-coordination standards before layout.",
        "Create explicit net classes and keep-out regions for each voltage domain.",
        "Review creepage and clearance in 3D with tolerances and component bodies.",
        "Check every component's working voltage, isolation rating, and certification conditions.",
        "Provide discharge, indication, probing, and test procedures for stored energy.",
      ],
      prompts: [
        { question: "What is the difference between creepage and clearance?", answer: "Clearance is through air; creepage follows the insulating surface. They address different breakdown and tracking mechanisms." },
        { question: "Why does altitude affect clearance?", answer: "Lower air density reduces dielectric strength, requiring more distance for the same impulse withstand." },
        { question: "Can solder mask solve a creepage problem?", answer: "Usually not by default. Credit depends on the governing standard and qualified coating or insulation system." },
      ],
    }),
    sources: [analogEmi],
    related: [],
  },
  {
    slug: "high-current-and-thermal-pcb-design",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "High-current & thermal PCB design",
    summary: "Copper loss, current density, vias, connectors, shunts, hot spots, thermal spreading, and verifying temperature rather than trusting a width table.",
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Design the entire current path and thermal path",
      overview: [
        "Trace heating depends on copper cross-section, length, current waveform, nearby copper, layer position, airflow, board material, and allowable temperature rise. Width calculators are estimates based on assumptions; they do not capture neck-downs, via transitions, connector pins, solder joints, plane voids, or heat from adjacent components.",
        "Parallel vias share current imperfectly because spreading resistance and geometry differ. Place via arrays so current enters them uniformly, use adequate finished hole and plating, and include fabrication limits. For very high current, heavy copper, copper inlays, busbars, press-fit contacts, or bonded conductors may be more predictable than forcing current through standard PCB features.",
        "Thermal design follows junction-to-case, interface, copper spreading, board conduction, convection, and radiation. Thermal vias help only when they connect a hot pad to useful copper and a viable sink. A large plane can spread heat but also warm sensitive references, electrolytics, connectors, or plastics. Map both peak and steady operating modes.",
      ],
      variables: [
        ["RMS / peak current", "Set heating and transient stress", "Waveform, duty, fault, and sharing"],
        ["Copper geometry", "Sets resistance and spreading", "Finished copper, neck-downs, and length"],
        ["Interconnect", "Often dominates path resistance", "Via, connector, joint, and cable ratings"],
        ["Thermal boundary", "Sets achievable temperature", "Ambient, enclosure, airflow, mounting"],
      ],
      failure: "A wide plane that narrows at a pad, fuse, via field, connector, or current-sense element concentrates both current and heat. The hottest feature is often the transition, not the long visible trace.",
      checklist: [
        "Annotate the full current path from source terminal to return terminal.",
        "Calculate loss in traces, planes, vias, shunts, fuses, connectors, and joints.",
        "Avoid abrupt neck-downs and distribute current uniformly into via arrays.",
        "Protect precision sensing from thermoelectric gradients and high-current copper drops.",
        "Validate with thermocouples or calibrated thermal imaging at worst ambient and enclosure state.",
      ],
      prompts: [
        { question: "Why is RMS current used for copper heating?", answer: "Resistive energy follows the time average of I²R, so waveform peaks contribute according to their squared magnitude and duration." },
        { question: "Why do parallel vias not always share equally?", answer: "Unequal approach geometry and spreading resistance create different path impedances, so the nearest vias can carry more current." },
        { question: "What should thermal validation measure?", answer: "The actual hot spots and component temperatures at worst load, ambient, airflow, enclosure, and transient duration—not only board-surface appearance." },
      ],
    }),
    sources: [analogEmi],
    related: [],
  },
  {
    slug: "emi-emc-pcb-design",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "EMI/EMC PCB design",
    summary: "Control source spectra, current-loop area, common-mode conversion, cables, apertures, filtering, shielding, and pre-compliance evidence.",
    readingTime: 18,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "EMC is designed at the source and current path",
      overview: [
        "Emissions require a source, coupling path, and antenna. Fast voltage edges drive capacitive common-mode current; fast current edges create magnetic fields and voltage across inductance. Large loops, cables, heatsinks, and enclosure apertures become efficient radiators. Lowering unnecessary edge rate and containing the high-frequency current loop are usually more effective than late shielding.",
        "Differential current flows out and back in the intended pair or loop. Common-mode current flows together relative to the environment and can turn a cable into an antenna with only microamps or milliamps. Imbalance in drivers, filtering, reference transitions, connectors, or chassis coupling converts differential energy to common mode.",
        "Interface filtering belongs at the connector boundary with a short path to the chosen chassis or return reference. A filter placed deep inside the board allows noise to couple around it. Stitching vias control plane-edge fields and provide return paths near layer transitions and connectors. Pre-compliance current probes, near-field probes, LISNs, and chamber scans help separate conducted, radiated, differential, and common-mode mechanisms.",
      ],
      variables: [
        ["Edge spectrum", "Defines harmonic energy", "Rise/fall time, ringing, and repetition"],
        ["Loop / antenna geometry", "Sets radiation efficiency", "Forward and return path plus attached cables"],
        ["Common-mode conversion", "Often dominates cable radiation", "Balance and parasitic coupling"],
        ["Boundary filter", "Keeps noise inside or outside", "Placement, return, current, and parasitics"],
      ],
      failure: "A common-mode choke or capacitor selected from a catalog curve can be defeated by placement, saturation, parasitic capacitance, or a long return path. The layout and connected cable are part of its high-frequency circuit.",
      checklist: [
        "List every fast edge and high di/dt loop, including switch nodes and clocks.",
        "Route signals beside continuous references and add return vias at transitions.",
        "Keep switch-node copper and bridge commutation loops as small as practical.",
        "Filter external interfaces at the connector with an intentional high-frequency return.",
        "Reserve options for edge control, snubbers, damping, and filter tuning before compliance test.",
      ],
      prompts: [
        { question: "Why can a low-frequency clock fail radiated emissions?", answer: "Its fast edges contain high-frequency harmonics, and the board or cable geometry can radiate those harmonics efficiently." },
        { question: "What is common-mode current?", answer: "Current flowing in the same direction on conductors relative to an external reference, often returning through parasitic capacitance or chassis." },
        { question: "What is the first EMI layout target in a switcher?", answer: "Minimize the area and inductance of the loop carrying the fastest commutating current, then control the high-dV/dt switch-node area." },
      ],
    }),
    sources: [analogEmi, analogGrounding],
    related: [],
  },
  {
    slug: "switching-power-layout",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Switching power PCB layout",
    summary: "Hot loops, switch-node capacitance, gate drive, current sensing, feedback, snubbers, thermal paths, and layout-first power design.",
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Place by commutation loop before routing by net name",
      overview: [
        "In a buck converter, the input capacitor, high-side switch, low-side switch or diode, and their interconnect form the high-frequency commutation loop. This loop should be physically compact with the input ceramic capacitor directly across the switching devices. Long copper within the loop adds inductance, overshoot, ringing, and EMI.",
        "The switch node has high dV/dt and should be no larger than needed for current and thermal requirements. Copper under or beside it capacitively injects current into planes, heatsinks, feedback, and chassis. Gate-drive traces form their own loop and should be short, separated from the switch node, and preferably referenced with a Kelvin source or quiet driver return.",
        "Current sensing and feedback must observe quiet versions of noisy quantities. Kelvin-connect shunts, keep sense pairs differential and symmetric, and route them away from power paths. Take the output-voltage feedback after the output capacitor at the desired regulation point, protect the divider from switch-node fields, and join its return to the controller's quiet reference as recommended by the datasheet.",
      ],
      variables: [
        ["Hot-loop inductance", "Creates overshoot and ringing", "Physical loop area and capacitor ESL"],
        ["Switch-node area", "Drives capacitive common-mode current", "Copper on all layers and nearby structures"],
        ["Gate loop", "Sets switching behavior and immunity", "Driver return, common source, and resistor location"],
        ["Sense routing", "Sets control and protection accuracy", "Kelvin points and quiet reference"],
      ],
      failure: "A schematic can be correct while the converter fails because its input capacitor is electrically close by net connectivity but physically outside the commutation loop. The intervening copper becomes a high-frequency inductance.",
      checklist: [
        "Identify the exact current path in each switching state and the commutation interval.",
        "Place the high-frequency input capacitor and switches as one compact cell.",
        "Minimize switch-node area without creating an unacceptable thermal bottleneck.",
        "Route gate drive and sense returns independently from power current where possible.",
        "Copy the controller reference layout, then justify every deviation with current paths.",
      ],
      prompts: [
        { question: "What is the hot loop?", answer: "The smallest loop whose current changes at the switching edge; its parasitic inductance is a primary source of ringing and EMI." },
        { question: "Why minimize switch-node copper?", answer: "Its high dV/dt drives displacement current through parasitic capacitance into other nets, planes, heatsinks, and chassis." },
        { question: "Why Kelvin-connect a shunt?", answer: "Separate sense traces exclude voltage drop in the high-current copper and joints from the measured shunt voltage." },
      ],
    }),
    sources: [analogEmi],
    related: [],
  },
  {
    slug: "connector-and-cable-interfaces",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Connector & cable interfaces",
    summary: "Pinout for return paths, hot-plug order, shields, chassis, protection, impedance transitions, and keeping external energy at the board edge.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "A connector is an electromagnetic and fault boundary",
      overview: [
        "Connector pinout determines loop area and crosstalk. Give every fast single-ended signal a nearby return; preserve differential pair geometry and reference through the launch; separate noisy power from sensitive analog; distribute high current across pins according to the connector's tested rating and temperature-rise conditions.",
        "External ports bring ESD, surge, cable common-mode current, ground offset, hot-plug inrush, and miswiring onto the board. Put protection and filtering at the entry point so current is diverted before it traverses internal references. Connector shield termination should have a short low-inductance path to chassis or the intended high-frequency reference, not a long trace through logic ground.",
        "Hot-plug behavior depends on contact sequence, input capacitance, cable inductance, supply impedance, and controller state. Ground or shield may need first-mate/last-break behavior. Signals connected before local power can back-power devices through protection diodes. Define unpowered pin tolerance and current limiting for every interface state.",
      ],
      variables: [
        ["Pinout / returns", "Sets loop area and crosstalk", "Signal-return adjacency and pair symmetry"],
        ["Current per contact", "Sets heat and reliability", "Temperature rise, mating cycles, and derating"],
        ["Shield bond", "Controls common-mode current", "360° or short high-frequency path"],
        ["Hot-plug sequence", "Sets inrush and back-power behavior", "Contact order and device power states"],
      ],
      failure: "A protection component placed centimeters from the connector allows ESD current to flow along internal traces first. The resulting fields and shared impedance can reset or damage circuitry even if the clamp itself survives.",
      checklist: [
        "Review connector pinout as paired forward and return paths.",
        "Place ESD, surge, and common-mode filtering at the physical boundary.",
        "Check contact current using the real pin population and enclosure temperature.",
        "Define shield, chassis, signal-ground, and earth relationships by frequency and safety role.",
        "Test mating, unmating, partial insertion, unpowered, reversed, and cable-fault states.",
      ],
      prompts: [
        { question: "Why interleave ground pins with fast signals?", answer: "Nearby returns reduce loop inductance, crosstalk, impedance discontinuity, and fields at the connector transition." },
        { question: "Why bond a shield at the connector?", answer: "It gives high-frequency shield current a short path at the boundary instead of carrying it across the PCB through sensitive ground." },
        { question: "What causes hot-plug overshoot?", answer: "Cable and trace inductance resonate with input capacitance while contact bounce and rapid inrush excite the network." },
      ],
    }),
    sources: [analogEmi],
    related: [],
  },
  {
    slug: "dfm-dfa-and-testability",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "DFM, DFA & testability",
    summary: "Fabrication rules, assembly yield, panel constraints, fiducials, paste, programming, probing, boundary access, and designing evidence into the board.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "A board is not complete until it can be built and diagnosed",
      overview: [
        "Design for manufacture begins with the chosen fabricator's capabilities: finished trace and space, annular ring, drill aspect ratio, copper-to-edge, solder-mask dam, controlled depth, impedance process, surface finish, stackup symmetry, material availability, panelization, and electrical test. Generic CAD defaults are not a manufacturing agreement.",
        "Design for assembly considers component orientation, courtyard, feeder and nozzle access, package thermal mass, shadowing, paste aperture, via-in-pad treatment, bottom-side mass, selective solder, board support, fiducials, tooling holes, panel rails, depanel stress, moisture sensitivity, and rework access. Consistency improves inspection and reduces human error.",
        "Testability is an architecture decision. Provide accessible ground, rails, reset, boot, programming, communications, critical analog nodes, and isolation-domain references. Test pads need probe spacing, keep-outs, robust finishes, and clear naming. Firmware should expose a bounded manufacturing mode that can identify hardware, exercise outputs safely, and report measurements without bypassing essential protection.",
      ],
      variables: [
        ["Fabrication capability", "Sets yield and cost", "Approved rules and process notes"],
        ["Assembly process", "Sets footprint and panel needs", "Stencil, reflow sides, inspection, rework"],
        ["Test coverage", "Sets detectable failure modes", "Access, fixtures, firmware, and limits"],
        ["Traceability", "Supports diagnosis and revision control", "Serial, lot, firmware, and calibration data"],
      ],
      failure: "Adding tiny test pads after routing often produces inaccessible or electrically ambiguous points. Probe access, references, safe stimulus, and firmware control must be planned while the architecture is still flexible.",
      checklist: [
        "Load fabricator and assembler rules before layout, not at release.",
        "Run fabrication and assembly reviews with the actual vendors.",
        "Provide fiducials, tooling, panel, polarity, and revision markings deliberately.",
        "Map important failure modes to a test stimulus and observable result.",
        "Archive fabrication, assembly, BOM, programming, and test outputs as one release.",
      ],
      prompts: [
        { question: "What is the difference between DFM and DFA?", answer: "DFM targets reliable bare-board fabrication; DFA targets reliable component placement, soldering, inspection, panel handling, and rework." },
        { question: "Why are ground test points important?", answer: "Every measurement needs a reference, and a nearby ground reduces probe-loop error and fixture complexity." },
        { question: "What makes a manufacturing test useful?", answer: "It stimulates a defined function, observes a bounded result, has justified limits, records identity, and detects a meaningful class of defects." },
      ],
    }),
    sources: [],
    related: [],
  },
  {
    slug: "semaphores-mutexes-queues", libraryId: "technical", collectionId: "embedded-firmware", title: "Semaphores, mutexes & queues", summary: "Choose synchronization by the meaning of the event, ownership, and data transfer—not by habit.", readingTime: 10, updatedAt: "Jul 08", stage: "Reviewing", blocks: makeOutline("Make the relationship explicit", "A mutex protects owned shared state and supports priority inheritance. A semaphore represents available events or resources. A queue transfers data and provides synchronization through the handoff.", ["Use a mutex for exclusive ownership.", "Use a counting semaphore for indistinguishable available units.", "Use a queue when the receiver needs the data.", "Keep blocking rules and ISR-safe APIs explicit."]), sources: [freertosDocs], related: ["rtos-task-scheduling", "c-at-the-hardware-boundary"],
  },
  {
    slug: "c-at-the-hardware-boundary", libraryId: "technical", collectionId: "embedded-firmware", title: "C at the hardware boundary", summary: "Volatile, object lifetime, aliasing, integer width, memory-mapped I/O, and defensive interfaces.", readingTime: 11, updatedAt: "Jul 07", stage: "Reference", blocks: makeOutline("C exposes the machine—and its contracts", "Embedded C is powerful because representation, lifetime, and access are visible. That power depends on respecting the language rules in addition to the hardware manual.", ["Use volatile for externally changing accesses, not thread safety.", "Use fixed-width integers at binary interfaces.", "Avoid undefined shifts, overflows, and invalid aliasing.", "Centralize register access behind narrow interfaces."]), sources: [], related: ["semaphores-mutexes-queues", "embedded-software-architecture"],
  },
  {
    slug: "embedded-software-architecture", libraryId: "technical", collectionId: "software-architecture", title: "Embedded software architecture", summary: "Separate policy from mechanism, isolate hardware, and make time and state visible in the design.", readingTime: 9, updatedAt: "Jul 06", stage: "Working note", blocks: makeOutline("Boundaries should survive hardware change", "A useful embedded architecture localizes volatile hardware details, keeps application policy testable, and makes concurrency and timing dependencies explicit rather than ambient.", ["Separate device drivers, services, and application policy.", "Pass time and I/O through testable interfaces.", "Give mutable state a clear owner.", "Design failure and recovery paths with the happy path."]), sources: [], related: ["state-machines", "observability-for-devices"],
  },
  {
    slug: "state-machines", libraryId: "technical", collectionId: "software-architecture", title: "State machines that stay understandable", summary: "Events, guards, transitions, actions, and how to stop hidden state from leaking across a system.", readingTime: 7, updatedAt: "Jul 05", stage: "Foundation", blocks: makeOutline("Model behavior as explicit transitions", "A state machine earns its keep when the valid response depends on history. States should represent meaningful modes, while events and guards explain why transitions occur.", ["Name states by durable mode, not transient action.", "Keep event handling deterministic.", "Define invalid events and timeout behavior.", "Log transitions as structured observability."]), sources: [], related: ["embedded-software-architecture", "rtos-task-scheduling"],
  },
  {
    slug: "observability-for-devices", libraryId: "technical", collectionId: "software-architecture", title: "Observability for devices", summary: "Logs, counters, traces, crash evidence, and designing firmware so failures can be understood later.", readingTime: 8, updatedAt: "Jul 04", stage: "Working note", blocks: makeOutline("Leave evidence at the right abstraction", "Device observability must survive constrained bandwidth, storage, and power. High-value signals expose state transitions, resource pressure, timing violations, and the reason for recovery.", ["Prefer structured event IDs to prose-only logs.", "Keep monotonic counters for rare failures.", "Preserve reset cause and crash context.", "Define how evidence is collected in production."]), sources: [], related: ["embedded-software-architecture", "state-machines"],
  },
  {
    slug: "smart-notes", libraryId: "personal", collectionId: "books-reading", title: "How to Take Smart Notes", summary: "Write ideas in your own words, connect them deliberately, and let structure emerge from use.", readingTime: 6, updatedAt: "Jul 03", stage: "Working note", blocks: makeOutline("Notes should do thinking work", "A durable note makes one idea understandable outside its original context. The value comes from rewriting, connecting, and retrieving it—not from collecting excerpts.", ["Write the idea in your own words.", "Keep one durable claim per note.", "Link to the reason the note matters.", "Use retrieval to expose weak understanding."]), sources: [{ title: "How to Take Smart Notes", publisher: "Sönke Ahrens", url: "https://www.soenkeahrens.de/en/takesmartnotes", kind: "Book" }], related: ["commonplace-project", "questions-worth-keeping"],
  },
  {
    slug: "design-of-everyday-things", libraryId: "personal", collectionId: "books-reading", title: "The Design of Everyday Things", summary: "Affordances, signifiers, mappings, constraints, feedback, and designing for real human behavior.", readingTime: 7, updatedAt: "Jul 02", stage: "Working note", blocks: makeOutline("Design makes the next action legible", "Good interaction design aligns what people can do, what they perceive they can do, what happens, and how clearly the result is communicated.", ["Make possible actions discoverable.", "Use natural mappings when available.", "Give immediate, meaningful feedback.", "Treat errors as design information."]), sources: [{ title: "The Design of Everyday Things", publisher: "Don Norman", url: "https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/", kind: "Book" }], related: ["commonplace-project", "engineering-judgment"],
  },
  {
    slug: "commonplace-project", libraryId: "personal", collectionId: "personal-projects", title: "Commonplace learning hub", summary: "Product intent, architecture decisions, and the next improvements for this personal knowledge system.", readingTime: 5, updatedAt: "Jul 17", stage: "Working note", blocks: makeOutline("A library that invites return", "Commonplace should reduce the distance between having a thought and finding it again. The interface is quiet; the content model is explicit; every useful note can carry explanation, visuals, active recall, and sources.", ["Keep navigation stable as content grows.", "Add content through repeatable typed structures.", "Make search and review faster than browsing files.", "Keep hosting private and operationally simple."]), sources: [], related: ["smart-notes", "engineering-judgment"],
  },
  {
    slug: "esp32-environment-monitor", libraryId: "personal", collectionId: "personal-projects", title: "ESP32 environment monitor", summary: "A project notebook for sensing, low-power design, enclosure decisions, and reliable telemetry.", readingTime: 5, updatedAt: "Jun 29", stage: "Working note", blocks: makeOutline("Define the observation before the device", "The monitor is an experiment in reliable sensing: state the environmental question, sampling interval, acceptable error, and maintenance budget before selecting the sensor and radio strategy.", ["Write measurable sensing requirements.", "Budget power by operating state.", "Plan calibration and sensor drift checks.", "Make offline buffering and recovery explicit."]), sources: [], related: ["power-and-energy", "observability-for-devices"],
  },
  {
    slug: "home-lab", libraryId: "personal", collectionId: "personal-projects", title: "Home lab", summary: "Services, networking, backups, and small operational lessons from running infrastructure at home.", readingTime: 5, updatedAt: "Jun 27", stage: "Reference", blocks: makeOutline("Small systems still need operational clarity", "A home lab is most useful when services are easy to rebuild, access is deliberate, and failure does not depend on remembering one clever command months later.", ["Keep services declarative and containerized.", "Bind private services to private interfaces.", "Back up data, not replaceable containers.", "Document recovery from a fresh machine."]), sources: [], related: ["commonplace-project", "observability-for-devices"],
  },
  {
    slug: "questions-worth-keeping", libraryId: "personal", collectionId: "ideas-reflections", title: "Questions worth keeping", summary: "An evolving list of questions that generate better projects, reading, and technical judgment.", readingTime: 4, updatedAt: "Jun 25", stage: "Working note", blocks: makeOutline("A good question keeps producing", "Some questions are valuable because they repeatedly reveal assumptions: What would I need to observe to know this is working? Which constraint is real, and which one have I inherited without checking?", ["Capture questions before forcing answers.", "Attach each question to an observation or decision.", "Revisit questions after building something.", "Promote durable answers into their own notes."]), sources: [], related: ["engineering-judgment", "smart-notes"],
  },
];

export type SearchEntry = {
  slug: string;
  title: string;
  summary: string;
  collection: string;
  mark: string;
  accent: Accent;
};

export const searchEntries: SearchEntry[] = notes.map((note) => {
  const collection = collections.find((candidate) => candidate.id === note.collectionId)!;
  return {
    slug: note.slug,
    title: note.title,
    summary: note.summary,
    collection: collection.title,
    mark: collection.mark,
    accent: collection.accent,
  };
});

export const getLibrary = (id: string) => libraries.find((library) => library.id === id);
export const getNote = (slug: string) => notes.find((note) => note.slug === slug)!;
