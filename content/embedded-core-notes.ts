import type { Note, Source } from "./library";

const armCortexMGuide: Source = {
  title: "Cortex-M4 Devices Generic User Guide",
  publisher: "Arm",
  url: "https://developer.arm.com/documentation/dui0553/latest/",
  kind: "Documentation",
};

const memfaultZeroToMain: Source = {
  title: "Zero to main(): How to Write a Bootstrapping Routine",
  publisher: "Memfault Interrupt",
  url: "https://interrupt.memfault.com/blog/zero-to-main-1",
  kind: "Reference",
};

const freertosKernelBook: Source = {
  title: "The FreeRTOS Kernel Book",
  publisher: "FreeRTOS",
  url: "https://www.freertos.org/Documentation/02-Kernel/07-Books-and-manual/01-Mastering-the-FreeRTOS-Real-Time-Kernel",
  kind: "Documentation",
};

export const embeddedCoreNotes: Note[] = [
  {
    slug: "interrupts-and-isr-design",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "Interrupts & ISR design",
    summary: "Vectors, NVIC priorities, latency, deferring work to tasks, sharing data safely with ISRs, and the discipline that keeps interrupt-driven systems debuggable.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Hardware calls a function — everything else is convention",
        body: [
          "An interrupt is the hardware forcing a control transfer: a peripheral raises a request, the controller (NVIC on Cortex-M) compares its priority against the current execution priority, and if it wins, the core stacks a register frame and jumps through the vector table to your handler. On Cortex-M this costs about 12 cycles plus jitter from bus waits and flash latency; back-to-back interrupts tail-chain without re-stacking, and a late-arriving higher-priority request can preempt the stacking already in progress.",
          "Priorities are a small, precious design space. Cortex-M priorities preempt by number (lower value wins), optionally split into preemption and sub-priority groups. An RTOS adds a critical line: interrupts at or below the syscall-priority ceiling may use the ISR-safe API; interrupts above it are invisible to the kernel — near-zero latency, but forbidden from touching RTOS objects. Keep the entire priority map in one header with a comment per entry; scattered magic numbers are how priority bugs are written.",
          "The core discipline: an ISR should capture the event, do the minimum time-critical work, and hand the rest to task context through a queue, stream buffer, or task notification. Long ISRs don't just delay lower-priority interrupts — they add invisible jitter to everything the system promises.",
        ],
      },
      {
        type: "code",
        heading: "The deferral pattern",
        intro: "Acknowledge the peripheral, move the data, wake the task that does the thinking. The FromISR suffix and the yield call are load-bearing.",
        language: "C / FreeRTOS",
        code: "void UART_IRQHandler(void) {\n    BaseType_t woken = pdFALSE;\n    uint32_t status = UART->ISR;          /* read once; some flags clear on read */\n    if (status & UART_ISR_RXNE) {\n        uint8_t byte = (uint8_t)UART->RDR;\n        xStreamBufferSendFromISR(rx_stream, &byte, 1, &woken);\n    }\n    if (status & UART_ISR_ORE) {\n        UART->ICR = UART_ICR_ORECF;       /* clear at the peripheral, not just NVIC */\n        overrun_count++;                  /* evidence, not silence */\n    }\n    portYIELD_FROM_ISR(woken);            /* run the woken task on exit, not next tick */\n}",
      },
      {
        type: "table",
        heading: "Sharing data with an ISR",
        columns: ["Mechanism", "When it fits", "The catch"],
        rows: [
          ["volatile flag + word", "Single writer, single reader, one machine word", "No atomicity beyond one aligned word; no ordering guarantees"],
          ["Ring buffer (SPSC)", "Streams: one ISR producer, one task consumer", "Indices must be written after data; sizes power-of-two help"],
          ["RTOS queue / stream buffer", "Structured handoff with blocking consumers", "Only below the syscall priority ceiling; per-item copy cost"],
          ["Critical section (mask IRQs)", "Short multi-word updates", "Every masked microsecond is added latency for everything"],
          ["Atomics (LDREX/STREX, C11)", "Counters, state words", "RMW loops can retry; still not a design substitute"],
        ],
      },
      {
        type: "prose",
        heading: "The bugs that recur",
        body: [
          "Flag-clearing races: clearing the NVIC pending bit does nothing if the peripheral's own status flag still asserts the line — the interrupt refires forever, or worse, level-triggered sources re-enter as soon as you exit. Learn each peripheral's clearing mechanism (write-1-to-clear, read-to-clear, or sequence) and clear before doing work that could re-set it.",
          "Check-then-sleep races: code that checks a flag and then executes WFI can sleep through the event that arrived between the check and the instruction. The Cortex-M idiom is to sleep with PRIMASK set — WFI still wakes on pending interrupts, and the handler runs only after you unmask, closing the window. RTOS tickless-idle implementations do exactly this.",
          "Torn data: a 64-bit timestamp or multi-field struct updated by an ISR and read by a task can interleave. Either make readers retry on a sequence counter, snapshot under a brief critical section, or restructure so only one side owns the data. `volatile` prevents the compiler from caching accesses; it does not make anything atomic and does not order independent memory operations.",
        ],
      },
      {
        type: "callout",
        heading: "Above the syscall ceiling, the RTOS does not exist",
        body: "Calling any kernel API from an interrupt whose priority is above the configured syscall ceiling corrupts kernel state — intermittently, and usually far from the cause. Audit this whenever a priority changes; on Cortex-M remember that lower numbers mean higher priority and that unconfigured interrupts default to the highest priority (0).",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Interrupt design review",
        items: [
          "Keep one priority map header with the rationale for every level, including the RTOS syscall ceiling.",
          "Bound each ISR's worst-case execution time; measure it with a GPIO toggle or trace, not intuition.",
          "Verify every handler clears the peripheral source correctly and handles the flags you didn't expect.",
          "Count error paths (overruns, spurious sources) in variables you can read later.",
          "Audit all critical sections for duration; treat masking interrupts as borrowing latency from everything.",
          "Test the system under interrupt flood — a stuck line or noisy edge source should degrade, not livelock.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What is tail-chaining?", answer: "When one ISR ends with another pending, the core skips the unstack/re-stack cycle and enters the next handler directly, cutting back-to-back latency." },
          { question: "Why does clearing the NVIC pending bit sometimes not stop an interrupt?", answer: "The peripheral's own status flag still drives the request line; until it's cleared at the source, the interrupt re-pends — with level-triggered semantics, immediately." },
          { question: "What does volatile actually guarantee for a shared flag?", answer: "The compiler performs every access to the object as written, without caching in registers. It provides no atomicity for multi-word data and no ordering with respect to other operations." },
          { question: "How do you sleep without losing a wakeup?", answer: "Mask interrupts, check the condition, then WFI while masked — a pending interrupt still wakes the core, and the handler runs after unmasking, eliminating the check-to-sleep race window." },
        ],
      },
    ],
    sources: [armCortexMGuide, freertosKernelBook],
    related: ["rtos-task-scheduling", "dma-and-data-movement", "c-at-the-hardware-boundary"],
  },
  {
    slug: "dma-and-data-movement",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "DMA & data movement",
    summary: "Channels and requests, circular and ping-pong buffering, cache coherency, alignment, error handling, and deciding when DMA earns its complexity.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A DMA controller is a small dumb processor that copies",
        body: [
          "DMA moves data between peripherals and memory (or memory and memory) without the CPU touching each byte. A transfer is described by source, destination, increment behavior, element width, and count; a request line from the peripheral paces peripheral transfers so data moves exactly when the hardware is ready. This is what makes sustained I/O possible at all: an ADC at 1 Msps or a UART at 3 Mbaud cannot survive on per-item interrupts, but a DMA channel services them silently and interrupts only per buffer.",
          "The unglamorous half is the routing: controllers have finite channels/streams, and each peripheral request maps only to specific ones (via request multiplexers on newer parts). Channel conflicts are a design-time resource-allocation problem — keep a table of which channel serves which peripheral, its priority, and its interrupt, exactly like the interrupt priority map. Arbitration priority matters when several streams compete for bus bandwidth, and heavy DMA traffic can visibly slow the CPU on shared buses and memories.",
        ],
      },
      {
        type: "prose",
        heading: "Buffering patterns",
        body: [
          "One-shot transfers suit command/response peripherals: start, wait for the transfer-complete interrupt, process. Streams need circular mode: the controller wraps at the end of the buffer and raises interrupts at half-full and full. That half/full pair is the ping-pong pattern — the CPU processes the idle half while DMA fills the other, and the deadline is explicit: each half must be processed before DMA wraps back into it. Buffer size is therefore a latency budget: half-buffer duration must exceed your worst-case scheduling delay plus processing time.",
          "Reception with unknown lengths (a UART receiving variable-size packets) combines circular DMA with the idle-line interrupt: DMA deposits bytes continuously, and the idle event tells you where the burst ended by reading the DMA counter. Linked-list or descriptor-based controllers go further, chaining scatter-gather segments without CPU involvement — the same architecture Ethernet MACs and USB controllers use internally.",
        ],
      },
      {
        type: "code",
        heading: "Ping-pong processing skeleton",
        intro: "The half and full callbacks hand alternating halves to the consumer. Missing a deadline here is data corruption, so measure the margin.",
        language: "C",
        code: "#define HALF  (ADC_BUF_LEN / 2)\nstatic uint16_t adc_buf[ADC_BUF_LEN] __attribute__((aligned(32)));\n\nvoid dma_half_complete_isr(void) {          /* first half is stable   */\n    queue_block(&adc_buf[0], HALF);         /* DMA now fills second   */\n}\nvoid dma_full_complete_isr(void) {          /* second half is stable  */\n    queue_block(&adc_buf[HALF], HALF);      /* DMA wrapped to first   */\n}\n/* consumer task deadline: process HALF samples faster than\n   DMA refills them, including worst-case scheduling latency */",
      },
      {
        type: "prose",
        heading: "Cache coherency: where DMA breaks 'working' code",
        body: [
          "On cores with data caches (Cortex-M7, application processors), the CPU sees the cache while DMA sees RAM — two views that silently diverge. Before DMA transmits a buffer the CPU wrote, clean (flush) those cache lines to memory; before the CPU reads a buffer DMA filled, invalidate those lines so stale cached data isn't returned. Doing these in the wrong order, or on a buffer that shares a cache line with unrelated variables, corrupts data in ways that look random.",
          "Buffers must therefore be cache-line aligned and sized in whole lines (32 bytes typically), or placed in memory the cache doesn't cover: a non-cacheable MPU region, or tightly-coupled memory (DTCM) — noting that on many parts some memories are simply not reachable by some DMA controllers (a classic silent failure: DMA 'completes' and the buffer never changes). The alternative worlds are cleaner where available: cache-coherent interconnects do this bookkeeping in hardware.",
        ],
      },
      {
        type: "callout",
        heading: "DMA does not raise exceptions — it sets bits",
        body: "A bus error, a FIFO overrun, or an address fault during DMA sets an error flag and stops the stream, silently. Always enable the DMA error interrupts, count them, and define recovery (reinitialize the stream, resynchronize the protocol). A system that never checks DMA error flags will one day stream zeros with perfect confidence.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "DMA design review",
        items: [
          "Maintain a channel/stream allocation table with request mappings, priorities, and owners.",
          "Derive buffer sizes from worst-case consumer latency, not round numbers.",
          "Align and pad DMA buffers to cache lines, or place them in non-cacheable/TCM regions deliberately.",
          "Verify the chosen memory region is actually reachable by the chosen DMA controller.",
          "Enable and count error interrupts; test the overrun path by artificially stalling the consumer.",
          "For small infrequent transfers, check whether setup overhead exceeds a simple interrupt loop — DMA is not free.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why clean before TX but invalidate before RX?", answer: "Transmit needs the CPU's written data pushed from cache to RAM where DMA reads; receive needs stale cache lines discarded so the CPU re-reads RAM that DMA wrote." },
          { question: "What makes ping-pong buffering better than one big buffer?", answer: "It bounds latency and creates a clear real-time contract: each half must be processed within one half-buffer period, while DMA continues uninterrupted in the other half." },
          { question: "How do you receive variable-length UART packets with DMA?", answer: "Circular DMA into a ring plus the idle-line interrupt; on idle, read the remaining-count register to compute where the burst ended." },
          { question: "When is DMA the wrong tool?", answer: "Tiny, infrequent transfers where channel setup and cache maintenance cost more than the copy, or memories/controllers whose combination isn't supported — measure before assuming." },
        ],
      },
    ],
    sources: [armCortexMGuide],
    related: ["interrupts-and-isr-design", "uart-fundamentals", "i2s-digital-audio"],
  },
  {
    slug: "memory-maps-linkers-and-startup",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "Memory maps, linkers & startup",
    summary: "What happens before main(): vector tables, section placement, .data/.bss initialization, stacks and heaps, special RAMs, and reading the map file.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Foundation",
    blocks: [
      {
        type: "prose",
        heading: "From power-on to main()",
        body: [
          "A Cortex-M core boots by reading two words from the start of the vector table: the initial stack pointer and the reset handler address. The reset handler — startup code from the vendor or your own — then makes C's promises true: it copies the .data section's initial values from flash to RAM, zeroes .bss, optionally configures clocks and flash wait states, runs C++ constructors or init arrays, and finally calls main(). Until that copy-and-zero completes, globals hold garbage; code that runs earlier (or clock setup that reads a global) is a classic trap.",
          "The linker script is where the memory map becomes real. It declares the memory regions (flash origin and length, RAM banks) and assigns sections into them: .text (code) and .rodata (constants) live in flash; .data has two addresses — a load address in flash where initial values are stored and a run address in RAM where the program uses them; .bss occupies RAM only. Understanding that .data duality explains half of all linker-script confusion.",
        ],
      },
      {
        type: "code",
        heading: "The shape of a linker script",
        intro: "Simplified GNU ld: regions, then sections into regions. The AT> keyword is the .data load/run split.",
        language: "ld",
        code: "MEMORY {\n  FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 512K\n  RAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 128K\n}\nSECTIONS {\n  .isr_vector : { KEEP(*(.isr_vector)) } > FLASH\n  .text  : { *(.text*) *(.rodata*) } > FLASH\n  .data  : { _sdata = .; *(.data*); _edata = .; } > RAM AT> FLASH\n  _sidata = LOADADDR(.data);   /* startup copies _sidata -> _sdata  */\n  .bss   : { _sbss = .; *(.bss*) *(COMMON); _ebss = .; } > RAM\n  ._stack (NOLOAD) : { . = . + STACK_SIZE; _estack = .; } > RAM\n}",
      },
      {
        type: "table",
        heading: "Sections and who initializes them",
        columns: ["Section", "Contents", "Lives in", "Initialized by"],
        rows: [
          [".text / .rodata", "Code, constants", "Flash", "Nobody — executed/read in place"],
          [".data", "Initialized globals", "RAM (copy from flash)", "Startup copy loop"],
          [".bss", "Zero-initialized globals", "RAM", "Startup zero loop"],
          [".noinit", "Crash evidence, boot counters", "RAM", "Deliberately nobody — survives reset"],
          ["Stack", "Call frames, locals", "RAM (grows down)", "Initial SP from vector table"],
          ["Heap", "malloc pool (if any)", "RAM", "Allocator at first use"],
        ],
      },
      {
        type: "prose",
        heading: "Stacks, heaps, and special memories",
        body: [
          "Stack overflow in a flat memory map doesn't fault — it silently corrupts whatever lies below, usually your most stable global data, producing bugs with no visible connection to their cause. Defenses: place the stack so overflow hits an MPU guard region or the end of RAM, fill the stack with a pattern and measure high-water marks, use the stack-limit registers on ARMv8-M, and let the RTOS check per-task watermarks. Heap use in small systems deserves suspicion — fragmentation over months of uptime is a slow-motion failure; fixed pools and static allocation are the embedded default for a reason.",
          "Modern MCUs have a zoo of RAMs: tightly-coupled memory (ITCM/DTCM) with single-cycle access and no cache involvement, ordinary SRAM banks on different buses, and sometimes core-coupled memory unreachable by DMA. Placing hot code and real-time buffers deliberately — the interrupt handlers in ITCM, DMA buffers in a non-cached bank, flash-programming routines in RAM because flash can't be read while being written — is a linker-script activity that directly buys performance and correctness. And read the map file at every release: know your three biggest symbols, watch section growth, and enable the linker's memory-usage summary so running out of RAM is a build error, not a field mystery.",
        ],
      },
      {
        type: "callout",
        heading: "The vector table moves — tell the hardware",
        body: "Bootloaders and applications each have vector tables, but the hardware uses one at a time. After jumping to an application at an offset, set VTOR (the vector table offset register) to the application's table — and remember alignment requirements. Interrupts firing through the wrong table is the signature crash of every first bootloader.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Memory design review",
        items: [
          "Read the map file: largest symbols, per-region usage, and unexpected library pulls (printf floating point, C++ runtime).",
          "Enable the linker memory-usage report so overflow fails the build with numbers.",
          "Measure stack high-water marks per task under stress, not on the happy path.",
          "Decide the heap policy explicitly: none, pools, or a measured allocator with fragmentation headroom.",
          "Audit which memories each bus master (CPU, DMA, radios) can actually reach before placing buffers.",
          "Keep a .noinit region for reset-surviving evidence, and validate it with a magic cookie before trusting it.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does .data have two addresses?", answer: "Its initial values must persist in flash across power cycles (load address) but the variables must be writable at run time (run address in RAM); startup copies between them before main()." },
          { question: "What are the first two words of a Cortex-M vector table?", answer: "The initial main stack pointer value and the reset handler address — the hardware loads SP and PC from them at boot." },
          { question: "Why is heap fragmentation worse in embedded systems?", answer: "Devices run for months without restart, allocators can't compact, and RAM is small — interleaved alloc/free patterns eventually leave no contiguous block, failing allocations that always succeeded in testing." },
          { question: "Why place flash-programming code in RAM?", answer: "On many parts the flash array can't be read (for instruction fetch) while a write or erase is in progress, so the code doing the programming must execute from a different memory." },
        ],
      },
    ],
    sources: [memfaultZeroToMain, armCortexMGuide],
    related: ["bootloaders-and-firmware-update", "c-at-the-hardware-boundary", "watchdogs-faults-and-recovery"],
  },
];
