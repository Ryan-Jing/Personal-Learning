import type { Note, Source } from "./library";

const px4Docs: Source = {
  title: "PX4 Autopilot — Hardware Integration and Vibration Isolation",
  publisher: "PX4 / Dronecode Foundation",
  url: "https://docs.px4.io/main/en/assembly/vibration_isolation.html",
  kind: "Documentation",
};

const ardupilotDocs: Source = {
  title: "ArduPilot — Measuring Vibration and Hardware Setup",
  publisher: "ArduPilot Project",
  url: "https://ardupilot.org/copter/docs/common-measuring-vibration.html",
  kind: "Documentation",
};

const batteryUniversity: Source = {
  title: "BU-206 / BU-409: Lithium-Polymer and Charging Lithium-Ion",
  publisher: "Battery University",
  url: "https://batteryuniversity.com/articles",
  kind: "Reference",
};

const pozarMicrowave: Source = {
  title: "Microwave Engineering (4th ed.)",
  publisher: "David Pozar, Wiley",
  url: "https://www.wiley.com/en-us/Microwave+Engineering%2C+4th+Edition-p-9780470631553",
  kind: "Book",
};

const fccPart15: Source = {
  title: "47 CFR Part 15 — Unlicensed RF Devices (ISM bands)",
  publisher: "Electronic Code of Federal Regulations",
  url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15",
  kind: "Reference",
};

const milStd810: Source = {
  title: "MIL-STD-810H — Environmental Engineering Considerations and Laboratory Tests",
  publisher: "U.S. Department of Defense",
  url: "https://www.dau.edu/dau-hub/documents/mil-std-810h",
  kind: "Reference",
};

export const droneSystemsNotes: Note[] = [
  {
    slug: "drone-platform-electronics",
    libraryId: "technical",
    collectionId: "drones-and-flight-systems",
    title: "Drone platform electronics",
    summary: "The electrical architecture of a multirotor: flight controller and its sensors, ESCs and the motor bus, the power tree from battery to clean rails, radio subsystems, and the integration hazards — noise, placement, wiring — that decide whether the assembly actually flies well.",
    readingTime: 19,
    updatedAt: "Aug 8",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A drone is a flying integration problem",
        body: [
          "A multirotor's electronics are individually simple — a microcontroller, motor drivers, sensors, radios, a battery — but they are packed centimetres apart on a vibrating, high-current, weight-limited airframe, and nearly every hard problem in drone hardware is an interaction between subsystems rather than a failure of one. The motor bus carries tens of amps of chopped current beside a magnetometer trying to sense the Earth's field at microtesla resolution; a video transmitter radiates watts next to a GPS receiver hunting signals below the thermal noise floor; the gyro that stabilizes the aircraft bolts to a frame shaken by the very motors it commands. The architecture is therefore best learned as a set of subsystems plus their interference relationships, because the second list is where the engineering lives.",
          "The canonical stack: a flight controller (FC) — an STM32-class MCU fusing an IMU, barometer, and often magnetometer and GPS into an attitude estimate and running the control loops; electronic speed controllers (ESCs) turning the FC's throttle commands into three-phase brushless motor drive; a power distribution system routing battery current to the ESCs and regulating clean rails for logic, sensors, and radios; and the radio set — control receiver, video transmitter, telemetry — connecting the aircraft to its operator and systems. Each is covered by fundamentals elsewhere in this library (the BLDC physics in the motor-control note, the converter design in the power notes); this note is about how they compose into an aircraft.",
        ],
      },
      {
        type: "prose",
        heading: "The flight controller and its sensors",
        body: [
          "The FC's job is a fast loop: read the gyro, estimate attitude, compute motor commands, repeat — at rates from 1 kHz to 8 kHz on performance platforms. The gyro is the critical sensor: attitude control is fundamentally rate control, and everything else (accelerometer for gravity reference and vibration-sensitive velocity estimation, barometer for altitude, magnetometer for heading, GPS for position) corrects slower drift around the gyro's fast signal. That hierarchy explains the platform's obsessions: gyro mounting and vibration isolation matter more than any other mechanical decision (a gyro that clips or aliases under vibration feeds the controller garbage — the subject of the vibration note), and the sensor-fusion filter's health is diagnosed from logs before anything else.",
          "Each aiding sensor has a characteristic vulnerability that placement must respect. The magnetometer measures fields in the tens of microtesla, and a wire carrying ten amps generates a comparable field millimetres away — so compasses live on GPS masts, as far from power wiring as the airframe allows, and are calibrated after every hardware change; the classic 'toilet bowl' orbit of a GPS-hold drone is magnetic interference corrupting the heading estimate. The barometer senses sub-pascal pressure changes and must be shielded from prop wash and direct light (foam over the port is standard practice). GPS antennas need sky view and distance from every on-board emitter — their signals arrive below the noise floor and are trivially desensed by harmonics from cameras, VTX, or fast digital buses. Blackbox logging — high-rate recording of gyro, setpoints, motor outputs, currents, and voltages — is the platform's built-in instrumentation and the first tool of every investigation.",
        ],
      },
      {
        type: "prose",
        heading: "ESCs and the motor bus",
        body: [
          "The ESC is a sensorless BLDC drive: it commutates the motor by back-EMF estimation (the six-step/sensorless machinery of the motor-control note), delivering the motor's chopped phase currents from MOSFET bridges at PWM frequencies of 24–96 kHz. Modern control links from FC to ESC are digital — DShot being the standard family — replacing analog servo PWM with a framed, checksummed command stream that also carries telemetry back (RPM, temperature, current), the RPM stream feeding the FC's vibration notch filters. Four-in-one ESC boards put all bridges on one PCB under the FC, shortening motor leads at the cost of concentrating heat and coupling.",
          "The motor bus is the aircraft's EMC problem in miniature. Battery leads and ESC inputs carry the full flight current with sharp PWM edges; every centimetre of that loop is an antenna, and the bus's inductance turns current steps into voltage spikes. Low-ESR bulk capacitance at the ESC power inputs is not optional — it absorbs the spikes that otherwise stress FETs and reset electronics — and long battery leads demand more of it. The infamous connect-spark (inrush charging those very capacitors) is tamed by anti-spark circuits or resistor-precharge connectors. Wiring discipline carries the rest: short, twisted battery and phase leads to shrink loop area, power routed away from sensor and antenna zones, and grounds arranged so motor return current never shares a path with sensor references — the same return-path thinking as every mixed-signal board, at ten amps.",
        ],
      },
      {
        type: "prose",
        heading: "The power tree, radios, and the weight budget",
        body: [
          "The power architecture is a compact version of the power-tree note: the raw battery bus (2S–12S, sagging and spiking with throttle) feeds the ESCs directly, while regulators — BECs, usually small bucks — derive clean rails: 5 V for the FC and receiver, 9–12 V for video systems, 3.3 V for logic. The design pressures are the usual ones plus flight stakes: a rail brownout that reboots a bench gadget crashes an aircraft, so FC supplies get generous holdup and filtering (an LC filter on video power is standard against motor-noise 'ripple lines' in analog FPV), and current/voltage sensing on the main bus feeds both the operator's telemetry and the logs that reconstruct any incident.",
          "Radios complete the platform: a control receiver (commonly 2.4 GHz, or 900 MHz for range), a video transmitter (5.8 GHz analog or digital HD), and often a separate telemetry link — their bands, budgets, and placement being the subject of the RF-links note. Over all of it sits the constraint that makes drone design distinctive: mass. Every gram of wiring, connector, and copper trades against flight time and agility (the battery-mass spiral of the LiPo note), so the platform rewards integration — combined FC/ESC stacks, shared connectors, right-sized wire gauge — while every integration step packs the interference sources closer together. Managing that trade deliberately, rather than discovering it in flight, is the platform designer's core skill.",
        ],
      },
      {
        type: "table",
        heading: "Subsystems and their classic integration hazards",
        columns: ["Subsystem", "Function", "Classic integration hazard"],
        rows: [
          ["Flight controller + IMU", "Attitude estimation and control loops", "Vibration corrupting the gyro; mount and filter deliberately"],
          ["ESCs / motor bus", "Three-phase BLDC drive from FC commands", "PWM noise, bus spikes (needs low-ESR caps), connect-spark"],
          ["Magnetometer", "Heading reference", "Fields from power wiring — 'toilet bowling'; mount on mast, recalibrate"],
          ["Barometer", "Altitude reference", "Prop wash and light on the port; foam cover"],
          ["GPS", "Position/velocity aiding", "Desense from VTX, cameras, digital harmonics; sky view, separation"],
          ["Control RX / VTX / telemetry", "Command, video, data links", "Mutual desense and antenna shadowing; placement per RF-links note"],
          ["BECs / regulators", "Clean rails from dirty bus", "Brownout on throttle punch; video noise without LC filtering"],
        ],
      },
      {
        type: "callout",
        heading: "Every subsystem works on the bench; the aircraft is the test",
        body: "Drone electronics fail as interactions: the magnetometer is fine until flight current flows, the GPS is fine until the VTX transmits, the gyro is fine until the props spin. Bench bring-up (per the bring-up note) proves each subsystem alone; only integrated testing with motors under load, radios transmitting, and real vibration proves the aircraft. Plan the test sequence around interactions, not units.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Platform integration review",
        items: [
          "Map the architecture: FC, ESCs, power tree, sensors, radios — and every interference relationship between them.",
          "Mount and isolate the gyro deliberately; verify with blackbox spectra before tuning anything.",
          "Keep the magnetometer far from power wiring; recalibrate after any hardware change.",
          "Fit low-ESR bulk capacitance at ESC inputs; manage connect-spark; twist and shorten high-current leads.",
          "Derive clean rails with margin against throttle-punch sag; LC-filter video power.",
          "Place GPS with sky view away from emitters; shield the barometer from wash and light.",
          "Instrument the bus (V/I sensing) and enable blackbox logging before the first flight.",
          "Audit every gram: wire gauge, connectors, and stacking against the mass budget.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is the gyro the critical sensor on a multirotor?", answer: "Attitude control is rate control: the control loops run on gyro data at kHz rates, while accelerometer, barometer, magnetometer, and GPS only correct slow drift. Corrupt the gyro (vibration, clipping, aliasing) and the controller acts on garbage — which is why gyro mounting and filtering dominate platform design." },
          { question: "What causes 'toilet bowling' in GPS-hold and how is it prevented?", answer: "Magnetometer corruption: fields from high-current power wiring (comparable to Earth's field at close range) skew the heading estimate, so position corrections push in the wrong direction and the aircraft orbits. Fix: mount the compass on a mast away from power paths and recalibrate after hardware changes." },
          { question: "Why do ESC inputs need low-ESR bulk capacitors?", answer: "The motor bus carries chopped tens-of-amps current through wiring inductance; current steps become voltage spikes that stress FETs and reset electronics. Bulk capacitance at the ESC absorbs the spikes — with more needed as battery leads lengthen. The connect-spark is the inrush charging these caps." },
          { question: "How does the mass budget shape drone electronics?", answer: "Every gram trades against flight time and agility (battery-mass spiral), rewarding integration — combined stacks, shared connectors, right-sized wire — but integration packs noise sources closer to sensitive sensors, so the design is a deliberate trade between weight and interference, not a free optimization." },
        ],
      },
    ],
    sources: [px4Docs, ardupilotDocs],
    related: ["motor-control-fundamentals", "lipo-batteries-and-drone-power", "drone-rf-links-and-link-budgets", "vibration-environmental-and-flight-testing", "imu-and-orientation-estimation", "power-architecture-and-poe", "emi-filtering-and-mitigation"],
  },
  {
    slug: "lipo-batteries-and-drone-power",
    libraryId: "technical",
    collectionId: "drones-and-flight-systems",
    title: "LiPo batteries & drone power",
    summary: "Why lithium-polymer owns flight: S/P nomenclature and the discharge curve, C-ratings and voltage sag as internal-resistance physics, flight-time arithmetic and the battery-mass spiral, charging and storage discipline, and the safety practices for damaged and failing packs.",
    readingTime: 18,
    updatedAt: "Aug 8",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Why LiPo owns flight",
        body: [
          "Aircraft select batteries on two axes at once: specific energy (Wh/kg — how long you fly) and specific power (W/kg — how hard you can pull), and lithium-polymer pouch cells sit at the sweet spot. The pouch construction — flat cells in foil laminate, no rigid can — packs well into airframes and, critically, supports the enormous discharge currents flight demands: a racing quad can draw over 100 A from a 1.5 Ah pack, a rate that would destroy the cylindrical cells in a laptop. The cost side of the ledger: pouches are mechanically fragile (no can to resist puncture or swelling), the chemistry is the energetic end of lithium-ion (higher fire risk than LFP — the deliberate opposite of the stationary-storage choice in the solar note), and cycle life is short by stationary standards. Every one of those trades is accepted because mass rules flight.",
          "The vocabulary: cells run 3.0–4.2 V (nominal 3.7 V, or 4.35 V for LiHV variants), and packs are named S for series cells and P for parallel groups — a 6S pack is ~22.2 V nominal, 25.2 V full. The discharge curve matters operationally: it falls quickly from 4.2 V, spends most of its capacity on a plateau near 3.7 V, then cliffs below ~3.5 V — so voltage is a usable but nonlinear fuel gauge, and the cliff is why per-cell low-voltage alarms and conservative cutoffs (≥3.3–3.5 V under load) exist. Li-ion cylindrical packs (higher energy, far lower C-rate) appear on endurance aircraft where cruise current is modest — the same two-axis selection landing at a different point.",
        ],
      },
      {
        type: "formula",
        heading: "C-rate, sag, and flight time",
        formula: "I_max = C × Q      V_loaded = V_oc − I·R_int      t_flight ≈ (E_usable) / P_avg = (V_nom·Q·DoD) / P_avg",
        explanation: "The C-rating expresses current relative to capacity: a 1500 mAh 50C pack notionally supports 75 A continuous — though marketing C-ratings are notoriously optimistic, and the honest measurements are internal resistance and temperature rise under real load. Voltage sag is just Ohm's law through the pack's internal resistance: a pack with 5 mΩ/cell at 60 A sags 0.3 V per cell — which is why loaded and resting voltages differ, why sag grows as packs age (R_int rises), and why a hard throttle punch can dip a tired pack below the FC's brownout threshold. Flight time is energy over average power, derated by usable depth of discharge (~80% for pack longevity): a 6S 5 Ah pack (~111 Wh) at 400 W hovers roughly 13 usable minutes. The battery-mass spiral hides in P_avg: more battery mass raises the power needed to hover, so flight time grows sublinearly with capacity and every airframe has a battery mass beyond which endurance falls.",
        terms: [
          { symbol: "C × Q", meaning: "C-rating times capacity = rated current", unit: "A" },
          { symbol: "R_int", meaning: "Internal resistance (per cell / pack)", unit: "mΩ" },
          { symbol: "DoD", meaning: "Usable depth of discharge", unit: "~0.8" },
        ],
      },
      {
        type: "prose",
        heading: "Charging, storage, and pack health",
        body: [
          "Lithium charging is constant-current then constant-voltage to exactly 4.20 V per cell, and multi-cell packs add the balance requirement: series cells drift apart, and since the charger sees only the sum, an unbalanced pack can hold one cell above 4.2 V while the total looks legal — the balance lead lets the charger equalize cells individually, and balance charging is the norm, not an option. The conventional rate is 1C (faster ages the pack and raises risk), charging only on a supervised, fire-safe surface. Storage discipline is the most-ignored life extender: a full LiPo degrades measurably per week sitting at 4.2 V, so packs are stored at ~3.8 V per cell ('storage charge'), cool, and are discharged to storage — not left full — after a session that didn't use them.",
          "Pack health is trackable: internal resistance per cell (rising R_int is the aging signal and the sag predictor), capacity retention, balance drift at rest (a cell that keeps sagging relative to siblings is failing), and physical condition. Puffing — the pouch swelling with electrolyte-decomposition gas — is the visible symptom of abuse or age: a puffed pack has permanently elevated resistance and elevated risk, and it is retired, not flown. Logging per-pack cycle counts and resistance (packs get numbered; fleets get spreadsheets) turns battery management from folklore into data — the same per-unit-records discipline as any validation program.",
        ],
      },
      {
        type: "prose",
        heading: "Safety: the failure modes and the discipline",
        body: [
          "The hazard model is thermal runaway: overcharge, over-discharge followed by recharge, internal short from physical damage, or external short can push a cell into self-heating exothermic decomposition — venting flame and dense smoke that does not need external oxygen and reliably ignites neighbouring cells. The triggers worth respecting in a lab and flight-test context: crash damage (a pack that took a hard hit can develop an internal short minutes or hours later — quarantine it on concrete/steel away from anything flammable before storage or disposal), charging unattended or with wrong settings (cell count!), puncture by screws or carbon shards in an airframe, and shorted connectors in a toolbag (XT60s with exposed male pins meet ring spanners).",
          "The countermeasures are procedural and cheap: charge and store in LiPo-safe bags, ammo cans, or block enclosures, on non-flammable surfaces with smoke egress; verify charger cell-count and current settings every session; inspect packs (and reject puffed, dented, or lead-damaged ones) pre-flight; discharge damaged/retired packs fully (salt-water or resistive discharge per local practice) before disposal at battery recycling; and keep a class-appropriate response plan — you do not extinguish a lithium fire so much as contain it and protect surroundings (sand, lithium-rated extinguishers, distance). None of this is exotic; all of it is exactly the 'safely interacting with batteries' competence a hardware lab runs on.",
        ],
      },
      {
        type: "table",
        heading: "Chemistry choices, by aircraft need",
        columns: ["Chemistry", "Specific energy", "Discharge capability", "Natural fit"],
        rows: [
          ["LiPo (pouch)", "~150–200 Wh/kg", "Very high C — aggressive flight loads", "Multirotors, racing, aerobatic; short high-power flights"],
          ["LiHV (4.35 V LiPo)", "Slightly higher", "High", "Weight-critical small aircraft; costs cycle life"],
          ["Li-ion (cylindrical, e.g. 18650/21700)", "~250+ Wh/kg", "Low–moderate C", "Endurance/fixed-wing, modest cruise current"],
          ["LFP", "~90–120 Wh/kg", "Moderate, very safe, long life", "Ground/stationary (see storage note) — rarely flown"],
        ],
      },
      {
        type: "callout",
        heading: "Treat every damaged pack as armed",
        body: "A crashed or dented LiPo can short internally minutes to hours later. Quarantine it outdoors on non-flammable ground, don't recharge it, discharge fully before disposal, and never charge any pack unattended or outside a fire-safe container. Rising internal resistance, balance drift, and puffing are retirement criteria, not quirks — the pack that sags hardest is the one that browns out the aircraft on a punch.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Battery practice review",
        items: [
          "Select chemistry on the energy-vs-power axes; name the S/P configuration and its voltage window.",
          "Distrust marketing C-ratings; qualify packs by internal resistance and temperature rise under real load.",
          "Compute sag (I·R_int) at max throttle and verify rails survive it at the low-voltage cutoff.",
          "Do the flight-time arithmetic with usable DoD; respect the battery-mass spiral when upsizing.",
          "Balance-charge at ≤1C, supervised, in fire-safe containment; verify cell count every session.",
          "Store at ~3.8 V/cell; discharge to storage after sessions; track per-pack cycles and resistance.",
          "Inspect pre-flight; retire puffed/damaged packs; quarantine crash-damaged packs before disposal.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why LiPo for multirotors but Li-ion for endurance aircraft?", answer: "Selection runs on two axes: specific energy (flight time) and specific power (throttle demands). Pouch LiPo delivers very high C-rates for aggressive flight loads at good energy density; cylindrical Li-ion holds more energy per kg but can't source high C — right where cruise current is modest and endurance rules." },
          { question: "What is voltage sag and what does it predict?", answer: "Sag is the I·R_int drop under load — 5 mΩ/cell at 60 A is 0.3 V/cell. It grows as packs age (rising internal resistance is the aging signal), confounds voltage-based fuel gauging, and is what dips a tired pack below brownout on a throttle punch." },
          { question: "Why is balance charging mandatory for series packs?", answer: "The charger regulates the pack total, but series cells drift: one cell can exceed 4.2 V (dangerous) while the sum looks legal. Balance leads let the charger equalize cells individually — so multi-cell lithium charging without balancing is an overcharge waiting to happen." },
          { question: "What's the handling rule for a crash-damaged pack?", answer: "Treat it as armed: internal shorts can develop minutes to hours after impact. Quarantine outdoors on non-flammable ground, never recharge it, discharge fully before disposal at battery recycling — and keep routine charging supervised in fire-safe containment regardless." },
        ],
      },
    ],
    sources: [batteryUniversity, px4Docs],
    related: ["drone-platform-electronics", "battery-storage-for-solar-and-grid", "power-and-energy", "vibration-environmental-and-flight-testing"],
  },
  {
    slug: "drone-rf-links-and-link-budgets",
    libraryId: "technical",
    collectionId: "drones-and-flight-systems",
    title: "Drone RF links & link budgets",
    summary: "The dB arithmetic of a radio link — transmit power, antenna gains, free-space path loss, sensitivity, fade margin — the practical behavior of 2.4 and 5.8 GHz, antenna placement and polarization on an airframe, and the interference environment a dense platform creates for itself.",
    readingTime: 20,
    updatedAt: "Aug 8",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "One aircraft, several radios, one arithmetic",
        body: [
          "A working drone carries multiple simultaneous radio links with different jobs and different failure consequences: the control link (must never fail — commonly 2.4 GHz, or 900 MHz where range and penetration beat bandwidth), the video link (high bandwidth, tolerates degradation — 5.8 GHz analog or digital), telemetry (low rate, long range — 433/915 MHz), and GPS (receive-only, ~1.5 GHz, signals arriving below the noise floor). The bands are deliberately separated so the links can coexist, and every one of them obeys the same piece of arithmetic: the link budget, which adds gains and losses in decibels from transmitter to receiver and checks that what arrives clears the receiver's sensitivity with margin to spare.",
          "The decibel discipline that makes this workable: powers in dBm (0 dBm = 1 mW; 20 dBm = 100 mW; 30 dBm = 1 W), gains and losses in dB, and everything adds. Received power = transmit power + transmit antenna gain + receive antenna gain − path loss − miscellaneous losses (cables, connectors, polarization mismatch, body/airframe shadowing). Compare against sensitivity (the weakest signal the receiver can demodulate at its required error rate — e.g. −90 dBm for wideband video, −105 dBm or better for narrowband control) and the difference is the link margin. The design rule: budget a fade margin of 20–30 dB over free-space predictions, because the real world — multipath, antenna orientation, obstructions — routinely eats that much.",
        ],
      },
      {
        type: "formula",
        heading: "Free-space path loss and the link budget",
        formula: "FSPL(dB) = 32.44 + 20·log₁₀(d_km) + 20·log₁₀(f_MHz)      P_rx = P_tx + G_tx + G_rx − FSPL − L_misc      margin = P_rx − sensitivity",
        explanation: "Free-space path loss grows 6 dB per doubling of either distance or frequency — the 20·log terms. Worked example: a 25 mW (14 dBm) 5.8 GHz video transmitter with 2 dBi antennas at 1 km: FSPL = 32.44 + 0 + 75.3 ≈ 108 dB, so P_rx ≈ 14 + 2 + 2 − 108 = −90 dBm — right at a typical analog video receiver's sensitivity, i.e. zero margin: expect a degraded picture at 1 km on 25 mW, which matches field experience. The same distance at 2.4 GHz is ~7.7 dB kinder (20·log(5800/2400)), one reason control links sit lower in frequency than video. Every design lever appears as a term: more power (+dB, regulation permitting), antenna gain (+dB, at the cost of pattern narrowing), lower frequency (−FSPL), better sensitivity (narrower bandwidth, better coding — how long-range control links achieve −110 dBm-class figures).",
        terms: [
          { symbol: "FSPL", meaning: "Free-space path loss", unit: "dB" },
          { symbol: "P_tx / P_rx", meaning: "Transmit / received power", unit: "dBm" },
          { symbol: "G_tx / G_rx", meaning: "Antenna gains (dBi)", unit: "dB" },
        ],
      },
      {
        type: "prose",
        heading: "2.4 vs 5.8 GHz: the practical trade",
        body: [
          "The two workhorse bands behave differently in ways the numbers predict. 2.4 GHz: ~7.7 dB less path loss than 5.8 at any distance, meaningfully better diffraction around obstacles and penetration through vegetation and structures, larger antennas (λ ≈ 12.5 cm; a quarter-wave whip is ~31 mm) — and a congested neighbourhood, shared with Wi-Fi, Bluetooth, and every other unlicensed device, so interference rejection and channel agility matter as much as raw margin. 5.8 GHz: more path loss and nearly line-of-sight-only behavior (obstructions hurt badly), but wide bandwidth for video, small antennas, and a (relatively) cleaner band with room for many simultaneous channels — why FPV video lives there and why multi-aircraft operations do channel planning and power discipline as a matter of course.",
          "Below both sit the range bands: 900 MHz (and 433 outside the US) trade bandwidth for reach and penetration — the FSPL advantage over 5.8 GHz is ~16 dB, and modern LoRa-class control links pair it with high-sensitivity narrowband receivers for tens of kilometres. Above, GPS at ~1.5 GHz is the odd one out: receive-only, with signals below thermal noise recovered by correlation, which makes it the platform's canary — the first victim of any on-board noise source. Regulation frames everything: the ISM bands are unlicensed within EIRP limits (power plus antenna gain, not power alone), higher video power typically requires an amateur license, and compliance is a design input, not a post-hoc check — the same posture as the connection standards in the grid notes.",
        ],
      },
      {
        type: "prose",
        heading: "Antennas on an airframe: placement and polarization",
        body: [
          "The antenna-fundamentals note's rules get sharp on a drone. Carbon fiber is conductive: it shadows, detunes, and reflects — an antenna against a carbon plate is an antenna compromised, so antennas go on standoffs, wingtips, and masts with deliberate clearance. Orientation must survive maneuvers: a dipole's pattern is a donut with nulls off its ends, and an aircraft that banks 60° swings its antennas' nulls across the ground station, so control links favour orientation-tolerant placements and receive diversity (two antennas at 90°, the radio picking the better signal moment to moment) and ground stations combine omnis with steered or switched directional antennas.",
          "Polarization is a free 15–25 dB when used deliberately. Matched linear polarizations couple fully; crossed linears lose ~20 dB — devastating if accidental (a banked aircraft crossing its ground antenna), useful if intentional. FPV video standardized on circular polarization (RHCP/LHCP) for two reasons: a circular pair tolerates relative rotation (no bank-angle fades), and — the subtle one — a circularly polarized wave reverses handedness on reflection, so a same-hand receive antenna rejects the first-bounce multipath that causes ghosting in cluttered environments; opposite-hand systems flying simultaneously also gain isolation from each other. On-airframe separation completes the picture: VTX antennas away from control RX antennas (a watt-class transmitter centimetres from a receiver hunting −100 dBm is a desense machine even across bands), both away from GPS, with the interference-diagnosis craft belonging to the RF-testing note.",
        ],
      },
      {
        type: "table",
        heading: "The bands, by job",
        columns: ["Band", "Typical role", "Strengths", "Costs"],
        rows: [
          ["433 / 915 MHz", "Long-range control, telemetry", "Lowest FSPL, penetration, LoRa-class sensitivity", "Narrow bandwidth; larger antennas; regional rules"],
          ["1.5–1.6 GHz (GNSS)", "GPS receive-only", "—", "Below-noise signals; first victim of platform EMI"],
          ["2.4 GHz", "Control links", "7.7 dB better FSPL than 5.8, diffraction, mature silicon", "Congested (Wi-Fi/BT); moderate antennas"],
          ["5.8 GHz", "FPV video", "Wide bandwidth, many channels, small antennas", "High FSPL, near line-of-sight only"],
        ],
      },
      {
        type: "callout",
        heading: "Design to the margin, not the range claim",
        body: "A link that works on the bench at 3 m tells you nothing — every link works at 3 m. Run the budget: P_tx + gains − FSPL at mission range − real losses, against measured sensitivity, demanding 20–30 dB of fade margin for multipath, orientation nulls, and obstructions. Then verify by range testing with RSSI logging (the RF-testing note), because the airframe, antenna placement, and self-interference always take a bite the free-space math didn't include.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Link design review",
        items: [
          "Enumerate every link (control, video, telemetry, GNSS), its band, and its failure consequence.",
          "Run the dB budget per link: power + gains − FSPL − losses vs sensitivity, with 20–30 dB fade margin.",
          "Choose bands by the trade: lower frequency for reach/penetration, higher for bandwidth/antenna size.",
          "Mount antennas clear of carbon, with orientation-tolerant patterns or diversity for maneuvering flight.",
          "Use circular polarization for video (multipath rejection); mind cross-pol losses on linear links.",
          "Separate VTX, control RX, and GNSS antennas; treat GPS desense as the platform EMI canary.",
          "Check EIRP against the regulatory regime (power + antenna gain, licensing for higher video power).",
          "Plan channels and power for multi-aircraft operation.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Write the link budget and define fade margin.", answer: "P_rx = P_tx + G_tx + G_rx − FSPL − misc losses; margin = P_rx − sensitivity. Fade margin is the 20–30 dB of headroom budgeted over free-space predictions to absorb multipath, antenna orientation nulls, and obstructions." },
          { question: "How does FSPL scale, and what does it say about 2.4 vs 5.8 GHz?", answer: "FSPL = 32.44 + 20log(d_km) + 20log(f_MHz): +6 dB per doubling of distance or frequency. 5.8 GHz suffers ~7.7 dB more path loss than 2.4 at any range, plus worse diffraction — so control favours 2.4 (or 900 MHz), while video pays the loss for 5.8's bandwidth and clean channels." },
          { question: "Why is FPV video circularly polarized?", answer: "A circular pair tolerates aircraft bank (no cross-pol fades from rotation), and reflections reverse circular handedness, so a same-hand receiver rejects first-bounce multipath — the ghosting killer in cluttered environments. Opposite-handed systems also gain mutual isolation." },
          { question: "Why is GPS the platform's EMI canary?", answer: "GNSS signals arrive below the thermal noise floor and are recovered by correlation, so tiny amounts of on-board noise — VTX harmonics, camera or digital-bus emissions — measurably degrade fix quality before anything else on the aircraft notices. Watching satellite counts and C/N0 is a free EMI monitor." },
        ],
      },
    ],
    sources: [pozarMicrowave, fccPart15, px4Docs],
    related: ["rf-and-antenna-fundamentals", "rf-testing-and-measurement", "drone-platform-electronics", "emi-filtering-and-mitigation", "single-ended-vs-differential-signaling"],
  },
  {
    slug: "vibration-environmental-and-flight-testing",
    libraryId: "technical",
    collectionId: "drones-and-flight-systems",
    title: "Vibration, environmental & flight testing",
    summary: "Vibration as the multirotor's signature stress — sources, resonance and isolation theory, measuring spectra with the aircraft's own IMU — plus shaker/thermal/environmental test methods, the incremental flight-test discipline, and reading failure signatures from logs.",
    readingTime: 20,
    updatedAt: "Aug 8",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Vibration is the multirotor's defining environment",
        body: [
          "A multirotor is a set of motors spinning imbalanced rotors bolted to a light, stiff frame — a vibration generator with avionics attached. The sources are periodic and identifiable: each motor forces the frame at its rotation frequency (1P — from any prop or bell imbalance) and at blade-pass frequency (blades × rotation rate — from aerodynamic loading), plus harmonics; with motors at, say, 6000–20000 RPM, the fundamentals sweep 100–330 Hz as throttle moves. The victims stack up: the gyro and accelerometer ride the shaking (vibration inside the loop), solder joints and connectors fatigue, fasteners loosen, cameras record 'jello,' and anything with a resonance inside the excitation band amplifies rather than attenuates.",
          "The IMU consequences deserve first place because they corrupt control itself. Vibration energy near or above the gyro's sampling rate aliases into the control band as false rotation; large amplitudes can clip the sensor (hard saturation — the estimator integrates garbage and altitude/position estimates diverge); and accelerometer clipping poisons the velocity estimate that position hold depends on. The platform's defenses are layered exactly like a signal-integrity budget: reduce the source (balance props and motors), isolate the path (soft-mount the FC or IMU), and filter what remains (static notch filters, and dynamic notches driven by ESC RPM telemetry that track the motor frequencies as they sweep). Every layer has limits, so all three are used.",
        ],
      },
      {
        type: "formula",
        heading: "Resonance, transmissibility, and why soft mounts work",
        formula: "f_n = (1/2π)·√(k/m)      T(f) ≈ 1/|1 − (f/f_n)²|  (light damping)      isolation begins at f > √2·f_n",
        explanation: "Any mass on a compliant mount is a resonator with natural frequency f_n. Transmissibility — how much of the base's vibration reaches the mass — is near 1 well below f_n, peaks (amplifies!) at resonance limited only by damping, and falls off above √2·f_n, which is the whole theory of isolation in one line: choose the mount so its resonance sits well below the excitation you must reject. An FC on gel mounts with f_n ≈ 40 Hz attenuates 150 Hz motor vibration but amplifies anything near 40 Hz — so a mount that is too soft (or a frame mode that lands near f_n) makes things worse, and damping trades resonance-peak height against high-frequency rolloff. The same relation read in reverse explains shaker testing's resonance search: sweep frequency, watch the response ratio, and every peak is a mode that random vibration will find in service.",
        terms: [
          { symbol: "f_n", meaning: "Mount/structure natural frequency", unit: "Hz" },
          { symbol: "T(f)", meaning: "Transmissibility (out/in amplitude ratio)", unit: "—" },
          { symbol: "√2·f_n", meaning: "Isolation crossover — attenuation starts here", unit: "Hz" },
        ],
      },
      {
        type: "prose",
        heading: "Measuring: the aircraft is its own vibration analyzer",
        body: [
          "The most useful vibration instrument on a drone is the one already aboard: the IMU, logged at kHz rates by the blackbox. An FFT of logged gyro and accelerometer data is a vibration spectrum measured at exactly the point that matters (the sensor), flown in the real environment, free — and modern flight stacks display these spectra directly. Reading them is pattern recognition: sharp peaks that move with throttle are motor 1P or blade-pass (trace the frequency to RPM to find the culprit motor); fixed-frequency peaks are structural resonances or non-motor sources; broadband floors rising with throttle indicate general mechanical looseness or prop damage; clipping counters and estimator-innovation metrics quantify whether the vibration is actually hurting. The workflow — baseline spectrum on a healthy build, re-measure after any change, investigate deltas — is regression testing with a Fourier transform.",
          "Bench methods complete the toolkit. Prop and motor balancing attacks the source (a prop balancer and tape/removal for props; adding balancing mass for bells), verified by before/after spectra. Shaker-table testing does what flight cannot: controlled sine sweeps find structural resonances and their Q one axis at a time; random vibration to a specified power-spectral-density profile (g²/Hz over a band, quantified as gRMS) compresses a service lifetime of fatigue into hours; shock pulses qualify against handling and hard landings. MIL-STD-810's vibration and shock methods are the common reference vocabulary even for commercial hardware — not because certification is required, but because its profiles and procedures give test plans defensible numbers to point at.",
        ],
      },
      {
        type: "prose",
        heading: "Environmental testing beyond vibration",
        body: [
          "Temperature is the second environment. Cold raises battery internal resistance dramatically (the sag arithmetic of the LiPo note worsens — a pack that flies fine at 20 °C can brown out at −10 °C), stiffens plastics and damps isolators differently, and shifts sensor biases (gyro bias over temperature is why FCs calibrate at boot and some thermally stabilize). Heat derates the other end: ESCs, VTX, and regulators throttle or fail hot, and a sealed or densely packed airframe accumulates heat exactly as the sealed-enclosure thermal note describes — no airflow inside means conduction paths decide. Thermal testing spans a soak (does it work at the corners?), cycling (does expansion/contraction fatigue joints and connectors — the tolerance-stack and solder-fatigue mechanisms?), and operational transitions (cold-start to full power, hot-day hover endurance) with temperatures logged alongside the electrical telemetry.",
          "The reliability end of the spectrum borrows from HALT/HASS thinking: step stresses (vibration, temperature, voltage) beyond spec until failure to find the weakest link and its margin — not to pass, but to learn what breaks first and whether that ordering is acceptable. Combined environments matter because real failures are conjunctions: vibration plus heat ages solder faster than either alone; cold plus high current is the brownout corner. And ingress (rain, dust) ties back to the enclosures note — with the drone-specific twist that motors and airflow paths cannot simply be sealed, so protection is zoned: sealed avionics core, splash-tolerant periphery.",
        ],
      },
      {
        type: "prose",
        heading: "Flight testing: envelope expansion and the log as the instrument",
        body: [
          "Flight testing is the discipline that turns bench-proven hardware into a trusted aircraft, and its core principles are exactly the structured-debugging values under motion: one change per flight, incremental envelope expansion, and instrumentation before opinion. The canonical ladder: full bench and systems checks (including props-off signal checks and RF/failsafe verification), tethered or hand-restrained spin-up, first hover in a safe area (short, focused on stability and vibration spectra), then progressively — gentle maneuvers, higher speed, longer duration, aggressive inputs, range/endurance points — with a defined objective, a go/no-go checklist, and abort criteria for every flight. Failsafe behavior (link loss → return/land/cut) is verified deliberately and early, at low altitude and close range, because it is the one feature whose first real test must not be a surprise.",
          "The telemetry and blackbox logs are the flight-test instrument: currents, voltages (sag under load), RSSI/link quality versus range and attitude, temperatures, vibration spectra, GPS quality, and the controller's own inputs versus outputs. Post-flight review is where the engineering happens — every anomaly gets a signature-based diagnosis (the table below), every incident gets the root-cause treatment from the RCA note (with the log as the evidence chain), and every fix gets a verification flight against the baseline data. Safety practice frames all of it: spinning props are the lab's most dangerous rotating machinery (props off for every bench test that doesn't need them; physical separation and spotters when they're on), LiPo handling per the battery note, and RF power discipline around people and other operations.",
        ],
      },
      {
        type: "table",
        heading: "Failure signatures in flight data",
        columns: ["Signature", "Likely cause", "Next move"],
        rows: [
          ["Video 'jello', throttle-tracking FFT peaks", "Prop/motor imbalance (1P, blade-pass)", "Balance props/motors; verify by before/after spectra"],
          ["Altitude estimate diverges under power", "Accel/gyro clipping or aliasing from vibration", "Check clipping counts; isolate mount; notch filters"],
          ["'Toilet bowl' in position hold", "Magnetometer interference (power-wiring fields)", "Move/mast the compass; recalibrate; check current paths"],
          ["Brownout/reset on throttle punch", "Battery sag + regulator dropout margin", "Measure sag (I·R_int); pack health; holdup capacitance"],
          ["Link degrades in specific attitudes", "Antenna null/shadowing toward ground station", "RSSI-vs-attitude from logs; re-place antennas; diversity"],
          ["GPS satellites drop when VTX transmits", "Desense from on-board emitter harmonics", "Separation/shielding; RF-testing note's desense workflow"],
          ["Fails hot day / cold morning only", "Thermal derating or cold-battery sag", "Temperature-corner soak with telemetry; thermal design"],
          ["Intermittent motor dropout under load", "Connector/solder fatigue, ESC desync", "Inspect joints; ESC logs/RPM telemetry; vibration history"],
        ],
      },
      {
        type: "callout",
        heading: "One change per flight, and the log decides",
        body: "Flight time is expensive and crashes are data-destroying, so the discipline is strict: every flight has an objective, a checklist, abort criteria, and exactly one variable changed since the last; every conclusion comes from logged data against the previous baseline, not from how it felt. Verify failsafes deliberately at low risk before they get tested by accident — and keep props off for every bench operation that doesn't need them spinning.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Test-program review",
        items: [
          "Identify vibration sources (1P, blade-pass, harmonics) and their frequency ranges across the throttle band.",
          "Layer the defenses: balance the source, isolate below excitation (f_n well under f/√2), filter the remainder with RPM-tracking notches.",
          "Baseline IMU FFT spectra on every build; re-measure after any mechanical change; watch clipping counts.",
          "Use shaker sine sweeps for resonance search and random-vibe PSD (gRMS) for fatigue life; reference MIL-STD-810 profiles.",
          "Test thermal corners and transitions with full telemetry — cold-battery sag and hot derating are the classic edges.",
          "Expand the flight envelope incrementally with objectives, checklists, and abort criteria; one change per flight.",
          "Verify failsafe behavior deliberately, early, at low altitude and close range.",
          "Diagnose from log signatures; run incidents through root-cause analysis with the log as evidence; verify fixes against baselines.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Where does multirotor vibration come from, and what are the three layered defenses?", answer: "Each motor forces the frame at its rotation frequency (1P, imbalance) and blade-pass frequency plus harmonics, sweeping with throttle. Defenses: reduce the source (balance props/motors), isolate the path (soft mounts with f_n well below excitation), filter the remainder (static + RPM-tracking notch filters on the gyro signal)." },
          { question: "Explain transmissibility and the soft-mount design rule.", answer: "A mass on a compliant mount resonates at f_n; transmissibility ≈1 below f_n, amplifies at resonance, and attenuates above √2·f_n. So choose the mount's f_n well below the vibration to reject — a mount too soft (or excitation near f_n) amplifies instead, and damping trades peak height against rolloff." },
          { question: "How do you measure a drone's vibration without a shaker?", answer: "The onboard IMU logged at kHz rates is a vibration sensor at exactly the point that matters: FFT the blackbox gyro/accel data for spectra, trace throttle-tracking peaks to motor RPM, watch clipping counters, and regression-test spectra before/after every mechanical change." },
          { question: "What does disciplined flight testing look like?", answer: "Incremental envelope expansion — bench → props-off checks → tethered → hover → progressively aggressive — each flight with an objective, checklist, abort criteria, and one changed variable; failsafes verified deliberately at low risk; every conclusion drawn from telemetry/blackbox data compared against baselines; incidents run through root-cause analysis with the log as the evidence chain." },
        ],
      },
    ],
    sources: [ardupilotDocs, milStd810, px4Docs],
    related: ["drone-platform-electronics", "lipo-batteries-and-drone-power", "structured-hardware-debugging", "root-cause-analysis", "thermal-co-design-ee-me", "board-bring-up-methodology"],
  },
];
