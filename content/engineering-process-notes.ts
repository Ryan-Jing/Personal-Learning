import type { Note, Source } from "./library";

const incoseHandbook: Source = {
  title: "INCOSE Systems Engineering Handbook — the V lifecycle",
  publisher: "International Council on Systems Engineering",
  url: "https://www.incose.org/products-and-publications/se-handbook",
  kind: "Reference",
};

const isoIec15288: Source = {
  title: "ISO/IEC/IEEE 15288 — Systems and software life cycle processes",
  publisher: "International Organization for Standardization",
  url: "https://www.iso.org/standard/81702.html",
  kind: "Reference",
};

const asqRca: Source = {
  title: "Root Cause Analysis, Fishbone, and the Five Whys",
  publisher: "American Society for Quality",
  url: "https://asq.org/quality-resources/root-cause-analysis",
  kind: "Reference",
};

const aiagFmea: Source = {
  title: "FMEA Handbook (Design & Process FMEA)",
  publisher: "AIAG / VDA",
  url: "https://www.aiag.org/quality/automotive-core-tools/fmea",
  kind: "Reference",
};

export const engineeringProcessNotes: Note[] = [
  {
    slug: "validation-lifecycle-and-v-model",
    libraryId: "technical",
    collectionId: "engineering-process",
    title: "Validation lifecycle & the V-model",
    summary: "The V-model linking requirements to verification, verification vs validation, design verification vs process validation, and the EVT/DVT/PVT hardware build phases — so any problem can be placed in the lifecycle.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "The V-model ties every requirement to a test",
        body: [
          "The V-model is the standard picture of a hardware development lifecycle, and it earns its shape by pairing decomposition with verification. Down the left leg the design decomposes from the top: user needs become system requirements, which become subsystem architecture, which becomes detailed module design, which becomes implementation at the bottom of the V. Up the right leg the product is integrated and tested in mirror order, and — this is the whole point — each test level validates against the left-leg level at the same height. Unit tests check the detailed design, integration tests check the architecture, system verification checks the system requirements, and final validation checks the original user needs. Every requirement written on the way down should have a corresponding verification defined on the way up; a requirement with no test is a wish, and a test with no requirement is a guess.",
          "The value of carrying this model is that it makes 'structured thinking' concrete. When a problem appears, you can place it: is this a requirements gap (the left leg was wrong), a design defect (the design did not meet a correct requirement), or an integration failure (the pieces were each fine but did not compose)? Knowing where on the V a problem lives tells you which artifact to fix and how far the fix ripples — a requirements error found at final validation is enormously more expensive than the same error caught at the requirements review, which is the economic argument for the whole disciplined structure.",
        ],
      },
      {
        type: "prose",
        heading: "Verification vs validation, DV vs PV",
        body: [
          "Two word pairs cause most of the confusion, and getting them straight signals real process literacy. Verification asks 'did we build the thing right?' — does it meet its specification. Validation asks 'did we build the right thing?' — does it meet the actual need in real use. A product can pass every verification test against a specification and still fail validation because the specification itself was wrong for the user; the two are different questions aimed at different failure modes. In hardware the same distinction appears as design verification (DV) versus process validation (PV): DV proves the design meets its requirements over corners, margins, and environment, while PV proves the manufacturing process can reliably and repeatably produce that design at quality and yield. A design can be verified as correct yet be impossible to build consistently — which is exactly the gap PV exists to close.",
          "Underpinning both is traceability: a matrix linking every requirement to the design element that satisfies it and the test case that verifies it, so nothing is unbuilt, untested, or untraceable to a need. When a requirement changes, traceability shows every design and test it touches; when a test fails, it points back to the requirement at stake. The hardware requirements document is the anchor of that web — the single source of truth the whole V is built around — which is why owning it is a real responsibility, not paperwork.",
        ],
      },
      {
        type: "prose",
        heading: "EVT, DVT, PVT: the build phases",
        body: [
          "Hardware ramps through a sequence of build phases, each a gate with its own question, and being able to name them and place a problem in them is what 'lifecycle thinking' looks like in practice. EVT — engineering validation test — asks 'does the design fundamentally work?' It uses early functional prototypes to find design bugs, prove the core architecture, and shake out the big unknowns; the design is still expected to change. DVT — design validation test — asks 'does it meet all of its specifications?' The design is essentially frozen, and the build is tested exhaustively against every requirement, including environmental corners, reliability, and regulatory compliance (EMC, safety), often on production-intent tooling. PVT — production validation test — asks 'can the line build it at yield and quality?' It validates the manufacturing process, tooling, fixtures, and test coverage at pilot volume before full mass production.",
          "The phases correspond to the two legs of the V and the DV/PV split: EVT and DVT walk up the verification leg proving the design, while PVT is process validation proving the build. Placing a problem in this sequence sets its cost and its owner — a functional bug at EVT is normal and cheap, the same bug at PVT means retooling and a slipped ramp. Structured problem-solving, then, is partly just knowing which gate you are at, what that gate is supposed to prove, and whether the problem in front of you belongs to design or to process.",
        ],
      },
      {
        type: "table",
        heading: "The hardware build phases",
        columns: ["Phase", "Question it answers", "State of the design", "Typical focus"],
        rows: [
          ["EVT (Engineering Validation)", "Does the design work at all?", "Fluid — expected to change", "Prove architecture, find design bugs, close unknowns"],
          ["DVT (Design Validation)", "Does it meet every spec?", "Frozen", "Full requirements, environmental corners, reliability, compliance"],
          ["PVT (Production Validation)", "Can the line build it at yield?", "Locked", "Tooling, fixtures, test coverage, process capability at pilot volume"],
          ["MP (Mass Production)", "Sustaining quality at scale", "Released", "Yield, traceability, corrective action in the field"],
        ],
      },
      {
        type: "callout",
        heading: "Place the problem before solving it",
        body: "The V-model and the EVT/DVT/PVT sequence are diagnostic instruments as much as plans: when something goes wrong, first locate it — requirements gap, design defect, or process/build failure; EVT surprise or PVT surprise — because the location tells you which artifact to change, who owns it, and how expensive the fix is. Verification (built it right) and validation (built the right thing) are different questions; answer the one the problem is actually asking.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Lifecycle review",
        items: [
          "Pair every requirement with a verification method as you write it; keep a traceability matrix.",
          "Separate verification (meets spec) from validation (meets need) and test for both.",
          "Distinguish design verification (design meets requirements) from process validation (line builds it repeatably).",
          "Anchor the whole lifecycle in a maintained hardware requirements document.",
          "Set entry/exit criteria for EVT, DVT, and PVT and hold the gate reviews.",
          "When a problem appears, locate it on the V and in the build phase before choosing a fix.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "What does the V-model enforce?", answer: "That each test level on the right leg verifies the design level at the same height on the left leg — user needs to validation, requirements to system verification, and so on — so every requirement has a matching verification and none is orphaned." },
          { question: "Verification vs validation?", answer: "Verification asks 'did we build it right?' (meets the specification). Validation asks 'did we build the right thing?' (meets the actual need). A product can pass verification against a wrong spec and still fail validation." },
          { question: "What do EVT, DVT, and PVT each prove?", answer: "EVT — the design fundamentally works (find design bugs, design still fluid). DVT — it meets every spec over corners, reliability, and compliance (design frozen). PVT — the production line can build it at yield and quality (process validation)." },
          { question: "How is DV different from PV?", answer: "Design verification proves the design meets its requirements; process validation proves manufacturing can produce that design reliably and repeatably. A verified design can still be unbuildable at yield, which is what PV catches." },
        ],
      },
    ],
    sources: [incoseHandbook, isoIec15288],
    related: ["root-cause-analysis", "dfm-dfa-and-testability", "distributed-hardware-collaboration"],
  },
  {
    slug: "root-cause-analysis",
    libraryId: "technical",
    collectionId: "engineering-process",
    title: "Root-cause analysis & structured problem-solving",
    summary: "Separating symptom from root cause, the 5 Whys and fishbone, Pareto and is/is-not bounding, corrective vs preventive action, FMEA for design-time risk, and prioritizing by critical path and information value.",
    readingTime: 16,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "Fix the cause, not the symptom",
        body: [
          "Structured problem-solving starts from one distinction: the symptom is what you observe, the cause is what produced it, and the root cause is the systemic reason the cause was allowed to exist. Fixing the symptom makes the problem disappear until it returns; fixing the root cause stops it from recurring. The whole toolkit below exists to force the search past the first plausible explanation to the systemic one, and to keep the search organized instead of leaping to a favorite theory. Naming the framework you are using — out loud, in an interview or a review — is itself part of the value, because it shows you are working a method rather than guessing.",
          "The word that matters in the interview outline is 'strategic': the aim is to zoom out, not just to grind. Strategic problem-solving means knowing which problem to attack first, what is actually blocking progress, and what is cheap to test — spending investigation effort where it returns the most information per unit of time, rather than exhaustively chasing every possibility in the order it occurred to you.",
        ],
      },
      {
        type: "prose",
        heading: "The core frameworks: 5 Whys, fishbone, Pareto, is/is-not",
        body: [
          "The 5 Whys drives depth: ask 'why' of the symptom, then 'why' of that answer, repeatedly, until you reach an actionable systemic cause rather than a restatement. Its strength is speed and simplicity; its trap is that it is single-threaded — real failures often have several contributing causes, and a naive 5 Whys can march down one branch and miss the others, or stop too early at a convenient answer. The fishbone (Ishikawa) diagram fixes that breadth problem: it organizes a brainstorm of possible causes into categories — classically the 6 Ms of Materials, Machine, Method, Measurement, Man/People, and Environment, or a hardware variant of design, component, process, test, supplier, and environment — so the team considers every family of cause before diving into any one. Use fishbone to spread the possibilities wide, then 5 Whys to drill into the branch the evidence favors.",
          "Two more sharpen the search. Pareto analysis applies the 80/20 rule — attack the vital few causes that produce most of the failures rather than spreading effort evenly — and it turns a pile of defect data into a ranked target list. The is/is-not technique (from Kepner-Tregoe) bounds a problem by asking what is affected versus what is conspicuously not, when and where it happens versus when and where it doesn't; the boundary between 'is' and 'is not' localizes the cause the way bisection localizes a fault on a bench. Together these convert a vague 'it sometimes fails' into a bounded, prioritized, categorized investigation.",
        ],
      },
      {
        type: "prose",
        heading: "From analysis to action: correction, corrective, preventive",
        body: [
          "A root cause is only useful if it drives the right kind of action, and disciplined processes (the 8D method, or corrective-and-preventive-action systems) separate three levels that are easy to conflate. Correction fixes the unit in front of you — rework this board. Corrective action stops this cause from recurring — change the process, the design, or the check that let it through. Preventive action stops similar causes elsewhere — apply the lesson to the whole product family before they fail too. Containment comes first in a real incident (stop shipping the defect, quarantine the suspect stock) so the bleeding stops while the root cause is found, and verification of effectiveness comes last: prove the corrective action actually eliminated recurrence, ideally by confirming the failure can no longer be reproduced.",
          "The same thinking runs forward as well as backward. Failure modes and effects analysis (FMEA) is root-cause analysis done before the failure: it walks each part of a design or process, asks how it could fail and what the effect would be, and ranks each risk by a priority number combining severity, likelihood of occurrence, and likelihood of detection — directing design effort to the risks that are severe, likely, and hard to catch. Fault-tree analysis works top-down from an undesired outcome to its contributing causes, complementing FMEA's bottom-up sweep. Whether tracing a failure that happened or one that might, the discipline is the same: structure the search, reach the systemic cause, and act at the level that prevents recurrence.",
        ],
      },
      {
        type: "table",
        heading: "Choosing a technique",
        columns: ["Technique", "What it's for", "Watch out for"],
        rows: [
          ["5 Whys", "Drilling to a systemic cause fast", "Single-threaded; can miss multiple causes or stop early"],
          ["Fishbone (Ishikawa)", "Spreading causes across categories", "A brainstorm, not proof — still needs evidence"],
          ["Pareto (80/20)", "Prioritizing the vital few", "Needs real frequency/impact data"],
          ["Is / is-not", "Bounding and localizing the problem", "Requires careful, honest observation"],
          ["FMEA", "Ranking design/process risk before failure", "Can become a checkbox if scores aren't acted on"],
          ["8D / CAPA", "Driving correction → corrective → preventive", "Verify effectiveness, don't stop at containment"],
        ],
      },
      {
        type: "callout",
        heading: "Prioritize by information value and critical path",
        body: "Strategic problem-solving is triage: attack what is blocking the critical path first, and among competing hypotheses test the one that is cheapest and most decisive — the experiment that eliminates the most uncertainty per hour. A five-minute measurement that rules out half the causes beats a day-long teardown that confirms a hunch. Zoom out to choose the problem before zooming in to solve it.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Problem-solving checklist",
        items: [
          "State the symptom precisely and separate it from suspected cause and root cause.",
          "Bound the problem with is/is-not; spread possible causes with a fishbone.",
          "Drill the favored branch with 5 Whys until the cause is systemic and actionable.",
          "Prioritize with Pareto and by critical path; test the cheapest, most decisive hypothesis first.",
          "Contain first, then drive correction, corrective action, and preventive action as distinct steps.",
          "Verify effectiveness — confirm the failure can no longer be reproduced.",
          "Use FMEA (and fault trees) to find high-risk failure modes before they occur.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why distinguish symptom, cause, and root cause?", answer: "Fixing the symptom makes the problem return; only fixing the systemic root cause stops recurrence. The frameworks exist to push the search past the first plausible answer to the systemic one." },
          { question: "How do the 5 Whys and fishbone complement each other?", answer: "Fishbone spreads possible causes across categories (the 6 Ms) so none is missed — breadth; 5 Whys drills into a chosen branch to a systemic cause — depth. Use fishbone to widen, 5 Whys to deepen. 5 Whys alone can miss multiple causes." },
          { question: "What is the difference between corrective and preventive action?", answer: "Correction fixes this unit; corrective action stops this cause from recurring (change the process/design/check); preventive action stops similar causes elsewhere before they occur. Containment precedes all three, and effectiveness must be verified." },
          { question: "What makes problem-solving 'strategic'?", answer: "Choosing which problem to attack and which hypothesis to test by critical path and information value — the cheapest, most decisive experiment first — rather than grinding through every possibility in order. Zoom out before zooming in." },
        ],
      },
    ],
    sources: [asqRca, aiagFmea],
    related: ["structured-hardware-debugging", "validation-lifecycle-and-v-model", "distributed-hardware-collaboration"],
  },
  {
    slug: "distributed-hardware-collaboration",
    libraryId: "technical",
    collectionId: "engineering-process",
    title: "Distributed hardware collaboration",
    summary: "Working across time zones with manufacturing partners: asynchronous communication discipline, documentation as the interface, protecting the overlap window, and the JDM/ODM/CM models that shape who owns the design.",
    readingTime: 15,
    updatedAt: "Jul 21",
    stage: "Reviewing",
    blocks: [
      {
        type: "prose",
        heading: "When a round-trip costs a day, the message is the product",
        body: [
          "Hardware is increasingly built with partners on the other side of the world, and the defining constraint of that work is the time-zone gap. When a manufacturing partner is twelve or more hours ahead, every question-and-answer round-trip costs a full day: you ask in your evening, they read in their morning, and if your message was ambiguous their clarifying question comes back a day later, before any real work has happened. The single most valuable skill in this environment is writing a message so complete that the recipient can act on it without a follow-up. That means stating the specific question, the full context, what you have already tried and observed, the options as you see them, your recommendation, and the exact decision you need — with the supporting data attached (measurements, scope captures, photographs, the relevant schematic sheet). A message that anticipates the obvious next question saves a day; a message that assumes shared context that the reader lacks costs one.",
          "The corollary discipline is batching. Because each exchange is expensive, you accumulate questions and send them together rather than firing them off one at a time as they occur, and you structure them so they can be answered independently and in parallel. The mental shift is from conversation, where cheap back-and-forth is fine, to correspondence, where each message must stand on its own. This is a learnable, demonstrable skill, and it is exactly what a distributed hardware team is probing for.",
        ],
      },
      {
        type: "prose",
        heading: "Documentation is the interface",
        body: [
          "When you cannot tap someone on the shoulder, the document becomes the interface between teams, and its quality directly sets the speed and accuracy of the work. The hardware requirements document is the anchor — the single source of truth for what the product must do and be — and owning it is a real responsibility that a distributed role often carries explicitly. Around it sit the artifacts that carry intent across the gap: test plans that let a partner run and interpret validation without a live call, interface control documents that pin down exactly how two subsystems meet so they integrate the first time, schematic and layout review notes precise enough to act on asynchronously, and change records (ECRs/ECOs) that keep everyone building the same revision. Version control and a clear single source of truth are not bureaucracy here; they are what prevent two teams a day apart from silently diverging.",
          "The practical test of good documentation is whether a competent engineer in the partner's time zone can act on it correctly without asking you a question. Writing to that bar — unambiguous, complete, versioned — is the async equivalent of a clear whiteboard conversation, and it is what lets a distributed team move at the speed of one that shares a room.",
        ],
      },
      {
        type: "prose",
        heading: "Protect the overlap window; know the partnership model",
        body: [
          "A distributed team usually shares only a few overlapping working hours, and treating those hours as a scarce resource is a discipline of its own. The overlap window is reserved for the things that genuinely need high bandwidth — live design reviews, real-time debugging, decisions with many fast trade-offs — while everything that can be handled in writing is pushed to async and prepared in advance. Sending materials and agendas ahead of the overlap call so the synchronous time is spent deciding rather than explaining, and keeping a decision log so outcomes survive the handoff, turns a two-hour window into the productive core of the day. Done well, this becomes follow-the-sun development, where one region hands off in-progress work to the next and the project advances around the clock.",
          "It also helps to know which partnership model you are in, because it decides who owns the design and where the documentation boundaries fall. In a contract-manufacturing (CM) relationship the partner builds your design to your files, so you own the design and drive DFM feedback and first-article inspection. In an ODM (original design manufacturer) relationship the partner designs to your specification, so the specification and requirements document carry more weight and the review burden shifts. In a JDM (joint design manufacturing) model the two teams co-design, sharing ownership of the requirements and the design decisions across the gap. New-product introduction runs through all of them — DFM reviews, golden samples, build reports, first-article inspection — and each round is another async exchange that rewards the same clarity. Adapting your communication and documentation to the model, and to a partner working in another language and culture, is what makes the collaboration actually work: plain language, defined terms, no idioms, and confirmed understanding rather than assumed agreement.",
        ],
      },
      {
        type: "table",
        heading: "Partnership models and who owns what",
        columns: ["Model", "Who designs", "Where the weight falls"],
        rows: [
          ["CM (contract manufacturer)", "You design; partner builds", "Your files; DFM feedback, first-article inspection"],
          ["ODM (original design manufacturer)", "Partner designs to your spec", "The specification / requirements document"],
          ["JDM (joint design manufacturing)", "Co-designed together", "Shared requirements and design decisions"],
        ],
      },
      {
        type: "callout",
        heading: "Write so the reply is 'done,' not 'what do you mean?'",
        body: "The async ideal is a message the recipient can act on with no follow-up: specific question, full context, what you tried, options with a recommendation, the decision needed, and the data attached. Batch questions to cut round-trips, reserve the overlap window for high-bandwidth sync, and make documentation good enough that a partner in another time zone acts correctly without asking. Each avoided round-trip is a day saved.",
        tone: "note",
      },
      {
        type: "checklist",
        heading: "Distributed-collaboration checklist",
        items: [
          "Write complete messages: question, context, what you tried, options, recommendation, decision needed, data attached.",
          "Batch questions so a partner can answer several independently in one cycle.",
          "Anchor the work in a maintained hardware requirements document and versioned artifacts.",
          "Use interface control documents and test plans so subsystems integrate and validate without a live call.",
          "Reserve the overlap window for design reviews and live debug; prepare materials and agendas in advance.",
          "Keep a decision log and drive follow-the-sun handoffs.",
          "Match communication to the CM/ODM/JDM model and to cross-language clarity — plain terms, confirmed understanding.",
        ],
      },
      {
        type: "review",
        heading: "Active recall",
        prompts: [
          { question: "Why does a 12-hour time-zone gap change how you communicate?", answer: "Every question-and-answer round-trip costs a full day, so an ambiguous message costs a day of delay. The skill is writing complete, self-contained messages — question, context, what you tried, options, recommendation, decision needed, data attached — and batching questions to cut round-trips." },
          { question: "Why is documentation more important on a distributed team?", answer: "When you cannot ask in person, the document is the interface. A hardware requirements document, interface control documents, test plans, and versioned change records let a partner act correctly and asynchronously — the test is whether they can proceed without asking you." },
          { question: "How should the overlap window be used?", answer: "As a scarce resource reserved for high-bandwidth work — design reviews and live debugging — with everything else pushed to async and materials prepared in advance, so synchronous time is spent deciding rather than explaining." },
          { question: "How do CM, ODM, and JDM models differ?", answer: "CM: you design, the partner builds to your files. ODM: the partner designs to your specification. JDM: you co-design and share ownership of requirements and decisions. The model sets who owns the design and where the documentation weight falls." },
        ],
      },
    ],
    sources: [isoIec15288, incoseHandbook],
    related: ["validation-lifecycle-and-v-model", "root-cause-analysis", "dfm-dfa-and-testability"],
  },
];
