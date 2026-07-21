import type { Note, Source } from "./library";

const tiLvdsManual: Source = {
  title: "LVDS Owner's Manual — Differential Signaling",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/ml/snla187/snla187.pdf",
  kind: "Documentation",
};

const adDiffCommonMode: Source = {
  title: "A Beginner's Guide to Differential and Common-Mode Signals",
  publisher: "Analog Devices",
  url: "https://www.analog.com/en/resources/analog-dialogue/articles/differential-and-common-mode-signals.html",
  kind: "Reference",
};

const tiRs485Guide: Source = {
  title: "The RS-485 Design Guide (SLLA272)",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/an/slla272d/slla272d.pdf",
  kind: "Documentation",
};

const johnsonHighSpeed: Source = {
  title: "High-Speed Digital Design: A Handbook of Black Magic",
  publisher: "Howard Johnson & Martin Graham, Prentice Hall",
  url: "https://www.sigcon.com/",
  kind: "Book",
};

export const interviewSignalingNotes: Note[] = [
  {
    slug: "single-ended-vs-differential-signaling",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "Single-ended vs differential signaling",
    summary: "Why USB, CAN, RS-485, and Ethernet go differential: common-mode rejection at the receiver, cancellation of ground offset and coupled noise, lower emissions, and the costs — termination, common-mode range, and skew-driven mode conversion.",
    readingTime: 15,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The receiver's reference is the whole difference",
        body: [
          "A single-ended signal is a voltage on one wire, measured against a shared ground: the receiver reads V(signal) − V(ground) and calls it the logic level. That is simple and cheap and works beautifully on a small board with a quiet, shared ground plane. Its unspoken assumptions are that the ground the transmitter drives against and the ground the receiver measures against are the same potential, and that nothing couples onto the signal wire on the way. The moment a signal leaves the board — down a cable, across a connector, between two boxes — both assumptions break.",
          "A differential signal carries information as the difference between two wires driven as a pair, typically equal and opposite around a common center. The receiver measures V(+) − V(−) and, crucially, ignores whatever is common to both wires. That single change — measuring a difference instead of an absolute — is what lets differential links survive the electrically hostile world outside the enclosure. It is not a faster or fancier version of single-ended; it is a different reference philosophy, and understanding why it rejects noise is the whole point.",
        ],
      },
      {
        type: "formula",
        heading: "Differential and common-mode decomposition",
        formula: "V_diff = V(+) − V(−)      V_cm = ½·[V(+) + V(−)]      CMRR = 20·log₁₀( A_diff / A_cm )  [dB]",
        explanation: "Any pair of wire voltages splits cleanly into a differential part (the wanted signal, the difference) and a common-mode part (the average, shared by both). Noise picked up from the environment, and the ground-potential difference between transmitter and receiver, appear almost entirely as common mode — they push both wires the same way. A differential receiver amplifies V_diff and rejects V_cm; how well it does so is the common-mode rejection ratio (CMRR), the ratio of differential gain to common-mode gain in decibels. High CMRR means a large common-mode disturbance leaks through as only a tiny differential error. This is the same CMRR that makes an instrumentation amplifier valuable, applied to a transmission line.",
        terms: [
          { symbol: "V_diff", meaning: "Wanted differential signal", unit: "V" },
          { symbol: "V_cm", meaning: "Common-mode voltage (average of the pair)", unit: "V" },
          { symbol: "CMRR", meaning: "Common-mode rejection ratio", unit: "dB" },
        ],
      },
      {
        type: "prose",
        heading: "Why coupled noise and ground offset cancel",
        body: [
          "Run two wires close together — ideally twisted — through a noisy environment. A nearby switching current couples magnetically and capacitively onto both wires, but because they occupy nearly the same space, they pick up nearly the same interference. That shared interference is common mode, and the receiver's subtraction cancels it. Twisting is what makes the coupling equal: each twist swaps the two wires' positions relative to the interfering field, so over a full twist their induced voltages match and any residual loop area is tiny. An untwisted or asymmetric pair breaks the equality and lets some noise convert to differential.",
          "Ground offset is the other killer that differential defeats. Two enclosures tens or hundreds of meters apart do not share a ground; currents flowing in the building steel, safety earth, and cable shields put their local grounds at different potentials — often volts, sometimes far more during a fault or a nearby lightning strike. A single-ended receiver would add that entire ground difference to the signal and misread it or be damaged. A differential receiver sees the ground offset as common mode and rejects it, up to its specified common-mode input range. This is why every serious off-board or long-run link — RS-485 on a factory floor, CAN in a vehicle, Ethernet across a building, USB down a cable — is differential.",
        ],
      },
      {
        type: "prose",
        heading: "Differential also emits less",
        body: [
          "The benefit runs both directions. In a differential pair the forward and return currents are equal and opposite and share almost the same path, so their magnetic fields nearly cancel in the far field — the pair is a poor antenna. A single-ended signal, by contrast, returns through the ground plane along whatever path it can find, forming a larger loop that radiates. So going differential simultaneously improves immunity (rejecting incoming noise) and reduces emissions (radiating less outgoing noise), which is exactly why the standards that must pass strict EMC and cross hostile distances all chose it. The cancellation is only as good as the balance, though: anything that makes the two lines asymmetric — length mismatch, an impedance discontinuity on one side, a broken reference under one trace — converts some differential energy to common mode, and common-mode current on a cable is the classic radiated-emissions failure.",
        ],
      },
      {
        type: "table",
        heading: "Single-ended vs differential at a glance",
        columns: ["Property", "Single-ended", "Differential"],
        rows: [
          ["Reference", "Signal vs shared ground", "One wire vs the other (difference)"],
          ["Wires/pins per signal", "One + shared return", "Two, matched"],
          ["Noise immunity", "Poor off-board; no CM rejection", "High — rejects common-mode noise and ground offset"],
          ["Emissions", "Larger return loop radiates", "Fields cancel; low emissions when balanced"],
          ["Reach", "Short, on-board", "Long cables, between enclosures"],
          ["Cost/complexity", "Minimal", "Diff drivers/receivers, matched routing, termination"],
          ["Examples", "GPIO, on-board SPI/I2C/UART", "USB, CAN, RS-485, Ethernet, LVDS"],
        ],
      },
      {
        type: "prose",
        heading: "The costs: termination, common-mode range, and skew",
        body: [
          "Differential is not free, and knowing its limits is as important as knowing its virtues. First, the pair is a transmission line and must be terminated in its characteristic (differential) impedance — 90–100 Ω for USB and Ethernet, 120 Ω for CAN and RS-485 — or reflections corrupt the signal; the termination resistor also sets the loading and, in multi-drop buses like RS-485, must sit only at the physical ends of the trunk. Second, the receiver has a finite common-mode input range (RS-485, for instance, tolerates roughly −7 V to +12 V of common mode): reject noise beyond that window and the rejection simply fails, so long links add common-mode chokes, bias networks, or isolation to keep the common mode inside range. Third, the two lines must be length- and impedance-matched: intra-pair skew — one line's signal arriving slightly before the other's — is differential-to-common-mode conversion, which both erodes the timing margin (the eye closes) and creates the common-mode current that radiates. This is why high-speed layout obsesses over matching the P and N trace lengths, keeping the pair tightly and symmetrically coupled, and maintaining a continuous reference beneath both.",
          "On a short on-board hop none of that overhead pays off, so single-ended remains the right default for GPIO, on-board SPI, I2C, and short UART: fewer pins, simpler routing, less silicon. The engineering judgment is matching the signaling to the channel — single-ended where the ground is shared and clean and the distance is millimeters, differential the instant a signal must survive a cable, a connector, a ground offset, or an EMC limit.",
        ],
      },
      {
        type: "callout",
        heading: "Differential is not magic — balance is the whole trick",
        body: "All the benefits assume the two lines are truly symmetric: equal coupling to noise, equal length, equal impedance, a continuous shared reference, and common mode kept inside the receiver's range. Break the symmetry — mismatched trace lengths, a split plane under one trace, an unbalanced termination — and you get mode conversion: the wanted differential signal leaks into common mode (radiating) and noise leaks back into differential (corrupting). Most differential 'noise' problems are really balance problems.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Differential link review",
        items: [
          "Confirm the channel actually needs differential: off-board, long run, ground offset, or EMC pressure.",
          "Terminate the pair in its differential characteristic impedance; place terminators correctly for the topology (bus ends only for multi-drop).",
          "Check the receiver's common-mode input range against the worst-case ground offset; add chokes, bias, or isolation if exceeded.",
          "Match P/N trace lengths and keep the pair tightly, symmetrically coupled over a continuous reference plane.",
          "Route the pair to minimize skew; every picosecond of intra-pair skew is mode conversion (EMI + lost margin).",
          "Keep single-ended for short on-board hops where the shared ground is clean.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why do USB, CAN, RS-485, and Ethernet all use differential signaling?", answer: "Because they cross cables, connectors, and distances where coupled noise and ground-potential differences appear as common mode. A differential receiver subtracts the two lines and rejects that common mode, and the balanced pair also radiates far less." },
          { question: "What is common-mode voltage, and how does a receiver reject it?", answer: "It is the average of the two line voltages — the part shared by both, where coupled noise and ground offset land. The differential receiver amplifies the difference and ignores the average; CMRR quantifies how well." },
          { question: "Why must a differential pair be length-matched?", answer: "Intra-pair skew converts differential energy to common mode. That closes the receiver eye (lost timing margin) and creates common-mode current on the cable — the usual radiated-emissions failure." },
          { question: "What limits how much common-mode noise differential can reject?", answer: "The receiver's finite common-mode input range. Beyond that window rejection fails, so long links use common-mode chokes, biasing, or galvanic isolation to keep the common mode in range." },
        ],
      },
    ],
    sources: [tiLvdsManual, adDiffCommonMode],
    related: ["choosing-a-communication-interface", "rs485-differential-serial", "can-bus", "emi-emc-pcb-design", "signals-and-power-over-distance"],
  },
  {
    slug: "signals-and-power-over-distance",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "Signals & power over distance: cable length, loss & noise",
    summary: "How cable length changes everything: IR drop and I²R loss on power, transmission-line reflections and frequency-dependent attenuation on signals, and the growing noise pickup and ground offset that push long links toward differential, twisted, terminated wiring.",
    readingTime: 17,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Length turns an ideal wire into a real one",
        body: [
          "A few centimetres of trace on a board behaves almost like the ideal wire of a schematic: negligible resistance, negligible delay, no meaningful noise pickup. Stretch that same connection into a cable running metres or hundreds of metres and three things that were free start to cost you. On the power side, the conductor's resistance drops voltage and burns energy as heat. On the signal side, the wire becomes a transmission line — long enough that propagation delay and reflections matter — and it acts as a low-pass filter that attenuates the fast edges the further they travel. And on both sides, the longer conductor picks up more coupled noise and sees a larger ground-potential difference between its two ends. The question 'what is the best way for data to travel down a wire' is really the question of how to manage all three at once.",
          "The useful way to hold this is that length converts idealizations into budgets. A voltage-drop budget for power, a timing-and-reflection budget for edges, an attenuation-and-bandwidth budget for data rate, and a noise-margin budget for the environment. Each budget has its own mitigations, and the right cable, protocol, and signaling scheme fall out of which budgets bind first for a given distance and data rate.",
        ],
      },
      {
        type: "prose",
        heading: "Power over a cable: IR drop and I²R loss",
        body: [
          "A conductor has resistance R = ρL/A — proportional to length and inversely proportional to cross-section — so a longer or thinner cable has more resistance, and both the outgoing and the return conductor count. That resistance does two things. It drops voltage: the load sees V_source − I·R, so a 5 V rail delivering 2 A down a cable with 0.5 Ω of round-trip resistance arrives as 4 V, a full volt lost before the device even runs. And it dissipates power: P_loss = I²·R, heating the cable and wasting energy that never reaches the load. The voltage drop is why a device far from its supply can brown out under load while measuring fine at idle, and why heavier wire gauge (lower AWG number) is the blunt fix — more copper, less resistance.",
          "The powerful lever is not thicker wire but higher voltage. For a fixed power P = V·I, raising the delivery voltage lowers the current, and because loss goes as current squared, halving the current quarters the I²R loss for the same delivered power. This single fact explains an enormous amount of engineering: the electrical grid distributes at high voltage to move power across a country, PoE chose ~48 V rather than 5 V to send tens of watts down thin twisted pairs, and USB-C Power Delivery negotiates up to 20 V (and beyond) precisely so a fast charger can push high power through a slim cable without melting it or collapsing the voltage. When the drop still cannot be avoided, remote (Kelvin) sensing closes the loop at the load — the regulator senses the voltage at the far end through separate sense wires that carry no current, and raises its output to compensate for the drop in the power conductors.",
        ],
      },
      {
        type: "formula",
        heading: "Cable resistance, drop, and loss",
        formula: "R = ρ·L / A     V_drop = I·R     P_loss = I²·R     (for fixed P: I = P/V, so P_loss = (P/V)²·R)",
        explanation: "Resistance scales with length over cross-sectional area, so long thin cables drop and dissipate the most. Voltage drop is linear in current; power loss is quadratic. The last form is the key design insight: because loss depends on current squared and current is power over voltage, delivering the same power at a higher voltage cuts the loss by the square of the voltage ratio — the reason long-distance power and modern fast-charging both push voltage up and current down.",
        terms: [
          { symbol: "ρ, L, A", meaning: "Resistivity, conductor length, cross-section", unit: "Ω·m, m, m²" },
          { symbol: "I", meaning: "Delivered current (both conductors carry it)", unit: "A" },
          { symbol: "P_loss", meaning: "Power dissipated heating the cable", unit: "W" },
        ],
      },
      {
        type: "prose",
        heading: "Signals over a cable: when a wire becomes a transmission line",
        body: [
          "A wire stops behaving like a simple node and starts behaving like a transmission line when the time a signal takes to travel it becomes comparable to the signal's own rise time. Signals propagate through cable at roughly 60–70% of the speed of light — about 5 ns per metre — so a 10 m cable delays an edge by ~50 ns and the round trip by ~100 ns. The rule of thumb is that reflections matter once the round-trip delay is a meaningful fraction of the rise time (a common threshold is round-trip delay greater than about a sixth of the rise time); crucially it is the edge rate, not the clock frequency, that decides — a slow 1 kHz square wave with 1 ns edges still rings on a long line. When a line is 'electrically long,' any impedance mismatch between the cable's characteristic impedance and the source or load reflects part of the wave back, producing ringing, overshoot, and undershoot that can double-clock a receiver or violate its thresholds.",
          "The fix is termination: match the source and/or the far end to the cable's characteristic impedance (50 Ω for much coax, 100 Ω for a USB/Ethernet differential pair, 120 Ω for CAN and RS-485) so the wave is absorbed rather than reflected. Series (source) termination, parallel (end) termination, and AC termination each trade power, DC level, and edge shape differently. This is the same characteristic-impedance discipline used on fast board traces, just made unavoidable by the extra length of a cable — and it is why fast interfaces specify their cable impedance as tightly as their connectors.",
        ],
      },
      {
        type: "prose",
        heading: "Attenuation and bandwidth: why cables have length limits",
        body: [
          "Beyond reflections, a cable is a distributed low-pass filter, and it filters more the longer it is. Two mechanisms attenuate the high-frequency content that makes up a signal's sharp edges: skin effect raises the conductor's effective resistance with frequency (current crowds to the surface), and dielectric loss in the insulation grows with frequency too. The result is that a long cable rounds off edges, smears pulses into each other, and closes the receiver's eye — so the maximum usable data rate falls as length rises. This is the bandwidth-length trade you see everywhere: passive USB and HDMI cables have hard length limits, and RS-485 famously trades speed for distance, carrying many megabits over a few metres but only tens of kilobits over its full ~1200 m reach. Push rate and length together past the cable's budget and bit errors climb.",
          "When a single passive cable cannot span the distance at the rate you need, the toolbox is graduated: equalization and pre-emphasis pre-distort the signal to cancel the cable's roll-off, active redrivers and retimers regenerate the waveform partway along, and for the longest or most hostile runs the signal goes optical — fibre has enormous bandwidth, immunity to electromagnetic noise, and no ground connection at all. Each step buys length or rate at the cost of power, complexity, and money, so the design chooses the cheapest option whose budget closes.",
        ],
      },
      {
        type: "prose",
        heading: "Noise and why differential wins over distance",
        body: [
          "Length also makes a wire a better antenna and a bigger loop, so it picks up more of the environment. Capacitive and inductive coupling from nearby switching, motors, and radios scale with the exposed length and the loop area the conductors enclose, and — just as important — the further apart the two ends of a cable are, the larger the difference between their local grounds, because distant grounds do not share a potential and carry their own currents. A single-ended signal, referenced to a local rail or simply pulled up to a logic voltage, delivers all of that coupled noise and ground offset straight into the receiver's decision threshold, which is exactly why single-ended buses that are perfect on a board fall apart down a cable.",
          "This is the core reason long and off-board links go differential rather than single-ended. A differential pair carries the signal as the difference between two wires, and coupled noise and ground offset appear almost equally on both — as common mode — so the receiver subtracts them away, up to its common-mode range. Twisting the pair shrinks the loop area and equalizes the pickup so the cancellation holds; a shield drains coupled currents to a controlled point; and where the ground offset is large or dangerous, galvanic isolation breaks the ground loop entirely. It is no accident that every serious wired link built for distance — RS-485 on a factory floor, CAN in a vehicle, Ethernet across a building, USB down a cable — is a terminated, twisted, differential pair. (See the companion note on single-ended vs differential signaling for the rejection mechanism in detail.)",
        ],
      },
      {
        type: "table",
        heading: "What grows with cable length",
        columns: ["Factor", "Effect over distance", "Mitigation"],
        rows: [
          ["Series resistance", "Voltage drop and I²R heating on power", "Heavier gauge; deliver at higher V / lower I; remote sense"],
          ["Propagation delay", "Reflections, ringing, skew when electrically long", "Terminate at the cable's characteristic impedance; length-match"],
          ["Attenuation (skin + dielectric)", "Rounded edges, closed eye, lower max data rate", "Lower rate; equalization/pre-emphasis; redrivers/retimers; optical"],
          ["Coupled noise & ground offset", "Bit errors, brown-outs, corrupted data", "Differential + twisted pair; shielding; galvanic isolation"],
        ],
      },
      {
        type: "callout",
        heading: "The best way to send data down a long wire",
        body: "A differential, twisted pair, terminated at its characteristic impedance, run at a data rate the cable's bandwidth actually supports, carried by a protocol with error detection and retransmission, and isolated where the two ends' grounds may differ. Single-ended, pulled-up logic is fine on a board and unreliable over distance. For power over the same run, push the voltage up and the current down, size the conductor for the drop, and sense at the load if the drop still bites.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Long-link review",
        items: [
          "Budget the voltage drop and I²R loss for the worst-case current; size the gauge and consider a higher distribution voltage.",
          "Decide whether the line is electrically long from the edge rate, not the clock, and terminate at the characteristic impedance if it is.",
          "Check the cable's attenuation at the needed data rate over the full length; add equalization, redrivers, or fibre if the eye closes.",
          "Use a differential, twisted (and if needed shielded) pair for any off-board or long run; keep single-ended for short on-board hops.",
          "Confirm the receiver's common-mode range covers the worst-case ground offset; isolate if it does not.",
          "Layer a protocol with CRC and retransmission over the physical link so residual errors are caught.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How does cable length affect power delivery, and what's the main lever?", answer: "Resistance grows with length, so voltage drop (I·R) and heating (I²·R) grow. The strongest lever is delivering at higher voltage and lower current, because loss falls with the square of current — the reason PoE uses 48 V and USB-C PD negotiates up higher for fast charging over thin cable." },
          { question: "When does a wire become a transmission line, and what fixes the result?", answer: "When its round-trip propagation delay becomes a meaningful fraction of the signal's rise time (edge rate, not clock frequency). Then impedance mismatches cause reflections and ringing, fixed by terminating at the cable's characteristic impedance." },
          { question: "Why does a long cable limit the maximum data rate?", answer: "A cable is a distributed low-pass filter — skin effect and dielectric loss attenuate high frequencies more, and more so with length — so edges round off and the eye closes. Hence the bandwidth-length trade (RS-485 trades speed for its 1200 m reach; USB/HDMI have length limits)." },
          { question: "Why do long links go differential instead of single-ended pull-up?", answer: "Length increases coupled noise and the ground-potential difference between the two ends. A single-ended signal carries that offset into its threshold and fails, while a differential twisted pair sees it as common mode and rejects it — so RS-485, CAN, Ethernet, and USB are all terminated differential pairs." },
        ],
      },
    ],
    sources: [tiRs485Guide, johnsonHighSpeed],
    related: ["single-ended-vs-differential-signaling", "choosing-a-communication-interface", "rs485-differential-serial", "connector-and-cable-interfaces", "power-architecture-and-poe"],
  },
];
