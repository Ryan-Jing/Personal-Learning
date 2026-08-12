import type { Note, Source } from "./library";

const nistKeyManagement: Source = {
  title: "SP 800-57 — Recommendation for Key Management",
  publisher: "NIST",
  url: "https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final",
  kind: "Reference",
};

const iso14443: Source = {
  title: "ISO/IEC 14443 — Contactless integrated circuit cards (proximity cards)",
  publisher: "International Organization for Standardization",
  url: "https://www.iso.org/standard/73599.html",
  kind: "Reference",
};

const mifareClassicAttack: Source = {
  title: "Dismantling MIFARE Classic",
  publisher: "Garcia et al., ESORICS 2008",
  url: "https://www.cs.ru.nl/~flaviog/publications/Dismantling.Mifare.pdf",
  kind: "Reference",
};

const fidoCtap: Source = {
  title: "FIDO2 / CTAP specifications — phishing-resistant authentication",
  publisher: "FIDO Alliance",
  url: "https://fidoalliance.org/specifications/",
  kind: "Reference",
};

const nistBiometric: Source = {
  title: "SP 800-63B — Digital Identity Guidelines: Authentication and Lifecycle Management",
  publisher: "NIST",
  url: "https://pages.nist.gov/800-63-3/sp800-63b.html",
  kind: "Reference",
};

const ieee8023bt: Source = {
  title: "IEEE 802.3bt — Power over Ethernet (Type 3/4)",
  publisher: "IEEE Standards Association",
  url: "https://standards.ieee.org/ieee/802.3bt/6749/",
  kind: "Reference",
};

const nfpa72: Source = {
  title: "NFPA 72 — National Fire Alarm and Signaling Code (secondary power requirements)",
  publisher: "National Fire Protection Association",
  url: "https://www.nfpa.org/codes-and-standards/nfpa-72-standard-development/72",
  kind: "Reference",
};

export const accessSecurityPowerNotes: Note[] = [
  {
    slug: "credential-security-and-attack-resistance",
    libraryId: "technical",
    collectionId: "access-lock-systems",
    title: "Credential security & attack resistance",
    summary: "Why most deployed access credentials are trivially clonable, what cryptographic authentication actually requires, the attack taxonomy from eavesdropping to relay, why UWB ranging defeats relay attacks, key management as the real system boundary, and how biometrics change the failure model.",
    readingTime: 26,
    updatedAt: "Aug 12",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The uncomfortable baseline: most badges are not secure",
        body: [
          "A large fraction of the access credentials in service today provide essentially no security, and understanding why is the necessary starting point for designing anything better. The 125 kHz proximity card — the thick white badge still clipped to millions of belts — works by a beautifully simple mechanism: the reader energizes a coil, the card harvests that field, and the card modulates its load to broadcast a fixed identification number. There is no computation on the card, no secret, and no challenge. The card says the same number to anyone who asks, which means a cloner costing a few tens of dollars can capture that number from a badge in a pocket and write it to a blank card in seconds. Its security model is possession of a number that the system treats as a name and a password simultaneously.",
          "The second generation was not much better in practice. MIFARE Classic, at 13.56 MHz, introduced actual cryptography — but a proprietary cipher, CRYPTO1, with a weak random number generator, which academic work dismantled in 2008; keys can now be recovered in seconds with commodity tools. The lesson is not that these products were badly intentioned but that proprietary cryptography and static identifiers both fail, and they fail permanently: a deployed credential technology lives in a building for fifteen or twenty years, so a design decision made once persists long past the point where its assumptions were broken. The practical consequence for anyone designing access hardware now is that credential technology choice is a long-lived security commitment, and that any system must be designed to survive its own credential layer being compromised.",
        ],
      },
      {
        type: "table",
        heading: "Credential technologies and what they actually prove",
        columns: ["Technology", "Mechanism", "Security", "Practical position"],
        rows: [
          ["125 kHz prox", "Card broadcasts a static ID", "None — trivially cloned", "Legacy; still enormous installed base"],
          ["MIFARE Classic (13.56 MHz)", "Proprietary CRYPTO1 cipher", "Broken — keys recoverable in seconds", "Should be treated as equivalent to no security"],
          ["MIFARE DESFire EV2/EV3, iCLASS SE/Seos", "AES mutual authentication, diversified keys", "Strong when keys are managed properly", "Current best practice for cards"],
          ["NFC / smartphone credential", "Secure element or TEE, AES/PKI, often per-transaction", "Strong; benefits from phone lifecycle", "Growing default; revocation is easy"],
          ["BLE credential", "App + phone crypto, ranging via RSSI", "Strong crypto, but RSSI ranging is spoofable", "Convenient; vulnerable to relay without ranging"],
          ["UWB", "Cryptographically-bound time-of-flight ranging", "Strong, and relay-resistant by physics", "The answer to relay attacks; increasingly deployed"],
          ["PIN / keypad", "Shared secret typed by the user", "Weak alone (shoulder-surfing, sharing)", "Valuable as a second factor"],
          ["Biometric", "Measured physical trait matched to a template", "Non-revocable; needs liveness detection", "Second factor; privacy and template-protection obligations"],
        ],
      },
      {
        type: "prose",
        heading: "What real credential authentication requires",
        body: [
          "A secure credential exchange has to prove that the card possesses a secret without ever transmitting that secret, and it must prove it freshly on each transaction so that a recording of a previous exchange is worthless. The mechanism is challenge-response with mutual authentication: the reader generates a random nonce and sends it; the card encrypts or signs it with a key it holds and returns the result; the reader verifies. Because the challenge differs every time, a replayed response fails. Mutual authentication runs the exchange in both directions so the card also verifies the reader, which prevents a rogue reader from harvesting credential responses — a real attack, since an attacker who can present a reader to a badge in an elevator can otherwise collect authentications at leisure.",
          "The second essential property is key diversification. If every card in an installation carries the same key, then extracting that key from any one card — through a laboratory attack on the chip, or from a compromised reader, or from a manufacturing leak — compromises every door in the estate simultaneously. Diversified keys derive a unique per-card key from a master key and the card's unique identifier through a one-way function, so extracting one card's key yields exactly one card. The master key then becomes the crown jewel, which is why it lives in a hardware security module or secure element and never in application firmware or a configuration file. This is the point at which credential security stops being a protocol question and becomes a key management question — and key management is where most real systems are actually weak.",
        ],
      },
      {
        type: "prose",
        heading: "The attack taxonomy",
        body: [
          "Designing defensively requires knowing the specific attacks, because each has a distinct countermeasure and confusing them produces security theatre. Eavesdropping captures the RF exchange between card and reader; contactless links are readable at greater distances than the operating range suggests, and the countermeasure is encryption of the exchange rather than reliance on short range. Cloning duplicates a credential — trivial against static-ID cards, and the reason any static identifier is a name rather than a secret. Replay records a valid exchange and re-transmits it, defeated by the random challenge. Brute force attacks weak keys or short PINs and is countered by adequate key length and by rate limiting with lockout at the reader.",
          "Relay attacks deserve separate treatment because they defeat cryptography entirely without breaking it. Two attackers cooperate: one stands near the legitimate credential (a badge in a bag, a phone in a house), the other stands at the door, and they relay the radio exchange between them over their own link in real time. The card genuinely authenticates, the reader genuinely verifies, every cryptographic check passes — and the door opens for someone who never had the credential. This is the mechanism behind the well-publicized keyless-entry car thefts, and it works against any credential whose only proximity evidence is that a radio exchange completed. Signal-strength-based ranging (BLE RSSI) does not stop it, because an attacker controls transmit power and can make a relayed signal appear as strong as desired. The genuine countermeasure is time-of-flight ranging with cryptographic binding — measure how long the round trip physically takes, and since relaying necessarily adds delay and radio waves cannot be hurried, an attacker cannot fake proximity. Ultra-wideband implements exactly this with sub-nanosecond timing resolution, giving distance bounding accurate to tens of centimetres, which is why UWB has moved into phones, car keys, and high-security access.",
          "Then come the attacks that bypass the credential layer altogether, and in practice these are more common. Pulling the reader off the wall exposes its wiring, and if that wiring is legacy Wiegand — unencrypted, unauthenticated, unsupervised — an attacker can inject a captured card number directly into the controller, or attach a small implant that harvests every badge presented and replays a chosen one later. This single weakness motivates the whole move to OSDP with secure channel, where the reader-to-controller link is itself encrypted and supervised so tampering is detected and injection is useless. Beyond that: downgrade attacks force a multi-technology reader to fall back to its weakest supported credential, so the credential policy must be able to disable legacy technologies rather than merely prefer modern ones; fault injection and side-channel analysis extract keys from a physically-held reader or card; and the backend network is often the softest target of all, since a controller reachable from an ordinary corporate VLAN with default credentials makes the entire cryptographic front end irrelevant.",
        ],
      },
      {
        type: "diagram",
        heading: "Where a relay attack sits, and what stops it",
        art: "  LEGITIMATE:\n     [badge] <--cm--> [reader] --secure channel--> [controller] --> unlock\n\n  RELAY ATTACK (all crypto passes, door opens anyway):\n     [badge] <--cm--> [attacker A] ====long-range relay====> [attacker B] <--cm--> [reader]\n         (badge in a bag, hundreds of metres away)                          (at the door)\n\n  DEFEATED BY TIME-OF-FLIGHT RANGING (UWB):\n     reader measures round-trip time -> distance = c * t/2\n     relay adds delay -> measured distance exceeds the policy threshold -> denied\n     (RSSI-based ranging does NOT work: attacker controls transmit power)",
        caption: "Relay attacks break the assumption that a completed radio exchange proves proximity. No amount of cryptographic strength helps, because nothing cryptographic is broken. Only a physical measurement that an attacker cannot shorten — round-trip time of flight, cryptographically bound to the authentication — restores the proximity guarantee.",
      },
      {
        type: "prose",
        heading: "Key management is the real system boundary",
        body: [
          "Cryptographic algorithms in access control are rarely the weak point; the lifecycle around the keys almost always is. A complete key management design has to answer a specific set of questions, and answering them late is how organizations end up unable to fix a compromise. Where are keys generated, and with what entropy source? How do they get into cards, readers, and controllers during manufacturing and commissioning without passing through a spreadsheet or an installer's laptop? Where are they stored at rest — a secure element with hardware key storage and no software read path, or flash that a chip-off attack recovers in an afternoon? How are they rotated, and can rotation happen without physically visiting every door and re-issuing every card? How is a single credential revoked, and how quickly does that revocation reach a controller that may be operating offline? And, the question that separates serious designs from hopeful ones: what is the recovery plan if the master key is compromised — is there a path that does not require replacing every card and reader in the building?",
          "Two structural decisions follow from taking those questions seriously. First, secrets belong in hardware: a secure element or a microcontroller with hardware-protected key storage, performing cryptographic operations internally so keys never appear on a bus that probing can reach. Second, the architecture should assume compromise somewhere and limit its blast radius — diversified keys so one card is one card, encrypted and supervised reader links so a harvested reader yields nothing reusable, network segmentation so a controller breach does not become an estate breach, and audit logging that is complete and tamper-evident enough to establish what actually happened afterwards. Defence in depth here is not a slogan; it is the recognition that a fifteen-year-old installation will outlive the security assumptions of at least one of its layers.",
        ],
      },
      {
        type: "prose",
        heading: "Biometrics: a different failure model",
        body: [
          "Biometric factors change the shape of the problem in three ways that matter to a hardware designer. First, matching is statistical rather than exact, so performance is described by a trade-off curve rather than a pass or fail: the false accept rate (an impostor admitted) and the false reject rate (a legitimate user denied) move in opposite directions as the matching threshold is tuned, meeting at the equal error rate, and choosing the operating point on that curve is a policy decision about the relative cost of the two failures. In access control the costs are asymmetric and context-dependent — a false accept at a data-centre door is a breach, while a false reject at a turnstile during a shift change is a queue and a support call — and this is exactly the trade-off the alarm-design note treats for sensors, applied to identity.",
          "Second, biometrics are not revocable. A compromised card is cancelled and reissued; a compromised fingerprint template is permanent, which raises the stakes on template storage enormously and is the reason modern designs store only irreversible transformed templates (never raw images), keep them on the credential or in a secure element rather than in a central database where practical, and treat template handling as a privacy obligation with regulatory weight. Third, biometrics can be presented rather than known — a lifted fingerprint, a photograph, a 3D-printed mould — so a biometric reader without liveness detection is measuring an artefact rather than a person. Presentation-attack detection (thermal, capacitive sub-dermal sensing, pulse, depth and infrared imaging for faces) is not an optional refinement; it is what makes the measurement meaningful. The sound conclusion for most designs is that biometrics are excellent second factors and questionable sole factors: combined with a card or PIN, they defeat credential sharing and lending, which is the failure mode cards genuinely cannot address.",
        ],
      },
      {
        type: "callout",
        heading: "Ask what each layer actually proves",
        body: "A static card number proves only that a number was presented. A challenge-response proves the credential holds a secret, but not that it is nearby. Ranging by signal strength proves nothing an attacker cannot forge. Time-of-flight ranging proves physical proximity. A biometric proves a trait was presented, and only liveness detection proves it belongs to a living person present at the door. Design reviews go badly wrong when a strong proof at one layer is used to justify a weak assumption at another — most memorably, when unbreakable card cryptography terminates in an unencrypted Wiegand pair inside a reader that unscrews from the wall.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Credential security review checklist",
        items: [
          "Enumerate every credential technology the reader will accept, and confirm legacy ones can be disabled — not merely deprioritized — to prevent downgrade.",
          "Require challenge-response with mutual authentication and standard cryptography; treat proprietary ciphers and static identifiers as unsecured.",
          "Diversify keys per credential so extracting one yields exactly one.",
          "Store secrets in a secure element or hardware-protected key storage; never in application flash or configuration files.",
          "Encrypt and supervise the reader-to-controller link (OSDP secure channel), so a reader pulled off the wall yields nothing injectable.",
          "Add time-of-flight ranging where relay attacks are in scope; do not accept RSSI as proximity evidence.",
          "Write the key lifecycle down: generation, injection, storage, rotation, revocation latency for offline controllers, and master-key compromise recovery.",
          "Segment the controller network and treat the backend as an attack surface equal to the door.",
          "For biometrics: choose the FAR/FRR operating point deliberately, require presentation-attack detection, store only irreversible templates, and prefer a second-factor role.",
          "Log completely and tamper-evidently — the forensic record is part of the security design, not an afterthought.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is a 125 kHz proximity card insecure by construction?", answer: "It holds no secret and performs no computation: the card simply broadcasts a fixed identification number to whatever energizes it. There is no challenge, so a captured number is a complete clone. Its identifier functions as both name and password, and anyone who can read it can reproduce it." },
          { question: "What two properties make a credential exchange genuinely secure?", answer: "Challenge-response with mutual authentication — a fresh random nonce each transaction so replays fail, verified in both directions so rogue readers cannot harvest responses — and key diversification, deriving a unique per-card key from a master key so that extracting one card's key compromises only that card." },
          { question: "Why do relay attacks defeat cryptography, and what actually stops them?", answer: "Two attackers relay the genuine exchange in real time between a distant credential and the reader; every cryptographic check passes because nothing is broken — only the assumption that a completed exchange implies proximity. Signal-strength ranging fails since attackers control transmit power. Time-of-flight ranging (UWB) works because relaying adds delay and radio propagation cannot be accelerated." },
          { question: "Why is legacy Wiegand reader wiring a critical vulnerability?", answer: "It is unencrypted, unauthenticated, and unsupervised, so an attacker who removes the reader can inject a captured card number straight into the controller or implant a device that harvests badges and replays them — bypassing the credential cryptography entirely. OSDP with secure channel encrypts and supervises that link, which is why the migration exists." },
          { question: "How do biometrics change the failure model relative to cards?", answer: "Matching is statistical (a FAR/FRR trade-off chosen by policy, not a binary check), the factor is non-revocable so template compromise is permanent — demanding irreversible templates and secure storage — and traits can be presented as artefacts, so liveness detection is what makes the measurement mean a person is present. Best used as a second factor, where they defeat credential sharing." },
        ],
      },
    ],
    sources: [iso14443, mifareClassicAttack, nistKeyManagement, nistBiometric, fidoCtap],
    related: ["credential-readers-and-access-protocols", "access-control-system-architecture", "access-power-and-battery-operated-locks", "access-system-validation-and-production"],
  },
  {
    slug: "access-power-and-battery-operated-locks",
    libraryId: "technical",
    collectionId: "access-lock-systems",
    title: "Access power architecture & battery-operated locks",
    summary: "Powering doors reliably: load classification and inrush, cable voltage drop over long runs, PoE at the door, backup battery sizing and health, defined behaviour through brownout and loss of power — then the energy budget of wireless battery locks, where sleep current decides whether a product lasts two years or two months.",
    readingTime: 25,
    updatedAt: "Aug 12",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Power is where access systems actually fail",
        body: [
          "Access control has a distinctive reliability profile: the cryptography rarely fails, the firmware usually works, and the thing that strands people outside a building at seven in the morning is almost always power. A door is an unusual electrical load — a controller and reader drawing a small continuous current, punctuated by a lock that demands a large pulse, at the end of a cable run that may be a hundred metres of thin conductor, backed by a battery that nobody has tested since installation. Every one of those elements has a characteristic failure mode, and because the consequences run from inconvenience to a life-safety incident, power architecture in this domain gets a level of deliberate design that a comparable low-voltage system would not receive.",
          "The first discipline is classifying the loads honestly, because they behave completely differently. Continuous loads — the controller, the reader, network hardware, and critically the holding current of any magnetic lock — set the standby budget and the battery sizing. Pulsed loads — electric strikes, solenoids, motorized latches and deadbolts — draw large currents for a short interval and dominate the transient behaviour of the supply and the wiring. Inrush is a third category: motors and solenoids draw a multiple of their steady current at the instant of energization, and a supply sized for the steady figure will collapse under it. The consequence of ignoring the distinction is the classic field symptom: the lock actuates, the rail dips, the controller browns out and reboots, and the door does something unintended in the process.",
        ],
      },
      {
        type: "formula",
        heading: "Cable voltage drop is usually the binding constraint",
        formula: "V_drop = 2 · L · I · R_per_metre      (factor 2: current flows out and back)      arriving voltage = V_supply − V_drop",
        explanation: "This is the calculation that decides whether a door works, and it is the one most often skipped. Take a 12 V electric strike drawing 0.5 A at the end of 100 m of 22 AWG cable, whose resistance is roughly 0.053 Ω per metre: the round-trip resistance is 2 × 100 × 0.053 ≈ 10.6 Ω, so the drop is 5.3 V and the strike sees 6.7 V — far below its operating threshold, and it will either fail to actuate or actuate unreliably at temperature. Three levers fix it: heavier cable (18 AWG at 0.021 Ω/m cuts the drop to about 2.1 V), a higher distribution voltage (running 24 V halves the current for the same power and therefore halves the drop while doubling the headroom), or moving the supply closer to the door. The reason 24 V is common in access distribution, and the reason PoE at the door has been so successful, is precisely this arithmetic.",
        terms: [
          { symbol: "L", meaning: "One-way cable length", unit: "m" },
          { symbol: "R_per_metre", meaning: "Conductor resistance (22 AWG ≈ 0.053, 18 AWG ≈ 0.021)", unit: "Ω/m" },
          { symbol: "I", meaning: "Load current — use worst case, not nominal", unit: "A" },
        ],
      },
      {
        type: "prose",
        heading: "Centralized panels versus power at the door",
        body: [
          "Two architectures dominate. The traditional approach centralizes: a panel in a secure riser room houses the controller, the power supply, and the backup batteries, and runs low-voltage cable out to each door for the lock, reader, and sensors. Its advantages are real — one place to maintain batteries, physical security for the controller, and straightforward compliance with the requirement that access equipment live in a protected space. Its costs are the cable runs (with the voltage-drop arithmetic above), the copper, and the labour of pulling multiple cable types to every opening.",
          "The alternative powers and networks each door over Ethernet. A PoE door controller takes network and power on one cable, drives the lock and reader locally, and eliminates both the long low-voltage runs and the separate power distribution. The budget must be done carefully: 802.3af provides about 12.95 W at the device, 802.3at about 25.5 W, and 802.3bt substantially more — and a door needs to cover the controller, the reader, any auxiliary sensors, and the lock's holding or actuating current simultaneously. A magnetic lock holding continuously at 500 mA and 24 V is 12 W by itself, which consumes an entire 802.3af budget before anything else is powered, so maglock doors typically require at least 802.3at. The other consideration is that PoE moves the backup problem: instead of batteries at each door, the switch must be on a UPS, which is often better engineering (one well-maintained UPS in a server room beats twenty forgotten sealed-lead-acid batteries in ceiling voids) provided somebody actually accounts for it.",
        ],
      },
      {
        type: "prose",
        heading: "Backup power: sizing, health, and the honest failure mode",
        body: [
          "Secondary power exists so that a door behaves correctly during a mains outage, and sizing it is a straightforward calculation that is routinely done wrong. The requirement is typically expressed as a standby duration at quiescent current followed by an alarm or activity allowance: capacity must cover the sum of all continuous loads for the required hours, plus the energy of the expected lock actuations during that period, plus derating for the battery's age, its temperature, and the fact that a sealed lead-acid battery discharged below about 80% depth repeatedly will not survive many cycles. Sizing to the nominal capacity printed on the label, with no derating for a battery that has been in a warm ceiling for four years, is how a system rated for four hours of standby delivers twenty minutes.",
          "The design obligation that follows is battery health monitoring, because an unmonitored backup battery is a component that fails silently and is discovered during the emergency it existed to cover. Practical monitoring measures the battery voltage under a periodic applied load rather than at rest (resting voltage tells you almost nothing about capacity), tracks internal resistance growth as the ageing signal, logs the result, and raises a supervisory alarm well before end of life. Charging deserves equal attention: a charger that floats a lead-acid battery slightly too high cooks it and halves its life, and one that floats too low leaves it chronically undercharged, so temperature-compensated charging is standard practice. The same reasoning that makes per-unit records valuable in manufacturing applies here — a battery with a serial number, an installation date, and a logged resistance trend is a maintainable component, and one without is a liability with a date attached.",
        ],
      },
      {
        type: "prose",
        heading: "Behaviour through brownout and power loss",
        body: [
          "The most important power requirement in an access product is not how long it runs but how it behaves as it fails. A controller that browns out has a dangerous intermediate region where the processor is running erratically, outputs are indeterminate, and the lock driver may be partially energized — and in that state a device can unlock a secure door, fail to unlock an egress door, corrupt its configuration, or write a false event into the audit log. The design answer is a defined safe state entered deterministically: a brownout detector with a threshold above the processor's minimum operating voltage, hardware that forces lock outputs to their designed safe condition rather than leaving them to firmware, sufficient holdup capacitance to complete any in-progress write to non-volatile storage, and a reset that holds the processor down until the rail is genuinely valid rather than allowing it to oscillate around the threshold.",
          "What the safe state should be is a life-safety question before it is a security question. A fail-safe lock unlocks when power is removed, which is required wherever the door is part of an egress path — people must always be able to get out, and codes are unambiguous that egress cannot depend on power or on electronics functioning. A fail-secure lock stays locked without power, appropriate where security dominates and egress is provided by mechanical means such as a lever that always retracts the latch from the inside. Getting this wrong in either direction is serious: a fail-secure lock on an egress door is a life-safety hazard, and a fail-safe lock on a sensitive door means cutting power is a bypass. The correct posture is to derive the choice from the egress analysis for that specific opening, document it, and then verify by test that removing power actually produces the documented behaviour — including during a brownout, not merely at a clean disconnect.",
        ],
      },
      {
        type: "prose",
        heading: "Battery-operated wireless locks: where the energy budget rules",
        body: [
          "Battery-powered wireless locks — the retrofit cylinders, smart deadbolts, and offline locks that dominate modern deployments where cabling a door is impractical — invert the design problem entirely. There is no supply to size; there is a fixed energy allowance, typically a few thousand milliamp-hours from alkaline or lithium cells, that must cover one to three years of operation. Every design decision becomes an energy decision, and the arithmetic is dominated by a fact that surprises people: the motor that actually moves the bolt is usually a minor contributor, while the current the device draws doing nothing consumes most of the battery.",
          "Work the numbers to see why. A motorized bolt drawing 300 mA for 500 ms consumes about 0.042 mAh per operation; at 20 operations per day for a year that is roughly 300 mAh. Now consider standby: a device idling at 100 µA continuously consumes 0.1 mA × 8760 hours ≈ 876 mAh in the same year — nearly three times the entire motor budget. Reduce that idle draw to 10 µA and it becomes 88 mAh, and the battery life roughly triples. This is why wireless lock design is obsessive about sleep current: everything that can be powered down is, the radio wakes on a schedule or on a wake-up receiver rather than listening continuously, the microcontroller spends its life in deep sleep with only a low-power timer and a wake interrupt running, and quiescent current of every regulator and pull-up on the board is scrutinized because a single forgotten 10 kΩ pull-up across 3 V is 300 µA and by itself dominates the budget.",
        ],
      },
      {
        type: "formula",
        heading: "The wireless lock energy budget",
        formula: "life (hours) ≈ Capacity_derated / ( I_sleep + Σ (events/hour × charge_per_event) )      charge_per_event (mAh) = I_event × t_event / 3600",
        explanation: "Battery life is capacity divided by average current, where average current is the sleep floor plus the time-averaged contribution of every periodic and event-driven activity: motor actuations, radio wake-and-advertise cycles, credential reads, LED and audible feedback, and any sensor polling. Two derating factors must be applied honestly or the estimate is fiction. Temperature: alkaline cells lose a large fraction of their usable capacity below freezing, which is why outdoor and cold-store locks specify lithium chemistry (lithium iron disulfide primaries hold up far better at −20 °C). And pulse behaviour: cells have internal resistance that rises as they age, so a motor pulse that draws a full ampere causes a voltage sag which can trip the low-voltage cutoff long before the cell's energy is exhausted — the reason a lock's practical end of life arrives when it can no longer complete a motor cycle at temperature, not when the coulombs run out. Adding bulk capacitance across the cells to supply the motor pulse is the standard countermeasure.",
        terms: [
          { symbol: "I_sleep", meaning: "Quiescent current — usually the dominant term", unit: "µA" },
          { symbol: "charge_per_event", meaning: "Energy per actuation, radio wake, or read", unit: "mAh" },
          { symbol: "Capacity_derated", meaning: "Nameplate capacity after temperature and pulse derating", unit: "mAh" },
        ],
      },
      {
        type: "prose",
        heading: "Designing the end of battery life",
        body: [
          "The failure that matters is not the battery running out; it is the battery running out without warning, or the device behaving unpredictably as it does. A well-designed battery lock treats end of life as a managed sequence rather than an event. It measures battery condition under load rather than at rest, because a cell whose resting voltage looks healthy may collapse under the motor pulse. It escalates in stages, giving a local indication (an LED or tone at each use) and a remote notification through whatever network exists, with enough margin — typically weeks, and hundreds of operations — for a service visit. It sheds load as reserves fall, disabling non-essential features such as illumination, audible feedback, or frequent radio check-ins, so the remaining energy goes to the function that matters. And it defines what happens when the energy is genuinely gone, which is where mechanical design re-enters: most credible products provide a mechanical key override, an external contact to apply emergency power from a battery pack, or a fail-safe mechanical state, precisely because a purely electronic lock with a dead battery is otherwise an unopenable door.",
          "That last point is the recurring theme of the whole domain, and it is worth stating plainly for a design review: an access product's power architecture must be judged by what it does when the power is inadequate, not by what it does when the power is fine. Nominal operation is easy and everyone tests it. The behaviours that determine whether the product is trustworthy are the sag under a motor pulse at the end of a long cable at low temperature, the transition through brownout, the state after an unexpected power cut mid-operation, the standby duration with a four-year-old battery, and the warning the user receives before any of it becomes their problem.",
        ],
      },
      {
        type: "table",
        heading: "Power architecture options compared",
        columns: ["Architecture", "Powers the door via", "Backup approach", "Main constraints"],
        rows: [
          ["Centralized panel", "Low-voltage runs from a riser room", "Batteries in the panel", "Cable voltage drop; copper and labour; battery maintenance"],
          ["PoE at the door", "Ethernet, one cable per opening", "UPS on the switch", "Class budget (maglocks often need 802.3at+); switch as single point"],
          ["Local supply at the door", "Mains transformer near the opening", "Local battery or none", "Mains availability; distributed maintenance"],
          ["Battery wireless lock", "Primary cells in the lock", "Mechanical override / emergency contacts", "Sleep current dominates life; cold-temperature and pulse derating"],
        ],
      },
      {
        type: "callout",
        heading: "Judge the design by its brownout behaviour",
        body: "The dangerous region is not zero volts — it is the interval on the way there, where the processor runs erratically and outputs are indeterminate. Specify a brownout threshold above the minimum operating voltage, force lock outputs to their documented safe state in hardware rather than firmware, provide holdup for in-flight non-volatile writes, and hold reset until the rail is genuinely valid. Then test it by ramping the supply down slowly, which is the case that finds the faults a clean power cut never will.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Access power design checklist",
        items: [
          "Classify every load as continuous, pulsed, or inrush, and size the supply for the worst-case simultaneous combination.",
          "Compute cable voltage drop at worst-case current and length; choose gauge, distribution voltage, or supply location accordingly.",
          "For PoE doors, budget the class against controller, reader, sensors, and lock holding current together — maglocks usually force 802.3at or better.",
          "Size backup capacity for standby hours plus actuation energy, derated for age and temperature; put the switch UPS in scope for PoE designs.",
          "Monitor battery health under applied load, track internal resistance, log it per unit, and alarm well before end of life.",
          "Use temperature-compensated charging; over-floating halves lead-acid life.",
          "Define the safe state from the egress analysis for that opening, and verify it by test through brownout as well as at clean disconnect.",
          "Implement brownout detection, hardware-forced output states, write holdup, and a reset that holds until the rail is valid.",
          "For battery locks, attack sleep current first — audit every regulator quiescent current and pull-up; it dominates life.",
          "Derate cell capacity for cold and for pulse sag; add bulk capacitance so motor pulses do not trip the cutoff.",
          "Design a staged end-of-life: load-under-test measurement, local and remote warning with weeks of margin, feature shedding, and a mechanical or emergency-power override.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does a 12 V strike often fail at the end of a long cable, and what are the three fixes?", answer: "Round-trip cable resistance drops voltage: 100 m of 22 AWG is about 10.6 Ω both ways, so 0.5 A drops 5.3 V and the strike sees 6.7 V. Fixes: heavier gauge, higher distribution voltage (24 V halves the current and therefore the drop for the same power), or relocating the supply closer to the door." },
          { question: "Why do maglock doors usually need more than 802.3af PoE?", answer: "A magnetic lock holds continuously — 500 mA at 24 V is about 12 W — which alone consumes essentially the whole 12.95 W available at an 802.3af device, leaving nothing for the controller, reader, and sensors. 802.3at (about 25.5 W) or better is required to cover the door as a whole." },
          { question: "What makes brownout more dangerous than a clean power loss?", answer: "In the intermediate voltage region the processor runs erratically and outputs are indeterminate, so the device can unlock a secure door, fail to release an egress door, corrupt configuration, or log false events. The countermeasures are a brownout threshold above minimum operating voltage, hardware-forced safe output states, holdup for non-volatile writes, and reset held until the rail is valid." },
          { question: "In a battery-powered wireless lock, why does sleep current usually matter more than motor energy?", answer: "Motor actuation is brief: 300 mA for 500 ms is about 0.042 mAh, roughly 300 mAh across a year at 20 operations a day. Idle current runs continuously: 100 µA for a year is about 876 mAh — nearly three times the motor budget. Cutting idle to 10 µA roughly triples battery life, so quiescent current dominates the design." },
          { question: "Why can a battery lock fail while the cells still hold energy?", answer: "Internal resistance rises with age and falls with temperature, so a high-current motor pulse causes a voltage sag that trips the low-voltage cutoff before the stored charge is exhausted. Practical end of life is the inability to complete a motor cycle cold — which is why capacity is derated for pulse and temperature, and why bulk capacitance is added to supply the pulse." },
        ],
      },
    ],
    sources: [ieee8023bt, nfpa72],
    related: ["access-control-system-architecture", "electric-locks-and-door-hardware", "credential-security-and-attack-resistance", "ee-me-co-design-for-lock-products", "access-system-validation-and-production", "battery-storage-for-solar-and-grid"],
  },
];
