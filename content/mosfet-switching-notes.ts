import type { Note, Source } from "./library";

const tiGateDriver: Source = {
  title: "Fundamentals of MOSFET and IGBT Gate Driver Circuits (SLUA618)",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/ml/slua618a/slua618a.pdf",
  kind: "Documentation",
};

const ericksonPowerElectronics: Source = {
  title: "Fundamentals of Power Electronics (3rd ed.)",
  publisher: "Erickson & Maksimović, Springer",
  url: "https://link.springer.com/book/10.1007/978-3-030-43881-4",
  kind: "Book",
};

const infineonMosfetLosses: Source = {
  title: "Power MOSFET switching losses and gate-charge application notes",
  publisher: "Infineon Technologies",
  url: "https://www.infineon.com/cms/en/product/power/mosfet/",
  kind: "Reference",
};

const tiIdealDiode: Source = {
  title: "Ideal Diodes / ORing controllers — overview",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/power-management/ideal-diodes-oring/overview.html",
  kind: "Reference",
};

export const mosfetSwitchingNotes: Note[] = [
  {
    slug: "mosfet-switching-and-miller-plateau",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "MOSFET switching transition & the Miller plateau",
    summary: "A phase-by-phase walk through hard-switching turn-on and turn-off: the turn-on delay, current rise, the Miller plateau where the drain voltage swings, full enhancement — where switching loss comes from, how the gate resistor sets it, and Miller-induced false turn-on.",
    readingTime: 18,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Switching loss lives in the transition, not the on-state",
        body: [
          "A MOSFET's conduction loss is a steady, undramatic I²·RDS(on) that you compute once and cool for. Switching loss is different: it is paid in the few nanoseconds of each turn-on and turn-off, when the drain voltage and drain current briefly overlap and the device dissipates a burst of power, and it is paid on every single switching cycle — so it scales directly with frequency and it is what limits how fast a converter can switch. Understanding it means understanding the transition as a process that unfolds in stages, and the gate-charge curve is the map of that process. The centre of the story is the Miller plateau, the flat stretch of the gate-voltage waveform where the drain voltage does its swing.",
          "The key mental shift is that although a MOSFET is a voltage-controlled device, switching it is a current problem: the gate is a set of nonlinear capacitances, and moving through a transition means pushing charge into or pulling it out of those capacitances through the gate-loop impedance. How fast that charge moves sets how fast the drain voltage and current change, and therefore how much energy is lost in the overlap. Walking the turn-on phase by phase makes every one of those relationships concrete.",
        ],
      },
      {
        type: "prose",
        heading: "Turn-on, phase by phase (clamped inductive load)",
        body: [
          "Take the standard hard-switching cell — a MOSFET switching current into a clamped inductive load, with a freewheel path (a diode or the complementary switch) carrying the load current beforehand. Turn-on has four phases. Phase 1, the turn-on delay: the driver charges the input capacitance and the gate voltage V_GS rises from zero toward the threshold V_th. Nothing happens at the drain yet — drain current is zero and the drain sits at the full bus voltage. Phase 2, the current rise: once V_GS passes V_th, the device enters its transfer characteristic and drain current rises from zero toward the load current, following I_D ≈ g_fs·(V_GS − V_th). But because the load is inductive and clamped, the freewheel element keeps conducting until I_D reaches the full load current, so the drain voltage stays high at nearly the bus voltage throughout this phase. High voltage and rising current overlap — the first slice of switching loss.",
          "Phase 3 is the Miller plateau, where the real drama happens. Once drain current has reached the load current, the freewheel path stops conducting and the drain voltage begins to fall. During this fall V_GS stops rising and holds flat at the plateau voltage — the gate voltage just sufficient to carry the load current per the transfer curve — because all of the gate current is now being diverted into the gate-to-drain (Miller) capacitance C_gd to supply the charge the collapsing drain voltage demands. The drain swings from the bus voltage down to nearly zero while the current is already at full load: this is where most of the turn-on switching loss is dissipated, and its duration is the Miller charge Q_gd divided by the gate current. Phase 4 is full enhancement: with the drain already low, V_GS resumes rising to the full drive voltage, driving R_DS(on) down to its final value and reducing conduction loss — but the switching event, and its loss, is essentially over by the end of phase 3.",
        ],
      },
      {
        type: "formula",
        heading: "The plateau sets the voltage-transition time and the loss",
        formula: "V_GS(plateau) ≈ V_th + I_load/g_fs      t_plateau = Q_gd / I_g      I_g ≈ (V_drive − V_GS(plateau)) / R_g",
        explanation: "The plateau voltage is the gate voltage that supports the actual load current on the transfer curve, so it rises with load — a heavily loaded device plateaus higher. During the plateau the gate current I_g is set by the drive voltage above the plateau divided by the total gate-loop resistance, and that current has to deliver the Miller charge Q_gd to swing the drain, so the voltage-transition time is simply Q_gd divided by I_g. Everything about switching speed at the drain is controlled here: more gate current (stronger driver, smaller gate resistor) means a shorter plateau and a faster, lower-loss voltage transition. This is why Q_gd, not total gate charge, is the number that predicts switching loss.",
        terms: [
          { symbol: "V_GS(plateau)", meaning: "Miller plateau gate voltage", unit: "V" },
          { symbol: "Q_gd", meaning: "Gate-to-drain (Miller) charge", unit: "C" },
          { symbol: "I_g / R_g", meaning: "Gate-loop current / resistance", unit: "A / Ω" },
        ],
      },
      {
        type: "prose",
        heading: "Turn-off is the mirror image, and dead time lives here",
        body: [
          "Turn-off runs the same phases in reverse, and it is often the more delicate transition. First V_GS falls from the full drive voltage down to the plateau (a turn-off delay with no drain change). Then, on the plateau, the drain voltage rises from its low on-state value back up toward the bus voltage while V_GS is again clamped and the driver must sink the Miller current out of C_gd — the voltage rise happens with the current still at full load, producing the overlap loss. Only after the drain has risen does the current fall from the load current to zero, and finally V_GS collapses from the plateau to zero. The driver's job on turn-off is to sink charge fast; a weak pull-down lengthens the plateau, slows the drain-voltage rise, and increases loss, which is why gate drivers specify a strong, low-impedance sink.",
          "In a half bridge, turn-off of one device and turn-on of the other are separated by dead time — a deliberate gap where both are off so they can never conduct simultaneously and short the bus (shoot-through). During that gap the load current freewheels through a body diode or a parallel Schottky. Too little dead time risks overlap and shoot-through; too much wastes efficiency in the diode drop. The switching transition and the dead time are thus two halves of the same timing problem, and they are why the buck-converter first-principles note treats synchronous rectification and dead time together.",
        ],
      },
      {
        type: "formula",
        heading: "Switching loss is the area under the V-I overlap",
        formula: "E_on ≈ ½·V_bus·I_load·(t_rise_i + t_fall_v)      P_sw ≈ (E_on + E_off)·f_sw   (+ ½·C_oss·V_bus²·f_sw + Q_rr·V_bus·f_sw)",
        explanation: "During the current-rise and voltage-fall intervals (and their turn-off mirrors) the drain voltage and current overlap, so the instantaneous power V·I is large; integrating that overlap gives the energy lost per transition, approximated as a triangle of height V_bus·I_load and width equal to the transition time. Multiplying the per-event energy by switching frequency gives the switching power — which is why it grows linearly with frequency and why shortening the transitions (a shorter Miller plateau) cuts it. Two more per-cycle terms ride along: the output-capacitance energy ½·C_oss·V_bus² dumped at every hard turn-on, and the reverse-recovery charge Q_rr of the opposing diode swept out through the device. The full term-by-term ledger, including conduction loss, is in the MOSFET fundamentals & gate drive note.",
        terms: [
          { symbol: "E_on / E_off", meaning: "Turn-on / turn-off switching energy", unit: "J" },
          { symbol: "C_oss", meaning: "Output capacitance energy per turn-on", unit: "F" },
          { symbol: "Q_rr", meaning: "Reverse-recovery charge of the opposing diode", unit: "C" },
        ],
      },
      {
        type: "prose",
        heading: "The gate resistor is the switching-loss knob",
        body: [
          "Because the voltage-transition time is Q_gd divided by the gate current, and the gate current is set by the drive voltage above the plateau divided by the gate-loop resistance, the gate resistor is the single most direct lever on switching loss. Reduce it (or use a stronger driver) and the plateau shortens, the drain slews faster, and switching loss falls — but the faster dV/dt and dI/dt ring harder against loop and package inductance, radiate more EMI, and increase the risk of parasitic turn-on of the complementary device. Increase the gate resistor and the edges soften, ringing and EMI drop, but switching loss rises and the device spends longer in its lossy transition. This trade — speed and efficiency against EMI and robustness — is the central gate-drive design decision, and it is why many designs use separate turn-on and turn-off resistors (a resistor in series with a steering diode for each direction) so each edge can be tuned independently.",
          "Two parasitics change the picture at the margins. Common-source inductance — a few nanohenries of source bond wire and pin shared between the power loop and the gate loop — develops a voltage from the drain dI/dt that opposes the gate drive, slowing every transition and, in the worst case, causing oscillation; Kelvin-source packages separate the two loops and can cut switching loss by double-digit percentages. And the whole gate loop must be low-inductance and short, because at these edge rates the gate drive is itself a high-speed signal.",
        ],
      },
      {
        type: "prose",
        heading: "Miller-induced (parasitic) turn-on",
        body: [
          "The Miller capacitance that shapes the switching transition also creates a failure mode. In a half bridge, when one device turns on it slews the shared switch node quickly; that dV/dt appears across the off device's drain and pushes a current through its Miller capacitance C_gd into its gate. If the resulting voltage developed across the off device's gate-loop impedance lifts its V_GS above the threshold, the device that was supposed to be off partially turns on — parasitic turn-on — causing extra loss, cross-conduction, or, in the worst case, destructive shoot-through. The susceptibility is set by the capacitive divider between C_gd and C_gs and by how much gate-loop impedance the induced current sees.",
          "The defences all reduce the gate voltage the coupled current can produce: keep the off-state gate impedance low (a strong pull-down and a short gate loop), apply a negative off-state gate voltage so there is margin below threshold, use a driver with a dedicated Miller-clamp pin that shorts the gate to source during the off state, and prefer devices with a higher gate-charge ratio (larger Q_gs relative to Q_gd) and a higher threshold. Recognising that the Miller plateau and Miller-induced turn-on are the same C_gd seen in two roles — shaping the wanted transition and coupling the unwanted one — is the insight that ties the whole switching story together.",
        ],
      },
      {
        type: "callout",
        heading: "The plateau is where the drain swings and the loss is paid",
        body: "During the Miller plateau the gate voltage holds flat while the drain voltage makes its full swing, with the current already at load — so most switching loss is dissipated here, and the plateau length is Q_gd divided by the gate current. That makes gate-drive strength at the plateau (drive voltage above plateau, over gate-loop resistance) the master control on switching speed, loss, EMI, and the risk of parasitic turn-on.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Switching-transition review",
        items: [
          "Walk the transition in phases: delay, current rise, Miller plateau (voltage swing), full enhancement.",
          "Predict switching speed from Q_gd and the gate current, not from total gate charge alone.",
          "Estimate switching loss as the V-I overlap triangle times frequency, plus C_oss and reverse-recovery terms.",
          "Set the gate resistor for the speed-vs-EMI trade; consider separate turn-on and turn-off resistors.",
          "Use a Kelvin-source package and a short, low-inductance gate loop to protect the transition.",
          "Guard against Miller-induced turn-on with low off-state gate impedance, negative drive, or a Miller clamp.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What happens during the Miller plateau on turn-on?", answer: "Drain current has reached the load current, so the drain voltage swings from the bus down to near zero while V_GS holds flat at the plateau voltage — all the gate current diverts into C_gd to supply the collapsing drain. Most turn-on switching loss is dissipated here; its duration is Q_gd/I_g." },
          { question: "Why is Q_gd more predictive of switching loss than total gate charge?", answer: "The voltage-transition time — when the lossy V-I overlap occurs — equals Q_gd divided by the gate current. Total gate charge sets average driver power, but Q_gd sets how long the drain takes to swing, which is where the switching energy is lost." },
          { question: "How does the gate resistor trade off?", answer: "A smaller gate resistor gives more gate current, a shorter plateau, faster edges, and lower switching loss — but higher dV/dt and dI/dt mean more ringing, more EMI, and greater risk of parasitic turn-on. A larger resistor reverses all of that." },
          { question: "What is Miller-induced turn-on and how do you prevent it?", answer: "A fast dV/dt on an off device's drain pushes current through C_gd into its gate; if that lifts V_GS above threshold, the off device partially conducts (cross-conduction/shoot-through). Prevent it with low off-state gate impedance, negative gate drive, a Miller-clamp pin, and a higher-threshold/high-Q_gs device." },
        ],
      },
    ],
    sources: [tiGateDriver, ericksonPowerElectronics, infineonMosfetLosses],
    related: ["mosfet-fundamentals", "active-switch-vs-diode", "buck-converter-first-principles", "power-electronics-loss-and-magnetics"],
  },
  {
    slug: "active-switch-vs-diode",
    libraryId: "technical",
    collectionId: "electrical-fundamentals",
    title: "Active switch vs passive diode",
    summary: "When to replace a diode with a controlled MOSFET: the Vf·I-versus-I²·R trade behind synchronous rectification, ideal-diode ORing, and reverse-polarity protection — the efficiency win, the control cost, and when a diode is still the right answer.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A diode drops a voltage; a switch drops a resistance",
        body: [
          "A diode is a passive, self-commutating one-way valve: it conducts when forward-biased and blocks when reverse-biased, with no control signal, no timing, and no supervision required. That autonomy is its great virtue — and its forward drop is its great cost, because a conducting diode dissipates its forward voltage times the current (V_f·I) no matter how small that current is, a nearly fixed 0.3–0.5 V for a Schottky or 0.7 V and up for silicon. A MOSFET used in the same current path drops the current times its on-resistance (I·R_DS(on)) instead, which at low voltage and high current is far smaller — tens of millivolts where the diode would lose hundreds — but it is not autonomous: something must sense the operating condition and drive the gate, including turning the device off before current can flow the wrong way. That is the entire trade in one sentence: a diode gives you simplicity and self-commutation at the price of a fixed voltage drop, while a controlled switch gives you low loss and control at the price of a gate driver and a control problem.",
        ],
      },
      {
        type: "formula",
        heading: "The loss crossover",
        formula: "P_diode = V_f · I      P_switch = I² · R_DS(on)      switch wins while  I < V_f / R_DS(on)",
        explanation: "The diode's loss is linear in current; the switch's loss is quadratic. Setting them equal gives a crossover current V_f/R_DS(on) below which the MOSFET drops less voltage and dissipates less power. With a 0.4 V Schottky and a 5 mΩ MOSFET the crossover is 80 A, so across essentially the entire practical current range the switch has the lower drop — which is exactly why synchronous rectification is such a large efficiency lever at low output voltages, where the diode's fixed drop is a big fraction of the output. Only at very high current (or very high R_DS(on)) does the quadratic term catch up and the diode's fixed drop become competitive again.",
        terms: [
          { symbol: "V_f", meaning: "Diode forward voltage at the operating current", unit: "V" },
          { symbol: "R_DS(on)", meaning: "MOSFET on-resistance (hot)", unit: "Ω" },
          { symbol: "I", meaning: "Conducted current", unit: "A" },
        ],
      },
      {
        type: "prose",
        heading: "Synchronous rectification: the freewheel and rectifier case",
        body: [
          "The most common place a MOSFET replaces a diode is synchronous rectification — driving a MOSFET on during exactly the interval a rectifier or freewheel diode would have conducted. In a buck converter's freewheel path, or the secondary-side rectifier of an isolated converter, this converts a fixed-V_f loss into a small I·R_DS(on) loss and can reclaim a large fraction of the total loss at low output voltage. The cost is control: the two switches in a leg must never conduct together, so the controller inserts dead time, and during that dead time the load current freewheels through the MOSFET's own body diode (or a small parallel Schottky) — the diode's autonomy covering the instant the controlled switch cannot. Too little dead time risks shoot-through; too much wastes energy in the body diode. The full treatment, with the efficiency arithmetic and dead-time trade, is in the buck-converter first-principles note; the point here is that synchronous rectification is the canonical MOSFET-for-diode substitution and the template for the others.",
        ],
      },
      {
        type: "prose",
        heading: "Ideal-diode ORing and reverse-polarity protection",
        body: [
          "Two other classic substitutions turn a lossy diode into a near-ideal one. In power-path ORing — combining redundant supplies, or an adapter and a battery, so the higher source feeds the load — a diode in each branch prevents the sources back-feeding each other, but it drops V_f on the entire load current continuously. An ideal-diode controller drives a MOSFET as a controlled diode instead: it turns the FET on to conduct forward with a low I·R_DS(on) drop, and monitors the voltage across it to turn the FET off fast the moment current tries to reverse, blocking back-feed just as a diode would but without the standing loss. The result is diode-like behaviour with a fraction of the drop, which matters most on low-voltage, high-current rails where a diode's forward drop is both a large efficiency hit and a thermal problem.",
          "Reverse-polarity (reverse-battery) protection is the same idea for a different fault. A simple series diode blocks a backwards supply connection but wastes V_f·I whenever the circuit runs normally. A MOSFET placed so that its body diode points in the direction of normal current, and its channel enhanced on during correct-polarity operation, provides protection at near-zero drop: under normal polarity the gate is driven on and the device conducts with low R_DS(on); under reverse polarity the gate is not enhanced (and the body diode blocks), so no destructive current flows. An N-channel device in the ground return, with its gate referenced so it only enhances under correct polarity, is the low-loss standard for this. In both cases the MOSFET buys back the diode's forward-drop loss at the cost of a small control circuit.",
        ],
      },
      {
        type: "prose",
        heading: "When a diode is still the right choice",
        body: [
          "Replacing a diode with a switch is not free, and often a diode is exactly right. A diode wins when its autonomy is worth more than its drop: for fast, self-commutating transient jobs — a freewheel diode across a relay coil, a snubber, a clamp — where you want instant, gate-driverless commutation and the loss is momentary. It wins at very low or infrequent current, where V_f·I is negligible and a gate driver plus control would be pure overhead. It wins where the node is hard to drive — floating, high-voltage, or isolated — and adding a referenced gate drive is awkward or expensive. And it wins on cost, part count, and board area for anything not efficiency-critical. Crucially, the choice is rarely either/or: a synchronous rectifier uses a MOSFET for low-loss conduction and still relies on a diode — its body diode or a parallel Schottky — to carry current autonomously during the dead-time instant the controlled switch cannot cover. The diode's self-commutation is precisely what fills the gap the active switch leaves.",
          "So the decision framework is: estimate the standing conduction loss a diode would cost (V_f·I over its conduction fraction), weigh it against the added gate drive, control, timing, and failure modes (shoot-through, reverse conduction, driver faults) that an active switch introduces, and choose the switch when the efficiency or thermal win justifies the complexity — which is most often on low-voltage, high-current, high-duty paths — while keeping a diode where simplicity, autonomy, or a rare transient is what actually matters.",
        ],
      },
      {
        type: "table",
        heading: "Passive diode vs active switch",
        columns: ["Dimension", "Passive diode", "Active MOSFET switch"],
        rows: [
          ["Control needed", "None — self-commutating", "Gate drive, timing, and sensing required"],
          ["On-state loss", "V_f · I (fixed drop, even at low I)", "I² · R_DS(on) (small at low voltage/high current)"],
          ["Reverse blocking", "Inherent and instant", "Needs fast turn-off before current reverses"],
          ["Transient / autonomy", "Excellent — no latency", "Limited by driver and control latency"],
          ["Complexity / cost", "Low", "Higher (controller, driver, layout)"],
          ["Best use", "Clamps, snubbers, low current, isolated nodes", "Synchronous rectification, ORing, reverse protection"],
        ],
      },
      {
        type: "callout",
        heading: "It's rarely either/or",
        body: "Synchronous designs use both: a MOSFET carries the current with a low I·R_DS(on) drop, while a diode — the body diode or a parallel Schottky — autonomously covers the dead-time instant the controlled switch cannot. The active switch buys efficiency; the diode's self-commutation buys the robustness to bridge the gaps. Choose the switch where the standing V_f·I loss justifies the control complexity, and keep the diode where autonomy, simplicity, or a rare transient is what matters.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Active-switch-vs-diode review",
        items: [
          "Estimate the diode's standing loss (V_f · I × conduction fraction) before deciding.",
          "Compare against I²·R_DS(on) for the switch; find the crossover current V_f/R_DS(on).",
          "For synchronous rectification, add dead-time control and a body-diode/parallel-Schottky path.",
          "For ORing/power-path, use an ideal-diode controller that blocks reverse current fast.",
          "For reverse-polarity protection, orient the MOSFET body diode for normal current and enhance under correct polarity.",
          "Keep a diode where autonomy, low/infrequent current, isolated nodes, or simplicity dominate.",
          "Account for the added failure modes of active switches: shoot-through, reverse conduction, driver faults.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What is the fundamental diode-vs-MOSFET trade?", answer: "A diode drops a fixed forward voltage (V_f·I loss) but needs no control and self-commutates. A MOSFET drops I·R_DS(on) — far less at low voltage/high current — but needs a gate driver and control, including turning off before current reverses. Efficiency and control vs simplicity and autonomy." },
          { question: "Why is synchronous rectification a big efficiency win at low output voltage?", answer: "A diode's ~0.4 V drop is a large fraction of a low output voltage and it conducts most of the cycle. Replacing it with a MOSFET dropping I·R_DS(on) (tens of mV) reclaims much of that loss — the crossover current V_f/R_DS(on) is high, so the switch wins across the practical range." },
          { question: "How does a MOSFET provide reverse-polarity protection with near-zero drop?", answer: "Orient the device so its body diode points in the normal-current direction and enhance the channel on during correct-polarity operation, so it conducts at low R_DS(on). Under reverse polarity the gate isn't enhanced and the body diode blocks — protection without the continuous V_f·I loss of a series diode." },
          { question: "Why isn't the choice purely either/or?", answer: "Synchronous designs use both: the MOSFET conducts with low loss, while a diode (body or parallel Schottky) autonomously carries current during the dead-time instant the controlled switch can't. The diode's self-commutation covers the gaps the active switch leaves." },
        ],
      },
    ],
    sources: [tiIdealDiode, ericksonPowerElectronics],
    related: ["diodes-and-rectifiers", "mosfet-fundamentals", "mosfet-switching-and-miller-plateau", "buck-converter-first-principles"],
  },
];
