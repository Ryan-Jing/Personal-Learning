import type { Note, Source } from "./library";

const pvEducation: Source = {
  title: "PVEducation — Solar Cell Operation and Characterisation",
  publisher: "Honsberg & Bowden, ASU",
  url: "https://www.pveducation.org/",
  kind: "Reference",
};

const nrelPv: Source = {
  title: "Solar Photovoltaic Technology Basics",
  publisher: "National Renewable Energy Laboratory (NREL)",
  url: "https://www.nrel.gov/research/re-photovoltaics.html",
  kind: "Reference",
};

const tiMppt: Source = {
  title: "MPPT and Solar Charge Control (application notes)",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/solar/overview.html",
  kind: "Documentation",
};

const necRapidShutdown: Source = {
  title: "Module-Level Power Electronics & Rapid Shutdown (NEC 690.12)",
  publisher: "National Electrical Code / NFPA 70",
  url: "https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70",
  kind: "Reference",
};

export const solarPvNotes: Note[] = [
  {
    slug: "solar-pv-cell-and-iv-curve",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "Solar PV cells: physics & the I-V curve",
    summary: "The p-n junction that turns photons into current, the I-V curve and its maximum power point, fill factor and the resistances that spoil it, the counterintuitive temperature dependence, and how STC nameplate ratings derate in the real world.",
    readingTime: 18,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A solar cell is a large-area photodiode",
        body: [
          "A solar cell is a large-area p-n junction operated as a photovoltaic device. When a photon with energy greater than the semiconductor's bandgap is absorbed, it lifts an electron across the gap and creates an electron-hole pair; the junction's built-in electric field then sweeps those carriers apart, driving electrons one way and holes the other, which is a current. Silicon, the workhorse material, has a bandgap of about 1.1 eV, which is why it responds to most of the solar spectrum. The photo-generated current flows whenever light falls on the junction, and the cell delivers power when that current flows into an external load at a voltage.",
          "The behaviour is captured by superimposing the light-generated current on an ordinary diode. In the dark the device is just a diode; under illumination the whole curve shifts down by the photocurrent, so the cell can source current into a load over a range of voltages. Understanding the cell as 'a diode with a light-driven current source in parallel' makes every downstream number — open-circuit voltage, short-circuit current, the shape of the power curve, the temperature behaviour — follow naturally.",
        ],
      },
      {
        type: "formula",
        heading: "The single-diode model",
        formula: "I = I_ph − I₀·(e^{q(V+I·R_s)/nkT} − 1) − (V + I·R_s)/R_sh",
        explanation: "The standard equivalent circuit is a photocurrent source I_ph in parallel with a diode, degraded by two parasitic resistances. Series resistance R_s (metal contacts, sheet resistance of the silicon, interconnects) subtracts voltage under load and rounds off the knee of the curve near the operating point, lowering the achievable power. Shunt resistance R_sh (leakage paths across the junction and around the cell edge) bleeds current internally and steepens the curve near short circuit. An ideal cell has R_s → 0 and R_sh → ∞; real cells are judged partly on how close they come, because both resistances directly cut the fill factor and the output power.",
        terms: [
          { symbol: "I_ph", meaning: "Light-generated (photo) current", unit: "A" },
          { symbol: "I₀ / n", meaning: "Diode saturation current / ideality factor", unit: "A / —" },
          { symbol: "R_s / R_sh", meaning: "Series / shunt parasitic resistance", unit: "Ω" },
        ],
      },
      {
        type: "prose",
        heading: "The I-V curve and the maximum power point",
        body: [
          "The defining characteristic of a cell or module is its current-voltage (I-V) curve. Starting from short circuit, the current is nearly constant at the short-circuit current I_sc as voltage rises, because the photocurrent dominates; then, as the voltage approaches the open-circuit voltage V_oc, the internal diode begins to conduct hard and the current collapses to zero. Multiply current by voltage at each point and you get the power curve, which is zero at both ends (no voltage at short circuit, no current at open circuit) and peaks at a knee in between — the maximum power point (MPP), at voltage V_mp and current I_mp. A single silicon cell has a V_oc of only about 0.6–0.7 V and an I_sc that scales with illuminated area and irradiance, so cells are connected in series inside a module to build a useful voltage.",
          "The quality of the curve is summarised by the fill factor, FF = (V_mp·I_mp)/(V_oc·I_sc), which measures how 'square' the curve is — how close the MPP power comes to the theoretical product of V_oc and I_sc. Good silicon cells reach a fill factor of roughly 0.75–0.85. Series resistance flattens the knee and pulls the fill factor down; shunt leakage tilts the low-voltage part of the curve and does the same. Cell efficiency is then the MPP power divided by the incident light power on the cell area. Together V_oc, I_sc, FF, and efficiency are the four numbers that describe a cell, and the MPP is the operating point every solar power stage is trying to find and hold.",
        ],
      },
      {
        type: "prose",
        heading: "Temperature: hotter panels make less power",
        body: [
          "The most counterintuitive and design-critical fact about solar cells is their temperature dependence. As a cell heats up, its open-circuit voltage falls significantly — around −0.3 to −0.4% per °C for silicon — because the diode's saturation current rises with temperature and erodes the voltage the junction can sustain. The short-circuit current rises very slightly with temperature (more carriers are thermally available and the bandgap narrows a little), but that gain is small and does not offset the voltage loss. The net effect is that output power falls as the panel gets hotter, typically around −0.35 to −0.45% per °C. A brilliantly sunny, hot afternoon is therefore not the peak-power condition intuition suggests; a cold, bright day can push a panel above its nameplate rating precisely because the voltage climbs when the cell is cold.",
          "This temperature behaviour is not an academic footnote — it drives system sizing. A string of panels reaches its highest voltage on the coldest morning at first light, which sets the maximum voltage the downstream inverter or converter must tolerate, while the lowest useful voltage occurs on the hottest afternoon, which must stay inside the tracking window. Designing the operating-voltage window around the temperature extremes, not the nominal rating, is a core part of any PV design.",
        ],
      },
      {
        type: "table",
        heading: "The cell's defining numbers",
        columns: ["Parameter", "Symbol", "What it is", "What degrades it"],
        rows: [
          ["Open-circuit voltage", "V_oc", "Voltage at zero current (~0.6–0.7 V/cell)", "Rising temperature (−0.3 to −0.4%/°C)"],
          ["Short-circuit current", "I_sc", "Current at zero voltage; ∝ irradiance × area", "Low irradiance, soiling, shading"],
          ["Maximum power point", "V_mp, I_mp", "The knee where P = V·I peaks", "Temperature, irradiance (it moves)"],
          ["Fill factor", "FF", "Squareness (V_mp·I_mp)/(V_oc·I_sc)", "Series resistance, shunt leakage"],
          ["Efficiency", "η", "P_mp / (irradiance × area)", "All of the above plus spectrum"],
        ],
      },
      {
        type: "prose",
        heading: "STC, irradiance, and real-world derating",
        body: [
          "A module's nameplate wattage is measured at Standard Test Conditions (STC): 1000 W/m² irradiance, a 25 °C cell temperature, and the AM1.5 reference spectrum. Real installations almost never see all three at once — in bright sun the cell runs far hotter than 25 °C — so the actual output is typically below nameplate, which is why more realistic figures like the nominal operating cell temperature (NOCT) exist. It is essential to separate two related quantities: irradiance is instantaneous power density in W/m² (how bright it is right now), while insolation is energy over time in kWh/m² per day, often expressed as 'peak sun hours.' Current tracks irradiance roughly linearly, so a passing cloud that halves the irradiance nearly halves the current, while daily energy depends on the integral of irradiance over the day.",
          "The gap between nameplate and delivered energy is captured by derating factors and rolled into a system's performance ratio. Temperature loss, soiling on the glass, partial shading, module-to-module mismatch, resistive wiring losses, and inverter conversion efficiency all subtract, and the performance ratio — actual energy delivered divided by the theoretical energy from the nameplate rating and measured irradiance — lands around 0.75–0.85 for a well-designed system. Reasoning about a PV system means always translating the nameplate STC figure through these real-world losses rather than treating it as delivered output.",
        ],
      },
      {
        type: "callout",
        heading: "Nameplate is STC; reality is hotter and lower",
        body: "The rated wattage assumes 1000 W/m², a 25 °C cell, and the AM1.5 spectrum simultaneously — conditions a real panel rarely meets, because sunlight heats it well past 25 °C and power falls ~0.4%/°C. Always design the voltage window around temperature extremes (cold morning sets max V_oc, hot afternoon sets min V_mp) and expect a performance ratio of 0.75–0.85, not 1.0.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "PV cell / module review",
        items: [
          "Model the cell as a photocurrent source in parallel with a diode, degraded by R_s and R_sh.",
          "Locate the MPP on the I-V curve and track V_mp, I_mp, V_oc, I_sc, and fill factor.",
          "Apply the temperature coefficients: V_oc down ~0.4%/°C, power down ~0.4%/°C as the cell heats.",
          "Size the operating-voltage window from the cold and hot temperature extremes, not the nominal rating.",
          "Distinguish irradiance (W/m², instantaneous) from insolation (kWh/m²/day, energy).",
          "Derate the STC nameplate through temperature, soiling, shading, mismatch, wiring, and inverter losses (performance ratio).",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How does a solar cell turn light into current?", answer: "It is a large-area p-n junction: a photon above the ~1.1 eV silicon bandgap creates an electron-hole pair, and the junction's built-in field separates the carriers, driving a photocurrent. The cell behaves like a diode with a light-driven current source in parallel." },
          { question: "What is the maximum power point and the fill factor?", answer: "On the I-V curve, current is ~constant then collapses near V_oc; power (V·I) peaks at the knee — the MPP (V_mp, I_mp). Fill factor = (V_mp·I_mp)/(V_oc·I_sc) measures the curve's squareness (~0.75–0.85); series and shunt resistance lower it." },
          { question: "Why does a panel produce less power when it's hot?", answer: "Open-circuit voltage falls ~0.3–0.4%/°C as temperature rises (the diode saturation current climbs), and the tiny I_sc increase doesn't compensate, so power drops ~0.4%/°C. Cold, bright days can exceed nameplate." },
          { question: "What are STC and the performance ratio?", answer: "STC is the nameplate test condition: 1000 W/m², 25 °C cell, AM1.5 spectrum. Real output is lower; the performance ratio (actual/theoretical energy, ~0.75–0.85) captures temperature, soiling, shading, mismatch, wiring, and inverter losses." },
        ],
      },
    ],
    sources: [pvEducation, nrelPv],
    related: ["mppt-maximum-power-point-tracking", "pv-system-topologies-and-array-wiring", "diodes-and-rectifiers", "power-and-energy"],
  },
  {
    slug: "mppt-maximum-power-point-tracking",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "MPPT: maximum power point tracking",
    summary: "Why the operating point must be actively tracked, MPPT as an outer control loop around a DC/DC converter, Perturb & Observe and Incremental Conductance, and the partial-shading local-maximum problem.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The maximum power point is a moving target",
        body: [
          "A solar panel delivers its most power only at one operating point on its I-V curve, the maximum power point — and that point moves continuously as irradiance and temperature change. A passing cloud shifts it in a fraction of a second; a rising cell temperature drifts it lower over minutes. Simply connecting a panel to a fixed load would leave it operating off the knee most of the time, throwing away a large fraction of the available energy. Maximum power point tracking is the function that continuously adjusts the panel's operating point to sit on the moving MPP, and it is the core power-electronics job inside any solar product — the thing that turns a panel's potential into delivered watts.",
          "Mechanically, MPPT is done by a DC/DC converter placed between the panel and its load or DC bus: by changing the converter's duty cycle, the controller changes the voltage the panel is held at, and therefore where on the I-V curve it operates. For grid-tie systems the converter is usually a boost, because the panel or string voltage is below the DC-bus voltage the inverter needs; buck or buck-boost stages appear where the voltage relationship differs. The MPPT algorithm's only job is to decide which way to move that operating voltage.",
        ],
      },
      {
        type: "prose",
        heading: "MPPT is an outer loop around an inner converter loop",
        body: [
          "The cleanest way to hold MPPT in your head is as a cascaded control structure, the same architecture used in motion control. The inner loop is the DC/DC converter's own fast current or voltage regulator, which forces the panel to sit at whatever reference it is given. The outer, slower MPPT loop watches the panel's power and adjusts that reference to climb toward the MPP. The separation of timescales is deliberate: the inner loop settles quickly so the outer loop can treat it as ideal, and the outer loop moves slowly enough not to fight the converter dynamics. Recognising MPPT as a reference-setting outer loop wrapped around a converter's inner loop connects it directly to control-systems fundamentals rather than treating it as a special-purpose trick.",
          "Because it is a control loop, MPPT inherits control-loop trade-offs: step size versus speed, sampling rate versus converter bandwidth, and stability versus tracking aggressiveness. Those trade-offs are exactly what distinguishes the common algorithms.",
        ],
      },
      {
        type: "code",
        heading: "Perturb & Observe (the ubiquitous algorithm)",
        intro: "P&O nudges the operating voltage, measures whether power went up or down, and keeps moving in the direction that increased power — hill-climbing on the P-V curve.",
        language: "c",
        code: "// Called periodically. Returns the new voltage reference for the converter.\nfloat po_step(float v, float i, float *v_prev, float *p_prev, float step) {\n    float p = v * i;                 // measured panel power now\n    float dp = p - *p_prev;          // change since last step\n    float dv = v - *v_prev;          // direction we last moved\n\n    float v_ref = v;\n    if (dp > 0) {                    // power improved: keep going the same way\n        v_ref += (dv >= 0) ? step : -step;\n    } else {                         // power dropped: reverse direction\n        v_ref += (dv >= 0) ? -step : step;\n    }\n\n    *v_prev = v;\n    *p_prev = p;\n    return v_ref;                    // inner converter loop tracks this reference\n}",
      },
      {
        type: "prose",
        heading: "Perturb & Observe vs Incremental Conductance",
        body: [
          "Perturb & Observe (P&O) is the most common MPPT method because it is simple and needs only voltage and current measurements. It perturbs the operating voltage by a small step, measures the resulting power, and continues in whichever direction increased power, reversing when power drops. Its two weaknesses follow from that simplicity. In steady state it never settles exactly on the MPP — it oscillates around it, dithering back and forth by the step size, so there is a trade-off: a large step tracks fast but wastes more energy oscillating, while a small step is precise but slow. And under rapidly changing irradiance it can be fooled, because a measured power increase might come from rising sunlight rather than from the perturbation it made, sending it the wrong way; variable-step versions mitigate this.",
          "Incremental Conductance (IncCond) addresses the fast-changing case with a bit more computation. It uses the fact that at the MPP the slope of the power curve is zero, which means dP/dV = 0, and since P = V·I this rearranges to dI/dV = −I/V. The algorithm compares the incremental conductance dI/dV to the instantaneous conductance −I/V: if dI/dV is greater than −I/V the operating point is left of the MPP and voltage should increase; if it is less, the point is right of the MPP and voltage should decrease; if they are equal, it is at the MPP and holds. Because it can recognise when it is actually at the peak rather than perpetually stepping past it, IncCond handles fast irradiance changes better and reduces steady-state oscillation, at the cost of the extra derivative computation.",
        ],
      },
      {
        type: "formula",
        heading: "The MPP condition",
        formula: "At the MPP:  dP/dV = 0   ⟹   d(V·I)/dV = I + V·(dI/dV) = 0   ⟹   dI/dV = −I/V",
        explanation: "Since power is voltage times current, the peak of the power curve is where its derivative with respect to voltage is zero. Expanding that derivative and rearranging gives the exact MPP condition that Incremental Conductance tests: the incremental conductance dI/dV equals the negative of the instantaneous conductance I/V. Left of the MPP, dI/dV > −I/V; right of it, dI/dV < −I/V. This turns 'find the top of the hill' into a precise, testable equality rather than a perpetual perturb-and-check.",
        terms: [
          { symbol: "P = V·I", meaning: "Panel output power", unit: "W" },
          { symbol: "dI/dV", meaning: "Incremental conductance", unit: "A/V" },
          { symbol: "I/V", meaning: "Instantaneous conductance", unit: "A/V" },
        ],
      },
      {
        type: "prose",
        heading: "Partial shading and local maxima",
        body: [
          "A hard, real-world complication is partial shading. When part of an array is shaded, the bypass diodes that protect the shaded cells (covered in the topologies note) create multiple steps in the string's I-V curve, and therefore multiple peaks in the power curve — several local maxima with one true global maximum. A simple hill-climbing tracker like basic P&O or IncCond will happily climb to whichever local peak it happens to be nearest and stop there, potentially far below the global best. Handling this needs a global tracking strategy: periodically sweeping the whole voltage range to find the true peak, or using a global-search method, then returning to fine tracking around it. Knowing that partial shading breaks naive hill-climbing — and that the fix is a periodic global sweep — is a sign of practical, not just textbook, MPPT understanding.",
          "Other refinements exist for specific needs: constant-voltage tracking approximates the MPP as a fixed fraction of V_oc (roughly 0.76) for very low-cost or low-light operation, and fractional open-circuit or short-circuit methods briefly sample V_oc or I_sc as a reference. But P&O and IncCond wrapped around a converter, with a global-sweep guard for shading, cover the great majority of real designs.",
        ],
      },
      {
        type: "table",
        heading: "MPPT methods compared",
        columns: ["Method", "How it works", "Strength", "Weakness"],
        rows: [
          ["Perturb & Observe", "Step voltage, keep the direction that raised power", "Simple, only V and I needed, ubiquitous", "Oscillates at MPP; can misread fast irradiance change"],
          ["Incremental Conductance", "Test dI/dV vs −I/V for the exact MPP", "Better under fast irradiance change; less dither", "More computation (derivatives)"],
          ["Constant voltage", "Hold V ≈ 0.76·V_oc", "Trivial, works in low light", "Not the true MPP; ignores temperature drift"],
          ["Global (sweep / search)", "Scan full range for the global peak", "Survives partial-shading local maxima", "Costs tracking time; run periodically"],
        ],
      },
      {
        type: "callout",
        heading: "Watch the step size and the shade peaks",
        body: "Two failure modes dominate MPPT in practice: too large a P&O step wastes energy oscillating around the MPP (too small tracks too slowly), and partial shading creates multiple power peaks that trap a naive hill-climber on a local maximum. Variable step size fixes the first; a periodic global sweep fixes the second.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "MPPT design review",
        items: [
          "Structure MPPT as a slow outer loop setting the reference for the converter's fast inner loop.",
          "Pick the converter (usually boost for grid-tie) from the panel-to-bus voltage relationship.",
          "Choose P&O for simplicity or IncCond for fast-changing irradiance; consider variable step size.",
          "Set the perturbation step from the speed-vs-oscillation trade-off; measure MPP tracking efficiency.",
          "Guard against partial-shading local maxima with a periodic global sweep.",
          "Keep MPPT inside the panel's temperature-driven voltage window (from the cell note).",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is MPPT necessary, and how is it implemented?", answer: "The MPP moves continuously with irradiance and temperature, so a fixed operating point wastes power. MPPT is an algorithm that adjusts a DC/DC converter's duty cycle (voltage reference) to hold the panel on the moving MPP — an outer control loop around the converter's inner loop." },
          { question: "How does Perturb & Observe work and what are its weaknesses?", answer: "It perturbs the operating voltage, measures the power change, and keeps moving in the direction that raised power. It oscillates around the MPP (step-size trade-off) and can be fooled by fast irradiance changes, mistaking rising sunlight for the effect of its perturbation." },
          { question: "What condition does Incremental Conductance test?", answer: "At the MPP, dP/dV = 0, which for P = V·I gives dI/dV = −I/V. It compares incremental conductance to instantaneous conductance to know whether it is left of, right of, or exactly at the MPP — handling fast irradiance changes with less dither." },
          { question: "Why does partial shading break simple MPPT?", answer: "Bypass diodes under shading create multiple peaks in the power curve; a hill-climber like basic P&O or IncCond can lock onto a local maximum below the global one. The fix is a periodic global sweep to find the true peak." },
        ],
      },
    ],
    sources: [tiMppt, pvEducation],
    related: ["solar-pv-cell-and-iv-curve", "pv-system-topologies-and-array-wiring", "buck-converter-first-principles", "motor-control-fundamentals"],
  },
  {
    slug: "pv-system-topologies-and-array-wiring",
    libraryId: "technical",
    collectionId: "grid-and-power-systems",
    title: "PV system topologies & array wiring",
    summary: "Series/parallel array behaviour and the shading/hot-spot problem, bypass and blocking diodes, the string / microinverter / optimizer / hybrid topologies, and why safe plug-and-play consumer solar favours module-level AC.",
    readingTime: 17,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Series adds voltage; parallel adds current",
        body: [
          "Panels are combined into arrays the same way cells are combined into panels: in series to add voltage and in parallel to add current. A series connection — a 'string' — stacks the panel voltages, but because the same current flows through every panel in the string, the string current is limited by the weakest panel. A parallel connection adds currents at a common voltage. A typical array is several series strings wired in parallel, chosen so the string voltage suits the inverter's input and the parallel combination supplies the needed current. The key consequence of the series connection is that one underperforming panel drags down the whole string, which is the root of the shading problem.",
          "That weakest-link behaviour becomes dangerous under partial shading. If one cell or panel in a series string is shaded while the rest are illuminated, the healthy panels try to push their full current through the shaded one, which cannot generate it. The shaded cell is then driven into reverse bias and, instead of producing power, dissipates it as heat — a hot spot that can crack the cell, char the encapsulant, and permanently damage the module. So series wiring, which is essential for building voltage, also creates a thermal hazard that has to be managed with protection diodes.",
        ],
      },
      {
        type: "prose",
        heading: "Bypass and blocking diodes",
        body: [
          "Bypass diodes are the direct answer to the hot-spot problem. Connected across sub-groups of cells — typically three bypass diodes in a standard module's junction box, one per cell sub-string — they normally sit reverse-biased and idle. When a sub-string is shaded and its cells begin to reverse-bias, the diode across it turns on and provides an alternate path for the string current to flow around the shaded group, so the healthy panels are no longer forced to push their current through the weak cells. This prevents the hot spot and keeps the rest of the string producing, at the cost of losing the shaded sub-string's contribution and, as noted in the MPPT discussion, creating the multiple power-curve peaks that complicate tracking. The three-diode junction box is a direct physical expression of this protection.",
          "Blocking diodes serve a different purpose: preventing reverse current from flowing back into a string. In an array of parallel strings, or a system with a battery, a shaded or lower-voltage string can become a path for current to flow backwards into it from the stronger strings or from the battery at night, wasting energy and potentially stressing the weak string. A series blocking diode stops that reverse flow. Modern systems often minimise blocking diodes because their forward voltage drop is a continuous loss, using string fuses or electronic protection instead, but the concept — one diode to bypass a shaded group, another to block reverse current — is fundamental to understanding array wiring.",
        ],
      },
      {
        type: "table",
        heading: "System topologies",
        columns: ["Topology", "Description", "Pros", "Cons"],
        rows: [
          ["String inverter", "Panels in series, one central inverter, one MPPT per string", "Cheap, simple, efficient", "One weak/shaded panel limits the string; single point of failure; high-voltage DC"],
          ["Microinverter", "One small inverter per panel; AC outputs combined", "Per-panel MPPT, shade-tolerant, module monitoring, no HV DC", "More units, higher $/W, more parts to service"],
          ["DC power optimizer", "Per-panel DC/DC (MPPT) plus a central inverter", "Per-panel MPPT with central-inverter efficiency", "Still depends on the central inverter; HV DC remains"],
          ["Hybrid / battery inverter", "Inverter + battery + grid-tie combined", "Storage, backup, self-consumption", "More complex and costly"],
        ],
      },
      {
        type: "prose",
        heading: "Module-level electronics and where MPPT lives",
        body: [
          "The topologies differ mainly in where MPPT happens and how much high-voltage DC exists. A string inverter puts one MPPT across an entire series string, which is cheap and efficient but means the whole string operates at a single compromise point — the weakest panel sets the pace. Module-level power electronics (MLPE) move the tracking to each panel: a microinverter is a complete small inverter per panel that outputs AC directly, and a DC power optimizer is a per-panel DC/DC stage that does the MPPT and still feeds a central inverter. Both give per-panel MPPT so a shaded or mismatched panel no longer drags its neighbours, plus module-level monitoring and, importantly, safety features like rapid shutdown that de-energise the array quickly.",
          "The safety difference is central. A series string can sit at 600–1000 V DC on the roof, and high-voltage DC is genuinely hazardous — DC arcs do not self-extinguish at the zero-crossing the way AC arcs do, so a fault is harder to interrupt and a fire risk. Rapid-shutdown requirements exist precisely to force roof-level DC to a safe voltage quickly in an emergency. Microinverters sidestep much of this by keeping only low-voltage AC on the roof, with the dangerous conversion happening in a sealed per-panel unit.",
        ],
      },
      {
        type: "prose",
        heading: "Why plug-and-play consumer solar favours module-level AC",
        body: [
          "For a consumer product meant to be installed safely without an electrician handling high-voltage DC wiring, the architecture pressure points strongly toward microinverter or AC-coupled designs. Keeping only low-voltage AC accessible to the user avoids the roof-level high-voltage DC hazard, makes each panel a self-contained module that can be added or removed independently, and lets the product connect at the low-voltage AC level where simple notification-class connection standards apply. The trade is more units, a higher cost per watt, and more devices that could eventually need servicing — but for a plug-and-play consumer product those costs buy the safety and modularity that make consumer installation viable at all.",
          "So the strong system-level answer to 'how would you architect a safe plug-and-play solar product' is a module-level, low-voltage-AC design: per-panel microinverters (or an AC-coupled arrangement) so there is no dangerous DC for a consumer to wire, per-panel MPPT for shade tolerance, and compliance with the appropriate small-generation connection standard so it can be plugged in and notified rather than requiring a full engineered installation. The topology choice is driven first by safety and installability, and the electrical benefits follow.",
        ],
      },
      {
        type: "callout",
        heading: "High-voltage DC is the hazard; module-level AC is the answer",
        body: "A series string can reach 600–1000 V DC on a roof, and DC arcs don't self-extinguish, so they are hard to interrupt and a fire risk — which is why rapid-shutdown rules exist. Microinverter and AC-coupled designs keep only low-voltage AC accessible, giving per-panel MPPT and shade tolerance while making safe consumer installation possible. That is why plug-and-play solar leans module-level.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Array & topology review",
        items: [
          "Track series (voltage adds, weakest panel limits current) vs parallel (current adds) behaviour.",
          "Protect series strings with bypass diodes against reverse-bias hot spots under shading.",
          "Use blocking diodes or string fuses to stop reverse current into weak strings or from a battery.",
          "Choose string / microinverter / optimizer / hybrid by shade profile, cost, and safety needs.",
          "Prefer module-level low-voltage AC (microinverters) where safe consumer installation matters.",
          "Size string length to the inverter's max DC input at coldest V_oc and its MPPT window at hot V_mp.",
          "Account for rapid-shutdown and high-voltage-DC safety requirements on any roof-level DC.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does a shaded panel endanger a series string, and what protects it?", answer: "The healthy panels force their full current through the shaded panel, which reverse-biases and dissipates power as a hot spot that can damage the module. Bypass diodes across cell sub-strings turn on to route current around the shaded group, preventing the hot spot." },
          { question: "What do bypass and blocking diodes each do?", answer: "Bypass diodes (typically three per module) provide a path around a shaded/failed sub-string to prevent hot spots and current limiting. Blocking diodes prevent reverse current flowing back into a weaker string or from a battery at night." },
          { question: "Compare string inverters and microinverters.", answer: "String: one central inverter and one MPPT for a whole series string — cheap and efficient, but a weak panel limits the string, there's a single point of failure, and high-voltage DC on the roof. Microinverter: one per panel with per-panel MPPT, shade tolerance, monitoring, and only low-voltage AC — but more units and higher cost." },
          { question: "Why does plug-and-play consumer solar favour module-level AC?", answer: "It avoids hazardous roof-level high-voltage DC (whose arcs don't self-extinguish), makes panels modular and safe to install without an electrician, and connects at low-voltage AC under simple small-generation connection standards — safety and installability drive the choice." },
        ],
      },
    ],
    sources: [pvEducation, necRapidShutdown],
    related: ["solar-pv-cell-and-iv-curve", "mppt-maximum-power-point-tracking", "grid-tie-inverters", "diodes-and-rectifiers"],
  },
];
