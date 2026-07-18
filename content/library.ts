import { onboardProtocolNotes } from "./protocols-onboard";
import { networkProtocolNotes } from "./protocols-network";
import { hostProtocolNotes } from "./protocols-host";
import { embeddedCoreNotes } from "./embedded-core-notes";
import { embeddedLifecycleNotes } from "./embedded-lifecycle-notes";

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

const abycStandardsList: Source = {
  title: "Standards List",
  publisher: "American Boat & Yacht Council",
  url: "https://abycinc.org/standards-list/",
  kind: "Reference",
};

const isoSmallCraftElectrical: Source = {
  title: "ISO 13297:2020 — Small craft electrical systems",
  publisher: "International Organization for Standardization",
  url: "https://www.iso.org/standard/69551.html",
  kind: "Reference",
};

const isoElectricalPropulsion: Source = {
  title: "ISO 16315:2026 — Small craft electric propulsion systems",
  publisher: "International Organization for Standardization",
  url: "https://www.iso.org/standard/84203.html",
  kind: "Reference",
};

const isoIgnitionProtection: Source = {
  title: "ISO 8846:2025 — Ignition protection around flammable gases",
  publisher: "International Organization for Standardization",
  url: "https://www.iso.org/standard/87197.html",
  kind: "Reference",
};

const iecMarineEmc: Source = {
  title: "IEC 60533:2015 — EMC for shipboard electrical and electronic installations",
  publisher: "International Electrotechnical Commission",
  url: "https://webstore.iec.ch/en/publication/23161",
  kind: "Reference",
};

const uscgElectricalSystems: Source = {
  title: "33 CFR Part 183 Subpart I — Electrical Systems",
  publisher: "Electronic Code of Federal Regulations",
  url: "https://www.ecfr.gov/current/title-33/chapter-I/subchapter-S/part-183/subpart-I",
  kind: "Reference",
};

const nmeaMarineElectronicsInstaller: Source = {
  title: "Basic Marine Electronics Installer course and NMEA 0400 installation standard",
  publisher: "National Marine Electronics Association",
  url: "https://www.nmea.org/basic-mei-installer.html",
  kind: "Reference",
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
  formula,
  sections = [],
  code,
  variables,
  failure,
  checklist,
  prompts,
}: {
  heading: string;
  overview: string[];
  formula?: Extract<NoteBlock, { type: "formula" }>;
  sections?: { heading: string; body: string[] }[];
  code?: Extract<NoteBlock, { type: "code" }>;
  variables: string[][];
  failure: string;
  checklist: string[];
  prompts: { question: string; answer: string }[];
}): NoteBlock[] => [
  { type: "prose", heading, body: overview },
  ...(formula ? [formula] : []),
  ...sections.map((section): NoteBlock => ({ type: "prose", heading: section.heading, body: section.body })),
  ...(code ? [code] : []),
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
    description: "Foundations and working knowledge for electronics, PCB design, communication protocols, embedded systems, firmware, and software architecture.",
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
    id: "marine-electrical-systems",
    libraryId: "technical",
    title: "Marine electrical systems",
    description: "Motor-boat power, propulsion electronics, EMC, installation safety, corrosion, and wet-environment design.",
    focus: "Marine interview prep",
    mark: "≈",
    accent: "blue",
    noteSlugs: [
      "marine-motor-drives-and-pwm",
      "marine-emi-emc-and-cabling",
      "marine-electrical-safety-standards",
      "marine-power-distribution-and-batteries",
      "waterproofing-corrosion-and-ignition-protection",
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
    noteSlugs: [
      "rtos-task-scheduling",
      "interrupts-and-isr-design",
      "semaphores-mutexes-queues",
      "dma-and-data-movement",
      "c-at-the-hardware-boundary",
      "memory-maps-linkers-and-startup",
      "bootloaders-and-firmware-update",
      "low-power-firmware-design",
      "watchdogs-faults-and-recovery",
    ],
  },
  {
    id: "communication-protocols",
    libraryId: "technical",
    title: "Digital communication protocols",
    description: "How data moves between chips, boards, and boxes: electrical layers, framing, timing, topology, and the caveats of each bus.",
    focus: "Interfaces & buses",
    mark: "⇄",
    accent: "purple",
    noteSlugs: [
      "choosing-a-communication-interface",
      "uart-fundamentals",
      "spi-bus",
      "i2c-bus",
      "i2s-digital-audio",
      "can-bus",
      "rs485-differential-serial",
      "usb-fundamentals",
      "ethernet-for-embedded",
      "pcie-fundamentals",
      "debug-interfaces-jtag-swd",
    ],
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
    summary: "A practical mental model for potential difference, charge flow, and resistance — plus Kirchhoff's laws, dividers, Thévenin equivalents, and real sources.",
    readingTime: 14,
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
        type: "prose",
        heading: "Kirchhoff's laws organize every circuit",
        body: [
          "Two conservation laws underpin all circuit analysis. Kirchhoff's current law: the currents into any node sum to zero — charge does not pile up, so what flows in must flow out. Kirchhoff's voltage law: the voltage changes around any closed loop sum to zero — potential is a position-like quantity, and walking a loop returns you to the same potential. Every solver, every hand analysis, and every debugging intuition ('this current must be going somewhere') is one of these two laws in disguise.",
          "The workhorse consequences: series resistances add and share one current; parallel resistances combine as the reciprocal sum (two in parallel: product over sum) and share one voltage. The voltage divider — Vout = Vin·R2/(R1+R2) — is probably the most-used equation in electronics, and its most-missed caveat: the formula assumes nothing loads the midpoint. A load resistance appears in parallel with R2 and drops the output; keep the divider impedance roughly ten times stiffer than whatever reads it, or account for the loading explicitly.",
        ],
      },
      {
        type: "prose",
        heading: "Real sources and Thévenin thinking",
        body: [
          "An ideal voltage source holds its voltage at any current; real sources droop. Model them as an ideal source in series with an internal resistance — a battery with 50 mΩ internal resistance drops 0.5 V when delivering 10 A, which is why voltage measured at rest tells you little about voltage under load. Thévenin's theorem generalizes this: any linear two-terminal network collapses to one equivalent source and one series resistance (open-circuit voltage, plus resistance seen with sources zeroed). Norton is the same equivalence as a current source with a parallel resistance.",
          "This is the practical lens for interfaces: a sensor output, a divider midpoint, a power rail — each is a Thévenin source, and its equivalent resistance tells you instantly how much any load will disturb it. It also frames maximum power transfer (a load matching the source resistance extracts maximum power at only 50% efficiency — wanted in RF, wrong in power delivery, where source impedance should be minimized) and why measuring voltage sag under a known load is the quickest field measurement of a source's internal resistance.",
        ],
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
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: makeTechnicalGuide({
      heading: "The schematic value is only the starting point",
      formula: {
        type: "formula",
        heading: "The total error stack",
        formula: "ΔR/R ≈ tol + TCR·ΔT + aging + V_coef·V + self-heating shift",
        explanation: "A precision resistor's real deviation is the sum of independent terms: initial tolerance, temperature-coefficient drift over the operating range, load-life aging (often 0.5–1% over life for thick film), voltage coefficient on high-value parts, and the resistance shift from its own dissipation. A ±0.1% resistor can easily be a ±0.5% resistor in service — budget the stack, not the marking.",
        terms: [
          { symbol: "TCR·ΔT", meaning: "Tempco times temperature excursion", unit: "ppm/°C × °C" },
          { symbol: "V_coef", meaning: "Voltage coefficient (matters above ~100 kΩ)", unit: "ppm/V" },
          { symbol: "aging", meaning: "Load-life and moisture drift", unit: "% over life" },
        ],
      },
      sections: [
        {
          heading: "Reading the datasheet like an error budget",
          body: [
            "Standard values follow the E-series (E12 at 10%, E24, E96 at 1%), which is why 4.7 k and not 5 k — and why designing for exact ratios beats designing for exact values: within one network, resistors from the same batch track each other's temperature and aging far better than their absolute tolerance suggests. Matched networks specify ratio tolerance and ratio TCR (a few ppm/°C) that discrete parts cannot approach, which is what precision dividers, gain-set pairs, and difference-amplifier stages actually need.",
            "Two second-order effects bite precision analog. Excess noise: thick-film parts generate 1/f current noise proportional to the DC bias across them (specified as a noise index), while thin film and wirewound are near-thermal-limited — at the microvolt level the resistor technology is part of the noise budget. Thermoelectric EMF: junctions between the resistor's terminals and copper form thermocouples of a few µV/°C, so a temperature gradient across a low-level sense resistor creates a DC offset that reverses when you rotate the part — orient precision resistors along isotherms, away from heat sources.",
          ],
        },
        {
          heading: "Special-duty resistors are their own components",
          body: [
            "Current-sense shunts live or die by construction: four-terminal (Kelvin) parts separate the current path from the sense contacts; metal-element shunts hold single-digit ppm/°C where thick film drifts hundreds; and the layout must route sense traces from the sense pads only. At milliohm values, solder-joint resistance and pad copper are comparable to the element — which is the entire reason Kelvin connections exist. Power-rating at the pad is thermal: a 3 W shunt on minimal copper is a 1 W shunt.",
            "Other specialists: high-voltage dividers need parts rated for element voltage and specified voltage coefficient, or the divider becomes nonlinear exactly at the top of its range; pulse-rated (surge) resistors distribute energy through bulk element material where a standard film would vaporize a hot-spot; NTC thermistors trade wild nonlinearity for sensitivity (linearize in firmware or with a series resistor); and PTC devices are protection elements, not measurement ones. Zero-ohm links are real resistors with real current ratings — check them like any other part.",
          ],
        },
      ],
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
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: makeTechnicalGuide({
      heading: "A diode is a nonlinear, charge-storing device",
      formula: {
        type: "formula",
        heading: "Rectifier ripple from the reservoir capacitor",
        formula: "ΔV ≈ I_load / (f_ripple × C)",
        explanation: "With a capacitor-input filter, the reservoir discharges between charging peaks: load current divided by ripple frequency (2× line frequency for a full-wave bridge) and capacitance gives peak-to-peak ripple. The hidden cost is that the diodes conduct only near the waveform peaks, so their repetitive peak current is many times the DC load current — and the capacitor's ripple-current rating carries the same multiple.",
        terms: [
          { symbol: "I_load", meaning: "DC load current", unit: "A" },
          { symbol: "f_ripple", meaning: "Ripple frequency (2× line for full-wave)", unit: "Hz" },
          { symbol: "C", meaning: "Reservoir capacitance", unit: "F" },
        ],
      },
      sections: [
        {
          heading: "The exponential reality behind the 0.7 V fiction",
          body: [
            "Diode current rises exponentially with forward voltage — roughly a decade of current per 60 mV at room temperature — so 'the' forward voltage is just where the curve crosses your operating current. Two consequences do real work. Forward voltage falls about 2 mV/°C at fixed current, making the junction a fine temperature sensor (and the mechanism behind every silicon temp sensor and bandgap reference). Dynamic resistance is small and current-dependent (≈26 mV/I at room temperature), which is why a diode drop is a poor voltage reference: it moves with both current and temperature.",
            "The negative tempco also explains why paralleling diodes fails naively: the hottest diode conducts more, heats further, and hogs the current. Parallel only matched, thermally-coupled devices or add ballast resistance. The same physics warns about datasheet reading — Vf specified at 25 °C and one current says little about your operating point; use the curve family, and remember conduction loss is Vf × I averaged over the actual waveform, not the DC values.",
          ],
        },
        {
          heading: "Rectifier structures and their stresses",
          body: [
            "Half-wave rectification is one diode and terrible utilization (DC magnetizing current in a transformer, double-size filter). Full-wave bridge is the default: two diode drops in series, each diode blocking the full peak reverse voltage; check PIV with margin for line transients. Inrush at first connection — an empty reservoir charging through nothing but source impedance — can exceed the surge rating (IFSM); NTC inrush limiters, series resistance, or active precharge exist for exactly this.",
            "Freewheel and clamp diodes are chosen by recovery behavior: a slow diode across a relay is fine (millisecond time constants), but a freewheel diode in a fast PWM leg needs soft, fast recovery or the recovery current spike becomes loss and EMI at every cycle. When diode conduction loss itself is the problem — battery ORing, reverse protection, low-voltage rails — ideal-diode controllers replace the junction with a controlled MOSFET, trading a 400 mV drop for tens of millivolts, with the controller handling reverse-current turn-off.",
          ],
        },
        {
          heading: "Zeners, avalanche, and reference behavior",
          body: [
            "Reverse breakdown comes in two physics: true zener tunneling below ~5 V with a negative tempco, and avalanche multiplication above with a positive tempco — near 5.6–6.2 V the mechanisms cross and tempco nearly cancels, which is why classic reference zeners live there. The knee sharpness matters as much as the voltage: at microamp bias, a low-voltage zener regulates poorly because its curve is soft; datasheet Vz is specified at a test current your circuit must actually approach.",
            "Distinguish jobs: a zener regulates or references at a defined bias; a TVS is an avalanche device optimized for pulse energy and low dynamic resistance during a surge — its working voltage, breakdown, and clamping voltage at rated pulse current are three different numbers, and protection design uses all three. Using a small zener as surge protection, or a TVS as a reference, fails on the spec each was never asked to meet.",
          ],
        },
      ],
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
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: makeTechnicalGuide({
      heading: "A BJT controls collector current through a forward-biased junction",
      formula: {
        type: "formula",
        heading: "Transconductance is set by bias current alone",
        formula: "g_m = I_C / V_T ≈ I_C / 26 mV",
        explanation: "The exponential junction gives every BJT the same transconductance per milliamp — about 38 mS per mA at room temperature, independent of device type. This single relation generates most small-signal design: common-emitter voltage gain is −gm·RC (so gain ≈ collector-resistor drop in volts divided by 26 mV), and emitter degeneration lowers it toward the resistor ratio −RC/RE while stabilizing everything.",
        terms: [
          { symbol: "g_m", meaning: "Transconductance", unit: "A/V (S)" },
          { symbol: "I_C", meaning: "Collector bias current", unit: "A" },
          { symbol: "V_T", meaning: "Thermal voltage kT/q (~26 mV at 300 K)", unit: "V" },
        ],
      },
      sections: [
        {
          heading: "The small-signal toolkit",
          body: [
            "Three single-transistor stages cover most analog duty. Common emitter: voltage gain −gm·RC, inverting, moderate input impedance (β/gm, boosted by degeneration) — the gain stage. Emitter follower (common collector): gain ≈ 1, high input impedance, low output impedance (≈1/gm plus driven-source effects) — the buffer, with the classic caveat that its output impedance is inductive-ish and it can oscillate driving capacitive loads without a small base resistor. Common base: current buffer with low input impedance, used in cascodes to hide Miller capacitance and extend bandwidth.",
            "The current mirror is the other primitive: two matched junctions share a VBE, so collector currents match to the quality of matching and thermal coupling — the basis of biasing and active loads throughout IC design. Early effect (collector current rising slightly with VCE) sets the mirror's output resistance and the ceiling on single-stage gain; degeneration resistors improve both matching and output resistance. Discrete mirrors need matched pairs or shared-package devices; two random 2N3904s at different temperatures are a current 'mirror' in name only.",
          ],
        },
        {
          heading: "Switching realities and thermal traps",
          body: [
            "A saturated BJT is a storage device: the base region is flooded with charge that must be removed before collector current stops, adding storage time (hundreds of nanoseconds to microseconds) to turn-off. Remedies are old and effective — a Baker clamp (Schottky from base to collector) keeps the transistor just out of deep saturation; a base-emitter resistor and a speed-up capacitor across the base resistor sweep charge out faster. Darlingtons buy huge beta but pay two drops: VCE(sat) can never fall below the first transistor's VBE plus the second's saturation, so they run hot as switches.",
            "Thermal behavior is the BJT's sharpest edge. At fixed VBE, collector current rises ~9%/°C — a positive electrothermal feedback that produces current hogging in paralleled devices and hot-spotting inside a single die at high VCE (secondary breakdown, the reason BJT SOA curves cut in below the power hyperbola at high voltage). Parallel BJTs only with emitter ballast resistors sized to drop a few hundred millivolts at full current, and check the SOA curve for the DC operating point, not just power. This is the deep contrast with MOSFETs, whose positive RDS(on) tempco is self-balancing.",
          ],
        },
      ],
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
    readingTime: 20,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "The gate is capacitive, but switching it is a current problem",
      formula: {
        type: "formula",
        heading: "Gate-drive power",
        formula: "P_drive = Q_g × V_drive × f_sw",
        explanation: "Each switching cycle moves the full gate charge through the drive voltage, so average driver power scales with charge, drive voltage, and frequency — 60 nC at 12 V and 100 kHz is 72 mW of driver dissipation. Peak driver current is a separate number: it sets transition speed through the gate-loop impedance during the Miller plateau, and it is what datasheet 'source/sink amps' ratings describe.",
        terms: [
          { symbol: "Q_g", meaning: "Total gate charge at the drive voltage", unit: "C" },
          { symbol: "V_drive", meaning: "Gate-drive voltage swing", unit: "V" },
          { symbol: "f_sw", meaning: "Switching frequency", unit: "Hz" },
        ],
      },
      sections: [
        {
          heading: "Reading the datasheet curves that matter",
          body: [
            "The transfer curve (ID versus VGS) has a temperature crossover: below the zero-tempco point drain current rises with temperature (dangerous, hogging), above it current falls (self-balancing). Hard-switched converters operate far above it — this is why paralleled MOSFETs share conduction current gracefully. Linear-mode operation (hot-swap, active loads, slow gate ramps) sits below it, where modern high-density trench FETs are startlingly fragile: their SOA curves show severe derating for DC and long pulses, and hot-spot failures occur well inside the classic power hyperbola. For linear duty, check the DC SOA line specifically, or choose parts characterized for it.",
            "The gate-charge curve tells the switching story better than capacitance values: the flat Miller plateau is where drain voltage swings while the driver pumps charge into Cgd — its length (Qgd) times drive current sets the voltage transition time. The capacitances behind it: Ciss (gate input), Coss (output — sets switching loss at light load and ZVS energy), and Crss = Cgd (the Miller feedback term, the small number that matters most). All are strongly voltage-dependent, so compare parts at similar VDS, not by table headline.",
          ],
        },
        {
          heading: "Gate-drive design decisions",
          body: [
            "Drive voltage: logic-level parts specify RDS(on) at 4.5 V, standard at 10 V; driving either at threshold-plus-a-little produces a resistor that happens to switch. High-side N-channel switches need a supply above the source — a bootstrap capacitor refreshed each cycle (with its duty-cycle and startup limits), a charge pump for static-on, or an isolated supply. The dV/dt-induced turn-on hazard: a fast drain rise pumps current through Cgd into the gate impedance, and if the divider Cgd/(Cgd+Cgs) times the slew lifts VGS past threshold, the 'off' device conducts — countered by low off-state gate impedance, negative drive, or a Miller-clamp driver pin.",
            "Common-source inductance — the few nanohenries of source bonding and pin shared between the power loop and the gate loop — converts di/dt into a voltage that opposes the gate drive, slowing every transition and causing oscillation in the worst cases. Kelvin-source packages exist precisely to separate the loops; use the Kelvin pin for the driver return and the improvement in switching loss is often double-digit percent. When paralleling, give each FET its own gate resistor (shared gates ring), keep layout symmetric, and accept that switching-transition sharing is set by Vth matching even though conduction sharing self-balances.",
          ],
        },
        {
          heading: "Loss accounting, term by term",
          body: [
            "Total loss decomposes cleanly, and each term points at a different fix. Conduction: I²RMS × RDS(on) at hot junction temperature (multiply the 25 °C value by ~1.4–1.8×). Switching: ½·V·I·(tr+tf)·fsw for the overlap intervals — attacked with faster gate drive, lower Qgd, or soft-switching. Output-capacitance loss: ½·Coss·V²·fsw dumped every hard turn-on, dominant at light load and high frequency. Body-diode conduction during dead time: Vf × I × dead-time fraction — shrink dead time or add a parallel Schottky. Reverse recovery of the body diode in hard-commutated legs: Qrr × V × fsw, the term that makes slow body diodes expensive at high frequency.",
            "Avalanche events (inductive turn-off past VDS rating) are surviveable only within the rated single-pulse and repetitive energy — and repetitive avalanche as a design strategy is a reliability bet most designs should not make. Margin practice: 80% derating of VDS against measured overshoot, junction temperature calculated per-term, and a thermal camera pass at worst load before calling any of it verified.",
          ],
        },
      ],
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
    readingTime: 19,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Feedback makes the ideal rules approximately true",
      formula: {
        type: "formula",
        heading: "Noise gain governs bandwidth and stability",
        formula: "Noise gain = 1 + Z_f / Z_in      f_closed ≈ GBW / noise gain",
        explanation: "The amplifier's own errors — offset, noise, and its open-loop response — are amplified by the noise gain, set by the feedback network as seen from the inputs. Closed-loop bandwidth is the gain-bandwidth product divided by noise gain, and stability is judged where the noise-gain curve meets the open-loop curve. An inverting attenuator (signal gain −0.1) still has a noise gain of 1.1; a difference amp's noise gain includes both legs.",
        terms: [
          { symbol: "Z_f / Z_in", meaning: "Feedback and input-leg impedances", unit: "Ω" },
          { symbol: "GBW", meaning: "Gain-bandwidth product", unit: "Hz" },
          { symbol: "f_closed", meaning: "Closed-loop −3 dB bandwidth (first order)", unit: "Hz" },
        ],
      },
      sections: [
        {
          heading: "The classic topologies and what each one costs",
          body: [
            "Non-inverting: input impedance is the amplifier's own (enormous), signal gain 1 + Rf/Rg, but the input common-mode voltage follows the signal — so input-stage nonlinearity and CMRR errors ride along. Inverting: the summing node stays at virtual ground (fixed common mode, cleaner distortion), gain −Rf/Rg, but input impedance is just Rg, loading the source. The unity buffer is the hardest stability case of the non-inverting family (noise gain 1, maximum feedback), which is why some fast amplifiers are 'decompensated' and forbid it, specifying a minimum stable gain instead.",
            "The difference amplifier (four matched resistors) subtracts, but its CMRR is set by resistor matching, not the op amp: 0.1% resistors limit CMRR to roughly 54 dB, and its input impedances are both finite and unequal. When source impedance is high or CMRR must be real, the three-op-amp instrumentation amplifier is the answer — buffered inputs, gain set by one resistor, monolithic parts with laser-trimmed networks. Transimpedance (photodiode) stages convert current to voltage with a feedback resistor; the diode capacitance at the summing node creates a feedback pole that demands a small compensating capacitor across Rf, sized to trade bandwidth against peaking.",
          ],
        },
        {
          heading: "Stability in practice: recognizing and fixing marginal loops",
          body: [
            "Marginal phase margin looks like: overshoot and ringing on square waves, a peak in the closed-loop frequency response, and in the worst case sustained oscillation at some megahertz frequency unrelated to your signal. The usual embedded causes: capacitive loads (cables, MOSFET gates, reference pins) adding a pole inside the loop; large feedback resistors resonating with input capacitance; and rail-to-rail output stages that tolerate less load capacitance than their classic ancestors.",
            "The fix toolbox: an isolation resistor (22–100 Ω) between output and capacitive load, moving the load pole outside the loop at the cost of DC accuracy into loading; a feedback capacitor across Rf cancelling the input-capacitance zero (start with Cf ≈ Cin·Rin/Rf); snubbers for cable loads; and in-loop compensation schemes where accuracy at the load matters. Verify with the step response — a scope and a small square wave measure phase margin faster than any analyzer: ~25% overshoot is roughly 45° margin, and the target for production designs is little or no ringing across temperature and load population.",
          ],
        },
        {
          heading: "A worked error budget",
          body: [
            "Take a 100× thermocouple front end from a 350 Ω source, ±0.5 µV/°C class goal. Offset: a precision amp's 25 µV max offset appears as 2.5 mV at the output — calibratable, but its 0.3 µV/°C drift is not, contributing 30 µV/°C output drift. Bias current: 1 nA through the 350 Ω source is 0.35 µV input error — negligible here, dominant with megohm sources; match the impedances seen by both inputs so it appears as (smaller) offset-current error. Noise: 10 nV/√Hz over a 100 Hz bandwidth is 0.1 µV RMS input-referred — then the resistors' own Johnson noise (√(4kTRB), about 2.4 nV/√Hz for 350 Ω) joins the sum. Gain error: the 1% resistors dominate everything (1% of reading) until replaced by a 0.1% matched pair.",
            "The discipline generalizes: convert every term to the same reference point (input-referred is conventional), separate calibratable constants from drift and noise, and let the budget name the dominant term before any part is chosen. Most precision failures are one overlooked term — usually drift or source-impedance interaction — not the op amp's headline offset.",
          ],
        },
      ],
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
    readingTime: 18,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "A filter shapes magnitude, phase, noise, and time response together",
      formula: {
        type: "formula",
        heading: "The second-order building block",
        formula: "H(s) = ω₀² / (s² + (ω₀/Q)·s + ω₀²)",
        explanation: "Every all-pole filter factors into second-order sections (plus one first-order for odd orders), each defined by a natural frequency and a Q. The alignment tables (Butterworth, Bessel, Chebyshev) are just prescriptions of ω₀ and Q per section. Q = 0.707 is maximally flat; higher Q peaks and rings; the highest-Q section dominates sensitivity and should be built with the tightest components.",
        terms: [
          { symbol: "ω₀", meaning: "Section natural frequency", unit: "rad/s" },
          { symbol: "Q", meaning: "Quality factor (damping ζ = 1/2Q)", unit: "—" },
          { symbol: "H(s)", meaning: "Low-pass prototype transfer function", unit: "—" },
        ],
      },
      sections: [
        {
          heading: "Choosing and building the active stages",
          body: [
            "The two workhorse op-amp topologies split the territory. Sallen-Key is simple and non-inverting, but its high-frequency behavior degrades (the output feeds through the components at frequencies where the amp runs out of gain, so stopband floor rises) and its component sensitivity grows with Q — above Q ≈ 3–5 it becomes a tolerance lottery. Multiple-feedback (MFB) inverts, is stingier with amplifier bandwidth demands, holds its stopband better, and tolerates higher Q; it is the default for anti-aliasing duty. Both need amplifiers with GBW well above f₀ × Q × gain (a 10× rule minimum, more for low distortion).",
            "Cascade design has an ordering craft: put low-Q sections first so the high-Q peaking stages see pre-filtered, smaller signals (protecting headroom), but put gain early enough that later stages' noise doesn't dominate — dynamic range and noise pull in opposite directions, and the right order depends on whether the enemy is clipping or the noise floor. Spread the tolerances: the highest-Q section gets the C0G capacitors and 1% or better resistors; run a Monte Carlo across the population, because a corner-case cascade can peak several dB where nominal design was flat.",
          ],
        },
        {
          heading: "Anti-aliasing architecture is a system decision",
          body: [
            "The brute-force path — a high-order analog filter attenuating everything above Nyquist — is rarely the modern answer. Oversampling moves the alias band far from the signal: sample at 16× the signal bandwidth, and the analog filter only needs to attenuate at (16×fs/2 minus signal band), often achievable with a gentle second-order stage; a digital filter then decimates with a sharp, perfectly repeatable response. Delta-sigma converters build this in — their modulator oversamples enormously and the on-chip decimator does the sharp filtering, leaving a simple RC as the external requirement (check the modulator's own chopping and image frequencies).",
            "Sampled-input details still bite: a SAR's acquisition draws a charge packet, so the anti-alias network must also be the settling network — the datasheet's recommended R-C at the pin serves both jobs, and enlarging R for more filtering without checking settling trades aliasing for distortion. Switched-capacitor filter ICs offer clock-tunable corners but are themselves sampled systems: they alias around their own clock and leak clock feedthrough, so they need a modest continuous-time filter on each side. And always sanity-check with the step response — a filter that meets its magnitude spec but rings for milliseconds may be wrong for a control loop or a multiplexed measurement chain.",
          ],
        },
      ],
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
    readingTime: 20,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Conversion accuracy belongs to the complete signal chain",
      formula: {
        type: "formula",
        heading: "The ideal limit and what erodes it",
        formula: "SNR_ideal = 6.02·N + 1.76 dB      SNR_jitter = −20·log₁₀(2π·f_in·t_j)",
        explanation: "Quantization alone limits an N-bit converter to 6.02N + 1.76 dB of SNR (the q/√12 noise of the code steps). Clock jitter imposes an independent ceiling that falls with input frequency: 1 ps RMS jitter caps any converter at ~84 dB for a 10 MHz input, regardless of resolution. ENOB works the formula backwards from measured SINAD — the honest bit count under real conditions.",
        terms: [
          { symbol: "N", meaning: "Nominal resolution", unit: "bits" },
          { symbol: "t_j", meaning: "RMS aperture + clock jitter", unit: "s" },
          { symbol: "f_in", meaning: "Input signal frequency", unit: "Hz" },
        ],
      },
      sections: [
        {
          heading: "Architectures are contracts, not just speeds",
          body: [
            "SAR: one complete conversion per trigger, results immediately, easy multiplexing between channels, resolutions to ~18 bits at up to a few Msps — the general-purpose embedded default. Delta-sigma: a fast 1-bit (or few-bit) modulator plus a digital decimation filter delivering very high resolution (24 bits nominal) at modest rates, with two structural consequences — latency of several output periods through the filter (painful in control loops), and settling of that filter after any mux channel change (switch channels, discard samples, wait). Pipeline and interleaved architectures buy tens of Msps to Gsps for radios and scopes at the cost of latency and calibration complexity.",
            "DACs have their own taxonomy: resistor-string (monotonic, simple), R-2R (fast, precision, matching-limited), current-steering (RF speeds), and delta-sigma (audio, with images and out-of-band shaped noise to filter). Two specs that surprise: glitch energy — the transient spike when many bits switch at a major code transition, which no amount of averaging removes from a waveform output — and settling time to the accuracy you actually need, which for 16 bits is a much longer time than to 1%.",
          ],
        },
        {
          heading: "Noise arithmetic you can do on paper",
          body: [
            "Averaging M samples of white noise gains √M in SNR — half a bit per doubling — so 256× oversampling buys 4 bits only if the noise is genuinely white and uncorrelated with the signal. If the dominant noise is periodic interference (a switcher tone), averaging at the wrong rate aliases it rather than removing it; synchronizing the sample rate to the interference (or the mains) turns the same arithmetic into a powerful notch. Dither exists because a too-quiet input parks on one code and quantization becomes distortion instead of noise: a little injected noise (or the system's own) linearizes the average.",
            "Differential and integral nonlinearity read differently in applications: DNL is code-width error — a DNL of −1 LSB is a missing code, fatal for closed-loop control resolution claims; INL is the bow of the whole transfer curve — the accuracy ceiling after two-point calibration. Offset and gain errors calibrate out at build time; INL, noise, and drift do not. When a datasheet says 24 bits, look for the noise-free bits or effective resolution at your data rate and gain — the marketing number and the shot-to-shot repeatability can differ by 6 bits.",
          ],
        },
        {
          heading: "The reference and the front end carry the accuracy",
          body: [
            "Every conversion is a ratio against the reference, so reference error is conversion error, one-for-one: 10 ppm/°C of reference drift is 10 ppm/°C of full-scale drift, and reference noise inside the conversion bandwidth adds directly. SAR references see a pulsed load synchronized with conversion — the specified decoupling (typically a large low-ESR ceramic immediately at the pin) is part of the converter, and a reference buffer with insufficient bandwidth produces code-dependent errors that look like nonlinearity. Ratiometric designs sidestep absolute reference error: excite the sensor from the same source as the reference and the ratio cancels drift.",
            "Front-end interaction closes the loop: the driver amplifier must settle the sampling-capacitor kickback within the acquisition window (check the datasheet's R-C-amplifier recipe), mux charge injection couples channel to channel, and input protection (series R, clamps) trades robustness against settling and leakage-induced offset at high temperature. Board-level: keep the analog input and reference away from digital edges, and remember that a converter's grounds and the star of decoupling around it are part of the transfer function — layout errors read as electrical specs missed.",
          ],
        },
      ],
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
    readingTime: 20,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Regulation is a control problem wrapped around energy conversion",
      formula: {
        type: "formula",
        heading: "First-order conversion ratios",
        formula: "Buck: V_out = D·V_in      Boost: V_out = V_in/(1−D)      Buck-boost: V_out = −D/(1−D)·V_in",
        explanation: "Duty cycle D sets the ideal conversion ratio in continuous conduction; real converters deviate through switch and diode drops, DCR, and dead time. The relations also expose each topology's stress pattern: a buck's inductor sees the output current but the input sees chopped current (input cap works hard); a boost is the mirror image; and the boost ratio explodes toward D→1, which is why practical boosts stay below roughly 4–5×.",
        terms: [
          { symbol: "D", meaning: "Duty cycle of the control switch", unit: "0–1" },
          { symbol: "V_in / V_out", meaning: "Input and output voltage", unit: "V" },
        ],
      },
      sections: [
        {
          heading: "Compensation and the loops inside the box",
          body: [
            "Voltage-mode control measures only the output and needs a type-III compensator to fight the LC filter's double pole; current-mode control adds an inner loop on inductor current, turning the power stage into a controlled current source — simpler compensation, inherent cycle-by-cycle current limiting, and automatic input-voltage feed-forward. Its price: sub-harmonic oscillation above 50% duty unless slope compensation is added (integrated in modern controllers, but its range limits your inductor choice), and a noise-sensitive current-sense path that layout must protect.",
            "Two structural facts shape what bandwidth can buy. The output capacitor's ESR contributes a zero that once stabilized voltage-mode designs — replacing an old design's electrolytics with ceramics removes that zero and can destabilize a previously fine loop. And every boost or buck-boost carries a right-half-plane zero: at frequencies above it, commanding more output momentarily delivers less (the inductor must first store more energy), imposing a hard ceiling — practical boost bandwidth stops at roughly a fifth to a third of the RHP-zero frequency, no matter the compensator. Verify loops by injection measurement (a small transformer-coupled perturbation into the feedback divider) or, minimally, by load-step response across the full input/load/temperature envelope.",
          ],
        },
        {
          heading: "Component selection that decides the design",
          body: [
            "Inductor: pick ripple current at 20–40% of load current — smaller ripple needs big inductance (slow transient response, large DCR), larger ripple stresses capacitors and cores. Check saturation current against peak (load plus half ripple plus transient overshoot) with margin, at hot temperature where saturation worsens; check RMS heating separately. Core material sets AC loss: powdered iron soft-saturates cheaply, ferrites clip hard but lose less. Capacitors: input caps absorb the chopped current (RMS rating is the constraint on a buck's input), output caps set ripple and transient droop — with ceramics derated for DC bias, and enough effective capacitance that the loop's first instants of a load step (before the control responds) stay in spec.",
            "Light-load behavior is a spec, not a footnote: fixed-PWM converters burn switching loss at no load, so controllers drop into pulse-skipping or burst modes — efficient, but with low-frequency ripple and audible-band energy that can bleed into sensitive analog or squeal in ceramic caps. Frequency choice trades size against loss and EMI band placement (above 150 kHz keeps the fundamental out of the conducted-emissions measurement's most annoying region; some designs sit just below 150 kHz for the same reason, or at 2+ MHz to shrink magnetics and dodge AM radio). And the input filter you add for EMC interacts with the converter's negative input impedance — an underdamped LC at the input of a tightly regulated converter can oscillate; damp it deliberately.",
          ],
        },
      ],
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
    readingTime: 21,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Control current to control torque",
      formula: {
        type: "formula",
        heading: "The electromechanical pair",
        formula: "T = K_t · I        V = I·R + L·dI/dt + K_e·ω",
        explanation: "Torque follows current through the torque constant; the drive voltage divides between resistance, inductance, and back-EMF. In SI units K_t (N·m/A) and K_e (V·s/rad) are numerically equal — one constant seen from two sides. The voltage equation explains everything about operating range: at stall all voltage is available to push current (maximum torque, maximum heating); at top speed back-EMF consumes the bus and no headroom remains to drive current.",
        terms: [
          { symbol: "K_t / K_e", meaning: "Torque and back-EMF constants (equal in SI)", unit: "N·m/A, V·s/rad" },
          { symbol: "ω", meaning: "Mechanical angular velocity", unit: "rad/s" },
          { symbol: "L, R", meaning: "Winding inductance and resistance", unit: "H, Ω" },
        ],
      },
      sections: [
        {
          heading: "The motor curve and thermal reality",
          body: [
            "For a given bus voltage, a brushed or BLDC motor's steady-state behavior is one straight line: speed falls linearly from no-load speed (where back-EMF ≈ bus voltage) to stall (where current = V/R). Output power peaks at half of stall torque; efficiency peaks much closer to no-load. Reading a motor datasheet is locating your load on that line — and noticing that the continuous-operation region is a small fraction of it, bounded by heating, not electronics.",
            "Thermal limits are two time constants: the winding heats in seconds (copper mass), the case in minutes (whole motor mass). This gap is the overload budget — a motor can deliver several times rated torque briefly, governed by an I²t-style limit on winding temperature, then must return below continuous rating to cool. Firmware should model this explicitly (thermal observer or at minimum an I²t accumulator) rather than trusting a single current limit: the same 3× current that is fine for 2 seconds destroys the winding in 60.",
          ],
        },
        {
          heading: "Sensing and the cascade of loops",
          body: [
            "Motion control stacks three loops, each 5–10× slower than the one inside it: the current (torque) loop at kilohertz bandwidth, tuned against the winding's L/R plant; the velocity loop around it; the position loop outermost. The separation lets each be tuned as if the inner one were ideal. The current loop's quality gates everything — its bandwidth sets how fast torque can change, and its sensor placement is a real design fork: low-side shunts are cheap but see current only during specific PWM states (requiring careful sampling timing and blanking of switching edges); in-phase sensing sees everything but needs common-mode capable amplifiers; DC-link sensing reconstructs phase currents from one shunt with modulation constraints.",
            "Rotor-position sensing splits by need: Hall sensors give six-step commutation edges (fine for fans and pumps); encoders or resolvers give the resolution field-oriented control and servo positioning demand; sensorless back-EMF observers work well at speed and fail at standstill (no EMF to observe), so sensorless drives open-loop start or use high-frequency-injection techniques. Field-oriented control transforms the three phase currents into torque-producing and flux components and regulates each with a PI controller — its practical payoffs are smooth low-speed torque, quieter operation, and field-weakening: deliberately driving negative flux current to reach speeds beyond the natural back-EMF limit, trading torque capability and efficiency for range.",
          ],
        },
      ],
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
    slug: "marine-motor-drives-and-pwm",
    libraryId: "technical",
    collectionId: "marine-electrical-systems",
    title: "Marine motors, drivers & PWM",
    summary: "How boat propulsion and actuator motors connect electrical drive design, PWM, current control, thermal limits, regeneration, and fault handling.",
    readingTime: 21,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "A marine motor drive is a power converter, control loop, and safety system",
      formula: {
        type: "formula",
        heading: "Propeller load laws",
        formula: "T ∝ ω²        P ∝ ω³",
        explanation: "A propeller's torque grows with the square of shaft speed and its power with the cube — 80% speed needs only half the power. The cube law shapes everything: cruise efficiency lives at partial speed, small speed increases at the top cost enormous power, and the drive's continuous rating is set by cruise while its transient rating must cover bollard conditions (full thrust at zero boat speed), where the propeller curve is at its heaviest.",
        terms: [
          { symbol: "T", meaning: "Propeller shaft torque", unit: "N·m" },
          { symbol: "ω", meaning: "Shaft speed", unit: "rad/s" },
          { symbol: "P", meaning: "Shaft power", unit: "W" },
        ],
      },
      sections: [
        {
          heading: "Salt water changes the electrical problem",
          body: [
            "Seawater is a conductor, and the boat sits in it. Insulation resistance becomes a monitored quantity, not an assumption — propulsion systems track it continuously because moisture ingress degrades it progressively, and a single fault in a floating (IT) DC system is an alarm condition rather than an event, precisely so the second fault never happens. Leakage currents that would be cosmetic ashore participate in the boat's galvanic system: DC leaking into the bonding network or the water accelerates corrosion of underwater metals dramatically (stray-current corrosion eats a propeller in weeks, not years), which makes the drive's isolation architecture and its Y-capacitance to hull part of the corrosion design.",
            "PWM common-mode voltage adds a rotating-machine failure mode: the stator's common-mode swing couples capacitively through the airgap and bearings, and the resulting bearing currents pit races into premature failure — the marine remedies are the industrial ones (shaft grounding brushes, insulated bearings, common-mode chokes, slower edges) plus attention to where that common-mode current returns, because on a boat the 'chassis' includes the water. Cooling closes the environmental loop: water-cooled drives and motors move heat brilliantly but add condensation risk on cold plates (design for it — drainage, sensors on the right side of the seal) and raw-water circuits bring their own galvanic and fouling maintenance story.",
          ],
        },
        {
          heading: "Sizing against the real mission profile",
          body: [
            "Sizing from the propeller curve, the battery, and the mission beats sizing from the motor catalog. Continuous rating comes from cruise power plus margin at the true system voltage under load (a 48 V bank sags toward 44 V at high current — the drive must deliver rated power there, not at nominal). Transient rating covers acceleration, bollard, and fouled-propeller torque, bounded by the I²t thermal model rather than a single current number. Regeneration needs a stated policy: a sailing boat's freewheeling propeller and every deceleration push energy back — the bank's charge acceptance (temperature- and SOC-dependent, and zero when the BMS says so) decides whether the drive must fold back, clamp into a brake resistor, or coordinate with the BMS before it happens.",
            "The interview-grade summary: state the motor type and commutation, derive currents from stall/bollard rather than free run, name the bus energy destinations for every operating quadrant, and list the protection layers (phase overcurrent, bus over/undervoltage, insulation monitor, thermal ladder, and the defined response to each). A drive that cannot explain where regenerated energy goes with a full battery has not finished its design.",
          ],
        },
      ],
      overview: [
        "Small craft equipment may use brushed DC motors for pumps and actuators, BLDC or PMSM machines for efficient propulsion and steering systems, induction machines in larger AC systems, and stepper or servo drives for positioning. The shared principle is that torque follows controlled current while speed and back-EMF determine how much voltage headroom remains.",
        "PWM does not simply make a motor see a smaller DC voltage. The bridge applies high-speed switching states, the winding inductance smooths current, and the controller chooses recirculation paths, dead time, current limits, and modulation strategy. In a three-phase inverter, six-step commutation is simpler; sinusoidal or field-oriented control reduces torque ripple and can improve efficiency, acoustics, and low-speed control.",
        "Boat loads are not benign bench loads. Propeller torque rises strongly with speed, water impact can create abrupt load steps, fouling can push a drive toward stall, and deceleration can regenerate energy into the DC bus. Long motor leads increase common-mode current and voltage overshoot at the motor terminals, so the cable, shielding, output filtering, and insulation system are part of the drive design.",
      ],
      variables: [
        ["Motor type and load curve", "Sets torque-speed behavior and control method", "Starting torque, stall, propeller curve, and fouled-load state"],
        ["Bus voltage and energy storage", "Controls speed range, fault energy, and shock hazard", "Nominal, charging, regenerative, and transient bus voltage"],
        ["PWM frequency and edge rate", "Trades acoustic noise, ripple, switching loss, and EMI", "Current ripple, device temperature, cable emissions, and ringing"],
        ["Current measurement", "Enables torque control and fast protection", "Shunt or Hall bandwidth, ADC timing, blanking, and common-mode range"],
        ["Gate drive and MOSFET margin", "Determines loss, shoot-through immunity, and transient robustness", "Dead time, Miller immunity, avalanche, SOA, and thermal impedance"],
      ],
      failure: "A motor controller that works on a short bench cable can fail in a boat because the installed cable adds inductance, capacitance, antenna length, and ground-reference movement. The result can be MOSFET ringing, nuisance current trips, radiated noise into radios, or insulation stress at the motor.",
      checklist: [
        "Explain the motor type, commutation method, and why that method fits the load.",
        "Derive peak current from stall, acceleration, jammed/fouled load, and braking, not free-run current.",
        "Provide a defined path for regenerated energy: battery acceptance, brake chopper, clamp, or controlled deceleration.",
        "Review dead time, gate resistance, desaturation or overcurrent response, undervoltage lockout, and thermal shutdown.",
        "Probe phase current, gate-source voltage, switch-node ringing, bus ripple, and motor-terminal voltage with the installed cable length.",
      ],
      prompts: [
        { question: "Why does PWM create EMI risk?", answer: "Fast voltage and current edges contain high-frequency components. The bridge loop, motor cable, housing, and return paths can convert that energy into conducted or radiated emissions." },
        { question: "What is the first interview answer for motor torque?", answer: "For DC/BLDC/PMSM machines, torque is primarily controlled by winding current; the driver regulates current while voltage headroom and back-EMF determine speed capability." },
        { question: "Why does regenerative braking matter on a boat?", answer: "Mechanical energy can raise the DC bus. The design must ensure the battery or clamp path can absorb that energy without overvoltage." },
      ],
    }),
    sources: [isoElectricalPropulsion, smartGateDrive, abycStandardsList],
    related: ["motor-control-fundamentals", "marine-emi-emc-and-cabling", "marine-electrical-safety-standards"],
  },
  {
    slug: "marine-emi-emc-and-cabling",
    libraryId: "technical",
    collectionId: "marine-electrical-systems",
    title: "Marine EMI/EMC & cabling",
    summary: "Noise mechanisms in boat electrical systems: PWM drives, chargers, radios, long harnesses, bonding, shielding, filtering, and pre-compliance thinking.",
    readingTime: 20,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "On a boat, cables are often the EMC problem",
      sections: [
        {
          heading: "The receivers set the bar, and it is brutally low",
          body: [
            "A VHF receiver hears signals near −110 dBm — a fraction of a microvolt at its antenna — and GNSS works below the thermal noise floor by correlation, so even microwatts of in-band interference measurably degrade position fixes and squelch-open range. This is why marine EMC is harder than generic compliance: passing CISPR limits at 3 m says little about a switcher harmonic landing in the VHF band when the radio's antenna cable runs a meter from your motor cable for the length of the hull. Design against the actual receive bands on board — VHF marine (156–162 MHz), AIS, GNSS L1 (1575 MHz), and increasingly cellular/WiFi — and treat any emission line inside them as a defect regardless of the limit line.",
            "Antenna and cable planning is the cheap, decisive intervention: masthead VHF antennas earn their height, GNSS antennas want sky view away from radar beams and other transmitters, transmit antennas need separation from each other (a 25 W VHF transmission couples volts into nearby wiring — immunity matters as much as emissions), and receiver feedlines route away from power-conversion cabling with crossings at right angles. The on-vessel test that matters most costs nothing: operate every radio while exercising every drive, charger, and pump, and listen — a sea trial with the squelch open finds what the bench never will.",
          ],
        },
        {
          heading: "Harness discipline as a system design",
          body: [
            "A boat's harness is tens of meters of unintentional antenna network threading a conductive, wet structure. Practical discipline: classify every cable (power-switching, power-clean, signal, RF) and separate the classes in the cable runs with defined spacing, using the hull's structure as natural shielding where possible; twist every supply/return and signal/return pair (loop area is the variable you control most cheaply over a long run); and shield the noisy and the sensitive, terminating shields 360° at the equipment entry — the glanded, bonded entry is the marine version of the connector-boundary rule, and a shield pigtailed to a terminal strip is decoration above a few megahertz.",
            "The bonding network complicates every path: DC negative, the green bonding system for corrosion control, engine blocks, and the water itself form a mesh whose high-frequency behavior differs completely from its DC diagram. Decide deliberately where high-frequency currents should return (usually: locally, via the shield or a dedicated return, never through the bonding mesh), and use isolation — signal isolators on NMEA 2000 taps, isolated DC-DC stages, isolation transformers on shore power — to break the loops that the safety architecture won't let you disconnect. Every ferrite added at an equipment boundary should carry a note of what measurement justified it; the harness is too big a system for folklore.",
          ],
        },
      ],
      overview: [
        "A marine system mixes high-current switching loads, battery chargers, alternators, VHF/AIS/GNSS receivers, sensors, pumps, lighting, displays, and long cable runs through a compact conductive and wet environment. Conducted noise can move on the DC bus; radiated noise often comes from common-mode current on external cables.",
        "Differential-mode noise flows out and back through the intended pair. Common-mode noise flows in the same direction on multiple conductors and returns through parasitic capacitance, bonding structure, water, engine block, shield, or chassis. PWM motor cables, DC-DC converters, switching chargers, and fast digital interfaces are common sources.",
        "Good marine EMC design starts with zoning. Keep noisy power conversion physically and electrically separated from antennas, receiver front ends, sensor wiring, and low-level analog signals. Filter at the boundary, terminate shields intentionally, avoid pigtail shields for high-frequency noise, and ensure return current has a close path instead of forcing it through a large loop or bonding network.",
      ],
      variables: [
        ["Cable length and routing", "Can turn small common-mode current into an antenna", "Harness separation, loop area, shield termination, and service routing"],
        ["Power bus impedance", "Controls conducted noise spread and brownout sensitivity", "Battery impedance, fuse blocks, distribution length, and local capacitance"],
        ["Reference and bonding strategy", "Determines where high-frequency and fault currents flow", "DC negative, chassis, engine block, bonding conductor, and isolated interfaces"],
        ["Boundary filtering", "Stops noise before it escapes or enters the enclosure", "Connector placement, filter current rating, saturation, and return path"],
        ["Receiver proximity", "Sets real-world susceptibility", "VHF/AIS/GNSS/radar cables, antenna placement, and sensor cable paths"],
      ],
      failure: "Adding a ferrite late can help, but it is not a system design. If the noisy current has already coupled onto a long cable before the ferrite, or if the ferrite saturates with DC current, the root cause remains the layout, return path, shield termination, or switching waveform.",
      checklist: [
        "Identify each high dV/dt node, high di/dt loop, and off-board cable before PCB placement is final.",
        "Put connector filters, TVS devices, and chassis returns at the connector boundary with short current paths.",
        "Separate motor/charger/power wiring from low-level sensors and antennas; cross at right angles when routing must cross.",
        "Use twisted pairs for differential or supply/return conductors where loop area matters.",
        "Reserve options for common-mode chokes, RC snubbers, gate resistance, spread spectrum, and shield termination during validation.",
      ],
      prompts: [
        { question: "Why are long motor leads difficult for EMC?", answer: "They add capacitance and antenna length. PWM edges drive common-mode current along the cable, and reflections/ringing can raise motor-terminal stress." },
        { question: "Where should an interface filter usually sit?", answer: "At the enclosure or connector boundary, with a short return to the chosen high-frequency reference so noise does not bypass the filter." },
        { question: "What makes a cable shield ineffective?", answer: "A long pigtail, undefined termination, poor 360-degree contact, corrosion, or routing the shield current through the same reference used by sensitive circuitry." },
      ],
    }),
    sources: [iecMarineEmc, nmeaMarineElectronicsInstaller, analogEmi, analogGrounding],
    related: ["emi-emc-pcb-design", "marine-motor-drives-and-pwm", "connector-and-cable-interfaces"],
  },
  {
    slug: "marine-electrical-safety-standards",
    libraryId: "technical",
    collectionId: "marine-electrical-systems",
    title: "Marine electrical safety standards",
    summary: "A practical map of ABYC, ISO, IEC, NMEA, and USCG references relevant to small craft electrical equipment and propulsion systems.",
    readingTime: 19,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "Treat standards as design inputs, not paperwork after the design",
      sections: [
        {
          heading: "Working with a standard, mechanically",
          body: [
            "The workable process is clause-driven: buy the current edition, walk it clause by clause, and build a requirements matrix — clause number, requirement in your own words, applicability (with justification when 'not applicable'), the design feature that satisfies it, and the verification evidence (test report, analysis, inspection). That matrix becomes the living compliance document: reviewers audit it, certification bodies sample it, and when the standard revises, a delta review against the change list updates it without re-deriving everything. Standards also cross-reference each other (an electrical standard invoking an ignition-protection standard invoking a test method), so the first pass builds the applicability tree before anyone writes requirements.",
            "Recurring themes to expect from small-craft electrical standards, as orientation before reading the real text: conductor sizing and temperature ratings with derating for bundling and engine spaces; overcurrent protection placed close to sources with defined maximum unprotected lengths; battery installation (restraint, ventilation, terminal protection); wiring identification and labeling; equipment location constraints relative to fuel systems; and connection workmanship rules (which terminations are permitted where). Knowing the themes tells you which design decisions will be constrained — the actual numbers must come from the purchased current edition, because they change between revisions and the differences are exactly what audits find.",
          ],
        },
        {
          heading: "Multi-jurisdiction reality and the evidence chain",
          body: [
            "A product sold into the U.S. recreational market meets federal law (33 CFR 183 where applicable) plus ABYC standards as the de-facto insurer/builder baseline; the EU's Recreational Craft Directive brings harmonized ISO standards and CE marking with conformity-assessment routes; commercial and classed vessels add class-society rules. These overlap without agreeing — voltage thresholds, test levels, and documentation differ — so international products maintain the requirements matrix per market and design to the envelope of the strictest applicable clauses. Involving a certification body or experienced surveyor early, at architecture time, is dramatically cheaper than discovering a spacing or location rule after tooling.",
            "The evidence chain is what transforms 'we think it complies' into a defensible position: hazard analysis naming the risks, requirements traced to design features, test reports from accredited or well-documented in-house labs, component certificates (an 'ignition-protected' relay is a certificate, not a description), production controls ensuring unit 400 matches the tested unit, and change control that re-evaluates compliance when anything in the chain changes. In an interview or a design review, the strong answer is never a recited standard number — it is this loop: identify hazards, find the applicable clauses, design to them, verify, and keep the traceable record.",
          ],
        },
      ],
      overview: [
        "For a motor-boat electrical-equipment interview, the useful answer is not that one standard exists. The useful answer is that marine systems combine shock/fire risk, ignition risk near fuel vapors, corrosion, vibration, water ingress, battery energy, shore-power interfaces, electromagnetic compatibility, and maintainability by installers who may not be the original designer.",
        "ABYC publishes many boat-system standards. The current standards list includes electrical topics such as AC/DC electrical systems, storage batteries, lithium-ion batteries, electrical propulsion systems, cathodic protection, ignition protection, lightning protection, three-phase AC systems, and environmental considerations. For U.S. recreational boats, 33 CFR Part 183 Subpart I covers required electrical-system topics for certain gasoline-engine boats, including ignition protection, grounding, batteries, conductors, and overcurrent protection.",
        "ISO 13297 covers small-craft installed DC and single-phase AC electrical systems within its stated voltage limits. ISO 16315 covers small-craft electric and hybrid propulsion electrical systems. ISO 8846 addresses ignition protection for electrical devices around flammable gases. IEC 60533 is a shipboard EMC reference, while NMEA 0400 is an installation standard used in marine electronics practice.",
      ],
      variables: [
        ["Jurisdiction and market", "Determines legal baseline and customer expectations", "U.S. federal rules, ABYC practice, ISO/CE targets, class or customer requirements"],
        ["System voltage and energy", "Changes shock, arc, creepage, clearance, and disconnect strategy", "Nominal and maximum voltage, battery chemistry, fault current, and stored energy"],
        ["Location on vessel", "Changes ignition, water, corrosion, and serviceability requirements", "Engine space, bilge, cockpit, helm, cabin, mast, or exposed deck"],
        ["Compliance evidence", "Turns engineering claims into reviewable proof", "Requirements matrix, risk analysis, test reports, inspections, and traceability"],
      ],
      failure: "The dangerous pattern is designing from generic electronics instincts and checking marine requirements at the end. That can leave late-breaking issues in conductor protection, battery restraint, ignition protection, labeling, access, separation, corrosion, or cable routing that require mechanical redesign.",
      checklist: [
        "Build a requirements matrix from the applicable ABYC, ISO, IEC, NMEA, regulatory, and customer documents before schematic freeze.",
        "Separate legal requirements, voluntary standards, customer requirements, and internal engineering rules.",
        "Document assumptions: vessel size, propulsion type, fuel type, battery chemistry, voltage class, installation location, and environment.",
        "Trace every safety requirement to a design feature and a verification method.",
        "For real product work, use the purchased/current standards text and qualified compliance review; do not rely on summaries.",
      ],
      prompts: [
        { question: "What standards would you mention for small craft electrical systems?", answer: "ABYC electrical standards, ISO 13297 for installed small-craft electrical systems, ISO 16315 for electric propulsion, ISO 8846 for ignition protection, relevant U.S. CFR rules, IEC EMC references, and NMEA installation practice." },
        { question: "Why is ignition protection a marine topic?", answer: "Gasoline vapor or other flammable gas may accumulate in enclosed spaces. Electrical devices in those areas must be designed so normal operation or faults do not ignite the mixture." },
        { question: "What evidence makes a safety claim credible?", answer: "A requirements matrix, hazard/risk analysis, rated components, review records, inspection criteria, and test results tied directly to the applicable requirement." },
      ],
    }),
    sources: [abycStandardsList, isoSmallCraftElectrical, isoElectricalPropulsion, isoIgnitionProtection, uscgElectricalSystems, iecMarineEmc, nmeaMarineElectronicsInstaller],
    related: ["marine-power-distribution-and-batteries", "waterproofing-corrosion-and-ignition-protection"],
  },
  {
    slug: "marine-power-distribution-and-batteries",
    libraryId: "technical",
    collectionId: "marine-electrical-systems",
    title: "Marine power distribution & batteries",
    summary: "Battery banks, 12/24/48 V distribution, fusing, disconnects, chargers, shore-power interfaces, brownout, lithium BMS, and fault energy.",
    readingTime: 20,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "The battery is both a supply and a high-energy fault source",
      sections: [
        {
          heading: "Bank architecture and the charging web",
          body: [
            "Boats separate energy jobs: a start bank sized for cranking surges, a house bank sized in amp-hours for loads at anchor, and increasingly a propulsion bank at higher voltage — kept independent so no failure strands the vessel with both dead. The interconnection hardware has evolved: diode isolators charge multiple banks but waste 0.6–0.7 V (meaningful when charge absorption happens in tenths of a volt); automatic charging relays combine banks when charge voltage is present; and DC-DC chargers now dominate mixed-chemistry systems because a lithium house bank and an alternator need a controlled current buffer — an alternator regulating for lead-acid into a low-impedance lithium bank will happily run at full output until its diodes cook, and a BMS disconnect under that load produces a load-dump transient that kills the alternator's electronics (hence alternator protection devices and 'charge through a DC-DC' as default practice).",
            "The 48 V trend follows the arithmetic: power = V × I, so quadrupling voltage quarters current for the same power — cable mass, voltage-drop percentage, and connector stress all improve, while staying under the ~60 V DC threshold that most small-craft standards treat as the boundary before high-voltage requirements (shock protection, creepage classes, service rules) escalate. State-of-charge estimation rounds out the architecture: voltage-only estimation fails under load and with lithium's flat curve, so real systems integrate current through a shunt-based monitor with periodic full-charge synchronization — and the design should treat SOC as an estimate with error bars, especially before it automates load shedding from it.",
          ],
        },
        {
          heading: "Fault current is a specification, not an accident",
          body: [
            "A large battery bank delivers thousands of amps into a bolted short — lithium banks more than lead-acid because of lower internal resistance — and every protective device between battery and load carries two ratings that matter: the trip rating everyone reads, and the ampere interrupting capacity almost nobody does. A fuse whose AIC is below the bank's prospective fault current can fail to clear — arcing across its open element while the fault continues — which is why battery-main protection on big banks specifies high-AIC classes (Class T and similar) rather than whatever fits the holder on hand. Protective-device placement rules (within a short distance of the source, protecting each conductor at its origin, per the applicable standard's numbers) exist for the same reason: the cable between battery and first fuse is the unprotected zone, kept short, sheathed, and away from chafe.",
            "Disconnects and the emergency story complete the design: battery switches rated for the real currents (and for breaking DC arcs, which are far harsher than AC), positioned where a person can reach them with the fault burning, wired so the bilge pump survives the 'all off' position where the owner expects it to. Precharge circuits for capacitive loads (drives, inverters) prevent the connect-arc that pits switch contacts and ruins BMS FETs. And every scenario in the fault tree — BMS opens under load, shore charger with bank disconnected, alternator load dump, reversed jump-start — deserves a written answer at design time, because the harness will eventually run every one of them as a live experiment.",
          ],
        },
      ],
      overview: [
        "Marine equipment often sits on a DC system with high surge current capability, long wiring, uncertain maintenance history, voltage dips during engine cranking, charger ripple, inductive load transients, and corrosion-prone terminations. Nominal 12 V, 24 V, or 48 V labels do not describe the full electrical environment.",
        "Distribution design is about limiting fault energy close to the source and ensuring conductors, connectors, switches, relays, and PCBs are protected for their actual ampacity. Overcurrent protection should protect the wire first; semiconductor protection may need faster electronic limits. Disconnects, service loops, labeling, and accessibility matter because equipment must be installed and maintained safely.",
        "Lithium systems add BMS-controlled disconnects, precharge, cell balancing, temperature limits, short-circuit capability, charger compatibility, and failure states where the battery may suddenly open. A motor controller, charger, or DC-DC converter must behave safely when the battery is connected, disconnected, deeply discharged, current-limited, charging, or rejecting regenerative energy.",
      ],
      variables: [
        ["Battery chemistry and configuration", "Sets voltage range, fault current, charging behavior, and BMS behavior", "Lead-acid vs lithium, series/parallel layout, maximum voltage, and disconnect behavior"],
        ["Conductor protection", "Prevents overheated wiring and fire", "Fuse or breaker location, ampacity, temperature rating, bundling, and voltage drop"],
        ["Load transients", "Drive resets, nuisance trips, or overvoltage", "Cranking dip, pump inrush, relay coils, motor braking, and charger transitions"],
        ["Grounding and isolation", "Controls shock, corrosion, noise, and fault detection", "DC negative, bonding system, isolated DC-DC supplies, leakage, and ground faults"],
      ],
      failure: "A PCB input fuse does not protect the boat harness if the unprotected cable from the battery can short before reaching the board. In marine power design, protective-device location is as important as its rating.",
      checklist: [
        "Draw the full power path from battery positive through protection, switching, load, return, and bonding references.",
        "Check cold-crank, charger-high, alternator transient, reverse polarity, load dump, and battery-disconnect cases.",
        "Rate conductors, connectors, PCB copper, relays, fuses, and terminals for continuous current, inrush, and fault clearing.",
        "Design precharge and inrush limiting for large input capacitors or motor drives.",
        "Define safe behavior for BMS open, charger present, shore-power connected, and regenerated energy events.",
      ],
      prompts: [
        { question: "Why does voltage drop matter in a 12 V boat system?", answer: "A small absolute drop is a large percentage of system voltage and can cause brownouts, slow motors, dim lighting, relay chatter, or measurement error." },
        { question: "What should a fuse protect?", answer: "Primarily the conductor and downstream wiring from overheating under fault current; protecting sensitive electronics may require additional faster or coordinated protection." },
        { question: "Why is lithium battery behavior different?", answer: "The BMS can abruptly limit or disconnect current, and the pack has specific charge, temperature, balancing, and short-circuit constraints that the load must tolerate." },
      ],
    }),
    sources: [abycStandardsList, isoSmallCraftElectrical, uscgElectricalSystems],
    related: ["power-supplies-and-regulation", "protection-esd-and-transients", "marine-electrical-safety-standards"],
  },
  {
    slug: "waterproofing-corrosion-and-ignition-protection",
    libraryId: "technical",
    collectionId: "marine-electrical-systems",
    title: "Waterproofing, corrosion & ignition protection",
    summary: "Designing electrical equipment for wet, salty, vibrating, fuel-adjacent environments: sealing, materials, connectors, corrosion, and ignition risk.",
    readingTime: 19,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Marine reliability is environmental design, not just electronics design",
      sections: [
        {
          heading: "IP ratings and what they don't promise",
          body: [
            "IP codes describe standardized tests, not service life. IPX6 is powerful water jets; IPX7 is static immersion at one meter for thirty minutes; neither implies the other (deck equipment can need both, which is written IPX6/IPX7), and none of them covers the mechanism that actually floods enclosures at sea: breathing. Temperature cycling pumps air across seals — a sealed box cooling after sunset pulls a partial vacuum that inhales moist air past any marginal gasket, condensing inside night after night. The fixes are engineered, not hopeful: pressure-equalizing vent membranes (PTFE) that pass air but not water, desiccant with a service schedule for truly sealed volumes, or the humble deliberate drain — designed drainage at the low point often outperforms the pursuit of a perfect seal.",
            "Connector fine print follows the same rule: most circular connectors carry their IP rating only when mated or capped, so the design must survive the unmated state a deckhand leaves it in; gaskets have compression ranges and set over time; and cable glands seal on round, correctly-sized jacket — the flat cable squeezed into a round gland is a capillary channel. Orientation is free reliability: connectors exiting downward, drip loops in every cable, and gasket faces out of standing water turn a marginal seal into a durable one.",
          ],
        },
        {
          heading: "Electrochemistry, from hull scale to PCB scale",
          body: [
            "Immersed dissimilar metals connected electrically form a battery, and the galvanic series in seawater tells you the polarity: the less noble metal (zinc, aluminum) corrodes to protect the more noble (stainless, bronze). The area rule decides the rate — a small anodic area coupled to a large cathodic one concentrates the entire attack on the small part, which is why a stainless bolt in an aluminum housing is acceptable and an aluminum rivet in a stainless plate is a fastener with a countdown. Sacrificial anodes exploit the same physics on purpose and are a maintenance item; stray DC current from leaky wiring overwhelms all of it, accelerating corrosion orders of magnitude faster than galvanic couples — another reason leakage current is an electrical spec with mechanical consequences.",
            "The same chemistry operates at board scale in humid salt air: flux residues and salt films are ionic contaminants that turn adjacent traces into electrolytic cells, growing dendrites that short at high impedance long before they short at low. Defenses stack: clean assembly (specified, verified cleanliness, not 'no-clean and hope'), conformal coating chosen by mechanism — acrylic for easy rework, urethane for chemical resistance, silicone for temperature and vibration, parylene for the conformal gold standard where rework is abandoned — with masking and coverage inspection as process steps, and layout that keeps high-impedance and high-voltage nodes away from board edges, fasteners, and gasket lines where contamination arrives first. Surface finish participates too: ENIG's nickel barrier weathers humidity cycling better than HASL for fine-pitch boards headed to sea.",
          ],
        },
      ],
      overview: [
        "Boat equipment sees humidity, condensation, spray, salt contamination, temperature cycling, vibration, UV exposure, cleaning chemicals, bilge vapors, and service handling. Water ingress can create leakage, dendritic growth, corrosion, dielectric breakdown, connector fretting, and misleading sensor readings long before a board fully fails.",
        "Sealing strategy is a mechanical and manufacturing decision. Gaskets need compression control, vents may be needed to avoid pressure-driven water ingress, potting improves environmental resistance but can trap heat or stress components, and conformal coating helps only if coverage, keep-out areas, masking, rework, and contamination control are handled deliberately.",
        "Ignition protection is separate from waterproofing. A sealed enclosure is not automatically ignition protected, and an ignition-protected device is not automatically suitable for immersion or salt spray. Fuel-adjacent spaces require attention to arcs, hot surfaces, stored energy, relays, switches, connectors, fuses, batteries, venting, and fault containment.",
      ],
      variables: [
        ["Ingress path", "Determines where water reaches electronics", "Connectors, seams, vents, fasteners, cable glands, membranes, and capillary paths"],
        ["Material pairings", "Drive galvanic corrosion and mechanical durability", "Metals, plating, fasteners, connector shells, gasket material, and electrolyte exposure"],
        ["Surface contamination", "Reduces insulation resistance and creepage effectiveness", "Salt residue, flux residue, coating voids, and cleaning process"],
        ["Ignition source control", "Prevents arcs or hot surfaces from igniting vapor", "Switching contacts, fuses, relays, brushed motors, batteries, temperature rise, and enclosure behavior"],
      ],
      failure: "A product can pass a brief water spray test and still fail in service because pressure cycling pulls moisture through a connector, salt residue lowers surface resistance, or galvanic corrosion opens a ground, shield, or sense connection months later.",
      checklist: [
        "Define the installation environment: exposed deck, cockpit, cabin, bilge, engine compartment, or sealed electronics bay.",
        "Select connectors, seals, vents, plastics, metals, fasteners, coatings, and labels as one environmental system.",
        "Control galvanic couples, drainage, condensation paths, and service orientation.",
        "Keep high-impedance nodes, high voltage spacing, and safety-critical sensing away from contamination-prone edges and connectors.",
        "For fuel-adjacent locations, evaluate ignition protection using the applicable current standards and regulatory requirements.",
      ],
      prompts: [
        { question: "Why is salt contamination worse than clean water?", answer: "Salt residue is conductive and hygroscopic, so it supports leakage current, corrosion, and reduced insulation resistance even after visible water is gone." },
        { question: "What is a galvanic corrosion concern?", answer: "Dissimilar metals connected through an electrolyte can create an electrochemical cell, causing the less noble material to corrode." },
        { question: "Why is sealing not enough for ignition safety?", answer: "Ignition protection requires controlling arcs, hot surfaces, and explosive-gas interaction under defined conditions; a sealed box may still fail, leak, or contain an ignition event poorly." },
      ],
    }),
    sources: [isoIgnitionProtection, uscgElectricalSystems, abycStandardsList],
    related: ["marine-electrical-safety-standards", "marine-emi-emc-and-cabling", "connector-and-cable-interfaces"],
  },
  {
    slug: "transformers-and-isolation",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Transformers, magnetics & isolation",
    summary: "Turns ratio, flux, magnetizing current, leakage, core loss, saturation, common-mode current, and safety isolation.",
    readingTime: 18,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: makeTechnicalGuide({
      heading: "A transformer transfers changing field energy, not DC",
      formula: {
        type: "formula",
        heading: "The flux budget",
        formula: "ΔB = (V · Δt) / (N · A_e)",
        explanation: "Faraday's law rearranged into the designer's form: applied volt-seconds divided by turns and core cross-section gives the flux-density swing. Design against the material's usable limit (ferrites saturate around 0.3–0.4 T, less when hot) at the worst-case volt-second product — lowest frequency, highest input, longest duty, including startup and fault transients. More turns or more core area buys flux margin at the cost of copper loss or size.",
        terms: [
          { symbol: "V · Δt", meaning: "Volt-seconds applied per half cycle", unit: "V·s" },
          { symbol: "N", meaning: "Winding turns", unit: "—" },
          { symbol: "A_e", meaning: "Effective core cross-sectional area", unit: "m²" },
        ],
      },
      sections: [
        {
          heading: "The model that predicts the waveforms",
          body: [
            "Draw every transformer as three parts: an ideal transformer (ratio n), a magnetizing inductance in parallel with the primary, and leakage inductances in series with each winding. Magnetizing current flows regardless of load — it establishes the flux and must be reset every cycle; it is why an unloaded transformer still draws current and why impedance reflects across the ratio as n² (a 100 Ω load on a 10:1 secondary looks like 10 kΩ at the primary — the impedance-matching trick behind audio and RF transformers).",
            "The flyback 'transformer' is deliberately not a transformer in this sense: it is a coupled inductor whose gapped core stores energy during the switch on-time and releases it to the secondary during off-time. The gap is what stores the energy (field energy lives in the gap's reluctance), which is why flyback cores are gapped and true transformers mostly are not. Confusing the two roles — expecting simultaneous primary/secondary conduction from a flyback, or asking a true transformer to store energy — misdesigns the magnetics from the first equation.",
          ],
        },
        {
          heading: "Loss, windings, and the reset problem",
          body: [
            "Core loss follows the Steinmetz pattern — rising steeply with both flux swing and frequency — while copper loss rises with RMS current and is aggravated above tens of kilohertz by skin and proximity effects: current crowds to conductor surfaces and into layers facing opposing windings, multiplying effective resistance. The countermeasures are litz wire, foil windings, and interleaving (primary-secondary-primary sandwiches), which cuts both proximity loss and leakage inductance — at the price of more interwinding capacitance, and therefore more common-mode displacement current across an isolation barrier. Every winding arrangement is a three-way trade among leakage, capacitance, and insulation spacing.",
            "Any topology that drives a core asymmetrically must guarantee flux reset: forward converters need a reset winding, active clamp, or resonant reset; push-pull and full-bridge stages can 'flux walk' when volt-seconds don't balance between half cycles — small timing or drop asymmetries ratchet the core toward saturation, caught by current-mode control or DC-blocking measures. Watch saturation directly at bring-up: primary current in a healthy converter is trapezoidal; an upward-curling tip is the core running out of linear flux range, and it precedes the failure by exactly one design review.",
          ],
        },
      ],
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
    readingTime: 18,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "Protection is controlled failure and current routing",
      formula: {
        type: "formula",
        heading: "What the protected node actually sees",
        formula: "V_residual = V_br + R_dyn·I_pp + L_loop·di/dt",
        explanation: "A clamp's headline breakdown voltage is only the first term. Real residual voltage adds the clamp's dynamic resistance times the pulse current, plus the inductive overshoot of every millimeter of trace in the surge loop (≈1 nH/mm, and an 8/20 µs surge or ESD edge makes L·di/dt large). This is why a 5 V-rated TVS lets 30 V reach a component when placed far from the connector — and why placement is a protection parameter, not a layout preference.",
        terms: [
          { symbol: "R_dyn", meaning: "Clamp dynamic resistance in conduction", unit: "Ω" },
          { symbol: "I_pp", meaning: "Peak pulse current through the clamp", unit: "A" },
          { symbol: "L_loop·di/dt", meaning: "Inductive overshoot of the clamp loop", unit: "V" },
        ],
      },
      sections: [
        {
          heading: "Know the standard threat waveforms",
          body: [
            "Protection is designed against specified waveforms, not vague danger. IEC 61000-4-2 ESD: up to ±8 kV contact / ±15 kV air, sub-nanosecond edges, tens of amps but little total energy — a speed problem demanding low-inductance, low-capacitance clamps at the connector. IEC 61000-4-4 EFT: repetitive fast bursts coupling into cable bundles — mostly a filtering and immunity problem. IEC 61000-4-5 surge: the 8/20 µs current wave carrying real energy (joules) — a bulk-energy problem for MOVs, big TVS parts, and gas discharge tubes. Automotive adds ISO 7637 pulses and load dump (dozens of volts for hundreds of milliseconds on a 12 V system) — long enough that clamping means dissipating watts, which is why automotive inputs use rugged series elements and purpose-rated suppressors.",
            "Each threat also names its test coupling (contact vs air discharge, direct pin injection vs cable clamp), and immunity criteria distinguish 'no damage' from 'no glitch'. Designing to the actual level and criterion the product must pass — rather than sprinkling generic TVS diodes — is the difference between a protection architecture and protection decoration.",
          ],
        },
        {
          heading: "Layered defenses, with the layers coordinated",
          body: [
            "Robust ports stage their defense: something bulky at the entrance takes the energy (GDT or MOV on true surge ports; a properly returned TVS on signal ports), series impedance between stages limits what continues inward (resistors on signals, ferrites or inductors on power, PTCs where auto-recovery fits), and a final low-capacitance clamp at the protected pin catches the remainder. The coordination check is arithmetic: the residual let-through of each stage, at the specified waveform, must stay inside the survival rating of the next — including the IC's own absolute maximum and its internal ESD structure's tiny energy budget.",
            "Reverse polarity and miswiring deserve the same rigor: a series diode is simple but drops voltage and wastes power; a P-FET high-side (gate to ground through a zener clamp) gives near-zero drop and blocks reverse; a shunt diode plus fuse survives by blowing something replaceable. Data-line protection adds a capacitance constraint — USB HS and Ethernet tolerate only fractions of a picofarad, forcing purpose-built ESD arrays rather than general TVS parts. And verify the return path on the layout: the clamp's surge current must reach chassis or the connector shield without crossing logic ground planes, or the protection event becomes a system reset with the protector working exactly as sized.",
          ],
        },
      ],
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
    summary: "Priorities, readiness, blocking, preemption, priority assignment, timing evidence, and how to reason about whether work completes on time.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A scheduler chooses from ready work",
        body: [
          "A task is running, ready, or blocked. In a fixed-priority preemptive scheduler — the RTOS default — the rule is absolute: the highest-priority ready task runs, immediately and always. The scheduler re-evaluates at every scheduling point: a tick, a task blocking or yielding, and any interrupt that unblocks a task. Tasks of equal priority typically round-robin by time slice.",
          "A well-designed task spends most of its life blocked on a meaningful event — a queue receive, a notification, a semaphore — rather than polling. Blocking is what converts priorities into responsiveness: a blocked high-priority task costs nothing until its event arrives, then preempts within the kernel's context-switch latency. A polling task at high priority is a denial-of-service attack on your own system.",
          "Preemption also defines the danger: anything two tasks share is being shared between arbitrary instruction boundaries. The scheduling design and the synchronization design are the same design, done together or done wrong.",
        ],
      },
      {
        type: "code",
        heading: "Block on work, then finish quickly",
        intro: "A queue naturally couples an event source to a task without a busy loop.",
        language: "C / FreeRTOS",
        code: "for (;;) {\n    sensor_sample_t sample;\n    if (xQueueReceive(sample_queue, &sample, portMAX_DELAY) == pdPASS) {\n        process_sample(&sample);\n    }\n}",
      },
      {
        type: "prose",
        heading: "Assigning priorities is analysis, not ranking importance",
        body: [
          "The rate-monotonic heuristic assigns higher priority to shorter-period (or tighter-deadline) work, and it is optimal among fixed-priority schemes for periodic tasks. Importance is irrelevant: the motor-current loop at 10 kHz outranks the mission-critical logging task because its deadline is 100 µs, not because current matters more than logs. When everything is 'high priority,' nothing is — the design has simply refused to state its deadlines.",
          "Reason about schedulability explicitly: for each task, what triggers it, what is its deadline, and what is its worst-case execution time? The response time of a task is its own WCET plus interference from everything above it plus blocking from below (critical sections, priority inversion). If that sum exceeds the deadline on paper, no amount of testing luck fixes it. Keep total utilization comfortably below saturation, and remember interrupts are the invisible highest-priority tier of the same analysis.",
        ],
      },
      {
        type: "table",
        heading: "When the scheduler runs",
        columns: ["Event", "What can happen"],
        rows: [
          ["Tick interrupt", "Delays expire, time slices rotate equal-priority tasks"],
          ["Task blocks (receive, delay, wait)", "Next-highest ready task runs"],
          ["Task yields or changes priority", "Immediate re-evaluation"],
          ["ISR unblocks a task (FromISR + yield)", "Preemption on interrupt exit — the event-driven fast path"],
          ["Tickless idle", "Tick suppressed during sleep; time repaired on wake"],
        ],
      },
      {
        type: "callout",
        heading: "Priority is about urgency, not importance",
        body: "A high-priority task must have short, bounded execution time. Long unbounded work at high priority adds latency to everything below it — the whole system inherits the worst-case behavior of its highest busy priority.",
        tone: "warning",
      },
      {
        type: "prose",
        heading: "Timing claims need evidence",
        body: [
          "Measure, because scheduling failures are invisible until they aren't. Stack high-water marks per task catch the slow overflow; a trace tool (SystemView, Tracealyzer) or even GPIO toggles around task bodies reveal actual execution times, preemption patterns, and jitter; CPU-load measurement shows how close to the cliff you run; deadline-miss counters turn 'it seems fine' into data. The classic smell is the sleep that fixes a bug: a vTaskDelay sprinkled in until behavior changes is a timing dependency the design refuses to express — find the real ordering requirement and encode it with a primitive.",
        ],
      },
      {
        type: "checklist",
        heading: "Scheduling review",
        items: [
          "List every task's trigger, deadline, period, and measured worst-case execution time in one table.",
          "Assign priorities by deadline (rate-monotonic), and document each exception with its reasoning.",
          "Prefer event-driven blocking to periodic polling; justify every poll loop that remains.",
          "Bound critical sections and audit blocking from lower-priority tasks holding shared resources.",
          "Measure stack high-water marks, CPU load, and per-task execution time under worst-case load.",
          "Count missed deadlines and overruns in variables telemetry can read.",
        ],
      },
      {
        type: "review",
        heading: "Interview prompts",
        prompts: [
          { question: "What makes a task ready?", answer: "It is not blocked on time or an event, and it has not been suspended. The scheduler always runs the highest-priority ready task." },
          { question: "Why can adding a delay hide a bug?", answer: "It changes timing without expressing the dependency. A synchronization primitive makes the actual ordering requirement explicit." },
          { question: "How does rate-monotonic assignment work and why use it?", answer: "Shorter period means higher priority; it is optimal among fixed-priority schemes for periodic deadlines and replaces argument-by-importance with analysis." },
          { question: "What contributes to a task's worst-case response time?", answer: "Its own worst-case execution time, preemption by all higher-priority work including interrupts, and blocking by lower-priority tasks holding resources it needs." },
        ],
      },
    ],
    sources: [freertosDocs],
    related: ["semaphores-mutexes-queues", "state-machines"],
  },
  {
    slug: "return-paths-and-stackup",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Return paths & PCB stackup",
    summary: "Why every signal is a loop, how reference planes control impedance and returns, what layer changes cost, and stackups that make routing easy.",
    readingTime: 13,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: [
      {
        type: "prose",
        heading: "Every signal is a loop",
        body: [
          "Current flows in closed loops, always. The trace you drew is half a circuit; the return current flowing back through planes, pours, and other traces is the other half, and the physics of the whole loop — its area, its inductance, its coupling to neighbors — determines signal integrity and emissions. The most useful habit in PCB design is asking, for every net that matters: where exactly does its return current flow?",
          "The answer changes with frequency. At DC and low frequencies, return current spreads across all available copper along the paths of least resistance. As frequency rises past roughly 50–100 kHz, inductance dominates, and the return concentrates into the path of least impedance — which is directly under the signal trace on the adjacent reference plane, because that geometry minimizes loop area and therefore loop inductance. A fast edge's return current follows its trace like a shadow, whether or not you planned for it.",
          "This is why an adjacent, continuous reference plane is the foundation of high-speed design: it gives every signal a minimal-loop return automatically. It also defines trace impedance — a transmission line is the trace and its reference together, and the dielectric height between them is the dominant geometric term.",
        ],
      },
      {
        type: "prose",
        heading: "Reference changes are where designs leak",
        body: [
          "Every time a signal changes layers, its return current must find a way to follow. If both layers reference the same plane net, a stitching via placed close to the signal via completes the return path. If the layers reference different nets (a ground plane and a power plane), the return must jump between planes through the nearest interplane capacitance — a stitching capacitor placed by the transition, or plane pairs close enough to couple. With neither, the return current spreads out looking for a path, the loop balloons, and the result shows up as crosstalk, edge degradation, ground bounce, and emissions.",
          "Plane discontinuities do the same damage without the via: a split, a slot, or a chain of clearance holes (connector pin fields, via farms) forces returns to detour around the obstruction. Never route fast signals across plane splits or slots; where a crossing is unavoidable, provide an intentional return path alongside. Connector pinouts are part of this discipline — every group of fast signals through a connector needs nearby return pins, or the cable becomes the loop.",
        ],
      },
      {
        type: "table",
        heading: "Working stackups",
        columns: ["Stackup", "Arrangement", "Notes"],
        rows: [
          ["2-layer", "Sig+pour / Sig+pour", "Only for slow, simple designs; return discipline is manual and fragile"],
          ["4-layer (standard)", "Sig / GND / PWR / Sig", "Both signal layers get a reference; keep GND–PWR spacing thin"],
          ["4-layer (alt)", "Sig / GND / GND / Sig", "Best signal integrity; route power as pours on signal layers"],
          ["6-layer", "Sig / GND / Sig / PWR / GND / Sig", "Fast nets on layers adjacent to GND; inner signal layer well shielded"],
          ["8-layer+", "Alternating sig/plane", "Stripline routing, tight impedance control, EMI containment"],
        ],
      },
      {
        type: "callout",
        heading: "Choose the stackup before routing, with the fabricator",
        body: "The stackup fixes impedance geometry, plane adjacency, and which layers can carry fast signals — decisions that cannot be patched after routing. Agree on materials, dielectric thicknesses, and copper weights with the board house first, then route to that reality rather than a calculator's assumption.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Return-path review",
        items: [
          "Trace the return path of every clock, strobe, switching node, and high-speed pair — explicitly, on the layout.",
          "Give fast signals a continuous adjacent reference plane; demote nets that lack one to slow duties.",
          "Place a return via within a couple of millimeters of every high-speed layer transition.",
          "Route nothing fast across splits, slots, or connector antipad fields.",
          "Check connector pinouts for return pins adjacent to each fast signal group.",
          "Review plane copper as a connectivity design: where currents enter, cross, and leave each plane.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does high-frequency return current flow directly under its trace?", answer: "That geometry minimizes loop area and thus loop inductance; above ~100 kHz the impedance of the loop is inductance-dominated, so the least-impedance path is the minimal-area one." },
          { question: "What happens when a signal crosses a plane split?", answer: "Its return current must detour around the split, enlarging the loop — increasing inductance, crosstalk to everything sharing the detour, edge degradation, and radiated emissions." },
          { question: "Why does a layer change need a nearby return via?", answer: "The signal's return current must move to the new layer's reference plane; a close stitching via (or capacitor between different plane nets) keeps the loop small through the transition." },
          { question: "What makes Sig/GND/GND/Sig attractive on 4 layers?", answer: "Both outer signal layers reference solid ground planes, returns never cross nets, and power distributes as pours — trading plane-based power distribution for the best return-path integrity the layer count allows." },
        ],
      },
    ],
    sources: [{ title: "High-Speed Digital Design", publisher: "Howard Johnson & Martin Graham", url: "https://www.pearson.com/en-us/subject-catalog/p/high-speed-digital-design/P200000003500", kind: "Book" }],
    related: ["power-delivery-networks", "component-placement", "emi-emc-pcb-design"],
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
    slug: "capacitance-and-inductance",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Capacitance & inductance",
    summary: "Energy storage, continuity rules, first-order transients, impedance versus frequency, and the non-ideal behavior of real capacitors and inductors.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: [
      {
        type: "prose",
        heading: "Two dual stores of energy",
        body: [
          "A capacitor stores energy in the electric field between its plates; an inductor stores energy in the magnetic field around its winding. Their behaviors are perfect duals: a capacitor's voltage cannot change instantaneously (changing it would require infinite current), while an inductor's current cannot change instantaneously (changing it would require infinite voltage). These continuity rules are the first thing to reach for in any transient problem — they tell you the state that carries over from before a switching event.",
          "The duality runs deep. A capacitor looks like an open circuit at DC and a short at high frequency; an inductor is a short at DC and an open at high frequency. A capacitor resists voltage change and welcomes current spikes; an inductor resists current change and generates voltage spikes when current is interrupted — which is why relay coils need flyback diodes and why suddenly disconnecting an inductive load produces arcs.",
        ],
      },
      {
        type: "formula",
        heading: "Defining relations",
        formula: "i = C·dV/dt        v = L·dI/dt",
        explanation: "Current through a capacitor is proportional to how fast its voltage changes; voltage across an inductor is proportional to how fast its current changes. Stored energy is E = ½CV² and E = ½LI² respectively. Every transient, filter, and switching converter behavior follows from these two equations plus the circuit around them.",
        terms: [
          { symbol: "C", meaning: "Capacitance", unit: "farads (F)" },
          { symbol: "L", meaning: "Inductance", unit: "henries (H)" },
          { symbol: "dV/dt, dI/dt", meaning: "Rate of change of voltage / current", unit: "V/s, A/s" },
        ],
      },
      {
        type: "prose",
        heading: "First-order transients and impedance",
        body: [
          "An RC or RL circuit settles exponentially with time constant τ = RC or τ = L/R: 63% of the way in one τ, effectively settled (>99%) in five. The fastest way through any first-order transient problem is the initial/final value method — use continuity to fix the initial value, inspect the DC steady state for the final value, and connect them with the exponential. No differential equations needed.",
          "In the frequency domain, capacitive impedance is 1/(2πfC) and inductive impedance is 2πfL. Where those curves cross a resistance, filters get their corner frequencies; where an L meets a C, the circuit resonates at f = 1/(2π√LC). Resonance is a tool in oscillators and matching networks and a hazard everywhere else — parasitic L and C ring when excited by fast edges, which is most of what you see on a scope in switching circuits.",
        ],
      },
      {
        type: "table",
        heading: "Real capacitor families",
        columns: ["Type", "Strengths", "Watch out for"],
        rows: [
          ["C0G/NP0 ceramic", "Stable, low loss, no DC-bias effect", "Small values only (≤ ~100 nF)"],
          ["X7R/X5R ceramic", "Dense, cheap, low ESR", "Severe DC-bias capacitance loss, microphonics, aging"],
          ["Aluminum electrolytic", "Bulk capacitance per dollar", "Polarity, ESR, ripple heating, dry-out lifetime"],
          ["Tantalum / polymer", "Stable bulk, low ESR (polymer)", "Surge sensitivity, derate voltage heavily"],
          ["Film", "Precision, high voltage, self-healing", "Size and cost"],
        ],
      },
      {
        type: "prose",
        heading: "Real inductors",
        body: [
          "A real inductor has winding resistance (DCR) that sets copper loss, core loss that grows with frequency and flux swing, and — most critically — saturation. Above the saturation current, the core's permeability collapses and inductance falls rapidly, so ripple current in a converter rises sharply just when current is already high. Check both the saturation current rating (inductance-drop-based) and the RMS heating rating; they are different limits and either can bind first.",
          "Every inductor also has interwinding capacitance, giving it a self-resonant frequency above which it behaves capacitively — a ferrite bead or filter choke does nothing useful past its SRF. Shielded parts contain their field; unshielded parts couple into nearby traces and magnetics, which matters for sensitive analog nearby and for EMI.",
        ],
      },
      {
        type: "callout",
        heading: "The capacitance printed on an X7R part is a ceiling, not a promise",
        body: "High-density ceramics lose capacitance under DC bias — a 10 µF X5R in a small package can deliver 3–4 µF at its working voltage. Datasheets carry bias-derating curves; use effective capacitance at the operating voltage for ripple, timing, and stability calculations, or the design works on the bench at half voltage and fails at full.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Design review",
        items: [
          "Apply continuity first in every switching or transient analysis: what V and I carry across the event?",
          "Use effective capacitance at DC bias and temperature, not the marked value.",
          "Check inductor saturation and RMS current ratings separately against peak and average waveforms.",
          "Locate parasitic L and C around fast edges before wondering where ringing comes from.",
          "Give every interrupted inductive current an intentional path (flyback diode, snubber, clamp).",
          "Verify electrolytic ripple current and lifetime at the real ambient temperature.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why can't capacitor voltage change instantly?", answer: "Voltage change requires moving charge, and i = C·dV/dt — an instantaneous step would require infinite current. The stored charge is the state variable that persists through switching events." },
          { question: "What happens when you interrupt current through an inductor?", answer: "v = L·dI/dt: forcing current toward zero quickly generates whatever voltage is needed to keep it flowing — an inductive kick that arcs across switches unless a clamp or diode provides a path." },
          { question: "Why does a converter inductor fail differently at saturation than at its thermal limit?", answer: "Saturation collapses inductance abruptly, spiking ripple and peak current within microseconds; the thermal limit is a slow average-heating constraint. Both ratings must be checked against the actual waveform." },
          { question: "What is self-resonant frequency and why does it matter for filters?", answer: "The frequency where a component's parasitic partner (capacitance for inductors, inductance for capacitors) resonates with its nominal value; beyond it the component's impedance trend reverses and the filter stops filtering." },
        ],
      },
    ],
    sources: [mitCircuits],
    related: ["voltage-current-resistance", "power-and-energy", "decoupling-and-board-level-filtering"],
  },
  {
    slug: "power-and-energy",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Power, energy & thermal margin",
    summary: "Dissipation forms, RMS reasoning, the thermal resistance chain from junction to ambient, transient thermal impedance, and derating with intent.",
    readingTime: 12,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: [
      {
        type: "prose",
        heading: "Power is a rate; energy is the bill",
        body: [
          "Electrical power is the rate of energy transfer: P = VI at any instant, with the sign (under the passive convention) telling you whether an element absorbs or delivers. Energy is power integrated over time — joules, or watt-hours when the bill is a battery. Keeping the two separate prevents whole categories of confusion: a component survives energy (heating over time constants), while some failure modes respond to instantaneous power or even just voltage or current alone.",
          "For resistive dissipation, the three algebraic forms are the same law wearing different clothes: P = VI when both are known, P = I²R when current is the given (series elements, shunts, traces), P = V²/R when voltage is the given (parallel elements, bleeders). Choosing the natural form for the topology keeps errors out of quick analysis.",
          "For time-varying waveforms, average heating follows the RMS value — the DC-equivalent that dissipates the same power in a resistor. This is why copper, fuses, and shunts are rated in RMS terms, why a 10% duty pulse of 10 A heats like 3.16 A DC (in the resistive-heating sense), and why peak and RMS ratings must both be checked whenever waveforms are pulsed.",
        ],
      },
      {
        type: "formula",
        heading: "Thermal Ohm's law",
        formula: "T_j = T_a + P × (Rθ_jc + Rθ_cs + Rθ_sa)",
        explanation: "Heat flow behaves like current through a chain of thermal resistances: junction to case, case to sink (interface material), sink to ambient. Power is the current analog, temperature difference the voltage analog. Every watt dissipated raises the junction above ambient by the total thermal resistance — and the junction temperature, not the case, is what sets lifetime and failure.",
        terms: [
          { symbol: "T_j / T_a", meaning: "Junction / ambient temperature", unit: "°C" },
          { symbol: "P", meaning: "Dissipated power", unit: "W" },
          { symbol: "Rθ", meaning: "Thermal resistance of each stage", unit: "°C/W" },
        ],
      },
      {
        type: "prose",
        heading: "Transients, pulses, and derating",
        body: [
          "Thermal mass buys time: for short pulses, transient thermal impedance Zθ(t) is far lower than steady-state Rθ, which is why devices publish safe-operating-area curves versus pulse width and why a resistor can absorb a surge that would destroy it as continuous power. The reverse trap also exists — a repetitive pulse train ratchets the average temperature up while each pulse adds a peak on top; both the average and the peak junction temperature must stay in bounds.",
          "Derating is designed margin, not pessimism: operating parts well inside their ratings covers tolerance stacking, ambient extremes, altitude, aging, and the difference between the datasheet's ideal mounting and your board. Typical practice runs film and ceramic parts at ≤50% of rated power and voltage, electrolytics well below rated temperature (lifetime doubles roughly every 10 °C cooler), and semiconductors with junction margin below absolute maximum. The datasheet's Rθja footnote matters most of all — it was measured on a standard test board that is not your board, so treat it as a comparison metric and verify real designs by measurement.",
        ],
      },
      {
        type: "table",
        heading: "The thermal path, stage by stage",
        columns: ["Stage", "Typical values", "You control it by"],
        rows: [
          ["Junction → case", "0.5–5 °C/W (power packages)", "Package selection"],
          ["Case → board/sink", "0.1–3 °C/W", "Interface material, mounting pressure, solder voids"],
          ["Board spreading", "Highly layout-dependent", "Copper area, thermal vias, plane connection"],
          ["Board/sink → ambient", "5–60+ °C/W", "Heatsink size, airflow, enclosure venting"],
        ],
      },
      {
        type: "callout",
        heading: "Measure temperature where the failure happens",
        body: "A finger test or a surface thermocouple reads the coolest, most accessible point — not the junction. Use the package thermal metrics (or a temperature-sensitive parameter like diode Vf) to infer junction temperature, check at worst-case ambient inside the real enclosure, and remember that IR cameras need known emissivity to be quantitative on shiny packages.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Power and thermal review",
        items: [
          "Compute dissipation per component for every operating mode, including faults and stall conditions.",
          "Use RMS values for heating and peak values for ratings; check both on pulsed waveforms.",
          "Draw the thermal path to ambient and sum the resistances; find the dominant stage before optimizing.",
          "Check transient thermal impedance for surges, inrush, and startup instead of applying steady-state limits.",
          "Derate deliberately and record the policy, so reviewers know margin from accident.",
          "Validate with measurement at worst-case ambient in the final enclosure orientation.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is RMS the right measure for resistive heating?", answer: "Dissipation is i²R integrated over time; the RMS value is by definition the equivalent DC level with the same i² average, so it captures heating for any waveform shape." },
          { question: "Why can a device survive a pulse far above its continuous rating?", answer: "Thermal mass absorbs short bursts before the junction reaches limit temperature — transient thermal impedance is much lower than steady-state resistance for short pulse widths." },
          { question: "Why is the datasheet Rθja not your board's Rθja?", answer: "It was measured on a standardized test coupon with defined copper; your copper area, vias, airflow, and neighbors change board spreading and convection, often by 2× either way." },
          { question: "What does running an electrolytic 10 °C cooler buy?", answer: "Roughly a doubling of its wear-out lifetime — temperature is the dominant aging accelerant for wet electrolytics." },
        ],
      },
    ],
    sources: [mitCircuits],
    related: ["voltage-current-resistance", "high-current-and-thermal-pcb-design", "low-power-firmware-design"],
  },
  {
    slug: "power-delivery-networks",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Power delivery networks",
    summary: "Target impedance, the frequency division of labor from regulator to die, mounting inductance, anti-resonance, and verifying a PDN by measurement.",
    readingTime: 13,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: [
      {
        type: "prose",
        heading: "A rail is an impedance, not a number",
        body: [
          "A load never draws smooth DC. Digital cores and radios demand current in steps and bursts spanning DC to hundreds of megahertz, and every step flows through whatever impedance the power delivery network presents at those frequencies. Supply deviation is simply ΔV = ΔI × Z(f) — so the PDN design problem is keeping the rail's impedance below a target across the entire frequency content of the load's transients, not delivering a voltage.",
          "No single component can be low-impedance across that span, so the PDN is a relay team: the regulator's control loop holds the rail from DC to its loop bandwidth (tens of kHz typically); bulk capacitors carry from there through the hundreds of kHz; ceramic decoupling covers hundreds of kHz to tens of MHz; and above that, only power-ground plane pairs, package capacitance, and on-die capacitance are fast enough — board-level parts are already inductors at those frequencies.",
        ],
      },
      {
        type: "formula",
        heading: "Target impedance",
        formula: "Z_target = ΔV_allowed / ΔI_transient",
        explanation: "Allowed ripple (say 3% of a 1.0 V rail = 30 mV) divided by the worst-case current step (say 2 A) gives the impedance ceiling (15 mΩ) the PDN must hold across the transient's bandwidth. It is a first-order design tool: conservative because it assumes worst-case phase alignment, but it turns 'add more caps' into an engineering budget with a pass/fail curve.",
        terms: [
          { symbol: "ΔV_allowed", meaning: "Tolerable rail deviation", unit: "V" },
          { symbol: "ΔI_transient", meaning: "Worst-case load current step", unit: "A" },
          { symbol: "Z_target", meaning: "Maximum PDN impedance across the band", unit: "Ω" },
        ],
      },
      {
        type: "table",
        heading: "Who covers which frequencies",
        columns: ["Stage", "Effective range", "Limited by"],
        rows: [
          ["Regulator loop", "DC – ~10s of kHz", "Control bandwidth, transient slew"],
          ["Bulk caps (electrolytic/polymer)", "kHz – ~1 MHz", "ESR and ESL"],
          ["Ceramic decoupling", "100 kHz – ~50 MHz", "Mounting inductance above resonance"],
          ["Plane pair capacitance", "10s of MHz – GHz", "Plane spacing and area"],
          ["Package + on-die capacitance", "100s of MHz – GHz", "Fixed by the silicon vendor"],
        ],
      },
      {
        type: "prose",
        heading: "Inductance is the enemy; geometry is the weapon",
        body: [
          "Above its self-resonant frequency, a capacitor is an inductor whose value is set almost entirely by mounting geometry: pad shape, trace length to vias, via length to the planes, and plane spreading. A 0402 with vias beside the pads can achieve well under a nanohenry; the same part at the end of a 3 mm trace is several times worse, and no capacitance value rescues bad geometry. This is why placement rules (capacitor loop area, via-in-pad, thin dielectric between power and ground planes) dominate high-frequency PDN performance.",
          "Parallel capacitors of different values create anti-resonance peaks — between one capacitor's inductive slope and another's capacitive slope, impedance can peak above either part alone. Closely spaced power-ground planes and controlled ESR damp these peaks. The practical method: model or measure the full population, look for peaks against the target, and fix them with damping or by filling the frequency gap, not by reflexively adding a decade-spread of values.",
        ],
      },
      {
        type: "callout",
        heading: "Verification is a measurement, not a schematic count",
        body: "PDN impedance is measurable: a two-port shunt-through VNA measurement on the bare rail reveals the real curve, and a scoped load-step (fast FET pulling a defined current) shows the time-domain droop and ring. Probe with a short ground spring at the load — a long ground clip adds more inductance than the PDN you are trying to measure.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "PDN design review",
        items: [
          "Derive a target impedance per rail from allowed deviation and worst-case current step.",
          "Assign each frequency decade an owner: regulator, bulk, ceramics, planes — and check the handoffs.",
          "Minimize mounting inductance: vias adjacent to pads, short fat connections, planes close under the parts.",
          "Use effective capacitance at DC bias, and check for anti-resonance peaks in the combined curve.",
          "Place the highest-frequency capacitors closest to the pins they serve, connected to the same plane pair.",
          "Measure: shunt-through impedance or a load-step transient at the load's pins, worst-case operating mode.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does a PDN need multiple capacitor technologies?", answer: "Each stage is only low-impedance over a limited band set by its capacitance and inductance; the regulator, bulk, ceramics, and planes each own a frequency range and hand off to the next." },
          { question: "What sets a decoupling capacitor's high-frequency performance?", answer: "Mounting inductance — pads, traces, vias, and plane spreading — not the capacitance value; geometry dominates above self-resonance." },
          { question: "What is anti-resonance in a PDN?", answer: "A peak formed where one capacitor's inductive region meets another's capacitive region; the parallel combination can exceed either alone and must be damped or bridged." },
          { question: "Why is target impedance conservative?", answer: "It assumes the load's spectral content aligns worst-case with impedance peaks; real transients rarely do, but the margin covers tolerance, temperature, and aging." },
        ],
      },
    ],
    sources: [analogGrounding],
    related: ["decoupling-and-board-level-filtering", "return-paths-and-stackup", "power-and-energy"],
  },
  {
    slug: "component-placement",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "Component placement",
    summary: "The ordered decisions of a floor plan: mechanical constraints, power loops, analog partitions, clocks, decoupling, thermal spreading, and assembly reality.",
    readingTime: 12,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: [
      {
        type: "prose",
        heading: "Placement is the first routing decision",
        body: [
          "By the time detailed routing begins, most of a board's electrical quality is already fixed. Placement determines every loop area, every trace length, which nets must cross which, whether returns are clean, and whether the thermal path exists. Routing cannot repair poor placement — it can only document it. So placement deserves the schedule time it rarely gets, and it should be reviewed as a design in its own right before a single trace is drawn.",
          "Work in order of decreasing constraint. First the immovable: connectors, mounting holes, height keep-outs, displays, antennas, anything the enclosure dictates. Then the demanding: switching-converter hot loops and power stages, whose loop geometry is measured in millimeters of tolerance. Then partitions: the sensitive analog front end placed away from noise with its own quiet region; the crystal against its MCU pins; the protection parts at the connectors they guard. Decoupling lands with its ICs — each capacitor placed for the loop it serves. Everything else fills in around signal flow, so the schematic's left-to-right story is visible on the copper.",
        ],
      },
      {
        type: "table",
        heading: "Placement priorities and why",
        columns: ["Item", "Rule", "Because"],
        rows: [
          ["Connectors, mechanical", "First, immovable", "The enclosure does not negotiate"],
          ["Switching hot loops", "Compact cell, caps against switches", "Loop inductance sets ringing and EMI"],
          ["Protection (TVS, filters)", "At the connector boundary", "Divert energy before it crosses the board"],
          ["Crystal / oscillator", "Millimeters from its pins, guarded", "Trace capacitance and noise coupling"],
          ["Analog front end", "Quiet partition, short input paths", "µV-level nodes lose to any neighbor"],
          ["Decoupling", "At the pin, vias adjacent", "Mounting inductance dominates HF behavior"],
          ["Hot components", "Spread, away from sensitive parts", "Thermal gradients shift references and age parts"],
        ],
      },
      {
        type: "prose",
        heading: "The non-electrical constraints are just as binding",
        body: [
          "Assembly reality: consistent component orientation speeds inspection and reduces error; courtyards must respect the assembler's minimums; heavy or tall parts constrain reflow sides and wave passes; rework needs physical access around expensive or likely-to-change parts. A board that cannot be economically assembled or repaired is a failed design regardless of its signal integrity.",
          "Test and debug reality: probe points need somewhere for the ground lead; test pads need spacing for fixtures; programming connectors need clearance in the assembled product. And iterate with the schematic — placement is when pin-swap opportunities appear (FPGA banks, MCU alternate functions, resistor-network orderings) that untangle crossings before routing has to fight them.",
        ],
      },
      {
        type: "callout",
        heading: "Neatness is not the objective — current flow is",
        body: "A grid-aligned, visually tidy board can be electrically terrible, and a great board can look asymmetric. Judge placement by loop areas, partition boundaries, signal flow, and thermal paths. Symmetry is only a virtue when the circuit is symmetric.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Placement review",
        items: [
          "Lock mechanical constraints and confirm them against the enclosure model in 3D.",
          "Place power-stage loops first and measure their areas; treat them as a layout spec, not a preference.",
          "Draw the partitions (power, digital, analog, RF) and check that no sensitive route must cross a noisy region.",
          "Put every decoupling capacitor with the pin it serves before general placement fills the space.",
          "Walk the assembly: orientation consistency, courtyards, reflow/wave constraints, rework access.",
          "Verify probe, test-point, and programming access while moving parts is still cheap.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why can't routing fix bad placement?", answer: "Loop areas, net lengths, crossings, and partition violations are set by where parts sit; routing chooses among the paths placement left possible, and the good paths may no longer exist." },
          { question: "What gets placed first and why?", answer: "Mechanically constrained items — connectors, mounting, height limits — because they cannot move; then the most electrically demanding structures, the switching loops, while freedom remains." },
          { question: "Why place decoupling before general parts?", answer: "Its effectiveness depends on loop geometry measured in millimeters; if placed last it lands where space remains rather than where the current loop needs it." },
          { question: "What placement decisions does assembly drive?", answer: "Orientation consistency, courtyard clearances, which side heavy and tall parts occupy, wave/reflow shadowing, fiducials, and access for rework and test fixtures." },
        ],
      },
    ],
    sources: [analogMixedSignal],
    related: ["return-paths-and-stackup", "power-delivery-networks", "switching-power-layout"],
  },
  {
    slug: "pcb-materials-and-impedance",
    libraryId: "technical",
    collectionId: "pcb-design",
    title: "PCB materials, stackup & controlled impedance",
    summary: "Choose laminate, copper, dielectric geometry, finish, and fabrication constraints as an electrical and manufacturing system.",
    readingTime: 18,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "The stackup is an electrical component",
      sections: [
        {
          heading: "Loss, dispersion, and where FR-4 runs out",
          body: [
            "Channel loss has two components that scale differently. Dielectric loss (set by Df) grows linearly with frequency and dominates long channels at gigahertz rates; conductor loss grows with the square root of frequency through skin effect — and is multiplied by copper roughness, because current at high frequency flows in a layer thinner than the tooth profile that bonds foil to laminate. This is why high-speed laminates advertise both low Df and smooth (reverse-treated, very-low-profile) copper, and why the same geometry loses roughly twice as much on rough standard foil at 10+ GHz.",
            "Two more effects appear as speeds climb. Dispersion: Dk falls slightly with frequency, so edges smear — controlled-Dk laminates specify the curve, not one number. Glass-weave skew: the resin and glass have different Dk, and a differential pair whose two traces ride different parts of the weave pattern accumulate delay skew that converts differential signals to common mode; mitigations are rotated artwork, spread-glass fabrics, or wider pairs. Rules of thumb for the technology boundary: ordinary FR-4 serves most work below ~5 Gbps and short channels to ~10; beyond that, mid-loss and low-loss laminates earn their cost — but the honest answer is always a channel-loss budget in dB against the receiver's specification.",
          ],
        },
        {
          heading: "Negotiating the stackup with the fabricator",
          body: [
            "A stackup is assembled from cores (cured laminate with copper) and prepreg (uncured glue layers) — their arrangement determines finished thicknesses, and the fab's standard constructions are cheaper and more repeatable than custom ones. Symmetry about the board's center line matters mechanically: asymmetric copper distribution and dielectric stacks warp during reflow. Copper weight trades current capacity against etch precision — heavy copper cannot hold fine lines and spaces, because etching undercuts; fine-pitch BGA layers want half-ounce foil.",
            "Vias join the negotiation at high layer counts and high speeds: through-hole aspect ratio (board thickness to drill diameter, typically ≤10:1) limits small drills in thick boards; unused via barrel lengths become resonant stubs at high data rates, removed by backdrilling or avoided with blind/buried construction (each lamination cycle adds cost); via-in-pad requires fill and cap. The productive workflow is a one-page stackup request — layer purposes, impedance targets with tolerance, current-carrying needs, material class, and qualification requirements — sent to the actual fabricator before routing, returned as their documented construction with modeled geometries. Every impedance number in the CAD rules should trace to that document, not to a web calculator's defaults.",
          ],
        },
      ],
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
    readingTime: 19,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Partition components and routes, not physics",
      sections: [
        {
          heading: "A concrete walkthrough: ADC + MCU + switcher on one board",
          body: [
            "Floor-plan by energy and sensitivity. The buck converter and its hot loop go in one corner, oriented so the switch node faces away from everything analog; its input filter sits between it and the connector. The MCU, crystal, and digital buses occupy the middle. The analog front end — sensor connector, protection, amplifier, anti-alias filter, ADC, reference — lines up along the opposite edge in signal-flow order, so the sensitive path never elongates or doubles back. One continuous ground plane underlies everything; the 'partition' is empty space and placement discipline, not a cut.",
            "Now audit routes against the floor plan: no digital trace (especially SPI/clock lines to the ADC's own digital pins) may cross the analog region except at the converter itself, entering from its digital side. Supply routing follows the same partition — the analog rail is post-filtered from the switcher (ferrite or LC plus an LDO where the budget allows), star-distributed so digital transients don't share its impedance. If a plane split is ever truly required (a device datasheet demanding it, safety isolation, precision beyond ~16 bits with heavy digital), every crossing signal gets a defined bridge point, and supplies, shields, and programming connectors are re-checked against that boundary — most 'mixed-signal noise' bugs are a route or a supply quietly violating an otherwise sound plan.",
          ],
        },
        {
          heading: "Converter-adjacent rules that pay their rent",
          body: [
            "A converter's AGND and DGND pins are bond wires from the same die — the datasheet's instruction to tie them together at the chip (usually with the analog plane treatment) reflects internal construction, not philosophy; inventing a separation the vendor didn't design for adds inductance exactly where the die needs none. The reference pin's decoupling loop is part of the transfer function: its capacitor returns to the converter's analog ground pins by the shortest path, and nothing else shares that path.",
            "The sampling clock deserves analog respect even though it's digital: its jitter multiplies input frequency into SNR loss, so route it short, referenced, and away from both the switcher and slow noisy edges; don't thread it through a crowded digital bus. Differential inputs keep their symmetry all the way — matched trace lengths, matched filter components on each leg, symmetric ground pours — because asymmetric parasitics convert common-mode interference into signal. And leave measurement hooks: a ground pad near the ADC for the scope spring, and one spare mux channel tied to mid-scale or ground as a built-in noise-floor probe of the whole chain.",
          ],
        },
      ],
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
    readingTime: 19,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Noise is coupled through a specific impedance or field",
      sections: [
        {
          heading: "Diagnosing the coupling mechanism at the bench",
          body: [
            "Each mechanism leaves fingerprints. Capacitive (electric-field) coupling: the noise correlates with voltage edges (dV/dt), grows when the victim's impedance rises, and shrinks when you lower victim impedance or interpose a grounded shield. Inductive (magnetic) coupling: correlates with current edges (di/dt), persists into low-impedance victims, cares intensely about loop areas and orientation, and passes straight through electrostatic shields. Shared-impedance (conducted) coupling: the noise tracks a specific aggressor current exactly and vanishes when the return paths are separated — the classic clue is noise proportional to load current somewhere else.",
            "Cheap bench experiments separate them: short the victim input at various points to localize where noise enters; wave a small loop probe (a few turns on a scope probe's ground) to map magnetic hot spots and a metal foil on a wire to map electric ones; twist or reroute a suspect cable and watch amplitude; and always run the shorted-probe control — a scope probe with its long ground clip forms a fine loop antenna, and a great deal of 'circuit noise' is actually probe pickup. Diagnosing before fixing matters because remedies are mechanism-specific: a shield fixes capacitive and does nothing for magnetic; smaller loops fix magnetic; separated returns fix conducted.",
          ],
        },
        {
          heading: "Chassis, shields, and the single-point myth",
          body: [
            "The old rule 'ground everything at one point' and the RF rule 'bond everything everywhere' are both right — in their frequency ranges. Below ~100 kHz, ground loops with mains-frequency interference are the enemy, and single-point (star) strategies break them. Above a megahertz, wire inductance makes any single-point scheme high-impedance, and multi-point bonding to a chassis reference is the only thing that works. Hybrid grounding covers mixed systems: capacitors from circuit ground to chassis at multiple points look open at 50 Hz (preserving the star) and closed at RF (providing the low-impedance mesh).",
            "Cable shields obey the same frequency logic. For low-frequency electric-field pickup on a high-impedance sensor line, a shield grounded at one end avoids shield current. For RF immunity and emissions, the shield must be bonded 360° at both ends — at the connector backshell, not through a pigtail, whose few centimeters of wire inductance discard the shield's performance above a few megahertz. When both problems coexist, the hybrid appears again: hard bond at one end, capacitor bond at the other. None of it substitutes for the first-order fixes — smaller aggressor loops, gentler edges where speed is free, and victims that don't share centimeters of return with amperes of switching current.",
          ],
        },
      ],
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
    readingTime: 18,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "A decoupling capacitor supplies a local transient current loop",
      formula: {
        type: "formula",
        heading: "Numbers you can estimate by eye",
        formula: "L_trace ≈ 1 nH/mm      f_SRF = 1/(2π√(L·C))      C_plane ≈ 100 pF/in² (4 mil gap)",
        explanation: "A rough loop-inductance rule (≈1 nH per millimeter of narrow trace) plus the self-resonance formula lets you sanity-check any mounting by inspection: a 100 nF 0402 with 2 nH total mounting resonates near 11 MHz and is inductive above. Closely spaced power-ground planes contribute distributed capacitance with almost no inductance — modest in farads, priceless in the range where every discrete part has already given up.",
        terms: [
          { symbol: "L_trace", meaning: "Loop inductance of narrow trace + vias", unit: "~1 nH/mm" },
          { symbol: "f_SRF", meaning: "Self/mounting resonant frequency", unit: "Hz" },
          { symbol: "C_plane", meaning: "Plane-pair capacitance per area", unit: "pF/in²" },
        ],
      },
      sections: [
        {
          heading: "Mounting geometry, ranked",
          body: [
            "For the same 100 nF capacitor, the mounting decides the useful bandwidth. Best: via-in-pad or vias immediately beside the pads, planes directly below — about 1 nH total, useful past 100 MHz. Typical: short traces to vias at the pad ends — 2–3 nH. Poor: the capacitor at the end of a few-millimeter trace shared with the IC pin — 5+ nH, useless above ~30 MHz regardless of its value. This is also the case for smaller packages (0402 beats 0805 mostly through geometry) and for 3-terminal feedthrough capacitors, whose construction cancels most mounting inductance and holds low impedance a decade higher than the same capacitance in two-terminal form.",
            "Modern practice has moved from the folk ritual of one-each 100 nF/10 nF/1 nF per pin (whose staggered values create the very anti-resonances they were meant to avoid) toward fewer, identical, well-mounted capacitors plus plane capacitance: many same-value parts in parallel divide both C and L coherently, pushing one deep notch rather than several peaks. The honest method remains: set a target impedance, model or measure the population, and damp what peaks.",
          ],
        },
        {
          heading: "Filtering an interface without creating a new resonator",
          body: [
            "Choose filter topology by the impedances at both ends: series elements (ferrite, inductor, resistor) work into low-impedance loads; shunt capacitors work from high-impedance sources; a pi filter suits a low-impedance line at both ends; an LC into a high-impedance analog supply pin. Every LC combination is a resonator with a Q set by the parasitic resistances — an undamped ferrite-plus-ceramic on a quiet rail can peak 10–20 dB right at some system frequency, amplifying the noise it was fitted to kill. Damping options: a small series resistor, a lossier ferrite, or a parallel electrolytic whose ESR de-Qs the network.",
            "For sensitive analog rails, co-design the passive filter with the regulator behind it: an LDO's power-supply rejection is excellent at low frequency and collapses above a few hundred kilohertz precisely where the ferrite becomes effective — the pair covers the spectrum only if crossover is checked. Mind the DC terms too: ferrite impedance melts under bias current, and the filter's series resistance drops voltage that a low-headroom LDO may not have. Boundary filters for connectors follow the connector note's rule — filter at the entry, return the filter's shunt path to the boundary reference, and verify the layout didn't route noise around the filter.",
          ],
        },
      ],
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
    readingTime: 20,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "High voltage is an insulation system, not a spacing guess",
      sections: [
        {
          heading: "Field shaping and the failure modes you cannot see",
          body: [
            "Breakdown starts where the field concentrates: sharp copper corners, acute pad points, trace ends, and via edges. High-voltage layout rounds everything — teardropped pads, radiused pour corners, and guard or grading rings that spread equipotentials around sensitive terminations. Burying HV nodes on inner layers exploits the laminate's much higher dielectric strength than air, but interlayer spacing then carries the stress, and every via to that node re-exposes it. Field problems also hide in assembly: solder-joint icicles and component bodies can shrink a carefully drawn clearance by a millimeter.",
            "Partial discharge is the invisible failure mode: microscopic voids in laminate, solder mask, potting, or adhesive experience locally intensified fields and discharge within the void without full breakdown — each event eroding the material until, months later, the insulation fails 'without cause'. It is why AC and repetitive-pulse stress are harsher than DC at the same voltage, why potting processes control vacuum and cure, and why standards add PD tests above certain working voltages. Humidity and condensation meanwhile collapse surface resistivity: a creepage distance adequate when clean and dry can track when salt fog or condensation arrives — pollution degree is an environmental claim your enclosure must actually deliver.",
          ],
        },
        {
          heading: "Measuring high voltage without lying to yourself",
          body: [
            "A high-voltage divider is an exercise in everything this collection teaches at once: the top resistor chain must share voltage across multiple series elements (each within its element voltage rating, matched so tolerance doesn't concentrate stress), leakage across the board surface competes with the microamps flowing in a high-value chain, and the divider's parasitic capacitances make its AC response differ wildly from its DC ratio. Compensated dividers add deliberate capacitance in ratio with the resistance (the scope-probe trick) so the division holds across frequency; uncompensated megohm dividers reading switching waveforms produce beautiful, wrong data.",
            "Probing rules are safety rules: a standard 10:1 scope probe is rated around 300 V — measuring a kilovolt switch node with one risks the probe, the scope, and the operator. High-voltage differential probes handle both the amplitude and the fact that neither node is ground. Discharge paths deserve design attention: bleeder resistors sized for a stated time-to-safe (with their power and voltage ratings checked), discharge verification in the service procedure, and — for stored energy above trivial levels — an indicator or interlock, because the capacitor doesn't know the input was disconnected.",
          ],
        },
      ],
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
    readingTime: 19,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Design the entire current path and thermal path",
      formula: {
        type: "formula",
        heading: "Numbers to carry in your head",
        formula: "R_sheet ≈ 0.5 mΩ/□ per oz-Cu      R_via ≈ 0.5–1 mΩ      α_Cu ≈ +0.39 %/°C",
        explanation: "Copper sheet resistance (halving per doubling of weight), a rough per-via resistance for standard plating, and copper's temperature coefficient let you estimate any path by counting squares and vias. The tempco matters twice: a trace at +100 °C has ~40% more resistance (more drop, more heat — a mild positive feedback), and it is also the mechanism behind using a winding or trace as its own temperature sensor.",
        terms: [
          { symbol: "R_sheet", meaning: "Resistance per square of 1 oz copper", unit: "mΩ/□" },
          { symbol: "□", meaning: "Squares: length ÷ width, geometry-only count", unit: "—" },
          { symbol: "α_Cu", meaning: "Copper resistance tempco", unit: "%/°C" },
        ],
      },
      sections: [
        {
          heading: "Estimating and standards: squares, IPC, and honesty",
          body: [
            "Counting squares makes copper arithmetic fast: a trace's resistance is sheet resistance times length-over-width, independent of absolute size. A 10 mm × 2 mm path in 1 oz copper is 5 squares ≈ 2.5 mΩ — at 10 A that's 25 mV of drop and a quarter watt distributed along it. Necks, corners, and pad entries add fractional squares that dominate short wide paths; via arrays add their per-via resistance in parallel, but derated by the sharing problem — current crowds into the vias nearest the source unless the copper approach distributes it.",
            "For temperature rise, know what the charts assume: the old IPC-2221 curves were conservative extrapolations; IPC-2152 measured reality and shows the strong influence of nearby copper planes (which act as heat spreaders — the same trace runs far cooler over a plane), board thickness, and stillness of air. Charts bound the isolated-trace worst case; real designs with planes usually do better, and enclosed designs with preheated air do worse. Treat any chart as the starting estimate that measurement will correct.",
          ],
        },
        {
          heading: "Joints, connectors, and shunts — where paths actually fail",
          body: [
            "The interconnects age; the copper doesn't. Solder joints at high current experience thermal cycling fatigue (each power cycle strains the joint through CTE mismatch) and, at extremes, electromigration; press-fit pins form gas-tight cold welds that outlast solder in vibration; screw terminals hold only at specified torque on appropriate lugs. Connector ratings need the fine print: the headline per-pin current assumes a stated temperature rise (often 30 °C), all pins loaded changes it, and ambient inside an enclosure eats the same budget. Paralleling connector pins for current divides imperfectly for the same reason vias do — contact resistance variation concentrates current in the best pin.",
            "Current-sense shunts tie the chapter together: the Kelvin sense points must tap inside the shunt's sense pads (not on the current path's copper), the sense pair routes differentially away from the field of the power loop, and thermal EMF at the shunt's terminations (dissimilar-metal junctions with a temperature gradient) adds DC error that no amplifier fixes — orient the shunt so both ends sit at similar temperature and give the element copper to spread its own heat. For milliohm-level measurements of anything, four wires or the measurement is fiction.",
          ],
        },
      ],
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
    readingTime: 20,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "EMC is designed at the source and current path",
      sections: [
        {
          heading: "The compliance landscape, briefly",
          body: [
            "Commercial EMC splits into conducted emissions (measured 150 kHz–30 MHz on the power port through a line impedance stabilization network) and radiated emissions (30 MHz–1 GHz and up, measured with antennas at 3 or 10 m), against limits like CISPR 32/FCC Part 15 with Class A (industrial) and stricter Class B (residential) lines. Immunity standards (the IEC 61000-4-x family: ESD, radiated RF, EFT, surge, conducted RF) run the same coupling physics in reverse. Automotive (CISPR 25) and aerospace add their own, tighter regimes. Knowing which regime and class applies is design input — the delta between Class A and B, or commercial and CISPR 25, changes the architecture, not just the filter values.",
            "Frequencies in a failing scan point at sources: conducted peaks at the switcher fundamental and its low harmonics; radiated humps in the 30–300 MHz range from harmonics of switching edges and clocks riding cables (common-mode); narrow spikes at exact clock multiples from digital buses; broad noise near 100+ MHz from ringing (that specific hot-loop resonance you saw on the scope). Pre-compliance at the bench — a spectrum analyzer, near-field probe set, a LISN for conducted, and an RF current clamp on each cable — finds most failures for a few percent of a chamber's price. The current clamp is the single best predictor: cable common-mode current above roughly 5 µA at a frequency is a radiated-limit risk at that frequency.",
          ],
        },
        {
          heading: "The fix toolbox, ranked by leverage",
          body: [
            "Work from source outward, because upstream fixes are smaller and cheaper. First: shrink the source spectrum — slow every edge that has slack (series gate/damping resistors, driver slew settings), enable spread-spectrum clocking where receivers tolerate it (smears narrowband peaks by 10+ dB), pick switcher frequencies whose harmonics dodge your radios. Second: shrink the geometry — hot-loop area, switch-node copper, return-path discontinuities; one plane-split fix can outperform any filter. Third: contain at boundaries — connector filters returned to chassis, common-mode chokes on cables, shield terminations without pigtails. Last: shield, because a shield is an admission the energy escaped, and every aperture, seam, and cable penetration re-negotiates its performance.",
            "Two recurring special cases: heatsinks over fast switches form capacitively-driven antennas — bond the heatsink to the quiet side or ground it deliberately; and slots in enclosures or planes radiate as slot antennas when their length approaches a half wavelength (a 15 cm seam resonates near 1 GHz) — stitch seams and plane edges at intervals small compared to the highest frequency of concern. Keep a fix journal during pre-compliance: which intervention moved which peak by how many dB is the empirical model of your product that no simulation replaces.",
          ],
        },
      ],
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
    readingTime: 19,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: makeTechnicalGuide({
      heading: "Place by commutation loop before routing by net name",
      formula: {
        type: "formula",
        heading: "Snubber design from a measured ring",
        formula: "L_par = 1/(C_add·(2π·f₁)²·((f₀/f₁)²−1))      R_snub ≈ √(L_par/C_par)",
        explanation: "Measure the free ringing frequency f₀ at the switch node, add a known test capacitance C_add and measure the new, lower frequency f₁ — two equations that solve for the parasitic L and C doing the ringing. The damping resistor is then the characteristic impedance of that resonance, and the series snubber capacitor (typically 3–4× C_par) blocks DC so the resistor only dissipates during edges. Ten minutes of measurement replaces guesswork that otherwise burns efficiency.",
        terms: [
          { symbol: "f₀, f₁", meaning: "Ring frequency before/after adding C_add", unit: "Hz" },
          { symbol: "L_par, C_par", meaning: "Extracted parasitic inductance and capacitance", unit: "H, F" },
          { symbol: "R_snub", meaning: "Snubber damping resistance", unit: "Ω" },
        ],
      },
      sections: [
        {
          heading: "A buck layout, step by step",
          body: [
            "Place in this order and the routing draws itself. (1) The high-frequency input ceramic directly across the high-side drain and low-side source — this loop is the design; millimeters matter. (2) The two FETs (or the converter IC) oriented so that loop closes over the shortest path, with the ground plane immediately beneath on the next layer, letting the plane's mirror currents cancel the loop's field. (3) The inductor at the switch node with the node's copper kept small — pad-sized plus thermal need, no pours; orient a shielded inductor's terminals so the switch-node end is the inner winding (the dot end shielded by the outer turns). (4) Output capacitors from inductor to the same ground region as the input caps, closing the output loop. (5) Controller on the quiet side, gate traces short and direct.",
            "Then the sensitive routes: feedback from the output sense point (after the output caps, at the load if remote sensing matters) back to the controller along the quiet side, never under the inductor or switch node, with its divider placed at the controller pin end (high-impedance node kept smallest); current-sense pairs routed differentially, Kelvin-connected, entering the controller away from gate traces. Ground vias stitch the local ground island to the plane liberally around the loops. This is also why 'copy the eval board' is real advice — the vendor's layout encodes exactly this sequence for that controller's pinout.",
          ],
        },
        {
          heading: "Verifying with the scope, not the schematic",
          body: [
            "Measure the switch node with the shortest possible ground — probe tip-and-barrel against a via pair, never the six-inch ground clip, which adds its own ring and reads overshoot that isn't there. Check: overshoot against FET rating at maximum input and load-step conditions; ring frequency (it identifies the loop — hundreds of MHz means the commutation loop, tens of MHz usually gate or output network); and dead-time behavior (body-diode conduction visible as a negative step before the rise). Efficiency measured across the load range localizes loss: poor light-load points at switching/Coss losses and gate drive, poor full-load at conduction and magnetics.",
            "Thermal imaging at max load closes the loop — hot spots at the low-side FET suggest dead-time or recovery issues; a hot inductor means core loss or saturation ripple; a warm snubber resistor is measuring your parasitic energy directly (P ≈ ½·C·V²·f per edge it absorbs). Iterate gate resistance against the trio of ringing, loss, and EMI: the correct value is a measured compromise, and it is nearly always found on the board, not in the simulation.",
          ],
        },
      ],
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
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "A connector is an electromagnetic and fault boundary",
      sections: [
        {
          heading: "Impedance through the launch",
          body: [
            "To a fast signal, a connector is a transmission-line discontinuity: the pin field's geometry sets a local impedance that rarely matches the trace's 50 or 100 Ω, and the mismatch reflects energy back down the line. The controllable variables are the return pins — a signal pin's impedance at the connector is set mostly by its distance to the nearest return, which is why high-speed pinouts surround each fast signal (or pair) with grounds, and why removing 'unnecessary' ground pins to save contacts degrades every neighbor. Differential pairs keep their two conductors on adjacent pins with symmetric ground relationships, and the board-side breakout region (where fine traces fan into coarse pin fields) deserves the same care as the connector choice itself.",
            "The cable continues the story: its characteristic impedance, shield quality, and pair geometry are part of the channel, and a mismatched or unshielded cable converts a clean board-level eye into marginal signaling plus an efficient antenna. For genuinely fast interfaces, use connectors and cable assemblies specified for the standard — their datasheets carry the insertion-loss and impedance profiles that generic headers simply don't have.",
          ],
        },
        {
          heading: "Contact physics and choosing the termination",
          body: [
            "A contact is a few microscopic metal-to-metal spots held by spring force, and its enemies are chemical and mechanical. Fretting: micro-motion from vibration or thermal cycling repeatedly exposes fresh metal that oxidizes — tin contacts, whose oxide is hard and insulating, fail this way in months in vibrating environments; gold, whose surface doesn't oxidize, resists it, which is what the plating premium buys at low-level signals. Never mate tin to gold: the pairing accelerates fretting corrosion of the tin side. Low-level 'dry circuit' signals (below ~20 mV/10 mA) can't break through oxide films, so they need gold or sealed contacts regardless of current rating.",
            "Termination technologies rank by the gas-tightness of the metal joint: a properly executed crimp cold-flows the wire into a sealed joint that excludes oxygen and outperforms solder under vibration (solder wicks up stranded wire and creates a stiff stress-riser at the joint edge); insulation-displacement suits controlled factory harnesses; screw terminals need strain relief and periodic retorque discipline in vibrating service. Wire terminations, strain relief, and the connector's mating cycle rating (from tens for board-to-board to thousands for USB-class) are reliability specifications — choose them from the service life, not the catalog photo.",
          ],
        },
      ],
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
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: makeTechnicalGuide({
      heading: "A board is not complete until it can be built and diagnosed",
      sections: [
        {
          heading: "Panelization and the physical build",
          body: [
            "Assembly happens on panels, not boards: rails along two edges for conveyor and fixture grip, three global fiducials per panel plus local fiducials near fine-pitch parts, and tooling holes where the assembler specifies. The depanel method is a design decision with electrical consequences — V-scoring is cheap but its snap flexes the whole board edge (ceramic capacitors near a V-score edge crack; keep them several millimeters away and oriented parallel to the edge), while tab-routing with perforations ('mouse bites') stresses only the tab zones at the cost of panel space and a rougher edge.",
            "Stencil and paste details decide first-pass yield on fine parts: paste apertures are the assembler's domain (typically reduced from pad size, with area-ratio limits tied to stencil thickness — one thickness must serve the 0402s and the power connector, which is itself a constraint on your part mix), via-in-pad must be filled and capped or the vias wick paste and starve the joint, and mixed reflow/wave or double-sided reflow imposes orientation and adhesive rules. Moisture-sensitive parts (MSL ratings) add baking and handling windows that a small-shop prototype run can silently violate — the intermittent BGA that 'came back' from a re-bake taught many teams this the hard way.",
          ],
        },
        {
          heading: "Test strategies, compared honestly",
          body: [
            "In-circuit test probes every net through a bed-of-nails fixture: superb per-net fault coverage (shorts, opens, wrong/missing/backwards parts) with fixture NRE that only volume amortizes, and it needs the design to provide a test pad per net at compatible spacing. Flying probe trades fixture cost for cycle time — fine for prototypes and low volume. Boundary scan (JTAG) tests what nails can't reach: BGA interconnects and memory buses, exercised through the parts' own scan cells, needing only the chain brought out correctly. Functional test — running the product's real duties through its connectors with firmware cooperation — is what actually proves a shippable unit, and it needs design support most of all: a manufacturing-mode firmware that identifies the board, exercises each interface with bounded safe stimulus, reads its own sensors and rails, and reports structured results to the line.",
            "Most products layer them: ICT or flying probe for assembly faults, boundary scan where structure demands it, functional for the final verdict — with serialization (barcode or programmed ID) linking every unit's results, firmware version, calibration constants, and rework history into a traceable record. The payoff arrives with the first field-return investigation: 'what did this exact unit measure on the line, and which batch shares its parts?' is either a query or an archaeology project, decided entirely by choices made at layout time.",
          ],
        },
      ],
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
    slug: "semaphores-mutexes-queues",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "Semaphores, mutexes & queues",
    summary: "Choosing synchronization by meaning — ownership, signaling, or data transfer — plus priority inversion, deadlock, and the lighter-weight alternatives.",
    readingTime: 13,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Pick the primitive by the meaning of the relationship",
        body: [
          "The primitives answer different questions. A mutex answers 'who owns this shared state right now?' — it has an owner, must be released by that owner, and carries priority inheritance. A semaphore answers 'how many units of something are available?' — binary for events, counting for resource pools; there is no owner, any context may give it. A queue answers 'here is the data, plus the synchronization for free' — it copies items from producer to consumer, decoupling their lifetimes and pacing.",
          "Choosing by meaning prevents the classic misuse: a binary semaphore pressed into service as a lock. It compiles, it works in testing, and it has no priority inheritance — so a low-priority task holding it while a high-priority task waits can be preempted indefinitely by medium-priority work. That is priority inversion, the failure that famously rebooted the Mars Pathfinder lander, and the mutex's inheritance mechanism (temporarily boosting the holder to the waiter's priority) exists precisely to bound it.",
          "Modern kernels add cheaper paths worth knowing: direct task notifications (a fast, single-waiter signal or value), stream and message buffers (byte streams and variable-size messages for single-producer single-consumer pairs), and event groups (waiting on combinations of flags). When the relationship is one-to-one signaling, a notification outperforms a semaphore by a wide margin.",
        ],
      },
      {
        type: "table",
        heading: "Selection guide",
        columns: ["Primitive", "Relationship", "Pitfall"],
        rows: [
          ["Mutex", "Exclusive ownership of shared state", "Holding across blocking calls; unlock from wrong context"],
          ["Binary semaphore", "Event signal, often ISR → task", "Used as a lock: no inheritance, inversion risk"],
          ["Counting semaphore", "Pool of interchangeable units", "Count drift when give/take paths aren't matched"],
          ["Queue", "Data handoff with pacing", "Full-queue policy undefined: block, drop, or overwrite?"],
          ["Task notification", "Fast one-to-one signal/value", "Single waiter only; state is one word"],
          ["Event group", "Wait on flag combinations", "Not for data; races if flags mean 'consume this'"],
        ],
      },
      {
        type: "code",
        heading: "The ISR-to-task pipeline",
        intro: "The queue carries both the data and the wakeup; the consumer blocks until work exists, and the full-queue policy is explicit.",
        language: "C / FreeRTOS",
        code: "void EXTI_IRQHandler(void) {\n    BaseType_t woken = pdFALSE;\n    event_t evt = { .kind = EVT_EDGE, .t = timer_now() };\n    if (xQueueSendFromISR(evt_q, &evt, &woken) != pdPASS) {\n        dropped_events++;            /* full: count, don't pretend  */\n    }\n    portYIELD_FROM_ISR(woken);\n}\n\nvoid event_task(void *arg) {\n    event_t evt;\n    for (;;) {\n        xQueueReceive(evt_q, &evt, portMAX_DELAY);\n        handle(&evt);                /* runs at task priority       */\n    }\n}",
      },
      {
        type: "prose",
        heading: "Deadlock is a design property, not bad luck",
        body: [
          "Deadlock needs four conditions simultaneously: mutual exclusion, hold-and-wait, no preemption of resources, and a circular wait. You only need to break one, and the practical choice is the circular wait: impose a global lock-ordering rule (documented, ideally asserted) so that any task acquiring multiple mutexes does so in one canonical order. Add timeouts on acquisition as a detection net — a timeout that fires is a design bug reporting itself, so log it loudly rather than silently retrying.",
          "The quieter failures come from holding locks too long: a mutex held across a blocking call (queue receive, delay, I/O wait) extends the blocked time of every waiter and stretches the priority-inversion window even with inheritance. Keep critical sections short and non-blocking; if the protected operation must block, restructure so the lock covers only the state mutation. And prefer designs that need fewer locks — single-owner state with message passing removes entire failure classes rather than managing them.",
        ],
      },
      {
        type: "callout",
        heading: "ISR context changes the rules entirely",
        body: "Interrupt handlers must use the FromISR API variants: they never block, they report a higher-priority-task-woken flag you must pass to the yield macro, and they are only legal from interrupts at or below the kernel's syscall priority ceiling. A mutex has no FromISR variant for a reason — ownership is meaningless in an ISR.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Synchronization review",
        items: [
          "Name the relationship first — ownership, signal, pool, or data transfer — then pick the primitive that means it.",
          "Use mutexes (never binary semaphores) for locks, and verify inheritance is enabled.",
          "Define every queue's depth and its full-queue policy: block with timeout, drop with a counter, or overwrite.",
          "Impose and document a lock-acquisition order; assert it in debug builds.",
          "Audit for locks held across blocking calls and for give/take asymmetries on semaphores.",
          "Use notifications and stream buffers for one-to-one paths; measure before assuming the heavier primitive.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is a binary semaphore the wrong lock?", answer: "It has no ownership and no priority inheritance, so a high-priority waiter can be starved by medium-priority tasks preempting the low-priority holder — unbounded priority inversion." },
          { question: "How does priority inheritance bound inversion?", answer: "The mutex holder temporarily runs at the highest priority among its waiters, so medium-priority tasks cannot preempt it during the critical section; blocking reduces to the critical section's length." },
          { question: "What are the four deadlock conditions?", answer: "Mutual exclusion, hold-and-wait, no preemption, and circular wait — and a global lock-ordering rule breaks the circular wait, which is usually the practical fix." },
          { question: "Why do queues copy data rather than pass pointers?", answer: "Copying decouples producer and consumer lifetimes — the producer's buffer can be reused immediately, and no shared-ownership protocol is needed. Pass pointers only with an explicit ownership handoff convention." },
        ],
      },
    ],
    sources: [freertosDocs],
    related: ["rtos-task-scheduling", "interrupts-and-isr-design", "c-at-the-hardware-boundary"],
  },
  {
    slug: "c-at-the-hardware-boundary",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "C at the hardware boundary",
    summary: "What volatile really promises, memory-mapped register access, integer promotion traps, undefined behavior, alignment and aliasing, and defensive interface design.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: [
      {
        type: "prose",
        heading: "The compiler optimizes what you didn't say",
        body: [
          "C's contract is the abstract machine, not your machine. The optimizer may reorder, merge, cache, or delete any memory access whose effect it cannot see — which is catastrophic for hardware registers, where the access itself is the effect. `volatile` is the keyword that opts an object out: every read and write happens, in source order relative to other volatile accesses, at the stated width. That is the entire promise. It says nothing about atomicity, nothing about ordering with respect to non-volatile accesses, and nothing about what the CPU's write buffers and caches do after the instruction executes.",
          "So `volatile` is for memory-mapped I/O, variables changed by ISRs or DMA, and similar externally-visible objects. It is not a concurrency tool: a 64-bit volatile counter still tears on a 32-bit bus; a volatile read-modify-write is still two accesses with a gap; and on cores with write buffers, a completed store to a device may still be in flight — that's what memory barriers (__DMB/__DSB on ARM) and the architecture's ordering rules are for. The practical sequencing trap: writing a peripheral's enable bit then immediately sleeping, where the write hasn't reached the device — insert the barrier the reference manual asks for.",
        ],
      },
      {
        type: "code",
        heading: "Register access, structured",
        intro: "The volatile-qualified struct overlay is the standard idiom; the wrapper functions are where correctness rules live once instead of everywhere.",
        language: "C",
        code: "typedef struct {\n    volatile uint32_t CR;      /* control            */\n    volatile uint32_t SR;      /* status: read-only  */\n    volatile uint32_t DR;      /* data               */\n} uart_regs_t;\n#define UART0 ((uart_regs_t *)0x40004000u)\n\nstatic inline void uart_write_byte(uint8_t b) {\n    while ((UART0->SR & SR_TXE) == 0u) { }   /* every poll re-reads    */\n    UART0->DR = b;\n}\n/* modify-write on shared registers needs a critical section:\n   read-modify-write is not atomic, and an ISR touching the same\n   register between your read and write loses its update.        */",
      },
      {
        type: "table",
        heading: "Traps and their safe forms",
        columns: ["Trap", "Why it bites", "Safe form"],
        rows: [
          ["int overflow", "Signed overflow is undefined; optimizer assumes it can't happen", "Unsigned arithmetic or explicit range checks"],
          ["uint8_t a,b; (a<<8)|b", "Promoted to int first — surprises at 16 bits, UB shifting into sign", "Cast to uint32_t before shifting"],
          ["Shift by ≥ width", "Undefined, varies by CPU", "Mask or check the shift count"],
          ["signed vs unsigned compare", "Signed converts to unsigned silently", "Compare like types; enable -Wextra"],
          ["Type-punning via cast", "Strict-aliasing violation; optimizer may reorder", "memcpy, or unions used consistently"],
          ["Packed-struct member access", "Unaligned access faults on some cores", "memcpy fields, or serialize explicitly"],
        ],
      },
      {
        type: "prose",
        heading: "Widths, representation, and portability at binary interfaces",
        body: [
          "At any boundary where bytes have a defined layout — registers, protocols, flash records — use fixed-width types (uint8_t, uint32_t) and never `int`, whose width is a platform opinion. Remember integer promotion: arithmetic on types narrower than int is silently performed in int, which changes overflow behavior and shift semantics in ways that only fail on a different compiler or width. Endianness is part of every external layout: define it per interface and convert explicitly rather than assuming the wire happens to match the CPU.",
          "Structure layout is a compiler artifact — padding and alignment vary — so casting a raw byte buffer to a message struct couples your protocol to one compiler's choices and risks unaligned access faults. Serialize deliberately: explicit field-by-field packing/unpacking, or packed structs accessed through memcpy with the portability cost acknowledged. The strict-aliasing rule adds the final constraint: accessing the same memory as two unrelated types invites the optimizer to reorder your accesses; memcpy is the blessed escape hatch and modern compilers optimize it away.",
        ],
      },
      {
        type: "callout",
        heading: "Undefined behavior is a contract violation, not a wrong answer",
        body: "UB doesn't mean 'gives a garbage value' — it means the compiler was licensed to assume the situation never happens and optimized accordingly. Whole checks get deleted (the classic null test removed because the pointer was already dereferenced), loops become infinite, and the failure appears far from its cause, often only at -O2. Turn on the sanitizers your platform supports, take warnings as errors, and treat every UB category as a real defect.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Hardware-boundary code review",
        items: [
          "volatile on every register and ISR-shared object — and nothing else pretending it's a lock.",
          "Barriers where the core's write buffering meets device ordering requirements; follow the reference manual's idioms.",
          "Fixed-width types, explicit endianness, and deliberate serialization at every binary interface.",
          "Cast narrow operands up before shifting; audit signed/unsigned mixing at comparisons.",
          "Critical sections (or hardware bit-banding/atomic sets where available) around shared read-modify-writes.",
          "Maximum warnings, warnings-as-errors, and static analysis in CI — the compiler is your first reviewer.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What exactly does volatile guarantee?", answer: "Every access in source order at the declared width, relative to other volatile accesses. No atomicity, no ordering with non-volatile operations, no hardware memory barriers." },
          { question: "Why is (a << 8) | b dangerous for uint8_t operands?", answer: "Both promote to int before the shift; on 16-bit ints the shift loses data, and shifting into the sign bit is undefined. Cast to a wide unsigned type first." },
          { question: "Why can't you cast a byte buffer to a message struct?", answer: "Struct padding and alignment are compiler-specific, unaligned access can fault, endianness may differ, and the cast may violate strict aliasing — serialize explicitly instead." },
          { question: "Why do UB bugs appear only at higher optimization levels?", answer: "Optimizers exploit the assumption that UB never happens; at -O0 the naive code often does something plausible, while -O2 deletes checks or reorders based on that license." },
        ],
      },
    ],
    sources: [],
    related: ["interrupts-and-isr-design", "memory-maps-linkers-and-startup", "embedded-software-architecture"],
  },
  {
    slug: "embedded-software-architecture",
    libraryId: "technical",
    collectionId: "software-architecture",
    title: "Embedded software architecture",
    summary: "Layering with one-way dependencies, quarantining vendor HALs, making time and state injectable, choosing a concurrency model, and designing the failure paths.",
    readingTime: 13,
    updatedAt: "Jul 17",
    stage: "Working note",
    blocks: [
      {
        type: "prose",
        heading: "Boundaries should survive hardware change",
        body: [
          "The parts of an embedded system that change fastest — the exact MCU, the sensor vendor, the pin map, the RTOS — are precisely the parts a good architecture quarantines. The layering that works: drivers at the bottom (mechanism: how to talk to this chip), a hardware-abstraction boundary above them (interfaces expressed in the application's vocabulary: temperature in millikelvin, not ADC codes), services in the middle (connectivity, storage, update, telemetry), and application policy on top (what the product actually does). Dependencies point strictly downward, and the top layers name no vendor types.",
          "The vendor HAL deserves particular suspicion. It is convenient, and it leaks: its types spread through function signatures, its blocking assumptions shape your concurrency, and its bugs become your architecture. Wrap it behind your own interfaces at the driver boundary — not to be pure, but so the day the chip shortage forces a new MCU, the port is a driver rewrite instead of a product rewrite, and so tests can compile the top three layers on a laptop without any hardware at all.",
        ],
      },
      {
        type: "prose",
        heading: "Make time and state first-class",
        body: [
          "Time is an input. Code that calls the tick counter directly cannot be tested at interesting instants (rollover, timeout boundaries, leap intervals) and hides its temporal coupling. Inject a clock interface, pass timestamps into logic, and timeouts become testable data. The same for randomness, persistent storage, and I/O — the seams you inject are exactly the places tests can stand.",
          "Mutable state needs a single owner. State shared between contexts breeds the entire concurrency bug taxonomy, and the cheapest fix is structural: one task owns each piece of state, everyone else sends messages. The design question for every state item is 'who may write this, and from which context?' — written down, the answer usually simplifies the system; unwritten, it is answered differently by every author.",
        ],
      },
      {
        type: "table",
        heading: "Concurrency models and their fit",
        columns: ["Model", "Strengths", "Costs", "Fits"],
        rows: [
          ["Superloop + ISRs", "Trivial, deterministic, tiny", "Everything couples to loop period; blocking anywhere stalls all", "Small fixed-function devices"],
          ["Event loop + state machines", "Explicit causality, testable, low RAM", "Long work needs chopping; discipline required", "Mid-complexity, protocol-heavy devices"],
          ["RTOS tasks", "Blocking APIs, priorities, isolation of timing domains", "Stacks, synchronization bugs, scheduling analysis", "Concurrent deadlines, complex peripherals"],
          ["Hybrid (RTOS + event-driven tasks)", "Deadline isolation with legible logic", "Two disciplines to enforce", "Most real products end up here"],
        ],
      },
      {
        type: "prose",
        heading: "Design the failure paths with the happy path",
        body: [
          "Error handling designed last never gets designed. Decide early: which errors are recoverable and how (retry budgets, backoff, reinitialization), which degrade the system (a dead sensor should not kill telemetry), and which demand reset (with evidence preserved for the watchdog note's machinery). Make error propagation uniform — status codes or an error type used everywhere — and make 'ignore the return value' impossible to write silently.",
          "Then design for the debugger you won't have: the architecture should emit its own evidence (state transitions, error counters, resource high-water marks) through the observability layer, because a field failure's first question is always 'what was it doing?' A system whose architecture can answer that from a log dump repays its structure daily.",
        ],
      },
      {
        type: "callout",
        heading: "Testability is the architecture metric that predicts the rest",
        body: "If the application logic compiles and runs on the host with fake drivers, the boundaries are real. If it needs the hardware to run at all, the layers exist only in the diagram — and every future change costs a flash-and-pray cycle instead of a unit test.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Architecture review",
        items: [
          "Draw the layers and verify no upward dependency and no vendor type above the driver boundary.",
          "Confirm application logic builds for the host with injected time, I/O, and storage.",
          "Name the single owner and writing context for every piece of mutable state.",
          "Choose the concurrency model deliberately and write down why.",
          "Define the error taxonomy — recover, degrade, reset — and the propagation convention.",
          "Check that state transitions and failures emit observable evidence by design.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What belongs on each side of the hardware-abstraction boundary?", answer: "Below: how to operate this specific silicon, in its own terms. Above: the application's vocabulary — units, events, capabilities — with no vendor types in any signature." },
          { question: "Why inject time instead of reading the tick directly?", answer: "Timeouts and temporal edge cases become testable data, temporal coupling becomes visible in signatures, and logic runs identically on host and target." },
          { question: "What does single-owner state buy?", answer: "It structurally eliminates data races on that state — synchronization reduces to message passing, and the write-authority question has one auditable answer." },
          { question: "Why design degraded modes explicitly?", answer: "Otherwise failures compose arbitrarily: one dead peripheral cascades through unhandled errors into full outage. Deciding what still works during each failure is product design, not error handling." },
        ],
      },
    ],
    sources: [],
    related: ["state-machines", "observability-for-devices", "rtos-task-scheduling"],
  },
  {
    slug: "state-machines",
    libraryId: "technical",
    collectionId: "software-architecture",
    title: "State machines that stay understandable",
    summary: "Events, guards, transitions, and actions; run-to-completion semantics; implementation patterns in C; hierarchy; and escaping the boolean flag swamp.",
    readingTime: 12,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: [
      {
        type: "prose",
        heading: "When the right response depends on history, model the history",
        body: [
          "A state machine earns its keep the moment identical inputs demand different responses depending on what came before. The vocabulary is small: states are the durable modes the system can occupy; events are the things that happen; guards are conditions that qualify whether a transition fires; actions are the work done on transition (or on entry/exit of a state). Name states as modes — Connected, Charging, Fault — never as actions in progress; a state named 'SendingRequest' is usually an action wearing a state's clothes.",
          "The semantics that keep machines analyzable is run-to-completion: each event is processed fully — guard evaluated, transition taken, actions executed — before the next event is examined. Events arriving meanwhile go in a queue. This serialization is what makes behavior deterministic and reasoning tractable; a machine whose transitions can interrupt each other is concurrency, not a state machine. Decide explicitly which context runs the machine (a task's event loop, typically) and have ISRs post events rather than call handlers.",
          "The alternative to an explicit machine is the flag swamp: a handful of booleans (isConnected, isRetrying, hasTimedOut…) whose 2ⁿ combinations mostly represent impossible states that the code must nonetheless survive. An enum of legal states plus an explicit transition function replaces those combinations with a reviewable list — the impossible states stop existing instead of lurking.",
        ],
      },
      {
        type: "code",
        heading: "Table-driven core",
        intro: "The transition table is data, so review, logging, and even codegen work on it directly. Unlisted event/state pairs land in the explicit default row.",
        language: "C",
        code: "typedef struct {\n    state_t   from;\n    event_t   event;\n    bool    (*guard)(const ctx_t *);   /* NULL = unconditional */\n    state_t   to;\n    void    (*action)(ctx_t *);\n} transition_t;\n\nstatic const transition_t table[] = {\n    { ST_IDLE,    EV_CONNECT,  NULL,        ST_LINKING, act_start_link },\n    { ST_LINKING, EV_LINKED,   NULL,        ST_ONLINE,  act_notify_up  },\n    { ST_LINKING, EV_TIMEOUT,  can_retry,   ST_LINKING, act_retry      },\n    { ST_LINKING, EV_TIMEOUT,  NULL,        ST_FAULT,   act_report     },\n    { ST_ANY,     EV_RESET,    NULL,        ST_IDLE,    act_cleanup    },\n};\n\nvoid fsm_dispatch(ctx_t *c, event_t ev) {\n    for (size_t i = 0; i < ARRAY_LEN(table); i++) {\n        const transition_t *t = &table[i];\n        if ((t->from == c->state || t->from == ST_ANY) && t->event == ev &&\n            (!t->guard || t->guard(c))) {\n            log_transition(c->state, ev, t->to);   /* evidence, always */\n            c->state = t->to;\n            if (t->action) t->action(c);\n            return;\n        }\n    }\n    log_unhandled(c->state, ev);                   /* silence hides bugs */\n}",
      },
      {
        type: "table",
        heading: "Implementation patterns",
        columns: ["Pattern", "Strengths", "Weaknesses"],
        rows: [
          ["Switch on state, switch on event", "Obvious, no infrastructure", "Grows quadratically; transitions scatter"],
          ["Transition table (data-driven)", "Reviewable, loggable, compact", "Guards/actions indirect; table discipline needed"],
          ["State as function pointer", "Fast dispatch, per-state locality", "Whole-machine view harder to see"],
          ["Hierarchical (HSM) framework", "Shared behavior via parent states; scales", "Framework semantics to learn; harder debugging"],
        ],
      },
      {
        type: "prose",
        heading: "Timeouts, errors, and hierarchy",
        body: [
          "Model time as events: entering a state arms its timer, leaving disarms it, expiry posts EV_TIMEOUT like any other event. Timeout behavior becomes visible in the transition table instead of hiding in callback soup. Give every state an answer for the events you hope never arrive — an explicit ignore, an error transition, or a logged unhandled-event default. Fault states deserve first-class design: what enters them, what evidence they record, and which controlled exits exist (retry budgets, operator reset, watchdog escalation).",
          "When many states share responses (every connected sub-state handles EV_DISCONNECT identically), hierarchy earns its complexity: child states inherit parent transitions, entry/exit actions nest, and the machine says common things once. Statechart semantics (UML, QP-style frameworks) formalize this. Below that scale, a flat table with an ST_ANY row covers most sharing at a fraction of the conceptual cost.",
        ],
      },
      {
        type: "callout",
        heading: "Log every transition — it is the cheapest flight recorder you will ever build",
        body: "A ring buffer of (old state, event, new state, timestamp) tuples answers the first question of every field failure: what was it doing and how did it get there? The transition function is one chokepoint through which all behavior flows; instrument it once and the whole system becomes narratable.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "State machine review",
        items: [
          "States are durable modes with mode names; actions live on transitions, not in state names.",
          "One context runs the machine; ISRs and other tasks post events to its queue.",
          "Every state × event pair has a defined outcome, including the explicit-ignore and unhandled defaults.",
          "Timeouts are armed/disarmed by entry/exit and delivered as events.",
          "Transitions are logged with timestamps into retrievable storage.",
          "Fault states record evidence and have designed exits, not just entrances.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What does run-to-completion guarantee?", answer: "Each event is fully processed before the next is examined; concurrent events queue rather than interleave, keeping transition semantics deterministic and analyzable." },
          { question: "Why are boolean flags a state machine smell?", answer: "N flags create 2ⁿ implicit states, most invalid but all reachable by bugs; an explicit state enum plus transition table replaces them with a reviewable list of legal modes." },
          { question: "How should timeouts integrate with a state machine?", answer: "As events: state entry arms a timer, exit disarms it, expiry posts a timeout event handled through the same table as everything else." },
          { question: "When is a hierarchical state machine worth it?", answer: "When groups of states share transitions or entry/exit behavior that a flat machine would duplicate — the parent state expresses the common behavior once." },
        ],
      },
    ],
    sources: [],
    related: ["embedded-software-architecture", "observability-for-devices", "rtos-task-scheduling"],
  },
  {
    slug: "observability-for-devices",
    libraryId: "technical",
    collectionId: "software-architecture",
    title: "Observability for devices",
    summary: "Structured events, counters, crash forensics, transport trade-offs from SWO to fleet telemetry, and designing evidence collection that survives the field.",
    readingTime: 13,
    updatedAt: "Jul 17",
    stage: "Working note",
    blocks: [
      {
        type: "prose",
        heading: "Design the evidence before the failure",
        body: [
          "A device in the field fails with no debugger attached, no reproduction steps, and often no network. Whatever you will know about that failure is whatever the firmware deliberately recorded beforehand. Observability is therefore an architecture activity — deciding which signals exist, where they are stored, and how they escape the device — not a printf sprinkled during debugging and shipped by accident.",
          "Structure beats prose. A log entry that is an event ID plus binary arguments costs a few bytes, survives bandwidth budgets, can be filtered and aggregated by tools, and cannot drift out of sync with the code the way free-text messages do (the decoding table lives in the build artifacts). Reserve human-readable strings for development; ship compact structured events with severity levels, timestamps, and sequence numbers so gaps are detectable.",
          "The highest-value signals are surprisingly few: state-machine transitions (the narrative), error and drop counters (the rare events that vanish from logs), resource high-water marks (stacks, queues, heap — the early warnings), timing violations (deadline misses, watchdog near-misses), and the boot record (reset cause, firmware version, crash evidence). A device that records those five families can explain most of its failures.",
        ],
      },
      {
        type: "table",
        heading: "Signal types and the question each answers",
        columns: ["Signal", "Question answered", "Cost profile"],
        rows: [
          ["Structured event log", "What happened, in what order?", "Bytes per event; ring-buffer RAM"],
          ["Counters", "How often does this rare thing happen?", "One integer each; nearly free"],
          ["Gauges / high-water marks", "How close to the edge do we run?", "One integer each, sampled"],
          ["State-transition trace", "What was it doing when it failed?", "Small tuple per transition"],
          ["Crash dump (fault regs + stacked frame)", "Why exactly did it die?", "Tens of bytes in noinit RAM"],
          ["Heartbeat / uptime", "Is it alive, and did it restart?", "Trivial; catches silent resets"],
        ],
      },
      {
        type: "prose",
        heading: "Transports: match the channel to the phase of life",
        body: [
          "During development, SWO/ITM gives timestamped low-intrusion streams through the debug probe and RTT gives fast bidirectional pipes through RAM — both effectively free while a probe is attached. A UART console remains the universal fallback. None of these exist in the field, so production needs its own paths: a RAM ring buffer that survives reset (noinit section) for the last moments before a crash; flash-resident logs for events that must survive power loss — written with wear awareness (sector budgets, rotation) because log-induced flash wear-out is a real end-of-life mode; and telemetry uplink for fleets, with sampling and prioritization because bandwidth is a budget, not a given.",
          "Retrieval is part of the design: a service command that dumps the buffers, a support workflow that gets those bytes into an issue tracker, and versioned decoding so a year-old device's log still parses. Time-stamping needs a story too — monotonic ticks locally, correlated to wall-clock at sync points, so multi-device timelines can be reconstructed.",
        ],
      },
      {
        type: "prose",
        heading: "Crash forensics closes the loop",
        body: [
          "The fault-handler machinery (stacked PC, fault status registers, active task, health bits) belongs to the watchdog note; observability's job is preserving and shipping it: a noinit crash record guarded by a magic cookie, written by fault handlers and the watchdog path, read and uploaded on the next boot, then cleared. Pair it with a boot counter and a consecutive-crash limiter feeding a safe mode. The metric of maturity: when a field unit misbehaves, does the first support response say 'send the logs' — or 'try turning it off and on'?",
        ],
      },
      {
        type: "callout",
        heading: "Observability that only works over a debug cable is development tooling",
        body: "Every signal needs a production retrieval path — stored where it survives, sized for the medium, and reachable through a service interface or uplink. If evidence cannot leave the device in the field, it does not exist for the failure that matters.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Observability review",
        items: [
          "Define the event schema (IDs, args, severity, timestamps) and generate the decode table from the build.",
          "Count every error path and drop; sample every queue, stack, and heap high-water mark.",
          "Log state transitions into a reset-surviving ring buffer.",
          "Implement the crash record in noinit RAM with cookie, boot counter, and next-boot upload.",
          "Budget flash log writes against endurance for the product's lifetime.",
          "Exercise the full retrieval workflow — from field device to engineer's screen — before launch.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why structured event IDs instead of printf strings?", answer: "Orders-of-magnitude smaller storage and bandwidth, machine-filterable, and the decode table ships with the build so messages can't drift from code — strings stay for development." },
          { question: "Which few signals explain most failures?", answer: "State transitions, error/drop counters, resource high-water marks, timing violations, and the boot record with reset cause and crash evidence." },
          { question: "Why do counters matter when you have logs?", answer: "Rare events age out of ring buffers; a monotonic counter cheaply preserves 'this happened 17 times since boot' regardless of when." },
          { question: "What makes flash logging risky on long-lived devices?", answer: "Endurance: continuous logging can consume erase cycles over years; budgets, rotation, and write batching must be designed against the product lifetime." },
        ],
      },
    ],
    sources: [],
    related: ["embedded-software-architecture", "state-machines", "watchdogs-faults-and-recovery"],
  },
  {
    slug: "smart-notes",
    libraryId: "personal",
    collectionId: "books-reading",
    title: "How to Take Smart Notes",
    summary: "Ahrens on the Zettelkasten method: writing as the medium of thinking, three kinds of notes, elaboration over collection, and structure that emerges from links.",
    readingTime: 10,
    updatedAt: "Jul 17",
    stage: "Working note",
    blocks: [
      {
        type: "prose",
        heading: "Writing is the thinking, not the record of it",
        body: [
          "Ahrens' central claim, borrowed from sociologist Niklas Luhmann and his Zettelkasten (slip-box), is that writing is not what happens after thinking — it is the medium in which thinking happens. Luhmann published roughly seventy books and hundreds of papers not through discipline or genius, he insisted, but because his note system did the heavy lifting: every idea he encountered was rewritten in his own words, connected to existing notes, and thereby became available for future work without depending on memory.",
          "The system distinguishes three kinds of notes with different lifetimes. Fleeting notes capture passing thoughts and are disposable within a day or two — inbox material, not knowledge. Literature notes record, briefly and in your own words, what a source says worth keeping, with the citation. Permanent notes are the product: each states one idea, fully and in your own words, understandable without its original context, written as if for someone else — because in six months, you are someone else.",
        ],
      },
      {
        type: "prose",
        heading: "Elaboration is the test; links are the structure",
        body: [
          "Rewriting an idea in your own words is not clerical work — it is the comprehension test. If you cannot restate it plainly, you have not understood it, and the note-writing surfaces that immediately rather than at the moment of use. This is the same mechanism as the Feynman technique and the reason collecting highlights feels productive while producing nothing: storage is not understanding. Ahrens calls this the collector's fallacy.",
          "Structure is not imposed up front with categories and folders; it emerges from linking. Each new permanent note is connected to the notes it supports, contradicts, or extends, and the surprising connections — a PCB grounding idea linking to an organizational-design idea — are where original work comes from. Topics crystallize bottom-up as clusters of linked notes, and writing projects begin not from a blank page but from an existing network of developed thoughts: the terrifying first draft becomes an assembly and revision task.",
        ],
      },
      {
        type: "table",
        heading: "The three note types",
        columns: ["Type", "Lifetime", "Purpose"],
        rows: [
          ["Fleeting", "Hours to days", "Capture so the thought isn't lost; process into real notes soon"],
          ["Literature", "Permanent, source-bound", "What the source says, briefly, in your words, with citation"],
          ["Permanent", "Permanent, standalone", "One developed idea of your own, linked into the network"],
        ],
      },
      {
        type: "callout",
        heading: "The collector's fallacy",
        body: "Saving is not learning. Highlights, bookmarks, and copied excerpts create a feeling of progress while deferring the actual work — elaboration — indefinitely. A small number of rewritten, linked notes outperforms any volume of collected material, because only the former changed what you understand.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "How this system applies here",
        items: [
          "Every note in this library is written in my own words — no pasted summaries.",
          "One durable claim per note; supporting detail serves that claim.",
          "Related-note links are chosen deliberately: why does this connect?",
          "Review prompts force retrieval, exposing weak understanding before an interview does.",
          "Fleeting captures go through a rewrite step before they earn a page.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What distinguishes a permanent note from a literature note?", answer: "A literature note records what a source says, bound to its citation; a permanent note states one idea of your own, self-contained and understandable without the source, linked into the network." },
          { question: "Why does rewriting in your own words matter?", answer: "It is the comprehension test — failure to restate plainly reveals non-understanding immediately, converting note-taking from storage into learning." },
          { question: "How does structure arise in a Zettelkasten?", answer: "Bottom-up, from links between notes; topics are emergent clusters rather than predefined folders, which lets unexpected connections drive original work." },
        ],
      },
    ],
    sources: [{ title: "How to Take Smart Notes", publisher: "Sönke Ahrens", url: "https://www.soenkeahrens.de/en/takesmartnotes", kind: "Book" }],
    related: ["commonplace-project", "questions-worth-keeping"],
  },
  {
    slug: "design-of-everyday-things",
    libraryId: "personal",
    collectionId: "books-reading",
    title: "The Design of Everyday Things",
    summary: "Norman's vocabulary — affordances, signifiers, mapping, feedback, conceptual models — plus the two gulfs, slips versus mistakes, and why errors are design data.",
    readingTime: 11,
    updatedAt: "Jul 17",
    stage: "Working note",
    blocks: [
      {
        type: "prose",
        heading: "The core vocabulary",
        body: [
          "Norman gives precise names to why objects are usable or infuriating. Affordances are the actions a thing makes possible relative to a user — a flat plate affords pushing, a handle affords grasping. Signifiers are the perceivable cues that communicate those possibilities: the plate itself, a label, a highlight. The famous Norman door — pull handle on a push door — is a signifier contradicting an affordance, and its lesson generalizes: if an object needs an instruction label for a basic action, the design has already failed.",
          "Mapping is the spatial or logical correspondence between controls and effects — stove knobs arranged like the burners need no labels; arranged in a row, they need labels and still cause errors. Constraints (physical, cultural, semantic, logical) productively narrow what can be done at all — the battery that only fits one way beats the warning sticker. Feedback closes the loop: every action needs an immediate, informative response, and its absence breeds the repeated button-press and the double command. Above all sits the conceptual model — the user's internal story of how the thing works, built entirely from what the design exposes. When that story is wrong, every inference the user makes is wrong with it.",
        ],
      },
      {
        type: "prose",
        heading: "The two gulfs and the seven stages",
        body: [
          "Norman frames every interaction as crossing two gulfs. The gulf of execution: I know what I want — how do I do it here? The gulf of evaluation: I did something — what happened, and did it work? His seven-stage action cycle (goal → plan → specify → perform → perceive → interpret → compare) is a diagnostic instrument: usability failures localize to specific stages. Users can't find the action: execution side — add signifiers, improve mapping. Users act correctly but don't trust the result: evaluation side — the feedback is missing or unintelligible.",
          "This framework transfers directly to engineering work. A CLI with undiscoverable flags has an execution gulf; a build system that fails silently has an evaluation gulf; an API whose function names suggest the wrong mental model poisons every call site. Debug interfaces, error messages, and dashboards are all interaction designs, and Norman's stages locate their weaknesses as reliably as they do a door's.",
        ],
      },
      {
        type: "prose",
        heading: "Human error is design data",
        body: [
          "Norman divides errors into slips — right intention, wrong execution, typically caught by attention (typing one character wrong, grabbing the adjacent knob) — and mistakes — wrong intention from a wrong model, invisible to the user because the plan felt correct. They demand different defenses: slips want constraints, confirmation on destructive actions, undo, and distinctive controls; mistakes want better conceptual models, clearer system state, and information at the decision point.",
          "The deeper stance: when many users make the same 'error,' that regularity is a fact about the design, not about the users. Blaming users (or writing 'operator error' in the incident report) ends the investigation exactly where it should begin. Design so the error is impossible (forcing functions, interlocks), or visible immediately, or cheap to reverse — in that order of preference. Firmware engineers live this daily: the API that lets you configure the peripheral in an invalid order, the connector that fits rotated, the register bit that silently does nothing until another bit is set — all Norman doors.",
        ],
      },
      {
        type: "table",
        heading: "Concept → question to ask of any design",
        columns: ["Concept", "The question"],
        rows: [
          ["Affordance", "What actions are physically/logically possible here?"],
          ["Signifier", "How does the user discover them without being told?"],
          ["Mapping", "Does the control's arrangement predict its effect?"],
          ["Constraint", "Can the wrong action be made impossible instead of warned against?"],
          ["Feedback", "How does the user know it worked, within how many milliseconds?"],
          ["Conceptual model", "What story does the interface teach, and is it true?"],
        ],
      },
      {
        type: "callout",
        heading: "Blame the design, not the user — including when the user is you",
        body: "Repeated identical errors are a design signature. This applies to your own tooling: the flash script you keep invoking with the wrong argument, the test fixture that must be connected in an undocumented order. Fix the design; the discipline you're substituting for it will run out on the worst possible day.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Applying it to engineering work",
        items: [
          "Make possible actions discoverable — in UIs, CLIs, APIs, and board connectors alike.",
          "Use natural mappings where they exist; label honestly where they don't.",
          "Give immediate, meaningful feedback for every action, including error paths.",
          "Prefer constraints and forcing functions to warnings and documentation.",
          "Treat recurring user (and developer) errors as design defects to fix, not training gaps.",
          "Check what conceptual model your interface teaches, and whether it matches reality.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Affordance versus signifier?", answer: "An affordance is the action relationship that actually exists between object and user; a signifier is the perceivable cue communicating it. The Norman door has the affordance of pushing but signifies pulling." },
          { question: "What are the two gulfs?", answer: "Execution — bridging from intention to the available actions — and evaluation — bridging from the system's response back to understanding. Usability failures localize to one or the other." },
          { question: "Why do slips and mistakes need different defenses?", answer: "Slips are execution failures under a correct intention — countered by constraints, undo, and confirmation. Mistakes flow from a wrong conceptual model — countered by clearer state, better models, and information at the decision point." },
          { question: "What should repeated identical user errors trigger?", answer: "A design investigation, not user blame — regular error patterns are evidence about the design's signifiers, mappings, or model, and the fix belongs there." },
        ],
      },
    ],
    sources: [{ title: "The Design of Everyday Things", publisher: "Don Norman", url: "https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/", kind: "Book" }],
    related: ["commonplace-project", "engineering-judgment"],
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
  ...onboardProtocolNotes,
  ...networkProtocolNotes,
  ...hostProtocolNotes,
  ...embeddedCoreNotes,
  ...embeddedLifecycleNotes,
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
