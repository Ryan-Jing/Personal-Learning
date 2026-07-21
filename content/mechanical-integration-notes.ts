import type { Note, Source } from "./library";

const iec60529: Source = {
  title: "IEC 60529 — Degrees of protection provided by enclosures (IP Code)",
  publisher: "International Electrotechnical Commission",
  url: "https://webstore.iec.ch/en/publication/2452",
  kind: "Reference",
};

const asmeY145: Source = {
  title: "ASME Y14.5 — Dimensioning and Tolerancing (GD&T)",
  publisher: "American Society of Mechanical Engineers",
  url: "https://www.asme.org/codes-standards/find-codes-standards/y14-5-dimensioning-tolerancing",
  kind: "Reference",
};

const ipc7351: Source = {
  title: "IPC-7351 — Land Pattern & Component Placement",
  publisher: "IPC",
  url: "https://www.ipc.org/",
  kind: "Reference",
};

const tiThermalPad: Source = {
  title: "Thermal Interface Materials and Package Thermal Metrics",
  publisher: "Texas Instruments",
  url: "https://www.ti.com/lit/an/spra953d/spra953d.pdf",
  kind: "Documentation",
};

export const mechanicalIntegrationNotes: Note[] = [
  {
    slug: "pcb-mechanical-constraints",
    libraryId: "technical",
    collectionId: "hardware-mechanical-integration",
    title: "PCB ↔ mechanical constraints",
    summary: "The board outline, mounting holes, keep-outs, stack height, and connector-to-cutout alignment a PCB inherits from the enclosure — and how ECAD and MCAD negotiate them before layout is committed.",
    readingTime: 15,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The board lives inside someone else's constraint",
        body: [
          "A PCB is never a free-floating schematic realized in copper; it is an object that must fit, mount, and connect inside a mechanical enclosure that a mechanical engineer owns. Long before placement optimizes for signal integrity, the board inherits a set of hard mechanical constraints: its outline shape, where it bolts down, how tall its components may be, how far its edges must stay from walls and fasteners, and — the perennial flashpoint — exactly where its connectors sit so they line up with the openings in the housing. Treating these as inputs to design, negotiated early, is the difference between an electrical engineer who collaborates and one who throws a board over the wall for the ME to make fit.",
          "The value of understanding this is concrete: most late, expensive respins in a mechanically integrated product are not electrical failures, they are fit failures — a connector two millimeters from its cutout, a capacitor taller than the lid clearance, a mounting hole that lands on a trace. Every one of those is cheap to prevent at the constraint-setting stage and painful to fix after fab.",
        ],
      },
      {
        type: "prose",
        heading: "Outline, mounting, and keep-outs",
        body: [
          "The board outline is a mechanical drawing the enclosure dictates: its shape, its overall dimensions, and its fabrication tolerance (routed outlines hold roughly ±0.1–0.15 mm, which itself feeds the tolerance stack). Mounting holes are specified by pattern, diameter, and plating — sized not just for the screw but for the clearance the screw head and washer need, and for whether the hole is a signal-carrying, grounded, or purely mechanical feature. Around each fastener sits a keep-out: an annular region kept clear of components and often of copper, because the screw head, the standoff, and the tool that drives them all need room, and because clamping a board flexes it.",
          "Keep-outs come in several kinds and each is a mechanical fact the layout must honor. Height keep-outs cap component height in regions under a lid, a display, or a moving part. Component keep-outs reserve areas for the enclosure's own features — bosses, ribs, snap fingers. No-copper or RF keep-outs protect antenna clearance or fastener isolation. Board-to-board stack height, when a mezzanine or stacking connector joins two boards, is set by the connector's mated height and the standoffs, and it must be consistent across the connector, the spacers, and any shielding can between the boards. These are not suggestions the layout can nudge; they are dimensions shared with the mechanical model.",
        ],
      },
      {
        type: "prose",
        heading: "Connector and port placement: the classic negotiation",
        body: [
          "Connectors are where electrical intent and mechanical reality collide most often. A USB-C receptacle, an RJ45, a barrel jack, or an external header must align with an opening in the housing so a mating cable can reach it — and that alignment has to survive the tolerances of the board outline, the connector's own body tolerance, the board's mounting position, and the enclosure's cutout position, all stacked together. The electrically optimal position (short traces, clean return, away from noise) is frequently not the mechanically required position, and the resolution is negotiation: the EE proposes, the ME checks it against the housing, and the connector moves the two millimeters the enclosure needs. Doing this on day one is cheap; discovering it after fabrication means a respin or a housing change.",
          "Some choices ease the negotiation. Panel-mount or floating connectors absorb misalignment that a rigidly board-mounted part cannot. Recessing a connector or adding a lead-in chamfer to the cutout tolerates stack-up. And large boards need mechanical support — a standoff — right at any connector a user pushes into, because the insertion force flexes an unsupported board and cracks solder joints or ceramic capacitors near the connector. Placement for a connector is therefore simultaneously an electrical, a mechanical, and a reliability decision.",
        ],
      },
      {
        type: "prose",
        heading: "Prototype the mechanical interface before you fabricate",
        body: [
          "The cheapest respin is the one you never order, and one of the highest-leverage prototyping habits is to verify the mechanical interface physically before committing a board to fabrication. A connector sitting half a millimetre too high, or two ports spaced a hair too close for a thumb and a cable, is invisible on a screen and unmistakable the instant real hardware meets a real panel. The fast technique is to laser-cut or 3D-print a mock front panel — acrylic works well — and mount the actual connectors and switches into it: the real USB-A, USB-C, RJ45, and buttons, at their true footprints and heights. Within minutes that mock-up answers the questions a 2D layout hides — port alignment against the openings, mechanical clearance around each connector, spacing between adjacent ports, whether a user's fingers and cables can actually reach and mate them, and whether the whole arrangement drops into the enclosure. A few dollars and an afternoon of panel work stand against the weeks and cost of a board spin caused by a connector that is 0.5 mm out of position.",
          "The step works because it moves the tolerance-stack and fit questions out of CAD and into the physical world while copper is still free to move. Mount the genuine parts rather than stand-ins, so their real body dimensions and mating clearances are what you measure; check the panel in the actual or a printed enclosure so the cutout-to-connector relationship is tested end to end, not just connector-to-connector; and confirm accessibility with a real mating cable, not only a caliper. It is useful to think of this mechanical mock-up as the first stage of bring-up — a bring-up that begins before the board exists — because catching a fit problem here costs a reprinted panel, while catching the same problem after assembly costs a board spin, new stencils, and a schedule slip. Pair it with the connector-to-cutout tolerance stack so the mock-up is checked at the extremes of the stack, not just at nominal.",
        ],
      },
      {
        type: "prose",
        heading: "ECAD and MCAD share one truth",
        body: [
          "The mechanism that keeps electrical and mechanical design in agreement is a shared model, not a pair of drawings that drift apart. Modern flows export the board — its outline, mounting holes, connector bodies, tall components, and keep-out volumes — as a 3D STEP model into the mechanical CAD, or exchange them through a dedicated ECAD-MCAD collaboration format (IDF, or the incremental IDX), so that a change to a connector position or a component height round-trips between the two domains and conflicts surface as collisions in the assembly rather than as surprises at the bench. Agreeing on a common datum and origin is part of this: if the ECAD origin and the MCAD origin do not align, every position measurement is off by an unstated offset and the models silently disagree.",
          "The working practice is to lock the mechanical constraints first — connectors, mounting, height keep-outs, stack height — confirm them against the 3D enclosure model, and only then let the rest of the placement flow around signal integrity and thermal needs. The enclosure does not negotiate about where its openings are; the electrical layout has freedom everywhere those constraints leave it.",
        ],
      },
      {
        type: "table",
        heading: "Constraints a PCB inherits from the enclosure",
        columns: ["Constraint", "Set by", "What breaks if ignored"],
        rows: [
          ["Board outline & tolerance", "Enclosure cavity", "Board does not fit; edge shorts to wall"],
          ["Mounting-hole pattern & keep-out", "Standoffs / bosses", "Hole lands on a trace; screw head hits a part"],
          ["Height keep-outs", "Lid, display, moving parts", "Tall part hits the lid; won't close"],
          ["Board-to-board stack height", "Mezzanine connector + standoffs", "Boards won't mate; shield can won't fit"],
          ["Connector/port position", "Enclosure cutouts", "Cable can't reach; connector misaligned"],
          ["Support near press-in connectors", "User insertion force", "Board flex cracks joints / ceramic caps"],
        ],
      },
      {
        type: "callout",
        heading: "Lock the mechanical constraints, then optimize electrically",
        body: "Place the immovable things first — connectors at their cutouts, mounting holes, height keep-outs, stack height — and confirm them in the 3D enclosure model before optimizing placement for signal integrity and thermal spreading. A common ECAD/MCAD datum and a STEP round-trip keep the two domains from silently disagreeing.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Mechanical-constraint review",
        items: [
          "Before fabrication, mock up the front panel (laser-cut or 3D-printed) with the real connectors and switches mounted to verify alignment, clearance, spacing, accessibility, and enclosure fit.",
          "Import the board outline, mounting pattern, and keep-out volumes from the enclosure model, not a sketch.",
          "Verify every mounting hole for screw-head/washer clearance and whether it is mechanical, grounded, or signal.",
          "Check component heights against every height keep-out under lids, displays, and moving parts.",
          "Confirm each external connector aligns with its enclosure cutout across the full tolerance stack.",
          "Support the board mechanically at any connector a user pushes into.",
          "Agree a common ECAD/MCAD origin and round-trip a STEP/IDX model to catch collisions early.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Which constraints does a PCB inherit from the enclosure?", answer: "Board outline and tolerance, mounting-hole pattern and keep-outs, component height limits, board-to-board stack height, and the connector positions that must align with enclosure cutouts." },
          { question: "Why is connector placement a classic EE↔ME friction point?", answer: "The electrically optimal position (short, quiet routing) is often not the mechanically required one (aligned to the housing cutout across a tolerance stack). It is resolved by negotiating early, using floating/panel-mount connectors, and moving the part the millimeters the enclosure needs." },
          { question: "How do ECAD and MCAD stay in agreement?", answer: "By sharing one 3D model — a STEP export or an IDF/IDX exchange of outline, holes, connectors, and keep-outs — on a common datum, so changes round-trip and conflicts appear as collisions instead of bench surprises." },
          { question: "Why support a board at a user-inserted connector?", answer: "Insertion force flexes an unsupported board, and that flex cracks solder joints or nearby ceramic capacitors. A standoff at the connector carries the force." },
          { question: "Why mock up a front panel with real connectors before fabricating the board?", answer: "It moves the fit and tolerance-stack questions into the physical world while copper can still move. Mounting the actual connectors in a laser-cut or 3D-printed panel reveals alignment, clearance, spacing, and accessibility problems in minutes — catching a connector that is 0.5 mm out of position for the cost of a reprinted panel instead of a full board respin." },
        ],
      },
    ],
    sources: [ipc7351, asmeY145],
    related: ["component-placement", "tolerance-stackup-and-fit", "thermal-co-design-ee-me", "connector-and-cable-interfaces"],
  },
  {
    slug: "thermal-co-design-ee-me",
    libraryId: "technical",
    collectionId: "hardware-mechanical-integration",
    title: "EE/ME thermal co-design",
    summary: "Thermal as a shared problem: the EE provides the dissipation budget and hot-spot map, the ME provides the removal path — conduction to the enclosure, thermal interface materials, spreaders, vias, and (when allowed) airflow — and the two iterate.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Heat is a co-owned problem with a clean interface",
        body: [
          "Thermal management is the cleanest example of an EE↔ME shared problem, because the two disciplines own opposite ends of the same heat path and neither can solve it alone. The electrical engineer knows where the heat is generated and how much — the regulators, the processor, the power devices, the radios — computed from dissipation (P = I²R, per-component loss) and expressed as a junction-temperature budget through the thermal-resistance chain (Tj = Ta + P·θ). The mechanical engineer owns how that heat leaves: conduction into the enclosure, thermal interface materials, heat spreaders, heatsinks, and airflow. The productive framing is to treat it as one budget with a handoff: the EE hands over a power-dissipation budget and a hot-spot map, the ME returns an achievable path to ambient, and they iterate until the junction margin holds at worst-case ambient.",
          "That handoff has a concrete artifact: a table of {component, dissipated power, maximum junction temperature, package θ} plus a placement map showing where the hot parts sit. With that, the ME can design a removal path with real numbers rather than guessing, and the EE can see whether a proposed enclosure and interface actually keep every junction in bounds. Thermal problems get solved late and expensively precisely when this exchange never happens and each side assumes the other has it handled.",
        ],
      },
      {
        type: "prose",
        heading: "The path: junction to copper to interface to chassis",
        body: [
          "Heat flows from a device's junction through its package to the board copper, spreads laterally through pours and internal planes, crosses a thermal interface material into the chassis or a heatsink, and finally leaves to ambient by convection and radiation. The electrical engineer controls the first stretch: copper pour area and internal-plane connection to spread heat, thermal vias stitching a hot pad down to an internal plane or the opposite side (a via array under a power pad is a heat pipe as much as an electrical connection), and component placement that spreads hot parts apart and keeps them away from temperature-sensitive neighbors — references, electrolytics, oscillators, and sensors whose accuracy or lifetime degrades with temperature. Placing the hot parts near the point where the board couples to the chassis shortens the whole path.",
          "The mechanical engineer controls the exit. The critical detail is that air is an excellent insulator, so the gap between a hot component or board and the metal chassis must be bridged deliberately by a thermal interface material — a thermal pad or gap filler that conforms to the gap, a phase-change or grease layer for a tight CPU-to-heatsink joint, or a compressible gap-filler that spans a varying air gap. A heat spreader (a copper or aluminum plate) moves heat sideways to a larger surface before it reaches the sink. Every one of these has a thermal resistance that depends on its thickness, its area, and the pressure compressing it — which is why the interface material sits right at the intersection of thermal design and the tolerance stack that sets the actual gap.",
        ],
      },
      {
        type: "prose",
        heading: "Sealed enclosures: conduction is everything",
        body: [
          "The design changes character completely when the enclosure is sealed. An IP-rated outdoor device — dust-tight and water-jet-proof — has no vents and therefore no airflow, so convection inside the box is nearly useless and every watt must leave by conduction through the housing. That makes the metal enclosure itself the heatsink: the board couples to the chassis through a gap-filler, the chassis spreads and radiates the heat from its outer surface, and the whole thermal budget hinges on that conduction path and the enclosure's external area and finish. It is a strong point to raise about any sealed product — with no air to move, component placement near the chassis coupling point, generous thermal interface area, and a housing that can shed the total dissipated power become the entire strategy.",
          "When venting is allowed, the ME's toolbox opens up: natural convection with intake low and exhaust high to form a chimney, or forced convection with a fan — but both trade against ingress protection, acoustic noise, and reliability, and neither is available to a sealed device. The EE's job in either case is the same: deliver the honest dissipation budget and hot-spot map so the ME can choose a removal path that works, and flag when a rail's wasted power (an LDO on a big drop, a converter run inefficiently) is quietly making the thermal problem worse than it needs to be.",
        ],
      },
      {
        type: "table",
        heading: "Who owns which part of the heat path",
        columns: ["Stage of the path", "Owner", "Levers"],
        rows: [
          ["Heat generation & budget", "EE", "Efficiency, part choice, dissipation map, Tj limits"],
          ["Board spreading", "EE", "Copper pour, internal planes, thermal vias, placement"],
          ["Board-to-chassis interface", "EE + ME", "Thermal pad / gap filler thickness, area, pressure"],
          ["Spreading & sink", "ME", "Heat spreaders, heatsinks, chassis as sink"],
          ["Exit to ambient", "ME", "Convection (vents/fan) or, if sealed, conduction + radiation"],
        ],
      },
      {
        type: "callout",
        heading: "The handoff artifact: budget + hot-spot map",
        body: "Give the ME a table of each component's dissipated power, maximum junction temperature, and package θ, plus a placement map of where the hot parts sit. That turns thermal from a vague worry into a solvable path-to-ambient problem, and it is the concrete form of 'EE provides the heat, ME provides the way out, we iterate.'",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Thermal co-design review",
        items: [
          "Compute per-component dissipation for every operating mode, including faults, and express it as a junction-temperature budget.",
          "Hand the ME a dissipation budget and hot-spot placement map as a shared artifact.",
          "Spread heat on the board with copper pour, internal-plane connection, and thermal-via arrays under hot pads.",
          "Place hot parts away from temperature-sensitive references, electrolytics, oscillators, and sensors, and near the chassis coupling point.",
          "Bridge the board-to-chassis air gap with a thermal interface material sized for the actual (tolerance-driven) gap.",
          "For sealed enclosures, treat conduction to the housing as the whole strategy — no airflow exists.",
          "Validate junction/hot-spot temperatures at worst-case ambient in the real, closed enclosure.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "How do you frame thermal as an EE↔ME shared problem?", answer: "The EE provides the dissipation budget and hot-spot map (from P and Tj = Ta + P·θ); the ME provides the removal path (conduction, interface materials, spreaders, sinks, airflow). They iterate on one budget until junction margin holds at worst-case ambient." },
          { question: "Why does a thermal interface material matter so much?", answer: "Air is a strong insulator, so the gap between a hot part or board and the chassis must be bridged deliberately. A thermal pad or gap filler conforms to that gap; its resistance depends on thickness, area, and compression pressure." },
          { question: "Why is conduction 'everything' in a sealed IP-rated device?", answer: "A sealed enclosure has no vents and no airflow, so convection inside is useless. Every watt must conduct through the housing, making the metal chassis the heatsink and the board-to-chassis interface the critical path." },
          { question: "What can the EE do on the board to help the thermal path?", answer: "Spread heat with copper pour and internal planes, stitch thermal vias under hot pads, place hot parts apart and away from sensitive components, and locate them near the chassis coupling point — while keeping wasted power (inefficient rails) out of the budget." },
        ],
      },
    ],
    sources: [tiThermalPad],
    related: ["power-and-energy", "high-current-and-thermal-pcb-design", "pcb-mechanical-constraints", "enclosures-and-ingress-protection"],
  },
  {
    slug: "enclosures-and-ingress-protection",
    libraryId: "technical",
    collectionId: "hardware-mechanical-integration",
    title: "Enclosures & ingress protection",
    summary: "Decoding IP ratings, sealing and the breathing problem, connector and cable-gland sealing, and the plastic-vs-metal trade between EMI shielding, heat spreading, and RF/antenna transparency.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "What an IP rating actually claims",
        body: [
          "An ingress-protection rating is two independent test results wearing one label. The IP code is 'IP' followed by a first digit for solids (0–6, where 6 is dust-tight) and a second digit for water (0–9K, from dripping up to high-pressure hot jets). IP66 means dust-tight and protected against powerful water jets; IP67 means protected against temporary immersion (one metre for thirty minutes); IP68 means continuous immersion to a stated depth; IP69K means high-pressure, high-temperature spray-down. The two digits are separate tests, so a jet rating does not imply an immersion rating and vice versa — deck or wash-down equipment that needs both is written IP66/IP67. An 'X' stands in for an untested digit (IPX7 rates water only). Crucially, an IP rating is the result of a standardized test, not a promise of service life: it says the enclosure passed that specific test when new, not that it will stay sealed for years.",
          "Knowing the code conceptually is the point for a design conversation: which digit the product must hit, and therefore how the sealing, the venting, the connectors, and the board mounting all have to behave. The rating is a design input that ripples through every mechanical choice.",
        ],
      },
      {
        type: "prose",
        heading: "Sealing, and the breathing problem",
        body: [
          "Sealing an enclosure means controlling every path air and water could take: a gasket (an O-ring, a die-cut sheet, or a form-in-place bead) compressed within its specified range along a tongue-and-groove joint, potting or conformal coating for the board itself, and welded or bonded seams where no opening is needed. Every gasket has a compression range and takes a permanent set over time, so the mechanical design must hold it in that range across the tolerance stack — too little compression leaks, too much damages the gasket or bows the housing.",
          "The failure mode that surprises people is that a sealed box breathes. Temperature cycling changes the air pressure inside a closed volume: a device that heats in the sun and cools after sunset repeatedly inhales and exhales through any marginal gasket, and each cool-down pulls a partial vacuum that draws moist air past the seal to condense inside — flooding an enclosure that never saw a drop of liquid water. The engineered fixes are deliberate, not hopeful: a pressure-equalizing vent membrane (a PTFE patch that passes air and water vapour but blocks liquid), desiccant with a service interval for truly sealed volumes, or a designed drain at the low point that lets whatever gets in run out. Raising the breathing problem — and the vent-membrane solution — signals you understand sealing as a system, not a rubber ring.",
        ],
      },
      {
        type: "prose",
        heading: "Connectors and cable entries are the weak points",
        body: [
          "Most enclosures fail to seal at their openings, and connectors are the first suspect. A connector usually carries its IP rating only when mated or fitted with its sealing cap, so the design has to survive the unmated state a user will inevitably leave it in. Cable glands seal by compressing a grommet around a round cable jacket of the correct diameter — a flat cable, an oversized gland, or a nicked jacket turns the gland into a capillary that wicks water in. Orientation is nearly free reliability: connectors facing downward, a drip loop in every cable so water runs off before the entry, and gasket faces kept out of standing water convert a marginal seal into a durable one. These are cheap decisions that dominate real-world ingress performance far more than the headline IP digit.",
        ],
      },
      {
        type: "prose",
        heading: "Plastic vs metal: shielding, heat, and RF",
        body: [
          "The enclosure material trade sits squarely at the EE↔ME boundary because it couples electrical performance to mechanical and environmental needs. A metal enclosure (aluminium, die-cast, or steel) is a built-in EMI shield and a heat spreader and is rigid and durable — but it blocks radio signals, so any internal antenna is detuned or dead, and the metal must be deliberately bonded and grounded to actually shield rather than float and resonate. A plastic enclosure (ABS, polycarbonate, PC/ABS, glass-filled nylon) is transparent to RF, so antennas can live inside it, and it is lighter and cheaper — but it provides no shielding (the board must carry its own shield cans or the plastic needs a conductive coating) and conducts heat poorly, throwing the thermal burden back onto internal conduction paths. Outdoor plastics also need UV and weathering resistance, and any material has a flame rating and a coefficient of thermal expansion that interacts with the board and the seals.",
          "Antenna placement is where this trade becomes a real negotiation. A metal housing forces the antenna external or behind a plastic 'radome' window, imposes keep-outs and ground-plane clearances, and interacts with the very sealing and venting the product needs — an external antenna is another sealed penetration. For a wireless product the material choice, the shielding strategy, the thermal path, and the antenna location are one coupled decision, and the electrical engineer who can hold all four at once is the one the mechanical team wants in the room early.",
        ],
      },
      {
        type: "table",
        heading: "Enclosure material trade-offs",
        columns: ["Property", "Metal enclosure", "Plastic enclosure"],
        rows: [
          ["EMI shielding", "Built in (if bonded/grounded)", "None — needs board shields or conductive coating"],
          ["Heat", "Spreads and sheds heat well", "Poor conductor; conduction path is internal"],
          ["RF / antennas", "Blocks — antenna must be external/radome", "Transparent — antenna can sit inside"],
          ["Weight / cost", "Heavier, often costlier", "Lighter, cheaper at volume"],
          ["Durability / outdoor", "Rigid, robust", "Needs UV/weather grade and flame rating"],
        ],
      },
      {
        type: "callout",
        heading: "A sealed box still breathes",
        body: "Temperature cycling pumps air in and out of any closed enclosure, and each cool-down inhales moist air that condenses inside — so pursuing a perfect seal can trap the very moisture it was meant to exclude. Pressure-equalizing PTFE vent membranes, desiccant, or a deliberate low-point drain solve what a better gasket cannot. Connectors seal only when mated; glands seal only on the right round cable; downward orientation and drip loops do the rest.",
        tone: "warning",
      },
      {
        type: "checklist",
        heading: "Enclosure & ingress review",
        items: [
          "Confirm the required IP digits (solids and water) and treat them as inputs to sealing, venting, and mounting.",
          "Keep every gasket within its compression range across the tolerance stack; account for compression set over life.",
          "Add a pressure-equalizing vent membrane, desiccant, or a drain to handle thermal breathing.",
          "Check that connectors are sealed in the unmated state and that cable glands match the actual cable diameter.",
          "Orient connectors downward with drip loops and gasket faces out of standing water.",
          "Choose metal vs plastic by weighing shielding, heat spreading, and RF/antenna transparency together.",
          "For wireless products, resolve material, shielding, thermal path, and antenna placement as one coupled decision.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What does IP66 mean, and why isn't it the same as IP67?", answer: "IP66 is dust-tight plus protection against powerful water jets. The two digits are independent tests — the jet rating (6) does not imply the immersion rating (7), so equipment needing both is dual-rated IP66/IP67." },
          { question: "Why can a well-sealed enclosure still fill with moisture?", answer: "It breathes: temperature cycling pumps air through marginal seals, and each cool-down draws in moist air that condenses inside. Vent membranes, desiccant, or a drain fix it — a tighter gasket alone does not." },
          { question: "What is the core plastic-vs-metal enclosure trade?", answer: "Metal shields EMI and spreads heat but blocks RF/antennas and must be bonded; plastic is RF-transparent, light, and cheap but offers no shielding and conducts heat poorly. For wireless products it couples with antenna placement." },
          { question: "Why are connectors and cable glands the usual sealing weak points?", answer: "Connectors often hold their IP rating only when mated or capped, and glands seal only on a correctly sized round cable. Downward orientation and drip loops matter more to real ingress than the headline digit." },
        ],
      },
    ],
    sources: [iec60529],
    related: ["waterproofing-corrosion-and-ignition-protection", "thermal-co-design-ee-me", "emi-emc-pcb-design", "pcb-mechanical-constraints"],
  },
  {
    slug: "tolerance-stackup-and-fit",
    libraryId: "technical",
    collectionId: "hardware-mechanical-integration",
    title: "Tolerance stack-up & fit",
    summary: "How manufacturing tolerances accumulate across mating parts, worst-case vs statistical stacking, the EE dimensions that stack (board thickness, connector and standoff height, gap-filler compression), and the design levers that absorb it.",
    readingTime: 15,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Nominal-perfect can fail at the extremes",
        body: [
          "Every manufactured dimension has a tolerance — a band around its nominal value within which the part is still 'good.' Tolerance stack-up is the cumulative effect of those bands when several parts mate: the errors add up, and a design that fits perfectly at every nominal dimension can fail when the parts happen to land at the unlucky ends of their tolerances at once. This is the concept mechanical engineers care about most and the one electrical engineers most often overlook, so understanding it is a direct way to be easier to work with. The core discipline is to design for the extremes of the stack, not for the nominal — the nominal always fits; it is the corners that ship as field failures.",
          "The reason it matters to an EE is that many of the dimensions in a stack are electrical parts. A connector must still mate, a thermal pad must still make contact, a board must still clear a wall — and whether it does depends on tolerances the EE controls (board thickness, component and connector height) stacking with tolerances the ME controls (enclosure walls, cutout positions, standoff heights). Neither side sees the whole stack unless they add it up together.",
        ],
      },
      {
        type: "prose",
        heading: "Worst-case vs statistical stacking",
        body: [
          "There are two ways to add a stack, and choosing between them is an engineering decision about cost and risk. Worst-case (arithmetic) stacking sums every tolerance at its full extent: if the total worst-case stack still fits, assembly is guaranteed to work for every possible combination of parts. It is safe but pessimistic, and demanding it on a long stack forces tight, expensive tolerances on every contributor. Statistical (root-sum-square) stacking instead treats each tolerance as an independent random variation and combines them as the square root of the sum of squares, which yields a much smaller predicted stack because the odds of every part hitting its extreme simultaneously are vanishingly small. RSS is appropriate for volume production where the process is centered and capable (tracked by Cpk), but it accepts a small, quantified fraction of assemblies at the tails — so it is the right tool for a million-unit run and the wrong tool for a safety-critical single-fit feature.",
          "The practical middle ground is to worst-case the features that must never fail and RSS the rest, and to know which contributors dominate — a stack is usually driven by two or three large tolerances, and tightening those buys far more than squeezing the small ones. Mechanical engineers formalize all of this with geometric dimensioning and tolerancing (GD&T): datums that define where measurements start, and position tolerances that bound a feature relative to those datums rather than as loose ± dimensions. An EE does not need to author GD&T, but recognizing datums and position callouts is what lets you give the ME a connector location referenced to the right feature instead of an arbitrary board origin.",
        ],
      },
      {
        type: "prose",
        heading: "The stacks an EE actually lives in",
        body: [
          "Two stacks recur in electromechanical design. The connector-alignment stack decides whether an external connector still lines up with its enclosure cutout: it accumulates the board-outline fabrication tolerance, the connector's own body tolerance, the board's mounting position within the housing, and the enclosure cutout position — and the sum must keep the connector centered enough in the opening for a cable to mate. When that stack is too large, the fix is a floating or panel-mount connector that absorbs the misalignment, or a lead-in chamfer on the cutout, rather than tightening four tolerances at once.",
          "The thermal-interface stack decides whether a gap-filler actually touches. The air gap between the board and the chassis is itself a stack — board thickness tolerance, component or standoff height tolerance, and chassis flatness — so the gap varies from a minimum to a maximum across production. The thermal pad or gap filler must span that whole range: thick enough to still contact the chassis at the maximum gap, but compliant enough that at the minimum gap it does not over-compress and bow the board or crack a component. This is why gap-fillers are specified by a compression range, and why the thermal path (from the co-design note) and the tolerance stack are the same conversation. Any interference-fit or press-in feature has the same logic — it must still assemble at the tight extreme and still hold at the loose extreme.",
        ],
      },
      {
        type: "table",
        heading: "EE dimensions that feed a stack",
        columns: ["Contributor", "Typical variation", "What it threatens"],
        rows: [
          ["PCB thickness", "±10% (e.g. 1.6 mm ±0.16 mm)", "Board-to-chassis gap; connector height; press fit"],
          ["Routed board outline", "±0.1–0.15 mm", "Fit in cavity; edge clearance; connector position"],
          ["Connector body height/position", "Per datasheet tolerance", "Alignment to enclosure cutout"],
          ["Standoff / spacer height", "Part + assembly tolerance", "Stack height; interface gap"],
          ["Component height", "Package tolerance", "Height keep-out; lid clearance"],
          ["Gasket / gap-filler thickness", "Compression range", "Sealing and thermal contact at gap extremes"],
        ],
      },
      {
        type: "callout",
        heading: "Design for the corners, and absorb the stack deliberately",
        body: "The nominal always fits; the extremes are what fail in the field. Use worst-case stacking on features that must never fail and RSS on the rest, tighten the two or three dominant contributors rather than all of them, and absorb the remaining stack with floating connectors, lead-in chamfers, compliant gaskets, gap-fillers, and clearance — features that self-locate instead of demanding perfect parts.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Tolerance-stack review",
        items: [
          "List every part in each mating stack and add its tolerance — both worst-case and RSS.",
          "Worst-case the features that must never fail; RSS the volume-production remainder.",
          "Identify the two or three dominant contributors and tighten those, not every dimension.",
          "Check the connector-to-cutout stack and add float or a lead-in if it is too large.",
          "Size gaskets and gap-fillers to their compression range across the min-to-max gap.",
          "Reference positions to the correct datum (the mating feature), not an arbitrary origin.",
          "Confirm assembly at the tight extreme and retention/contact at the loose extreme.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What is tolerance stack-up and why design for the extremes?", answer: "It is the accumulation of individual part tolerances across mating parts. A design that fits at every nominal dimension can fail when parts land at the unlucky ends of their tolerances together, so you design for the worst-case corners, not the nominal." },
          { question: "When do you use worst-case vs RSS stacking?", answer: "Worst-case (arithmetic) sums all tolerances and guarantees fit for every combination — safe but expensive; use it on must-never-fail features. RSS combines them statistically for a smaller stack — right for capable, centered volume processes, accepting a tiny tail fraction." },
          { question: "Give an EE-owned example of a stack and how you absorb it.", answer: "The connector-to-cutout stack (board outline + connector body + mounting position + enclosure cutout). Absorb it with a floating/panel-mount connector or a lead-in chamfer rather than tightening four tolerances. The board-to-chassis gap similarly sets the gap-filler's required compression range." },
          { question: "Why do thermal design and tolerance stack-up meet at the gap-filler?", answer: "The air gap the gap-filler must bridge is itself a stack (board thickness, standoff, component height, chassis flatness), so the filler must contact at the maximum gap yet not over-compress at the minimum — specified as a compression range." },
        ],
      },
    ],
    sources: [asmeY145, ipc7351],
    related: ["pcb-mechanical-constraints", "thermal-co-design-ee-me", "dfm-dfa-and-testability", "connector-and-cable-interfaces"],
  },
];
