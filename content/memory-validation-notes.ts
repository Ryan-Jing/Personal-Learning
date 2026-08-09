import type { Note, Source } from "./library";

const micronDesignGuide: Source = {
  title: "DDR4/DDR5 point-to-point design and layout guidelines",
  publisher: "Micron Technology",
  url: "https://www.micron.com/support/technical-documentation",
  kind: "Documentation",
};

const jedecDdr4Training: Source = {
  title: "JESD79-4 — DDR4 SDRAM Standard (training and calibration modes)",
  publisher: "JEDEC Solid State Technology Association",
  url: "https://www.jedec.org/standards-documents/docs/jesd79-4a",
  kind: "Reference",
};

const keysightJitter: Source = {
  title: "Jitter Analysis: The Dual-Dirac Model, RJ/DJ, and Q-Scale",
  publisher: "Keysight Technologies",
  url: "https://www.keysight.com/us/en/assets/7018-01267/application-notes/5989-3206.pdf",
  kind: "Documentation",
};

const bogatinSiBook: Source = {
  title: "Signal and Power Integrity — Simplified",
  publisher: "Eric Bogatin, Prentice Hall",
  url: "https://www.pearson.com/en-us/subject-catalog/p/signal-and-power-integrity--simplified/P200000009563",
  kind: "Book",
};

const tekDdrValidation: Source = {
  title: "DDR Memory Interface Electrical Verification and Debug",
  publisher: "Tektronix",
  url: "https://www.tek.com/en/documents/application-note/ddr-memory-interface-electrical-verification-and-debug",
  kind: "Documentation",
};

export const memoryValidationNotes: Note[] = [
  {
    slug: "ddr-interface-signaling-and-training",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "DDR interface signaling & training",
    summary: "Source-synchronous capture with DQS, fly-by topology and why write leveling exists, ODT and POD signaling, and the full training sequence — ZQ, write leveling, read gate, read/write eye centering, Vref — plus the drift tracking that keeps a tuned interface centered.",
    readingTime: 20,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Source-synchronous: the data carries its own clock",
        body: [
          "At DDR speeds, a bit occupies a few hundred picoseconds on the wire — far less time than signals take to cross a board — so no central clock could tell a receiver when to sample data arriving from centimetres away. The interface is therefore source-synchronous: whoever drives the data also drives a strobe alongside it. Each byte lane of eight DQ (data) pins travels with its own DQS strobe, routed with the lane and length-matched to it, so data and strobe experience the same flight time and arrive together; the receiver uses the strobe — delayed by a quarter period to sit in the middle of the data eye — to capture the DQ bits, then transfers them into its own clock domain. Reads are strobed by the DRAM, writes by the controller: the strobe direction follows the data.",
          "The full signal roster: a differential clock CK that times the command/address (CA) bus; the CA bus itself carrying commands at a lower rate than data; per-lane single-ended DQ with differential DQS; and DM/DBI pins for write masking and data-bus inversion. The asymmetry is deliberate — CA is one-directional, moderate-speed, and multi-drop, while DQ is bidirectional and runs at the full data rate point-to-point per lane — and each side gets a topology and a training strategy suited to its job.",
        ],
      },
      {
        type: "prose",
        heading: "Fly-by topology, and why write leveling exists",
        body: [
          "On a DIMM, the clock, command, address, and control signals visit many DRAM chips. Old designs used balanced tree routing to make them arrive everywhere simultaneously — but every branch adds stubs that reflect at high speed. DDR3 onward uses fly-by topology instead: CK and CA run down a single daisy-chained trace past each chip in turn, terminated at the far end. Signal integrity improves dramatically (no branch stubs), at the cost of deliberate, known skew — the clock reaches each successive chip a little later. Data lanes, meanwhile, are routed point-to-point per byte between controller and their chip with (near) equal lengths.",
          "That mismatch creates the problem write leveling solves: for a write, the controller must present each byte lane's DQS aligned to the clock as seen at that lane's chip, but the clock arrives at every chip at a different time. Write leveling is the feedback loop that measures and corrects it — the DRAM enters a mode where it samples CK with the incoming DQS and reports the sampled value on DQ, and the controller steps the lane's DQS delay until it detects the clock edge, thereby learning that lane's flight-time difference and compensating it. It is the cleanest example of the modern interface philosophy: don't route to perfection, route for signal integrity and train out the skew.",
        ],
      },
      {
        type: "prose",
        heading: "Termination and signaling: ODT, POD, and Vref",
        body: [
          "The channel's electrical quality is actively managed by the devices themselves. On-die termination (ODT) puts the termination resistors inside the chips, switchable per transaction — the receiving end terminates while the driver drives, values are configured in mode registers, and non-target ranks on a shared bus present park terminations to keep the line controlled. Off-chip, the CA bus on a DIMM terminates to VTT (a rail at half VDDQ) at the fly-by's far end. DDR4 changed the data-bus signaling to pseudo-open-drain (POD): DQ terminates to VDDQ, so a driven high draws no current and only zeros cost power — the reason DBI (inverting a mostly-zero byte and flagging it) saves both power and simultaneous-switching noise. ZQ calibration ties the whole scheme to reality: each chip periodically calibrates its driver and termination impedances against an external precision resistor, tracking process, voltage, and temperature.",
          "Because POD signaling centers the received signal asymmetrically, the receiver's decision threshold Vref is no longer half-supply by construction: DDR4 moved VrefDQ inside the chip and made it a programmable, trained parameter. The consequence runs deep — the operating point of the interface (the voltage at which a bit is judged 0 or 1, and the instant at which it is sampled) is discovered by search during training and maintained against drift, not fixed by the schematic. Getting comfortable with that idea is the key to everything in DDR bring-up: the interface is a tunable analog system wearing a digital costume.",
        ],
      },
      {
        type: "table",
        heading: "The training sequence, in order",
        columns: ["Step", "What it aligns", "How it works"],
        rows: [
          ["ZQ calibration", "Driver / ODT impedances", "Chip calibrates against a precision external resistor"],
          ["Write leveling", "Each lane's DQS to CK at its chip", "DRAM samples CK with DQS, reports on DQ; controller steps delay until edge found"],
          ["Read gate training", "The receiver's DQS enable window", "Controller finds when the DRAM's read preamble arrives, so the strobe gate opens on real strobes, not noise"],
          ["Read eye training", "Per-bit sample point in the read eye", "Sweep DQS-to-DQ delay per bit against known patterns; center in the passing window"],
          ["Write eye training", "Per-bit launch time into the write eye", "Sweep write DQ delay per bit; DRAM feedback identifies the passing window; center it"],
          ["Vref training", "The receiver decision threshold (both directions)", "Sweep VrefDQ against timing to map the 2-D eye; pick the widest-margin point"],
          ["Periodic retraining / drift tracking", "Everything above, against V and T drift", "DQS oscillator and re-centering loops; hardware tracks drift between full retrains"],
        ],
      },
      {
        type: "formula",
        heading: "The unit interval is the budget",
        formula: "UI = 1 / data rate      DDR4-3200: UI = 312.5 ps      margin = UI − (skew + jitter + setup/hold + ISI + crosstalk terms)",
        explanation: "One bit occupies one unit interval on the wire — 312.5 ps at 3200 MT/s, half that at DDR5-6400 — and every impairment spends from that budget: residual lane skew after training, clock and data jitter, the receiver's own setup/hold aperture, inter-symbol interference, and crosstalk-induced timing noise. Training exists to reclaim the deterministic part (skew, static offset) so the budget is spent only on the statistical part. What remains after all spending is the eye margin, and margin measured in picoseconds and millivolts — not pass/fail — is the real product of memory tuning: it is what stands between a working system today and a failing one at the temperature, voltage, and aging corners.",
        terms: [
          { symbol: "UI", meaning: "Unit interval — one bit time on the wire", unit: "ps" },
          { symbol: "skew", meaning: "Residual static misalignment after training", unit: "ps" },
          { symbol: "margin", meaning: "Distance from sample point to eye edge", unit: "ps / mV" },
        ],
      },
      {
        type: "prose",
        heading: "Board rules that make training possible",
        body: [
          "Training compensates static skew per lane and per bit — but only within the delay-line range the PHY provides, and only for skew, not for signal quality. The board rules follow from that division of labour. Within a byte lane, match DQ traces to their DQS tightly (the strobe must genuinely represent its data's flight time); between lanes, matching can relax because per-lane training absorbs the difference — a freedom that eases routing congestion considerably. Route CA/CK as the fly-by chain with its VTT termination and let write leveling absorb the stagger. Maintain continuous reference planes under every lane (the return-path discipline from the PCB notes), keep via stubs short or back-drilled at the highest rates, and deliver a quiet VDDQ, because the supply is the reference for every single-ended DQ decision. A board that violates these rules doesn't fail training outright — worse, it trains to a fragile center with no margin, and fails later, at corners, intermittently.",
          "This is also where schematic and layout review for a memory interface gets its checklist teeth: correct ODT/VTT scheme and values, correct lane-to-chip mapping (byte swapping is allowed, bit swapping within a byte usually is too — but both must be told to the controller), matched intra-lane lengths, clean reference transitions, decoupling per the device's guidelines, and the ZQ resistor present and correct. Reviewing someone else's memory channel is applying exactly this list.",
        ],
      },
      {
        type: "callout",
        heading: "Train out skew; design out everything else",
        body: "Training removes static, per-lane, per-bit timing offset — nothing more. It cannot fix a broken return path, a resonant stub, an underdamped PDN, or crosstalk; those consume eye margin that no delay line restores. The division is clean: layout owns signal quality, training owns alignment, and validation measures whether what remains — the margin — survives every corner.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Interface & training review",
        items: [
          "Explain source-synchronous capture: DQS travels with its byte lane and samples it; direction follows the data.",
          "Tell the fly-by story: stub-free CA/CK routing, deliberate skew, write leveling as the compensation loop.",
          "Know the termination scheme: per-transaction ODT, POD to VDDQ, VTT for CA, ZQ calibration against the precision resistor.",
          "Recite the training order and what each step aligns: ZQ → write level → read gate → read/write eye centering → Vref → drift tracking.",
          "Compute the UI for a given rate and enumerate what spends the budget.",
          "Apply the board rules: tight DQ-to-DQS intra-lane matching, relaxed inter-lane, continuous references, quiet VDDQ, declared byte/bit swaps.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is the DDR interface source-synchronous?", answer: "At hundreds of picoseconds per bit, flight times across the board exceed the bit time, so no central clock can time capture. Each byte lane's DQS strobe travels with its data, experiencing the same delay, and the receiver samples DQ with the (quarter-period-shifted) strobe, then crosses into its own clock domain." },
          { question: "What problem does write leveling solve, and how?", answer: "Fly-by routing makes CK arrive at each chip at a different time, but writes require each lane's DQS aligned to CK at its chip. In leveling mode the DRAM samples CK with the incoming DQS and reports the result; the controller steps the lane's delay until it finds the edge, learning and compensating the per-chip skew." },
          { question: "Why is Vref trained rather than set by design?", answer: "POD signaling terminates DQ to VDDQ, making the received waveform asymmetric, so the ideal decision threshold depends on the actual channel, drive, and termination. DDR4 moved VrefDQ on-die and made it a swept, trained parameter — part of finding the 2-D (time × voltage) eye center." },
          { question: "What can training fix, and what can it not?", answer: "Training removes static skew and offset — per lane and per bit — within the PHY's delay range. It cannot repair signal quality: return-path breaks, stubs, crosstalk, and PDN noise shrink the eye itself, and only layout fixes those. Training aligns; design provides the eye to align within." },
        ],
      },
    ],
    sources: [jedecDdr4Training, micronDesignGuide],
    related: ["memory-controllers-and-scheduling", "high-speed-signal-integrity", "ddr-generations-lpddr-gddr-hbm", "return-paths-and-stackup", "memory-validation-and-margining"],
  },
  {
    slug: "high-speed-signal-integrity",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "High-speed signal integrity: eyes, jitter & equalization",
    summary: "The eye diagram as the universal health metric, the jitter taxonomy (RJ, DJ, ISI, DCD) and BER extrapolation, the impairment catalogue — reflections, crosstalk, SSO, losses — and the equalization toolbox (FFE, CTLE, DFE) that reopens closed eyes.",
    readingTime: 19,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Digital signals are analog waveforms with an opinion",
        body: [
          "Above roughly a gigabit per second, a data link stops being a logic diagram and becomes an analog channel: the trace is a lossy transmission line, every via and connector a discontinuity, every neighbour a noise source, and the bit a few hundred picoseconds of waveform that must arrive decodable. Signal integrity is the discipline of budgeting that arrival. Its foundation is the material already in the PCB and cabling notes — controlled impedance, continuous return paths, termination, loss mechanisms — and this note builds the layer above: how to quantify a live link's health (the eye and its statistics), name what degrades it (the jitter and noise taxonomy), and recover it when the channel alone is not enough (equalization).",
          "The unifying picture is the eye diagram: slice a long waveform into unit intervals and overlay them all. Where every possible bit sequence still leaves an open central region, the receiver has somewhere to sample; the opening's height is voltage margin, its width is timing margin, and the sampling point should sit at its center — which is precisely the point DDR training searches for. A healthy link has a wide-open eye; every impairment on this page is something that eats it from the sides (timing) or top and bottom (voltage).",
        ],
      },
      {
        type: "prose",
        heading: "The jitter taxonomy, and why it decomposes",
        body: [
          "Jitter — the deviation of edge times from ideal — is decomposed because its components scale differently and point at different culprits. Random jitter (RJ) is unbounded and Gaussian, from thermal and shot noise in oscillators and buffers; it never stops growing with observation time, so it is characterized by its RMS σ and extrapolated statistically. Deterministic jitter (DJ) is bounded and has causes: duty-cycle distortion (DCD) from asymmetric rise/fall or a skewed clock; data-dependent jitter / inter-symbol interference (ISI), where the channel's memory makes each edge's position depend on the bits before it — long runs charge the line differently than alternating patterns, so edges land pattern-dependently; and periodic jitter (PJ), coupled in from switching supplies or clocks, visible as spectral lines. The practical decomposition (dual-Dirac model) separates measured jitter into a DJ figure and an RJ σ.",
          "The reason for the machinery is bit error rate. RJ's Gaussian tails mean any link errors eventually; the question is how often. Total jitter at a target BER combines the bounded DJ plus the RJ tails scaled to that probability — and the bathtub curve (BER versus sampling position across the UI) shows the usable window collapsing as the target BER tightens. Extrapolation matters because you cannot afford to observe 10¹² bits per measurement point: measure minutes, fit the tails, predict the floor. A link 'passing' in a five-minute test with no errors has proven only a shallow BER; the statistics say what margin remains beneath.",
        ],
      },
      {
        type: "formula",
        heading: "Total jitter at a bit-error-rate target",
        formula: "TJ(BER) = DJ(δδ) + 2·Q(BER)·σ_RJ      Q ≈ 7.03 at BER 10⁻¹²      eye width(BER) = UI − TJ(BER)",
        explanation: "In the dual-Dirac model, deterministic jitter contributes a fixed, bounded closure while random jitter contributes Gaussian tails scaled by the Q factor for the target error probability — about 7 standard deviations each side for one error per 10¹² bits. Subtracting total jitter from the unit interval gives the eye width that actually remains at that BER, which is the honest version of timing margin: an eye that looks open on a scope's finite acquisition may be closed at the BER the product must meet. This is the arithmetic behind bathtub curves, BER-scan margining, and why validation quotes margins at a BER, not by eyeball.",
        terms: [
          { symbol: "DJ(δδ)", meaning: "Dual-Dirac deterministic jitter (bounded)", unit: "ps" },
          { symbol: "σ_RJ", meaning: "Random jitter RMS", unit: "ps" },
          { symbol: "Q(BER)", meaning: "Gaussian quantile for the target BER", unit: "—" },
        ],
      },
      {
        type: "table",
        heading: "The impairment catalogue",
        columns: ["Impairment", "Mechanism", "Signature", "Countermeasure"],
        rows: [
          ["Reflections", "Impedance discontinuities: stubs, vias, connectors, mismatched termination", "Ledges/ringing at fixed delays after edges", "Match impedance, terminate, shorten/back-drill stubs"],
          ["ISI", "Channel bandwidth limit — previous bits smear into current one", "Pattern-dependent edge shift; eye closure worsens with run length", "Equalization (FFE/CTLE/DFE); lower loss materials"],
          ["Crosstalk (NEXT/FEXT)", "Capacitive/inductive coupling from neighbours", "Noise correlated with aggressor activity; victim-pattern sensitive", "Spacing, ground isolation, layer planning, DBI"],
          ["SSO / ground bounce", "Many outputs switching share supply inductance", "Worst on all-switching patterns; rail collapse at edges", "More power/ground pins, decoupling, DBI, slew control"],
          ["Losses (skin + dielectric)", "Frequency-dependent attenuation over length", "Slow edges, amplitude loss growing with rate and distance", "Shorter/wider traces, better laminate, equalization"],
          ["PJ from supplies", "Switcher ripple modulating buffers/PLLs", "Spectral lines in jitter at switcher harmonics", "PDN filtering, supply layout, clock isolation"],
        ],
      },
      {
        type: "prose",
        heading: "Equalization: spending silicon to reopen the eye",
        body: [
          "When the channel's ISI closes the eye faster than layout can reopen it, the interface compensates electronically. Transmitter feed-forward equalization (FFE, seen as pre-emphasis/de-emphasis) pre-distorts the launched waveform — boosting transitions and attenuating repeated bits — so the channel's low-pass response lands the signal flat at the receiver. Receiver continuous-time linear equalization (CTLE) applies an analog high-frequency peaking filter, undoing loss at the cost of amplifying high-frequency noise and crosstalk alike. Decision feedback equalization (DFE) is the clever one: having decided the previous bits, the receiver subtracts their predicted, weighted contribution to the current sample — cancelling trailing ISI without amplifying noise, at the cost of feedback timing pressure and error propagation if a decision was wrong. Modern memory interfaces have crossed this threshold: DDR5 receivers include multi-tap DFE, and GDDR6X's PAM4 signaling — three stacked eyes, each with a third of the amplitude — leans on the full toolbox.",
          "Equalizer settings are themselves trained parameters now: tap weights and peaking codes join delay lines and Vref in the search space that bring-up explores and validation margins. The system view is worth stating plainly — a modern memory channel is a co-designed loop of layout (provide the best possible passive channel), silicon (equalize what remains), training (find the operating point), and validation (prove the margin at corners). No single layer can rescue a failure of another.",
        ],
      },
      {
        type: "prose",
        heading: "Measuring and simulating: scopes, S-parameters, and honesty",
        body: [
          "Measurement at these speeds is its own craft, extending the general oscilloscope discipline in the instruments note. Bandwidth first: capturing an edge honestly needs scope-plus-probe bandwidth well above the signal's spectral content (a common rule: at least the fifth harmonic of the fundamental — tens of GHz for modern rates), or the instrument itself rounds the eye. Access is the second problem: DDR signals live between BGA balls, so measurement uses interposers under the DRAM, purpose-designed probing vias, or — increasingly, and exclusively for in-package memory like HBM — the PHY's own instrumentation, which can scan its sampling point across time and voltage in-system and read out per-bit eye contours with no probe at all. De-embedding subtracts the fixture's own response from the measurement; forgetting it attributes the fixture's loss to the device.",
          "Characterization of the passive channel happens in the frequency domain: S-parameters, measured with a vector network analyzer or extracted from the layout by a field solver, describe insertion loss, return loss, and coupling versus frequency, and feed channel simulation. Before hardware exists, IBIS behavioural models of drivers and receivers combined with the channel model predict eyes and margins across corners — which is how layout decisions on a memory channel are judged before fabrication, and why simulation-versus-measurement correlation is a standing activity: a validated simulation flow lets the next design be margined at the desk instead of discovered at the bench.",
        ],
      },
      {
        type: "callout",
        heading: "The eye at the driver lies",
        body: "Signal quality exists at the receiver's decision point — after the whole channel, at its termination, judged against its threshold at its sampling instant. An eye probed near the driver, unterminated, or through an uncompensated fixture reports a different, kinder channel. Measure (or have the PHY measure) at the point of decision, de-embed the fixture, quote margin at a BER, and distrust any eye that arrived without those caveats.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Signal-integrity review",
        items: [
          "Read an eye diagram: height = voltage margin, width = timing margin, center = the trained sample point.",
          "Decompose jitter: RJ (Gaussian, extrapolated) vs DJ (bounded: DCD, ISI, PJ), and quote TJ at a target BER.",
          "Name each impairment's signature — reflections (fixed-delay ledges), ISI (pattern-dependence), crosstalk (aggressor-correlated), SSO (all-switching worst case).",
          "Match the equalizer to the problem: FFE pre-distorts, CTLE peaks (and amplifies noise), DFE cancels trailing ISI post-decision.",
          "Measure with sufficient bandwidth at the receiver's point of decision; de-embed fixtures; use PHY internal eye scans where probes cannot reach.",
          "Close the loop between S-parameter/IBIS simulation and bench measurement so the next channel is margined before fabrication.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What does an eye diagram show and how is it built?", answer: "All unit intervals of a long waveform overlaid: the open central region is where every bit sequence still leaves the signal decodable. Height is voltage margin, width is timing margin, and the receiver's sampling point should sit at the center — the point training searches for." },
          { question: "Why decompose jitter into RJ and DJ?", answer: "They scale differently: DJ is bounded (DCD, ISI, periodic) and points at specific causes; RJ is Gaussian and unbounded, so BER is set by its tails. TJ(BER) = DJ + 2·Q·σ_RJ extrapolates a short measurement to the 10⁻¹²-class error rates products must meet." },
          { question: "Contrast FFE, CTLE, and DFE.", answer: "FFE pre-distorts at the transmitter (boost transitions, de-emphasize repeats). CTLE is an analog high-frequency peaking filter at the receiver — simple but amplifies noise and crosstalk. DFE subtracts the predicted contribution of already-decided bits — cancels trailing ISI without noise amplification, at the cost of timing pressure and error propagation. DDR5 receivers include DFE." },
          { question: "Why does ISI produce pattern-dependent failures?", answer: "The channel has memory: its band-limited response makes each bit's waveform depend on the run of bits before it, so edges shift and eyes close differently for different data patterns — which is why validation stress uses worst-case patterns, not random data alone." },
        ],
      },
    ],
    sources: [keysightJitter, bogatinSiBook, tekDdrValidation],
    related: ["ddr-interface-signaling-and-training", "pcb-materials-and-impedance", "return-paths-and-stackup", "signals-and-power-over-distance", "lab-instruments-and-measurement"],
  },
  {
    slug: "memory-validation-and-margining",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "Memory validation & margining",
    summary: "Taking a memory subsystem from first power-on to production: the bring-up ladder, shmoo plots and eye margining, stress patterns and corner matrices, vendor interoperability, and the failure-signature taxonomy that routes a bug to silicon, board, training, controller, or firmware.",
    readingTime: 20,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Validation is the path from 'it trained once' to 'it ships'",
        body: [
          "A memory subsystem passes through distinct proof stages, and knowing which stage a problem belongs to is half of working effectively. First silicon bring-up asks the existential questions: do the rails sequence, does the PHY initialize, does training complete at a conservative speed, can a single pattern write and read back — the general board bring-up ladder applied to the memory path, where the first success criterion is simply a trained channel at any speed. Feature enablement then turns on the machinery one piece at a time — higher speed bins, ECC, power states, retraining loops — proving each in isolation. Characterization maps the margins: sweeps of timing, voltage, temperature, and frequency across a population of boards and DRAM vendors, producing the data that decides shipping operating points and guardbands. Qualification proves reliability statistically over corners and time, and production test distills everything into the minutes-long, high-coverage screen each manufactured unit gets.",
          "The through-line is that later stages consume the earlier stages' data. Shipping settings are chosen from characterization margins; production limits are set from qualification distributions; a field return is debugged against its own production record. That is why disciplined data retention — every unit's training results, margins, and test outcomes, keyed by serial number — is not bureaucracy but the raw material of the whole methodology, and why a validation engineer's scripts and databases matter as much as their scope skills.",
        ],
      },
      {
        type: "prose",
        heading: "Margining: shmoos, eyes, and the distance to the cliff",
        body: [
          "The core measurement of validation is margin: how far the operating point sits from failure in every direction that matters. The classic instrument is the shmoo plot — sweep two parameters (frequency against voltage, timing offset against Vref, temperature against refresh interval) over a grid, run a pass/fail test at each point, and plot the boundary. The passing region's shape is diagnostic in itself: a clean rectangular region says margins are independent; a sloped boundary says the parameters trade against each other (more voltage buys more speed — a supply-limited edge); ragged or non-monotonic boundaries suggest resonances, marginal training, or a bimodal population. The shipped operating point must sit inside the region with guardband on every side — margin-to-failure measured, guardband policy applied, and the difference documented.",
          "Modern PHYs make the per-bit version of this cheap: their internal sampling machinery can offset the capture point in time and the threshold in voltage while hardware pattern generators run traffic, reading out a two-dimensional eye contour for every DQ bit in-system, with no probe, at speed, at temperature. Lane-by-lane eye maps across a population of boards are the workhorse health metric of memory validation: a lane whose eye is systematically narrower than its neighbours on every board is a layout finding; one narrow on a single board is an assembly finding; all lanes shrinking together with temperature is a supply, drift-tracking, or refresh finding. The taxonomy of how margins fail routes the investigation before any hypothesis is formed.",
        ],
      },
      {
        type: "code",
        heading: "The shape of a margin sweep",
        intro: "Validation automation is scripting: sweep a parameter against the trained center, find the failing edges, log everything per unit. This skeleton is the pattern behind timing shmoos, Vref sweeps, and frequency-voltage maps alike.",
        language: "python",
        code: "def margin_sweep(lane, param, center, step, test):\n    \"\"\"Walk param out from trained center until failure, both directions.\n    Returns (low_edge, high_edge) — the passing window for this lane.\"\"\"\n    edges = []\n    for direction in (-1, +1):\n        offset = 0\n        while True:\n            offset += direction * step\n            set_param(lane, param, center + offset)\n            if not test(lane):                 # stress pattern at this point\n                edges.append(center + offset - direction * step)\n                break\n    set_param(lane, param, center)             # always restore the center\n    return tuple(edges)\n\nfor lane in lanes:\n    lo, hi = margin_sweep(lane, \"rx_dqs_delay\", trained[lane], step=1, test=run_pattern)\n    log(unit_id, lane, lo, hi, temp=read_temp(), vddq=read_rail())\n    # Margin = min(trained-lo, hi-trained); flag lanes below guardband.",
      },
      {
        type: "prose",
        heading: "Stress patterns and the corner matrix",
        body: [
          "Random data is a weak test, because the failure mechanisms are pattern-shaped. A stress suite is built from mechanism-targeted patterns: walking ones and zeros (isolate stuck or coupled bits), checkerboards and inversions (worst-case adjacent-cell and adjacent-line stress), PRBS streams (rich spectral content exercising ISI), simultaneous-switching patterns (all lanes firing together to provoke SSO and PDN droop, with DBI disabled to reach the true worst case), victim-aggressor crosstalk patterns (quiet victim lane amid maximally active neighbours), row-hammer sequences (single-, double-, and many-sided), and refresh-stress patterns (write, wait a full retention interval at temperature, read). Each pattern is a designed experiment against a named mechanism — a failing pattern is evidence about the physics, not just a red light.",
          "Patterns then multiply by corners: supply voltages at spec limits (±5% on VDD/VDDQ, and skewed combinations), temperature from cold start to hot chamber (retention halves, timings shift, trained points drift — including the transition, since thermal ramp catches drift-tracking failures that static soak misses), frequency across the supported bins, and — the corner engineers forget — the population itself: multiple DRAM vendors, densities, and lots, because the controller must interoperate with every device the product will ever ship with, and vendor-to-vendor variation in training behaviour and margin profile is real. The full matrix is enormous; the craft is sampling it intelligently — full coverage at characterization on few units, reduced high-yield-of-information subsets in regression and production.",
        ],
      },
      {
        type: "table",
        heading: "Failure signatures and where they point",
        columns: ["Signature", "Likely domain", "Next move"],
        rows: [
          ["Single bit, fixed address, survives rewrite corners", "Hard cell/board fault", "Map to physical cell/net; PPR or rework"],
          ["Single bits, wandering, temperature-sensitive", "Retention / VRT", "Refresh-interval sweep at temperature"],
          ["One byte lane degraded, all addresses", "Training / SI on that lane", "Per-bit eye readout; compare population; inspect routing"],
          ["One rank or bank group, logical stripe", "Controller config / address mapping", "Audit timing registers and map; corner-independent repro"],
          ["Pattern-dependent, worst on SSO/PRBS", "SI: crosstalk, ISI, PDN", "Pattern bisection; eye vs pattern; PDN measurement"],
          ["Fails after idle or thermal ramp only", "Power-state exit / drift tracking", "Exercise state transitions; check retraining cadence"],
          ["Appears only past ECC threshold (cliff)", "Masked marginality", "Read corrected-error counters; margin with ECC visibility"],
          ["One board only, population clean", "Assembly: solder, discretes, damage", "Swap/X-ray/inspect; follow the failure across boards"],
        ],
      },
      {
        type: "prose",
        heading: "Debug: the structured method applied to memory",
        body: [
          "Memory debug is the hypothesis-isolate-measure-confirm loop with a domain-specific first move: classify the failure's signature along the table's axes — physical versus logical resource, corner-dependent versus deterministic, pattern-sensitive versus pattern-blind, one unit versus population — because the classification does most of the localization before any instrument is touched. Then bisect the remaining space: sweep the suspect timing parameter and watch the failure track it; disable a feature (ECC, DBI, a power state, retraining) and see whether the signature changes; move the DIMM or swap the DRAM and see whether the failure follows the part or stays with the socket; drop the frequency and see whether margin returns. Every one of these is a single-variable experiment, logged, in the discipline of the structured-debugging note — with the memory-specific addition that statistical failures need statistical verification: a fix for a 10⁻¹⁰ failure is confirmed by error-rate measurement over time, not by one clean pass.",
          "Cross-team fluency is part of the same skill: the fix for what validation finds may live in silicon (a PHY errata, a training-algorithm change), the board (a routing or PDN revision), firmware (training parameters, timing tables, retraining cadence), or the controller configuration — so the finding must be packaged with the evidence each audience needs: eye data and margins for silicon teams, per-lane and per-net correlation for board designers, register-level repro recipes for firmware. The validation engineer sits at the junction, and the report that names the failing mechanism with data — not just the failing test — is the work product that moves the fix.",
        ],
      },
      {
        type: "callout",
        heading: "Margin is the product; pass/fail is just its shadow",
        body: "A system that passes every test can still be one hot day from failure — pass/fail at nominal proves nothing about distance to the cliff. Measure margins (time, voltage, temperature, refresh) per lane and per unit, enforce guardbands against the worst of the population at the worst corner, keep per-serial records, and treat any margin regression between builds as a bug even when everything still passes. Shipping happens on margin data.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Validation review",
        items: [
          "Stage the work: bring-up (does it train), enablement (each feature alone), characterization (margins), qualification (statistics), production (fast screens).",
          "Shmoo the meaningful pairs (V×f, timing×Vref, temp×refresh) and read the boundary's shape, not just its size.",
          "Use PHY internal eye scans for per-bit, in-system margin; compare lanes across the population to separate layout from assembly findings.",
          "Build the stress suite from mechanisms: walking bits, checkerboard, PRBS, SSO (DBI off), victim-aggressor, hammer, retention.",
          "Cover the real corner matrix: voltage skews, thermal ramps (not just soaks), all speed bins, all DRAM vendors and lots.",
          "Classify failures by signature (physical/logical, corner, pattern, population) before hypothesizing; bisect with single-variable experiments.",
          "Verify statistical failures statistically; confirm fixes by error rate, not one clean run.",
          "Keep per-unit records — training results, margins, outcomes — as the foundation for regression and field-return debug.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What are the stages from first silicon to production, and what does each prove?", answer: "Bring-up proves the channel trains and moves data at all; feature enablement proves each capability (speed bins, ECC, power states) in isolation; characterization maps margins across corners and vendors; qualification proves reliability statistically; production test screens every unit quickly. Each stage's data feeds the next." },
          { question: "What is a shmoo plot and what does its boundary shape tell you?", answer: "A 2-D pass/fail sweep of two parameters. Rectangular boundary: independent margins. Sloped: the parameters trade (e.g. voltage buys speed). Ragged/non-monotonic: resonances, marginal training, or bimodal population. The operating point must sit inside with documented guardband." },
          { question: "Why do stress suites use designed patterns instead of random data?", answer: "Failure mechanisms are pattern-shaped: SSO needs all lanes switching, crosstalk needs quiet victims among active aggressors, ISI needs specific run lengths, retention needs write-wait-read at temperature, hammer needs aggressor sequences. Each pattern is an experiment against a named mechanism, so a failure carries diagnostic information." },
          { question: "A failure appears only on one byte lane at high temperature. Walk the reasoning.", answer: "One lane = physical domain (channel/training), not controller logic. Temperature dependence = analog margin, not a stuck fault. Next: read that lane's eye across temperature, compare with the population (systematic = layout; one board = assembly), check drift tracking/retraining cadence, and sweep the lane's trained delay to measure remaining margin." },
        ],
      },
    ],
    sources: [tekDdrValidation, micronDesignGuide, keysightJitter],
    related: ["ddr-interface-signaling-and-training", "high-speed-signal-integrity", "memory-controllers-and-scheduling", "memory-reliability-ecc-and-rowhammer", "structured-hardware-debugging", "board-bring-up-methodology"],
  },
];
