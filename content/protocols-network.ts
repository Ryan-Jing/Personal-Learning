import type { Note, Source } from "./library";

const tiCanIntro: Source = {
  title: "SLOA101 — Introduction to the Controller Area Network (CAN)",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/pdf/sloa101",
  kind: "Documentation",
};

const tiRs485Guide: Source = {
  title: "SLLA272 — The RS-485 Design Guide",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/pdf/slla272",
  kind: "Documentation",
};

const microchipEthernet: Source = {
  title: "AN1120 — Ethernet Theory of Operation",
  publisher: "Microchip Technology",
  url: "https://ww1.microchip.com/downloads/en/AppNotes/01120a.pdf",
  kind: "Documentation",
};

export const networkProtocolNotes: Note[] = [
  {
    slug: "can-bus",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "CAN & CAN FD",
    summary: "Dominant/recessive signaling, lossless arbitration, error confinement, bit timing versus bus length, termination, CAN FD, and system-level design.",
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Dominant beats recessive",
        body: [
          "CAN is a differential two-wire bus (CANH, CANL) built on an asymmetric idea: a recessive bit is the relaxed state (both lines near 2.5 V, no differential voltage), and a dominant bit actively drives the lines apart (CANH up, CANL down). Any transmitter sending dominant overrides all transmitters sending recessive — a wired-AND, like I2C but differential and fast.",
          "That asymmetry gives CAN lossless arbitration. Every frame begins with an identifier; nodes that want to transmit start simultaneously and monitor the bus while sending. A node that transmits recessive but reads back dominant has lost arbitration; it silently becomes a receiver and retries later. No data is destroyed, no collisions are re-run, and the lowest identifier always wins — so the identifier is also the priority, and assigning identifiers is real-time system design, not bookkeeping.",
          "Robustness is layered on thick: bit stuffing (after five identical bits, the opposite is inserted) keeps edges coming for resynchronization; a 15-bit CRC covers each frame; every receiving node drives a dominant ACK slot; and hardware error counters move a faulty node from error-active through error-passive to bus-off, so a babbling node confines itself instead of killing the bus. This fault-confinement machinery is why CAN dominates vehicles and industrial machines.",
        ],
      },
      {
        type: "prose",
        heading: "Bit timing is a physics contract",
        body: [
          "Each bit period is divided into time quanta grouped into segments: sync, propagation, phase 1, and phase 2, with the sample point between phase 1 and 2 — typically at 75–87.5% of the bit. The propagation segment must cover the round trip to the farthest node and back, because arbitration and ACK require every node to see and stamp the same bit within one bit time. That requirement couples speed and length: roughly 1 Mbit/s at 40 m, 500 kbit/s at 100 m, 125 kbit/s at 500 m.",
          "All nodes must be configured with compatible bit timing — same bit rate, compatible sample points, and a synchronization jump width that absorbs oscillator tolerance. Nodes resynchronize on recessive-to-dominant edges, which is what bit stuffing guarantees. A node with a sloppy internal RC oscillator or a wrong sample point works on the bench and generates error frames in the field as temperature drifts.",
        ],
      },
      {
        type: "table",
        heading: "Classic CAN versus CAN FD",
        columns: ["Property", "Classic CAN", "CAN FD"],
        rows: [
          ["Payload", "0–8 bytes", "Up to 64 bytes"],
          ["Bit rate", "One rate, ≤ 1 Mbit/s", "Arbitration ≤ 1 Mbit/s; data phase to 5–8 Mbit/s"],
          ["CRC", "15-bit", "17/21-bit with stuff-bit counting"],
          ["Coexistence", "—", "Classic-only controllers destroy FD frames; all nodes must be FD or FD-tolerant"],
          ["Use", "Legacy vehicles, industrial", "Modern vehicle platforms, bootloading, larger sensor data"],
        ],
      },
      {
        type: "prose",
        heading: "Physical-layer discipline",
        body: [
          "A CAN bus is a single linear trunk terminated with 120 Ω at both ends — a healthy unpowered bus measures 60 Ω between CANH and CANL. Stubs off the trunk must be short (the higher the bit rate, the shorter), because unterminated stubs reflect. Split termination (two 60 Ω resistors with a capacitor from the midpoint to ground) improves common-mode EMC behavior. Transceivers tolerate substantial common-mode offset between node grounds, but a ground reference or isolation strategy still needs to be explicit for long or inter-building runs.",
          "Above the wire, raw CAN gives you prioritized 8–64 byte datagrams with excellent integrity but no fragmentation, no flow control, and no node addressing convention. That is what higher layers add: J1939 (trucks, off-highway), CANopen (industrial), ISO-TP (diagnostics transport for frames larger than 8 bytes), and UDS on top for diagnostics. Even in-house protocols need an identifier map, a fragmentation rule, and a bus-load budget — keep sustained load well under saturation or low-priority messages starve.",
        ],
      },
      {
        type: "callout",
        heading: "A lone CAN node cannot even talk to itself",
        body: "Every frame needs at least one other node to drive the ACK slot. A single node on a bench transmits, gets no ACK, raises an error, and retries forever — which looks like a broken transmitter. Similarly, bus-off recovery policy is a system decision: automatic instant re-entry can turn one faulty node into a periodic bus disturbance. Decide deliberately when and how a bus-off node returns.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "CAN design review",
        items: [
          "Assign identifiers as priorities against deadline analysis, and document the ID map as an interface contract.",
          "Verify bit timing: oscillator tolerance, sample point, and SJW across all nodes, including third-party ones.",
          "Terminate both trunk ends with 120 Ω, keep stubs short, and measure 60 Ω on the assembled harness.",
          "Budget worst-case bus load with margin; confirm the lowest-priority message still meets its deadline.",
          "Define error handling: bus-off recovery, error counters surfaced to diagnostics, and behavior during flash/update.",
          "For CAN FD, confirm every node (and every analyzer in the toolchain) is FD-capable or FD-tolerant.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is CAN arbitration lossless?", answer: "Transmitters monitor the bus while sending the identifier; a node sending recessive that reads dominant stops transmitting without corrupting the winner's frame, since dominant simply overrides recessive." },
          { question: "What couples CAN bit rate to bus length?", answer: "The propagation segment of every bit must cover the signal round trip to the farthest node, because arbitration and ACK need all nodes to agree on each bit within one bit time." },
          { question: "What is bit stuffing for?", answer: "It guarantees edges within any six-bit window so receivers can resynchronize their bit clocks, and it doubles as a frame-consistency check." },
          { question: "Why does mixing one classic-CAN node into an FD network fail?", answer: "The classic controller interprets FD frames as errors and actively destroys them with error frames; all nodes must understand or at least tolerate the FD format." },
        ],
      },
    ],
    sources: [tiCanIntro],
    related: ["rs485-differential-serial", "choosing-a-communication-interface", "marine-emi-emc-and-cabling"],
  },
  {
    slug: "rs485-differential-serial",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "RS-232, RS-422 & RS-485",
    summary: "The three classic serial electrical standards: signaling levels, common-mode range, multi-drop rules, termination, fail-safe biasing, and turnaround timing.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Three standards for three distances",
        body: [
          "These standards define electrical layers, not protocols — the bytes on top are usually plain UART frames. RS-232 is single-ended, point-to-point, with inverted wide-swing levels (a logic 1 is negative, roughly −5 to −15 V) that gave noise margin in 1960s equipment; it survives as the console and instrument interface, good for a few meters. RS-422 uses differential pairs with one driver and up to ten receivers — a multicast link. RS-485 extends that to true multi-point: multiple drivers share the pair, taking turns.",
          "Differential signaling is the upgrade that matters. The receiver reads the voltage difference between the pair, so noise induced equally on both wires (and moderate ground-potential differences between nodes) cancels. RS-485 receivers must tolerate a common-mode range of −7 to +12 V, which is what lets nodes hundreds of meters apart with imperfect grounds communicate reliably over a twisted pair.",
          "Speed trades against distance through cable loss and reflections: tens of Mbit/s over a few meters, ~100 kbit/s at 1200 m. Slew-rate-limited transceivers deliberately slow edges to reduce EMI and reflection sensitivity at modest bit rates.",
        ],
      },
      {
        type: "table",
        heading: "Standard comparison",
        columns: ["Property", "RS-232", "RS-422", "RS-485"],
        rows: [
          ["Signaling", "Single-ended, inverted, ±5–15 V", "Differential", "Differential"],
          ["Topology", "Point-to-point", "1 driver, ≤10 receivers", "Multi-point, 32 unit loads (more with fractional-load parts)"],
          ["Distance", "~15 m", "~1200 m", "~1200 m"],
          ["Duplex", "Full (separate TX/RX)", "Full", "Half on one pair; full with two pairs"],
          ["Typical use", "Consoles, instruments", "Encoders, point-to-multipoint", "Modbus, building/industrial/marine networks"],
        ],
      },
      {
        type: "prose",
        heading: "Designing a working RS-485 link",
        body: [
          "Topology first: a single linear trunk with short stubs, 120 Ω termination at both ends and nowhere else. Termination kills reflections but also loads the bus; only the two physical ends get resistors. Fail-safe biasing is the detail everyone forgets: between transmissions no driver is enabled, and a terminated, unbiased pair floats at 0 V differential — an undefined logic state that receivers may render as noise and framing errors. One node (only one place on the bus) adds a pull-up on one line and a pull-down on the other to hold the idle bus in a defined mark state; modern transceivers with internal fail-safe thresholds relax but don't eliminate this analysis.",
          "Half-duplex turnaround is where protocols break. The driver-enable pin must be asserted before data and released promptly after the final stop bit; hold it too long and you clip the reply of the next node, release it too early and you truncate your own last byte. Protocols impose silence gaps — Modbus RTU's 3.5-character idle time delimits frames — and firmware must control DE/RE timing precisely (hardware-assisted DE on many UARTs is worth using). Auto-direction converters that key on data edges mask these timing rules until they fail at a different baud rate.",
          "The third wire matters: differential does not mean ground-free. The common-mode range is generous but finite, so nodes need a common reference — a ground conductor (often through a series impedance to limit circulating current) or galvanic isolation for long runs, separate buildings, or noisy motor environments. Isolation plus transient protection (TVS rated for the common-mode range) is standard practice in industrial and marine installations.",
        ],
      },
      {
        type: "callout",
        heading: "Symptoms map to specific mistakes",
        body: "Garbage characters only between messages: missing fail-safe bias. Works with two nodes, fails with twenty: exceeded unit loads or star wiring instead of a trunk. Intermittent at one end only: missing or doubled termination. First or last byte corrupted: driver-enable turnaround timing. Random errors when the motor runs: common-mode range exceeded — check grounding and isolation.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "RS-485 design review",
        items: [
          "Draw the trunk: linear topology, both-end termination, stub lengths, and node count in unit loads.",
          "Place fail-safe bias at exactly one location and verify idle-state voltage at the far end.",
          "Verify driver-enable timing at the real baud rate with a scope on DE and the bus.",
          "Provide a ground reference conductor or isolation; check worst-case common-mode voltage.",
          "Add transient protection sized for the environment, and check it doesn't load the bus.",
          "Fix the protocol framing (e.g., Modbus RTU timing or a length+CRC scheme) and enforce inter-frame gaps in firmware.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does differential signaling tolerate ground offset?", answer: "The receiver decodes only the difference between the pair; offset appears as common mode and is rejected as long as it stays inside the receiver's specified common-mode range." },
          { question: "Why terminate at both ends but bias in one place?", answer: "Termination matches the line's characteristic impedance at each end to absorb reflections; bias just needs to hold the idle differential state and multiple bias points would fight the drivers and each other." },
          { question: "What is a unit load?", answer: "A standardized receiver input load; RS-485 drivers must handle 32 of them, so fractional-load receivers (1/4, 1/8) allow 128 or 256 physical nodes." },
          { question: "Why do auto-direction RS-485 adapters cause trouble?", answer: "They infer turnaround from data timing at an assumed baud rate, hiding driver-enable discipline; at other rates or with unusual traffic they clip or extend transmissions." },
        ],
      },
    ],
    sources: [tiRs485Guide],
    related: ["uart-fundamentals", "can-bus", "marine-emi-emc-and-cabling"],
  },
  {
    slug: "ethernet-for-embedded",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "Ethernet for embedded systems",
    summary: "MAC/PHY split, MII/RMII/RGMII, MDIO, magnetics and isolation, auto-negotiation, layout rules, TCP/IP stacks on MCUs, and single-pair Ethernet.",
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "MAC, PHY, magnetics — three parts, three problem domains",
        body: [
          "An embedded Ethernet port splits into a MAC (media access controller, usually inside the MCU/SoC — handles framing, addresses, checksums, DMA) and a PHY (the mixed-signal transceiver that turns frames into line signaling). Between them runs a parallel digital interface — MII, RMII, or RGMII — plus a two-wire management channel, MDIO/MDC, through which the MAC reads PHY status and writes configuration registers.",
          "Behind the PHY sit the magnetics: pulse transformers providing 1500 Vrms galvanic isolation, common-mode rejection, and DC blocking to the cable. Unused pair center taps terminate through the Bob Smith network (75 Ω to a capacitively-coupled chassis point) to damp common-mode energy. Integrated jacks (MagJack) bundle transformer, LEDs, and connector; discrete magnetics give more layout control. Either way, the region between PHY, magnetics, and jack is analog territory: 100 Ω differential pairs, controlled spacing, and a deliberately voided area under the isolation gap.",
          "Link establishment is negotiated: auto-negotiation exchanges link pulses to agree on speed (10/100/1000) and duplex. Forcing one side while the other negotiates is the classic duplex-mismatch failure — the negotiating side falls back to half duplex, and the link 'works' with terrible, load-dependent packet loss. Either negotiate everywhere or force both ends identically.",
        ],
      },
      {
        type: "table",
        heading: "MAC–PHY interface variants",
        columns: ["Interface", "Signals", "Clocking", "Notes"],
        rows: [
          ["MII", "~16 pins", "25 MHz", "10/100; legacy, pin-hungry"],
          ["RMII", "~8 pins", "50 MHz shared reference", "10/100; decide early whether PHY or MCU sources the 50 MHz"],
          ["RGMII", "12 pins, DDR", "125 MHz, DDR", "10/100/1000; requires ~1.5–2 ns clock-to-data skew via internal delay or routing"],
          ["SGMII / serial", "2 diff pairs", "SerDes", "Gigabit+ over few pins; common on larger SoCs and switches"],
          ["MDIO/MDC", "2 pins", "≤ 2.5 MHz typical", "Register access; address strap pins set PHY address at reset"],
        ],
      },
      {
        type: "prose",
        heading: "Firmware realities on an MCU",
        body: [
          "Running TCP/IP on a microcontroller means a stack (lwIP, FreeRTOS+TCP, or a vendor port) fed by the MAC's DMA descriptor rings. The recurring engineering problems are buffer management (pool exhaustion under load, zero-copy versus copy trade-offs), cache coherency on cores with data caches, checksum offload configuration, and interrupt/task architecture — packet bursts must not starve the rest of the system. Throughput numbers on vendor slides assume ideal buffers; measure your own under realistic load.",
          "Standard Ethernet is not deterministic: switches queue, stacks retry, and latency is statistical. Industrial systems that need bounded latency use TSN features or dedicated protocols (EtherCAT, PROFINET IRT) with hardware support. Meanwhile single-pair Ethernet is moving into embedded territory: 100BASE-T1 (automotive), 10BASE-T1L (long-reach industrial, ~1 km, optionally with power) and 10BASE-T1S (short multidrop) replace CAN/RS-485 in some new designs, bringing IP connectivity over one twisted pair.",
        ],
      },
      {
        type: "callout",
        heading: "RGMII skew and PHY straps are the usual bring-up sinks",
        body: "RGMII requires the clock delayed relative to data; if neither the MAC nor the PHY is configured to add internal delay (and traces don't provide it), you get a link that passes small pings and corrupts real traffic. Separately, PHY configuration strap pins are sampled at reset on shared pins — a pull-up added for another function, or an LED circuit, can silently change the strapped PHY address or mode.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Embedded Ethernet design review",
        items: [
          "Choose the MAC–PHY interface and its clock source explicitly; document who generates what.",
          "Route MDI pairs as 100 Ω differential with intra-pair matching; keep the magnetics/jack region clear of other copper.",
          "Verify every PHY strap pin's state at reset against all other functions sharing the pin.",
          "Configure RGMII delays (MAC-side, PHY-side, or trace) and write down which one is in effect.",
          "Size stack buffers and descriptors for worst-case bursts; test under saturation and measure drops.",
          "EMC-test with a real long cable attached — the cable is the antenna that certification will see.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What do the magnetics actually do?", answer: "Pulse transformers isolate the port galvanically (1500 Vrms), block DC, reject common-mode noise, and — with the Bob Smith termination — damp common-mode energy on the cable." },
          { question: "What causes a duplex mismatch and what does it look like?", answer: "One end forced full-duplex while the other auto-negotiates; the negotiating end falls back to half duplex, producing late collisions and load-dependent loss on a link that superficially works." },
          { question: "Why is RGMII skew management required?", answer: "It is a DDR interface where data is sampled on both clock edges; the specification requires ~1.5–2 ns delay between clock and data, provided by internal PHY/MAC delay settings or routed trace delay." },
          { question: "Where does single-pair Ethernet fit?", answer: "10BASE-T1L/T1S and 100BASE-T1 bring IP networking over one twisted pair for industrial and automotive nodes — long reach or multidrop — competing with CAN and RS-485 while unifying the protocol stack." },
        ],
      },
    ],
    sources: [microchipEthernet],
    related: ["can-bus", "choosing-a-communication-interface", "emi-emc-pcb-design"],
  },
];
