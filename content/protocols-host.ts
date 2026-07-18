import type { Note, Source } from "./library";

const usbIfSpec: Source = {
  title: "USB 2.0 Specification",
  publisher: "USB Implementers Forum",
  url: "https://www.usb.org/document-library/usb-20-specification",
  kind: "Documentation",
};

const pciSig: Source = {
  title: "PCI Express Specifications",
  publisher: "PCI-SIG",
  url: "https://pcisig.com/specifications",
  kind: "Documentation",
};

const armAdi: Source = {
  title: "ARM Debug Interface Architecture Specification (ADIv5)",
  publisher: "Arm",
  url: "https://developer.arm.com/documentation/ihi0031/latest/",
  kind: "Documentation",
};

export const hostProtocolNotes: Note[] = [
  {
    slug: "choosing-a-communication-interface",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "Choosing a communication interface",
    summary: "A decision framework: distance, topology, throughput, determinism, pin and driver cost, EMC, and the layering that raw buses leave to you.",
    readingTime: 12,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: [
      {
        type: "prose",
        heading: "Interfaces are system decisions, not preferences",
        body: [
          "Every interface choice answers the same set of questions. How far does the signal travel — millimeters on a board, a meter inside an enclosure, a hundred meters through an electrically hostile building? What topology — one peer, a shared bus of many nodes, a host with devices? How much data, and is worst-case latency bounded or best-effort? Who provides the clock? How many pins, how much silicon, and how much firmware can you afford? Does the environment demand differential signaling, isolation, or specific connectors?",
          "The failure pattern to avoid is stretching an interface past its design envelope: I2C down a two-meter cable, SPI through a wire harness, UART between buildings. On-board single-ended buses assume small capacitance, a shared clean ground, and no ESD exposure. The moment a signal leaves the enclosure it needs the things off-board interfaces provide: differential pairs, defined common-mode tolerance, transient protection, and connectors specified for the job.",
          "Layer the decision. The electrical layer (levels, differential or not, topology) is separable from framing (how bytes become messages) and from protocol guarantees (acknowledgment, retry, ordering, flow control). UART, SPI, and I2C give you almost no guarantees — you build integrity on top. CAN, USB, and Ethernet embed CRCs, acknowledgment, and arbitration in silicon. That built-in machinery is usually worth its complexity the moment reliability matters.",
        ],
      },
      {
        type: "table",
        heading: "Field guide",
        columns: ["Interface", "Typical rate", "Reach & topology", "Cost & complexity", "Natural fit"],
        rows: [
          ["UART", "9.6 k–10+ Mbit/s", "Board / short cable, point-to-point", "Trivial", "Consoles, modules (GPS, BT), bootloaders"],
          ["I2C", "100 k–1 Mbit/s", "On-board, shared 2-wire bus", "Low; shared-state hazards", "Config, sensors, EEPROMs, power management"],
          ["SPI", "1–100+ Mbit/s", "On-board, star or daisy chain", "Low; pin-per-device CS", "Flash, ADCs, displays, fast sensors"],
          ["I2S/TDM", "1–25 Mbit/s", "On-board, point-to-point", "Moderate; clock trees", "Audio converters and codecs"],
          ["CAN (FD)", "125 k–5 Mbit/s", "10–500 m shared trunk", "Moderate; controller in silicon", "Vehicles, machines, robust multi-node control"],
          ["RS-485", "0.1–10 Mbit/s", "Up to ~1200 m multi-drop", "Low-moderate; turnaround rules", "Industrial/marine field buses, Modbus"],
          ["USB", "12 M–10+ Gbit/s", "Cabled host-device, ≤ 5 m", "High; stack + compliance", "PC connectivity, power + data, HID/CDC/MSC"],
          ["Ethernet", "10 M–10 Gbit/s", "100 m per segment, switched", "High; PHY + TCP/IP stack", "IP networking, high throughput, infrastructure"],
          ["PCIe", "2.5–64 GT/s per lane", "On-board / backplane, point-to-point", "Very high; SI-dominated", "Processor-to-peripheral bandwidth (NVMe, FPGA, radios)"],
        ],
      },
      {
        type: "prose",
        heading: "Do the arithmetic before choosing",
        body: [
          "Compute required throughput including protocol overhead — framing bytes, ACK turnarounds, inter-frame gaps, worst-case retries — and demand comfortable margin, because buses saturate ungracefully. Then check latency separately: a bus can have high average throughput and terrible worst-case latency (shared buses under load, USB scheduling, Ethernet queuing). If a deadline is hard, either the bus must guarantee it by design (CAN priority, TSN, dedicated links) or the architecture must not depend on the bus for that deadline.",
          "Finally, budget the engineering: an interface's true cost includes the driver, the test tooling (analyzers, exercisers), compliance work, connector strategy, and the debugging skills your team has. A slightly slower bus you can see into with a $50 logic analyzer often ships before a faster one that needs a $50k scope.",
        ],
      },
      {
        type: "callout",
        heading: "Reliability is a layer you must consciously place",
        body: "If the bus doesn't provide integrity and delivery guarantees, your firmware must: framing with CRC, sequence numbers, timeouts, retries, and version negotiation. Decide where those live on day one — retrofitting integrity into a deployed raw-byte protocol is one of embedded's most expensive regrets.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Interface selection review",
        items: [
          "Write the requirements first: bytes per second, worst-case latency, node count, distance, environment, isolation.",
          "Check the electrical envelope: on-board vs off-board, ground offsets, ESD/surge exposure, EMC constraints.",
          "Account for protocol overhead and bus load margin, not just headline bit rate.",
          "Identify what the bus guarantees versus what firmware must add (integrity, ordering, flow control).",
          "Confirm silicon support (controllers, DMA, errata) and toolchain visibility (analyzers, test equipment).",
          "Plan versioning and coexistence: what happens when a v2 node meets a v1 bus?",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What separates an on-board bus from an off-board interface?", answer: "Off-board interfaces budget for ground offset, ESD, cable capacitance, and connectors — usually via differential signaling, defined common-mode range, and protection. On-board buses assume none of that is needed." },
          { question: "Why can a high-throughput bus still miss deadlines?", answer: "Throughput is an average; latency is a worst case. Shared media, arbitration, queuing, and retries stretch tail latency even when average utilization looks low." },
          { question: "Which common interfaces provide hardware integrity and which don't?", answer: "CAN, USB, and Ethernet build in CRCs and acknowledgment/retry machinery; UART, SPI, and I2C deliver raw bytes and leave integrity to firmware." },
        ],
      },
    ],
    sources: [],
    related: ["uart-fundamentals", "can-bus", "ethernet-for-embedded"],
  },
  {
    slug: "usb-fundamentals",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "USB fundamentals",
    summary: "Host-owned scheduling, enumeration, endpoints and transfer types, speed signaling, VBUS power rules, USB-C and PD, and embedded device-side design.",
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The host owns the bus",
        body: [
          "USB is asymmetric by design: the host schedules every transfer, and devices speak only when polled. That makes device silicon simple and buses predictable, at the price of latency being whatever the host's schedule allows. Topology is a tiered star of hubs; electrically, USB 2.0 is one half-duplex differential pair (D+/D−) carrying NRZI-encoded data with bit stuffing, while USB 3.x adds separate super-speed transmit and receive pairs alongside.",
          "When a device attaches, the host detects it (a full-speed device pulls D+ high, low-speed pulls D−; high speed is negotiated afterward via a chirp handshake), resets it, assigns an address, and reads its descriptors — the self-describing data structures declaring what the device is, its endpoints, its power needs, and its class. This enumeration dance is why USB 'just works': the descriptor system plus standard device classes (CDC serial, HID input, MSC storage, audio, DFU) lets standard OS drivers bind without custom software.",
          "Communication happens through endpoints — directional FIFOs addressed by number — over four transfer types with different contracts: control (enumeration and configuration, guaranteed but slow), bulk (all leftover bandwidth, reliable, no timing promise), interrupt (small payloads with a guaranteed polling interval), and isochronous (reserved bandwidth, bounded latency, no retries — corrupted audio/video data is simply dropped, because on-time matters more than perfect).",
        ],
      },
      {
        type: "table",
        heading: "Speeds and their design demands",
        columns: ["Generation", "Rate", "What it demands"],
        rows: [
          ["Low speed", "1.5 Mbit/s", "Legacy HID only; avoid for new designs"],
          ["Full speed", "12 Mbit/s", "±0.25% data-rate accuracy — crystal or SOF-locked clock recovery"],
          ["High speed", "480 Mbit/s", "±0.05% accuracy, 90 Ω differential layout, eye-diagram compliance"],
          ["SuperSpeed (3.x)", "5–20 Gbit/s", "SerDes lanes, AC coupling, tight SI budgets, USB-C muxing"],
          ["USB4", "20–40+ Gbit/s", "Tunneling architecture; router silicon; retimers"],
        ],
      },
      {
        type: "prose",
        heading: "Power is half the specification",
        body: [
          "VBUS delivers 5 V, but entitlement is negotiated: a USB 2.0 device may draw 100 mA before configuration and up to 500 mA after the host grants its declared budget. Suspend changes everything — a suspended bus-powered device must drop to a few milliamps, and firmware must actually implement that state. Inrush is regulated too: too much capacitance charging at attach browns out the port; use soft-start or inrush limiting for large input caps.",
          "USB-C replaces the connector and adds the CC (configuration channel) wires: resistor signatures advertise default, 1.5 A, or 3 A source capability, establish plug orientation (which drives the super-speed lane mux), and carry USB Power Delivery — a packet protocol on CC that negotiates voltage/current contracts up to 240 W. A USB-C device needs its Rd pull-downs on both CC pins even if it only ever wants 5 V; the number of shipped boards that fail to power up because CC resistors are missing is enormous.",
        ],
      },
      {
        type: "prose",
        heading: "Embedded device-side realities",
        body: [
          "A device stack (vendor library, TinyUSB, or an RTOS-integrated stack) manages enumeration, endpoint FIFOs, and class logic. Descriptor bugs produce maddening OS-specific behavior — Windows caches descriptors by VID/PID, so iterate with fresh PIDs or cache-clearing during development. Clock accuracy is a hardware decision: full speed needs 0.25%, so internal RC oscillators only work on parts with clock-recovery-from-SOF trims; high speed effectively requires a crystal.",
          "Layout and protection follow from the speeds: 90 Ω differential impedance on D+/D−, length-matched, minimal stubs, ESD protection arrays with sub-picofarad capacitance at the connector, and a common-mode choke if EMC demands it. For DFU-style field update, keep the bootloader's USB path independent of the application so a bad firmware image can't remove the recovery path.",
        ],
      },
      {
        type: "callout",
        heading: "Isochronous means on-time, not intact",
        body: "Isochronous transfers reserve bus bandwidth and are never retried — a lost audio frame is gone, by design. Choosing transfer types is choosing failure semantics: bulk retries until data is perfect but has no schedule; isochronous keeps the schedule and sacrifices perfection. Map your data's real requirement to the right contract instead of defaulting to bulk everywhere.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "USB device design review",
        items: [
          "Verify clock source accuracy against the target speed (crystal, or SOF-trimmed RC where supported).",
          "Route D+/D− as a 90 Ω differential pair with ESD protection and any choke at the connector.",
          "Fit Rd on both CC pins (USB-C) and validate attach with chargers, hubs, and both plug orientations.",
          "Declare honest power descriptors; implement suspend current limits and measure them.",
          "Limit inrush at attach; test enumeration on multiple hosts and through hubs with long cables.",
          "Keep a descriptor-change discipline during development (new PID or cache clear) and a USB-independent recovery/bootloader path.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How does a host learn a device's speed at attach?", answer: "The device's pull-up location signals low or full speed (D− or D+); high speed is then negotiated by a chirp handshake during reset between device and host." },
          { question: "Why do the four transfer types exist?", answer: "They encode different contracts: control for configuration, bulk for reliable best-effort data, interrupt for bounded-latency small payloads, isochronous for reserved-bandwidth streaming without retries." },
          { question: "What do USB-C CC pins do?", answer: "Their resistor signatures establish attach, orientation, and current capability, and they carry the Power Delivery protocol for negotiating higher voltage/current contracts." },
          { question: "Why does a bus-powered design need a suspend strategy?", answer: "The specification limits suspended devices to milliamp-level draw; firmware must gate loads and enter low-power states or the device violates the spec and real hosts may power it down." },
        ],
      },
    ],
    sources: [usbIfSpec],
    related: ["choosing-a-communication-interface", "protection-esd-and-transients", "bootloaders-and-firmware-update"],
  },
  {
    slug: "pcie-fundamentals",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "PCI Express fundamentals",
    summary: "Lanes and generations, the layered packet protocol, enumeration and BARs, reference-clock architectures, link training, and the signal-integrity design rules.",
    readingTime: 17,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: [
      {
        type: "prose",
        heading: "A switched network wearing a bus's software model",
        body: [
          "PCIe replaced the shared parallel PCI bus with point-to-point serial links: each link is one or more lanes (x1, x4, x8, x16), each lane a transmit pair plus a receive pair running at multi-gigabit rates. A root complex (in the CPU/SoC) connects through optional switches to endpoints. Yet software still sees the old PCI model — configuration space, bus/device/function addressing, and memory-mapped regions — which is why decades of operating-system machinery works unchanged.",
          "The protocol is layered like a network stack. The transaction layer exchanges TLPs (memory reads/writes, configuration, messages) governed by credit-based flow control — a transmitter sends only when the receiver has advertised buffer credits, so links never drop packets under load. The data link layer adds sequence numbers, CRC, and ACK/NAK replay per hop. The physical layer scrambles, encodes (8b/10b through Gen2, 128b/130b from Gen3, PAM4 with FLIT mode at Gen6), and manages the SerDes.",
          "At boot, enumeration walks the fabric discovering functions, then sizes and assigns each function's BARs (base address registers) — carving the devices' registers and buffers into the system's physical address space. Device work is then mostly memory-mapped I/O and DMA, with MSI/MSI-X interrupts delivered as memory writes rather than wires.",
        ],
      },
      {
        type: "table",
        heading: "Generations at a glance",
        columns: ["Generation", "Rate per lane", "Encoding", "Approx. usable per lane"],
        rows: [
          ["Gen1", "2.5 GT/s", "8b/10b", "~250 MB/s"],
          ["Gen2", "5 GT/s", "8b/10b", "~500 MB/s"],
          ["Gen3", "8 GT/s", "128b/130b", "~985 MB/s"],
          ["Gen4", "16 GT/s", "128b/130b", "~1.97 GB/s"],
          ["Gen5", "32 GT/s", "128b/130b", "~3.94 GB/s"],
          ["Gen6", "64 GT/s", "PAM4 + FLIT", "~7.5 GB/s"],
        ],
      },
      {
        type: "prose",
        heading: "Clocking and reset are architecture, not details",
        body: [
          "Most systems distribute a 100 MHz reference clock (HCSL) from the root to every device — the common-clock architecture — usually with spread-spectrum modulation to tame EMI peaks. Alternatives let each end run its own reference (SRNS/SRIS), but only if both PHYs explicitly support it; pairing a spread-spectrum host with an independent-clock endpoint that lacks SRIS produces intermittent link errors that masquerade as software bugs. Decide the clock architecture first; it constrains connectors, cables, and part selection.",
          "PERST# (fundamental reset) sequencing matters: it must stay asserted until power and the reference clock are stable, and add-in devices get a defined time after release to train. Link bring-up is the LTSSM (link training and status state machine): receiver detection, bit/symbol lock, lane deskew, then speed and width negotiation upward from Gen1 x1. From Gen3 up, training includes per-lane transmitter equalization tuning. When a link comes up degraded — fewer lanes or a lower generation than designed — that is the signal-integrity smoke alarm.",
        ],
      },
      {
        type: "prose",
        heading: "Signal integrity rules the layout",
        body: [
          "Standard PCB rules: 85 Ω differential pairs; AC coupling capacitors (typically 100–220 nF) in series with every transmit pair near the transmitter; tight intra-pair length matching, while lane-to-lane skew is generous because receivers deskew in hardware. The spec's polarity inversion (per-lane P/N swap) and lane reversal (whole-link order swap) features exist specifically to let layout stay clean — use them instead of crossing pairs through vias.",
          "Above Gen3, via stubs become significant reflectors — use backdrilling, blind vias, or thin boards; loss budgets push designs toward low-loss laminates, and long channels need redrivers (analog re-amplification, protocol-blind) or retimers (full CDR re-generation, protocol-aware, required at Gen4+ for most long paths). Power management adds its own trap: L1 substates park the link for microwatts with CLKREQ# handshaking, and misconfigured ASPM is a classic source of dropped links and latency spikes.",
        ],
      },
      {
        type: "callout",
        heading: "Embedded PCIe debugging starts at the LTSSM",
        body: "When a device doesn't appear, resist the software rabbit hole. Check in order: power and PERST# timing, reference clock present and of the right architecture, LTSSM state (most SoCs expose it), negotiated width/speed versus design, then and only then enumeration and drivers. A link training at x1 instead of x4, or Gen1 instead of Gen3, is a hardware finding, not a driver quirk.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "PCIe design review",
        items: [
          "Define the reference-clock architecture (common clock vs SRIS/SRNS) and verify every device supports it, including SSC.",
          "Sequence PERST# against power and clock stability with the spec's timing margins.",
          "Place AC coupling caps on TX pairs near the transmitter; verify which end owns them for each link segment.",
          "Route 85 Ω pairs with intra-pair matching; exploit polarity inversion and lane reversal before resorting to ugly routing.",
          "Mitigate via stubs (backdrill/blind) and check total channel loss at the target generation; plan retimers for long paths.",
          "Expose LTSSM state and lane status for bring-up; record negotiated width/speed as a manufacturing test criterion.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does PCIe never drop packets under congestion?", answer: "Credit-based flow control: transmitters send TLPs only against advertised receiver buffer credits, and the data link layer replays on CRC failure per hop." },
          { question: "What are BARs?", answer: "Base address registers that declare how much address space a function needs; enumeration software sizes them and maps the device's registers and buffers into system physical memory." },
          { question: "Why do polarity inversion and lane reversal exist?", answer: "So layouts can avoid pair crossings and awkward pinouts — receivers automatically correct per-lane P/N swaps and reversed lane ordering during training." },
          { question: "What's the difference between a redriver and a retimer?", answer: "A redriver is an analog amplifier/equalizer that boosts the signal but passes jitter; a retimer recovers the clock and retransmits clean data, participating in the protocol — necessary as jitter budgets shrink at Gen4+." },
        ],
      },
    ],
    sources: [pciSig],
    related: ["pcb-materials-and-impedance", "return-paths-and-stackup", "choosing-a-communication-interface"],
  },
  {
    slug: "debug-interfaces-jtag-swd",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "JTAG, SWD & debug interfaces",
    summary: "Boundary scan origins, the TAP state machine, SWD and the ARM debug port, trace options, design-in rules, and production programming and security.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reference",
    blocks: [
      {
        type: "prose",
        heading: "Two protocols, one job",
        body: [
          "JTAG (IEEE 1149.1) began as boundary scan: every pin of a compliant chip has a shift-register cell, so a tester can serially read and drive pins to verify solder joints without probes — still its killer feature in manufacturing. The interface is four or five wires (TCK, TMS, TDI, TDO, optional TRST) driving a 16-state TAP controller; devices chain TDI→TDO, so one header reaches every chip in the chain. Debug access for CPUs was layered onto this scan machinery.",
          "SWD (Serial Wire Debug) is ARM's two-wire replacement: SWDIO and SWCLK carry a packet protocol with start bits, parity, and ACKs into the Debug Access Port. The DAP splits into a debug port (DP) and access ports (APs); the MEM-AP performs memory-bus transactions, which is the profound part — a debugger can read and write memory, peripherals, and core debug registers while the CPU runs, without stopping it. Halting, breakpoints, watchpoints, flash programming, and RTOS-aware views are all built on that primitive. On most Cortex-M parts the same two pins can also switch to JTAG; SWD wins on pin count and gains SWO.",
          "SWO (Serial Wire Output) is a one-pin trace channel carrying ITM data — printf-style instrumentation with hardware timestamps and near-zero intrusion — plus PC sampling and exception trace. Full instruction trace (ETM) needs a parallel trace port or an on-chip buffer and a heavier probe, but when a bug depends on execution history, it is irreplaceable.",
        ],
      },
      {
        type: "table",
        heading: "Signals and connectors",
        columns: ["Interface", "Signals", "Common connector"],
        rows: [
          ["JTAG", "TCK, TMS, TDI, TDO (+TRST, +RESET)", "ARM 20-pin 0.1″ legacy, 10-pin 0.05″ Cortex"],
          ["SWD", "SWDIO, SWCLK (+RESET)", "10-pin 0.05″ Cortex Debug"],
          ["SWD + trace", "SWD + SWO", "Same 10-pin (SWO on pin 6)"],
          ["ETM trace", "SWD/JTAG + TRACECLK + 4 data", "20-pin 0.05″ Cortex Debug+ETM"],
          ["Always include", "VTref (target voltage sense), GND", "Probes level-shift from VTref"],
        ],
      },
      {
        type: "prose",
        heading: "Design it in, or fight every board forever",
        body: [
          "Debug access is a hardware feature you either design in or wish you had. Keep the debug pins dedicated where at all possible; if they must be reused as GPIO, the firmware that reassigns them can lock you out — which is why probes support connect-under-reset (halting the core before user code runs). Wire the reset line to the debug connector precisely so that rescue path exists. Follow vendor pull guidance (SWDIO and TMS typically pulled up, TCK defined), keep the traces short and away from noisy nets, and always provide VTref and solid ground pins.",
          "Low-power modes are the chronic annoyance: deep sleep can gate the clocks the debug logic needs, dropping the session mid-step. Most vendors provide a debug-in-sleep enable bit — turn it on in development builds and off for production power budgets. For production, decide early how boards get programmed (the debug connector, test-point bed-of-nails, or pre-programmed parts) and how firmware images get into the factory flow.",
          "Security closes the loop: readout protection prevents cloning but must be paired with a recovery plan (usually mass-erase regression) and a factory procedure. Modern parts add debug authentication — cryptographic unlock rather than a fuse — and lifecycle states. Locking a device you cannot unlock, on a board without another programming path, converts inventory into paperweights; treat protection settings as release-controlled configuration with a tested escape hatch.",
        ],
      },
      {
        type: "callout",
        heading: "The debugger is part of the system under test",
        body: "A probe holds pull-ups, injects clock edges, keeps regions of the chip awake, and masks watchdog and low-power behavior. Bugs that vanish when the debugger attaches (or only appear then) are common. Always test release candidates standalone, from a cold power-on, with the probe unplugged.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Debug design review",
        items: [
          "Put a standard debug connector (or documented test points) on every board revision, including production.",
          "Wire reset to the connector and verify connect-under-reset actually rescues a lockout.",
          "Provide VTref, ground, and vendor-recommended pulls; keep debug traces short and quiet.",
          "Enable debug-in-low-power in development; measure its current cost before shipping it enabled.",
          "Route SWO if pins allow — ITM tracing is the cheapest observability you can add.",
          "Define production programming, readout protection, and the recovery/unlock procedure as one tested workflow.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What was JTAG originally for?", answer: "Boundary scan — serially reading and driving pin states through per-pin scan cells to test solder connectivity on assembled boards without physical probes." },
          { question: "What makes SWD's MEM-AP powerful?", answer: "It performs real memory-bus transactions independent of the core, so a debugger can inspect and modify memory and peripherals while the CPU keeps running." },
          { question: "When do you need connect-under-reset?", answer: "When firmware reconfigures or disables debug pins, crashes early, or enters deep sleep immediately — the probe halts the core at reset before that code executes." },
          { question: "What does SWO give you over a UART debug print?", answer: "Hardware-timestamped, low-intrusion instrumentation through the debug port with no UART peripheral or pins consumed, plus PC sampling and exception trace." },
        ],
      },
    ],
    sources: [armAdi],
    related: ["interrupts-and-isr-design", "observability-for-devices", "dfm-dfa-and-testability"],
  },
];
