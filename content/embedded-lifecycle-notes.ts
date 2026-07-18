import type { Note, Source } from "./library";

const memfaultBootloader: Source = {
  title: "How to Write a Bootloader from Scratch",
  publisher: "Memfault Interrupt",
  url: "https://interrupt.memfault.com/blog/how-to-write-a-bootloader-from-scratch",
  kind: "Reference",
};

const freertosLowPower: Source = {
  title: "Low Power (Tickless) RTOS Support",
  publisher: "FreeRTOS",
  url: "https://www.freertos.org/low-power-tickless-rtos.html",
  kind: "Documentation",
};

const armCortexMFaults: Source = {
  title: "Cortex-M4 Devices Generic User Guide — Fault Handling",
  publisher: "Arm",
  url: "https://developer.arm.com/documentation/dui0553/latest/",
  kind: "Documentation",
};

export const embeddedLifecycleNotes: Note[] = [
  {
    slug: "bootloaders-and-firmware-update",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "Bootloaders & firmware update",
    summary: "The immutable first stage, image validation and metadata, A/B versus in-place strategies, power-fail-safe state machines, and jumping to an application correctly.",
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The bootloader is the part you cannot fix later",
        body: [
          "A bootloader's job is small and absolute: decide which application image to run, verify it, and launch it — and provide a way to install a new one when there is no valid application at all. Because a bug here can permanently brick devices, the first stage should be minimal, heavily reviewed, write-protected in flash, and ideally never updated in the field. Complexity (transport protocols, decryption, UI) belongs in updatable stages or the application, not in the immutable root.",
          "Every image needs metadata the bootloader can trust: a header or trailer with a magic number, version, target hardware ID, length, and an integrity check. A CRC proves the image arrived intact; a cryptographic signature proves it came from you — different threats, different mechanisms, and secure products need the signature (verified against a public key the bootloader holds, forming the root of a secure boot chain). Version and hardware-compatibility fields prevent the subtler disasters: valid firmware for the wrong board revision.",
        ],
      },
      {
        type: "table",
        heading: "Update strategies",
        columns: ["Strategy", "How it works", "Trade-offs"],
        rows: [
          ["A/B (dual slot)", "New image written to inactive slot; a pointer or flag selects; fall back on failure", "Needs 2× application flash; near-unbrickable; instant rollback"],
          ["Staging + swap", "Image staged in external flash, copied over the app after validation", "Cheap internal flash; vulnerable window during swap unless swap is resumable"],
          ["In-place", "Erase and rewrite the only application slot", "Minimum flash; a failed update leaves no app — recovery path must exist"],
          ["Delta/compressed", "Ship differences or compressed images over any strategy above", "Saves bandwidth (radio, cellular); adds decompression correctness burden"],
        ],
      },
      {
        type: "prose",
        heading: "Power-fail safety is a state-machine proof",
        body: [
          "Assume power dies at every flash operation. The update process must be a sequence of idempotent steps whose state is recoverable from flash contents alone: download to a location that never holds the running image; validate fully (length, CRC, signature, version) before touching anything the system boots from; commit by writing a small status/flags record only after the new image is proven; and mark success only after the new application demonstrably runs. That last step is the trial-boot pattern — a boot counter or watchdog-armed first run, where failure to check in flips the system back to the previous image automatically.",
          "Flash physics shapes the design: erases are per-sector and slow, erased bytes read 0xFF, programming only clears bits, and each sector endures a finite number of cycles. Status flags exploit this — a sequence of states encoded by progressively programming words means state transitions never require an erase and a torn write is detectable. Keep the watchdog running during updates (with kicks inside the erase/program loops), and never let metadata claim an image is good before the image data is fully flushed.",
        ],
      },
      {
        type: "code",
        heading: "Jumping to the application",
        intro: "The launch sequence fails when the bootloader leaves the machine dirty: interrupts pending, peripherals DMA-ing, clocks reconfigured. Quiesce, then jump.",
        language: "C / Cortex-M",
        code: "void boot_jump(uint32_t app_base) {\n    const uint32_t *vec = (const uint32_t *)app_base;\n    /* 1. quiesce: stop DMA, disable + clear all interrupts   */\n    __disable_irq();\n    deinit_peripherals_used_by_bootloader();\n    /* 2. point hardware at the app's vector table            */\n    SCB->VTOR = app_base;\n    /* 3. load the app's stack pointer and reset handler      */\n    __set_MSP(vec[0]);\n    ((void (*)(void))vec[1])();   /* never returns             */\n}\n/* app start: re-enable interrupts only after its own init */",
      },
      {
        type: "callout",
        heading: "Keep one recovery door that firmware cannot close",
        body: "A strap pin held at reset, a ROM DFU mode, or a bootloader command channel that exists regardless of application state — some path to reprogram the device must survive any possible application bug. If entering recovery depends on the application behaving, a bad image can lock you out of the fleet.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Update design review",
        items: [
          "Validate everything (length, CRC, signature, version, hardware ID) before altering any bootable state.",
          "Prove power-fail safety by pulling power at each state transition in a scripted test, not by argument.",
          "Implement trial boot with automatic rollback; define what 'the new image works' means and who marks success.",
          "Write-protect the first-stage bootloader sectors and test that protection is actually active.",
          "Keep the watchdog alive through erase/program; verify update duration against timeout budgets.",
          "Version the metadata format itself — the second update format you ship must coexist with the first.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why validate before erasing, and commit after running?", answer: "Validation before erase means a bad download can't destroy the working system; success marked only after a real boot means a plausible-but-broken image rolls back automatically." },
          { question: "What's the difference between CRC and signature verification?", answer: "CRC detects accidental corruption; a signature cryptographically proves origin and blocks malicious images — integrity versus authenticity, and secure boot requires the latter." },
          { question: "Why does the jump sequence set MSP and VTOR?", answer: "The application expects the reset contract: its own stack pointer from its vector table's first word, and hardware fetching its handlers through its own table. Skipping either causes crashes on the first interrupt or deep call chain." },
          { question: "How do flash status flags avoid erase during state transitions?", answer: "Programming can only clear bits, so states are encoded as progressively programmed words — each transition programs the next word, needs no erase, and a torn write is detectable as an intermediate pattern." },
        ],
      },
    ],
    sources: [memfaultBootloader],
    related: ["memory-maps-linkers-and-startup", "watchdogs-faults-and-recovery", "usb-fundamentals"],
  },
  {
    slug: "low-power-firmware-design",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "Low-power firmware design",
    summary: "Sleep-mode ladders, duty-cycle arithmetic, race-to-idle, hunting microamp leaks, tickless RTOS idle, and measuring instead of believing.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Energy is current × time — attack both axes",
        body: [
          "Battery life is decided by the average current, and for duty-cycled devices the average is dominated by two numbers: how much current the sleeping state draws, and how often and how long the device wakes. A sensor that samples once a minute might be awake 0.1% of the time — at that ratio, shaving sleep current from 10 µA to 2 µA matters far more than optimizing the active burst, and a single forgotten pull-up can outweigh every software effort combined.",
          "For the active portion, the usual winner is race-to-idle: run fast, finish the work, and return to deep sleep, rather than running slowly at reduced clock. Active current scales roughly with frequency but so does completion speed, while static leakage and fixed overheads accrue with time awake. The exceptions are peripheral-bound waits (waiting on a sensor conversion at high clock burns energy for nothing — sleep through it) and radio protocols whose timing dictates the schedule.",
        ],
      },
      {
        type: "formula",
        heading: "Duty-cycle arithmetic",
        formula: "I_avg = (I_active·t_active + I_sleep·t_sleep) / (t_active + t_sleep)",
        explanation: "Battery life ≈ usable capacity / I_avg, derated for temperature, self-discharge, regulator efficiency at micro-loads, and the cutoff voltage where the system actually stops working. Run the arithmetic per operating state and per wake source before choosing hardware — it tells you which term deserves the engineering.",
        terms: [
          { symbol: "I_active / t_active", meaning: "Current and duration of awake bursts", unit: "A, s" },
          { symbol: "I_sleep / t_sleep", meaning: "Sleep-state current and dwell", unit: "A, s" },
          { symbol: "I_avg", meaning: "The number the battery actually sees", unit: "A" },
        ],
      },
      {
        type: "table",
        heading: "The sleep-mode ladder (typical MCU pattern)",
        columns: ["Mode", "What stops", "Typical draw", "Wake cost"],
        rows: [
          ["Run", "Nothing", "mA-scale (per MHz)", "—"],
          ["Sleep (WFI)", "CPU clock only; peripherals run", "~30–50% of run", "Cycles"],
          ["Stop / deep sleep", "Most clocks; RAM and state retained", "µA-scale", "µs–ms, clocks restart"],
          ["Standby / shutdown", "Nearly everything; RAM lost", "nA–µA", "Reboot through reset"],
          ["With RTC/LPTIM awake", "Above + a 32 kHz domain for scheduled wakes", "adds ~0.2–1 µA", "Timer-driven"],
        ],
      },
      {
        type: "prose",
        heading: "Hunting the microamp leaks",
        body: [
          "Real products miss their sleep budgets through accumulation of small leaks: a floating GPIO input oscillating in the threshold region, a pull-up fighting an output held low (3.3 V across 10 kΩ is 330 µA — a catastrophe at µA budgets), sensors and regulators without enable control, an LED that 'is only dim', a debug interface keeping clock domains awake, peripheral clocks left gated on, or a brown-out detector configured in its high-power continuous mode. Every GPIO needs a documented sleep state; every external device needs a power-down story.",
          "Regulator choice matters differently at micro-loads: quiescent current dominates efficiency below milliamps, so a converter that is 95% efficient at 100 mA but draws 50 µA of Iq can lose to a humble LDO with 1 µA Iq. RTOS integration is the tickless idle pattern — instead of waking every tick, the kernel programs a low-power timer for the next deadline and repairs the tick count on wake; make sure your drivers' delay-and-poll loops don't quietly defeat it.",
        ],
      },
      {
        type: "callout",
        heading: "Measure across modes; never trust arithmetic alone",
        body: "Datasheet currents are best-case at 25 °C with everything ideal. Measure the real board in every state with instrumentation that spans nA to hundreds of mA (dedicated power profilers do this well), and make the measurement part of release testing — sleep-current regressions from an innocent driver change are among the most common late field surprises.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Low-power design review",
        items: [
          "Write the energy budget first: every state's current, dwell time, and wake frequency, with the battery derating.",
          "Enumerate wake sources and their latencies; verify unwanted ones are actually disabled.",
          "Document and enforce the sleep state of every GPIO and every external component's enable line.",
          "Verify tickless idle engages — trace wakeups and attribute each one to a cause.",
          "Measure each mode on real hardware across temperature; automate a sleep-current test in CI or production.",
          "Keep a development build that disables deep sleep so debugging remains possible, and never ship it.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does race-to-idle usually win?", answer: "Work completes proportionally faster at higher clock while leakage and fixed overheads accrue per unit time awake, so finishing fast and deep-sleeping minimizes total charge — except during peripheral-bound waits." },
          { question: "Why does regulator quiescent current dominate at sleep loads?", answer: "At microamp loads the regulator's own housekeeping draw rivals or exceeds the load itself; percentage efficiency ratings measured at milliamps are irrelevant there." },
          { question: "How does tickless idle work?", answer: "The RTOS suppresses the periodic tick, programs a low-power timer for the next scheduled deadline, sleeps deeply, and corrects the tick count from the timer on wake." },
          { question: "What are the classic sleep-current leaks?", answer: "Floating inputs, pull-ups fighting driven levels, always-on sensors and regulators, LEDs, debug logic held awake, peripheral clocks left enabled, and brown-out detectors in continuous mode." },
        ],
      },
    ],
    sources: [freertosLowPower],
    related: ["power-and-energy", "rtos-task-scheduling", "esp32-environment-monitor"],
  },
  {
    slug: "watchdogs-faults-and-recovery",
    libraryId: "technical",
    collectionId: "embedded-firmware",
    title: "Watchdogs, faults & recovery",
    summary: "Independent and window watchdogs, task-health supervision, Cortex-M fault forensics, reset-cause handling, crash evidence, and designing the safe state.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A watchdog proves liveness, not correctness",
        body: [
          "A watchdog resets the system unless firmware refreshes it in time. That single mechanism converts an unknown class of failures — infinite loops, deadlocks, runaway interrupts, latched-up peripherals, corrupted state — into a known event: a reset with a recorded cause. The independent watchdog runs from its own oscillator so it survives clock failures; a window watchdog also resets if kicked too early, catching the failure mode where a crashed program loops tightly through the kick. Once enabled, a proper watchdog cannot be disabled until reset — that's a feature.",
          "Where you kick from is the entire design. Kicking from a timer interrupt proves only that the timer interrupt runs — the classic anti-pattern, satisfied happily while every task is deadlocked. Meaningful coverage comes from supervision: each critical task periodically sets its health bit, and one supervisor checks that all expected bits arrived within their windows before kicking the hardware dog. Timeout sizing must cover the longest legitimate quiet period (flash erases, radio operations) with margin, or those operations need explicit accommodation.",
        ],
      },
      {
        type: "code",
        heading: "Task-health supervision pattern",
        intro: "The hardware watchdog gets kicked only when every registered task has recently proven it is alive and making progress.",
        language: "C / RTOS",
        code: "static volatile uint32_t health_bits;\n#define HEALTH_ALL  ((1u << TASK_COUNT) - 1u)\n\nvoid task_report_alive(task_id_t id) {      /* called from each task's loop */\n    atomic_fetch_or(&health_bits, 1u << id);\n}\n\nvoid supervisor_task(void *arg) {\n    for (;;) {\n        vTaskDelay(pdMS_TO_TICKS(500));\n        if (atomic_exchange(&health_bits, 0) == HEALTH_ALL) {\n            wdt_kick();                     /* all tasks checked in         */\n        }                                   /* else: let the dog bite, and\n                                               record which bits were missing */\n    }\n}",
      },
      {
        type: "prose",
        heading: "When it fires, learn something",
        body: [
          "A reset you can't explain is a bug you still have. At every boot, read and log the reset-cause register (power-on, brown-out, watchdog, software, pin) before anything clears it. Pair that with crash evidence preserved in a .noinit RAM region — a magic cookie, the missing health bits, the active task, and for CPU faults, the register snapshot. Cortex-M fault handlers make this concrete: the hardware stacks R0–R3, R12, LR, PC, and xPSR at fault entry, and the fault status registers (CFSR, HFSR, with BFAR/MMFAR holding the offending address when valid) say what happened. A small assembly shim that passes the stacked frame to a C function recovers the faulting PC — the single most valuable number in embedded debugging.",
          "Then design the response. Development builds may halt at a breakpoint; production builds should record evidence and reset. Guard against reset storms with a boot counter in noinit RAM: after N consecutive crashes within a window, enter a degraded safe mode that keeps the device reachable (communications up, application logic minimal) instead of thrashing. Brown-out detection deserves explicit configuration — the gray zone where a sagging supply corrupts execution without resetting is worse than either extreme.",
        ],
      },
      {
        type: "table",
        heading: "Cortex-M fault forensics quick map",
        columns: ["Register / value", "What it tells you"],
        rows: [
          ["Stacked PC (frame[6])", "The instruction that faulted — start here"],
          ["CFSR: usage faults", "Undefined instruction, divide-by-zero, unaligned access"],
          ["CFSR: bus faults (+BFAR)", "Bad address access — often a wild or freed pointer; BFAR holds the address if valid"],
          ["CFSR: memmanage (+MMFAR)", "MPU violation — a guard region doing its job"],
          ["HFSR FORCED bit", "A configurable fault escalated to HardFault (usually because it was disabled)"],
          ["EXC_RETURN in LR", "Which stack (MSP/PSP) holds the frame — needed to find it"],
        ],
      },
      {
        type: "callout",
        heading: "During reset, firmware does not exist — hardware must define safety",
        body: "From the moment a watchdog bites until your init code runs, every output sits at its reset default modified only by external pulls. A motor-driver enable, a heater gate, or a valve solenoid must be held safe by pull resistors and driver-IC defaults, not by firmware promises. Review every safety-relevant output for its state during reset, during the bootloader, and during firmware update.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Watchdog and fault design review",
        items: [
          "Enable the independent watchdog as early as boot allows; verify it cannot be disabled afterward.",
          "Supervise all critical tasks' progress, not one timer; record which task failed to check in.",
          "Size the timeout against the longest legitimate operation, including flash erases and radio joins.",
          "Implement fault handlers that capture the stacked frame and status registers into noinit RAM, and test them with deliberate faults.",
          "Read, log, and clear the reset cause every boot; alert on watchdog and brown-out causes in telemetry.",
          "Add a boot-loop limiter with a reachable safe mode, and verify every safety output's hardware state during reset.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What does a window watchdog catch that a simple one doesn't?", answer: "Code that crashed into a tight loop still kicking the dog — kicking earlier than the window opens also forces a reset, so mere execution isn't enough to look alive." },
          { question: "Why is kicking from a timer ISR an anti-pattern?", answer: "Interrupts keep running while tasks deadlock, so the kick proves nothing about the work the watchdog exists to protect; supervision must aggregate real task progress." },
          { question: "How do you recover the faulting instruction address on Cortex-M?", answer: "The hardware pushes a frame at exception entry; using EXC_RETURN to select MSP or PSP, read the stacked PC at offset 6 words — that plus CFSR/BFAR identifies the crash." },
          { question: "Why does crash evidence live in a .noinit section?", answer: "Startup zeroes .bss and rewrites .data, destroying anything there; a section the runtime never initializes survives the reset, gated by a magic cookie so garbage after power-on isn't mistaken for evidence." },
        ],
      },
    ],
    sources: [armCortexMFaults],
    related: ["memory-maps-linkers-and-startup", "observability-for-devices", "bootloaders-and-firmware-update"],
  },
];
