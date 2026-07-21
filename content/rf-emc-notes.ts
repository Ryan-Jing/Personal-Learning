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
    related: ["emi-filtering-and-mitigation", "pcb-materials-and-impedance", "single-ended-vs-differential-signaling", "enclosures-and-ingress-protection"],
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
];
