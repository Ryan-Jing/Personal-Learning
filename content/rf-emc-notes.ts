import type { Note, Source } from "./library";

const tiAntennaGuide: Source = {
  title: "Antenna Selection Guide (SWRA351)",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/an/swra351a/swra351a.pdf",
  kind: "Documentation",
};

const arrlAntennaBook: Source = {
  title: "The ARRL Antenna Book",
  publisher: "American Radio Relay League",
  url: "https://www.arrl.org/arrl-antenna-book",
  kind: "Book",
};

const ottEmc: Source = {
  title: "Electromagnetic Compatibility Engineering",
  publisher: "Henry W. Ott, Wiley",
  url: "https://www.wiley.com/en-us/Electromagnetic+Compatibility+Engineering-p-9780470189306",
  kind: "Book",
};

const wurthMagnetics: Source = {
  title: "Trilogy of Magnetics — filter and choke design",
  publisher: "Würth Elektronik",
  url: "https://www.we-online.com/en/support/knowledgebase/trilogy-of-magnetics",
  kind: "Reference",
};

const keysightSpectrum: Source = {
  title: "Spectrum Analysis Basics (Application Note 150)",
  publisher: "Keysight Technologies",
  url: "https://www.keysight.com/us/en/assets/7018-06714/application-notes/5952-0292.pdf",
  kind: "Documentation",
};

const keysightVna: Source = {
  title: "Understanding the Fundamental Principles of Vector Network Analysis",
  publisher: "Keysight Technologies",
  url: "https://www.keysight.com/us/en/assets/7018-06841/application-notes/5965-7707.pdf",
  kind: "Documentation",
};

export const rfEmcNotes: Note[] = [
  {
    slug: "rf-and-antenna-fundamentals",
    libraryId: "technical",
    collectionId: "rf-antennas-emc",
    title: "RF & antenna fundamentals",
    summary: "How antennas radiate, why wavelength sets their size, what antenna impedance and radiation resistance mean, why 50 Ω and impedance matching exist, and how ground planes and enclosures detune a real design.",
    readingTime: 18,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "An antenna is an impedance transformer to free space",
        body: [
          "An antenna is a structure that efficiently converts energy guided along a transmission line into an electromagnetic wave that propagates through space, and back again. By reciprocity the same antenna behaves identically whether transmitting or receiving, so a design tuned to radiate well also captures well. The heart of the design problem is a matching problem: a circuit presents some impedance (conventionally 50 Ω), free space has a characteristic impedance of about 377 Ω, and the antenna's geometry is what bridges those two at the wavelength of interest so that energy leaves the wire as radiation instead of reflecting back into the amplifier. Everything else — size, shape, ground plane, matching network — serves that coupling.",
          "That framing makes the two recurring questions concrete. First, how big must the structure be, which is set by wavelength. Second, how well is it matched, which is set by its impedance. Get those two right and an antenna radiates; get either wrong and the power either cannot fit the structure or bounces back and heats the transmitter.",
        ],
      },
      {
        type: "formula",
        heading: "Wavelength sets the size",
        formula: "λ = c / f      quarter-wave ℓ ≈ 0.25·λ·k      (k ≈ 0.95 velocity/end-effect factor)",
        explanation: "Wavelength is the speed of light over frequency, and resonant antennas are sized in fractions of it: a half-wave dipole is about λ/2, a quarter-wave monopole about λ/4 over a ground plane. At 2.4 GHz λ ≈ 12.5 cm, so a quarter-wave element is about 31 mm; at 100 MHz λ is 3 m and a quarter-wave whip is ~75 cm. This is why low-frequency antennas are physically large and why forcing an antenna much smaller than λ/10 makes it 'electrically small' — low radiation resistance, poor efficiency, and narrow bandwidth that demands a careful matching network.",
        terms: [
          { symbol: "λ", meaning: "Wavelength", unit: "m" },
          { symbol: "f", meaning: "Operating frequency", unit: "Hz" },
          { symbol: "k", meaning: "Velocity / end-effect shortening factor", unit: "—" },
        ],
      },
      {
        type: "prose",
        heading: "Antenna impedance and radiation resistance — the 'why'",
        body: [
          "An antenna presents a complex impedance at its feed: Z = R_rad + R_loss + jX. The reactive part jX comes from the antenna storing energy in near-field electric and magnetic fields; at resonance the inductive and capacitive contributions cancel, X goes to zero, and the antenna looks purely resistive — which is exactly the condition you tune for. The resistive part splits into two very different things. Radiation resistance R_rad is not a real resistor; it represents the power that actually leaves the antenna as radiation, modeled as if a resistor were dissipating it. Loss resistance R_loss is genuine ohmic and dielectric loss that turns power into heat. Antenna efficiency is R_rad/(R_rad + R_loss) — the fraction of accepted power that radiates rather than warms the conductor — and it is why an electrically small antenna, whose R_rad collapses toward the same order as its losses, is so inefficient.",
          "Real antennas have real feed impedances, and those numbers explain the standards. A half-wave dipole in free space sits near 73 Ω; a quarter-wave monopole over a ground plane near 36 Ω. Coaxial systems standardized on 50 Ω as a compromise (lowest coax loss is near 77 Ω, highest power handling near 30 Ω, and 50 Ω splits the difference while sitting conveniently between common antenna impedances), with 75 Ω used where low loss matters more than power, as in video and broadcast. When someone asks about 'the impedance of an antenna and why,' this is the answer: the antenna's feed impedance is a physical property of its geometry, and the whole system is built around matching that property to a standard line impedance so power transfers instead of reflecting.",
        ],
      },
      {
        type: "prose",
        heading: "Matching, VSWR, and return loss",
        body: [
          "To transfer maximum power from a source and its transmission line into the antenna, the antenna's impedance must be matched to the line — ideally a conjugate match that also cancels any residual reactance. When it is mismatched, part of the incident wave reflects back toward the source and interferes with the forward wave to form a standing wave on the line. The quality of the match is quantified as VSWR (voltage standing-wave ratio, 1:1 being perfect and larger meaning more reflection) or equivalently as return loss / the S11 scattering parameter in decibels, where more negative is better — a return loss of −10 dB means about 10% of the power is reflected, −20 dB about 1%. Reflected power does not radiate; it goes back into the power amplifier as wasted, potentially damaging energy, which is why match quality is the number RF engineers watch.",
          "A matching network fixes a mismatch by adding reactive components — an L-network of one series and one shunt element, a pi-network, or transmission-line stubs — that cancel the antenna's reactance and transform its resistance to the line's 50 Ω. In practice you measure the antenna with a vector network analyzer, read S11 across frequency (often on a Smith chart, which maps impedance to reflection directly), and tune the network until the match is deep at the operating band. This measurement-and-tune loop is the core of antenna bring-up, and it is why an antenna footprint always includes a pi-network of unpopulated component pads: you populate whatever the VNA tells you the real board needs.",
        ],
      },
      {
        type: "prose",
        heading: "Ground planes, real antennas, and detuning",
        body: [
          "Many practical antennas are not free-floating dipoles but structures that need a ground plane as a counterpoise. A quarter-wave monopole, and the PCB inverted-F (IFA) and planar inverted-F (PIFA) antennas common in small wireless products, work against a ground plane that acts by image theory as the missing other half of the antenna — so the size and shape of that ground plane are part of the antenna, and a PCB ground plane that is too small detunes it and wrecks the match. This is the single most common reason a chip or trace antenna that looked fine in the datasheet performs poorly on a real board: the reference design's ground plane was bigger.",
          "Everything nearby loads the antenna. Metal — an enclosure wall, a battery, a shield can, even a user's hand — couples to the near field and shifts both the resonant frequency and the impedance, which is why a metal enclosure blocks RF (forcing an external antenna or a plastic 'radome' window), why plastic housings are used for products with internal antennas, and why keep-outs (no copper, no components, no metal) are specified under and around a PCB antenna, usually placed at a board edge. The unavoidable consequence is that an antenna must be tuned in its final mechanical context: a perfect 50 Ω match on a bare board becomes a mismatch once the lid, battery, and hand are present, so the VNA measurement is done in the real housing.",
        ],
      },
      {
        type: "prose",
        heading: "Antenna parameters and the link",
        body: [
          "Beyond size and match, a handful of parameters describe how an antenna directs and delivers energy. Directivity and gain (in dBi) describe how much the antenna concentrates radiation in a preferred direction rather than spreading it evenly; a patch antenna is directional, a dipole is omnidirectional in one plane. The radiation pattern is the full map of that directionality, and polarization (the orientation of the radiated electric field — vertical, horizontal, or circular) must roughly match between transmitter and receiver or the link loses many decibels. Bandwidth is the frequency range over which the match and pattern stay acceptable, and it trades against how small and how efficient the antenna is.",
          "These roll up into a link budget: received power is transmit power plus the two antenna gains minus the path loss, and the link closes only if that exceeds the receiver's sensitivity. Path loss grows with both distance and frequency, which sets up the fundamental RF trade — higher frequencies allow smaller antennas and more bandwidth but suffer more free-space loss and are blocked more easily by walls and bodies, while lower frequencies travel and penetrate better but demand larger antennas. Choosing a band is choosing a point on that trade for the range, data rate, and size the product needs.",
        ],
      },
      {
        type: "table",
        heading: "Common antenna types",
        columns: ["Type", "Needs ground plane?", "Character", "Typical use"],
        rows: [
          ["Half-wave dipole", "No (self-balanced)", "~73 Ω, omnidirectional in one plane", "Reference, external whips, base stations"],
          ["Quarter-wave monopole / whip", "Yes (counterpoise)", "~36 Ω, needs good ground", "Radios, external antennas over a chassis"],
          ["PCB IFA / PIFA", "Yes (board ground)", "Compact, ground-plane sensitive", "BLE / Wi-Fi in small devices"],
          ["Chip / ceramic", "Yes, plus matching", "Tiny, narrowband, needs tuning", "Space-constrained 2.4 GHz / GNSS"],
          ["Patch (microstrip)", "Ground is the back plane", "Directional, polarized", "GPS, directional links, RFID readers"],
          ["Loop", "No", "Small, magnetic near-field", "NFC, low-frequency, tags"],
        ],
      },
      {
        type: "callout",
        heading: "Tune the antenna in its final enclosure",
        body: "An antenna's resonance and impedance shift with its ground plane and everything metallic near it — the enclosure, battery, shield, and even a hand. Match it on a vector network analyzer (S11 / Smith chart) in the real housing, not on a bare board, and always leave a populated-as-needed pi matching network and a keep-out region around the antenna. A bench-perfect 50 Ω match means little once the product is assembled.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "RF / antenna review",
        items: [
          "Size the antenna from λ = c/f for the band; flag any element forced far below λ/10 as electrically small.",
          "Treat the antenna feed impedance as a physical property and plan a matching network (pi/L) to the line's 50 Ω.",
          "Verify the ground plane is large enough for monopole/IFA/PIFA designs; the plane is part of the antenna.",
          "Reserve a keep-out (no copper, components, or metal) around a PCB antenna, placed at a board edge.",
          "Measure S11 / VSWR on a VNA and tune in the final enclosure, accounting for battery, shield, and hand loading.",
          "Match polarization between ends and close the link budget against receiver sensitivity and path loss.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is antenna size tied to wavelength?", answer: "Resonant antennas are fractions of a wavelength (λ/2 dipole, λ/4 monopole), and λ = c/f. Low frequencies mean large antennas; forcing one much smaller than λ/10 makes it electrically small — inefficient, narrowband, hard to match." },
          { question: "What is radiation resistance, and why does antenna impedance matter?", answer: "Radiation resistance is the equivalent resistance representing power that actually radiates (vs loss resistance, which is heat). The antenna's feed impedance is a physical property of its geometry, and the system matches it to a standard line impedance so power transfers instead of reflecting." },
          { question: "Why 50 Ω, and what do VSWR / return loss measure?", answer: "50 Ω is a coax compromise between lowest loss (~77 Ω) and highest power handling (~30 Ω), near common antenna impedances. VSWR and return loss (S11) measure the match: reflected power that does not radiate and instead returns to the amplifier — 1:1 VSWR or very negative return loss is ideal." },
          { question: "Why must an antenna be tuned in its final enclosure?", answer: "The ground plane and nearby metal — enclosure, battery, shield, hand — load the antenna and shift its resonance and impedance. A match made on a bare board detunes once the product is assembled, so it is measured on a VNA in the real housing." },
        ],
      },
    ],
    sources: [tiAntennaGuide, arrlAntennaBook],
    related: ["emi-filtering-and-mitigation", "rf-testing-and-measurement", "drone-rf-links-and-link-budgets", "pcb-materials-and-impedance", "enclosures-and-ingress-protection"],
  },
  {
    slug: "emi-filtering-and-mitigation",
    libraryId: "technical",
    collectionId: "rf-antennas-emc",
    title: "EMI filtering & mitigation components",
    summary: "The component toolbox for noise: differential vs common-mode, ferrite beads, common-mode chokes and the transformer principle of coupling without a wire, X/Y capacitors and AC line filters, and choosing the fix by mechanism and frequency.",
    readingTime: 19,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Noise has a mode — and the mode picks the filter",
        body: [
          "Before choosing any filter component, identify what kind of noise you are fighting, because the same part that annihilates one kind is invisible to the other. Differential-mode noise flows out on one conductor and back on the other, inside the intended signal or power loop — switching ripple on a rail is often differential. Common-mode noise flows in the same direction on all the conductors together and returns through ground, the chassis, or parasitic capacitance to the environment — the noise that turns a cable into an antenna, and the dominant mechanism in both radiated emissions and AC-line interference, is usually common-mode. A capacitor across a pair kills differential noise but does nothing for common-mode; a common-mode choke does the reverse. So the first move is diagnosis: an RF current clamp around a whole cable measures the common-mode current directly, and the reading tells you which family of fix to reach for.",
          "This note is the component-and-filter companion to the board-layout view of EMC. Layout controls where the noisy currents flow and how big their loops are; the components here treat what is left — blocking, shunting, absorbing, or isolating noise at the boundaries. Both are needed, and both are cheaper the closer to the source they act.",
        ],
      },
      {
        type: "prose",
        heading: "Ferrite beads: turning HF noise into heat",
        body: [
          "A ferrite bead looks like a small inductor but works differently in the band that matters. At low frequency it is a low-resistance inductor that passes DC and signals freely; at high frequency the ferrite material becomes lossy and its impedance turns largely resistive, so instead of reflecting high-frequency noise it dissipates that energy as heat. That is why beads are specified by an impedance-versus-frequency curve and a rating like '600 Ω at 100 MHz' — you pick the bead whose impedance peaks where your noise lives, typically tens to hundreds of megahertz. Two cautions decide whether a bead helps or hurts. It carries the load's DC current, and ferrite saturates: past its rated current the impedance collapses and the bead stops working, so it must be derated for the real bias. And a bead in series with a decoupling capacitor forms an LC resonator that can ring and actually amplify noise at its resonance unless it is damped — so a bead added carelessly to 'clean up' a rail can make a supply worse, not better.",
        ],
      },
      {
        type: "prose",
        heading: "Chokes and the transformer principle: coupling without a wire",
        body: [
          "Two coils sharing a magnetic core couple through their mutual inductance: current in one winding drives magnetic flux through the core, and that changing flux induces a voltage in the second winding, so energy crosses from one coil to the other with no electrical connection between them. That is a transformer, and it is exactly the 'two inductors, one on each side, power passing through with no physical connection' picture — the power flows through the shared magnetic field, not through any wire joining the windings. This single principle underlies galvanic isolation (an isolated DC-DC converter or a mains transformer passes power while keeping the two sides electrically separate, breaking ground loops and blocking DC and low-frequency common-mode paths) and, more loosely coupled, contactless and wireless power transfer, where two coils exchange energy across an air gap. The transformer's turns ratio scales voltage and current, and its imperfect isolation at high frequency comes from the small interwinding capacitance that lets fast edges sneak across — which is why isolated designs add a shield or a common-mode choke to finish the job.",
          "The same two-winding structure, wound so the intended currents cancel, becomes a common-mode choke — the workhorse of noise filtering. Both conductors of a pair pass through the same core wound so that the wanted differential current (out on one wire, back on the other) produces opposing fluxes that cancel, presenting almost no impedance and passing the signal or power untouched. Common-mode current, flowing the same way on both wires, produces fluxes that add, so it sees the full inductance and a high impedance that chokes it off. The result is a component that strips common-mode noise from a pair while leaving the differential signal alone — which is why USB, Ethernet, and AC power inputs almost always have one. An ordinary series inductor (a differential-mode choke) does the opposite job, blocking differential noise on a line. Recognizing that the transformer, the isolation barrier, and the common-mode choke are all the same coupled-winding physics seen from different angles is the insight that ties this whole area together.",
        ],
      },
      {
        type: "formula",
        heading: "Coupled windings, two ways",
        formula: "Transformer:  V₂/V₁ = N₂/N₁,   M = k·√(L₁·L₂)      CM choke:  Z_cm ≈ jωL (adds),   Z_dm ≈ 0 (fluxes cancel)",
        explanation: "In a transformer the voltage scales with the turns ratio and the coupling is set by the mutual inductance M (k is the coupling coefficient, near 1 for a tight core, well below 1 for wireless-power coils across an air gap). A common-mode choke is the same two coupled windings arranged for noise: differential current creates canceling fluxes so it sees almost zero impedance and passes freely, while common-mode current creates adding fluxes so it sees the full inductive impedance jωL and is blocked. Same physics, opposite intent.",
        terms: [
          { symbol: "N₁, N₂", meaning: "Primary and secondary turns", unit: "—" },
          { symbol: "k, M", meaning: "Coupling coefficient and mutual inductance", unit: "—, H" },
          { symbol: "Z_cm / Z_dm", meaning: "Choke impedance to common / differential mode", unit: "Ω" },
        ],
      },
      {
        type: "prose",
        heading: "Filtering the AC line: X-caps, Y-caps, and the line filter",
        body: [
          "An AC mains input filter is where these pieces assemble into a standard block, and its parts are named by where they connect and what they shunt. A common-mode choke handles the common-mode noise on line and neutral together. X-capacitors connect across the lines (line-to-neutral) and shunt differential-mode noise; they sit directly across the mains, so they are rated for that voltage and built to fail open rather than short. Y-capacitors connect from a line to protective earth or the chassis and shunt common-mode noise to ground; because they bridge to a surface a person can touch, they are safety-critical — their value is deliberately limited to keep the earth leakage current below a safe threshold, and they use fail-open safety construction so a failed cap cannot make the chassis live. Together the choke and the X/Y capacitors form an LC (often pi) filter that works in both directions: it stops the device's own switching noise from polluting the mains (emissions) and stops line-borne transients and noise from entering the device (immunity).",
          "The placement rule from the layout view still governs: the filter belongs right at the connector boundary with a short, low-inductance return to the chassis, because a filter placed deep inside the board lets noise couple around it onto the very cables it was meant to clean. A filter is only as good as the loop it presents to high-frequency current.",
        ],
      },
      {
        type: "prose",
        heading: "The toolbox, and choosing by mechanism and frequency",
        body: [
          "Around those staples sits a broader set of tools, and the strategic rule for using them mirrors the layout note: work from the source outward, because reducing noise where it is generated is smaller and cheaper than filtering it after it has spread. At the source, slow the edges that have slack (series resistors, controlled slew rates), add an RC snubber across a hard-switching node to damp the ringing that radiates, and enable spread-spectrum clocking to smear narrowband peaks across a band. At the boundaries, use LC and pi filters (higher order for steeper roll-off), feedthrough capacitors for the lowest-inductance shunt through a shield wall, ferrite clamps on cables, and shielding cans and gaskets to contain what escaped. Only after source and boundary control does brute-force shielding earn its keep — a shield is an admission the energy got out, and every seam and cable penetration renegotiates its value.",
          "It helps to separate the two noise regimes the tools address. Radiated and conducted RF noise is high-frequency energy from fast edges and switching — killed by ferrite beads, common-mode chokes, small loops, edge control, and shielding. Low-frequency AC noise and ripple — mains harmonics, 50/60 Hz hum, and switching-frequency ripple on rails — is handled instead by bulk filtering, larger inductors and capacitors, and clean grounding that avoids ground loops. The inductor technology follows the regime: air-core parts never saturate but store little energy and suit high-frequency RF; powdered-iron cores saturate softly and are cheap but lossy at high frequency; ferrite cores offer high permeability with low high-frequency loss but saturate hard, making them the default for HF chokes and beads; and high-permeability nanocrystalline or amorphous cores pack large common-mode inductance into a small choke for line filters. Matching the core material and the component to the mode and frequency of the noise is what separates a filter that works from one that just adds cost.",
        ],
      },
      {
        type: "table",
        heading: "Filter components by the noise they target",
        columns: ["Component", "Targets", "Mechanism", "Watch out for"],
        rows: [
          ["Ferrite bead", "HF noise on a line", "Turns lossy/resistive at HF — absorbs as heat", "DC saturation; LC ringing with decoupling caps"],
          ["Common-mode choke", "Common-mode noise on a pair", "High Z to common mode, ~0 to differential", "Saturation; leakage inductance; core material vs band"],
          ["Differential (series) inductor", "Differential-mode noise / ripple", "Series impedance to the loop current", "DCR, saturation current, size"],
          ["X-capacitor (line-to-line)", "Differential mains noise", "Shunts across the line", "Must be X-rated, fail-open, self-heal"],
          ["Y-capacitor (line-to-ground)", "Common-mode mains noise", "Shunts to chassis/earth", "Safety-limited value (leakage); fail-open construction"],
          ["Transformer / isolation", "Ground loops, DC & LF common mode", "Magnetic coupling, no galvanic path", "Interwinding capacitance passes HF; add shield/CM choke"],
          ["RC snubber", "Ringing at a switching node", "Damps the resonance at the source", "Dissipates power; size R and C to the ring"],
        ],
      },
      {
        type: "callout",
        heading: "Match the filter to the noise mode; treat the source first",
        body: "A differential filter does nothing for common-mode noise and vice versa, so measure the mode (a current clamp on the whole cable reveals common-mode current) before choosing parts. Then work from the source outward — slow edges, snub ringing, shrink loops — because source control fixes the cause while a filter only treats the symptom, and place any boundary filter right at the connector with a short return.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "EMI mitigation review",
        items: [
          "Diagnose the noise mode (differential vs common) and its frequency before selecting components.",
          "Choose ferrite beads from the impedance-vs-frequency curve at the target frequency; derate for DC bias and check for LC ringing.",
          "Use common-mode chokes on pairs and cables; pick the core material for the band and confirm it won't saturate.",
          "On an AC input, combine a CM choke with X-caps (differential) and safety-rated Y-caps (common-mode to chassis), at the connector boundary.",
          "Use isolation (a transformer) to break ground loops, and finish its HF leakage with a shield or CM choke.",
          "Reduce noise at the source first — slower edges, snubbers, spread spectrum, smaller loops — before adding filters or shielding.",
          "Separate HF RF mitigation (beads, chokes, shielding) from LF/AC ripple mitigation (bulk L and C, grounding).",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why must you identify the noise mode before choosing a filter?", answer: "Differential-mode noise flows out one conductor and back the other; common-mode flows the same way on all conductors and returns through ground. A capacitor across a pair kills differential noise but not common-mode, and a common-mode choke does the reverse — the wrong part does nothing." },
          { question: "How does a ferrite bead differ from an ideal inductor, and how do you choose one?", answer: "At high frequency the ferrite becomes lossy and its impedance turns resistive, dissipating noise as heat rather than reflecting it. Choose by the impedance-vs-frequency curve (e.g. 600 Ω at 100 MHz), derate for DC saturation, and watch for LC ringing with decoupling caps." },
          { question: "Explain 'two inductors with no physical connection' passing power.", answer: "Two coils on a shared magnetic core couple through mutual inductance: current in one drives flux that induces voltage in the other, so power crosses via the magnetic field with no electrical connection. That is a transformer — the basis of galvanic isolation and, loosely coupled, wireless power. Wound so differential fluxes cancel, the same structure is a common-mode choke." },
          { question: "What are X-caps and Y-caps in an AC line filter?", answer: "X-caps connect line-to-line and shunt differential-mode noise (X-rated, fail-open). Y-caps connect line-to-ground/chassis and shunt common-mode noise, but are safety-critical: their value is limited to bound touch-leakage current and they use fail-open construction. With a common-mode choke they form the mains filter." },
        ],
      },
    ],
    sources: [ottEmc, wurthMagnetics],
    related: ["emi-emc-pcb-design", "rf-and-antenna-fundamentals", "transformers-and-isolation", "decoupling-and-board-level-filtering", "single-ended-vs-differential-signaling"],
  },
  {
    slug: "rf-testing-and-measurement",
    libraryId: "technical",
    collectionId: "rf-antennas-emc",
    title: "RF testing & measurement",
    summary: "The spectrum analyzer as the RF eye — RBW, span, detectors, and protecting its front end — the VNA workflow for tuning antennas in place (S11, Smith chart, calibration), transmitter and receiver measurements, desense hunting on dense platforms, and honest range testing.",
    readingTime: 19,
    updatedAt: "Aug 8",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Two instruments carve up the RF world",
        body: [
          "RF work runs on two complementary instruments, and knowing which question belongs to which is the first skill. The spectrum analyzer answers what energy exists — it sweeps a receiver across a frequency span and plots power versus frequency, revealing carriers, harmonics, spurs, noise floors, modulation bandwidth, and interference: the tool for measuring what a transmitter emits and what an environment contains. The vector network analyzer answers how a network behaves — it stimulates a device with a known swept signal and measures what reflects (S11) and what passes through (S21) in magnitude and phase: the tool for characterizing antennas, filters, cables, and matching networks. A signal generator (often with calibrated output down to −100 dBm and below) completes the trio as the known stimulus for receiver testing.",
          "The craft with both instruments is largely about not fooling yourself. Every displayed number passes through settings that change its meaning — resolution bandwidth, detector mode, reference level, calibration state — and through a physical path (cables, attenuators, couplers, antennas) whose losses must be accounted. The discipline mirrors the oscilloscope craft in the instruments note: before trusting a reading, ask what the instrument is actually measuring, through what, at what settings, and what it would show if the thing you fear were true.",
        ],
      },
      {
        type: "prose",
        heading: "Spectrum analyzer craft: RBW, detectors, and the front end you must protect",
        body: [
          "The resolution bandwidth (RBW) is the analyzer's most consequential setting: it is the width of the filter swept across the span, and it sets what you can resolve and what noise floor you see. Narrow RBW separates close-spaced signals and drops the displayed noise floor (noise power scales with bandwidth — 10 dB lower per 10× narrower RBW), at the cost of slower sweeps; wide RBW sweeps fast but smears detail and raises the floor. Comparing a signal against a limit or a sensitivity number is only meaningful with the RBW stated. Detector modes matter the same way: peak detection catches the worst-case burst (right for interference hunting and compliance), while average/RMS detection reads the true power of noise-like or modulated signals — the wrong detector misreads a pulsed or spread signal by many dB. Span and sweep-time interact with RBW (too fast a sweep for the RBW under-reads amplitudes; modern analyzers warn, older ones just lie), and the reference level sets the input attenuation that keeps the analyzer's own mixer linear — overdrive it and the analyzer manufactures harmonics that are not in your signal.",
          "Above all, protect the front end. A spectrum analyzer input survives perhaps +20 to +30 dBm; a one-watt transmitter is +30 dBm before antenna gain, and connecting a transmitter — or even keying one near a connected antenna — can destroy a five-figure instrument in milliseconds. Transmitter measurements therefore go through calibrated attenuation (30–40 dB power attenuators, directional couplers) sized so the worst case lands comfortably inside the safe window, with the attenuation value added back into every reading. The habit that saves instruments: compute the power budget of the measurement path before connecting anything, every time.",
        ],
      },
      {
        type: "prose",
        heading: "The VNA workflow: tuning an antenna where it lives",
        body: [
          "The vector network analyzer's defining ritual is calibration: measuring known standards (open, short, load, through — SOLT) at the exact plane where the device will connect, so the instrument can mathematically remove everything between itself and that plane — cables, adapters, their loss and phase. An uncalibrated or stale-calibrated VNA measures its own test leads; calibration moves the measurement reference to the tip of the cable, and re-calibration follows any change to the setup. With that done, S11 (return loss) versus frequency is the antenna-tuning instrument: it shows how much power reflects from the antenna across the band, the dip marking resonance, its depth the match quality (−10 dB return loss ≈ 90% power accepted, VSWR 2:1 — the usual acceptance floor; −20 dB is excellent), and its frequency the thing your matching network must move.",
          "The workflow for a real product antenna: measure S11 with the antenna mounted in its final position on the final airframe or enclosure — because ground planes, carbon fiber, batteries, and enclosures all detune (the antenna-fundamentals note's lesson made measurable) — then read the Smith chart to see whether the impedance at the target frequency is inductive or capacitive and by how much, choose matching components (the L/pi network from the antenna note), populate, and re-measure. Iterate until the dip sits on the operating band with margin, then verify the tune survives the realistic perturbations: hand effects, battery states, payload changes. S21 measurements extend the same instrument to filters (passband shape, rejection), cables (loss), and antenna-to-antenna isolation on a platform — a direct number for how much a transmitter couples into a neighbouring receiver's port.",
        ],
      },
      {
        type: "prose",
        heading: "Transmitter, receiver, and desense measurements",
        body: [
          "Transmitter verification is a spectrum-analyzer checklist: carrier power (through the calibrated attenuator, with detector and RBW appropriate to the modulation), frequency accuracy, occupied bandwidth, harmonics (the second and third harmonic of an ISM-band transmitter are the classic compliance failures — measured against the regulatory limit lines), and spurious emissions elsewhere in the spectrum. Near-field probes over the board localize where a spur physically originates the same way they do for EMI — because an RF product's compliance problems are EMI problems with a licensed vocabulary.",
          "Receiver sensitivity is measured with the calibrated signal generator: reduce the known input level until the receiver hits its error-rate or lock threshold — that level is the sensitivity, and it anchors the link budget. Desense — the loss of sensitivity when the rest of the platform operates — is the measurement that matters on dense systems: measure sensitivity with everything else quiet, then repeat with each aggressor active (transmitter keyed on another band, camera streaming, motors under PWM, digital buses busy) and chart the sensitivity delta per aggressor. A GNSS receiver losing 10 dB of sensitivity when the video transmitter keys is a concrete, attackable number — traced with near-field probes to a harmonic or a coupling path, fixed with separation, shielding, or filtering, and verified by re-measuring the same delta. This aggressor-matrix workflow is the RF equivalent of the failure-signature tables elsewhere in this library: systematic, quantified, one variable at a time.",
        ],
      },
      {
        type: "prose",
        heading: "Range testing and the honesty rules",
        body: [
          "The final verification is the link in its environment, and its instrument is logged RSSI versus distance. A scaled ground range test — walking or driving the link away while logging signal strength — verifies the budget's slope (free space predicts −6 dB per doubling of distance; faster decay reveals obstructions, multipath, or antenna problems) and finds the margin at mission range without risking an aircraft. Attitude effects are tested deliberately: rotating the platform through its operating orientations while watching RSSI exposes antenna nulls and shadowing that a fixed test never sees. The honesty rules: account every dB in the path (antenna gains, cable losses, attenuators), state the RBW and detector for any power number, verify against a second method when a result surprises (a power meter cross-checks the analyzer; a known-good antenna cross-checks a VNA tune), and log everything with configuration so results regress across builds.",
          "A note on environments: open-air range tests share the spectrum with the world — coordinate frequencies and power legally, and be aware that the ambient environment (Wi-Fi congestion, other operators) is part of the measurement. Anechoic and shielded chambers remove those variables for pattern and emissions work when repeatability matters more than realism; the field test remains the final word on whether the system works where it must.",
        ],
      },
      {
        type: "table",
        heading: "Which instrument answers which question",
        columns: ["Question", "Instrument", "Key settings / cautions"],
        rows: [
          ["What is this transmitter emitting?", "Spectrum analyzer + power attenuator", "RBW stated, right detector, protect the front end"],
          ["Is the antenna matched on this airframe?", "VNA (S11 / Smith chart)", "Calibrate at the connection plane; measure in final position"],
          ["How much does TX A couple into RX B?", "VNA (S21 between antenna ports)", "Isolation in dB, across band"],
          ["What is the receiver's sensitivity?", "Calibrated signal generator", "Reduce level to error threshold; account path loss"],
          ["What does the platform do to its own receivers?", "Sensitivity vs aggressor matrix", "One aggressor at a time; chart the deltas"],
          ["Where does this spur come from?", "Near-field probes + analyzer", "Localize on the board, then fix the source or path"],
          ["Does the link close at mission range?", "Range test with logged RSSI", "Check the −6 dB/doubling slope; test attitudes"],
        ],
      },
      {
        type: "callout",
        heading: "Attenuate first, calibrate always, state your settings",
        body: "The three habits that keep RF measurements honest and instruments alive: compute the power budget of the measurement path before connecting (a keyed transmitter into an unprotected analyzer front end is a destroyed mixer); calibrate the VNA at the plane of measurement and re-calibrate after any setup change; and never quote a power or sensitivity number without the RBW, detector, and path losses that define it.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "RF measurement review",
        items: [
          "Route every transmitter measurement through calibrated attenuation sized for the worst case; add it back into readings.",
          "Set RBW deliberately: narrow to resolve and lower the floor, wide to sweep fast; state it with every number.",
          "Match the detector to the signal: peak for interference/compliance, average/RMS for noise-like power.",
          "SOLT-calibrate the VNA at the connection plane; re-calibrate after any cable or adapter change.",
          "Tune antennas mounted in final position; verify S11 across realistic perturbations (hands, battery, payload).",
          "Measure antenna-to-antenna isolation (S21) on dense platforms; build the desense aggressor matrix.",
          "Range-test with logged RSSI; verify the −6 dB-per-doubling slope and attitude effects.",
          "Cross-check surprising results with a second method; log configuration with every measurement.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What does RBW control on a spectrum analyzer?", answer: "The width of the swept filter: it sets frequency resolution (separating close signals), the displayed noise floor (10 dB lower per 10× narrower — so sensitivity comparisons need the RBW stated), and sweep time. Wrong RBW or detector misreads pulsed and modulated signals by many dB." },
          { question: "Why must a VNA be calibrated, and where?", answer: "Calibration (measuring open/short/load/through standards) moves the measurement plane to the exact point of connection, mathematically removing cable and adapter loss and phase. Uncalibrated, the VNA measures its own leads; calibration is redone after any setup change." },
          { question: "How do you measure and attack desense on a dense platform?", answer: "Measure receiver sensitivity with the platform quiet, then re-measure with each aggressor active one at a time (other transmitters, cameras, motors, buses) and chart the sensitivity loss per aggressor. Localize the coupling with near-field probes and S21 isolation measurements, fix with separation/shielding/filtering, and verify by re-measuring the same delta." },
          { question: "Why does a transmitter measurement need an attenuator, and what else must be recorded?", answer: "Analyzer front ends survive ~+20–30 dBm and a transmitter can exceed that directly — a 30–40 dB power attenuator keeps the mixer safe and linear (an overdriven mixer manufactures harmonics that aren't real). The attenuation, RBW, detector, and path losses must all be recorded for the number to mean anything." },
        ],
      },
    ],
    sources: [keysightSpectrum, keysightVna],
    related: ["rf-and-antenna-fundamentals", "emi-filtering-and-mitigation", "drone-rf-links-and-link-budgets", "lab-instruments-and-measurement", "emi-emc-pcb-design"],
  },
];
