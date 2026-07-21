import type { Note, Source } from "./library";

const tiBuckPowerStage: Source = {
  title: "Basic Calculation of a Buck Converter's Power Stage (SLVA477)",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/an/slva477b/slva477b.pdf",
  kind: "Documentation",
};

const tiPoeIntro: Source = {
  title: "An Introduction to Power over Ethernet",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/power-management/power-over-ethernet-poe/overview.html",
  kind: "Reference",
};

const adLdoVsSwitcher: Source = {
  title: "Low-Dropout Regulators — PSRR and Noise",
  publisher: "Analog Devices",
  url: "https://www.analog.com/en/resources/technical-articles/ldo-psrr-measurement-simplified.html",
  kind: "Reference",
};

const ieee8023bt: Source = {
  title: "IEEE 802.3bt — Power over Ethernet (Type 3/4)",
  publisher: "IEEE Standards Association",
  url: "https://standards.ieee.org/ieee/802.3bt/6749/",
  kind: "Reference",
};

export const interviewPowerNotes: Note[] = [
  {
    slug: "buck-converter-first-principles",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Buck converter from first principles",
    summary: "Deriving D = Vout/Vin from volt-second balance, sizing the inductor from ripple current, output-cap ripple, CCM vs DCM, and synchronous vs asynchronous topologies.",
    readingTime: 18,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A buck converter is a switch plus an averaging filter",
        body: [
          "Strip a buck converter to its essence and there are only two moving parts of theory: a switch that chops the input voltage into a square wave, and an LC low-pass filter that averages that square wave into a smooth, lower DC output. Everything else — the control loop, the synchronous rectifier, the compensation network — exists to make that averaging accurate and efficient. If you can reconstruct the converter from those two ideas at a whiteboard, you can answer almost any question asked about it.",
          "Trace the two states. When the high-side switch is on for a fraction D of each switching period, the switch node is connected to the input, so the inductor sees roughly Vin on its left and Vout on its right — a positive voltage (Vin − Vout) across it that ramps its current up, delivering energy to the output and storing energy in the magnetic field. When the switch turns off, the inductor current cannot stop instantly, so it forces the switch node negative until the freewheel path (a diode, or a synchronous low-side MOSFET) conducts; now the inductor sees roughly (−Vout) across it and its current ramps back down. The switch node is therefore a square wave swinging between ~Vin and ~0, and the LC filter — whose corner frequency is set far below the switching frequency — passes only the DC average and rejects the switching harmonics.",
          "That is the whole mental model: the output voltage is the average of a square wave that is at Vin for a fraction D of the time and at zero the rest. Its average is D·Vin. The inductor and capacitor turn 'average' from an abstraction into a real, low-ripple DC rail.",
        ],
      },
      {
        type: "formula",
        heading: "Volt-second balance gives the conversion ratio",
        formula: "(V_in − V_out)·D·T_s = V_out·(1 − D)·T_s   ⟹   D = V_out / V_in",
        explanation: "The one law that anchors every switching converter: in steady state the average voltage across the inductor over a full switching period must be zero. If it were not, the inductor current (whose slope is V_L/L) would ramp a little higher every cycle without bound — steady state forbids that. So the volt-seconds applied during the on-time must exactly cancel the volt-seconds during the off-time. During the on-time (length D·T_s) the inductor sees (V_in − V_out); during the off-time it sees (−V_out). Setting the two areas equal and cancelling T_s gives the ideal continuous-conduction duty cycle D = V_out/V_in. The mirror-image law — average capacitor current is zero in steady state — says the inductor's average current equals the load current.",
        terms: [
          { symbol: "D", meaning: "Duty cycle of the high-side (control) switch", unit: "0–1" },
          { symbol: "T_s", meaning: "Switching period = 1/f_sw", unit: "s" },
          { symbol: "V_in / V_out", meaning: "Input and output voltage", unit: "V" },
        ],
      },
      {
        type: "prose",
        heading: "Why the ideal ratio is only the starting point",
        body: [
          "D = Vout/Vin is the lossless ideal. Real duty cycle runs slightly higher because every element steals volt-seconds: the high-side switch drops I·Rds(on), the freewheel element drops a diode forward voltage or its own I·Rds(on), the inductor's DC resistance (DCR) drops I·DCR, and dead time (the deliberate gap where neither switch conducts) lets the body diode conduct at a higher drop. For a 12 V → 3.3 V rail the ideal D is 0.275, but a real converter might command 0.30 to make up the losses. This matters at the extremes: a low-dropout buck (Vout close to Vin) can hit a maximum-duty or minimum-off-time limit and stop regulating, while a huge step-down (48 V → 1 V, D ≈ 0.02) runs a very short on-time that stresses the controller's minimum-on-time and the high-side gate drive.",
          "The duty cycle also exposes where the current stress lives. On the input side, the current is pulsed — full inductor current flows from the input only during the on-time — so the input capacitor must supply the difference and carries a large RMS ripple current, worst at D = 0.5 where the pulse is 'squarest.' On the output side, the inductor delivers current continuously, so the output capacitor only has to absorb the triangular ripple, not the whole load. This asymmetry is why a buck's input cap is often the harder-working part and why its placement dominates EMI.",
        ],
      },
      {
        type: "formula",
        heading: "Inductor ripple current and sizing",
        formula: "ΔI_L = V_out·(1 − D) / (L·f_sw) = (V_in − V_out)·D / (L·f_sw)     L = V_out·(1 − D) / (ΔI_L·f_sw)",
        explanation: "The inductor current is a triangle riding on the DC load current; its peak-to-peak height ΔI_L is set by the volt-seconds during the off-time divided by inductance. Both forms are equal because of volt-second balance. Design practice picks ΔI_L as 20–40% of the maximum load current: too little ripple demands a large, high-DCR, physically big inductor and slows transient response; too much ripple stresses the output capacitor's RMS rating, raises core loss, and pushes the peak current toward saturation. Rearranging for L gives the inductance that hits the chosen ripple. The peak the inductor must survive without saturating is I_pk = I_out + ΔI_L/2 — check it against the inductor's hot saturation current, which is lower than the room-temperature spec.",
        terms: [
          { symbol: "ΔI_L", meaning: "Peak-to-peak inductor ripple current", unit: "A" },
          { symbol: "L", meaning: "Inductance", unit: "H" },
          { symbol: "f_sw", meaning: "Switching frequency", unit: "Hz" },
        ],
      },
      {
        type: "prose",
        heading: "A worked sizing example you can redo on paper",
        body: [
          "Take Vin = 12 V, Vout = 3.3 V, Iout = 3 A, fsw = 500 kHz, target ripple 30% of load (ΔI_L = 0.9 A). Ideal duty D = 3.3/12 = 0.275. Inductance L = Vout·(1 − D)/(ΔI_L·fsw) = 3.3 × 0.725 / (0.9 × 500 000) = 2.39 / 450 000 ≈ 5.3 µH, so pick a standard 4.7 µH or 6.8 µH part and recompute the actual ripple. Peak inductor current I_pk = 3 + 0.45 = 3.45 A, so choose an inductor whose saturation current is comfortably above ~4.5 A at operating temperature, with margin for load transients that momentarily drive it higher.",
          "Output ripple: with an ideal capacitor the voltage ripple is ΔVout ≈ ΔI_L / (8·Cout·fsw), but in most real designs the capacitor's ESR dominates and ΔV_ESR ≈ ΔI_L·ESR — a 0.9 A ripple through 10 mΩ of ESR is 9 mV before the capacitance term even matters. This is exactly why low-ESR ceramics changed switching-supply design, and why you check the ESR term first. Input capacitor RMS current ≈ Iout·√(D(1−D)) = 3 × √(0.275 × 0.725) ≈ 3 × 0.447 ≈ 1.34 A RMS — that is a real heating spec the input ceramic must be rated for. Redoing this arithmetic from the two governing laws, rather than reciting a result, is what an interviewer is listening for.",
        ],
      },
      {
        type: "prose",
        heading: "Continuous vs discontinuous conduction",
        body: [
          "At heavy and moderate load the inductor current stays above zero for the whole cycle — continuous conduction mode (CCM), where D = Vout/Vin holds and the converter is well behaved. As load drops, the triangle's valley (Iout − ΔI_L/2) sinks toward zero. In an asynchronous converter the catch diode can only conduct one way, so when the current tries to go negative the diode blocks and the current sits at zero for part of the cycle — discontinuous conduction mode (DCM). In DCM the simple duty relationship breaks: the conversion ratio becomes load-dependent, the loop dynamics change (the double pole moves), and the control law has to adapt.",
          "A synchronous converter has a choice at light load. In forced-PWM mode it lets the low-side MOSFET carry negative current, staying in CCM down to no load — clean, constant-frequency, but wasteful because it circulates energy backward and burns switching loss. In diode-emulation or pulse-skipping/burst mode it turns the low-side switch off when current reaches zero (mimicking a diode) and skips pulses, dramatically improving light-load efficiency at the cost of variable frequency, larger ripple, and sub-harmonic or audible-band energy that can bother sensitive analog rails or make ceramics sing. Which mode a rail runs in is a design decision, not a footnote — it changes efficiency, noise spectrum, and transient behavior.",
        ],
      },
      {
        type: "table",
        heading: "Synchronous vs asynchronous freewheel",
        columns: ["Aspect", "Asynchronous (diode)", "Synchronous (low-side FET)"],
        rows: [
          ["Freewheel element", "Schottky catch diode", "Low-side MOSFET (actively driven)"],
          ["Freewheel loss", "V_f × I_fw — large at low V_out", "I² × R_ds(on) — much smaller"],
          ["Efficiency at low V_out / high I", "Poor (diode drop is a big fraction of V_out)", "High — the reason sync dominates modern rails"],
          ["Complexity", "Simple, no low-side gate drive", "Needs gate driver + dead-time control"],
          ["Key hazard", "Diode reverse-recovery, thermal", "Shoot-through if dead time is too short"],
          ["Light-load behavior", "Naturally enters DCM", "Selectable: forced-PWM (CCM) or diode-emulation"],
        ],
      },
      {
        type: "prose",
        heading: "Synchronous rectification and dead time",
        body: [
          "Replacing the catch diode with a MOSFET is the single biggest efficiency lever at low output voltages. A Schottky dropping 0.4 V while carrying the freewheel current for 70% of the period wastes 0.4 V × I × 0.7 — for a 3 A, 3.3 V rail that is roughly 0.85 W, a large fraction of the total loss. A synchronous MOSFET with 10 mΩ on-resistance drops only I × Rds(on) ≈ 30 mV instead, cutting that loss by more than ten times. The price is control complexity: both switches in a leg must never be on together, or they short the input to ground (shoot-through) and destroy themselves. The controller inserts dead time — a short interval where both are off — during which the MOSFET body diode (or a small parallel Schottky) carries the current. Too much dead time wastes efficiency in the body diode; too little risks shoot-through. Adaptive or predictive dead-time control tunes this automatically in good controllers.",
          "The loss ledger to carry in your head: conduction loss (I²·Rds(on) in each switch weighted by its on-time), switching loss (≈ ½·Vin·I·(t_r + t_f)·f_sw for the hard-switched high side, plus gate-charge loss Qg·Vdrive·f_sw), inductor DCR and core loss, freewheel loss, and output/input capacitor ESR loss. Conduction loss scales with load squared and dominates at high current; switching and gate loss are roughly constant with load and dominate the light-load efficiency curve — which is precisely why light-load pulse-skipping exists.",
        ],
      },
      {
        type: "callout",
        heading: "The hot loop decides your EMI and your ringing",
        body: "The loop carrying the fastest-changing current in a buck is input cap → high-side switch → low-side switch (or diode) → back to the input cap. That loop reverses current every switching edge with enormous di/dt, so its physical area and inductance set the switch-node ringing, the radiated emissions, and the voltage overshoot on the switches. Minimizing this loop's area — a tight input capacitor right at the switch pins — usually matters more to a clean design than any component value. This is where the theory meets the layout note on switching-power PCB design.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Buck design and review checklist",
        items: [
          "Compute ideal D = Vout/Vin, then check min-on-time and max-duty limits at the input-voltage extremes.",
          "Size L for 20–40% ripple current; verify hot saturation current above I_out + ΔI_L/2 with transient margin.",
          "Check output ripple from both the ESR term (usually dominant) and the capacitance term.",
          "Rate the input capacitor for its RMS current ≈ I_out·√(D(1−D)), worst near D = 0.5.",
          "Choose synchronous vs asynchronous from the efficiency budget at the actual V_out and current.",
          "Decide the light-load mode (forced-PWM vs pulse-skip) and its noise consequences for downstream rails.",
          "Minimize the input-cap-to-switch hot loop and verify switch-node ringing on a short-ground scope probe.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Derive D = Vout/Vin without reciting it.", answer: "In steady state the average inductor voltage is zero. On-time volt-seconds (Vin − Vout)·D·Ts must cancel off-time volt-seconds Vout·(1 − D)·Ts. Solving gives D = Vout/Vin." },
          { question: "What sets the inductor ripple current and how do you size L?", answer: "ΔI_L = Vout(1 − D)/(L·fsw). Choose ΔI_L as 20–40% of load, then L = Vout(1 − D)/(ΔI_L·fsw). Verify peak I_out + ΔI_L/2 against hot saturation current." },
          { question: "When and why does a buck enter DCM?", answer: "At light load the inductor valley current tries to go negative; an asynchronous diode blocks reverse current, so the current sits at zero for part of the cycle. The conversion ratio then becomes load-dependent." },
          { question: "Why is synchronous rectification worth the complexity at low Vout?", answer: "The freewheel element conducts most of the cycle. A diode drops ~0.4 V (large versus a 3.3 V output), while a low-side MOSFET drops only I·Rds(on) ≈ tens of mV — a big efficiency gain, at the cost of dead-time control to prevent shoot-through." },
        ],
      },
    ],
    sources: [tiBuckPowerStage, adLdoVsSwitcher],
    related: ["power-supplies-and-regulation", "switching-power-layout", "power-architecture-and-poe"],
  },
  {
    slug: "power-architecture-and-poe",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Power architecture: switcher vs LDO, PSRR & the PoE power tree",
    summary: "Building a power tree from a source down to every rail, the switcher/LDO trade-off, PSRR as the rejection spec, and walking 48 V PoE to isolated intermediate rails, point-of-load bucks, and clean LDO rails.",
    readingTime: 18,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Real products have a power tree, not a regulator",
        body: [
          "A finished device rarely has one converter. It has a power tree: a branching sequence of conversions that starts at the input source and ends at every load's rail, with each stage chosen to trade efficiency, noise, size, cost, and sequencing. Reading a datasheet's 'recommended power supply' section, you will see a bulk rail feeding several point-of-load converters, some of which feed LDOs, each rail carrying a different current at a different noise budget. The skill is choosing where to convert efficiently, where to convert quietly, and how to order the whole thing so nothing is damaged at power-up.",
          "The two workhorse regulators sit at opposite ends of a trade-off, and a good design uses both deliberately. A switching regulator moves energy through an inductor and is efficient almost regardless of the step-down ratio, so it does the heavy lifting — turning a high bulk voltage into the amperes a processor core needs — but it produces switching ripple and broadband noise. A linear regulator (LDO) simply drops the excess voltage as heat, so it is quiet, tiny, cheap, and fast, but wasteful for large steps. The canonical architecture combines them: a switcher for bulk conversion down to an intermediate rail, then an LDO to post-regulate the clean analog, sensor, PLL, or RF rail from just above its target.",
        ],
      },
      {
        type: "formula",
        heading: "LDO loss and efficiency are set by the drop",
        formula: "P_LDO ≈ (V_in − V_out)·I_out + V_in·I_q     η_LDO ≈ V_out / V_in",
        explanation: "An LDO is a controlled resistor in series with the load: it burns the voltage difference times the current as heat, plus a small quiescent term. Its best-case efficiency is therefore just the voltage ratio — dropping 5 V to 3.3 V is at most 66% efficient, and dropping 12 V to 3.3 V would waste more than twice the delivered power as heat. That is why LDOs are used for small, deliberate drops (say 3.6 V → 3.3 V, ~92% efficient) where their quietness is worth a little loss, and why a big step down is a switcher's job. The quiescent current I_q dominates the light-load and battery-standby picture, so a battery device cares about nanoamp-class I_q parts.",
        terms: [
          { symbol: "V_in − V_out", meaning: "Dropout across the pass element", unit: "V" },
          { symbol: "I_out", meaning: "Load current", unit: "A" },
          { symbol: "I_q", meaning: "Quiescent (ground-pin) current", unit: "A" },
        ],
      },
      {
        type: "table",
        heading: "Switcher vs LDO — pick by the job",
        columns: ["Criterion", "Switching regulator", "Linear regulator (LDO)"],
        rows: [
          ["Efficiency", "80–95%, largely ratio-independent", "≈ V_out/V_in — poor for big drops"],
          ["Output noise", "Switching ripple + broadband spurs", "Very low; excellent for analog/RF"],
          ["Size / BOM", "Inductor + caps + controller", "One small part + caps"],
          ["Transient / bandwidth", "Limited by loop bandwidth", "Fast, simple loop"],
          ["Heat", "Low even at big steps", "Dissipates the whole drop as heat"],
          ["Best use", "Bulk rails, high current, big step-down", "Post-regulating a quiet rail from a nearby switcher"],
        ],
      },
      {
        type: "prose",
        heading: "PSRR is the rejection spec that ties the two together",
        body: [
          "Power-supply rejection ratio (PSRR) measures how much ripple on a regulator's input is attenuated before it reaches the output, expressed in decibels versus frequency. It is the number that justifies the switcher-plus-LDO architecture: the switcher makes an efficient but noisy intermediate rail, and the LDO's PSRR knocks that ripple down on the sensitive rail. The catch is that PSRR is not one number — it is a curve. A good LDO rejects 60–80 dB at DC and low frequencies, but its rejection rolls off above its own loop bandwidth and can fall to 20 dB or less by 1 MHz — which is exactly where a switcher's fundamental and harmonics live. So an LDO alone does not erase switcher noise at the switching frequency; you also keep the switcher ripple low at the source and often add a small LC or ferrite-bead filter between the stages.",
          "Two more PSRR realities shape real rails. First, headroom: PSRR collapses as the LDO approaches dropout, because a starved pass element can no longer correct — a 3.3 V LDO fed from 3.4 V gives far worse rejection than one fed from 3.8 V, so you buy rejection with a little extra dropout (and a little extra heat). Second, the load and output capacitor matter: PSRR is specified at a particular current and output cap, and the wrong capacitor can wreck both stability and rejection. For the quietest rails — a PLL, an image sensor, a low-noise amplifier, an ADC reference — you read the LDO's noise spectral density (µV RMS over a band) and its PSRR at the switcher frequency together, not the headline DC number.",
        ],
      },
      {
        type: "prose",
        heading: "Walking a PoE power tree: 48 V to clean rails",
        body: [
          "Power over Ethernet delivers power and data on the same cable, with the source (PSE) supplying a nominal 48 V — actually a wide 37–57 V range across the 802.3af/at/bt types, carrying up to ~15 W, ~30 W, ~60 W, or ~90 W at the source depending on type, with less at the device after cable loss. A powered device (PD) has to negotiate for that power and then convert it down to a stack of internal rails. Walking the tree from the connector inward is a favorite because it forces you to name every stage and why it exists.",
          "Stage 1 — the front end and PD controller. Power arrives phantom-fed through the center taps of the RJ45 magnetics (or on the spare pairs), passes through a rectifying bridge so it works regardless of pair polarity, and reaches the PD controller. The controller presents the 25 kΩ detection signature so the PSE recognizes a valid device, responds to classification (and, for higher-power 802.3bt, negotiates via the data-link layer / LLDP), then closes an inrush-limited hot-swap MOSFET to bring up the ~48 V bus gently. It also enforces the maintain-power signature — the PD must keep drawing a minimum current or the PSE assumes it unplugged and cuts power.",
          "Stage 2 — the isolated DC-DC. PoE requires galvanic isolation between the cable-side and the device-side, and a big step down from 48 V, so the first conversion is an isolated topology — commonly a flyback at these power levels, or an active-clamp forward at higher power — that produces a regulated intermediate rail (often 12 V or 5 V) across a transformer. This one stage does three jobs at once: isolation, the large step-down, and regulation of the intermediate bus.",
          "Stage 3 — the point-of-load bucks. From the 12 V or 5 V intermediate rail, synchronous buck converters generate the workhorse rails — 3.3 V, 1.8 V, 1.2 V, and sub-1 V processor core rails — at high efficiency and the currents digital logic demands. These are the notes from the buck-converter page made concrete: each POL is sized for its rail's current, ripple, and transient.",
          "Stage 4 — the LDOs for quiet rails. Wherever a subsystem needs low noise — a radio, a PLL, an image sensor, a microphone preamp, an ADC reference — an LDO post-regulates from the nearest buck output, dropping a few hundred millivolts to clean up switcher ripple with its PSRR. The result is the full tree: 48 V → isolated intermediate → point-of-load bucks → LDO-cleaned analog rails, each stage chosen for what it is good at.",
        ],
      },
      {
        type: "prose",
        heading: "Sequencing, and why total efficiency is a product",
        body: [
          "A multi-rail SoC usually specifies an order for rails to appear and disappear — core before I/O, or a particular ramp relationship — to avoid latch-up, excessive inrush, or back-powering internal structures through I/O protection diodes. That ordering is enforced with enable chains, power-good signals cascading from one regulator to the next, dedicated sequencer ICs, and a reset supervisor that holds the processor in reset until every rail is valid. Power-down usually reverses the order. Getting this wrong produces intermittent, unit-to-unit start-up failures that are miserable to debug — so sequencing is designed on paper before layout.",
          "Efficiency compounds down the tree: the end-to-end efficiency of a rail is the product of every stage that feeds it. A 3.3 V rail made by a 90%-efficient buck feeding a 90%-efficient LDO nets 81%, and adding an LDO that drops 5 V to 3.3 V on a whole rail throws away a third of that rail's power as heat. The design lesson is to post-regulate only the rails that genuinely need the quiet — run the digital rails straight off their bucks, and spend the LDO's loss only where PSRR and noise buy something. In a sealed, fanless PoE device every one of those wasted watts also becomes a thermal problem the enclosure has to shed by conduction alone.",
        ],
      },
      {
        type: "callout",
        heading: "Match the rail to the load, not to a habit",
        body: "Before choosing a regulator, write down each rail's current, its allowed ripple and noise, its transient, and its distance from the source. Efficiency-critical high-current rails want synchronous bucks; low-noise analog rails want an LDO fed from just above target; a rail that is both high-current and low-noise wants a buck plus an LDO with a filter between them. Reaching for the same part everywhere either wastes power (LDO on a big drop) or injects noise where it hurts (bare switcher on an ADC reference).",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Power-architecture review checklist",
        items: [
          "Draw the whole tree from source to every load; label each rail's voltage, current, ripple/noise budget, and sequencing requirement.",
          "Use switchers for bulk and high-current step-downs; reserve LDOs for small drops on quiet rails.",
          "Check LDO PSRR at the upstream switching frequency, not just at DC, and give the LDO enough headroom above dropout.",
          "For PoE, confirm detection/classification, isolation, the maintain-power signature, and inrush limiting are all handled by the PD front end.",
          "Multiply stage efficiencies to find true rail efficiency; post-regulate only rails that need it.",
          "Design the enable/power-good sequence and reset supervision before layout.",
          "Budget the total dissipated power as heat the enclosure must remove — especially in sealed, fanless devices.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "When do you pick a switcher over an LDO, and when do you use both?", answer: "Switcher for efficiency and big or high-current step-downs; LDO for small drops on low-noise rails. Use both when a rail is both high-current and quiet: a buck for efficiency, then an LDO to post-regulate and reject the switcher ripple." },
          { question: "Why isn't PSRR a single number?", answer: "It is a curve versus frequency. LDO rejection is high at DC (60–80 dB) but rolls off above its loop bandwidth, often to ~20 dB by 1 MHz — right where switcher harmonics sit — and it collapses near dropout, so you keep source ripple low and give the LDO headroom." },
          { question: "Walk the PoE power tree from the RJ45 to a clean analog rail.", answer: "48 V phantom-fed through the magnetics → PD controller (detection, classification, inrush, maintain-power) → isolated DC-DC (flyback/forward) to a 12 V or 5 V intermediate rail → synchronous point-of-load bucks for 3.3/1.8/1.2/core → LDOs post-regulating the quiet analog/RF rails." },
          { question: "Why does adding an LDO to a rail cost more than its own loss suggests?", answer: "End-to-end efficiency is the product of all stages, so an LDO stacked on a buck multiplies the losses; and on a big drop the LDO wastes (Vin−Vout)·I as heat that a sealed enclosure must then shed." },
        ],
      },
    ],
    sources: [tiPoeIntro, ieee8023bt, adLdoVsSwitcher],
    related: ["buck-converter-first-principles", "power-supplies-and-regulation", "transformers-and-isolation"],
  },
];
