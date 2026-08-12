import type { Note, Source } from "./library";

const smithOpticalEngineering: Source = {
  title: "Modern Optical Engineering",
  publisher: "Warren J. Smith, McGraw-Hill",
  url: "https://www.accessengineeringlibrary.com/content/book/9780071476874",
  kind: "Book",
};

const edmundOpticsResources: Source = {
  title: "Imaging Optics application notes — resolution, MTF, depth of field",
  publisher: "Edmund Optics",
  url: "https://www.edmundoptics.com/knowledge-center/application-notes/imaging/",
  kind: "Reference",
};

const iso12233Optics: Source = {
  title: "ISO 12233 — Resolution and spatial frequency responses",
  publisher: "International Organization for Standardization",
  url: "https://www.iso.org/standard/71696.html",
  kind: "Reference",
};

const ramanathColorPipeline: Source = {
  title: "Color Image Processing Pipeline (demosaicking to output)",
  publisher: "Ramanath et al., IEEE Signal Processing Magazine",
  url: "https://ieeexplore.ieee.org/document/1407713",
  kind: "Reference",
};

const richardsonH264: Source = {
  title: "The H.264 Advanced Video Compression Standard",
  publisher: "Iain Richardson, Wiley",
  url: "https://www.wiley.com/en-us/The+H+264+Advanced+Video+Compression+Standard%2C+2nd+Edition-p-9780470516928",
  kind: "Book",
};

const itutHevc: Source = {
  title: "H.265 / HEVC — High Efficiency Video Coding",
  publisher: "ITU-T",
  url: "https://www.itu.int/rec/T-REC-H.265",
  kind: "Reference",
};

export const cameraOpticsIspNotes: Note[] = [
  {
    slug: "optics-lenses-and-imaging-geometry",
    libraryId: "technical",
    collectionId: "camera-systems",
    title: "Optics, lenses & imaging geometry",
    summary: "The half of a camera that no firmware can fix: focal length and field of view, f-number and depth of field, MTF and the diffraction limit, chief-ray-angle matching, mounts and filters, focus actuators and their drivers, aberrations, and the thermal and tolerance realities of holding focus in a real product.",
    readingTime: 26,
    updatedAt: "Aug 12",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The lens sets the ceiling everything else lives under",
        body: [
          "It is tempting for an electrical engineer to treat the lens as someone else's problem — a passive glass part bolted in front of the interesting silicon. That instinct produces a specific and expensive failure: a camera whose sensor, interface, and processing are all correct and whose images are still soft, dark at the corners, colour-shifted at the edges, or out of focus at temperature. Optical performance is the ceiling on image quality; the sensor can only sample what the lens delivers, and the image signal processor can only reshape what the sensor captured. No amount of sharpening recovers detail the lens never formed, and no colour matrix undoes the corner colour cast created by a lens whose ray angles the sensor cannot accept.",
          "The practical division of labour on a camera product is therefore three-way and tightly coupled: optics determines what light reaches each pixel, electronics determines how faithfully that light becomes numbers, and mechanics determines whether the two stay in the geometric relationship they were designed for across temperature, vibration, and manufacturing spread. An electrical engineer on a camera team needs enough optics to specify a lens, to recognize an optical fault when one appears in a test image, to design the drivers for whatever actuators the optics require, and — most often — to argue coherently in a design review about what a proposed enclosure change will do to the imaging performance the whole product is sold on.",
        ],
      },
      {
        type: "formula",
        heading: "Focal length, sensor size, and field of view",
        formula: "FOV = 2 · arctan( d / (2f) )      where d = sensor dimension (width, height, or diagonal), f = focal length      magnification m = f / (s − f)",
        explanation: "Field of view is a relationship between focal length and sensor size, never a property of the lens alone — this is the single most common source of confusion when a sensor is swapped mid-programme. A 4 mm lens on a 1/2.7-inch sensor (5.4 mm wide) gives a horizontal FOV of about 68°, but the same lens on a smaller 1/4-inch sensor (3.6 mm wide) sees only about 48°, because the smaller sensor crops into the same projected image circle. Two consequences follow directly. First, the lens's image circle must cover the sensor's diagonal or the corners go black (mechanical vignetting in its most brutal form) — a lens specified for 1/3-inch sensors will not cover a 1/1.8-inch one. Second, changing sensor format late in a program silently changes the product's field of view, working distance, and the pixels-on-target that any downstream detection algorithm was tuned against.",
        terms: [
          { symbol: "f", meaning: "Focal length — sets magnification and FOV", unit: "mm" },
          { symbol: "d", meaning: "Sensor dimension in the direction of interest", unit: "mm" },
          { symbol: "image circle", meaning: "Diameter the lens illuminates; must exceed sensor diagonal", unit: "mm" },
        ],
      },
      {
        type: "prose",
        heading: "Aperture, f-number, and the light budget",
        body: [
          "The f-number (N = f/D, focal length over entrance pupil diameter) is the lens's light-gathering specification, and it governs the exposure budget every low-light requirement ultimately rests on. Because light collection scales with pupil area, illuminance at the sensor scales as 1/N² — so f/1.4 delivers twice the light of f/2.0 and four times that of f/2.8. Each of those factors is a full stop, and each stop is a doubling of the exposure time or sensor gain needed for the same signal. That matters enormously for any camera that must work at night or freeze motion: the difference between an f/2.8 and an f/1.4 lens is the difference between a 30 ms exposure with visible motion blur and a 7.5 ms exposure without it, at the same noise level. Fast lenses (low N) cost money, size, and depth of field, which is exactly the trade a specification has to make explicitly rather than inherit by accident.",
          "Two refinements matter in practice. T-number is the f-number corrected for actual transmission losses through the glass — two f/2.0 lenses with different coatings and element counts do not deliver the same light, and cine and machine-vision lenses are sometimes specified in T-stops for that reason. And relative illumination describes how brightness falls toward the corners: the natural cos⁴ law (a geometric consequence of off-axis rays travelling further and striking the sensor obliquely) plus any mechanical vignetting from the barrel. A lens with 60% relative illumination at the corners is dropping most of a stop out there, and that shading is a per-lens-design, per-aperture characteristic which production calibration has to measure and correct.",
        ],
      },
      {
        type: "formula",
        heading: "Depth of field and hyperfocal distance",
        formula: "DoF ≈ 2 · N · c · s² / f²      hyperfocal H ≈ f² / (N · c) + f      (c = circle of confusion, typically ≈ 1–2 pixel pitches)",
        explanation: "Depth of field is the range of object distances rendered acceptably sharp, and its inputs are unforgiving: it grows with f-number and with the square of subject distance, and shrinks with the square of focal length. The circle of confusion c defines 'acceptably sharp,' and for a digital camera the sensible choice ties it to the pixel pitch — blur smaller than a pixel or two is invisible to that sensor. The hyperfocal distance is the focus setting that maximizes total depth of field: focus there and everything from roughly half that distance to infinity is acceptable, which is precisely how fixed-focus cameras are designed. A 4 mm f/2.0 lens on a 3 µm-pitch sensor has a hyperfocal distance around 1.3 m, meaning a fixed-focus module can cover 0.65 m to infinity with no actuator at all — the calculation that decides whether a product needs autofocus hardware or a locked, glued barrel.",
        terms: [
          { symbol: "c", meaning: "Circle of confusion — acceptable blur diameter", unit: "µm" },
          { symbol: "H", meaning: "Hyperfocal distance — focus for max DoF", unit: "m" },
          { symbol: "s", meaning: "Subject distance", unit: "m" },
        ],
      },
      {
        type: "prose",
        heading: "Resolution: MTF, the diffraction limit, and matching lens to sensor",
        body: [
          "Optical resolution is properly described by the modulation transfer function — the contrast a system preserves as a function of spatial frequency, measured in line pairs per millimetre at the image plane or in cycles per pixel. A lens does not have 'a resolution'; it has an MTF curve that falls with frequency, varies from centre to corner, changes with aperture and focus distance, and differs between sagittal and tangential orientations. The standard summary points are MTF50 (the frequency where contrast falls to half) and the contrast value at the sensor's Nyquist frequency. The system MTF is approximately the product of the component MTFs — lens, sensor aperture, any anti-alias filter, focus error, and motion blur all multiply — which is why a system is always softer than its best component and why one bad term dominates.",
          "The hard physical floor is diffraction. Even a perfect lens spreads a point source into an Airy disk whose diameter is roughly 2.44·λ·N — about 3.0 µm at f/2.0 and 8.5 µm at f/5.6 for green light. Compare that to the pixel pitch: on a modern 1.4 µm-pitch sensor, an f/2.8 lens is already diffraction-limited, and stopping down further makes the image softer, not sharper, no matter how good the glass is. This creates the fundamental pairing rule — a lens must be matched to the pixel pitch it will serve, and specifying a high-megapixel sensor behind a lens that cannot resolve its Nyquist frequency buys data volume, bandwidth, and cost with no additional information. When someone proposes doubling the megapixel count, the first question is whether the lens can support it; usually it cannot, and the honest answer is that the extra pixels will oversample blur.",
        ],
      },
      {
        type: "prose",
        heading: "Chief ray angle: the pairing constraint that surprises people",
        body: [
          "Every sensor pixel sits at the bottom of a small well, with a microlens on top steering light onto the photodiode, and — in colour sensors — a filter in the stack. That geometry accepts light arriving within a limited cone, and modern sensors are built with their microlens array progressively shifted toward the edges to accept the increasingly oblique rays arriving off-axis. The angle the sensor is designed to accept at each image height is its chief ray angle (CRA) specification, and the lens has a matching CRA curve describing the angles it actually delivers. If the two do not match, light at the image periphery lands partly on the wrong photodiode or is shadowed by the pixel structure: the symptoms are corner darkening that lens-shading correction can only partly fix, and — because the colour filters sit at slightly different heights — colour-dependent shading, a magenta or green cast that strengthens toward the corners and is genuinely painful to correct without destroying colour accuracy elsewhere.",
          "The engineering consequence is a firm rule: lens and sensor are a matched pair, not independently selectable components. A CRA mismatch cannot be fixed in firmware, in the ISP, or by a mechanical change; it requires a different lens or a different sensor. This is the single most valuable optics fact for an electrical engineer to carry into a component-selection meeting, because sensor swaps are often proposed for supply-chain or cost reasons by people who reasonably assume the lens is independent of that choice.",
        ],
      },
      {
        type: "table",
        heading: "Mounts, filters, and focus mechanisms",
        columns: ["Element", "Options", "Electrical involvement", "Design consequence"],
        rows: [
          ["Lens mount", "M12/S-mount (small, threaded), CS/C-mount (industrial), custom barrel", "None directly — but sets Z-tolerance stack", "Thread-focus mounts drift; glued/locked after active alignment"],
          ["IR-cut filter", "Fixed IR-cut, dual-band (day/night), none (mono/NIR)", "Mechanical switcher = coil/solenoid driver, H-bridge, position sense", "Silicon sees to ~1100 nm; without a cut filter colour is wrong"],
          ["Bandpass filter", "Narrowband matched to an illuminator", "Sync of filter band with LED emitter drive", "Rejects ambient; standard for structured light and IR illumination"],
          ["Fixed focus", "Barrel set at hyperfocal, then locked", "None", "Cheapest, most robust; needs DoF arithmetic to close"],
          ["VCM autofocus", "Voice-coil motor, open or closed loop", "Current-mode driver (I2C), hysteresis and settling", "Fast, small, needs AF algorithm and drive current control"],
          ["Stepper / liquid lens", "Stepper barrel; electrowetting liquid lens", "Step sequencing / high-voltage driver (30–60 V)", "Repeatable positioning; liquid lens has no moving parts"],
        ],
      },
      {
        type: "prose",
        heading: "The electrical work hiding inside the optics",
        body: [
          "Optics generates real electrical design tasks, and they are easy to underestimate at architecture time. An autofocus module needs a voice-coil driver — typically an I2C-controlled current source, because VCM position follows coil current against a spring, not voltage — with attention to settling time, ringing (a step in current makes the lens oscillate mechanically before settling, so drivers implement slew shaping), and hysteresis (the position for a given current differs depending on approach direction, which is why open-loop VCM autofocus algorithms always approach from one side). Liquid lenses require a high-voltage bias supply, often 30–60 V AC, generated by a boost stage that must not radiate into the analog sensor front end. A mechanical IR-cut switcher — the mechanism that swaps a filter in and out for day/night operation — is a latching solenoid or small motor needing an H-bridge, a defined pulse energy, and ideally position feedback so the firmware knows which filter is actually in place rather than which one it last commanded.",
          "Each of these actuators is also an EMI and power-integrity event happening centimetres from the most sensitive analog circuitry in the product. A VCM current step, a solenoid pulse, or a liquid-lens boost converter can inject noise onto the sensor's analog rails and appear as visible banding in the frame captured at that instant. The standard mitigations are the ones from mixed-signal practice — separate the actuator supply from the sensor analog rail, filter deliberately, keep the driver's current loop small and away from the sensor — plus a firmware-level one: schedule actuator activity during frame blanking rather than during active readout, so any residual disturbance lands where no pixels are being converted.",
        ],
      },
      {
        type: "prose",
        heading: "Aberrations and artifacts: what is correctable and what is not",
        body: [
          "Real lenses depart from ideal imaging in characteristic ways, and the practical question for a product team is always which departures can be corrected downstream and which must be bought out in the glass. Geometric distortion — barrel (straight lines bowing outward, typical of wide-angle designs) and pincushion — is a pure remapping of where information lands and is therefore well correctable in software, at the cost of interpolation softness and some resolution loss at the edges; wide-angle products routinely ship with 10–20% barrel distortion corrected in the pipeline. Vignetting is a smooth multiplicative falloff and is correctable by lens-shading correction, but the correction amplifies corner noise in proportion to the gain it applies, so severe vignetting trades directly against corner SNR. Lateral chromatic aberration (colour channels focused at different magnifications, producing coloured fringes that grow toward the corners) is correctable by per-channel geometric scaling.",
          "The uncorrectable list matters more. Longitudinal chromatic aberration puts different wavelengths at different focus depths, so no single focus setting is sharp for all colours — software cannot recover detail that was never resolved. Flare and ghosting from internal reflections and bright sources add veiling light that destroys local contrast and cannot be separated from the scene. Field curvature means the plane of best focus is curved, so a flat sensor cannot be in focus everywhere at once. Astigmatism and coma degrade the point spread asymmetrically. And any true resolution loss — a soft lens, a defocus, motion blur — is information that is gone; sharpening increases the visual contrast of what remains while amplifying noise and generating halos, which is why an ISP tuned to hide a soft lens produces images that look crisp in a thumbnail and fall apart under inspection.",
        ],
      },
      {
        type: "prose",
        heading: "Holding focus in the real world: thermal and tolerance effects",
        body: [
          "A lens focused perfectly on the bench at 22 °C is not necessarily focused in the product at −20 °C or +60 °C. Thermal focus shift comes from three simultaneous mechanisms: the refractive index of glass and especially of plastic elements changes with temperature (dn/dT), the elements themselves expand, and the barrel and housing that set the flange distance expand at their own coefficient. Plastic (polymer) lens elements have a dn/dT roughly an order of magnitude larger than glass, which is why inexpensive all-plastic modules can visibly soften across temperature and why hybrid glass-plastic designs exist. Athermalization is the deliberate practice of choosing element materials and housing materials so that the focus shifts cancel — a mechanical and optical co-design decision that an outdoor camera specification must call out explicitly, and one that gets discovered late and expensively if the thermal test plan only checks that the camera still streams rather than that it is still sharp.",
          "Manufacturing tolerance is the second half of the same problem. The distance from the lens's rear principal plane to the sensor surface — the flange focal distance — must be correct to within a fraction of the depth of focus, which for a fast lens on a fine-pitch sensor can be a few micrometres. That budget has to absorb the sensor die's height variation within its package, the package's placement height on the PCB (solder paste and reflow variation), the PCB thickness, the mount's height, and the lens's own back-focal tolerance — a tolerance stack in exactly the sense of the mechanical-integration notes, but with micrometre-scale terms. Threaded M12 mounts allow focus to be set by rotating the barrel, then locked with adhesive; higher-performance products use active alignment, where automated equipment holds the lens while imaging a target, adjusts in up to six degrees of freedom (X, Y, Z, tilt in two axes, rotation) to optimize measured MTF across the field, and then cures adhesive in place. Active alignment also corrects sensor tilt, which is the usual cause of an image that is sharp on one side and soft on the other — a signature worth recognizing immediately, because it is a mechanical fault that no amount of ISP work will address.",
        ],
      },
      {
        type: "callout",
        heading: "Recognize optical faults by their signature",
        body: "Sharp centre, soft corners uniformly: lens MTF falloff or defocus. Sharp on one edge, soft on the opposite edge: sensor or lens tilt — a mechanical alignment fault. Corner darkening: vignetting or CRA mismatch. Corner colour cast that shading correction fights: CRA mismatch, essentially uncorrectable. Coloured fringes growing toward corners: lateral chromatic aberration, correctable. Overall softness that worsens hot or cold: thermal focus shift, an athermalization problem. Getting the signature right routes the fix to optics, mechanics, or manufacturing instead of sending the ISP team on a hunt.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Optical specification and review checklist",
        items: [
          "Specify FOV with the sensor format named; recompute FOV, working distance, and pixels-on-target whenever the sensor changes.",
          "Confirm the lens image circle covers the sensor diagonal with margin.",
          "Set f-number from the low-light and motion-blur budget; convert stops into exposure time and gain explicitly.",
          "Check the diffraction limit against pixel pitch before accepting a higher-resolution sensor.",
          "Verify lens and sensor chief-ray-angle curves match — this is a pairing constraint, not a preference.",
          "Do the depth-of-field and hyperfocal arithmetic to decide whether autofocus hardware is needed at all.",
          "Budget the flange-distance tolerance stack in micrometres; choose thread-lock or active alignment accordingly.",
          "Specify athermalization and validate sharpness — not just streaming — across the full temperature range.",
          "Design actuator drivers (VCM, solenoid, liquid lens) with sensor-noise coupling and blanking-window scheduling in mind.",
          "Decide per artifact whether correction happens in glass or in the pipeline, and record the SNR cost of each software correction.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does field of view change when the sensor is swapped but the lens stays?", answer: "FOV = 2·arctan(d/2f) depends on both focal length and sensor dimension d. A smaller sensor crops into the same projected image circle, narrowing the FOV — so a mid-programme sensor change silently alters field of view, working distance, and pixels-on-target, and may also leave the image circle failing to cover the diagonal." },
          { question: "What is the diffraction limit and why does it cap useful megapixels?", answer: "A perfect lens still spreads a point into an Airy disk of roughly 2.44·λ·N — about 3 µm at f/2.0. When that exceeds the pixel pitch the system is diffraction-limited and stopping down further softens the image. Adding pixels finer than the lens can resolve oversamples blur: more data, no more information." },
          { question: "What is chief ray angle mismatch and why can't software fix it?", answer: "Sensor microlenses are shifted to accept light within a designed angle cone at each image height. If the lens delivers different angles, peripheral light lands on wrong photodiodes or is shadowed — producing corner darkening and, because colour filters sit at different heights, colour-dependent shading. It is a physical light-collection failure, so lens and sensor must be selected as a matched pair." },
          { question: "Which lens artifacts are correctable downstream and which are not?", answer: "Correctable: geometric distortion (remapping), vignetting (shading gain, at the cost of corner noise), lateral chromatic aberration (per-channel scaling). Not correctable: longitudinal chromatic aberration, flare and ghosting, field curvature, and any genuine resolution loss — sharpening only amplifies what survived, plus noise and halos." },
          { question: "An image is sharp on the left and soft on the right. What is the likely cause?", answer: "Tilt between the lens and the sensor plane — a mechanical alignment fault from the mount, the tolerance stack, or the die placement. It is fixed by alignment (thread-lock adjustment or active alignment during production), never by ISP tuning." },
        ],
      },
    ],
    sources: [smithOpticalEngineering, edmundOpticsResources, iso12233Optics],
    related: ["camera-system-architecture", "image-sensor-electrical-behavior", "isp-pipeline-and-video-encoding", "camera-image-quality-and-calibration", "tolerance-stackup-and-fit"],
  },
  {
    slug: "isp-pipeline-and-video-encoding",
    libraryId: "technical",
    collectionId: "camera-systems",
    title: "ISP pipeline & video encoding",
    summary: "How raw sensor data becomes an image and then a stream: the ISP stages in order, the 3A control loops, HDR, colour management, the tuning process — then compression fundamentals, H.264/H.265/AV1, rate control, and the bandwidth-quality-latency triangle that decides a camera product's architecture.",
    readingTime: 27,
    updatedAt: "Aug 12",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Raw sensor output is not an image",
        body: [
          "What comes out of an image sensor is a single-channel array of numbers that is not viewable, not colour-correct, and not linear in the way human vision expects. Each value carries a black-level pedestal, the pixel sits behind one colour of a Bayer mosaic so two of its three colour components are missing, the values are proportional to photons rather than to perceived brightness, sensitivity varies across the array and falls toward the corners, some pixels are defective, and the colour filters' spectral responses do not match the human cone responses. The image signal processor is the sequence of operations that converts that raw measurement into a viewable, colour-accurate image — and understanding it matters to a hardware engineer for a specific reason: many faults that first appear as image artifacts are electrical or optical in origin, and knowing which pipeline stage would produce which artifact is what lets you route a bug to the right domain instead of asking the ISP team to hide it.",
          "The stages have a required order, because each assumes the previous ones are done. Corrections in the sensor's native linear domain must happen before any nonlinear transform; anything that estimates statistics needs the data to be corrected first; and demosaicing must come after the per-pixel corrections but before colour transforms that mix channels. Pipelines vary in detail and some stages move, but the skeleton below is close to universal.",
        ],
      },
      {
        type: "diagram",
        heading: "The ISP pipeline, stage by stage",
        art: "  RAW Bayer from sensor\n        |\n        v\n  [1] Black level subtraction  -- remove the pedestal; must precede all gains\n  [2] Defect pixel correction  -- replace hot/dead/stuck pixels from a map\n  [3] Lens shading correction  -- undo vignetting + CRA falloff (amplifies corner noise)\n  [4] Raw denoise              -- operate before demosaic while noise is per-pixel\n  [5] White balance gains      -- scale R and B so neutral scenes are neutral\n        |\n        v\n  [6] DEMOSAIC                 -- interpolate the missing 2/3 of colour data\n        |\n        v\n  [7] Colour correction matrix -- 3x3 mapping sensor primaries -> standard space\n  [8] Gamma / tone mapping     -- linear light -> perceptual encoding; HDR tone curve\n  [9] Colour space conversion  -- RGB -> YCbCr (luma/chroma separation)\n  [10] Chroma denoise + sharpen-- spatial/temporal NR; edge enhancement\n  [11] Scaling / cropping / distortion correction\n        |\n        v\n  [12] ENCODER (H.264/H.265/AV1) or raw/MJPEG out --> transport",
        caption: "Order is not arbitrary: linear-domain corrections precede demosaic; demosaic precedes channel-mixing transforms; gamma precedes anything tuned for perceptual appearance. The 3A statistics engines tap this pipeline (usually post-black-level, pre-demosaic) and feed exposure, gain, white balance, and focus decisions back to the sensor and lens.",
      },
      {
        type: "prose",
        heading: "What each stage is actually doing",
        body: [
          "Black level subtraction removes the deliberate electrical pedestal the sensor adds so that noise around zero is not clipped; get it wrong and shadows either crush to black (subtracting too much) or wash out with a milky, low-contrast cast (subtracting too little) — and because everything downstream multiplies, a black-level error becomes a colour cast that varies with exposure. Defect correction replaces pixels identified as hot, dead, or stuck from a per-unit map built during production test, interpolating from neighbours; defect populations grow with temperature and with sensor age, which is why the map is characterized at a defined condition and why a camera that develops visible white speckles when hot is showing dark-current defects rather than a processing bug. Lens shading correction applies a per-position gain surface to flatten the corner falloff measured during calibration — and because it multiplies corner signal, it multiplies corner noise with it, which is the direct mechanism by which an optically vignetted lens becomes a noisy-cornered image.",
          "White balance applies per-channel gains so that a neutral surface produces equal R, G, and B — correcting for the illuminant's colour temperature, which ranges from roughly 2700 K (incandescent, orange) through 5000–6500 K (daylight) to 10000 K (shade, blue). Demosaicing then interpolates the two missing colour values at every pixel from surrounding pixels of the other colours, and it is the stage where the classic artifacts live: zippering along edges, false colour on fine detail, and moiré where scene frequencies beat against the Bayer sampling grid. The colour correction matrix is a 3×3 transform mapping the sensor's actual filter primaries into a standard colour space (sRGB, Rec. 709), derived by measuring a known colour chart under known illuminants and solving for the matrix that minimizes colour error — necessary because silicon colour filters are nothing like human cone responses. Gamma encoding then converts linear light into a perceptual encoding, which is both a display convention and a bit-efficiency measure: human vision is far more sensitive to relative differences in shadows, so a nonlinear encoding puts code values where the eye can use them.",
        ],
      },
      {
        type: "prose",
        heading: "The 3A control loops: exposure, white balance, focus",
        body: [
          "Auto-exposure, auto-white-balance, and autofocus are the camera's three feedback loops, and reading them as control systems rather than as image-processing tricks makes their behaviour and their failure modes obvious. Auto-exposure measures scene brightness from a grid of statistics windows and drives three actuators to hit a target: exposure time (integration duration), analog gain, and sometimes aperture. Its control law encodes real trade-offs — longer exposure costs motion blur and eventually caps at the frame period, higher gain costs noise, so a well-designed AE prefers exposure time until motion blur becomes the binding constraint and only then raises gain. Its loop dynamics matter: the sensor applies a new exposure some frames after it is commanded (pipeline latency of typically two to three frames), so AE must be damped against oscillation, and it must be hysteretic and rate-limited so that a scene flickering between bright and dark does not produce visible pumping. Flicker avoidance is a related duty: under 50 Hz or 60 Hz mains lighting, exposure times that are not integer multiples of the half-cycle produce rolling brightness bands, so AE constrains its choices to flicker-safe values.",
          "Auto-white-balance estimates the scene illuminant and sets the channel gains — a genuinely underdetermined problem, since a white object under orange light and an orange object under white light produce identical sensor data. Practical algorithms combine heuristics (grey-world assumptions, specular highlight analysis, matching against a locus of plausible blackbody illuminants) and fail in predictable ways: a scene dominated by one strong colour drags grey-world estimates toward neutralizing that colour, which is why a close-up of grass can turn magenta. Autofocus closes the loop through the lens actuator, either by contrast detection (sweep focus, maximize a high-frequency energy metric — reliable but slow and hunting-prone, since it must overshoot to know it has passed the peak) or phase detection (dedicated or on-sensor phase-detect pixels compare two viewpoints to compute both the direction and magnitude of defocus in one shot — fast, and the reason modern sensors dedicate pixels to it). All three loops interact: gain changes alter noise, which alters the focus metric; exposure changes alter white balance statistics; and a poorly-arbitrated 3A produces visible instability that testers report as 'the image breathes.'",
        ],
      },
      {
        type: "prose",
        heading: "Dynamic range and HDR",
        body: [
          "Real scenes routinely span 100 dB or more of luminance — a face indoors against a bright window — while a single sensor exposure captures 60–70 dB at best, bounded below by read noise and above by full-well capacity. High dynamic range techniques close that gap by capturing multiple exposures and merging them. Multi-frame HDR takes sequential long and short exposures and blends them, which is simple but produces motion artifacts and ghosting when the scene moves between captures. Staggered or line-interleaved HDR reads long and short exposures nearly simultaneously with a small time offset, reducing motion artifacts at the cost of bandwidth (multiple exposures cross the interface every frame) and some vertical resolution. Dual-conversion-gain sensors switch the pixel conversion gain to trade sensitivity against full-well within a single exposure, and split-pixel designs place large and small photodiodes in each pixel site, capturing both a sensitive and a saturation-resistant signal at once — the approach dominating automotive and surveillance sensors precisely because it is motion-artifact-free.",
          "Merging produces a linear image with far more dynamic range than any display can show, so the pipeline must then tone map: compress a 100 dB scene into the roughly 60 dB a display can reproduce while preserving local contrast. Global tone curves are simple and stable but crush either highlights or shadows; local tone mapping adapts the curve per region, preserving local contrast far better but risking halos around high-contrast edges and, if the adaptation is too aggressive, the flat, unnatural look of over-processed HDR. For any camera whose output feeds a detection algorithm rather than a human, this is a decision with consequences: aggressive local tone mapping changes the statistics the algorithm was trained on, and the right answer is often a gentler curve or a separate linear stream for machine consumption.",
        ],
      },
      {
        type: "prose",
        heading: "Compression: why, and what it costs",
        body: [
          "Uncompressed video is impractical to move or store: 1080p30 at 8-bit 4:2:2 is roughly 0.6 Gbit/s, and 4K30 is about 2.5 Gbit/s — beyond what any Wi-Fi link, most Ethernet deployments, and any reasonable storage budget can absorb continuously. Compression exploits three redundancies. Spatial redundancy (neighbouring pixels are similar) is removed by transforming blocks into frequency coefficients and quantizing the high-frequency ones, which the eye notices least. Temporal redundancy (consecutive frames are similar) is removed by motion-compensated prediction: encode a block as a motion vector pointing into a previously coded frame, plus a small residual. Perceptual redundancy is exploited by chroma subsampling (4:2:0 stores colour at quarter resolution, since human vision resolves luminance detail far better than chrominance) and by quantizing more coarsely where artifacts are less visible.",
          "The frame-type structure follows directly. An I-frame (intra) is coded standalone and is the only entry point into a stream; a P-frame predicts from previous frames; a B-frame predicts bidirectionally from both past and future frames, achieving the best compression but requiring frames to be buffered and reordered — which adds latency and is why low-latency camera applications disable B-frames entirely. The group of pictures (GOP) is the I-frame interval, and it is a direct trade: long GOPs compress far better, short GOPs recover faster from packet loss and allow faster stream joining and seeking. For a surveillance camera, a 1–2 second GOP is typical; for a latency-critical control link, the structure may be all-intra or use periodic intra refresh, which spreads the refresh across a rolling band of each frame to avoid the bitrate spike an I-frame causes.",
        ],
      },
      {
        type: "table",
        heading: "Codec and rate-control choices",
        columns: ["Choice", "Options", "Trade-off"],
        rows: [
          ["Codec", "H.264/AVC, H.265/HEVC, AV1, MJPEG", "HEVC ≈ half the bitrate of AVC at equal quality, ~2–10× encode cost and licensing; AV1 royalty-free, heavier still; MJPEG all-intra, huge bitrate, trivial latency and editing"],
          ["Rate control", "CBR, VBR, capped VBR, CQ/CRF", "CBR fills a fixed pipe and wastes bits on static scenes; VBR is quality-consistent but bursty; capped VBR is the practical default for networked cameras"],
          ["GOP length", "All-intra … several seconds", "Long GOP compresses better; short GOP recovers from loss, seeks faster, and bounds error propagation"],
          ["B-frames", "Enabled / disabled", "Better compression vs. added reordering latency — disabled for real-time control paths"],
          ["Chroma format", "4:2:0, 4:2:2, 4:4:4", "4:2:0 halves data with little perceptual loss; 4:2:2+ needed for chroma-keying, colour analysis, and some machine vision"],
          ["Bit depth", "8-bit, 10-bit, 12-bit", "10-bit reduces banding in gradients and HDR content; costs bitrate and pipeline width"],
        ],
      },
      {
        type: "prose",
        heading: "The bandwidth–quality–latency triangle",
        body: [
          "Every camera product lands somewhere on a three-way trade, and being explicit about it prevents most late architectural crises. Bandwidth is bounded by the link and by storage; quality is bounded by bitrate at a given codec and resolution; latency is bounded by the sum of every buffering stage. Latency in particular is worth accounting end to end, because it accumulates in places people forget: sensor integration and readout (one frame period at minimum, plus rolling-shutter skew), ISP processing (often one frame), encoder buffering (one or more frames, and several if B-frames are enabled), packetization and network transit with any jitter buffer at the receiver, decode, and finally display buffering. A 30 fps pipeline with default settings frequently accumulates 150–250 ms glass-to-glass, which is invisible for recorded surveillance and completely unacceptable for anything a human or a control loop steers with.",
          "That is exactly why latency-critical systems make choices that look wasteful in isolation: all-intra or intra-refresh encoding to avoid frame reordering, slice-level or even row-level output so packets leave before the frame is complete, no jitter buffer, and — at the extreme — analog transmission, which has effectively zero encode latency because there is no encoder at all. The general lesson for camera architecture is to write down the latency budget alongside the bitrate budget at the start, decide which of the three corners the product is optimizing, and then hold that decision when someone later proposes a codec change 'for efficiency' that quietly doubles the loop delay.",
        ],
      },
      {
        type: "callout",
        heading: "Route the artifact to the right domain",
        body: "Banding synchronized to the frame or to actuator activity is electrical — supply noise or coupling, not ISP. Corner colour cast that shading correction fights is optical CRA mismatch. Zippering and false colour on fine edges is demosaic. Blocky mush in motion is encoder bitrate starvation. Brightness pumping is AE loop dynamics. Rolling brightness bands under artificial light is exposure-time flicker mismatch. Halos around high-contrast edges is over-aggressive local tone mapping or sharpening. Naming the stage that could produce the symptom is what keeps an image bug from being tuned into invisibility instead of fixed.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Pipeline and encoding review checklist",
        items: [
          "Confirm the pipeline order: linear-domain corrections before demosaic, demosaic before channel-mixing transforms, gamma before perceptual tuning.",
          "Verify black level across exposure and temperature — errors here become exposure-dependent colour casts.",
          "Characterize the defect map at a defined temperature and check defect growth when hot.",
          "Quantify the corner-noise cost of lens-shading gain; feed it back into the lens specification.",
          "Treat 3A as control loops: check AE damping and pipeline delay, flicker-safe exposure constraints, AWB failure on colour-dominant scenes, AF hunting behaviour.",
          "Choose the HDR method by motion artifact tolerance (split-pixel and DCG beat multi-frame for moving scenes).",
          "If the output feeds an algorithm, review tone mapping and sharpening against training-data statistics — or provide a separate linear stream.",
          "Set codec, GOP, B-frames, and rate control from an explicit bandwidth-quality-latency decision.",
          "Budget glass-to-glass latency stage by stage and measure it (LED plus photodiode on a scope, or a millisecond timer in frame).",
          "Re-verify the latency budget whenever codec or buffering settings change.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why must black level subtraction and lens shading correction happen before demosaicing?", answer: "They are per-pixel corrections valid in the sensor's linear domain, and everything downstream multiplies or mixes channels. A residual black-level error becomes an exposure-dependent colour cast once gains and the colour matrix are applied, and shading correction must operate on the individual colour planes before interpolation blends neighbours together." },
          { question: "Why does correcting vignetting make corners noisy?", answer: "Lens shading correction applies a positional gain to restore corner brightness, and gain multiplies signal and noise equally. The corners had less light, therefore lower SNR, and amplifying them preserves the deficit — which is why heavy optical vignetting shows up as a noise problem after correction." },
          { question: "Explain auto-exposure as a control loop, including its two main hazards.", answer: "AE measures scene statistics and drives exposure time and gain toward a target, preferring exposure time until motion blur binds, then gain. Hazards: loop delay (the sensor applies a new exposure two to three frames later, so insufficient damping causes oscillation and visible pumping) and flicker (exposure times not matched to mains half-cycles produce rolling brightness bands)." },
          { question: "What are I-, P-, and B-frames, and why do latency-critical systems disable B-frames?", answer: "I-frames are standalone (the only stream entry points), P-frames predict from past frames, B-frames predict bidirectionally from past and future. B-frames compress best but require buffering and reordering future frames before output, adding frames of latency — unacceptable when a human or a control loop is steering with the video." },
          { question: "Where does glass-to-glass latency accumulate, and how would you measure it?", answer: "Sensor integration and readout, ISP processing, encoder buffering (worse with B-frames), packetization and network transit plus any receiver jitter buffer, decode, and display buffering — commonly 150–250 ms at 30 fps with defaults. Measure it with an LED and photodiode on a scope, or by imaging a millisecond timer and comparing displayed to actual." },
        ],
      },
    ],
    sources: [ramanathColorPipeline, richardsonH264, itutHevc],
    related: ["camera-image-quality-and-calibration", "optics-lenses-and-imaging-geometry", "image-sensor-electrical-behavior", "camera-interfaces-and-protocols", "camera-testing-validation-and-production"],
  },
];
