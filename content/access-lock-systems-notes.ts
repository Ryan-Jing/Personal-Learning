import type { Note, Source } from "./library";

const siaOsdp: Source = {
  title: "Open Supervised Device Protocol (OSDP)",
  publisher: "Security Industry Association",
  url: "https://www.securityindustry.org/industry-standards/open-supervised-device-protocol/",
  kind: "Reference",
};

const siaStandardsGuide: Source = {
  title: "At-a-Glance Guide to SIA Standards",
  publisher: "Security Industry Association",
  url: "https://www.securityindustry.org/industry-standards/at-a-glance-guide-to-sia-standards/",
  kind: "Reference",
};

const ulAccessControl: Source = {
  title: "Access Control System Testing and Certification",
  publisher: "UL Solutions",
  url: "https://www.ul.com/services/access-control-system-testing-and-certification",
  kind: "Reference",
};

const ulEgressLocks: Source = {
  title: "Proper Application of UL Standards for Controlled or Delayed Egress Locking Devices — UL 294 & UL 1034",
  publisher: "UL Solutions",
  url: "https://www.ul.com/news/proper-application-ul-standards-controlled-or-delayed-egress-locking-devices-ul-294-1034",
  kind: "Reference",
};

const iecOsdp: Source = {
  title: "IEC 60839-11-5:2020 — Electronic access control systems: OSDP",
  publisher: "International Electrotechnical Commission",
  url: "https://webstore.iec.ch/en/publication/33414",
  kind: "Reference",
};

const nfcSpecifications: Source = {
  title: "NFC Forum Specifications",
  publisher: "NFC Forum",
  url: "https://nfc-forum.org/build/specifications",
  kind: "Reference",
};

const nfcTechnology: Source = {
  title: "NFC Technology Overview",
  publisher: "NFC Forum",
  url: "https://nfc-forum.org/learn/nfc-technology/",
  kind: "Reference",
};

const onvifProfiles: Source = {
  title: "ONVIF Profiles",
  publisher: "ONVIF",
  url: "https://www.onvif.org/profiles/",
  kind: "Reference",
};

export const accessLockSystemsNotes: Note[] = [
  {
    slug: "access-control-system-architecture",
    libraryId: "technical",
    collectionId: "access-lock-systems",
    title: "Access control system architecture",
    summary: "How modern access systems are structured: controllers, readers, credentials, locks, door position sensors, request-to-exit devices, alarms, power, networking, audit logs, and fail-safe/fail-secure decisions.",
    readingTime: 22,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Access control is a state machine attached to a door",
        body: [
          "An access system decides who may open a physical barrier, under which conditions, while preserving safety, security, auditability, and availability. The core pieces are a controller or access panel, one or more credential readers, a credential technology, an electric lock or actuator, a door-position sensor, a latch/bolt or lock-status sensor, request-to-exit input, alarm outputs, power with backup, network connectivity, and software that manages users, schedules, events, and updates.",
          "The door itself is part of the system. A valid credential does not equal a successful entry if the latch is jammed, the strike is misaligned, the closer slams, the motor stalls, or the door-position contact says the door never opened. Conversely, an alarm should not fire merely because a contact bounced or a door took one extra second to close. Good access products treat electrical signals as observations of a mechanical process, not as perfect truth.",
        ],
      },
      {
        type: "diagram",
        heading: "Typical door access architecture",
        intro: "This is the baseline to sketch before choosing locks, readers, or firmware tasks.",
        art: `Credential / mobile / card
        ↓
Reader ── OSDP/RS-485 or legacy Wiegand ── Controller / access panel
        ↓                                      ↓
User feedback                         Policy, schedule, audit log
                                               ↓
                         Lock driver / relay / supervised output
                                               ↓
Door hardware: strike, maglock, latch, motor, sensor
                                               ↑
                         Door contact, REX, tamper, bolt/latch status
                                               ↓
                                Alarm, event, recovery, diagnostics`,
        caption: "The controller must reason about command, physical state, user action, and fault state together.",
      },
      {
        type: "table",
        heading: "Core subsystem responsibilities",
        columns: ["Subsystem", "Responsibility", "Failure to design against"],
        rows: [
          ["Credential reader", "Read card/mobile/biometric input and report identity or token state", "Spoofing, replay, unsupervised wiring, poor UX feedback, EMI or ESD at the entry point"],
          ["Controller / panel", "Authorize, command lock, observe door state, log events, communicate upstream", "Wrong state machine, offline behavior gaps, clock drift, insecure updates, lost audit events"],
          ["Lock / actuator", "Physically secure or release the door", "Inrush, overheating, jam, mechanical misalignment, unsafe fail mode"],
          ["Door position sensor", "Report open/closed state", "Bounce, magnet misalignment, tamper, cable cut/short, false held-open alarms"],
          ["Request-to-exit", "Allow egress intent to suppress forced-door alarms and release where applicable", "Nuisance triggers, disabled egress path, sensor masking, code non-compliance"],
          ["Power and backup", "Keep the system in the intended state during outages", "Battery neglect, voltage drop, fire unlock conflicts, lock heat, PoE brownout"],
          ["Network / software", "Management, audit, monitoring, update, integration", "Credential leakage, weak TLS, unreachable cloud, time sync loss, event loss"],
        ],
      },
      {
        type: "prose",
        heading: "Fail-safe, fail-secure, and life safety",
        body: [
          "Fail-safe and fail-secure must be defined per opening, not as slogans. A fail-safe lock releases when power is lost; a fail-secure lock remains locked when power is lost. The correct choice depends on egress requirements, fire alarm integration, threat model, door function, local code, and whether people may need to exit through that opening during power loss. Many systems combine fail-secure exterior access with mechanically free egress from the protected side. The electrical design must respect that mechanical and code reality.",
          "A rigorous architecture identifies safety-critical paths separately from convenience paths. People must not be trapped because software froze or a network failed. A door must not silently remain unlocked because a relay welded or a lock overheated. A forced-door event should not depend on one noisy contact. The design should define allowed states, forbidden states, degraded states, and the behavior under power loss, communication loss, sensor fault, tamper, fire input, firmware update, and controller reboot.",
        ],
      },
      {
        type: "callout",
        heading: "You cannot prove 100% success; you can design against single-point failure",
        body: "For access and alarm products, the engineering bar is high because false unlocks, false locks, false alarms, and missed alarms all have real consequences. The defensible approach is requirements, hazard analysis, fault detection, redundancy where needed, conservative state machines, validation evidence, and field diagnostics — not a claim of absolute success.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Architecture review checklist",
        items: [
          "Draw the door state machine: locked, unlocked, open, closed, held open, forced open, tamper, fire unlock, offline, fault, update, and recovery.",
          "Define fail-safe/fail-secure behavior per opening and verify it with applicable code, safety, and security stakeholders.",
          "Separate life-safety egress paths from network/cloud/software convenience paths.",
          "Specify offline behavior: cached credentials, schedules, time drift, audit queueing, lock state, and recovery sync.",
          "Use supervised wiring or diagnostics for critical sensors and readers where the threat/risk requires it.",
          "Define power-loss behavior, backup duration, battery maintenance, and lock thermal limits.",
          "Make every security-relevant event auditable with time, identity, door, command, observed state, and fault context.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is an access system a state machine?", answer: "Because authorization, lock command, door motion, sensor feedback, egress intent, tamper, alarm, and fault recovery must be interpreted over time." },
          { question: "What is the difference between fail-safe and fail-secure?", answer: "Fail-safe releases when power is lost; fail-secure remains locked. The correct choice depends on egress, fire/life safety, threat model, and door function." },
          { question: "Why are door sensors not perfect truth?", answer: "Contacts bounce, magnets misalign, wires short/cut, doors sag, and mechanical motion has timing variation. Firmware must qualify and correlate signals." },
        ],
      },
    ],
    sources: [ulAccessControl, ulEgressLocks, siaOsdp, onvifProfiles],
    related: ["electric-locks-and-door-hardware", "alarms-sensors-and-false-alarm-control", "access-system-validation-and-production"],
  },
  {
    slug: "electric-locks-and-door-hardware",
    libraryId: "technical",
    collectionId: "access-lock-systems",
    title: "Electric locks & door hardware",
    summary: "Electric strikes, magnetic locks, solenoids, motorized latches/deadbolts, relays, MOSFET drivers, flyback, inrush, hold current, thermal behavior, mechanical tolerance, and egress considerations.",
    readingTime: 23,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The lock is an electrical load with mechanical consequences",
        body: [
          "Electric locking hardware converts electrical energy into a physical security state. The product designer must understand both sides. An electric strike releases a latch by energizing a mechanism in the frame. A magnetic lock holds a door by electromagnetic force while powered. A solenoid bolt drives a plunger. A motorized deadbolt or latch uses a motor and gearbox to move hardware through a controlled travel. Each load has different current profile, thermal behavior, acoustic signature, egress implication, and failure mode.",
          "The electrical design cannot stop at nominal voltage and current. Locks have inrush, hold current, duty-cycle limits, inductive kick, cable voltage drop, temperature rise, stall behavior, and end-of-life wear. Mechanical loads change with door alignment, weatherstripping, frame tolerance, contamination, ice, user force, hinge sag, and installation error. A lock driver that works on a bench supply beside a loose mechanism may fail after the door is mounted and loaded.",
        ],
      },
      {
        type: "table",
        heading: "Lock hardware comparison",
        columns: ["Hardware", "Typical behavior", "Design concerns"],
        rows: [
          ["Electric strike", "Releases latch at the frame when energized or de-energized depending on model", "Latch preload, AC/DC coil rating, buzzing, duty cycle, fail-safe/fail-secure model, frame alignment"],
          ["Magnetic lock", "Uses continuous current to hold an armature plate", "Heat, power loss behavior, egress/legal constraints, door contact correlation, bond sensor, backup power"],
          ["Solenoid bolt", "Moves a plunger with high actuation current", "Inrush, flyback, duty cycle, position sensing, jam detection, acoustic impact"],
          ["Motorized deadbolt/latch", "Uses motor/geartrain to drive position", "Stall current, limit sensing, current profile, anti-pinch/jam logic, wear, battery life"],
          ["Relay output", "Isolated switching interface for external locks", "Contact rating, welded contacts, arc suppression, supervision, fail state"],
          ["MOSFET/H-bridge output", "Electronic switching or bidirectional motor control", "SOA, flyback path, current sensing, thermal design, reverse polarity, diagnostics"],
        ],
      },
      {
        type: "prose",
        heading: "Driving inductive and motor loads",
        body: [
          "Most lock loads are inductive or electromechanical. When current is interrupted, stored magnetic energy must go somewhere. A diode, TVS, snubber, active clamp, or recirculation path is not optional; it determines voltage stress, release time, EMI, and contact life. A simple flyback diode is safe for the switch but can slow release. A TVS or Zener clamp allows higher voltage and faster current decay but increases switch stress. The right answer depends on timing, safety, emissions, and component ratings.",
          "Current sensing is valuable. A motorized lock's current profile can reveal start, motion, end stop, stall, ice, obstruction, or wear. A solenoid current waveform can reveal coil continuity and plunger movement. A maglock current and bond sensor can distinguish powered from actually holding. A strike driver can detect open load or short. For high-integrity systems, the controller should not only command a lock; it should verify the physical result through independent sensing.",
        ],
      },
      {
        type: "prose",
        heading: "Mechanical tolerance dominates reliability",
        body: [
          "Door hardware lives in the real world. Doors sag. Frames move. Weatherstripping adds preload. Users push or pull while the lock is trying to actuate. Outdoor mechanisms see water, dust, salt, freezing, and thermal expansion. A motorized deadbolt with no margin may pass thousands of cycles on a fixture and fail on a slightly misaligned installation. EE and ME teams should define force/travel/current envelopes together: expected load, worst-case load, stall threshold, end-stop detection, retry strategy, and service fault.",
          "Installation is part of the design. Connector access, wire routing through hinges or frames, strain relief, tamper resistance, field-adjustable strike position, sensor alignment marks, and diagnostic LEDs can decide whether a good product performs well in the field. The product should help installers produce correct mechanical alignment and should detect common incorrect installations.",
        ],
      },
      {
        type: "callout",
        heading: "Never infer secure from commanded",
        body: "A relay output that was energized, a motor command that completed, or a maglock voltage that is present does not prove the door is secure. Use door contact, latch/bolt position, bond sensors, current signatures, or other independent feedback where the risk justifies it.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Lock hardware design checklist",
        items: [
          "Choose fail-safe/fail-secure hardware based on the door's life-safety and security role.",
          "Budget inrush, hold current, cable voltage drop, backup power, duty cycle, and worst-case temperature rise.",
          "Design flyback/clamping for stress, release speed, EMI, and relay/contact life.",
          "Measure current waveforms for normal actuation, loaded actuation, stall, open load, short, and end-of-life mechanisms.",
          "Define mechanical force/travel/tolerance requirements jointly with ME and verify them on real doors.",
          "Add independent feedback for secure/released state when a wrong state would be consequential.",
          "Validate installation variation: preload, sag, strike alignment, cable routing, and enclosure/door material effects.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why can a flyback diode be too simple for a lock output?", answer: "It protects the switch but may slow release; clamp choice affects release time, EMI, and device stress." },
          { question: "Why is current sensing useful for motorized locks?", answer: "The current profile reveals movement, end stops, stalls, obstruction, wear, and sometimes successful mechanical engagement." },
          { question: "What is the biggest reliability trap for lock products?", answer: "Ignoring mechanical tolerance and installation variation while validating only an ideal bench mechanism." },
        ],
      },
    ],
    sources: [ulAccessControl, ulEgressLocks],
    related: ["mosfet-fundamentals", "active-switch-vs-diode", "ee-me-co-design-for-lock-products"],
  },
  {
    slug: "credential-readers-and-access-protocols",
    libraryId: "technical",
    collectionId: "access-lock-systems",
    title: "Credential readers & access protocols",
    summary: "Reader hardware and protocols: Wiegand legacy wiring, OSDP/RS-485 supervision and secure channel, NFC/contactless cards, mobile credentials, BLE, biometrics, tamper, UX feedback, and cybersecurity boundaries.",
    readingTime: 22,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A reader is an exposed security computer",
        body: [
          "The reader sits where attackers, weather, ESD, vibration, and users meet the system. It may contain an NFC or RFID front end, BLE radio, keypad, biometric sensor, secure element, tamper switch, LEDs, buzzer, processor, and a panel interface. It must read credentials reliably while giving clear feedback and resisting tampering. From an electrical perspective, this means front-end antenna design, ESD, cable protection, power input tolerance, EMI immunity, secure key storage, and a robust panel communication link.",
          "Credential technology only identifies a token or person under assumptions. A low-security card number is not equivalent to a cryptographically authenticated credential. A mobile credential has phone OS, BLE/NFC, app, cloud, and revocation dependencies. A biometric match has false accept/false reject trade-offs, privacy implications, liveness concerns, and environmental sensitivity. The system architecture should state what threat each credential type is meant to resist.",
        ],
      },
      {
        type: "table",
        heading: "Reader-to-panel protocols",
        columns: ["Protocol", "Practical meaning", "Engineering concerns"],
        rows: [
          ["Wiegand", "Legacy unidirectional pulse interface, historically common for card readers", "Limited supervision, many wires, weak security model, no native encryption, migration risk"],
          ["OSDP", "Bidirectional supervised protocol, commonly over RS-485, with Secure Channel support", "Addressing, termination, wiring topology, key management, secure-channel commissioning, interoperability testing"],
          ["Vendor IP / Ethernet", "Reader or edge device communicates over network", "TLS, certificate lifecycle, PoE, firewalling, offline behavior, firmware updates"],
          ["NFC/contactless card layer", "Short-range 13.56 MHz credential interaction at reader face", "Antenna tuning, metal detuning, secure element, card technology compatibility, tap UX"],
          ["BLE/mobile credential", "Phone/watch credential over radio proximity", "Range control, relay risk, battery, app permissions, phone diversity, revocation, user feedback"],
        ],
      },
      {
        type: "prose",
        heading: "OSDP versus legacy reader wiring",
        body: [
          "SIA's Open Supervised Device Protocol is intended for communication between access control panels and peripheral devices such as readers. The important architectural differences from legacy Wiegand are bidirectional communication, supervision, multi-drop capability, fewer conductors, and Secure Channel support. Bidirectional communication lets the panel control reader LEDs/buzzer/display and detect device state. Supervision makes cable cut, short, or offline behavior visible. Secure Channel protects against simple sniff/replay/injection attacks when correctly configured.",
          "OSDP still has engineering detail. RS-485 needs topology discipline, termination/biasing, cable selection, surge/ESD protection, common-mode tolerance, and address management. Secure Channel needs key provisioning and rotation strategy; default keys or permanently install-mode devices defeat the purpose. Interoperability should be tested with the actual reader/panel combinations, because optional commands, timing, addressing, and commissioning flows vary.",
        ],
      },
      {
        type: "prose",
        heading: "NFC, contactless cards, and mobile credentials",
        body: [
          "NFC operates at 13.56 MHz with very short intended range; the NFC Forum describes typical range on the order of centimeters and includes door locks among relevant product areas. Electrically, the antenna is the product surface. Metal behind the reader, enclosure plastics, gaskets, screws, nearby ground pours, and hand placement can detune the antenna. Reader validation must cover real mounting materials and user approach angles, not only a loose PCB on a bench.",
          "Credential security depends on the credential family and system design. Some legacy proximity-card systems expose simple identifiers that can be cloned. Higher-security smart-card and mobile systems use mutual authentication, diversified keys, secure elements, or cloud-issued credentials. The reader should not be trusted merely because it sends a number. The controller and backend need credential lifecycle controls: issuance, revocation, expiration, audit, lost device handling, and emergency override.",
        ],
      },
      {
        type: "callout",
        heading: "Security protocol claims require commissioning discipline",
        body: "A product can support encryption and still ship insecurely if default keys remain, key exchange is unauthenticated, commissioning logs are absent, firmware update is weak, or the reader falls back silently to an insecure mode. Validate the deployed state, not only the data sheet feature list.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Reader and protocol checklist",
        items: [
          "Identify the threat model: casual misuse, credential cloning, wire tamper, reader replacement, replay, relay attack, insider misuse, or network compromise.",
          "Prefer supervised, bidirectional, encrypted reader links for new systems where risk warrants it.",
          "For OSDP, verify RS-485 topology, termination, addressing, Secure Channel key handling, commissioning, and fallback behavior.",
          "For NFC/contactless, test antenna performance in the final enclosure and mounting environment.",
          "Design reader UX feedback for accepted, denied, waiting, offline, tamper, and maintenance states.",
          "Protect reader power and signal lines against ESD, surge, cable faults, and ground potential differences.",
          "Define credential issuance, revocation, expiration, audit, backup access, and lost-device process.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is bidirectional reader communication valuable?", answer: "It enables supervision, richer device state, controlled feedback, and more robust security than a one-way card-number pulse stream." },
          { question: "What can break NFC range in a real product?", answer: "Metal, ground geometry, enclosure material, mounting hardware, antenna detuning, user approach, and nearby electronics." },
          { question: "Why is key commissioning a product requirement?", answer: "Encryption only helps if keys are unique, protected, provisioned correctly, rotated/recoverable where needed, and insecure fallback is controlled." },
        ],
      },
    ],
    sources: [siaOsdp, siaStandardsGuide, iecOsdp, nfcSpecifications, nfcTechnology],
    related: ["rs485-differential-serial", "access-control-system-architecture", "access-system-validation-and-production"],
  },
  {
    slug: "alarms-sensors-and-false-alarm-control",
    libraryId: "technical",
    collectionId: "access-lock-systems",
    title: "Alarms, sensors & false-alarm control",
    summary: "Door contacts, latch sensors, request-to-exit devices, tamper, supervised circuits, debounce, event qualification, alarm state machines, and design methods for minimizing false and missed alarms.",
    readingTime: 24,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Alarm reliability is about evidence, not one signal",
        body: [
          "A door alarm is a decision that the observed physical behavior is outside allowed behavior. “Door forced open” usually means the door-position sensor changed to open without a valid unlock command, request-to-exit, schedule, fire input, or maintenance state. “Door held open” means a door stayed open longer than the allowed time. “Tamper” means the enclosure, wiring, reader, or sensor state indicates interference. These are temporal classifications, not raw GPIO interrupts.",
          "False alarms usually come from treating one noisy observation as a fact. A contact can bounce, a magnet can be marginally aligned, a door can vibrate in wind, a REX PIR can see hallway motion, an installer can wire the wrong resistor value, a cable can pick up EMI, or firmware can evaluate events in the wrong order. Missed alarms come from the opposite: suppressing too much, ignoring sensor faults, trusting commands without feedback, or failing open during degraded states. The design goal is a state machine that is skeptical in both directions.",
        ],
      },
      {
        type: "table",
        heading: "Common sensor inputs",
        columns: ["Input", "What it observes", "False/missed alarm risks"],
        rows: [
          ["Door position contact", "Door open/closed via reed, Hall, or mechanical switch", "Bounce, magnet spacing, door sag, tamper magnet, cable cut/short"],
          ["Latch / bolt sensor", "Whether locking element is physically engaged", "Misalignment, partial engagement, switch wear, timing mismatch"],
          ["Request-to-exit button", "Intentional egress request", "Stuck button, wiring fault, nuisance press, no debounce"],
          ["REX motion sensor", "Motion near egress side", "Hallway traffic, HVAC movement, masking, sensitivity drift"],
          ["Reader tamper", "Reader enclosure removal or attack", "Loose cover, water ingress, ignored tamper line, shared cable fault"],
          ["Power/battery monitor", "Supply health and backup capacity", "Unreported low battery, voltage drop during lock actuation, charger failure"],
          ["Supervised loop", "Normal/alarm/open/short states using resistor networks", "Wrong resistor, poor tolerance, ADC thresholds, wire leakage, ESD damage"],
        ],
      },
      {
        type: "prose",
        heading: "Supervised circuits and signal qualification",
        body: [
          "A basic dry contact tells you open or closed, but not whether the cable is cut or shorted. Supervised loops add end-of-line resistor networks so the controller can distinguish normal, alarm, open-circuit, and short-circuit ranges. This moves the input from a binary GPIO to an analog or thresholded measurement. Design details matter: resistor tolerance, cable resistance, leakage, ADC reference, surge protection, wet wiring, and threshold hysteresis all determine whether supervision is reliable.",
          "Debounce is necessary but not sufficient. A door contact should be filtered for switch bounce, but the system should also understand timing relationships: unlock command issued, strike released, door opened within allowed entry window, door closed within held-open window, latch resecured, event logged. Alarm qualification should use monotonic timers, explicit states, and edge ordering. Avoid scattered if-statements that each interpret the same input differently.",
        ],
      },
      {
        type: "prose",
        heading: "Designing against false alarms",
        body: [
          "False alarm control starts in requirements. Define what counts as forced open, held open, access denied, tamper, lock failed to secure, lock failed to release, reader offline, door propped, and power fault. Then define grace periods, suppression windows, maintenance modes, and escalation rules. Different doors may need different thresholds because a lobby door, high-security lab, exterior gate, and interior closet do not have the same usage pattern.",
          "Use correlation. A forced-door alarm is stronger evidence when door position changes without valid credential, without REX, without lock-release command, and while latch/bond state disagrees. A held-open event may first be a local warning beep, then an alarm after a longer threshold. A tamper event should not vanish because the controller is offline; it should be queued and time-stamped. A sensor fault should create a service event rather than silently treating the input as normal.",
        ],
      },
      {
        type: "callout",
        heading: "False alarms and missed alarms are both design failures",
        body: "Reducing false alarms by suppressing events too aggressively can create missed alarms. Raising sensitivity to catch every edge can create nuisance alarms that users learn to ignore. The correct design uses better sensing, state correlation, thresholds, diagnostics, and evidence-backed limits.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Alarm design checklist",
        items: [
          "Write an explicit state machine for forced open, held open, tamper, lock fail, reader fail, power fail, maintenance, and recovery.",
          "Use supervised circuits where cable cut/short detection matters.",
          "Choose thresholds using resistor tolerance, cable length, leakage, ADC tolerance, surge protection leakage, and temperature.",
          "Debounce and qualify all mechanical inputs with monotonic timers and explicit event ordering.",
          "Correlate door position, lock status, credential/REX, command state, and timing before raising consequential alarms.",
          "Log both raw transitions and qualified events during validation so nuisance alarms can be traced.",
          "Test wind, slam, vibration, door sag, marginal magnet alignment, EMI, ESD, water, and power dips.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is a forced-door alarm not just a GPIO edge?", answer: "It depends on context: command state, valid credential, REX, door timing, latch/lock state, maintenance/fire/offline modes, and sensor health." },
          { question: "What does a supervised loop add?", answer: "It can distinguish normal/alarm from wiring faults such as open or short circuits, depending on resistor network and measurement thresholds." },
          { question: "How do you reduce false alarms without missing real alarms?", answer: "Improve sensing and correlation, define explicit state machines, use thresholds backed by data, log evidence, and validate against real nuisance conditions." },
        ],
      },
    ],
    sources: [siaStandardsGuide, ulAccessControl],
    related: ["access-control-system-architecture", "electric-locks-and-door-hardware", "observability-for-devices"],
  },
  {
    slug: "ee-me-co-design-for-lock-products",
    libraryId: "technical",
    collectionId: "access-lock-systems",
    title: "EE/ME co-design for lock products",
    summary: "How electrical and mechanical teams jointly design access hardware: force, tolerance, enclosure, ingress protection, thermal paths, cable routing, tamper resistance, serviceability, and installation quality.",
    readingTime: 21,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The electrical design succeeds only if the mechanism succeeds",
        body: [
          "Lock and access products are cross-functional by nature. The electronics command, sense, log, and communicate; the mechanical system actually secures a door, survives abuse, and guides users. EE and ME cannot design sequentially. Motor current limits depend on bolt friction and door preload. Sensor placement depends on latch geometry. Thermal design depends on coil duty cycle and enclosure material. Cable routing affects hinge life, tamper resistance, and ESD. The enclosure changes RF/NFC performance and water paths.",
          "A useful design review uses shared variables: force, travel, tolerance stack, current, voltage drop, temperature rise, ingress path, user force, installation error, service access, and tamper path. Each variable should have an owner and a test method. If a requirement cannot be measured at the interface between EE and ME, it is probably not ready for design release.",
        ],
      },
      {
        type: "table",
        heading: "EE/ME interface variables",
        columns: ["Variable", "EE concern", "ME concern"],
        rows: [
          ["Actuation force / torque", "Motor/solenoid sizing, current limit, driver SOA, battery life", "Friction, preload, spring force, alignment, wear"],
          ["Travel / position", "Limit sensing, encoder/Hall/reed placement, stall detection", "Bolt throw, latch geometry, tolerances, end stops"],
          ["Thermal path", "Coil heat, regulator heat, battery charging, derating", "Enclosure material, airflow, contact area, user-touch temperature"],
          ["Ingress path", "Corrosion, leakage, sensor faults, connector damage", "Seals, drains, gaskets, pressure equalization, assembly process"],
          ["Cable path", "Voltage drop, EMC, ESD, flex life, connector retention", "Hinge routing, strain relief, service access, anti-tamper routing"],
          ["NFC/RF region", "Antenna tuning, ground clearance, user feedback", "Plastic/metal stack, mounting screws, cosmetics, tap target"],
          ["Tamper resistance", "Switches, accelerometer, enclosure-open detection, secure erase", "Fasteners, pry points, hidden cables, wall/door interface"],
        ],
      },
      {
        type: "prose",
        heading: "Tolerance and installation are product requirements",
        body: [
          "Real doors are not precision fixtures. Door gaps vary, strikes are installed crooked, frames swell, hinges sag, and users pull while a motor is moving. The product should define the allowed installation envelope: gap, offset, angular misalignment, latch preload, cable length, supply voltage at the device, temperature, and door material. Validation should include edges of that envelope, not only nominal CAD geometry.",
          "The product should guide installation. Mechanical features can self-center hardware; slots can permit adjustment; LEDs or app diagnostics can indicate alignment; sensor readings can be displayed during commissioning; firmware can detect repeated retries or marginal current profiles. A design that requires expert installation to avoid nuisance alarms will fail at scale.",
        ],
      },
      {
        type: "prose",
        heading: "Environment, tamper, and serviceability",
        body: [
          "Access hardware may see rain, dust, salt, cleaning chemicals, UV, freezing, condensation, insects, vandalism, and repeated impacts. Ingress protection is not just a gasket; it is enclosure geometry, drainage, cable entry, pressure equalization, coating/material selection, connector choice, corrosion couples, and assembly quality. Water that does not immediately short electronics can still change sensor thresholds, corrode contacts, detune antennas, swell materials, or freeze mechanisms.",
          "Tamper and serviceability pull against each other. A product should resist unauthorized opening, cable access, reader replacement, magnet spoofing, and relay attack, but authorized installers need safe service access. Decide what happens when tamper is detected: local alarm, remote event, credential disable, secure-key erase, lock state change, or maintenance workflow. Avoid tamper responses that create life-safety hazards or lock out authorized recovery.",
        ],
      },
      {
        type: "callout",
        heading: "A beautiful enclosure can break the electronics",
        body: "Metal near an NFC antenna, a long unshielded lock cable, a narrow thermal path, hidden water collection, or a constrained FPC bend can turn a correct PCB into an unreliable product. Review enclosure decisions with electrical measurements, not only mechanical fit.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "EE/ME co-design checklist",
        items: [
          "Define force, travel, tolerance, preload, current, voltage, and temperature limits together.",
          "Test lock actuation at misalignment, low supply, hot/cold, worn hardware, user preload, and dirty/icy conditions where applicable.",
          "Measure NFC/RF performance in final enclosure material and mounting geometry.",
          "Review cable routing for voltage drop, strain relief, flex life, ESD, tamper access, and service replacement.",
          "Design ingress paths deliberately: seals, drains, coating, connector choice, corrosion control, and assembly inspection.",
          "Make installation quality observable through alignment feedback, diagnostics, commissioning tests, or current/sensor margins.",
          "Define tamper behavior that is secure, logged, recoverable, and compatible with egress/life-safety constraints.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is installation variation part of product design?", answer: "Because door alignment, cable length, material, preload, and installer behavior directly affect electrical load, sensing, alarms, and reliability." },
          { question: "How can mechanical design affect NFC?", answer: "Metal, ground geometry, plastic thickness, screws, and mounting location detune the antenna and change the user tap zone." },
          { question: "What makes tamper design difficult?", answer: "It must detect real attacks without creating unsafe states, nuisance alarms, unrecoverable lockouts, or impossible service workflows." },
        ],
      },
    ],
    sources: [ulAccessControl, nfcTechnology],
    related: ["pcb-mechanical-constraints", "tolerance-stackup-and-fit", "enclosures-and-ingress-protection", "electric-locks-and-door-hardware"],
  },
  {
    slug: "access-system-validation-and-production",
    libraryId: "technical",
    collectionId: "access-lock-systems",
    title: "Access system validation & production",
    summary: "Validation strategy for access products: requirements, hazard analysis, FMEA, endurance, EMC/ESD, power failure, cybersecurity, standards-oriented testing, manufacturing test, commissioning, and field diagnostics.",
    readingTime: 25,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Validation must prove security, safety, and reliability together",
        body: [
          "Access products sit at the intersection of physical security, life safety, electrical reliability, software correctness, cybersecurity, mechanical durability, and installation quality. Validation must show that the product admits authorized users, rejects unauthorized users, preserves egress as required, avoids nuisance alarms, detects faults, logs events, recovers after failures, and can be manufactured consistently. Testing only the happy path — card tap unlocks relay — is not access-system validation.",
          "Start with requirements and hazard analysis. What is the consequence of false unlock, false lock, missed forced-door alarm, false alarm, reader spoof, power loss, battery failure, cloud outage, firmware update failure, stuck relay, lock overheating, jammed bolt, sensor cable short, or installer misalignment? The answer determines redundancy, sensing, diagnostics, standards scope, and test depth. UL 294 is a common access-control equipment certification framework in North America, but product teams still need to map local code, egress, fire, cybersecurity, and customer requirements explicitly.",
        ],
      },
      {
        type: "table",
        heading: "Validation areas",
        columns: ["Area", "Tests to include", "Acceptance evidence"],
        rows: [
          ["Functional state machine", "Valid/invalid credential, schedules, REX, held open, forced open, tamper, fire input, offline mode", "Automated state-machine tests, event logs, timing traces"],
          ["Power and backup", "Brownout, outage, battery runtime, charging fault, lock actuation at low voltage, PoE limits", "Voltage/current logs, backup duration records, recovery logs"],
          ["Lock endurance", "Cycle life under load, misalignment, temperature, contamination, user preload", "Cycle counts, current profiles, wear inspection, failure modes"],
          ["Sensor integrity", "Open/short, wrong EOL resistors, bounce, EMI, tamper magnet, cable length", "Threshold margins, raw/qualified event logs, fault detection results"],
          ["EMC/ESD/surge", "Reader touch, cable discharge, lock inductive noise, RF coexistence, emissions", "Lab reports, recovery behavior, no unsafe state transitions"],
          ["Cybersecurity", "Credential storage, OSDP keys, TLS/certs, update signing, rollback, audit integrity", "Threat-model review, penetration results, key lifecycle evidence"],
          ["Production", "Programming, calibration/configuration, reader test, lock output, sensor thresholds, label/identity, final assembly", "Per-unit records, firmware/config versions, station logs"],
          ["Commissioning/field", "Installer setup, alignment, credential enrollment, network setup, update, diagnostics", "Commissioning checklist, logs, service procedures"],
        ],
      },
      {
        type: "prose",
        heading: "Failure injection is mandatory",
        body: [
          "High-integrity access systems need deliberate fault injection. Cut and short reader lines. Remove a reader during a transaction. Brown out the controller during lock actuation. Reboot during firmware update. Jam the bolt. Hold the door half-latched. Stick the REX button. Trigger tamper while offline. Change the clock. Fill event storage. Use a wrong OSDP key. Break network connectivity. Replace a reader with a different address. These tests reveal whether the product has a real recovery strategy or only a nominal sequence.",
          "For every fault, define the expected state, local indication, remote event, retry behavior, user-facing behavior, audit log, and recovery path. A system that fails into a safe state but provides no diagnostic may still be unacceptable because it creates truck rolls and repeated outages. A system that fails into a secure state but blocks required egress may be unsafe. Validation should prove the full behavior, not just the relay output.",
        ],
      },
      {
        type: "prose",
        heading: "Standards, certification, and interoperability",
        body: [
          "Standards do not replace engineering judgment, but they give concrete test expectations and interoperability language. SIA OSDP and IEC 60839-11-5 define an access-control reader/peripheral communication model; OSDP Verified programs and tools can help with interoperability claims. UL access-control testing focuses on construction and performance of access-control equipment; electric locking devices may also fall under other UL categories depending on application. ONVIF profiles can matter when access control integrates with IP video or multi-vendor security systems.",
          "The practical rule: identify certification and interoperability goals at concept stage. They affect architecture, components, enclosure materials, creepage/clearance, power supply, batteries, firmware update, labeling, documentation, manufacturing controls, and supplier selection. Retrofitting certification late is expensive because evidence, traceability, and design constraints were not collected as the product evolved.",
        ],
      },
      {
        type: "prose",
        heading: "Production and field diagnostics",
        body: [
          "Manufacturing test should not be a weaker version of engineering validation. It should be a fast screen for assembly correctness and critical margins: identity, firmware, secure key state, reader interface, lock output current, relay/MOSFET health, sensor thresholds, tamper input, battery or PoE status, LEDs/buzzer, network, and final enclosure condition. If alignment or calibration affects reliability, production must measure it, not rely on visual inspection alone.",
          "Field diagnostics close the loop. Store event history with timestamps, controller state, credential decision, lock command, sensor raw/qualified state, power state, firmware version, reader address, communication errors, and tamper/fault flags. Make support tools able to export useful logs. The best validation plan is incomplete if the shipped product cannot explain what happened at 2:13 AM after a door alarm.",
        ],
      },
      {
        type: "callout",
        heading: "Do not validate only the controller",
        body: "The access product includes readers, cables, locks, doors, installers, power supplies, batteries, network policy, credentials, backend software, and users. A controller-only bench test can pass while the deployed system still false-alarms, traps users, overheats locks, loses audit events, or accepts weak credentials.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Access validation checklist",
        items: [
          "Create a hazard/risk table for false unlock, false lock, missed alarm, false alarm, power loss, fire/egress input, tamper, update failure, and network loss.",
          "Build automated state-machine tests for every door state and transition, including timing windows and degraded states.",
          "Run lock endurance with realistic mechanical load, misalignment, temperature, and supply variation.",
          "Inject electrical faults: open/short reader lines, sensor lines, lock output, battery faults, brownouts, ESD, and communication errors.",
          "Validate credential and reader security: OSDP Secure Channel or equivalent, key provisioning, revocation, fallback, and reader replacement.",
          "Plan certification/interoperability evidence from the start, especially if UL, SIA/OSDP, IEC, ONVIF, or local code requirements apply.",
          "Make production record secure identity, firmware/config version, key state, lock/sensor margins, and final functional results per unit.",
          "Make field logs exportable and useful for root cause: raw input transitions, qualified events, commands, power, faults, and software version.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is failure injection mandatory for access systems?", answer: "Because consequential behavior occurs during faults: power loss, jammed locks, cable faults, offline states, tamper, update failure, and sensor disagreement." },
          { question: "Why identify certification goals early?", answer: "They affect architecture, component choice, enclosure, firmware, manufacturing controls, labeling, and evidence collection." },
          { question: "What should a field log contain for a door alarm?", answer: "Time, door, credential/identity decision, command, lock state, door/latch sensor states, REX/tamper/power state, communication errors, firmware/config versions, and raw transitions if available." },
        ],
      },
    ],
    sources: [ulAccessControl, ulEgressLocks, siaOsdp, iecOsdp, onvifProfiles],
    related: ["validation-lifecycle-and-v-model", "root-cause-analysis", "alarms-sensors-and-false-alarm-control"],
  },
];
