import type { Note, Source } from "./library";

const mipiCsi2: Source = {
  title: "MIPI CSI-2 Camera Serial Interface",
  publisher: "MIPI Alliance",
  url: "https://www.mipi.org/specifications/csi-2",
  kind: "Reference",
};

const mipiCurrentSpecs: Source = {
  title: "Current MIPI Camera & Imaging Specifications",
  publisher: "MIPI Alliance",
  url: "https://www.mipi.org/current-specifications",
  kind: "Reference",
};

const usbVideoClass: Source = {
  title: "USB Video Class v1.5 Document Set",
  publisher: "USB Implementers Forum",
  url: "https://www.usb.org/documents?items_per_page=50&order=title&search=Video&sort=desc",
  kind: "Reference",
};

const onvifProfiles: Source = {
  title: "ONVIF Profiles",
  publisher: "ONVIF",
  url: "https://www.onvif.org/profiles/",
  kind: "Reference",
};

const rtspRfc: Source = {
  title: "RFC 7826 — Real-Time Streaming Protocol Version 2.0",
  publisher: "IETF / RFC Editor",
  url: "https://www.rfc-editor.org/info/rfc7826",
  kind: "Reference",
};

const emva1288: Source = {
  title: "EMVA 1288 — Standard for Characterization of Image Sensors and Cameras",
  publisher: "European Machine Vision Association",
  url: "https://www.emva.org/standards-technology/emva-1288/",
  kind: "Reference",
};

const iso12233: Source = {
  title: "ISO 12233:2024 — Digital cameras: resolution and spatial frequency responses",
  publisher: "International Organization for Standardization",
  url: "https://www.iso.org/standard/88626.html",
  kind: "Reference",
};

const iso15739: Source = {
  title: "ISO 15739:2023 — Electronic still-picture imaging noise measurements",
  publisher: "International Organization for Standardization",
  url: "https://www.iso.org/standard/82233.html",
  kind: "Reference",
};

const ethernetPoe: Source = {
  title: "The ABCs and 123s of PoE",
  publisher: "Ethernet Alliance",
  url: "https://ethernetalliance.org/blog/2020/07/22/the-abcs-and-123s-of-poe/",
  kind: "Reference",
};

export const cameraSystemsNotes: Note[] = [
  {
    slug: "camera-system-architecture",
    libraryId: "technical",
    collectionId: "camera-systems",
    title: "Camera system architecture",
    summary: "The complete camera chain from photons to useful data: lens, sensor, timing, electrical interfaces, ISP, encoding, transport, storage, and the system trade-offs that decide whether a camera is a component, a module, or a product.",
    readingTime: 20,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "A camera is an analog measurement system wrapped in digital plumbing",
        body: [
          "The useful mental model starts before the connector. A scene emits or reflects light; the lens forms an image on the sensor; the sensor converts photons into charge; analog front-end circuits turn charge into voltages; ADCs create pixel values; timing logic moves those pixels through a high-speed interface; an image signal processor corrects defects and turns raw sensor data into something visually or algorithmically useful; then encoders, networks, storage, or application software consume it. Most camera failures are caused by treating one of those layers as independent when it is not.",
          "The lens determines focus, field of view, distortion, depth of field, flare, and how much light reaches each pixel. The sensor determines pixel size, shutter type, dynamic range, noise floor, frame timing, and output format. The board determines whether the rails, clock, layout, connector, and cable preserve that signal. The processor determines whether raw data can be received at the required bandwidth and transformed in real time. The product determines whether the image is good enough under the lighting, vibration, temperature, privacy, security, and manufacturing variation it will actually see.",
        ],
      },
      {
        type: "diagram",
        heading: "End-to-end imaging pipeline",
        intro: "Use this as the first architecture sketch for any camera product or board-level camera integration.",
        art: `Scene
  ↓ light, spectrum, motion
Lens / cover glass / IR filter
  ↓ focus, distortion, vignetting, flare
Image sensor
  ↓ exposure, gain, shutter, ADC, pixel defects
MIPI CSI-2 / USB UVC / Ethernet
  ↓ timing, bandwidth, EMI, protocol compliance
ISP / SoC / MCU
  ↓ demosaic, denoise, color, HDR, encode, metadata
Application
  ↓ detection, display, recording, control, evidence, diagnostics`,
        caption: "Every layer adds both capability and error. A good camera architecture allocates requirements across all layers instead of saying only “use a better sensor.”",
      },
      {
        type: "table",
        heading: "Architectural choices",
        columns: ["Choice", "When it fits", "Main engineering risks"],
        rows: [
          ["Raw sensor into local SoC", "Phones, embedded vision, robotics, products where image tuning and latency matter", "MIPI layout, rail sequencing, sensor driver support, ISP tuning, thermal load"],
          ["USB camera module", "Fast prototyping, PC/edge-computer products, standard OS support", "USB bandwidth, cable quality, UVC control limits, enumeration reliability, mechanical retention"],
          ["IP/PoE camera", "Security, remote monitoring, long cable runs, distributed installations", "Network security, PoE power budget, stream latency, firmware update strategy, ONVIF/RTSP compatibility"],
          ["Camera plus external serializer", "Automotive, long-reach embedded cameras, harsh environments", "Cable EMC, link training, synchronization, connector sealing, supply transients"],
          ["Smart camera", "Inspection or AI product where camera runs local processing", "Compute thermal design, model updates, local storage endurance, cybersecurity, observability"],
        ],
      },
      {
        type: "prose",
        heading: "Bandwidth, latency, and frame timing drive the architecture",
        body: [
          "A camera stream is large. Raw bandwidth is roughly width × height × bits per pixel × frames per second, before protocol overhead and blanking. A 1920×1080 stream at 60 frames/s and 12 bits/pixel is about 1.49 Gbit/s of pixel payload before overhead. A 4K stream at 60 frames/s can force the decision between multiple MIPI lanes, compression, a different SoC, or a different camera module. This is why camera integration starts with the data sheet timing table, not only with the resolution line on a product page.",
          "Latency is different from bandwidth. A surveillance camera may tolerate encode and network buffering; a robot or motor-control-adjacent vision loop may not. Rolling shutter exposure, sensor readout, MIPI packet transfer, ISP frames, encoder buffers, network jitter, and application queues all add delay. If the product uses vision for closed-loop control, timestamp every frame at the sensor boundary or as close to it as the platform allows, then carry metadata through the stack.",
        ],
      },
      {
        type: "callout",
        heading: "Megapixels are not image quality",
        body: "A high pixel count can still produce poor images if the lens is soft, the pixels are noisy, focus drifts, the ISP is badly tuned, lighting is uncontrolled, or the product compresses away useful detail. Image quality needs measurable requirements: SFR/resolution, noise, dynamic range, color accuracy, low-light behavior, latency, and defect limits.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Architecture review checklist",
        items: [
          "Write the scene and use case first: distance, lighting, field of view, motion, required detail, environment, and who or what consumes the image.",
          "Calculate raw payload bandwidth and compare it to interface, memory, ISP, encoder, and storage limits.",
          "Choose the integration level deliberately: raw sensor, USB module, IP camera, smart camera, or serialized remote camera.",
          "Define latency budget by stage if the camera feeds control, detection, or safety decisions.",
          "Track synchronization and timestamping requirements before firmware and software APIs harden.",
          "Budget power and thermal load for sensor, serializer, ISP/SoC, illumination, network/PoE, and enclosure temperature rise.",
          "Define image-quality acceptance tests early; do not wait for subjective visual review at the end.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What is the camera pipeline from scene to application?", answer: "Scene, optics, sensor, electrical interface, ISP/processor, encoding/transport/storage, and application logic. Each stage can limit final quality." },
          { question: "Why can a 12 MP camera be worse than a 2 MP camera?", answer: "Pixel count says little about lens quality, noise, dynamic range, focus, ISP tuning, compression, lighting, or latency." },
          { question: "What should you calculate before choosing MIPI, USB, or Ethernet?", answer: "Pixel payload bandwidth, frame rate, latency budget, cable distance, power budget, host support, and validation burden." },
        ],
      },
    ],
    sources: [mipiCsi2, usbVideoClass, onvifProfiles, rtspRfc],
    related: ["image-sensor-electrical-behavior", "camera-interfaces-and-protocols", "camera-testing-validation-and-production"],
  },
  {
    slug: "image-sensor-electrical-behavior",
    libraryId: "technical",
    collectionId: "camera-systems",
    title: "Image sensor electrical behavior",
    summary: "How image sensors convert light to digital values: photodiodes, full-well capacity, shot noise, dark current, read noise, rolling/global shutter behavior, gain, ADCs, black level, and sensor timing.",
    readingTime: 22,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Pixels are charge buckets, not ideal light counters",
        body: [
          "A CMOS image sensor pixel is built around a photodiode. During exposure, photons generate electron-hole pairs and charge accumulates. At readout, the pixel circuitry transfers and measures that charge, and column or on-chip ADCs produce digital values. The simplified model is a bucket: light fills it, exposure time determines how long it fills, gain determines how strongly the signal is amplified before or after conversion, and full-well capacity is the maximum charge before saturation. The engineering reality adds leakage, thermal noise, amplifier noise, quantization, pixel mismatch, color filters, micro-lenses, and timing constraints.",
          "The core exposure trade is between signal and motion. Longer exposure captures more photons and improves shot-noise-limited SNR, but it blurs motion and can saturate highlights. Higher analog gain makes the signal larger at the ADC but does not create photons; it can help when read noise dominates, but after a point it amplifies noise and reduces highlight headroom. Digital gain simply multiplies numbers after conversion and cannot recover clipped or buried data.",
        ],
      },
      {
        type: "formula",
        heading: "Shot-noise-limited intuition",
        formula: "SNRshot ≈ N / √N = √N",
        explanation: "If N photoelectrons are collected and photon arrival follows Poisson statistics, the shot noise standard deviation is about the square root of N. More collected light improves SNR, but with diminishing returns: four times more photons gives about twice the shot-noise-limited SNR.",
        terms: [
          { symbol: "N", meaning: "Collected photoelectrons", unit: "electrons" },
          { symbol: "√N", meaning: "Shot noise standard deviation", unit: "electrons RMS" },
          { symbol: "SNR", meaning: "Signal-to-noise ratio", unit: "ratio or dB" },
        ],
      },
      {
        type: "table",
        heading: "Sensor terms that matter electrically",
        columns: ["Term", "Meaning", "What it changes in design"],
        rows: [
          ["Full-well capacity", "Maximum charge a pixel can hold before saturation", "Dynamic range and highlight handling"],
          ["Quantum efficiency", "Fraction of incident photons converted to charge", "Low-light performance and illumination budget"],
          ["Dark current", "Thermally generated charge without light", "Hot-temperature noise, dark-frame behavior, exposure limits"],
          ["Read noise", "Noise added by pixel/column readout and ADC circuits", "Low-signal floor and minimum useful illumination"],
          ["PRNU / DSNU", "Pixel response and dark-signal non-uniformity", "Flat-field correction, defect correction, calibration"],
          ["Conversion gain", "Voltage change per electron", "Noise/readout trade-offs and high/low conversion-gain modes"],
          ["Black level", "Offset used so noise below zero can be represented", "ISP tuning, clipping, and repeatable measurement"],
          ["Line time", "Time to read one sensor row", "Rolling-shutter distortion, frame rate, exposure timing"],
        ],
      },
      {
        type: "prose",
        heading: "Rolling shutter versus global shutter",
        body: [
          "A rolling-shutter sensor exposes or reads different rows at different times. This is efficient and common, but fast motion or vibration bends straight lines and shifts objects because the top and bottom of the frame represent different moments. Rolling shutter is not simply an image artifact; it is a timing problem. If a robot estimates motion from images, or a product captures fast mechanical movement, row time and timestamping matter as much as frame rate.",
          "A global-shutter sensor exposes all pixels for the same time window, then stores and reads them out. It is preferred for machine vision, motion measurement, strobes, and rotating machinery, but it often has trade-offs in pixel complexity, noise, cost, and availability. The decision is use-case driven: if the image is for human viewing, rolling shutter may be fine; if the image is evidence for precise geometry or closed-loop control, global shutter or careful compensation may be required.",
        ],
      },
      {
        type: "prose",
        heading: "Timing control is part of the electrical interface",
        body: [
          "Image sensors are controlled by register programming over I2C-like buses, but the high-rate data stream follows a separately timed interface such as MIPI CSI-2. The driver must configure PLLs, frame length, line length, exposure, analog gain, digital gain, black level, test patterns, output bit depth, virtual channels, and lane count. A sensor that displays a picture at one resolution is not fully integrated until mode changes, suspend/resume, error recovery, and temperature corners are proven.",
          "Bring-up should use the sensor's test-pattern generator before relying on optics. A known color bar, ramp, or checkerboard pattern lets you isolate interface timing, lane mapping, bit packing, endian assumptions, and ISP Bayer order without the ambiguity of lighting and focus. If a test pattern is clean but a live image is bad, debug optics, exposure, clock jitter, rails, or ISP tuning. If the test pattern itself is corrupt, debug the electrical and protocol layer first.",
        ],
      },
      {
        type: "callout",
        heading: "Temperature changes the camera",
        body: "Dark current rises with temperature, focus can shift with lens and housing expansion, regulator noise can move, and calibration may drift. A camera product that is judged only at room temperature on a desk has not been validated as an imaging system.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Sensor behavior review checklist",
        items: [
          "Identify shutter type, pixel size, full-well capacity, read noise, dynamic range, supported bit depths, and maximum frame timing.",
          "Calculate whether the required exposure time works with motion, frame rate, flicker, and illumination.",
          "Use sensor test patterns during electrical bring-up before debugging optics or ISP tuning.",
          "Verify mode transitions: power-up, streaming start, resolution change, suspend/resume, error recovery, and hot/cold behavior.",
          "Define how black level, dead pixels, flat-field correction, and gain tables are calibrated or compensated.",
          "Capture raw frames during validation so ISP decisions do not hide sensor or board issues.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What does analog gain change and what does it not change?", answer: "It amplifies the sensor signal before conversion, which can help when read noise matters, but it does not create more photons or recover saturated highlights." },
          { question: "Why does rolling shutter matter electrically?", answer: "Rows are sampled at different times, so line time and frame timing become part of the measurement, especially under motion or vibration." },
          { question: "Why use sensor test patterns during bring-up?", answer: "They isolate interface, bit packing, lane, and ISP path issues from optics, lighting, exposure, and focus." },
        ],
      },
    ],
    sources: [emva1288, iso15739, mipiCsi2],
    related: ["camera-system-architecture", "camera-power-clocks-and-layout", "camera-image-quality-and-calibration"],
  },
  {
    slug: "camera-power-clocks-and-layout",
    libraryId: "technical",
    collectionId: "camera-systems",
    title: "Camera power, clocks & layout",
    summary: "Power-tree, sequencing, clock, reset, connector, MIPI, ESD, grounding, and EMI practices that make a camera electrically stable instead of merely schematic-correct.",
    readingTime: 21,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Camera boards are mixed-signal boards with hostile edges",
        body: [
          "A camera board places sensitive analog pixel circuitry, fast digital control, high-speed serial lanes, clocks, regulators, flex cables, and often illumination drivers into a small mechanical area. The schematic can be simple — a sensor, a connector, several rails, a clock, I2C, reset, and MIPI lanes — but the layout determines whether the image is clean, whether the link trains reliably, and whether the product passes emissions.",
          "Treat the sensor as a mixed-signal IC. Analog rails feed pixel and column circuits; digital rails feed logic and PLLs; I/O rails set signaling levels; the clock feeds the timing core; reset and power-down pins define states; I2C or CCI configures registers; high-speed lanes emit the pixel stream. Each has different noise tolerance. The power tree and layout should stop switching-regulator ripple, digital return current, and cable transients from becoming image noise or link errors.",
        ],
      },
      {
        type: "table",
        heading: "Common camera electrical nets",
        columns: ["Net / subsystem", "Purpose", "Design concerns"],
        rows: [
          ["AVDD / analog rails", "Pixel array, analog front-end, ADC references", "Low ripple, local decoupling, LDO filtering, quiet return"],
          ["DVDD / core rails", "Sensor digital core and timing logic", "Sequencing, transient current, regulator stability"],
          ["IOVDD", "I/O bank voltage for control signals", "Host compatibility, leakage during off states, level shifting"],
          ["MCLK / XCLK", "Reference clock to sensor PLL", "Jitter, trace coupling, enable timing, clean source"],
          ["RESET / PWDN", "Known startup and low-power states", "Pull defaults, host boot sequencing, undefined states"],
          ["I2C / CCI", "Register control", "Pull-up sizing, level compatibility, bus recovery"],
          ["MIPI CSI-2 lanes", "High-speed pixel data", "Impedance, pair skew, lane polarity, length, return path, connector quality"],
          ["FPC / board-to-board connector", "Mechanical/electrical camera interface", "Pinout symmetry, retention, ESD, bend radius, field damage"],
        ],
      },
      {
        type: "prose",
        heading: "Power sequencing and rail cleanliness",
        body: [
          "Many sensors require rails to come up in a defined order or within specific timing windows. Violating this may not kill the sensor; it may create intermittent start failures, excessive leakage, failed I2C access, or modes that only recover after complete power removal. The driver and board must agree on the sequence: enable regulators, wait for rails to settle, provide clock if required, release reset/power-down, then program registers. Brownout behavior needs equal attention. A camera in a product must recover after supply dips, ESD events, suspend/resume, and host reboot.",
          "Rail noise can become image noise. Switching converters are efficient, but sensor analog rails often need LDO post-regulation, ferrite beads, RC filtering, or carefully chosen LC filters. Decoupling should be local, with small capacitors close to pins and bulk nearby for mode transitions. Do not let LED/IR illumination current, motor current, Wi-Fi bursts, or Ethernet PHY current share high-impedance return paths with analog sensor supplies.",
        ],
      },
      {
        type: "prose",
        heading: "Clocks and high-speed layout",
        body: [
          "The sensor master clock drives internal PLLs and frame timing. Clock jitter and coupling may appear as link instability or subtle image artifacts; clock traces should be short, impedance-aware where needed, and isolated from noisy power-switching nodes. The clock enable sequence matters: some sensors require clock present before register access; others allow configuration first. Verify the actual data sheet rather than assuming every camera module behaves the same way.",
          "MIPI CSI-2 over D-PHY or C-PHY is not routed like slow GPIO. Keep differential or trio routes over continuous reference planes, control impedance, avoid stubs, minimize discontinuities through connectors, and respect skew requirements. A flex cable is part of the channel, not a jumper. Its length, bend, ground pin placement, shielding, and connector quality affect signal integrity and EMI. If the interface crosses boards, give the return current an intentional path and keep high-speed pairs away from apertures, board edges, and noisy power loops.",
        ],
      },
      {
        type: "prose",
        heading: "ESD, EMI, and enclosure effects",
        body: [
          "Cameras tend to sit at product edges: behind windows, near cables, on hinges, at outdoor penetrations, or close to user touch points. That makes ESD and surge protection part of the camera design. Choose low-capacitance ESD arrays for high-speed lanes, place protection near the connector, route discharge current to chassis or shield deliberately, and avoid letting an ESD pulse cross the sensor ground reference before it reaches its return path.",
          "EMI is also a two-way problem. MIPI and sensor clocks can radiate through FPCs and enclosure slots; external radios, motors, DC/DC converters, and PoE supplies can inject noise back into images or the link. The solution is rarely one part. It is stackup, cable pinout, common-mode control, reference-plane continuity, connector/shield strategy, clock spread or frequency planning when allowed, and early emissions/debug testing with near-field probes.",
        ],
      },
      {
        type: "callout",
        heading: "If the image has stripes, do not start with the ISP",
        body: "Bands, stripes, rolling brightness shifts, and frame dropouts can be caused by power ripple, lighting flicker, rolling-shutter timing, bad grounding, MIPI errors, or exposure control. Capture raw frames, check rails with bandwidth, enable link error counters if available, and correlate artifacts with power, temperature, cable position, and frame timing.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Camera electrical review checklist",
        items: [
          "Verify every rail voltage, tolerance, startup order, shutdown order, and brownout recovery behavior against the sensor data sheet.",
          "Separate noisy loads from sensor analog rails; decide which rails need LDO post-regulation or filtering.",
          "Place decoupling and ESD parts by current path, not by schematic neatness.",
          "Route MIPI lanes with controlled impedance, continuous reference, minimal skew, no avoidable stubs, and connector/flex effects included.",
          "Plan FPC pinout for ground adjacency, shielding, keying, retention, and service damage.",
          "Measure rail ripple and clock quality while streaming at worst-case frame rate, illumination, radio, and temperature.",
          "Test multiple cable lengths, bends, and connector insertions if the camera is remote or field-serviceable.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why can a camera pass register reads but fail streaming?", answer: "Low-speed I2C can work while MIPI signal integrity, clocking, power transients, mode timing, or lane configuration fails." },
          { question: "Why are analog sensor rails treated differently from core rails?", answer: "Ripple and return-current noise on analog rails can couple directly into pixel/ADC measurements and become visible image noise." },
          { question: "Where should ESD protection be placed?", answer: "Near the connector or entry point, with a short, deliberate discharge path that does not route surge current through sensitive sensor references." },
        ],
      },
    ],
    sources: [mipiCsi2, mipiCurrentSpecs],
    related: ["return-paths-and-stackup", "mixed-signal-pcb-layout", "emi-emc-pcb-design"],
  },
  {
    slug: "camera-interfaces-and-protocols",
    libraryId: "technical",
    collectionId: "camera-systems",
    title: "Camera interfaces & protocols",
    summary: "A practical comparison of MIPI CSI-2, USB UVC, Ethernet/IP cameras, RTSP, ONVIF, PoE, trigger lines, synchronization, and metadata paths.",
    readingTime: 23,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Camera interfaces are chosen by distance, ownership, and timing",
        body: [
          "The main question is not “which protocol is best?” It is “where does camera ownership live?” If the product owns the sensor and image pipeline, raw sensor interfaces like MIPI CSI-2 give tight control and low latency, but demand board-level electrical design, kernel/driver support, and ISP tuning. If the product wants a mostly self-contained camera peripheral, USB UVC or Ethernet/IP cameras move more work into the module, but add their own latency, firmware, security, and compatibility constraints.",
          "The physical distance matters. MIPI CSI-2 is optimized for high-speed chip-to-chip or short module connections. USB supports cabled plug-and-play cameras with host operating-system class support. Ethernet supports long building-scale runs, standard switching, network isolation, PoE power, and IP-based integration. Camera design is therefore an interface architecture decision as much as a sensor choice.",
        ],
      },
      {
        type: "table",
        heading: "Camera interface comparison",
        columns: ["Interface", "Typical use", "What to verify"],
        rows: [
          ["MIPI CSI-2", "Raw image sensor or compact module to SoC/ISP", "Lane count, PHY support, timing modes, virtual channels, driver, ISP tuning, layout margin"],
          ["I2C / CCI", "Sensor register control alongside image stream", "Pull-ups, voltage levels, bus recovery, address conflicts, startup timing"],
          ["USB UVC", "Camera module to PC, SBC, or embedded host", "UVC controls, bandwidth mode, cable quality, isochronous/bulk behavior, enumeration, OS support"],
          ["Ethernet/IP camera", "Surveillance, industrial, remote cameras", "PoE budget, RTSP/ONVIF support, cybersecurity, stream latency, multicast/unicast, update process"],
          ["Trigger/strobe GPIO", "Machine vision synchronization", "Electrical levels, edge timing, jitter, pulse width, isolation, timestamping"],
          ["Serializer/deserializer link", "Long embedded camera cable or harsh environment", "Cable EMC, power over cable, link training, diagnostics, connector robustness"],
        ],
      },
      {
        type: "prose",
        heading: "MIPI CSI-2 in context",
        body: [
          "MIPI CSI-2 carries still and video image data from sensors to application processors. Current CSI-2 versions support multiple physical layers, including D-PHY, C-PHY, and A-PHY related paths. In practice, the SoC and sensor data sheets decide the usable subset: supported lane count, maximum lane rate, bit depths, Bayer order, embedded data lines, virtual channels, and error-reporting registers.",
          "MIPI is attractive because it moves raw sensor data with low overhead and tight integration into ISP blocks. Its cost is ownership. The board must route a high-speed channel correctly; firmware must sequence and configure the sensor; the OS or bare-metal stack must expose a driver; the ISP must know color filter array, lens shading, black level, noise behavior, and tuning tables. A MIPI camera that “shows an image” is only the beginning of integration.",
        ],
      },
      {
        type: "prose",
        heading: "USB UVC and Ethernet cameras",
        body: [
          "USB Video Class exists so a host can discover and stream from cameras through a standardized device class instead of a custom driver for every camera. It is useful for prototypes and products that run Linux, Windows, macOS, or an embedded host with USB camera support. UVC does not eliminate validation: you still need to test enumeration, power states, selected formats, frame intervals, bandwidth under other USB traffic, cable quality, and the exact control set exposed by the module.",
          "Ethernet cameras are network devices. RTSP is commonly used to control streaming sessions; ONVIF profiles define interoperable feature sets for IP-based physical security products. PoE can simplify installation by carrying power and data over the same cable, but it shifts requirements into PD classification, inrush, thermal rise, isolation, surge, cable loss, and switch compatibility. Once a camera is on a network, cybersecurity, credentials, logs, firmware update, time sync, and certificate handling become product features, not IT afterthoughts.",
        ],
      },
      {
        type: "prose",
        heading: "Synchronization, metadata, and time",
        body: [
          "Multi-camera and control-loop systems need time discipline. If frames are fused with IMU data, motor state, access-control events, or alarms, frame timestamps must be attached consistently. Hardware triggers, strobe outputs, PTP/NTP time sync, frame counters, embedded metadata lines, and host-side capture timestamps all have different error budgets. The architecture should state which timestamp is authoritative: exposure start, exposure midpoint, frame start, receive completion, encode completion, or application arrival.",
          "Metadata is often as important as pixels. Exposure, gain, temperature, lens position, frame counter, CRC/error state, dropped-frame counters, and firmware version let the system debug problems after deployment. If metadata is lost at the first software boundary, production failures become subjective screenshots instead of diagnosable events.",
        ],
      },
      {
        type: "callout",
        heading: "Protocol compliance is not the same as product interoperability",
        body: "A camera can implement a standard and still fail in your product because of optional features, buffer sizes, control quirks, network policy, TLS/certificate handling, cable power margin, or host driver behavior. Validation must use the exact hosts, switches, cables, power states, and update paths the product will ship with.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Interface selection checklist",
        items: [
          "State required distance, bandwidth, latency, synchronization, power, environmental, and host-support constraints.",
          "For MIPI, verify lane rate, lane count, bit packing, Bayer order, embedded metadata, error counters, and ISP support.",
          "For USB UVC, test enumeration and streaming across cold boot, suspend/resume, hub use, cable variation, and other bus traffic.",
          "For Ethernet/IP cameras, test ONVIF profile claims, RTSP behavior, time sync, credentials, update flow, PoE budget, switch compatibility, and firewall segmentation.",
          "For triggered systems, measure actual edge-to-exposure timing and jitter instead of trusting only nominal data-sheet timing.",
          "Carry frame IDs and timestamps through the full software stack.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "When is MIPI CSI-2 the right answer?", answer: "When the product owns the local camera pipeline, needs low-latency raw sensor data, and can absorb board, driver, and ISP integration work." },
          { question: "What does USB UVC buy you?", answer: "Standard host-side discovery and streaming behavior, especially on OS-based platforms, at the cost of validating bandwidth, controls, power states, and module quirks." },
          { question: "What changes when the camera is Ethernet/PoE?", answer: "The camera becomes a networked device, so power classification, switch compatibility, credentials, time sync, streaming protocols, cybersecurity, and firmware update strategy are in scope." },
        ],
      },
    ],
    sources: [mipiCsi2, mipiCurrentSpecs, usbVideoClass, onvifProfiles, rtspRfc, ethernetPoe],
    related: ["camera-system-architecture", "camera-testing-validation-and-production", "ethernet-for-embedded"],
  },
  {
    slug: "camera-image-quality-and-calibration",
    libraryId: "technical",
    collectionId: "camera-systems",
    title: "Camera image quality & calibration",
    summary: "How to make camera quality measurable: resolution/SFR, noise, dynamic range, color, focus, distortion, lens shading, defect correction, HDR, illumination, and production calibration.",
    readingTime: 24,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Image quality must be specified as measurements",
        body: [
          "Subjective review is useful but insufficient. A camera product needs measurable image-quality requirements tied to its purpose. If the camera reads labels, measure whether the smallest required character is resolved at the working distance and lighting. If it records evidence, measure low-light noise, dynamic range, motion blur, timestamp accuracy, and compression artifacts. If it feeds an algorithm, measure the algorithm's performance against controlled changes in focus, exposure, color temperature, flicker, vibration, dirt, and temperature.",
          "The important discipline is to separate optical quality, sensor quality, ISP quality, and system quality. A soft image can be a poor lens, bad focus, cover-window blur, motion blur, rolling-shutter distortion, wrong demosaic tuning, aggressive denoise, compression, or poor lighting. A rigorous test plan isolates variables instead of collapsing everything into “camera looks bad.”",
        ],
      },
      {
        type: "table",
        heading: "Image-quality metrics",
        columns: ["Metric", "What it measures", "Design lever"],
        rows: [
          ["SFR / MTF", "How contrast is preserved versus spatial frequency", "Lens, focus, aperture, pixel size, demosaic, sharpening"],
          ["Noise versus signal", "Random variation at different light levels", "Sensor selection, exposure, gain, temperature, denoise"],
          ["Dynamic range", "Usable range from noise floor to saturation", "Full well, read noise, HDR mode, exposure strategy"],
          ["Color accuracy", "How captured color maps to real/reference color", "IR filter, CFA, white balance, color correction matrix, lighting"],
          ["Lens shading / vignetting", "Brightness/color falloff from center to corner", "Lens design, cover glass, flat-field correction"],
          ["Distortion", "Geometric warping across field of view", "Lens choice, calibration model, mechanical alignment"],
          ["Focus stability", "Sharpness over distance, temperature, vibration, assembly tolerance", "Lens mount, autofocus, adhesive, thermal/mechanical design"],
          ["Defect pixels / blemishes", "Stuck, hot, dead, or cluster defects", "Sensor grade, calibration map, production screening"],
          ["Temporal artifacts", "Flicker, rolling bands, dropped frames, exposure pumping", "Exposure control, anti-flicker, frame timing, buffering"],
        ],
      },
      {
        type: "prose",
        heading: "Resolution is not pixel count",
        body: [
          "Resolution is about how much spatial detail survives the full optical and processing chain. ISO 12233 focuses on methods for measuring resolution and spatial frequency response of digital cameras; the practical takeaway is that a slanted-edge or other controlled chart gives a repeatable way to evaluate sharpness instead of guessing from a normal scene. True resolved detail depends on lens MTF, focus, aperture, diffraction, sensor sampling, optical low-pass behavior, demosaic, sharpening, compression, and display scaling.",
          "For system integration, test resolution at the actual field position and working distance. Center sharpness can hide corner failure. A lens that is sharp on an open bench may soften behind product cover glass, under enclosure stress, after thermal cycling, or when the focus lock adhesive cures. If the product uses fixed focus, production needs a focus acceptance method; if it uses autofocus, validation needs focus convergence, hunting, low-light behavior, and failure-state handling.",
        ],
      },
      {
        type: "prose",
        heading: "Noise, dynamic range, and color",
        body: [
          "Noise and dynamic range are scene-dependent. ISO 15739 defines methods for measuring noise versus signal level and dynamic range for electronic still cameras; EMVA 1288 is widely used in machine vision to present sensor/camera performance such as responsivity, noise, and dynamic-range-style quantities consistently. For engineering review, the key is to measure raw and processed data separately. Raw data tells you sensor and board behavior; processed output tells you the customer or algorithm experience.",
          "Color quality comes from the whole stack: illuminant spectrum, lens transmission, IR-cut filter, sensor color filters, white-balance algorithm, color correction matrix, gamma/tone mapping, and compression. A camera that looks good under office lighting may fail under sunlight, LEDs, sodium lamps, IR illumination, or mixed lighting. If color matters, use reference targets under defined illuminants, not a casual desk scene.",
        ],
      },
      {
        type: "prose",
        heading: "Calibration is a manufacturing process, not a lab favor",
        body: [
          "Calibration moves variation out of the product. Lens shading correction compensates brightness and color falloff. Defect-pixel maps hide known bad pixels. Color calibration adjusts matrices and white balance. Geometric calibration estimates distortion and alignment. Stereo or multi-camera calibration estimates extrinsics. Focus calibration proves or adjusts lens position. The product decision is which of these are needed for performance, which can be handled by supplier modules, and which must be performed on your production line.",
          "Production calibration must be fast, repeatable, traceable, and hard to bypass. It needs fixtures, lighting, charts, golden references, limits, stored calibration data, serialization, and a recovery path if programming fails. Treat calibration data as product data: version it, check CRCs, bind it to device identity, and make firmware reject missing or incompatible calibration where that would create unsafe or unusable behavior.",
        ],
      },
      {
        type: "callout",
        heading: "ISP tuning can hide root cause",
        body: "Denoise, sharpening, tone mapping, auto exposure, and compression can make images look acceptable while hiding marginal optics, power noise, focus drift, or sensor defects. Keep access to raw frames and fixed-control captures during validation.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Image-quality validation checklist",
        items: [
          "Define objective image-quality metrics tied to the use case, not only visual preference.",
          "Capture controlled chart images for SFR/resolution, color, lens shading, distortion, and focus.",
          "Measure noise and dynamic range over light level and temperature, with raw and processed data separated.",
          "Test field corners, cover glass, enclosure stress, temperature cycling, vibration, and illumination variation.",
          "Validate auto exposure, auto white balance, autofocus, HDR, anti-flicker, and compression under real scene transitions.",
          "Define production calibration fixtures, limits, traceability, and calibration-data storage/versioning.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why is a normal photo a poor validation artifact?", answer: "It mixes optics, sensor behavior, ISP tuning, compression, display, and scene variation without isolating root cause." },
          { question: "What does SFR/MTF tell you that megapixels do not?", answer: "It shows how much contrast survives at different spatial frequencies through the real optical and processing chain." },
          { question: "Why must calibration be designed for production?", answer: "Because fixtures, lighting, limits, traceability, stored data, and failure recovery determine whether every shipped unit actually meets the image requirement." },
        ],
      },
    ],
    sources: [iso12233, iso15739, emva1288],
    related: ["camera-testing-validation-and-production", "image-sensor-electrical-behavior", "dfm-dfa-and-testability"],
  },
  {
    slug: "camera-testing-validation-and-production",
    libraryId: "technical",
    collectionId: "camera-systems",
    title: "Camera testing, validation & production",
    summary: "A product-development test strategy for cameras: bring-up, EVT/DVT/PVT, image-quality validation, electrical margins, environmental testing, reliability, manufacturing test, calibration, and field diagnostics.",
    readingTime: 25,
    updatedAt: "Aug 11",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Camera validation must prove image performance and system behavior",
        body: [
          "A camera subsystem can fail electrically, optically, algorithmically, mechanically, thermally, or operationally. Validation must therefore combine ordinary hardware tests with image-specific tests. The board must stream without link errors; the image must meet measurable quality limits; the enclosure must not defocus the lens or add reflections; firmware must recover from camera faults; production must calibrate and screen units quickly; field logs must explain failures after installation.",
          "Use a staged plan. Bring-up proves power, clock, reset, register access, test pattern, streaming, and raw capture. EVT explores major architecture risks. DVT proves the design against requirements and environments. PVT proves the manufacturing process. Production test screens every unit. Field diagnostics keep the product supportable after release. If these phases are blurred, camera issues often appear late because a product can show a visually plausible image while still being outside requirements.",
        ],
      },
      {
        type: "table",
        heading: "Validation matrix",
        columns: ["Area", "What to test", "Evidence to keep"],
        rows: [
          ["Electrical bring-up", "Rail sequence, ripple, current, clock, reset, I2C, MIPI/USB/Ethernet streaming", "Scope captures, current logs, register dumps, link-error counters"],
          ["Image quality", "Resolution/SFR, noise, dynamic range, color, focus, distortion, shading, artifacts", "Raw frames, processed frames, chart results, scripts, limits"],
          ["Timing", "Frame rate, latency, timestamp accuracy, dropped frames, trigger-to-exposure delay", "Timestamp logs, frame counters, host traces"],
          ["Environmental", "Hot/cold, humidity, thermal cycling, vibration, shock, sunlight/IR/LED flicker", "Before/after images, focus checks, failure analysis"],
          ["EMC/ESD", "Emissions, immunity, ESD at camera/cable/enclosure, radio coexistence", "Lab reports, near-field debug notes, recovery behavior"],
          ["Software recovery", "Camera unplug/short where applicable, sensor error, stream timeout, host reboot, update rollback", "Fault-injection logs, state-machine traces"],
          ["Production", "Programming, calibration, focus, image chart, dead pixels, identity, packaging damage", "Per-serial-number test records and calibration data"],
        ],
      },
      {
        type: "prose",
        heading: "Bring-up sequence",
        body: [
          "First power the camera without streaming and measure rail voltages, inrush, idle current, reset state, and clock. Then prove low-speed control: I2C address, sensor ID register, basic register writes, and bus recovery. Then enable a sensor test pattern and verify the receiver sees the expected bit packing, frame dimensions, lane order, and frame count. Only after test patterns are clean should optics and live scene debugging begin.",
          "Keep the first images boring. Fixed exposure, fixed gain, fixed white balance, no auto features, no compression, and raw capture are best. Auto exposure and ISP tuning are useful later, but early they hide root cause. Capture golden known-good data early and store it in the repo or validation archive so later firmware, board, and supplier changes can be compared quantitatively.",
        ],
      },
      {
        type: "prose",
        heading: "Reliability and environmental risk",
        body: [
          "Cameras are mechanically sensitive. Focus can move with adhesive cure, thermal expansion, shock, vibration, enclosure stress, or user impact. FPCs can crack, creep, or partially unseat. Cover windows can scratch, fog, reflect, or collect water. IR LEDs can heat the window and create internal reflections. Outdoor or vehicle cameras can face condensation, UV exposure, salt, cleaning chemicals, and cable strain. Validation must explicitly include these conditions if the product will see them.",
          "Electrical reliability includes regulator thermal margin while streaming, PoE or USB power negotiation, startup under cold supply, ESD recovery, EMC immunity, and long-duration streaming. A good stress test logs frame counters, error counters, temperature, rail voltage if available, exposure/gain, and application health. A test that only checks whether a preview window is still open after 24 hours is too weak for production confidence.",
        ],
      },
      {
        type: "prose",
        heading: "Production test and calibration",
        body: [
          "Production should catch assembly, supplier, and calibration problems without turning the line into a lab experiment. Typical stations verify device identity, firmware, camera enumeration, current draw, focus, chart sharpness, dead/hot pixels, color or grayscale response, lens shading, illumination function, and stored calibration data. If the camera is sealed into an enclosure, final optical test must happen after sealing or after any step that can disturb focus or cover-window cleanliness.",
          "Decide which data is stored per unit: calibration blobs, lens-shading tables, color matrices, distortion parameters, focus result, chart result, image sample hash, firmware version, fixture version, operator/station ID, and timestamp. Make firmware and cloud/local tools able to report that data. This turns field failures from “customer says image is blurry” into “unit passed focus with margin X, firmware Y, calibration Z, current temperature W.”",
        ],
      },
      {
        type: "callout",
        heading: "Validation without traceability is weak evidence",
        body: "For camera products, keep raw data, processed outputs, fixture versions, lighting conditions, chart details, software revisions, environmental state, and serial numbers. Otherwise a passing result cannot be reproduced or compared after supplier, firmware, lens, or production changes.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Camera validation checklist",
        items: [
          "Write requirements for scene, lighting, image metrics, latency, environmental range, lifetime, production yield, and field recovery.",
          "Use sensor test patterns to prove electrical/protocol integrity before subjective image review.",
          "Automate chart captures and compute objective metrics where possible.",
          "Run environmental and mechanical tests with before/after image-quality comparison, not just power-on checks.",
          "Validate fault handling: camera timeout, corrupted frames, link errors, sensor reset, host reboot, power dip, and update rollback.",
          "Define production tests that happen after all focus- or cleanliness-affecting assembly steps.",
          "Store calibration and test data per unit with versioning and CRC/integrity checks.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What is the first image source to use during bring-up?", answer: "The sensor's internal test pattern, because it removes optics and lighting from the electrical/protocol debug path." },
          { question: "Why test after final assembly?", answer: "Enclosure, cover glass, sealing, adhesive, focus lock, cable strain, and cleanliness can change image quality after a camera module passes by itself." },
          { question: "What makes production camera test useful after shipment?", answer: "Per-unit traceability: stored calibration, chart result, firmware/fixture versions, serial number, timestamps, and recoverable diagnostics." },
        ],
      },
    ],
    sources: [emva1288, iso12233, iso15739, mipiCsi2, usbVideoClass, onvifProfiles],
    related: ["validation-lifecycle-and-v-model", "dfm-dfa-and-testability", "camera-image-quality-and-calibration"],
  },
];
