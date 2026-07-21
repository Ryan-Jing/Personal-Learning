import type { Note, Source } from "./library";

const artOfElectronics: Source = {
  title: "The Art of Electronics (3rd ed.) — bench technique",
  publisher: "Horowitz & Hill, Cambridge University Press",
  url: "https://artofelectronics.net/",
  kind: "Book",
};

const keysightScopeFundamentals: Source = {
  title: "Oscilloscope Fundamentals",
  publisher: "Keysight Technologies",
  url: "https://www.keysight.com/us/en/assets/7018-06769/application-notes/5989-8064.pdf",
  kind: "Documentation",
};

const saleaeDocs: Source = {
  title: "Logic Analyzer Protocol Decoding",
  publisher: "Saleae",
  url: "https://support.saleae.com/",
  kind: "Documentation",
};

export const benchBringupNotes: Note[] = [
  {
    slug: "board-bring-up-methodology",
    libraryId: "technical",
    collectionId: "bench-and-bringup",
    title: "Board bring-up methodology",
    summary: "The ordered, one-variable-at-a-time procedure for waking a new board: inspect, check for rail shorts, power rails one at a time, verify clocks and resets, scan the comms buses, then exercise subsystems individually.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Bring-up is a discipline, not a power switch",
        body: [
          "The temptation with a fresh board is to plug it in, load the full firmware, and see if it 'works.' That approach turns every failure into a mystery with a hundred suspects — a short, a backwards part, a dead rail, a stuck reset, a mis-strapped clock, a firmware bug — all masquerading as one dead board. Bring-up replaces that gamble with an ordered procedure that adds one working layer at a time, so that when something fails, only one thing has changed and the fault has one plausible cause. The governing rule underneath every step is: change one thing at a time, and measure rather than assume.",
          "The order follows the dependency chain of the hardware itself. Nothing works until the power rails are good; the rails mean nothing if there is a short; the processor cannot run until its clock oscillates and its reset releases; the buses cannot talk until the processor runs; and the application cannot run until the buses talk. Bring-up walks that chain from the bottom, proving each layer before trusting the next. Skipping a layer does not save time — it just moves the debugging to a point where more variables are live.",
        ],
      },
      {
        type: "callout",
        heading: "Bring-up begins before the board exists",
        body: "The cheapest bring-up bug is the one caught before fabrication. Before committing a board to fab, verify the mechanical interface physically — laser-cut or 3D-print a mock front panel and mount the real connectors and switches to check port alignment, clearance, spacing, accessibility, and enclosure fit. A connector 0.5 mm too high is invisible on screen and obvious against a real panel; catching it costs a reprinted panel instead of a board spin. See the note on PCB ↔ mechanical constraints for the technique.",
        tone: "note",
      },
      {
        type: "prose",
        heading: "Before power: inspect and check for shorts",
        body: [
          "Start with the board unpowered and your eyes. Look for solder bridges on fine-pitch parts, tombstoned or shifted components, missing parts, and — the classics that release smoke — electrolytic capacitors, diodes, and polarized connectors installed backwards. Confirm the assembled board matches the intended revision and that any zero-ohm strap or DNP (do-not-populate) option is in the state the design expects.",
          "Then reach for the DMM and check every power rail to ground for a dead short before any current flows. A rail measuring a few ohms or less to ground is a solder bridge, a backwards part, or a failed capacitor, and finding it now with an ohmmeter is free — finding it by powering into it is not. Check rail-to-rail as well where rails should be isolated. This single step, done with a multimeter in continuity or low-ohms mode, prevents the most expensive class of first-power failures.",
        ],
      },
      {
        type: "prose",
        heading: "First power: current-limited, watching the draw",
        body: [
          "Apply power from a bench supply set to the correct voltage with the current limit set to a little above the expected draw — never from an unlimited source on a first power-up. Bring the voltage up (or enable the input) while watching the current. A board that immediately hits the current limit has a short you missed; back off and find it. A board that draws far more or far less than the budget is telling you something before any rail is even confirmed. If a rail runs hot, a fingertip or a thermal camera finds the offending part quickly. The current meter is the single most informative instrument in the first minute of a board's life.",
          "Only once the input current looks sane do you move on. Resist the urge to load firmware or connect peripherals yet — the goal of this stage is simply to establish that the board can accept power without self-destructing.",
        ],
      },
      {
        type: "prose",
        heading: "Rails one at a time, then clocks and resets",
        body: [
          "Bring up the power rails individually. Enable one regulator, measure its output voltage against target, then check its ripple and switch-node behavior with a scope (using a short ground spring, not the long clip lead, so you are measuring the rail and not the probe's own loop). Verify the sequencing and power-good chain does what the design intended — rails appearing in the specified order, supervisors releasing at the right thresholds. Confirm each rail is within tolerance under the light load of the board itself before adding more.",
          "With rails good, prove the processor's heartbeat: scope the crystal or oscillator for the right amplitude and frequency, confirm any PLL locks, and verify the reset line actually releases after the rails are valid. An enormous fraction of 'the board is dead' reports are a non-starting oscillator (wrong load capacitors, no bias, a cracked crystal) or a reset held low by a supervisor or a strapping error — both are visible in seconds on a scope and invisible to guessing. Check boot-mode and configuration straps here too, since a processor that boots from the wrong source looks identical to one that will not boot at all.",
        ],
      },
      {
        type: "prose",
        heading: "Buses, then subsystems one at a time",
        body: [
          "Now that the processor runs, prove the communication buses before the application that rides on them. Scan the I2C bus by sweeping addresses and checking which devices acknowledge — a device that does not ACK is unpowered, mis-addressed, held in reset, or has a bus fault. Loop back or exercise SPI and confirm each chip-select reaches its target; bring up the UART console so the board can tell you what it is doing. A logic analyzer decoding the actual bytes turns 'the sensor isn't responding' from a guess into an observation.",
          "Finally, exercise subsystems one at a time with minimal, targeted firmware rather than the whole application. Bring up the sensor, then the radio, then the motor driver, each in isolation, confirming it behaves before adding the next. When you eventually run the full firmware, every layer beneath it is already known-good, so any new failure belongs to the integration, not to a rail or a bus you never verified. Keep a bring-up log the whole way — what you changed, what you measured, what you expected — because the log is what lets you back out one variable when something regresses.",
        ],
      },
      {
        type: "table",
        heading: "The bring-up ladder",
        columns: ["Stage", "Tool", "Pass criterion"],
        rows: [
          ["Visual inspection", "Eyes, magnifier", "No bridges, backwards, or missing parts; correct revision/straps"],
          ["Short check", "DMM (continuity / low ohms)", "No rail shorted to ground or to another rail"],
          ["First power", "Current-limited supply", "Input current within budget; nothing overheating"],
          ["Rails", "DMM + scope (short ground)", "Each rail in tolerance, sequenced, low ripple"],
          ["Clocks & resets", "Oscilloscope", "Oscillator running, PLL locked, reset released, straps correct"],
          ["Buses", "Logic analyzer / bus scan", "Devices ACK; bytes decode correctly"],
          ["Subsystems", "Minimal firmware", "Each peripheral works alone before integration"],
        ],
      },
      {
        type: "callout",
        heading: "One variable at a time, always measured",
        body: "The two habits that separate fast bring-up from slow are changing exactly one thing between observations and measuring the actual state instead of trusting the schematic. 'It should be 3.3 V' and 'it is 3.28 V on the meter' are different kinds of knowledge, and only the second closes a bug. Keep a written log so you can undo a single change and see the effect.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Bring-up checklist",
        items: [
          "Inspect visually and confirm revision, straps, and DNP options before power.",
          "Ohm out every rail to ground (and to each other) with the board unpowered.",
          "Power from a current-limited supply and watch the draw against budget.",
          "Bring rails up one at a time; verify voltage, ripple, sequencing, and power-good.",
          "Scope the oscillator, PLL lock, reset release, and boot straps before blaming firmware.",
          "Scan/decode each bus and confirm devices respond before running the application.",
          "Exercise subsystems individually with minimal firmware; log every change and measurement.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why bring up a board in a strict order instead of loading the full firmware?", answer: "The hardware has a dependency chain — rails, then clocks/reset, then buses, then application. Proving each layer before the next means a failure has one changed variable and one plausible cause, instead of a hundred." },
          { question: "What do you check before applying power for the first time?", answer: "Visual inspection for bridges/backwards/missing parts and correct straps, then a DMM short check of every rail to ground and between rails — catching assembly shorts for free before any current flows." },
          { question: "A new board looks 'dead.' What are the two most common causes and how do you see them?", answer: "A non-starting oscillator (wrong load caps, no bias, cracked crystal) and a stuck reset (supervisor threshold, strap error). Both are visible in seconds on a scope at the crystal and reset pins." },
          { question: "Why power a first board from a current-limited supply?", answer: "So a missed short or backwards part hits the current limit instead of destroying parts or the board; the current reading itself is the most informative early measurement." },
        ],
      },
    ],
    sources: [artOfElectronics, keysightScopeFundamentals],
    related: ["lab-instruments-and-measurement", "structured-hardware-debugging", "dfm-dfa-and-testability", "pcb-mechanical-constraints"],
  },
  {
    slug: "lab-instruments-and-measurement",
    libraryId: "technical",
    collectionId: "bench-and-bringup",
    title: "Lab instruments & measurement fluency",
    summary: "Which tool reveals which domain — DMM, oscilloscope, logic analyzer, spectrum analyzer, power/current profiler — plus the probing craft that decides whether a measurement is real or an artifact.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Reach for the tool that shows your hypothesis's domain",
        body: [
          "Instrument fluency is not knowing how to turn the knobs; it is knowing which instrument makes the phenomenon you suspect visible. Every measurement lives in a domain — DC value, time-domain waveform, protocol bytes, frequency spectrum, current over time — and picking the wrong instrument means the evidence you need is simply not on the screen. The strong troubleshooting habit is to form a hypothesis, name the domain it lives in, and reach for the instrument that renders that domain. 'I saw X on the scope, which told me Y' is the shape of a good debugging sentence, and it starts with choosing the right X.",
          "The corollary is that every instrument also lies in a characteristic way — a bandwidth it cannot exceed, a loading it imposes, a probe that adds its own artifacts. Fluency includes knowing each tool's limits so you can tell a real signal from an artifact of the measurement. The rest of this note is a tour of the bench organized around what each instrument reveals and how it fools you.",
        ],
      },
      {
        type: "table",
        heading: "The bench, by what each instrument reveals",
        columns: ["Instrument", "What it reveals", "Reach for it when", "How it fools you"],
        rows: [
          ["Digital multimeter", "DC voltage, continuity/shorts, resistance, current", "Checking rails, ohming out shorts, series current", "Bandwidth-limited; averaging DMMs misread non-sine RMS; loads high-Z nodes"],
          ["Bench power supply", "Controlled V with current limit (CC/CV)", "First power-up; finding shorts by watching draw", "Slow to respond to fast transients; long leads add inductance"],
          ["Oscilloscope", "Voltage vs time — edges, clocks, ripple, timing", "Signal integrity, oscillation, reset/clock timing", "Long ground lead rings; too little bandwidth rounds edges; loading fast nodes"],
          ["Logic analyzer", "Many digital channels; decoded protocol bytes", "Seeing the actual I2C/SPI/UART transaction", "Threshold/timing setup; shows logic states, not analog quality"],
          ["Spectrum analyzer", "Energy vs frequency", "EMI pre-compliance, spurs, clock harmonics, RF", "Needs the right span/RBW; input level and probe coupling matter"],
          ["Power / current profiler", "Current from nA to A over time", "Sleep-current, power budgets, dynamic profiling", "Burden voltage and range switching distort fast pulses"],
        ],
      },
      {
        type: "prose",
        heading: "The DMM and the bench supply: the first minute of every board",
        body: [
          "The multimeter is the fastest tool for the questions asked most: is this rail at the right voltage, is this net shorted to that one, is there continuity through this joint, how much current is this branch drawing. Two limits matter. First, current is measured in series with a burden resistance and a fuse — insert it into the branch, and remember the meter's own drop. Second, a cheap average-responding meter assumes a sine wave and misreads the RMS of anything else; a true-RMS meter is required for switching waveforms and non-sinusoidal currents. The DMM has essentially no bandwidth, so it tells you steady-state truth and nothing about what happens between readings.",
          "The bench supply is a diagnostic instrument, not just a power source. Its current limit turns a first power-up into a safe experiment, and the current it reports is often the first real clue about a board's health. Set the limit deliberately, watch the draw, and treat a supply that folds back into constant-current mode as the board telling you it has a short.",
        ],
      },
      {
        type: "prose",
        heading: "The oscilloscope and its probing craft",
        body: [
          "The scope is where the time domain lives: rising and falling edges, clock quality, power-rail ripple, bus timing, oscillation, glitches, and the ringing that betrays a bad layout. It is also the instrument most easily defeated by careless probing, so the craft matters as much as the instrument. Match bandwidth to the signal — the rule of thumb is a scope (and probe) bandwidth of at least five times the highest frequency of interest, which for a fast edge is set by the edge rate, not the clock rate; too little bandwidth rounds off exactly the edges you came to see. Use a 10× probe to reduce loading on fast or high-impedance nodes, and above all keep the ground return short: the long clip lead forms a loop with the probe tip that rings and adds overshoot that is not on your signal — a spring ground tip pressed to a nearby ground via gives the truth.",
          "Use the scope's features as instruments in themselves. AC-couple and limit the bandwidth to measure small ripple on a big DC rail. Choose the trigger to catch the event you want — edge, pulse-width, or runt triggers isolate a glitch that free-running acquisition would bury. When a signal is not referenced to ground — a high-side gate, a differential pair, a floating shunt — reach for a differential probe rather than clipping two channels and subtracting, which shares the same ground problem you are trying to avoid. A measurement is only as trustworthy as the probe that took it.",
        ],
      },
      {
        type: "prose",
        heading: "Logic analyzer, spectrum analyzer, and power profiler",
        body: [
          "When the question is about bytes rather than volts — is the controller actually sending this register write, is the ACK there, is the frame malformed — the logic analyzer is the right tool. It samples many digital channels at once and decodes I2C, SPI, UART, and more into human-readable transactions, so a protocol bug that looks like 'the sensor is broken' becomes a visible missing ACK or a wrong address. Its blind spot is analog quality: it shows the state a threshold produced, not the marginal edge or the noise that caused an intermittent misread, so a stubborn intermittent bus problem often needs the scope and the analyzer together.",
          "The spectrum analyzer moves to the frequency domain, which is where EMI and RF problems become legible: a failing radiated-emissions scan, a switcher spur landing on a radio band, the exact harmonic of a clock that is causing trouble. With near-field probes and an RF current clamp it becomes a pre-compliance bench that finds most EMC failures for a fraction of a chamber's cost. Finally, the power analyzer or current profiler spans the enormous dynamic range — nanoamps of sleep current to amperes of active draw — that a DMM cannot, and plots current over time so you can see a firmware change that quietly broke low-power sleep. Each of these is the right answer only for its domain; fluency is moving between them as the hypothesis moves.",
        ],
      },
      {
        type: "callout",
        heading: "Match the instrument's bandwidth and reference to the phenomenon",
        body: "Most 'the instrument is wrong' moments are really 'the measurement setup was wrong': a scope with too little bandwidth, a long ground lead adding ring, an averaging DMM on a non-sine current, a logic analyzer threshold set badly, or a spectrum analyzer with the wrong RBW. Before doubting the board, doubt the probe, the ground, the bandwidth, and the reference.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Measurement checklist",
        items: [
          "Name the domain of your hypothesis (DC, time, protocol, frequency, current-vs-time) and pick the instrument that shows it.",
          "For rails and shorts, start with a true-RMS DMM and a current-limited supply watching the draw.",
          "On the scope, set bandwidth to ≥5× the signal's fastest content, use a 10× probe, and keep the ground return short.",
          "AC-couple and band-limit to see small ripple on a large rail; choose a trigger that isolates the event.",
          "Use a differential probe for non-ground-referenced signals instead of subtracting two channels.",
          "Reach for the logic analyzer to see bytes, the spectrum analyzer for EMI/RF, and a current profiler for sleep and power.",
          "Distrust the setup before the board when a reading looks impossible.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How do you decide which instrument to use?", answer: "Name the domain your hypothesis lives in — DC value, time-domain waveform, protocol bytes, frequency spectrum, or current over time — and pick the instrument that renders that domain. The wrong tool leaves the evidence off the screen." },
          { question: "Why does the oscilloscope ground lead matter so much?", answer: "The probe tip and its ground return form a loop; a long ground lead makes that loop ring, adding overshoot and ripple that are artifacts, not signal. A short spring ground to a nearby via gives the real waveform." },
          { question: "When do you use a logic analyzer instead of a scope?", answer: "When the question is about the digital content — addresses, ACKs, frame structure — rather than analog edge quality. The analyzer decodes many channels into protocol transactions; the scope shows one or two analog waveforms in detail." },
          { question: "What can a current profiler show that a DMM cannot?", answer: "Current across a huge dynamic range (nA to A) plotted over time, revealing sleep-current regressions and dynamic power behavior that a bandwidth-limited, single-range DMM reading averages away." },
        ],
      },
    ],
    sources: [keysightScopeFundamentals, saleaeDocs, artOfElectronics],
    related: ["board-bring-up-methodology", "structured-hardware-debugging", "emi-emc-pcb-design"],
  },
  {
    slug: "structured-hardware-debugging",
    libraryId: "technical",
    collectionId: "bench-and-bringup",
    title: "Structured hardware debugging",
    summary: "The hypothesis–isolate–measure–confirm loop, bisection of the signal chain and history, dividing a fault by layer, comparing against a known-good unit, and the cognitive traps that waste bench time.",
    readingTime: 15,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Debugging is a controlled experiment, narrated out loud",
        body: [
          "Effective hardware debugging is the scientific method run fast on a bench: observe the symptom, form a hypothesis about the cause, predict what you would measure if the hypothesis were true, isolate a single variable, measure, and confirm or refute. Each loop either eliminates a cause or points at one, and narrating the loop out loud — which is exactly what an interviewer wants to hear — forces the discipline. The failure mode to avoid is 'shotgun debugging': changing several things at once, or reaching for fixes before forming a hypothesis, so that when the symptom moves you cannot say why. Structure is what turns a board full of suspects into a sequence of answered questions.",
          "Two rules make the loop rigorous. Reproduce the fault reliably before trying to fix it — an intermittent bug you cannot summon on demand cannot be confirmed fixed, only hoped fixed. And confirm a fix by removing it: if putting the change back makes the symptom return and taking it away makes it vanish, you have the cause; if the symptom is already gone and you cannot bring it back, you may have only disturbed it.",
        ],
      },
      {
        type: "prose",
        heading: "Bisection: halve the search space every step",
        body: [
          "The fastest structured technique is binary search. A signal chain that produces a wrong output at the end has a first point where the signal goes bad; probing the middle of the chain tells you which half contains the fault, and each measurement halves what is left. The same idea applies across domains: populate or depopulate half the loads to localize a short; disconnect half the subsystems to find which one pulls a rail down; and in firmware, bisect the commit history (git bisect) to find the change that introduced a regression. Bisection converts a linear hunt into a logarithmic one — a chain of twenty stages is found in about five measurements, not twenty.",
          "Divide the problem by layer as well as by position. A misbehaving board is failing at some layer — power, clock, reset, signal integrity, protocol, or firmware — and the layers stack in a known order. Work bottom-up: confirm the rail is good before suspecting the clock, the clock before the bus, the bus before the application. A protocol error is not worth chasing while the rail feeding the device is sagging. Naming the layer keeps you from debugging a symptom three levels above its cause.",
        ],
      },
      {
        type: "prose",
        heading: "Known-good comparison and the one-variable rule",
        body: [
          "When one unit fails and another works, the difference between them is the fastest path to the cause. Compare voltages, waveforms, and part markings between the bad board and a golden reference; swap a suspect part between the good and bad units and watch the fault follow the part (or not). A fault that moves with a component is a component fault; a fault that stays with the board is a board or assembly fault. This 'follow the failure' technique isolates causes that pure reasoning would take much longer to reach.",
          "Underneath every technique is the one-variable rule: change exactly one thing between observations, and keep a written log of what you changed and what happened. The log is what lets you undo a single step when a change makes things worse, and it is what turns a long debugging session into a repeatable account rather than a blur. Distinguish correlation from causation ruthlessly — two things changing together is a hypothesis, not a conclusion — and always separate the symptom from the root cause: a workaround that hides the symptom without explaining it will return in the field.",
        ],
      },
      {
        type: "prose",
        heading: "Reading instruments as evidence",
        body: [
          "Structured debugging lives or dies on turning a measurement into an inference. A flat line at a crystal that should be oscillating says the oscillator is not starting — check load capacitors and bias before anything downstream. A rail sagging only under load points at a regulator at its current limit or an undersized supply path, not at the load that merely revealed it. Ringing on a switch node that scales with a long probe ground is a measurement artifact, not a board fault. A bus that decodes correctly on the analyzer but glitches intermittently on the scope points at marginal analog quality — rise time, pull-ups, capacitance — rather than a protocol bug. Each observation should end in a 'which tells me' clause; a measurement that does not update a hypothesis was the wrong measurement.",
        ],
      },
      {
        type: "callout",
        heading: "The cognitive traps that waste bench hours",
        body: "Confirmation bias (measuring only what supports your first guess), fixing two things at once (so you never learn which mattered), trusting the schematic over the board (the copper is the truth), and trusting the instrument over the setup (a long ground lead or wrong bandwidth invents artifacts). Naming these traps as you work is how you avoid them.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Debugging checklist",
        items: [
          "Reproduce the fault reliably before attempting a fix.",
          "Form a hypothesis and predict the measurement before probing.",
          "Bisect the signal chain, the load population, or the commit history to halve the search each step.",
          "Work bottom-up by layer: power, clock, reset, signal integrity, protocol, firmware.",
          "Compare against a known-good unit and let the fault follow the swapped part.",
          "Change one variable at a time and keep a written log.",
          "Confirm the fix by removing it — and chase the root cause, not just the symptom.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Describe the core debugging loop.", answer: "Observe the symptom, form a hypothesis, predict what you would measure if it were true, isolate one variable, measure, then confirm or refute — and iterate, narrating each step." },
          { question: "How does bisection speed up finding a fault?", answer: "Probing the middle of a chain (or history) tells you which half contains the fault, halving the search each step — a twenty-stage chain is localized in about five measurements instead of twenty." },
          { question: "Why confirm a fix by putting it back?", answer: "If restoring the change brings the symptom back and removing it clears it, you have proven the cause. If the symptom is already gone and cannot be reproduced, you may have only disturbed it, not fixed it." },
          { question: "What does 'the fault follows the part' tell you?", answer: "Swapping a suspect component between a good and bad unit: if the failure moves with the part, it is a component fault; if it stays with the board, it is a board or assembly fault." },
        ],
      },
    ],
    sources: [artOfElectronics],
    related: ["board-bring-up-methodology", "lab-instruments-and-measurement", "root-cause-analysis"],
  },
];
