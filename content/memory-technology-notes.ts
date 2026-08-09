import type { Note, Source } from "./library";

const jedecDdr5: Source = {
  title: "JESD79-5 — DDR5 SDRAM Standard",
  publisher: "JEDEC Solid State Technology Association",
  url: "https://www.jedec.org/standards-documents/docs/jesd79-5c",
  kind: "Reference",
};

const jedecHbm: Source = {
  title: "JESD235 — High Bandwidth Memory (HBM) DRAM Standard",
  publisher: "JEDEC Solid State Technology Association",
  url: "https://www.jedec.org/standards-documents/docs/jesd235a",
  kind: "Reference",
};

const micronTech: Source = {
  title: "DRAM technical notes and datasheets (DDR4/DDR5/GDDR6/HBM)",
  publisher: "Micron Technology",
  url: "https://www.micron.com/products/dram",
  kind: "Documentation",
};

const rowhammerPaper: Source = {
  title: "Flipping Bits in Memory Without Accessing Them (RowHammer)",
  publisher: "Kim et al., ISCA 2014",
  url: "https://users.ece.cmu.edu/~yoonguk/papers/kim-isca14.pdf",
  kind: "Reference",
};

export const memoryTechnologyNotes: Note[] = [
  {
    slug: "ddr-generations-lpddr-gddr-hbm",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "DDR generations, LPDDR, GDDR & HBM",
    summary: "Double data rate and the prefetch architecture that scales bandwidth over a slow core, what each DDR generation changed (bank groups, POD, on-die ECC, subchannels, DFE), and the graphics/mobile/stacked branches — LPDDR, GDDR6/6X with PAM4, and HBM's wide-and-slow interposer strategy.",
    readingTime: 19,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "One slow core, many fast interfaces",
        body: [
          "Every DRAM generation shares an awkward secret: the storage core — the arrays, sense amplifiers, and their analog timing — has barely sped up in twenty years, for the same physics reasons that keep column latency near 13–15 ns. All of the spectacular bandwidth growth from SDR to DDR5, GDDR7, and HBM comes from engineering around the slow core: transferring on both clock edges (the double data rate itself), fetching wider and wider slices of the core per access and streaming them out fast (prefetch), adding more independent banks to overlap accesses, and driving the interface pins ever faster with better signaling and equalization. Understanding any modern memory device means holding this split in mind — a slow, wide core behind a fast, narrow interface, with the prefetch buffer as the gearbox between them.",
          "The prefetch number is the gear ratio. DDR1 fetched 2 bits per data pin per core access (2n prefetch), DDR2 fetched 4n, DDR3 and DDR4 fetch 8n — which is exactly why their minimum burst length is 8 — and DDR5 fetches 16n with burst length 16. Each doubling lets the interface run twice as fast as before against the same core speed. The burst length in turn ties to the cache line: DDR4's BL8 on a 64-bit channel moves 64 bytes; DDR5 doubles the burst but halves the channel to two independent 32-bit subchannels, so BL16 × 32 bits is still exactly one 64-byte line per subchannel — the standard bending itself around the cache line yet again.",
        ],
      },
      {
        type: "formula",
        heading: "The prefetch gearbox",
        formula: "interface rate ≈ core column rate × prefetch n      DDR4: ~200 MHz core × 8n → 3200 MT/s      DDR5: × 16n → 6400+ MT/s      burst bytes = BL × channel width / 8",
        explanation: "Prefetch decouples interface speed from core speed: each internal column access fetches n bits per DQ pin into a buffer, which the interface streams out at n times the core rate (two transfers per clock). The core column cadence has sat near 200 MHz for generations, so doubling prefetch is what doubled the headline transfer rate each generation. The burst-bytes arithmetic shows why architectures co-evolve with the cache line: 8 × 64/8 = 64 B for DDR4, and 16 × 32/8 = 64 B per DDR5 subchannel — both deliver exactly one cache line per read.",
        terms: [
          { symbol: "prefetch n", meaning: "Bits fetched per DQ pin per core access", unit: "2/4/8/16" },
          { symbol: "BL", meaning: "Burst length (transfers per column command)", unit: "8 or 16" },
          { symbol: "MT/s", meaning: "Interface transfers per second", unit: "—" },
        ],
      },
      {
        type: "table",
        heading: "What each DDR generation changed",
        columns: ["Generation", "Typical rates", "VDD/VDDQ", "Key architectural changes"],
        rows: [
          ["DDR3", "800–2133 MT/s", "1.5 V (1.35 L)", "8n prefetch, fly-by topology + write leveling, 8 banks"],
          ["DDR4", "1600–3200 MT/s", "1.2 V", "Bank groups (tCCD_S/_L), POD signaling, internal VrefDQ + training, write CRC, DBI, 16 banks"],
          ["DDR5", "3200–8400+ MT/s", "1.1 V", "Two independent 32-bit subchannels/DIMM, 16n prefetch BL16, on-die ECC, DFE receivers, PMIC on module, 32 banks, same-bank refresh"],
          ["LPDDR5/5X", "up to 8533 MT/s", "~1.05/0.5 V", "Mobile: deep power states, per-bank refresh, WCK forwarded clock, dynamic voltage-frequency scaling"],
          ["GDDR6 / 6X", "14–24 Gb/s/pin", "1.35 V", "Point-to-point on-board channels, x16/x32 devices, two channels per chip; 6X adds PAM4 (2 bits/symbol)"],
          ["HBM2e / HBM3", "3.6–6.4 Gb/s/pin", "1.2/1.1 V", "3D die stacks on interposer, 1024-bit interface, TSVs, ECC and repair built in"],
        ],
      },
      {
        type: "prose",
        heading: "DDR4 and DDR5: the changes that matter in practice",
        body: [
          "DDR4's structural additions are the ones a practitioner touches daily. Bank groups partition the banks so that consecutive column commands to different groups can issue at the short tCCD_S while same-group commands need tCCD_L — a constraint that address mapping and scheduling actively dodge. Pseudo-open-drain (POD) signaling terminates the DQ bus to VDDQ, so driving high costs no current and DBI (data bus inversion) inverts a byte when it would carry mostly zeros, cutting both switching power and simultaneous-switching noise. The voltage reference for the data receivers moved on-die (internal VrefDQ) and became a trained parameter rather than a board rail — the beginning of the modern era in which the interface's operating point is found by search, not set by design. Write CRC added optional link-level error detection on writes.",
          "DDR5 pushes the same directions harder. Each DIMM becomes two independent 32-bit (40-bit with ECC) subchannels, doubling the concurrency per module and shortening each channel's effective load. Prefetch goes to 16n with BL16. On-die ECC silently corrects single-bit errors inside the device — protecting density scaling, but emphatically not a substitute for system-level ECC, since it cannot see bus errors and reports nothing to the host. Receivers gain decision feedback equalization (DFE) to fight inter-symbol interference at 6400+ MT/s, power management moves onto the DIMM as a PMIC (changing board power architecture and bring-up sequencing), and refresh gains a same-bank mode that refreshes one bank per group while others keep serving. Each of these is simultaneously a performance feature and a new validation surface: trained Vref and DFE taps drift, subchannels double the training state, and on-die ECC can mask marginality that then appears only as a cliff.",
        ],
      },
      {
        type: "prose",
        heading: "The branches: LPDDR for power, GDDR for per-pin speed",
        body: [
          "LPDDR optimizes the same core for battery and thermals: lower voltages, aggressive power states (deep sleep, partial-array self-refresh that retains only used banks), per-bank refresh so the whole device never stalls at once, temperature-compensated refresh driven by an on-die sensor, and in LPDDR5 a forwarded WCK clock architecture and dynamic voltage-frequency scaling so the interface can downshift with the workload. It ships point-to-point, soldered close to the SoC (or on-package), which shortens channels and enables the speed at low power. The cost is capacity and expandability — no DIMMs, no ranks to add.",
          "GDDR optimizes for raw per-pin bandwidth to feed GPUs. The channels are short, point-to-point, and carefully length-matched on the board — no DIMM connectors, no multi-drop, every device a few centimetres from the processor — which is what allows 14–16 Gb/s per pin in GDDR6 with conventional NRZ signaling. Devices are wide (x16/x32, organized as two independent channels per chip) and surround the GPU package on the board. GDDR6X breaks the NRZ ceiling with PAM4 signaling — four voltage levels encode two bits per symbol, doubling data rate per unit of bandwidth at the cost of one-third the voltage margin per eye and three stacked eyes to validate instead of one; GDDR7 moves to PAM3. PAM signaling drags memory validation into SerDes territory: multi-level eye diagrams, symbol error statistics, and heavier equalization.",
        ],
      },
      {
        type: "prose",
        heading: "HBM: wide and slow, stacked and close",
        body: [
          "High Bandwidth Memory takes the opposite wager to GDDR: instead of driving few pins very fast, drive an enormous number of pins moderately fast, very close. An HBM stack is four to twelve DRAM dies stacked vertically, connected through the stack by through-silicon vias (TSVs) and microbumps, sitting millimetres from the processor on a silicon interposer — a passive silicon substrate whose lithographically fine wiring makes a 1024-bit-wide interface routable where a PCB never could. At 3.6–6.4 Gb/s per pin across 1024 pins, one stack delivers roughly 460 GB/s (HBM2e) to 800+ GB/s (HBM3), and several stacks surround a large accelerator die for terabytes per second of aggregate bandwidth at a fraction of GDDR's energy per bit — the short, low-capacitance channel is inherently cheaper to drive.",
          "The trade is cost and integration: interposers, TSV yield, known-good-stack testing, and advanced packaging make HBM expensive per gigabyte, which is why it appears where bandwidth per watt is the binding constraint — AI accelerators, HPC, high-end networking — while GDDR serves cost-sensitive graphics and DDR/LPDDR serve capacity and generality. Validation changes character too: the channel is inside the package, so there is no probing a trace with a scope — bring-up leans on the PHY's built-in eye-measurement and loopback instrumentation, on IEEE 1500-style per-stack test access, and on the built-in ECC and lane-repair machinery the standard provides. The system-level thinking is the same; the physical access disappears.",
        ],
      },
      {
        type: "table",
        heading: "Bandwidth strategy comparison",
        columns: ["Technology", "Strategy", "Width × per-pin rate", "Connection", "Natural home"],
        rows: [
          ["DDR5", "Balanced, expandable", "64 bit × ~6.4 Gb/s ≈ 51 GB/s/DIMM", "DIMM slots, multi-rank", "Servers, desktops — capacity"],
          ["LPDDR5X", "Low energy, near", "x16/x32 ch × ~8.5 Gb/s", "Soldered / on-package", "Mobile, laptops, embedded"],
          ["GDDR6X", "Few pins, very fast", "32 bit × 19–24 Gb/s (PAM4)", "Point-to-point on board", "GPUs — bandwidth per dollar"],
          ["HBM3", "Many pins, close", "1024 bit × ~6.4 Gb/s ≈ 800 GB/s/stack", "Silicon interposer", "Accelerators — bandwidth per watt"],
        ],
      },
      {
        type: "callout",
        heading: "Every bandwidth feature is a validation surface",
        body: "Prefetch and burst define the transfer atoms; bank groups add timing classes; POD, DBI, PAM4, and DFE change the electrical eye; on-die ECC masks device marginality; subchannels and stacks multiply trained state. Each generation's headline feature is also the thing its bring-up must newly train, margin, and stress — read a new standard first as a list of things that can now drift or fail.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Technology review",
        items: [
          "Explain prefetch as the gearbox between a ~fixed-speed core and a doubling interface; tie BL to the 64 B cache line.",
          "Name each generation's structural changes (bank groups, POD/DBI, subchannels, 16n, on-die ECC, DFE, PMIC).",
          "Distinguish on-die ECC (internal, silent) from system ECC (bus-visible, reporting).",
          "Place LPDDR (energy), GDDR (per-pin rate, PAM4), and HBM (width on interposer) on the bandwidth-strategy map.",
          "Know the connection topology each assumes — DIMM multi-drop, soldered point-to-point, interposer — and its SI consequences.",
          "For in-package memory, plan validation around PHY instrumentation and built-in test, not board probing.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does burst length track prefetch, and how do both DDR4 and DDR5 deliver a 64-byte line?", answer: "Prefetch fetches n bits per pin per core access, so the minimum burst equals n. DDR4: BL8 × 64-bit channel = 64 B. DDR5: BL16 × 32-bit subchannel = 64 B — the standard reorganized itself (two subchannels) to keep the burst equal to one cache line." },
          { question: "What did DDR5 change beyond speed?", answer: "Two independent 32-bit subchannels per DIMM, 16n prefetch/BL16, on-die ECC, DFE in the data receivers, a PMIC on the module, 32 banks, and same-bank refresh — each also a new training/validation surface." },
          { question: "Contrast the GDDR and HBM bandwidth strategies.", answer: "GDDR: few pins driven extremely fast (19–24 Gb/s with PAM4) over short matched board traces — bandwidth per dollar. HBM: 1024 pins driven moderately fast, stacked dies on a silicon interposer millimetres from the processor — bandwidth per watt, at higher packaging cost." },
          { question: "What does PAM4 buy and cost?", answer: "Four amplitude levels encode 2 bits per symbol, doubling data rate in the same bandwidth; the cost is ~one-third the voltage margin per eye, three stacked eyes to close, tighter noise budgets, and SerDes-style equalization and error statistics in validation." },
        ],
      },
    ],
    sources: [jedecDdr5, jedecHbm, micronTech],
    related: ["dram-timing-and-commands", "ddr-interface-signaling-and-training", "high-speed-signal-integrity", "memory-reliability-ecc-and-rowhammer"],
  },
  {
    slug: "memory-reliability-ecc-and-rowhammer",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "Memory reliability, ECC & RowHammer",
    summary: "The error taxonomy (soft vs hard, retention and VRT), the layered defenses — on-die ECC, side-band SEC-DED, chipkill, link CRC, scrubbing, post-package repair — the Hamming arithmetic behind 72-bit DIMMs, and RowHammer as the emblem of scaling-driven reliability loss.",
    readingTime: 18,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Errors have kinds, and the kind names the fix",
        body: [
          "Memory errors divide first into soft and hard. A soft error is transient: a particle strike (cosmic-ray neutron or alpha from packaging), a marginal retention cell crossing threshold, coupling noise — the bit is wrong but the cell is fine, and rewriting it clears the fault. A hard error is permanent: a stuck-at cell, a failed sense amplifier, a broken via — it repeats at the same location and survives rewrites. The distinction is the first branch of every memory-failure investigation, because the remedies differ completely: soft errors are absorbed by ECC and scrubbing as a statistical matter; hard errors demand repair (spare rows, post-package repair) or replacement, and a rising hard-error rate is a manufacturing or degradation signal.",
          "Retention sits between the two. Every DRAM cell leaks toward oblivion and is rescued by refresh; the retention time of the population is a broad distribution whose weak tail defines the refresh spec, and it moves with temperature — roughly halving every ~10 °C, which is why refresh rate doubles above 85 °C. Worse, some cells show variable retention time (VRT): they switch unpredictably between strong and weak states, so a cell that passed every test can later fail intermittently at one temperature and pass at another. VRT is why retention screening is statistical, why on-die ECC became necessary as cells shrank, and why an intermittent single-bit failure that wanders with temperature should suggest retention before anything else.",
        ],
      },
      {
        type: "formula",
        heading: "The Hamming arithmetic behind the 72-bit DIMM",
        formula: "SEC needs 2^r ≥ m + r + 1 → r = 7 for m = 64      +1 parity bit for DED → (72, 64) SEC-DED",
        explanation: "A single-error-correcting Hamming code over m data bits needs r check bits such that the 2^r syndromes can name every bit position plus the no-error case: for 64 data bits, 7 check bits suffice (2^7 = 128 ≥ 64+7+1 = 72). Adding one overall parity bit upgrades the code to detect (but not correct) double errors — SEC-DED. That is exactly why ECC DIMMs are 72 bits wide for 64 data bits: one extra x8 chip carries the 8 check bits, correction of any single-bit error and detection of any double-bit error, at 12.5% overhead. The syndrome computed on every read either is zero (clean), names the flipped bit (correct it), or signals an uncorrectable pattern (report and contain).",
        terms: [
          { symbol: "m / r", meaning: "Data bits / check bits", unit: "64 / 8" },
          { symbol: "SEC-DED", meaning: "Single-error correct, double-error detect", unit: "—" },
          { symbol: "syndrome", meaning: "Check result naming the error position", unit: "—" },
        ],
      },
      {
        type: "table",
        heading: "The layered defenses",
        columns: ["Layer", "Where it lives", "What it catches", "What it cannot do"],
        rows: [
          ["On-die ECC (DDR5)", "Inside each DRAM chip", "Single-bit cell errors before data leaves the die", "Invisible to host; no bus protection; masks marginality"],
          ["Side-band SEC-DED", "Controller + extra DRAM chip (72/64)", "Any single-bit error end-to-end; detects doubles", "Multi-bit bursts; whole-chip failure"],
          ["Chipkill / SDDC", "Controller, symbol-based code across chips", "Complete failure of one DRAM device", "Higher overhead/latency; needs wide layout"],
          ["Link CRC (DDR4/5 write CRC, DDR5 read)", "On the bus transaction", "Transmission errors on the channel", "Cell errors at rest; adds latency when enabled"],
          ["Patrol scrubbing", "Controller background engine", "Latent soft errors before they pair into doubles", "Nothing about hard faults; consumes bandwidth"],
          ["PPR / sparing", "DRAM fuses + spare rows", "Permanent repair of a failed row (hard/soft PPR)", "Limited spares; per-bank granularity"],
        ],
      },
      {
        type: "prose",
        heading: "Reading the stack as a system",
        body: [
          "The layers compose into a strategy: on-die ECC keeps shrinking cells shippable by absorbing their rising intrinsic error rate; side-band SEC-DED gives the host end-to-end correction and — critically — visibility, since corrected-error counts logged per location are the early-warning telemetry that predicts failures; chipkill-class codes extend correction to a dead device for servers that cannot tolerate a single-chip loss; link CRC covers the increasingly marginal bus itself; scrubbing sweeps memory in the background so single-bit soft errors are corrected before a second error in the same word makes them uncorrectable; and post-package repair lets a failed row be permanently fused out to a spare in the field. Each layer has a blind spot the next covers, and system design chooses how far up the stack a product climbs based on its tolerance for silent corruption versus its cost budget.",
          "Two traps deserve emphasis. First, on-die ECC is not system ECC: it corrects silently inside the chip, reports nothing, and protects nothing between chip and controller — a DDR5 system without side-band ECC is still an unprotected system in the way that matters. Second, ECC changes what validation observes: a marginal device behind ECC looks perfect until the error rate crosses the correction capacity, then fails as a cliff rather than a slope. Serious validation therefore reads the corrected-error counters (and injects errors to prove the detection, correction, logging, and reporting paths actually work) rather than trusting the absence of visible failures.",
        ],
      },
      {
        type: "prose",
        heading: "RowHammer: disturbance as a scaling symptom",
        body: [
          "RowHammer is the canonical demonstration that DRAM scaling turned reliability into security. Repeatedly activating (opening and closing) one row — the aggressor — disturbs physically adjacent victim rows through charge leakage and coupling effects, and with enough activations inside one refresh interval, victim cells flip without ever being addressed. When characterized on real DDR3 modules (Kim et al., ISCA 2014), on the order of 139,000 activations could flip bits; on modern denser parts the threshold has fallen by an order of magnitude — tens of thousands down to below ten thousand — because closer, smaller cells disturb more easily. The effect is exploitable: attacks have flipped page-table bits from JavaScript, escalated privilege, and crossed VM boundaries, all with nothing but memory reads in the attacker's own space.",
          "Mitigations layer like the ECC stack, and each has been probed. Target Row Refresh (TRR) — the DRAM internally tracking hot rows and refreshing their neighbours — was bypassed by many-sided hammering patterns that overflow its tracker. Doubling the refresh rate raises the threshold but costs bandwidth and power and is not sufficient alone. DDR5 formalizes the defence: refresh management (RFM) commands, with rolling activation counters (RAA) per bank that oblige the controller to issue extra targeted refreshes when activation counts cross thresholds — making hammer-awareness part of the controller/DRAM contract rather than a hidden vendor heuristic. ECC helps but does not close it (multi-bit flips occur). For a validation engineer, RowHammer defines a stress class: deliberate aggressor patterns (single-, double-, and many-sided) run against every row while checking victims — plus verification that the mitigation machinery itself engages and does not destroy performance when it does.",
        ],
      },
      {
        type: "callout",
        heading: "Prove the protection, not just the memory",
        body: "ECC that has never been tested with injected errors is a hope, not a defense: validation must confirm that single-bit errors correct, double-bit errors detect and report, counters log the right location, and the system's response (interrupt, poisoning, page retirement) actually fires. Likewise hammer mitigations must be provoked deliberately. A protection path that fails silently is worse than none, because it converts detectable corruption into silent corruption.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Reliability review",
        items: [
          "Classify failures soft vs hard first; rewrite-and-retest separates them.",
          "Treat wandering, temperature-sensitive single-bit errors as retention/VRT suspects.",
          "Do the Hamming arithmetic: 8 check bits per 64 data bits → the 72-bit ECC DIMM.",
          "Layer the defenses deliberately: on-die ECC, side-band SEC-DED, chipkill, link CRC, scrubbing, PPR.",
          "Never equate on-die ECC with system ECC; read corrected-error telemetry, don't wait for cliffs.",
          "Include hammer stress (multi-sided patterns) and mitigation verification in any validation plan.",
          "Inject errors to prove the detect/correct/log/report chain end to end.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why are ECC DIMMs 72 bits wide?", answer: "SEC over 64 data bits needs 7 check bits (2^7 ≥ 64+7+1); one more parity bit adds double-error detection — a (72,64) SEC-DED code, carried by one extra x8 chip at 12.5% overhead." },
          { question: "What is the difference between on-die ECC and system ECC?", answer: "On-die ECC corrects single-bit errors inside the DRAM chip, silently, with no host visibility and no bus coverage — it exists to keep shrinking cells shippable. System (side-band) ECC protects end-to-end across the channel and reports corrected errors, enabling telemetry and containment. DDR5's on-die ECC does not make a system 'ECC protected.'" },
          { question: "Explain RowHammer and why it worsens with scaling.", answer: "Rapidly activating an aggressor row disturbs adjacent victim rows until bits flip without being accessed — charge leakage/coupling amplified as cells shrink and pack closer. Thresholds fell from ~139k activations (2014) by an order of magnitude; mitigations are TRR (bypassable), extra refresh, and DDR5's RFM/RAA counter machinery." },
          { question: "Why must validation inject errors into ECC?", answer: "ECC masks marginality — a failing device looks perfect until correction capacity is exceeded, then fails as a cliff. Injection proves correction, detection, logging, and system response actually work, and corrected-error counters become the early-warning signal instead of silent masking." },
        ],
      },
    ],
    sources: [rowhammerPaper, jedecDdr5, micronTech],
    related: ["dram-fundamentals-and-organization", "ddr-generations-lpddr-gddr-hbm", "memory-validation-and-margining", "watchdogs-faults-and-recovery"],
  },
];
