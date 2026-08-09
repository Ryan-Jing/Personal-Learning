import type { Note, Source } from "./library";

const ieee1547: Source = {
  title: "IEEE 1547 — Interconnection of Distributed Energy Resources",
  publisher: "IEEE Standards Association",
  url: "https://standards.ieee.org/ieee/1547/5915/",
  kind: "Reference",
};

const ul1741: Source = {
  title: "UL 1741 — Inverters, Converters, and Interconnection Equipment",
  publisher: "UL Standards",
  url: "https://www.shopulstandards.com/ProductDetail.aspx?productId=UL1741",
  kind: "Reference",
};

const wolfspeedWbg: Source = {
  title: "Silicon Carbide (SiC) Power Devices — application resources",
  publisher: "Wolfspeed",
  url: "https://www.wolfspeed.com/products/power/",
  kind: "Documentation",
};

const wurthMagneticsGrid: Source = {
  title: "Trilogy of Magnetics — inductor and transformer loss modeling",
  publisher: "Würth Elektronik",
  url: "https://www.we-online.com/en/support/knowledgebase/trilogy-of-magnetics",
  kind: "Reference",
};

const iec60664: Source = {
  title: "IEC 60664 — Insulation coordination (creepage & clearance)",
  publisher: "International Electrotechnical Commission",
  url: "https://webstore.iec.ch/en/publication/2530",
  kind: "Reference",
};

export const gridConversionNotes: Note[] = [
  {
    slug: "grid-tie-inverters",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "Grid-tie inverters: DC to grid-synchronized AC",
    summary: "The DC-to-grid conversion chain, sinusoidal PWM and inverter topologies, PLL grid synchronization, the safety-critical anti-islanding requirement, and power-quality limits and smart-inverter grid-support functions.",
    readingTime: 19,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The conversion chain from panel to grid",
        body: [
          "Getting solar energy onto the grid is a chain of stages, each with a clear job: the panel produces DC; an MPPT DC/DC stage holds the panel at its maximum power point and raises the voltage onto a DC bus; the inverter converts that DC bus into AC; and an output filter cleans the AC before it meets the grid at 50 Hz. Written out, it is PV (DC) → MPPT DC/DC → DC bus → inverter (DC/AC) → LC/LCL filter → grid. Each stage can be reasoned about with power-electronics fundamentals, and the inverter is where the DC-side world meets the tightly regulated, safety-critical AC grid.",
          "The inverter's core task is to synthesise a clean 50 Hz sinusoid from a DC source and, crucially, to keep it locked to the grid in voltage, frequency, and phase while controlling how much real (and reactive) power it injects. Everything hard about grid-tie inverters — the modulation, the synchronisation, the protection — flows from that requirement to make a controllable AC current source that behaves itself on a shared network.",
        ],
      },
      {
        type: "prose",
        heading: "Building a sine wave with PWM",
        body: [
          "An inverter has only switches and a DC bus, so it makes a sine wave by chopping. Sinusoidal PWM (SPWM) compares a low-frequency sine reference at the desired output (50 Hz) against a high-frequency triangular carrier; the crossings set when the switches turn on and off, so the switch duty cycle traces out the sine over each cycle. The output is a train of full-amplitude pulses whose average follows the sine, and an LC or LCL low-pass filter removes the high switching-frequency ripple, leaving the smooth 50 Hz fundamental. The modulation index sets how much of the DC bus becomes AC amplitude; three-phase inverters use techniques like third-harmonic injection or space-vector PWM to squeeze more fundamental amplitude out of the same bus. This is ordinary PWM and gate-drive practice applied at grid scale — the same switching, filtering, and dead-time concerns as any converter, just at higher voltage and with a grid on the output.",
          "The switching topology scales with power. A single-phase inverter is typically an H-bridge; three-phase uses a two-level six-switch bridge. At utility voltage and power, multilevel topologies — neutral-point-clamped (NPC), T-type, or cascaded H-bridge — build the output from several voltage steps rather than two, which lowers the harmonic content and shrinks the output filter at the cost of more switches and more complex control. More levels means a cleaner waveform and smaller passives, which is why utility-scale inverters are usually multilevel.",
        ],
      },
      {
        type: "formula",
        heading: "SPWM fundamental output",
        formula: "v_out(fundamental) ≈ m · (V_dc / 2)      for m ≤ 1 (linear region)",
        explanation: "In sinusoidal PWM the amplitude of the fundamental output voltage is the modulation index m times half the DC-bus voltage, as long as m stays at or below 1 (the linear modulation region). Push m above 1 (overmodulation) and you get more fundamental amplitude but at the price of low-order harmonics that the filter cannot easily remove. This relationship is why the DC-bus voltage must sit comfortably above the peak of the AC waveform you want to synthesise, and it ties the inverter's design straight back to the DC bus that the MPPT stage produces.",
        terms: [
          { symbol: "m", meaning: "Modulation index (reference/carrier ratio)", unit: "0–1 linear" },
          { symbol: "V_dc", meaning: "DC-bus voltage", unit: "V" },
          { symbol: "v_out", meaning: "Fundamental output voltage amplitude", unit: "V" },
        ],
      },
      {
        type: "prose",
        heading: "Locking to the grid with a PLL",
        body: [
          "An inverter cannot simply produce its own 50 Hz and connect — it must match the grid's instantaneous phase and frequency, or the mismatch would drive enormous currents and could damage equipment. A phase-locked loop measures the grid voltage and continuously tracks its phase and frequency, providing the reference angle the inverter's current controller uses to align its output. With the grid angle known, a current control loop (often implemented in a rotating dq reference frame so the sinusoidal quantities become DC-like and easy to regulate) sets the magnitude and phase of the injected current, and that phase relative to the grid voltage is what determines the split between real and reactive power delivered. Getting the PLL right is both a performance and a safety matter: it must track the grid faithfully through normal variation yet not be fooled during a disturbance.",
          "This synchronisation is exactly what makes a conventional grid-tie inverter 'grid-following' — it rides on a grid voltage that something else establishes. That dependence is also the seed of the islanding hazard: if the grid it is following disappears but a local load happens to keep the voltage looking normal, the inverter may not immediately notice it is now energising a dead network by itself.",
        ],
      },
      {
        type: "prose",
        heading: "Anti-islanding: the safety mandate",
        body: [
          "Islanding is the dangerous condition where an inverter keeps energising a section of the grid after the utility supply has been disconnected — during an outage, a fault, or maintenance. An energised 'island' can electrocute line workers who reasonably believe the line is dead, and it can violently damage equipment when the utility reconnects out of phase. Anti-islanding is the mandatory function that detects loss of the grid and forces the inverter to disconnect within a specified time. Detection uses passive methods (tripping on out-of-range voltage or frequency, or on rate-of-change of frequency) and active methods (continuously injecting a small perturbation into frequency or measuring the grid impedance and watching the response — when the stiff grid is present the perturbation is absorbed, but once it is gone the perturbation runs away and reveals the island). Every grid-tie standard requires it — G98 and G99 in the UK, IEEE 1547 and UL 1741 internationally — and each defines the trip thresholds and timing.",
          "For a grid-connected consumer product this is not optional and not obscure: naming anti-islanding as a first-class requirement, and explaining that a plug-in solar device must stop back-feeding a dead line to protect the people working on it, is a direct signal of safety awareness. The concept of a non-detection zone — the narrow combination of local load and generation where passive methods can be blind, which is why active methods exist — is the deeper detail behind why these schemes are engineered so carefully.",
        ],
      },
      {
        type: "prose",
        heading: "Power quality and smart-inverter grid support",
        body: [
          "A grid-tie inverter must be a good citizen electrically. Its output current has to be a clean sinusoid, so standards cap the total harmonic distortion (typically below 5% current THD), limit any DC injection, and constrain flicker; poor switching or an inadequate filter injects harmonics that heat transformers and motors and distort the shared voltage. Beyond passively behaving, modern 'smart' inverters are increasingly required to actively support the grid. Volt-VAR control supplies or absorbs reactive power to help regulate local voltage; volt-watt curtails real power when voltage runs high; frequency-watt reduces (or increases) output in response to frequency, providing fast frequency response; and fault ride-through requires the inverter to stay connected through brief voltage or frequency disturbances rather than all tripping at once — because a wave of inverters disconnecting simultaneously would itself destabilise the grid.",
          "These functions turn the inverter from a passive power source into an active participant in grid stability, which is exactly the direction the whole system is moving as inverter-based resources grow. They connect directly to the earlier ideas: the reactive-power control of the power triangle, the frequency response that substitutes for vanishing inertia, and the grid-forming behaviour that lets inverters help hold the grid up rather than merely feed into it.",
        ],
      },
      {
        type: "callout",
        heading: "Anti-islanding is non-negotiable",
        body: "A grid-tie inverter must detect loss of the utility and stop energising the line within a mandated time, or it risks electrocuting line workers and damaging equipment on reconnection. Passive trips (voltage/frequency/RoCoF) plus active perturbation methods cover the non-detection zone. Every connection standard (G98/G99, IEEE 1547, UL 1741) requires it — for a plug-in solar product, it is the first safety feature to name.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Grid-tie inverter review",
        items: [
          "Lay out the chain: PV → MPPT DC/DC → DC bus → inverter → LCL filter → grid.",
          "Synthesize the sine with SPWM; size the DC bus above the AC peak (v_out ≈ m·V_dc/2).",
          "Choose topology by power: H-bridge, three-phase two-level, or multilevel for utility scale.",
          "Synchronize with a PLL and regulate injected current (often in dq) to set real and reactive power.",
          "Implement anti-islanding (passive + active) to the applicable standard and its trip timing.",
          "Meet power-quality limits (THD <5%, DC injection) and implement required smart-inverter functions.",
          "Provide grid support: volt-VAR, volt-watt, frequency-watt, and fault ride-through where mandated.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How does an inverter synthesize a grid sine wave?", answer: "Sinusoidal PWM compares a 50 Hz sine reference to a high-frequency triangle carrier so the switch duty cycle traces the sine; an LC/LCL filter removes the switching ripple, leaving the fundamental. The fundamental amplitude is ≈ m·V_dc/2 in the linear region." },
          { question: "Why does a grid-tie inverter need a PLL?", answer: "It must match the grid's instantaneous phase and frequency before and while connecting, or the mismatch drives huge currents. A phase-locked loop tracks the grid angle so the current controller aligns the injected current and sets real/reactive power." },
          { question: "What is anti-islanding and why is it mandatory?", answer: "Islanding is an inverter continuing to energise a disconnected grid section, endangering line workers and risking damage on reconnection. Anti-islanding detects grid loss (passive voltage/frequency/RoCoF trips plus active perturbation) and disconnects within a mandated time; every grid-tie standard requires it." },
          { question: "What are smart-inverter grid-support functions?", answer: "Volt-VAR (reactive support for voltage), volt-watt (curtail on high voltage), frequency-watt (adjust output with frequency for fast frequency response), and fault ride-through (stay connected through brief disturbances instead of all tripping). They make the inverter actively support grid stability." },
        ],
      },
    ],
    sources: [ieee1547, ul1741],
    related: ["pv-system-topologies-and-array-wiring", "grid-stability-and-inverter-based-resources", "ac-power-real-reactive-apparent", "power-electronics-loss-and-magnetics"],
  },
  {
    slug: "battery-storage-for-solar-and-grid",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "Battery storage for solar & grid",
    summary: "Why LFP dominates stationary storage, the SoC/SoH/DoD/C-rate vocabulary, what a BMS does and why lithium needs one, AC- vs DC-coupled architectures, and round-trip efficiency.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Storage shifts energy in time and supports the grid",
        body: [
          "A battery lets a solar system decouple when energy is generated from when it is used: surplus midday generation is stored and released in the evening peak, backup power is available during an outage, and the system can offer grid services like frequency response and peak shaving. In a high-renewable grid, storage is the flexible resource that fills the gap left by variable generation and vanishing inertia, which is why battery products sit alongside solar in distributed energy systems. Understanding storage means understanding its chemistry, its state variables, the management electronics that keep it safe, and how it connects to the rest of the system.",
        ],
      },
      {
        type: "prose",
        heading: "Chemistry: why LFP dominates stationary storage",
        body: [
          "Among lithium-ion chemistries, lithium iron phosphate (LFP, LiFePO₄) has become the default for stationary and home storage, and the reasons are practical. Its cathode is chemically very stable, so in an over-temperature or fault condition it does not release oxygen and cascade the way higher-energy nickel-manganese-cobalt (NMC) chemistries can — a decisive safety advantage for a battery bolted to a wall inside a home. LFP also offers long cycle life (often several thousand cycles) and a flat discharge voltage curve, at the cost of lower energy density. That lower density matters little for a fixed installation where weight and volume are not at a premium, whereas NMC and NCA, with their higher energy density, are preferred where every kilogram counts, as in electric vehicles. Legacy lead-acid still appears in low-cost systems, and flow batteries and sodium-ion are emerging for long-duration stationary storage — but for home and small-commercial energy products, LFP is the current answer, chosen first for safety and longevity.",
        ],
      },
      {
        type: "table",
        heading: "The storage vocabulary",
        columns: ["Term", "Meaning", "Why it matters"],
        rows: [
          ["Capacity", "Charge (Ah) or energy (kWh) the pack holds", "Sizes runtime and backup duration"],
          ["SoC — State of Charge", "Present charge as % of capacity", "The 'fuel gauge'; drives dispatch decisions"],
          ["SoH — State of Health", "Capacity/impedance vs when new", "Tracks ageing and warranty end-of-life"],
          ["DoD — Depth of Discharge", "How deeply a cycle drains the pack", "Deeper cycles usually shorten cycle life"],
          ["C-rate", "Current relative to capacity (1C = full in 1 h)", "Sets power capability, heating, and losses"],
        ],
      },
      {
        type: "prose",
        heading: "The BMS keeps lithium safe",
        body: [
          "A lithium battery is an assembly of series and parallel cells that must be actively managed, and the battery management system (BMS) is what makes it safe and usable. Its jobs are cell balancing (equalising the charge of series cells, since the weakest cell otherwise limits the whole pack and can be over-stressed), protection against over-voltage, under-voltage, over-current, and over- and under-temperature (any of which can damage cells or, in the worst case, start thermal runaway), and state estimation — computing SoC and SoH from a combination of coulomb counting (integrating current over time) and voltage or open-circuit-voltage measurements, often refined with model-based estimators like Kalman filtering because current integration alone drifts. The BMS also controls the pack contactors and executes a safe shutdown on any fault.",
          "The reason this is non-negotiable is that lithium cells fail dangerously if abused — overcharged, over-discharged, over-heated, or driven at excessive current. The BMS is the safety system standing between normal operation and a fire, and any credible battery product treats it as a fail-safe function, not a convenience. This is the same discipline as any safety-critical embedded controller: bounded operation, protection that cannot be bypassed, and defined behaviour under every fault.",
        ],
      },
      {
        type: "prose",
        heading: "AC- vs DC-coupled storage, and round-trip efficiency",
        body: [
          "There are two ways to connect storage to a solar system. In a DC-coupled design the battery shares the solar DC bus through a bidirectional DC/DC converter, so PV energy can charge the battery with a single conversion and one inverter serves both — which is more efficient for self-consumption and is natural for new installations designed around it. In an AC-coupled design the battery has its own inverter and connects on the AC side, independent of the solar inverter; this is easier to retrofit onto an existing PV system and more flexible in siting, but it adds a conversion step (DC-to-AC and back) that slightly lowers efficiency. Choosing between them is a real system trade-off between efficiency and integration on one hand and retrofit flexibility on the other.",
          "Round-trip efficiency measures how much energy you get back out relative to what you put in — accounting for the battery's own losses and every conversion stage — and for lithium systems it is typically 85–95%. It depends on the C-rate (higher currents mean more I²R loss) and temperature, and it is the number that determines how much of stored solar energy actually reaches the evening load. Combined with the earlier grid-stability picture, a well-managed battery is also a fast-responding grid resource: it can provide synthetic inertia and fast frequency response through a grid-forming inverter, turning stored energy into stability services as well as time-shifted power.",
        ],
      },
      {
        type: "formula",
        heading: "C-rate, coulomb counting, and round-trip efficiency",
        formula: "I = C_rate · Q      SoC(t) = SoC₀ + (1/Q)·∫ I dt      η_rt = E_out / E_in",
        explanation: "C-rate expresses current relative to capacity Q, so a 1C rate on a 10 Ah pack is 10 A (full charge or discharge in one hour) and 0.5C is 5 A. Coulomb counting estimates state of charge by integrating current over time from a known starting point — simple but prone to drift, which is why the BMS corrects it with voltage measurements. Round-trip efficiency is energy out divided by energy in over a full charge/discharge, capturing the battery's internal losses plus every conversion stage.",
        terms: [
          { symbol: "Q", meaning: "Cell/pack capacity", unit: "Ah" },
          { symbol: "SoC", meaning: "State of charge", unit: "% or fraction" },
          { symbol: "η_rt", meaning: "Round-trip efficiency", unit: "0–1" },
        ],
      },
      {
        type: "callout",
        heading: "LFP for safety and life; the BMS keeps it safe",
        body: "Lithium iron phosphate is the stationary-storage default because it resists thermal runaway and lasts thousands of cycles, trading energy density that a wall-mounted pack does not need. Whatever the chemistry, the BMS — balancing, protection, and SoC/SoH estimation — is the fail-safe system standing between normal operation and a fire, and must be treated as safety-critical.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Storage review",
        items: [
          "Choose chemistry by application: LFP for safe, long-life stationary; NMC/NCA where density rules.",
          "Track SoC, SoH, DoD, and C-rate; relate DoD and C-rate to cycle life and losses.",
          "Treat the BMS as safety-critical: balancing, over/under-voltage, current, and temperature protection.",
          "Estimate SoC with coulomb counting corrected by voltage/OCV (and model-based filtering).",
          "Choose AC- vs DC-coupling by efficiency/self-consumption vs retrofit flexibility.",
          "Budget round-trip efficiency (85–95% for lithium) including all conversion stages.",
          "Consider grid services: fast frequency response and grid-forming support from storage.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does LFP dominate home and stationary storage?", answer: "Its stable cathode resists thermal runaway (no oxygen release like NMC), it offers long cycle life and a flat discharge curve, and its lower energy density barely matters for a fixed wall-mounted pack. Safety and longevity win where weight doesn't." },
          { question: "Define SoC, SoH, DoD, and C-rate.", answer: "SoC is present charge as a % of capacity (the fuel gauge); SoH is capacity/impedance relative to new (ageing); DoD is how deeply a cycle drains the pack (deeper usually shortens life); C-rate is current relative to capacity (1C = full charge/discharge in one hour)." },
          { question: "What does a BMS do and why is it essential?", answer: "Cell balancing, protection against over/under-voltage, over-current, and over/under-temperature, and SoC/SoH estimation (coulomb counting plus voltage). Lithium cells fail dangerously if abused, so the BMS is a fail-safe, non-bypassable safety system." },
          { question: "AC- vs DC-coupled storage?", answer: "DC-coupled shares the solar DC bus via a bidirectional DC/DC — one inverter, higher efficiency for self-consumption, best for new builds. AC-coupled has its own battery inverter — easier to retrofit and more flexible, but an extra conversion lowers efficiency." },
        ],
      },
    ],
    sources: [ieee1547],
    related: ["grid-tie-inverters", "grid-stability-and-inverter-based-resources", "power-supplies-and-regulation", "watchdogs-faults-and-recovery"],
  },
  {
    slug: "power-electronics-loss-and-magnetics",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "Power conversion at scale: losses, WBG & magnetics",
    summary: "The switching-vs-conduction loss trade and why switching frequency is the master lever, wide-bandgap SiC and GaN devices, core and copper loss in magnetics, EMI from fast edges, and creepage/clearance at mains voltages.",
    readingTime: 18,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Switching frequency is the master trade-off",
        body: [
          "Every switching power converter — a solar MPPT stage, a grid-tie inverter, a battery converter — lives inside one dominant trade-off, and reasoning about it out loud is a core power-electronics skill. Losses in the switches split into two kinds. Conduction loss is the power burned while a device is fully on, roughly I²·R_ds(on) for a MOSFET or V_ce(sat)·I for an IGBT; it scales with load current and does not care about switching frequency. Switching loss is the energy dissipated during each transition, when voltage and current overlap briefly as the device turns on and off, and it is paid once per switching event — so it rises directly with switching frequency. Raising the switching frequency shrinks the inductors, transformers, and filter capacitors (they process smaller volt-seconds and charge packets per cycle) and improves control bandwidth, but it increases switching loss and generates more high-frequency EMI. That tension — higher frequency buys smaller, faster passives at the cost of switching loss and noise — is the decision at the heart of every converter design.",
        ],
      },
      {
        type: "formula",
        heading: "Conduction and switching loss",
        formula: "P_cond ≈ I²·R_ds(on)   (or V_ce·I)      P_sw ≈ ½·V·I·(t_on + t_off)·f_sw",
        explanation: "Conduction loss depends on the current and the device's on-resistance (or saturation voltage) and is independent of switching frequency. Switching loss is the energy lost in each voltage-current overlap transition multiplied by how often it happens, so it grows linearly with switching frequency and with the transition times. This is why fast-switching devices (shorter t_on/t_off) and higher-loss-tolerant designs matter: at high frequency the switching term dominates, and reducing transition time — or moving to a device technology with less switching energy — is what lets frequency rise without efficiency collapsing.",
        terms: [
          { symbol: "R_ds(on)", meaning: "On-resistance (MOSFET conduction)", unit: "Ω" },
          { symbol: "t_on + t_off", meaning: "Switching transition times", unit: "s" },
          { symbol: "f_sw", meaning: "Switching frequency", unit: "Hz" },
        ],
      },
      {
        type: "prose",
        heading: "Wide-bandgap devices: SiC and GaN",
        body: [
          "Wide-bandgap (WBG) semiconductors are shifting the whole trade-off, which is why they are increasingly standard in solar and grid power electronics. Their wider bandgap gives a much higher critical electric field than silicon, so a device can block the same voltage with a thinner, more lightly doped drift region — which means lower on-resistance at high voltage and much faster switching with less loss, plus higher-temperature operation. Silicon carbide (SiC) excels at higher voltages and powers (roughly 650 V to 1700 V and beyond) and is displacing silicon IGBTs in string and central inverters, where its low losses and high-temperature capability raise efficiency and let the magnetics shrink. Gallium nitride (GaN), a lateral high-electron-mobility device, switches extremely fast at lower voltages (up to about 650 V) with very little charge, making it the choice for high-frequency, lower-voltage stages like microinverters and chargers.",
          "The payoff of WBG is concrete: because switching loss is lower and devices switch faster, the converter can run at a higher frequency for the same efficiency, and the higher frequency shrinks the inductors, transformers, and filters — so WBG buys smaller, lighter, more efficient, higher-power-density converters. The catch is that the same fast edges that reduce switching loss also produce steeper dV/dt and dI/dt, making EMI and layout parasitics harder to manage; WBG trades some EMI headache for its efficiency and density, which the layout has to earn back.",
        ],
      },
      {
        type: "prose",
        heading: "Magnetics: where the size and much of the loss live",
        body: [
          "Inductors and transformers store and transfer energy in converters, and modelling their loss is a design task in its own right. Magnetic loss has two parts. Core loss comes from the magnetic material cycling its flux — hysteresis loss (energy per B-H loop) plus eddy-current loss in the core — and it rises steeply with both switching frequency and flux swing, captured empirically by the Steinmetz relation P_core ≈ k·f^α·B^β. Copper (winding) loss is the I²R of the windings, but at high frequency it is worse than the DC resistance suggests because skin effect and proximity effect crowd the current into part of the conductor, raising the effective AC resistance. The two losses pull against the frequency trade: raising switching frequency lets a smaller core carry the required volt-seconds (shrinking the magnetics), but it increases core loss per unit volume, so there is an optimum where size and loss balance.",
          "Core material choice is central. Ferrite has high resistivity and low eddy-current loss, making it the standard for high-frequency switching magnetics, though it saturates at a modest flux density (around 0.3–0.5 T). Powdered-iron and composite cores (sendust, high-flux) saturate softly and store more energy but are lossier at high frequency. Silicon steel, amorphous, and nanocrystalline cores serve line-frequency transformers and common-mode chokes where high permeability matters. Designers also introduce an air gap to store energy and prevent saturation in inductors. Being able to discuss how switching frequency drives core size down but core loss up, and how material selection follows the frequency and flux, is exactly the loss-modelling reasoning that power-conversion design demands.",
        ],
      },
      {
        type: "table",
        heading: "Silicon vs wide-bandgap devices",
        columns: ["Device", "Voltage range", "Strength", "Typical use"],
        rows: [
          ["Si MOSFET", "Low–mid voltage", "Cheap, mature, low conduction loss at low V", "Low-voltage DC/DC, LV inverters"],
          ["Si IGBT", "High voltage/current", "Rugged at high V/I", "Legacy inverters; tail current limits f_sw"],
          ["SiC MOSFET", "~650 V – 1700 V+", "Low loss, fast, high temperature, high voltage", "String/central solar inverters, EV traction"],
          ["GaN HEMT", "≤ ~650 V", "Very fast, very low charge, high f_sw", "Microinverters, chargers, high-density DC/DC"],
        ],
      },
      {
        type: "prose",
        heading: "EMI and safety spacing at power scale",
        body: [
          "Fast switching is the origin of EMI in power electronics: the high dV/dt on a switch node drives common-mode currents through parasitic capacitances (for example to a grounded heatsink), and the high dI/dt in the power loop rings against loop inductance, producing overshoot and radiated noise. The mitigations are the same family used throughout the EMI notes, applied at power scale: minimise the power-loop area and parasitic inductance with tight layout, add snubbers to damp switch-node ringing, tune the gate resistor to slow the edges (which trades EMI against switching loss — a direct, quantifiable trade), filter the input and output with common-mode chokes and X/Y capacitors, shield where necessary, and separate the conducted and radiated emission paths when diagnosing. WBG devices' faster edges make all of this more demanding, which is the price of their efficiency.",
          "At grid voltages a further, purely physical constraint appears: creepage and clearance. Clearance is the shortest distance through air between two conductors, and creepage is the shortest distance along a surface; both must be large enough that the working voltage cannot arc across the air or track across the board surface. These minimum spacings are safety-regulated (IEC 60664 and related standards) and depend on the working voltage, the pollution degree of the environment, and the insulating material group, with reinforced insulation required where a barrier separates hazardous voltage from a person. This is a real design constraint that separates mains-connected and high-voltage board design from low-voltage work — you cannot simply route two high-voltage nodes close together the way you would on a 3.3 V board — and naming it shows awareness of the safety dimension of power electronics.",
        ],
      },
      {
        type: "callout",
        heading: "Frequency up shrinks passives but costs loss and EMI",
        body: "Raising switching frequency reduces the size of inductors, transformers, and filters but increases switching loss and high-frequency EMI, and it raises core loss even as it lets the core shrink. Wide-bandgap SiC and GaN shift the optimum by switching faster with less loss — at the cost of steeper edges that make EMI and layout harder. And at mains voltage, creepage and clearance impose spacing you cannot design around.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Power-conversion loss & magnetics review",
        items: [
          "Separate conduction loss (I²R, frequency-independent) from switching loss (rises with f_sw).",
          "Treat switching frequency as the master trade: smaller passives vs more switching loss and EMI.",
          "Consider SiC for higher-voltage/power stages and GaN for high-frequency lower-voltage stages.",
          "Model magnetics loss as core loss (Steinmetz, f and B dependent) plus copper loss (with skin/proximity).",
          "Select core material by frequency and flux (ferrite for HF; powdered iron/steel elsewhere); gap for energy storage.",
          "Control EMI from fast edges: tight loops, snubbers, gate-resistor tuning, input/output filtering, shielding.",
          "Meet creepage and clearance requirements (IEC 60664) for the working voltage and pollution degree.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What is the core switching-frequency trade-off?", answer: "Higher f_sw shrinks inductors, transformers, and filters and improves control bandwidth, but increases switching loss (paid per transition) and high-frequency EMI, and raises core loss per unit volume. Conduction loss (I²R) is independent of frequency." },
          { question: "Why do SiC and GaN matter?", answer: "Their wide bandgap allows a thinner drift region, giving lower on-resistance at high voltage, much faster/lower-loss switching, and higher-temperature operation. SiC suits higher-voltage/power inverters, GaN suits high-frequency lower-voltage stages — both enabling smaller passives and higher efficiency, at the cost of harder EMI." },
          { question: "What are the two components of magnetics loss?", answer: "Core loss — hysteresis plus eddy currents, rising with frequency and flux swing (Steinmetz P ≈ k·f^α·B^β) — and copper loss — winding I²R, worsened at high frequency by skin and proximity effects. Higher frequency shrinks the core but raises core loss per volume." },
          { question: "What are creepage and clearance, and why do they matter?", answer: "Clearance is the shortest air gap and creepage the shortest surface path between conductors; both must be large enough to prevent arcing or surface tracking at the working voltage. They're safety-regulated (IEC 60664) by voltage, pollution degree, and material — a hard constraint unique to mains/high-voltage design." },
        ],
      },
    ],
    sources: [wolfspeedWbg, wurthMagneticsGrid, iec60664],
    related: ["grid-tie-inverters", "buck-converter-first-principles", "emi-filtering-and-mitigation", "high-voltage-pcb-design", "power-and-energy"],
  },
];
