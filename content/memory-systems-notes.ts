import type { Note, Source } from "./library";

const mutluDdca: Source = {
  title: "Digital Design and Computer Architecture — Lecture Series",
  publisher: "Onur Mutlu, ETH Zürich (SAFARI)",
  url: "https://safari.ethz.ch/ddca/",
  kind: "Course",
};

const jacobMemorySystems: Source = {
  title: "Memory Systems: Cache, DRAM, Disk",
  publisher: "Jacob, Ng & Wang, Morgan Kaufmann",
  url: "https://www.sciencedirect.com/book/9780123797513/memory-systems",
  kind: "Book",
};

const hennessyPatterson: Source = {
  title: "Computer Architecture: A Quantitative Approach",
  publisher: "Hennessy & Patterson, Morgan Kaufmann",
  url: "https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-811905-1",
  kind: "Book",
};

const jedecDdr4: Source = {
  title: "JESD79-4 — DDR4 SDRAM Standard",
  publisher: "JEDEC Solid State Technology Association",
  url: "https://www.jedec.org/standards-documents/docs/jesd79-4a",
  kind: "Reference",
};

export const memorySystemsNotes: Note[] = [
  {
    slug: "memory-hierarchy-and-caches",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "Memory hierarchy & caches",
    summary: "Why memory is a hierarchy, SRAM vs DRAM, locality, cache organization (tag/index/offset, associativity, replacement, write policies), the 3C miss taxonomy, AMAT, and the non-blocking machinery (MSHRs, MLP) that turns misses into the DRAM traffic a controller must schedule.",
    readingTime: 18,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The hierarchy exists because ideal memory is impossible",
        body: [
          "The memory a processor wants — zero latency, infinite capacity, infinite bandwidth, negligible cost — cannot be built, because the physical trade-offs oppose each other: bigger memories are slower (longer wires, larger decoders), faster memories cost more per bit, and higher bandwidth demands more ports, banks, pins, and power. The engineering answer is a hierarchy: a small, fast level close to the processor backed by successively larger, slower, cheaper levels, arranged so that most accesses are served by the fast levels and only a shrinking residue reaches main memory. The design bet underneath the whole structure is locality: temporal locality (recently used data will be used again) and spatial locality (data near recently used data will be used soon), which real programs exhibit because of loops, sequential instruction fetch, array traversal, and data-structure reuse.",
          "For anyone working on the memory subsystem itself, the hierarchy matters for a second reason: the caches are the filter that shapes DRAM traffic. What arrives at the memory controller is not the program's access stream but its cache-miss stream — block-granularity (typically 64-byte) reads and writebacks whose spatial and temporal structure is what the controller's scheduling and the DRAM's row-buffer locality then exploit. Understanding the cache machinery is understanding where the DRAM workload comes from.",
        ],
      },
      {
        type: "table",
        heading: "SRAM vs DRAM: the two technologies of the hierarchy",
        columns: ["Property", "SRAM", "DRAM"],
        rows: [
          ["Storage element", "Cross-coupled inverters (6 transistors/bit)", "1 transistor + 1 capacitor (1T1C)"],
          ["Speed", "Fast (sub-ns to a few ns)", "Slower (tens of ns to the array)"],
          ["Density / cost", "Low density, expensive per bit", "High density, cheap per bit"],
          ["Refresh", "None — static while powered", "Required — charge leaks (typ. 64 ms window)"],
          ["Read behaviour", "Non-destructive", "Destructive — must restore after sensing"],
          ["Process", "Logic-compatible (on-die caches)", "Specialized DRAM process (separate chips)"],
          ["Role", "Registers, caches, buffers", "Main memory"],
        ],
      },
      {
        type: "prose",
        heading: "Cache organization: where a block can live",
        body: [
          "A cache stores fixed-size blocks (lines), and its organization answers one question: given an address, where may its block be placed? The address splits into three fields. The block offset selects the byte within a block; the set index selects which set of the cache the block maps to; the tag is the remainder, stored alongside the data and compared on every access to determine hit or miss. A direct-mapped cache has one location per set — simple and fast, but two hot addresses mapping to the same set evict each other endlessly (conflict misses). A set-associative cache provides several ways per set, so a block can occupy any way in its set — fewer conflicts at the cost of comparing more tags and a wider mux. Fully associative (any block anywhere) is reserved for small structures like TLBs, where the flexibility justifies comparing every tag.",
          "Associativity is a diminishing-returns lever: going from direct-mapped to 2-way and 4-way removes most conflict misses, while each further doubling buys less and costs hit latency and energy — which is why latency-critical L1 caches stay at modest associativity while larger, slower L2/L3 caches go higher. When all ways of a set are valid, a replacement policy chooses the victim: true LRU is exact but expensive to track beyond a few ways, so real caches use approximations (tree pseudo-LRU, not-most-recently-used), and modern last-level caches use insertion/promotion policies that resist scans and thrashing where naive LRU fails — a cyclic access pattern one block larger than the set defeats LRU completely.",
        ],
      },
      {
        type: "formula",
        heading: "Address decomposition and average access time",
        formula: "offset = log₂(block size)   index = log₂(sets)   sets = capacity/(block × ways)      AMAT = t_hit + miss_rate × miss_penalty",
        explanation: "The field widths follow directly from the geometry: a 32 KiB, 8-way cache with 64-byte blocks has 32768/(64×8) = 64 sets, so 6 offset bits, 6 index bits, and the rest tag. Average memory access time composes recursively — the miss penalty of one level is the AMAT of the level below it — which is how a three-level hierarchy's effective latency is computed from per-level hit times and local miss rates. The formula also exposes the design tension: enlarging a cache lowers miss rate but raises hit time, and the product decides whether the change actually helped.",
        terms: [
          { symbol: "AMAT", meaning: "Average memory access time", unit: "cycles or ns" },
          { symbol: "t_hit", meaning: "Hit time of this level", unit: "cycles or ns" },
          { symbol: "miss_penalty", meaning: "AMAT of the next level down", unit: "cycles or ns" },
        ],
      },
      {
        type: "prose",
        heading: "Write policies and the miss taxonomy",
        body: [
          "Writes force two decisions. Write-through sends every store to the next level immediately — simple, and the lower level is always current, but bandwidth-hungry. Write-back marks the cached block dirty and writes it down only on eviction — this coalesces repeated stores and saves enormous bandwidth, at the cost of a dirty bit and more complex eviction (and it is why the DRAM controller sees bursts of writeback traffic when dirty blocks are displaced). Orthogonally, write-allocate fetches the block into the cache on a write miss (capturing later locality), while no-write-allocate writes around the cache — the usual pairings are write-back with allocate and write-through without.",
          "Misses classify into the 3 Cs, and the classification tells you which lever helps. Compulsory misses are first-ever accesses — no cache size fixes them; prefetching hides them. Capacity misses occur because the working set exceeds the cache — bigger cache or software blocking/tiling helps. Conflict misses come from placement restriction — more associativity, victim caches, or better index hashing help. The taxonomy is a diagnostic instrument: measured miss patterns point at the mechanism, exactly the way a failure signature points at a fault domain in hardware debug.",
        ],
      },
      {
        type: "prose",
        heading: "Non-blocking caches, MSHRs, and memory-level parallelism",
        body: [
          "A blocking cache stalls on a miss until data returns — intolerable when a main-memory access costs hundreds of cycles. Non-blocking (lockup-free) caches continue serving hits and issue further misses while earlier ones are outstanding, tracked by Miss Status Handling Registers (MSHRs): each MSHR records the outstanding block address, which sub-words are wanted, and which loads or stores wait on it, so a second miss to the same block merges into the existing entry rather than duplicating the request. The number of MSHRs bounds how many misses can be in flight — when they are exhausted, the cache stalls after all.",
          "This is the machinery behind memory-level parallelism (MLP): overlapping multiple DRAM accesses so their latencies amortize. An isolated miss costs its full latency on the critical path; ten overlapped misses cost little more than one. This is why miss count alone does not predict performance — the cost of a miss depends on what it overlaps with, where it is served (L2, L3, local DRAM), whether it hits an open DRAM row, and how badly the pipeline needs the data. It is also why the memory controller receives clustered, reorderable request streams: the cache hierarchy above it is deliberately generating concurrency for the DRAM banks below to absorb.",
        ],
      },
      {
        type: "callout",
        heading: "Fewer misses is not automatically faster",
        body: "Two systems with identical miss counts can perform very differently: overlapped misses (high MLP) are cheap, isolated critical-path misses are expensive, row-buffer hits are faster than conflicts, and a change that trims miss rate while lengthening hit time can lose outright. Evaluate hierarchies with AMAT and overlap in view, not miss counters alone.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Cache-reasoning review",
        items: [
          "Decompose any address into tag / set index / block offset from capacity, block size, and ways.",
          "Attribute misses to compulsory, capacity, or conflict before choosing a fix.",
          "Track write policy pairings (write-back+allocate vs write-through+no-allocate) and their bandwidth consequences.",
          "Compute AMAT recursively across levels; check that a 'better' cache actually lowers it.",
          "Account for MSHR-limited concurrency and MLP when judging miss cost.",
          "Remember the controller sees the miss stream, not the program — cache behaviour shapes DRAM traffic.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is memory built as a hierarchy?", answer: "Because big memories are slow and fast memories are expensive — opposing physical trade-offs. A small fast level backed by larger slower levels exploits temporal and spatial locality so most accesses hit the fast levels." },
          { question: "How does an address map into a set-associative cache?", answer: "Offset = log₂(block size) selects the byte; index = log₂(sets) selects the set, where sets = capacity/(block × ways); the remaining bits are the tag, compared against every way in the set to detect a hit." },
          { question: "Name the 3 Cs and the lever for each.", answer: "Compulsory (first access — prefetching), capacity (working set too big — larger cache or blocking/tiling), conflict (placement restriction — associativity, victim cache, index hashing)." },
          { question: "What are MSHRs and why does MLP matter?", answer: "Miss Status Handling Registers track outstanding misses (address, wanted words, waiting instructions) so a non-blocking cache can overlap misses and merge duplicates. Overlapped misses amortize DRAM latency — an isolated miss costs far more than one of ten in flight — so miss count alone doesn't predict performance." },
        ],
      },
    ],
    sources: [hennessyPatterson, mutluDdca],
    related: ["dram-fundamentals-and-organization", "memory-controllers-and-scheduling", "embedded-software-architecture"],
  },
  {
    slug: "dram-fundamentals-and-organization",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "DRAM fundamentals & organization",
    summary: "The 1T1C cell, destructive reads and sense amplifiers, refresh, the channel → DIMM → rank → chip → bank → row/column hierarchy, the row buffer and its three access cases, and how a 64-byte cache line actually crosses a 64-bit bus.",
    readingTime: 18,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "One transistor, one capacitor, and everything that follows",
        body: [
          "A DRAM cell stores one bit as charge on a tiny capacitor, gated by a single access transistor — the 1T1C cell whose density is the entire reason DRAM won main memory. Every awkward property of DRAM follows from that choice. The capacitor leaks, so the bit fades and must be refreshed on a fixed schedule. The stored charge is minuscule, so reading is done by charge sharing: the bitline is precharged to a midpoint voltage, the access transistor opens, and the cell's charge nudges the bitline up or down by a few tens of millivolts, which a sense amplifier then detects and amplifies to full rail. That sensing destroys the cell's stored value — the charge has been shared away — so every read must be followed by a restore, with the sense amplifier writing the full value back into the cell. And because sensing takes time and the restored row must be closed before another can open, DRAM access is governed by a small set of timing constraints rather than a single access time.",
          "The sense amplifiers along one row form the row buffer, and it behaves exactly like a one-entry cache inside each bank: activating a row copies (moves) it into the row buffer, after which columns of that row can be read and written quickly and repeatedly without touching the array again. That single structure — thousands of bits wide, holding one open row per bank — is the pivot around which DRAM performance, controller scheduling, and much of memory validation revolve.",
        ],
      },
      {
        type: "prose",
        heading: "Refresh: the standing tax",
        body: [
          "Because cells leak, every row must be refreshed — read and rewritten — within a retention window, standardized at 64 ms for normal temperatures (halved to 32 ms at extended temperature, since leakage roughly doubles per ~10 °C). Rather than one disruptive burst, controllers issue distributed refresh: one REF command roughly every tREFI ≈ 7.8 µs, each refreshing a batch of rows and occupying the rank for tRFC — a figure that has grown with density (hundreds of nanoseconds on multi-gigabit devices) because more rows must be refreshed per command. Refresh is pure overhead: it consumes bandwidth, adds queueing delay for requests that arrive while a rank refreshes, and burns energy, and its cost rises with every density generation — one reason fine-grained and same-bank refresh options appear in newer standards.",
          "Retention is also a distribution, not a constant: most cells hold data far longer than 64 ms, a few weak cells define the floor, and some cells exhibit variable retention time (VRT), flipping between strong and weak behaviour — which is why retention-related failures can be maddeningly intermittent and temperature-dependent, and why validation must stress refresh corners deliberately.",
        ],
      },
      {
        type: "table",
        heading: "The organizational hierarchy",
        columns: ["Level", "What it is", "Why it matters"],
        rows: [
          ["Channel", "Independent command/address + data bus from the controller", "Channels multiply bandwidth and concurrency; fully parallel"],
          ["DIMM", "A module carrying one or more ranks", "The physical, replaceable unit"],
          ["Rank", "Set of chips answering one command together", "Chips share the command; each supplies a slice of the 64-bit data bus"],
          ["Chip (device)", "One DRAM die, x4/x8/x16 wide", "Width sets chips per rank (16/8/4 for 64-bit)"],
          ["Bank / bank group", "Independent array + row buffer inside a chip", "Banks overlap operations — the source of DRAM parallelism"],
          ["Row (page)", "One wordline, thousands of bits, activated as a unit", "The unit the row buffer holds open"],
          ["Column", "The slice of the open row selected by a RD/WR", "The unit a burst transfers"],
        ],
      },
      {
        type: "formula",
        heading: "The three access cases",
        formula: "row hit: t ≈ CL      closed row: t ≈ tRCD + CL      row conflict: t ≈ tRP + tRCD + CL",
        explanation: "Every DRAM read lands in one of three cases, and the latency difference between them is the largest performance lever in the memory system. If the wanted row is already open in the bank's row buffer (row hit), only the column access time CL is paid. If the bank is precharged with no row open (closed row), an ACTIVATE must first open the row (tRCD) before the column read. If a different row is open (row conflict — the worst case), the bank must first PRECHARGE to close it (tRP), then activate the new row, then read. With tRP, tRCD, and CL each ~13–15 ns on commodity parts, a conflict costs roughly three times a hit — which is why controllers reorder requests to chase row hits and why address interleaving is designed to spread conflicting streams across banks.",
        terms: [
          { symbol: "CL (tAA)", meaning: "Column access latency from RD to data", unit: "ns or clocks" },
          { symbol: "tRCD", meaning: "ACTIVATE to RD/WR delay (row open)", unit: "ns" },
          { symbol: "tRP", meaning: "PRECHARGE time (row close)", unit: "ns" },
        ],
      },
      {
        type: "prose",
        heading: "How a cache line crosses the bus",
        body: [
          "The interface arithmetic ties the hierarchy together. A conventional DDR4 rank presents a 64-bit data bus, assembled from its chips: sixteen x4 devices, eight x8s, or four x16s, each contributing its slice of every transfer. A read moves a burst — eight transfers back-to-back (burst length 8) on DDR4 — so one column read delivers 64 bits × 8 = 64 bytes: exactly one cache line, which is no accident. Internally each chip fetches the whole burst's worth of bits from its array in one core access (the prefetch architecture covered in the DDR-generations note) and streams them out at the interface rate, two transfers per clock.",
          "Address interleaving decides which channel, rank, bank, row, and column an address maps to, and the mapping is a real design lever: putting consecutive cache blocks in the same row exploits row-buffer locality for sequential streams, spreading them across banks and channels exploits parallelism for concurrent streams, and XOR-hashing bank bits with row bits breaks up the pathological strides that would otherwise hammer one bank. The same physical address stream can perform very differently under two mappings — one of many places where 'memory performance' is really controller-and-mapping performance.",
        ],
      },
      {
        type: "callout",
        heading: "The row buffer is a cache — treat it like one",
        body: "Row hit, closed row, and row conflict are the DRAM analogues of cache hit and miss, with a ~3× latency spread between best and worst. Access patterns with row locality fly; patterns that ping-pong rows in one bank crawl. Scheduling (FR-FCFS), address interleaving, and row-buffer policy all exist to maximize hits and hide conflicts — and validation workloads deliberately create the conflict-heavy patterns that stress the timing corners.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "DRAM-organization review",
        items: [
          "Explain the 1T1C cell, charge-sharing read, destructive sensing, and restore.",
          "Walk the hierarchy: channel → DIMM → rank → chip → bank → row → column, with each level's role.",
          "Quote the three access cases and their latency composition (CL / tRCD+CL / tRP+tRCD+CL).",
          "Do the bus arithmetic: chip width × chips = 64-bit rank; burst 8 × 64 bits = one 64 B line.",
          "Account for refresh: tREFI cadence, tRFC cost, temperature dependence, retention distribution and VRT.",
          "Treat address interleaving as a design lever — row locality vs bank/channel parallelism.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why are DRAM reads destructive, and what fixes it?", answer: "Reading is charge sharing — the cell's tiny charge perturbs a precharged bitline, which the sense amplifier detects — and the sharing destroys the stored value. The sense amplifier restores the full value back into the cell as part of the access." },
          { question: "What are the three DRAM access cases and their costs?", answer: "Row hit (row already open): ~CL. Closed row: tRCD + CL. Row conflict (wrong row open): tRP + tRCD + CL — roughly 3× a hit, since tRP, tRCD, and CL are each ~13–15 ns." },
          { question: "How does a 64-byte cache line cross a DDR4 interface?", answer: "A rank's 64-bit bus (e.g. eight x8 chips) transfers a burst of 8 beats: 64 bits × 8 = 64 bytes from one column read. Each chip internally prefetches its whole slice in one core access and streams it at two transfers per clock." },
          { question: "Why does refresh get more expensive every generation?", answer: "Denser chips have more rows to refresh in the same 64 ms window, so tRFC grows (hundreds of ns), stealing more bandwidth and adding queueing delay; high temperature halves the window. Hence fine-grained and same-bank refresh in newer standards." },
        ],
      },
    ],
    sources: [mutluDdca, jacobMemorySystems, jedecDdr4],
    related: ["memory-hierarchy-and-caches", "dram-timing-and-commands", "memory-controllers-and-scheduling", "memory-reliability-ecc-and-rowhammer"],
  },
  {
    slug: "dram-timing-and-commands",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "DRAM timing & commands",
    summary: "The command protocol (ACT, RD/WR, PRE, REF, MRS), the timing parameters that govern it — tRCD, CL, tRP, tRAS, tRC, tRRD, tFAW, tCCD, tWTR, tWR, tRFC — speed-bin arithmetic from MT/s to nanoseconds, and why absolute latency has been flat for twenty years while bandwidth soared.",
    readingTime: 19,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "DRAM is commanded, not addressed",
        body: [
          "Unlike an SRAM that returns data some fixed time after an address, DRAM is operated by an explicit command protocol that the memory controller drives over the command/address bus, and the controller — not the DRAM — is responsible for never violating a timing rule. The working set of commands is small: ACTIVATE (ACT) opens a row into a bank's row buffer; READ and WRITE (RD/WR) move a burst between the open row and the data bus; PRECHARGE (PRE) closes the row and readies the bank for the next activation; REFRESH (REF) runs the periodic retention maintenance; and mode-register commands (MRS/MRW) configure the device itself — CAS latency, burst mode, drive strength, termination, and the training modes used at bring-up. ZQ calibration commands periodically recalibrate the chip's output-driver and termination impedances against an external precision resistor, compensating voltage and temperature drift.",
          "Every legal gap between commands is a named parameter in the JEDEC standard, and a real device carries dozens. The skill is not memorizing all of them but knowing the load-bearing few, what physical process each one protects, and how they compose into the latency a request actually experiences — because a controller misconfigured by one parameter, or a device marginal against one corner, produces exactly the kind of intermittent, pattern-dependent failure that memory validation exists to catch.",
        ],
      },
      {
        type: "table",
        heading: "The load-bearing timing parameters",
        columns: ["Parameter", "Constrains", "Physical reason"],
        rows: [
          ["tRCD", "ACT → RD/WR to same bank", "Row must be sensed into the row buffer first"],
          ["CL / tAA", "RD → first data out", "Column decode and data path through the chip"],
          ["tRP", "PRE → next ACT, same bank", "Bitlines must precharge back to midpoint"],
          ["tRAS", "ACT → PRE, same bank", "Row must stay open long enough to fully restore the cells"],
          ["tRC = tRAS + tRP", "ACT → ACT, same bank", "The full open-restore-close cycle of one bank"],
          ["tRRD_S / tRRD_L", "ACT → ACT, different banks (other/same bank group)", "Peak current draw of overlapping activations"],
          ["tFAW", "Any four ACTs within a rank", "Rolling window limiting activation power draw"],
          ["tCCD_S / tCCD_L", "Back-to-back column commands (other/same bank group)", "Internal data-path sharing within a bank group"],
          ["tWR", "Last write data → PRE", "Written data must reach the cells before closing"],
          ["tWTR", "Write burst → read command", "Bus and internal turnaround from write to read"],
          ["tRFC / tREFI", "Refresh duration / interval", "Rows refreshed per command; retention window budget"],
        ],
      },
      {
        type: "formula",
        heading: "Speed-bin arithmetic",
        formula: "tCK = 1/f_clk      CL(ns) = CL(clocks) × tCK      BW = MT/s × bus bytes      DDR4-3200: tCK = 0.625 ns, CL22 → 13.75 ns, 3200 × 8 B = 25.6 GB/s",
        explanation: "A speed bin like DDR4-3200 CL22 decodes as: 1600 MHz clock (data on both edges → 3200 MT/s), a clock period of 0.625 ns, and a CAS latency of 22 clocks = 13.75 ns. Bandwidth is transfers per second times the 8-byte bus: 25.6 GB/s per channel. The same arithmetic exposes the industry's open secret: DDR2-800 CL5 was 12.5 ns, DDR4-3200 CL22 is 13.75 ns, DDR5-6400 CL46 is ~14.4 ns — the absolute column latency has hovered around 13–15 ns for two decades because it is set by the analog physics of sensing a tiny capacitor, which does not improve with interface speed. Generations multiply bandwidth (faster interfaces, more prefetch, more banks); latency is bought only by hierarchy and overlap above the DRAM.",
        terms: [
          { symbol: "tCK", meaning: "Clock period (data moves on both edges)", unit: "ns" },
          { symbol: "MT/s", meaning: "Mega-transfers per second (2× clock)", unit: "—" },
          { symbol: "CL", meaning: "CAS latency in clocks — multiply by tCK for ns", unit: "clocks" },
        ],
      },
      {
        type: "prose",
        heading: "Power-driven constraints: tFAW, tRRD, and turnaround",
        body: [
          "Not all timing parameters protect signal paths; several protect the power delivery. An ACTIVATE is the most current-hungry DRAM operation — thousands of sense amplifiers firing at once — so the standard limits how densely activations may cluster: tRRD spaces consecutive ACTs to different banks, and tFAW (four-activate window) caps any four ACTs to a rank within a rolling window, throttling worst-case current draw to what the chip's internal supply network can sustain. Workloads that hammer many banks with row misses run straight into these limits, which is why bank-conflict-heavy stress patterns expose both scheduling behaviour and power-integrity margins at once.",
          "Turnaround parameters guard the shared bus and internal pipelines when direction changes. tWTR enforces a gap between the end of a write burst and the next read (the chip must finish absorbing write data before driving read data); write recovery tWR ensures written data has truly reached the cells before the row closes; and read-to-write switches cost bus-turnaround dead time on top. This is why controllers batch writes — draining a write queue in bursts between read phases — rather than interleaving directions request-by-request: every direction switch wastes slots that batching amortizes. Bank groups (DDR4 onward) add the _S/_L split: consecutive column commands within one bank group need the longer tCCD_L because they share internal data-path circuitry, while commands to different groups can run at the shorter tCCD_S — a constraint the controller's address mapping tries to dodge by alternating groups.",
        ],
      },
      {
        type: "prose",
        heading: "How the parameters compose into observed latency",
        body: [
          "A request's true latency assembles from queueing delay at the controller, the command sequence its row-buffer case demands (hit, closed, or conflict), interface transfer time, and any refresh it collides with. The composition is worth internalizing with numbers: on DDR4-3200 CL22 with tRCD = tRP = 13.75 ns, a row hit costs ~13.75 ns of column latency plus 2.5 ns of burst transfer; a conflict costs 13.75 × 3 ≈ 41 ns before the burst even starts; and a request arriving just as a rank begins refresh can wait an additional 350+ ns of tRFC. Multiply by queueing under load and the spread between best- and worst-case DRAM latency spans an order of magnitude — which is precisely the spread that scheduling, mapping, and MLP exist to manage, and that latency-sensitive validation must characterize rather than average away.",
          "These parameters are also the raw material of tuning. The speed bin's numbers are the vendor's guaranteed envelope at worst-case corners; a given device population at a given voltage and temperature typically has margin beyond them. Characterization sweeps — tightening a parameter until failure, across corners — map that margin, and the gap between the failing point and the shipped setting is the guardband. Running with a violated timing does not usually fail instantly or everywhere: it fails statistically, on the worst cells, at the worst temperature, under the worst pattern — the signature that distinguishes a timing-margin problem from a stuck-at fault.",
        ],
      },
      {
        type: "callout",
        heading: "A violated timing fails statistically, not deterministically",
        body: "Shaving tRCD or CL below the device's real capability doesn't produce a clean error at that spot — it produces occasional wrong bits, on the weakest cells, at particular temperatures and patterns, often only under load. That is why timing-margin bugs masquerade as flaky memory, why validation sweeps parameters to failure across corners instead of trusting nominal, and why the guardband between the failure cliff and the operating point is the real product spec.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Timing review",
        items: [
          "Know the command set (ACT/RD/WR/PRE/REF/MRS/ZQ) and which timing gates each pair.",
          "Convert any speed bin to tCK, ns latency, and GB/s (MT/s × 8 B) on paper.",
          "Explain the physics behind tRAS (restore), tRP (precharge), tFAW/tRRD (activation power), tWTR/tWR (turnaround).",
          "Compose full-path latency for hit / closed / conflict cases, including refresh collisions.",
          "Use bank groups deliberately: alternate groups to run at tCCD_S instead of tCCD_L.",
          "Treat vendor timings as the guaranteed envelope; characterize the real margin and record the guardband.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Decode DDR4-3200 CL22 into clock, latency, and bandwidth.", answer: "1600 MHz clock, 3200 MT/s (both edges), tCK = 0.625 ns; CL22 = 22 × 0.625 = 13.75 ns; bandwidth = 3200 MT/s × 8 bytes = 25.6 GB/s per channel." },
          { question: "Why has DRAM latency been flat while bandwidth exploded?", answer: "Column latency is set by the analog physics of sensing a tiny cell capacitor (~13–15 ns for two decades), which interface speed doesn't improve. Generations scale bandwidth via faster I/O, deeper prefetch, and more banks; latency is only hidden by caches and overlap above the DRAM." },
          { question: "What do tFAW and tRRD protect?", answer: "Power delivery, not data paths: an ACTIVATE fires thousands of sense amps, so tRRD spaces activations and tFAW caps any four per rank in a rolling window to bound peak current." },
          { question: "Why do controllers batch writes?", answer: "Write-to-read turnaround (tWTR plus bus turnaround) wastes bus slots at every direction switch. Draining writes in batches between read phases amortizes the turnaround penalty instead of paying it per request." },
        ],
      },
    ],
    sources: [jedecDdr4, jacobMemorySystems, mutluDdca],
    related: ["dram-fundamentals-and-organization", "memory-controllers-and-scheduling", "memory-validation-and-margining", "ddr-generations-lpddr-gddr-hbm"],
  },
  {
    slug: "memory-controllers-and-scheduling",
    libraryId: "technical",
    collectionId: "memory-systems",
    title: "Memory controllers & scheduling",
    summary: "What the controller owns — timing correctness, request scheduling (FR-FCFS), row-buffer policy, address mapping, refresh and power management — the controller/PHY split, and why controller behaviour is inseparable from memory validation and debug.",
    readingTime: 17,
    updatedAt: "Aug 6",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The controller is where memory 'behaviour' actually lives",
        body: [
          "The DRAM device is a passive array with strict rules; the memory controller is the agent that makes it useful. Its responsibilities stack: correctness — issuing command sequences that never violate a timing parameter across every bank, rank, and corner; performance — scheduling among queued requests to maximize row hits, bank parallelism, and bus utilization; maintenance — issuing refresh on schedule, ZQ calibration, and (in modern PHY-based systems) periodic retraining to track drift; and power — moving ranks into precharge power-down and self-refresh states when idle. Modern controllers sit on the processor die, close to the cores, which cuts latency and lets scheduling see request context (which core, load vs store, how critical) that an off-chip controller never had.",
          "That concentration of function has a validation consequence: a huge fraction of 'memory bugs' are controller bugs — a mis-programmed timing register, a scheduling corner case, an address-mapping error, a refresh starvation window — and they present as flaky DRAM. Debugging the memory subsystem therefore always means holding three suspects at once: the device, the board/channel, and the controller configuration driving them. A failure that tracks a logical resource (one rank, one bank group, one address stripe) points at configuration or mapping; one that tracks a physical resource (one byte lane, one chip) points at the channel or device.",
        ],
      },
      {
        type: "prose",
        heading: "Scheduling: from FCFS to FR-FCFS and beyond",
        body: [
          "The controller holds per-channel queues of read and write requests and, each cycle, chooses which DRAM command to issue next — a scheduling problem with real leverage, because request order determines row-buffer behaviour. Naive FCFS (oldest first) squanders locality: a row hit sitting behind a row conflict waits for the full conflict penalty. The workhorse policy is FR-FCFS — first-ready, first-come-first-served: among requests whose commands can legally issue now, prioritize row-buffer hits over misses, and break ties by age. This simple pair of rules captures most available row locality and bank parallelism, at a known cost: a stream with high row locality can starve another stream's conflicting requests, which is why fairness- and QoS-aware schedulers exist for multi-core and shared systems.",
          "Above the hit-first rule sit further priorities: reads generally beat writes (loads block execution; writebacks are fire-and-forget) until the write queue crosses a high-water mark, at which point the controller drains writes in a batch to amortize bus turnaround; some designs prioritize by criticality or requestor class. Row-buffer policy is a related knob: open-page keeps the row open betting the next access hits it (right for locality-rich streams), closed-page precharges immediately betting it won't (right for random traffic), and adaptive policies predict per-bank. Address mapping completes the picture — which physical address bits select channel, rank, bank group, bank, row, and column decides whether a given workload's streams collide or run parallel, and XOR-hashing bank-select bits with row bits defuses the strided patterns that would otherwise serialize into one bank.",
        ],
      },
      {
        type: "table",
        heading: "Scheduling and policy landscape",
        columns: ["Policy / knob", "Rule", "Wins", "Costs"],
        rows: [
          ["FCFS", "Oldest request first", "Simple, starvation-free", "Ignores row locality — poor throughput"],
          ["FR-FCFS", "Legal row hits first, then oldest", "Captures locality + bank parallelism", "Can starve conflict-heavy streams"],
          ["Read-priority + write drain", "Reads first; batch-drain writes past a watermark", "Hides writeback latency, amortizes turnaround", "Needs tuned watermarks; bursty bus"],
          ["Open-page policy", "Keep row open after access", "Fast for locality-rich streams", "Conflict penalty on random traffic"],
          ["Closed-page policy", "Auto-precharge after access", "Fast for random traffic", "Wastes locality when present"],
          ["XOR bank hashing", "bank = f(bank bits ⊕ row bits)", "Breaks pathological strides", "Harder to reason about mapping by hand"],
        ],
      },
      {
        type: "prose",
        heading: "The controller/PHY split",
        body: [
          "Physically, the memory interface divides into two blocks. The controller handles the digital protocol: queues, scheduling, timing enforcement, refresh, power states — everything expressible in clocked logic. The PHY handles the analog and mixed-signal reality of moving bits over the channel: the I/O drivers and receivers, per-lane delay lines, DQS strobe handling and clock-domain crossing, ZQ-calibrated impedances, and the training engines that find and maintain per-bit timing and voltage centering (the subject of the interface-and-training note). A standard internal interface (DFI in most implementations) separates the two, defining how the controller hands commands and data to the PHY and how the PHY reports training status back.",
          "The split matters operationally because each side fails differently. Controller-side problems are logical and deterministic once triggered — a timing register off by one, a refresh window missed under a specific traffic pattern, an arbitration deadlock. PHY-side problems are analog and statistical — a lane whose trained delay sits too close to the eye edge, drift with temperature that periodic retraining fails to track, a marginal Vref. The first family reproduces with the right command sequence regardless of voltage and temperature; the second family moves with corners and patterns. Classifying a memory failure into controller-logical versus PHY-analog early is the single most valuable branch in the debug tree.",
        ],
      },
      {
        type: "prose",
        heading: "Refresh, power states, and the maintenance schedule",
        body: [
          "The controller owns the maintenance calendar. Refresh must be issued within its interval across all conditions — including while heavy traffic contends for the same rank — and controllers may postpone or pull in a bounded number of refreshes to dodge traffic bursts, a flexibility the standard explicitly grants (up to a limit of deferred refreshes). Miss the schedule and retention errors appear that no amount of channel margin explains. ZQ calibration runs periodically to track driver and termination impedance against temperature; PHY retraining or drift-tracking loops (using constructs like the DQS oscillator that measures on-die delay drift) keep trained timing centered as the system heats and cools. Each of these is a scheduled interruption of normal service, and each is a classic source of corner-case bugs — the request that collides with a refresh boundary, the retraining that fires mid-burst, the power-state exit that violates a wake-up timing.",
          "Power states round out the picture: precharge power-down parks an idle rank with fast exit; self-refresh hands refresh responsibility to the DRAM itself and lets the controller and clocks sleep, at the cost of a long exit latency and a full drift-recovery on wake in aggressive cases. Mobile-oriented parts extend this menu considerably, and the controller's policy for when to enter each state is a latency-versus-energy trade tuned per product. In validation terms, every state transition is an edge to exercise: memory that is solid under continuous traffic and fails after an idle period is pointing straight at a power-state exit or drift-tracking hole.",
        ],
      },
      {
        type: "callout",
        heading: "Suspect the configuration before the silicon",
        body: "A mis-set timing register, wrong address map, or refresh-scheduling hole produces failures indistinguishable at first glance from bad DRAM. Failures tracking logical resources (a rank, a bank group, an address stripe) implicate controller configuration and mapping; failures tracking physical resources (a byte lane, one chip, one corner) implicate the channel, PHY training, or device. Make that classification the first move of every memory debug.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Controller review",
        items: [
          "Enumerate the controller's jobs: timing correctness, scheduling, refresh/ZQ/retraining, power states, address mapping.",
          "Explain FR-FCFS and its starvation trade; know read-priority and batched write draining.",
          "Choose open- vs closed-page policy from the workload's row locality; know adaptive exists.",
          "Treat address mapping and XOR hashing as performance levers with failure-signature consequences.",
          "Separate controller-logical failures (deterministic, corner-independent) from PHY-analog ones (statistical, corner-dependent).",
          "Exercise every maintenance and power-state edge: refresh collisions, retraining windows, power-down exits.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What is FR-FCFS and why does it beat FCFS?", answer: "First-ready FCFS: among requests that can legally issue now, row-buffer hits go first, ties broken by age. It captures row locality and bank parallelism that oldest-first squanders — at the cost of possible starvation for conflict-heavy streams, hence QoS-aware variants." },
          { question: "Why do controllers drain writes in batches?", answer: "Reads are latency-critical and beat writes until the write queue passes a watermark; then a batch drain amortizes the expensive write-to-read bus turnaround instead of paying it per request." },
          { question: "What splits the controller from the PHY, and why does it matter for debug?", answer: "The controller is digital protocol (queues, scheduling, timing, refresh); the PHY is the mixed-signal channel interface (drivers, delay lines, DQS handling, training), joined by an interface like DFI. Controller bugs are deterministic and corner-independent; PHY problems are statistical and move with voltage/temperature — classifying which family a failure belongs to is the first debug branch." },
          { question: "Name three maintenance activities the controller schedules and their failure edges.", answer: "Refresh (missed windows → retention errors; collisions with traffic), ZQ calibration (impedance drift with temperature), and periodic retraining/drift tracking (trained timing drifting off-center — failures after idle or thermal ramps point here). Every one is a corner to validate." },
        ],
      },
    ],
    sources: [mutluDdca, jacobMemorySystems],
    related: ["dram-timing-and-commands", "dram-fundamentals-and-organization", "ddr-interface-signaling-and-training", "memory-validation-and-margining"],
  },
];
