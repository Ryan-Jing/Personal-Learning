import type { Note, Source } from "./library";

const adUart: Source = {
  title: "UART: A Hardware Communication Protocol",
  publisher: "Analog Devices",
  url: "https://www.analog.com/en/resources/analog-dialogue/articles/uart-a-hardware-communication-protocol.html",
  kind: "Reference",
};

const adSpi: Source = {
  title: "Introduction to SPI Interface",
  publisher: "Analog Devices",
  url: "https://www.analog.com/en/resources/analog-dialogue/articles/introduction-to-spi-interface.html",
  kind: "Reference",
};

const nxpI2c: Source = {
  title: "UM10204 — I2C-bus Specification and User Manual",
  publisher: "NXP Semiconductors",
  url: "https://www.nxp.com/docs/en/user-guide/UM10204.pdf",
  kind: "Documentation",
};

const nxpI2s: Source = {
  title: "I2S Bus Specification",
  publisher: "NXP Semiconductors (originally Philips)",
  url: "https://www.nxp.com/docs/en/user-manual/UM11732.pdf",
  kind: "Documentation",
};

export const onboardProtocolNotes: Note[] = [
  {
    slug: "uart-fundamentals",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "UART & asynchronous serial",
    summary: "Framing, baud-rate tolerance, oversampling, flow control, error flags, RS-232 versus logic-level signaling, and building reliable links on top of raw bytes.",
    readingTime: 15,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Asynchronous means the clock is reconstructed",
        body: [
          "A UART sends data with no shared clock. The line idles high; a start bit (a falling edge to logic low) tells the receiver a frame is beginning. The receiver then samples at intervals derived from its own local clock, typically using a 16× oversampling counter that locates the middle of each bit. Data follows LSB first, then an optional parity bit, then one or more stop bits that return the line high and guarantee an edge for the next start bit.",
          "Because each frame resynchronizes on the start-bit edge, timing error only accumulates across one frame. That is the entire trick of asynchronous serial: both sides agree on a nominal baud rate ahead of time, and framing plus oversampling absorb the difference between their real clocks.",
          "Everything above the byte is your problem. A UART delivers bytes with no addressing, no acknowledgment, no delivery guarantee, and no message boundaries. Any real product traffic needs a framing layer — length-prefixed packets, SLIP/COBS byte stuffing, or a line-based protocol — plus a CRC and a resynchronization strategy for when a byte is lost or corrupted mid-stream.",
        ],
      },
      {
        type: "code",
        heading: "Anatomy of an 8N1 frame",
        intro: "Ten bit-times move eight data bits, so the raw efficiency of 8N1 is 80%. The receiver samples near the center of each bit period.",
        language: "timing",
        code: "idle ──┐  ┌─────────────────────────────────────┐ stop  idle\n       │  │ D0  D1  D2  D3  D4  D5  D6  D7 │  ┌──────────\n       └──┘                                 └──┘\n      start   LSB first ──────────▶ MSB\n\n |◀ 1 bit ▶|  receiver samples at the center of each bit,\n              re-aligned by every start-bit edge",
      },
      {
        type: "formula",
        heading: "The clock-tolerance budget",
        formula: "ε_tx + ε_rx < 0.5 bit / 9.5 bits ≈ 5 %",
        explanation: "The last sample of an 8N1 frame (the stop bit) lands about 9.5 bit-times after the start edge. Total frequency mismatch must keep that sample inside the correct bit, minus margin consumed by edge rise time, oversampling granularity, and noise. In practice keep each side within about ±2%.",
        terms: [
          { symbol: "ε_tx", meaning: "Transmitter baud-rate error", unit: "fraction" },
          { symbol: "ε_rx", meaning: "Receiver baud-rate error", unit: "fraction" },
          { symbol: "9.5", meaning: "Bit periods from start edge to stop-bit center", unit: "bit-times" },
        ],
      },
      {
        type: "table",
        heading: "Configuration choices and what to verify",
        columns: ["Choice", "Typical value", "What to verify"],
        rows: [
          ["Baud rate", "115200 or as needed", "Achievable divider error from the actual clock tree on both ends"],
          ["Data bits / parity", "8 data, no parity", "Parity catches single-bit errors only; a CRC in your framing layer is stronger"],
          ["Stop bits", "1", "2 stop bits buys inter-frame slack for slow receivers"],
          ["Flow control", "None or RTS/CTS", "Buffer depth and worst-case service latency at full line rate"],
          ["Clock source", "Crystal-derived", "Internal RC oscillators drift with temperature; check error over the full range"],
        ],
      },
      {
        type: "prose",
        heading: "Electrical layers wear the same protocol",
        body: [
          "The logic-level UART on an MCU pin (0 V / VDD, idle high) is not RS-232. RS-232 uses inverted, wide-swing signaling (roughly ±5 V to ±15 V) through a transceiver such as a MAX232-class part, tolerates only short point-to-point cables, and remains everywhere as a console and legacy interface. The same UART byte stream can also ride RS-485 differential signaling for long, noisy, multi-drop runs. Choose the electrical layer by distance and environment; the framing stays identical.",
          "Logic-level UART is single-ended and referenced to ground, so a link between two separately powered boards needs a common ground reference, and the allowable ground offset is only a few hundred millivolts. Mismatched logic levels are the other classic hazard: a 5 V transmitter into a 3.3 V receiver needs level shifting or at minimum a verified 5 V-tolerant pin, not hope.",
        ],
      },
      {
        type: "prose",
        heading: "Flow control, FIFOs, and error flags",
        body: [
          "At 115200 baud a byte arrives every 87 µs. If the receiver cannot guarantee servicing at that rate, bytes are silently lost through overrun. The defenses are hardware FIFOs, DMA into a circular buffer (with the idle-line interrupt marking end of burst), and hardware RTS/CTS flow control, where RTS de-asserts while the receive buffer is nearly full. Software flow control (XON/XOFF) consumes byte values from the data stream and fails on binary payloads unless escaped.",
          "Use the error flags. Framing errors (stop bit not high) usually mean baud mismatch or noise; parity errors mean corruption; overrun means your software architecture, not the line, is failing. A break condition — the line held low for longer than a frame — is detectable in hardware and useful as an out-of-band reset or auto-baud trigger.",
        ],
      },
      {
        type: "callout",
        heading: "The classic bring-up failures are wiring, not protocol",
        body: "TX must cross to RX (and grounds must connect) between two devices. A silent link is usually a straight-through TX–TX connection, a missing ground, an inverted RS-232 level plugged into a logic-level pin, or a baud-rate divider that cannot hit the target rate from the chosen peripheral clock.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "UART design review",
        items: [
          "Compute worst-case baud error on both ends from the real clock sources and dividers, including temperature.",
          "Confirm logic levels, idle polarity, and any inversion between the two endpoints.",
          "Size receive buffering and interrupt/DMA architecture for sustained full-rate traffic.",
          "Define a framing layer with CRC and a resynchronization rule; never ship raw unstructured bytes.",
          "Decide flow-control behavior and what happens when the peer ignores it.",
          "Bring TX, RX, and ground to test points; a logic analyzer on a UART is the cheapest debugging you will ever buy.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How does the receiver know where bits are without a clock line?", answer: "The start-bit falling edge re-aligns a local oversampling counter each frame; samples are taken near each bit center using the receiver's own clock." },
          { question: "Why does 8N1 tolerate roughly ±2% clock error per side?", answer: "Timing error accumulates only until the last sampled bit, about 9.5 bit-times after the start edge; total mismatch must stay under about half a bit, and margin is shared between both ends and signal-quality effects." },
          { question: "What does a framing error usually indicate?", answer: "The receiver sampled a low where a stop bit should be — most often baud mismatch, a glitched start-bit detection, noise, or a break condition." },
          { question: "Why is parity rarely sufficient in products?", answer: "It detects only odd numbers of bit errors per frame and provides no message integrity; a CRC over a framed packet detects burst errors and protects the whole payload." },
        ],
      },
    ],
    sources: [adUart],
    related: ["rs485-differential-serial", "choosing-a-communication-interface", "dma-and-data-movement"],
  },
  {
    slug: "spi-bus",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "SPI: the synchronous shift-register bus",
    summary: "Full-duplex exchange, the four clock modes, chip-select discipline, round-trip timing limits, multi-peripheral topologies, and quad-SPI for memories.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "SPI is two shift registers in a loop",
        body: [
          "SPI is the least abstract common bus: the controller drives a clock (SCK) and a chip select (CS), and each clock edge shifts one bit out of the controller (COPI/MOSI) while shifting one bit in from the peripheral (CIPO/MISO). After eight clocks, the two devices have exchanged bytes. Transmission and reception are the same operation — to read, you must clock out something, usually dummy bytes.",
          "There is no addressing, no acknowledgment, and no error detection. A device is selected by its dedicated CS line, a transaction is delimited by CS assertion and release, and correctness is entirely the designer's job. That minimalism is why SPI scales from 1 MHz sensors to 100+ MHz flash memories: nothing in the protocol itself limits speed — only signal integrity and device timing do.",
          "Because the clock travels with the data, there is no baud-rate tolerance problem as with UART. The controller can even pause the clock mid-byte. This makes SPI robust against clock mismatch, but every bit of protocol structure (registers, commands, CRCs) is defined per-device by the datasheet, and no two vendors agree.",
        ],
      },
      {
        type: "table",
        heading: "The four SPI modes",
        columns: ["Mode", "CPOL (idle level)", "CPHA (sample edge)", "Data is sampled on"],
        rows: [
          ["0", "0 (idle low)", "0", "Rising edge, shifted out on falling"],
          ["1", "0 (idle low)", "1", "Falling edge, shifted out on rising"],
          ["2", "1 (idle high)", "0", "Falling edge, shifted out on rising"],
          ["3", "1 (idle high)", "1", "Rising edge, shifted out on falling"],
        ],
      },
      {
        type: "callout",
        heading: "Trust the timing diagram, not the mode number",
        body: "Datasheets frequently describe modes inconsistently or support more than one. Read the peripheral's timing diagram — which edge launches data, which edge samples it, and what CS must do between words — and configure the controller to match. Mode confusion produces data that is shifted by one bit or works only at low speed, which is worse than failing outright.",
        tone: "warning",
      },
      {
        type: "prose",
        heading: "The real speed limit is the round trip",
        body: [
          "For controller-to-peripheral data, timing is easy: the peripheral samples a signal that traveled one way. Reading is harder. The controller launches a clock edge; that edge propagates to the peripheral; the peripheral's clock-to-output delay puts data on CIPO; the data propagates back; and it must arrive before the controller's sampling edge minus setup time. The total loop — trace delay both ways plus the peripheral's t_v — must fit in one half or one full clock period depending on mode.",
          "This is why a bus that runs at 50 MHz on short traces fails through an isolator, level shifter, or cable: each element adds nanoseconds to the loop. Options are lowering the clock, using a controller feature that delays the sampling point, or (for memories) using DDR/data-strobe schemes. Signal-integrity practice is standard high-speed digital: series termination at the driver, continuous return path, short stubs, and one clock load per line where possible.",
        ],
      },
      {
        type: "prose",
        heading: "Topologies, chip selects, and boot states",
        body: [
          "Multiple peripherals usually share SCK, COPI, and CIPO in a star, each with its own CS. Every unselected device must release CIPO to high impedance; a device that drives CIPO while deselected (a real bug in some parts, and a guaranteed one if two CS lines are ever asserted together) corrupts every other read. Daisy-chaining — data out of one device into the next, one long shift register — trades pin count against protocol complexity and is common for LED drivers and gate drivers.",
          "Chip-select timing carries protocol meaning: many devices latch a command only on CS rising edge, require minimum CS setup and hold around the clock burst, or need CS toggled between words. And mind the reset state: MCU pins float during and after reset, so every CS (and any flash HOLD/WP pin) needs a pull-up so peripherals sit deselected until firmware takes control — a floating CS on a boot flash can corrupt it.",
          "Quad and octal SPI extend the data path to 4 or 8 lanes for memories, add command-address-data phases, dummy cycles for read latency, and memory-mapped execute-in-place (XIP) modes. They inherit all SPI timing physics with tighter margins.",
        ],
      },
      {
        type: "code",
        heading: "Transaction discipline in firmware",
        intro: "Treat CS assertion to release as an atomic transaction owned by one context; never let two drivers interleave on the same bus without a lock.",
        language: "C",
        code: "status_t sensor_read(spi_bus_t *bus, uint8_t reg, uint8_t *out, size_t n) {\n    spi_bus_lock(bus);              /* one transaction owner at a time  */\n    cs_assert(SENSOR_CS);\n    spi_transfer_byte(bus, reg | READ_FLAG);\n    spi_transfer(bus, NULL, out, n); /* clock dummy bytes to read      */\n    cs_release(SENSOR_CS);\n    spi_bus_unlock(bus);\n    return STATUS_OK;               /* no protocol-level ack exists    */\n}",
      },
      {
        type: "checklist",
        heading: "SPI design review",
        items: [
          "Match CPOL/CPHA and CS behavior to each peripheral's timing diagram, not its marketing table.",
          "Budget the read round trip: trace delay, peripheral clock-to-out, level shifters, and controller setup time at the target clock.",
          "Pull every CS (and memory HOLD/WP) to its inactive state for reset and boot conditions.",
          "Verify unselected devices tri-state CIPO; check for bus contention with a scope, not assumptions.",
          "Serialize bus access in firmware with a lock or a single owner task; include DMA completion in the transaction boundary.",
          "Add CRC or readback verification for critical writes — the protocol will not tell you about corruption.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does SPI have no baud-rate tolerance problem?", answer: "The clock is transmitted alongside the data, so the peripheral samples on real clock edges rather than reconstructing timing from a nominal rate." },
          { question: "What limits maximum SPI read speed?", answer: "The round trip: clock propagation to the peripheral, its clock-to-output delay, data propagation back, and controller setup time must all fit within the sampling interval." },
          { question: "Why do chip selects need pull-ups at reset?", answer: "MCU pins float until firmware configures them; without pull-ups, peripherals may see assertions, drive the shared data line, or a boot flash may receive corrupting clock activity." },
          { question: "When does daisy-chaining beat a star topology?", answer: "When many identical devices need few pins and data can be shifted through all of them as one long register — accepting that one transaction now addresses the whole chain." },
        ],
      },
    ],
    sources: [adSpi],
    related: ["i2c-bus", "choosing-a-communication-interface", "return-paths-and-stackup"],
  },
  {
    slug: "i2c-bus",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "I2C: the two-wire management bus",
    summary: "Open-drain signaling, addressing, ACK/NACK, clock stretching, arbitration, pull-up sizing, bus capacitance, lockup recovery, and SMBus differences.",
    readingTime: 16,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Open-drain is the whole design",
        body: [
          "I2C uses two wires, SDA and SCL, that no device ever drives high. Devices only pull the lines low; resistors pull them up. This wired-AND arrangement is what enables everything characteristic about I2C: any device can hold the clock low to stall the bus (clock stretching), multiple controllers can transmit simultaneously and detect collisions without damage (arbitration — the first controller to release the line while another holds it low loses and backs off), and a low state always wins.",
          "A transaction starts with a START condition (SDA falling while SCL is high), a 7-bit address plus a read/write bit, and an ACK slot where the addressed device pulls SDA low. Every byte is acknowledged. A repeated START lets a controller chain a write (typically a register pointer) and a read into one atomic transaction without releasing the bus — the standard way to read a device register. A STOP (SDA rising while SCL high) frees the bus. 10-bit addressing exists but is rare.",
          "Standard mode runs at 100 kHz, Fast mode at 400 kHz, Fast mode plus at 1 MHz. High-speed (3.4 MHz) and Ultra-fast modes change the electrical rules and are uncommon in general-purpose designs. Throughput is modest by design — I2C is a management and configuration bus, not a data-plane bus.",
        ],
      },
      {
        type: "formula",
        heading: "Pull-up sizing bounds",
        formula: "R_min = (VDD − V_OL) / I_OL      R_max ≈ t_r / (0.847 × C_b)",
        explanation: "The pull-up must be large enough that a device sinking its rated current still reaches a valid logic low, and small enough that the RC rise time through total bus capacitance meets the spec (300 ns for Fast mode, 1000 ns for Standard). At 3.3 V with 3 mA sink capability, R_min ≈ 1 kΩ; with 200 pF of bus, Fast mode needs roughly R ≤ 1.8 kΩ. The window narrows as capacitance grows — the specification caps the bus at 400 pF.",
        terms: [
          { symbol: "V_OL / I_OL", meaning: "Output low voltage at rated sink current", unit: "V, A" },
          { symbol: "t_r", meaning: "Maximum allowed rise time (30%→70%)", unit: "ns" },
          { symbol: "C_b", meaning: "Total bus capacitance: pins, traces, cable", unit: "pF" },
        ],
      },
      {
        type: "table",
        heading: "Bus behaviors worth knowing cold",
        columns: ["Mechanism", "What it does", "What can go wrong"],
        rows: [
          ["Clock stretching", "A device holds SCL low to delay the controller", "Some controllers ignore it and corrupt slow-device reads"],
          ["Repeated START", "Write-then-read without releasing the bus", "Using STOP+START instead lets another controller interleave"],
          ["Arbitration", "Multiple controllers coexist losslessly", "Only works if all timing configs are compatible"],
          ["ACK/NACK", "Per-byte delivery confirmation", "A NACK is also the normal way a read is terminated — not always an error"],
          ["General call / device ID", "Broadcast and identification features", "Rarely implemented consistently; do not depend on them"],
        ],
      },
      {
        type: "prose",
        heading: "Bus lockup and recovery",
        body: [
          "The famous I2C failure: the controller resets mid-read while a peripheral is holding SDA low to output a zero bit. After reset, the controller sees SDA stuck low and cannot issue a START; the peripheral is waiting for clocks that never come. Neither side is broken — the shared state machine is. The standard recovery is to bit-bang up to nine SCL pulses (letting the peripheral shift out its remaining bits) until SDA releases, then issue a STOP. Every production I2C driver should implement this at initialization.",
          "Address conflicts are the other planning failure. Many device families offer only one or two address-select pins, and two identical sensors may collide. The tools are address-translation muxes and switches (PCA954x class), separate buses, or devices with configurable addresses. Bus buffers and repeaters extend capacitance limits and enable hot-swap isolation, but they have V_OL offset tricks that constrain what else sits on the segment — read their datasheets carefully. Level shifting between voltage domains is standard practice with a discrete FET pair or a translator IC.",
        ],
      },
      {
        type: "prose",
        heading: "SMBus is I2C with rules",
        body: [
          "SMBus (and PMBus above it) tightens I2C for system management: defined command protocols, a 35 ms clock-low timeout that automatically un-sticks the bus, optional packet error checking (an appended CRC-8), the SMBALERT# line for device-initiated attention, and fixed logic thresholds. If a device datasheet says SMBus, the timeout matters: clock-stretching or stalling the bus longer than the timeout aborts the transaction. Mixed I2C/SMBus buses generally work but should be reviewed against the stricter rules.",
        ],
      },
      {
        type: "callout",
        heading: "I2C is a board-level bus — respect the capacitance",
        body: "Running I2C down a cable invites trouble: capacitance slows edges past spec, ESD and ground offsets have no differential rejection, and connectors add intermittency to a protocol with shared state. For off-board runs, use a differential transport or a purpose-built extender, or switch protocols. On-board, an intermittent NACK at 400 kHz with marginal rise times is the signature of an oversized pull-up or an overloaded bus.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "I2C design review",
        items: [
          "Sum bus capacitance (pins, traces, any cable) and size one pull-up pair per bus segment from the bounds above.",
          "Audit every device address at schematic time, including all strap options and any address-pointer collisions.",
          "Confirm the controller supports clock stretching if any peripheral stretches.",
          "Implement 9-clock bus recovery and a transaction timeout in the driver.",
          "Scope rise time and V_OL at the fastest configured speed on the assembled board.",
          "Check behavior when one device is unpowered — its internal ESD diodes can clamp the whole bus low.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is I2C open-drain?", answer: "So any device can safely pull the line low regardless of what others do — enabling wired-AND arbitration, clock stretching, and multi-controller operation without bus contention damage." },
          { question: "What sets the pull-up resistor window?", answer: "The low side comes from V_OL at the rated sink current; the high side from meeting the rise-time spec into the total bus capacitance." },
          { question: "Why does a repeated START matter for register reads?", answer: "It makes the pointer write and the data read one atomic bus transaction, preventing another controller from moving the register pointer in between." },
          { question: "How do you recover a bus with SDA stuck low?", answer: "Clock SCL up to nine times so the stuck peripheral finishes shifting its byte, then issue a STOP once SDA is released." },
        ],
      },
    ],
    sources: [nxpI2c],
    related: ["spi-bus", "choosing-a-communication-interface", "pcb-noise-and-grounding"],
  },
  {
    slug: "i2s-digital-audio",
    libraryId: "technical",
    collectionId: "communication-protocols",
    title: "I2S & digital audio interfaces",
    summary: "Bit clock, word select, and data framing; I2S versus justified formats and TDM; master clocks, jitter, sample-rate families, and codec integration.",
    readingTime: 14,
    updatedAt: "Jul 17",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Three wires carrying PCM samples",
        body: [
          "I2S (Inter-IC Sound) moves uncompressed PCM audio between converters, codecs, DSPs, and SoCs. Three signals do the work: a bit clock (BCLK/SCK) that paces every data bit, a word-select or left-right clock (WS/LRCLK) that toggles once per sample to mark which channel is on the wire, and serial data (SD). One WS period is one frame: left sample while WS is low, right sample while WS is high, MSB first.",
          "In the original Philips I2S format, the MSB of each word begins one BCLK period after the WS transition — that single-cycle delay is the format's signature and its most common integration bug. Left-justified format starts the MSB exactly on the WS edge; right-justified aligns the LSB to the end of the half-frame, which means the receiver must know the word length to find the MSB. All three run on identical wires; only the alignment differs, so both ends must agree on format, word length, and slot width.",
          "TDM (time-division multiplexing) extends the same idea past stereo: a frame-sync pulse marks the start of a frame containing 4, 8, or 16 time slots, one per channel, at correspondingly higher bit-clock rates. Multi-microphone arrays and multichannel amplifiers live here. PDM — a one-bit oversampled stream from MEMS microphones — is a different beast that requires decimation filtering, usually in the SoC peripheral.",
        ],
      },
      {
        type: "formula",
        heading: "Clock arithmetic",
        formula: "BCLK = f_s × slot_width × channels      MCLK = 256 × f_s (typical)",
        explanation: "48 kHz stereo in 32-bit slots needs BCLK = 48 000 × 32 × 2 = 3.072 MHz. Many codecs also require a free-running master clock (commonly 256×fs, sometimes 384× or 512×) to run their internal oversampling converters and filters; some can derive it internally via PLL from BCLK. Get MCLK requirements from the codec datasheet before choosing your clock tree.",
        terms: [
          { symbol: "f_s", meaning: "Sample rate", unit: "Hz" },
          { symbol: "slot_width", meaning: "Bits allocated per channel slot (≥ word length)", unit: "bits" },
          { symbol: "MCLK", meaning: "Codec master/system clock", unit: "Hz" },
        ],
      },
      {
        type: "table",
        heading: "Format cheat sheet",
        columns: ["Format", "MSB position", "Notes"],
        rows: [
          ["Philips I2S", "One BCLK after WS edge", "The default meaning of 'I2S'; WS low = left"],
          ["Left-justified", "On the WS edge", "WS polarity often inverted vs I2S; check the datasheet"],
          ["Right-justified", "LSB aligned to end of half-frame", "Receiver must know word length; least robust choice"],
          ["TDM", "Slot-mapped after frame sync", "4–16 channels; slot width and sync pulse style vary by vendor"],
          ["PDM", "1-bit oversampled stream", "Not PCM; needs decimation; common for MEMS microphones"],
        ],
      },
      {
        type: "prose",
        heading: "Clock architecture decides audio quality",
        body: [
          "Decide first who masters the clocks. If the codec masters, its low-jitter oscillator paces the system and the SoC peripheral tracks; if the SoC masters, its audio PLL must synthesize the exact rates. The two consumer sample-rate families — 44.1 kHz (CD-derived: 44.1k, 88.2k, 176.4k) and 48 kHz (48k, 96k, 192k) — are not related by any rational clock ratio that ordinary dividers produce, so a design that must serve both needs either two crystal frequencies (e.g., 22.5792 and 24.576 MHz), a fractional PLL, or asynchronous sample-rate conversion.",
          "Jitter on the clock that strikes the converter translates directly into noise and spurious tones in the analog output — the DAC samples at the wrong instants. Fractional dividers and jittery PLLs that are fine for digital logic can audibly degrade a good DAC. Route MCLK and BCLK as you would any fast single-ended signal: short, series-terminated at the source, over a continuous reference plane, and away from the analog output section. When multiple converters must be sample-synchronous, they must share clocks with matched WS phase, not merely equal frequencies.",
        ],
      },
      {
        type: "callout",
        heading: "Format mismatches produce plausible-sounding wrong audio",
        body: "A one-bit alignment error (I2S versus left-justified) halves the signal and mangles the sign bit; 16-bit data read as 24-bit shifts levels by 48 dB; swapped WS polarity exchanges channels. All of these still make recognizable sound, so verify with a scope against the datasheet timing diagram and a known test tone — do not trust your ears to catch a format bug.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Digital audio design review",
        items: [
          "Write down format, word length, slot width, WS polarity, and clock master for every link — then verify each against the datasheet diagrams.",
          "Confirm the codec's MCLK requirement and ratio options before finalizing the clock tree.",
          "Plan for both 44.1 kHz and 48 kHz families if the product needs them; decide crystal, PLL, or ASRC strategy.",
          "Feed converters from the cleanest available clock; keep audio clocks away from switching supplies and RF.",
          "Use DMA with ping-pong buffers sized for worst-case scheduling latency; an underrun is an audible pop.",
          "Bring BCLK, WS, and SD to probe-able test points and validate alignment with a scope at bring-up.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What distinguishes Philips I2S from left-justified format?", answer: "I2S delays the MSB one BCLK period after the WS transition; left-justified places the MSB exactly on the edge. Same wires, incompatible alignment." },
          { question: "Why do codecs often need an MCLK at 256×fs?", answer: "Their internal delta-sigma modulators and digital filters run at a high oversampling rate derived from that master clock, independent of the bit clock." },
          { question: "Why does clock jitter matter more at the DAC than inside the SoC?", answer: "Digital logic only needs edges to meet setup/hold, but a converter's output is the signal value at the sampling instant — timing error becomes amplitude error, i.e., noise and spurs." },
          { question: "Why can't one integer divider serve both 44.1 kHz and 48 kHz?", answer: "The two families come from different historical base rates with no small rational relationship, so hardware needs separate crystals, fractional synthesis, or asynchronous rate conversion." },
        ],
      },
    ],
    sources: [nxpI2s],
    related: ["i2c-bus", "adc-dac-signal-conditioning", "dma-and-data-movement"],
  },
];
