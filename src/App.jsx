import { useState, useRef } from "react";

// ─── Dataset (abbreviated for performance) ──────────────────────────────────
const LO = [
  { o: "Determine central ideas, themes, and main arguments of diverse texts, summarizing objectively.", a: 0.381, g: 0.851 },
  { o: "Critically respond to texts through deep reading, inference making, prediction, and connection.", a: 0.255, g: 0.77 },
  { o: "Conduct and present research, integrating credible and relevant sources, evaluating source reliability and validity.", a: 0.429, g: 0.755 },
  { o: "Inquiry-based learning emphasizing questioning, research, analysis of primary and secondary sources, and evidence-based conclusions.", a: 0.356, g: 0.722 },
  { o: "Utilize data to make informed decisions, solve problems, and create visualizations.", a: 0.361, g: 0.679 },
  { o: "Plan and carry out scientific investigations (descriptive, comparative, experimental).", a: 0.247, g: 0.644 },
  { o: "Develop coherent and clear texts appropriate for various purposes.", a: 0.683, g: 0.631 },
  { o: "Comprehend and analyze complex literary and informational texts.", a: 0.402, g: 0.631 },
  { o: "Apply critical thinking and reasoning to solve mathematical and real-world problems.", a: 0.215, g: 0.608 },
  { o: "Clearly communicate mathematical ideas using precise mathematical language and multiple representations.", a: 0.457, g: 0.602 },
  { o: "Analyze and interpret data to derive meaningful conclusions.", a: 0.304, g: 0.597 },
  { o: "Use effective verbal and non-verbal communication skills to enhance presentations and discussions.", a: 0.028, g: 0.575 },
  { o: "Collect, organize, interpret, and analyze data using computational methods.", a: 0.528, g: 0.57 },
  { o: "Utilize appropriate conventions (grammar, punctuation, spelling, vocabulary) and effective rhetorical strategies.", a: 0.704, g: 0.549 },
  { o: "Collaborate effectively in teams, engaging in scientific practices to investigate and solve problems.", a: -0.005, g: 0.523 },
  { o: "Engage effectively in discussions, using active listening, collaboration techniques, and critical reasoning.", a: 0.028, g: 0.492 },
  { o: "Adapt writing for different contexts, audiences, purposes, and formats.", a: 0.49, g: 0.477 },
  { o: "Demonstrate the ability to analyze, justify, and evaluate mathematical arguments.", a: 0.426, g: 0.405 },
  { o: "Demonstrate command of language conventions (syntax, grammar, semantics) across various contexts.", a: 0.426, g: 0.375 },
  { o: "Understand and apply language structures (syntax, grammar, vocabulary) effectively.", a: 0.603, g: 0.297 },
  { o: "Design, develop, and test algorithms and computer programs.", a: 0.129, g: 0.268 },
  { o: "Solve equations and inequalities, including systems of linear and nonlinear equations.", a: 0.536, g: 0.172 },
  { o: "Exhibit fluency in arithmetic operations and algebraic manipulation.", a: 0.578, g: 0.179 },
  { o: "Integrate evidence from multiple relevant historical sources into a reasoned argument about the past.", a: 0.356, g: 0.722 },
  { o: "Demonstrate competence in scientific methodologies and laboratory practices.", a: -0.163, g: 0.266 },
  { o: "Construct solutions to problems using student-created procedures, modules, and objects.", a: 0.129, g: 0.268 },
  { o: "Master linear, quadratic, exponential, polynomial, and radical functions.", a: 0.567, g: 0.186 },
];

const Q = {
  anchor: { n: "Anchor", i: "⚓", c: "#f59e0b", d: "Irreducibly human — protect time for authentic hands-on practice" },
  deepen: { n: "Deepen", i: "🔬", c: "#ec4899", d: "AI enhances but can't replace — build deeper conceptual mastery" },
  transform: { n: "Transform", i: "⚡", c: "#22c55e", d: "AI executes & amplifies — teach new human-AI workflows" },
  streamline: { n: "Streamline", i: "⏩", c: "#f97316", d: "AI handles reliably — embed in higher-order work, reclaim time" },
};

const AIEDU_S = {
  "S-1A": { label: "S-1A · Define & Identify AI",      color: "#00D9D3" },
  "S-1B": { label: "S-1B · Safe & Effective AI Use",   color: "#00D9D3" },
  "S-1C": { label: "S-1C · Core Content Knowledge",    color: "#00D9D3" },
  "S-2A": { label: "S-2A · Responsible AI Use",        color: "#F5501C" },
  "S-2B": { label: "S-2B · Address AI Biases",         color: "#F5501C" },
  "S-2C": { label: "S-2C · Examine AI Outputs",        color: "#F5501C" },
  "S-3A": { label: "S-3A · Emotional Intelligence",    color: "#DBFF00" },
  "S-3B": { label: "S-3B · Creativity & Interdiscip.", color: "#DBFF00" },
  "S-3C": { label: "S-3C · Life-long Learning",        color: "#DBFF00" },
};

const QUADRANT_AIEDU = {
  anchor:     { use_s: ["S-1B","S-2A"],                       avoid_s: ["S-3A","S-3B","S-3C"] },
  deepen:     { use_s: ["S-1B","S-2A","S-2C","S-3B"],         avoid_s: ["S-3A","S-3B"] },
  transform:  { use_s: ["S-1B","S-2A","S-2C","S-3B","S-3C"],  avoid_s: ["S-3B","S-3C"] },
  streamline: { use_s: ["S-1B","S-2C"],                       avoid_s: ["S-2A","S-2B"] },
};

const GRADE_CONTEXT = {
  anchor: {
    "K-5":  { use: "K–5: AI is teacher-modeled only. Show AI outputs to spark questions and compare with human work — never for independent student use. Builds foundational AI awareness.", avoid: "K–5: Protect unmediated, hands-on experience. These foundational skills cannot be shortcut. Prioritize concrete, embodied learning free from AI mediation." },
    "6-8":  { use: "6–8: After students complete work independently, compare their process to AI output — what did AI miss or misrepresent? Develops Domain 2 critical evaluation skills.", avoid: "6–8: AI use here bypasses the critical thinking development central to this grade band's Domain 2 competencies. Protect the productive struggle." },
    "9-12": { use: "9–12: Students may deliberately analyze AI output as a foil — using it to articulate and defend their own reasoning and name their human advantage (Domain 3).", avoid: "9–12: These irreducibly human capabilities define competitive advantage in an AI-augmented workforce. Protecting them is essential career preparation." },
  },
  deepen: {
    "K-5":  { use: "K–5: Introduce simple AI tools with teacher guidance to spark curiosity. Focus on observing AI, not independent use. Builds foundational AI awareness (Domain 1).", avoid: "K–5: Core conceptual understanding must be built before AI can meaningfully support it. Protect foundational concept-building above all (S-1C)." },
    "6-8":  { use: "6–8: Students use AI as a 'what if' thinking partner — then critically evaluate AI's reasoning, not just its answer. Builds Domain 2 critical thinking skills.", avoid: "6–8: AI shortcuts here prevent the deep conceptual understanding students need to effectively direct AI at higher grade bands (S-2A, Domain 2)." },
    "9-12": { use: "9–12: Students direct AI to surface alternative perspectives, then evaluate, synthesize, and form independent judgment — exercising the full human advantage (Domain 3).", avoid: "9–12: Protect the interpretive leaps and creative insights that distinguish human understanding from AI pattern-matching (S-3B, S-3C)." },
  },
  transform: {
    "K-5":  { use: "K–5: Teacher demonstrates human-AI workflows while students observe and discuss. Build the mental model that humans direct AI — not the reverse (Domain 1: S-1B).", avoid: "K–5: Students need to develop their own thinking processes before directing AI. Protect independent problem-solving development (S-1C)." },
    "6-8":  { use: "6–8: Students experiment with AI tools, compare outputs, and identify when AI helps vs. misses — building the critical evaluation skills needed for 9–12 (S-2C).", avoid: "6–8: Even in Transform skills, students must originate ideas before AI expands them. Protect the genesis of student thinking (S-2A, Domain 2)." },
    "9-12": { use: "9–12: Students act as directors and editors — strategically deploying AI, evaluating outputs critically, and developing metacognitive AI workflows (S-3B, S-3C).", avoid: "9–12: Protect the strategic judgment, ethical reasoning, and creative direction that define the human role in AI collaboration (S-3A, Domain 3)." },
  },
  streamline: {
    "K-5":  { use: "K–5: Introduce basic AI tools with teacher modeling for mechanical tasks. Help students notice what AI is doing and why, building foundational AI literacy (Domain 1).", avoid: "K–5: Build enough foundational understanding for students to recognize AI errors before relying on AI tools independently (S-1A, S-1B)." },
    "6-8":  { use: "6–8: Students use AI for efficiency — then critically verify: Is this accurate? Is AI the right tool here? Builds productive skepticism (S-2C, S-2B, Domain 2).", avoid: "6–8: Maintain sufficient practice in foundational skills so students can catch AI errors and know when to override AI judgment (S-2A)." },
    "9-12": { use: "9–12: Students deploy AI for routine tasks and redirect reclaimed time to higher-order judgment — modeling professional AI-integrated practice (S-3C, Domain 3).", avoid: "9–12: Maintain foundational fluency to audit AI outputs and exercise human judgment when context demands it (S-3A, E-2B)." },
  },
};

// ─── Curated standards database (CCSS, NGSS, NCSS/C3, ISTE) ─────────────────
const STANDARDS_DB = [
  // ─ Common Core ELA ────────────────────────────────────────────────────────
  {code:"CCSS.ELA-LITERACY.CCRA.R.1",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Read closely to determine what the text says explicitly and to make logical inferences from it; cite specific textual evidence to support conclusions drawn from the text.",
   kw:["read","text","comprehend","literary","inference","interpret","cite","evidence","textual","close"]},
  {code:"CCSS.ELA-LITERACY.CCRA.R.6",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Assess how point of view or purpose shapes the content and style of a text.",
   kw:["point of view","purpose","perspective","author","rhetoric","bias","style","motive","intent"]},
  {code:"CCSS.ELA-LITERACY.CCRA.R.8",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Delineate and evaluate the argument and specific claims in a text, including the validity of the reasoning and the relevance and sufficiency of the evidence.",
   kw:["argument","claim","evidence","evaluate","reasoning","validity","credib","delineate","sufficiency"]},
  {code:"CCSS.ELA-LITERACY.CCRA.W.1",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Write arguments to support claims in an analysis of substantive topics or texts, using valid reasoning and relevant and sufficient evidence.",
   kw:["write","argument","claim","evidence","essay","persuasive","analytic","thesis","opinion","justify"]},
  {code:"CCSS.ELA-LITERACY.CCRA.W.2",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Write informative/explanatory texts to examine and convey complex ideas and information clearly and accurately through effective selection, organization, and analysis of content.",
   kw:["inform","explain","expository","convey","organize","write","report","clarity","explanatory"]},
  {code:"CCSS.ELA-LITERACY.CCRA.W.7",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Conduct short as well as more sustained research projects based on focused questions, demonstrating understanding of the subject under investigation.",
   kw:["research","inquiry","investigate","question","source","project","study","gather"]},
  {code:"CCSS.ELA-LITERACY.CCRA.SL.1",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Prepare for and participate effectively in a range of conversations and collaborations with diverse partners, building on others' ideas and expressing their own clearly and persuasively.",
   kw:["discuss","dialogue","collaborat","conversation","listen","speak","partner","seminar","debate"]},
  {code:"CCSS.ELA-LITERACY.CCRA.SL.4",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Present information, findings, and supporting evidence so that listeners can follow the line of reasoning; organization and style appropriate to task, purpose, and audience.",
   kw:["present","oral","speech","audience","communicate","verbal","deliver","finding","speak"]},
  {code:"CCSS.ELA-LITERACY.CCRA.L.1",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Demonstrate command of the conventions of standard English grammar and usage when writing or speaking.",
   kw:["grammar","convention","syntax","usage","mechanic","punctuation","spelling","language","english"]},
  {code:"CCSS.ELA-LITERACY.CCRA.L.6",fw:"CCSS ELA",fc:"#3b82f6",subj:"ELA",
   text:"Acquire and use accurately a range of general academic and domain-specific words and phrases sufficient for reading, writing, speaking, and listening.",
   kw:["vocabulary","word","lexic","domain","academic","terminolog","meaning","phrase"]},
  // ─ Common Core Math ────────────────────────────────────────────────────────
  {code:"CCSS.MATH.PRACTICE.MP1",fw:"CCSS Math",fc:"#8b5cf6",subj:"Mathematics",
   text:"Make sense of problems and persevere in solving them. Explain the meaning of a problem and look for entry points; monitor and evaluate progress and change course if necessary.",
   kw:["problem","solve","persevere","approach","strategy","mathematical","plan","sense","make sense"]},
  {code:"CCSS.MATH.PRACTICE.MP3",fw:"CCSS Math",fc:"#8b5cf6",subj:"Mathematics",
   text:"Construct viable arguments and critique the reasoning of others using definitions, assumptions, and previously established results.",
   kw:["argument","reason","justify","critique","proof","logic","explain","math","viable"]},
  {code:"CCSS.MATH.PRACTICE.MP4",fw:"CCSS Math",fc:"#8b5cf6",subj:"Mathematics",
   text:"Model with mathematics — apply mathematics to solve problems arising in everyday life, society, and the workplace; interpret mathematical results in the context of the situation.",
   kw:["model","real-world","application","quantitative","equation","function","formula","represent","contextu"]},
  {code:"CCSS.MATH.PRACTICE.MP6",fw:"CCSS Math",fc:"#8b5cf6",subj:"Mathematics",
   text:"Attend to precision — communicate precisely to others, use clear definitions, specify units of measure, and calculate accurately and efficiently.",
   kw:["precision","accurate","exact","notation","calculat","fluency","convention","unit","precise"]},
  {code:"CCSS.MATH.CONTENT.HSA-REI.C.6",fw:"CCSS Math",fc:"#8b5cf6",subj:"Mathematics",
   text:"Solve systems of linear equations exactly and approximately, focusing on pairs of linear equations in two variables.",
   kw:["system","linear","equation","solve","algebra","variable","simultaneous","system of equations"]},
  {code:"CCSS.MATH.CONTENT.HSS-ID.B.6",fw:"CCSS Math",fc:"#8b5cf6",subj:"Mathematics",
   text:"Represent data on two quantitative variables on a scatter plot, and describe how the variables are related. Fit a function to the data.",
   kw:["data","scatter","statistic","correlation","regression","variable","graph","bivariate","association"]},
  {code:"CCSS.MATH.CONTENT.HSF-LE.A.1",fw:"CCSS Math",fc:"#8b5cf6",subj:"Mathematics",
   text:"Distinguish between situations that can be modeled with linear functions and with exponential functions.",
   kw:["function","linear","exponential","model","growth","decay","change","pattern","distinguish"]},
  {code:"CCSS.MATH.CONTENT.HSS-IC.B.6",fw:"CCSS Math",fc:"#8b5cf6",subj:"Mathematics",
   text:"Evaluate reports based on data — identify possible sources of bias or error in data collection, and whether stated conclusions follow from the data.",
   kw:["statistic","data","probability","evaluate","infer","bias","sample","random","conclude","report"]},
  // ─ NGSS ────────────────────────────────────────────────────────────────────
  {code:"NGSS SEP-1",fw:"NGSS",fc:"#10b981",subj:"Science",
   text:"Science & Engineering Practice 1 — Asking Questions: ask questions that arise from careful observation of phenomena or examination of models to clarify and/or seek additional information.",
   kw:["question","inquir","observe","phenomena","wonder","formulate","define","problem","scientific"]},
  {code:"NGSS SEP-3",fw:"NGSS",fc:"#10b981",subj:"Science",
   text:"Science & Engineering Practice 3 — Planning and Carrying Out Investigations: plan and conduct an investigation to produce data as the basis for evidence, using controlled variables.",
   kw:["investigate","lab","experiment","plan","conduct","data","evidence","variable","control","hypothesis"]},
  {code:"NGSS SEP-4",fw:"NGSS",fc:"#10b981",subj:"Science",
   text:"Science & Engineering Practice 4 — Analyzing and Interpreting Data: analyze data using tools, technologies, and/or models to make valid and reliable scientific claims.",
   kw:["analyze","data","interpret","conclude","evidence","result","finding","graph","pattern","statistic"]},
  {code:"NGSS SEP-6",fw:"NGSS",fc:"#10b981",subj:"Science",
   text:"Science & Engineering Practice 6 — Constructing Explanations: construct a scientific explanation based on valid and reliable evidence obtained from sources, including students' own investigations.",
   kw:["explanation","explain","evidence","cause","mechanism","scientific","construct","reason","causal"]},
  {code:"NGSS SEP-7",fw:"NGSS",fc:"#10b981",subj:"Science",
   text:"Science & Engineering Practice 7 — Engaging in Argument from Evidence: evaluate competing design solutions or scientific claims using evidence, reasoning, and criteria.",
   kw:["argument","evidence","evaluate","claim","reasoning","support","critique","justify","debate"]},
  {code:"NGSS HS-ETS1-2",fw:"NGSS",fc:"#10b981",subj:"Science",
   text:"Design a solution to a complex real-world problem by breaking it down into smaller, more manageable problems that can be solved through engineering.",
   kw:["design","engineer","solution","problem","complex","real-world","technology","system","build"]},
  {code:"NGSS HS-ESS3-4",fw:"NGSS",fc:"#10b981",subj:"Science",
   text:"Evaluate or refine a technological solution that reduces impacts of human activities on natural systems.",
   kw:["evaluate","technology","solution","impact","environment","human","system","refine","ecology","natural"]},
  // ─ NCSS / C3 Framework ─────────────────────────────────────────────────────
  {code:"C3 D1.1.9-12",fw:"NCSS C3",fc:"#f59e0b",subj:"Social Studies",
   text:"Construct compelling questions that generate inquiry into authentic civic issues, and explain how those questions reflect key disciplinary concepts.",
   kw:["civic","question","inquiry","democratic","citizen","government","public","political","issue"]},
  {code:"C3 D2.His.1.9-12",fw:"NCSS C3",fc:"#f59e0b",subj:"Social Studies",
   text:"Analyze how historical contexts shaped and were shaped by the perspectives of people at the time in order to explain the significance of historical events.",
   kw:["history","historical","context","perspective","primary","source","analyze","past","era","period"]},
  {code:"C3 D2.His.5.9-12",fw:"NCSS C3",fc:"#f59e0b",subj:"Social Studies",
   text:"Explain how and why perspectives of people have changed over time across historical periods and geographic regions.",
   kw:["perspective","change","time","evolve","history","interpret","point of view","shifting","geography"]},
  {code:"C3 D3.1.9-12",fw:"NCSS C3",fc:"#f59e0b",subj:"Social Studies",
   text:"Gather relevant information from multiple credible sources representing a wide range of views, using the origin, authority, structure, context, and corroborative value of the sources.",
   kw:["source","credible","evidence","research","gather","evaluate","bias","secondary","primary","credib"]},
  {code:"C3 D4.2.9-12",fw:"NCSS C3",fc:"#f59e0b",subj:"Social Studies",
   text:"Construct explanations using sound reasoning, correct sequence, examples, and details; articulate the connections between the explanation and the evidence that supports it.",
   kw:["argument","reason","explain","construct","evidence","claim","justify","write","analytic","social"]},
  {code:"C3 D2.Civ.5.9-12",fw:"NCSS C3",fc:"#f59e0b",subj:"Social Studies",
   text:"Evaluate citizens' and institutions' effectiveness in addressing social and political problems using democratic principles.",
   kw:["civic","citizen","institution","social","political","evaluate","effectiveness","government","democracy","constitution"]},
  // ─ ISTE (Student Standards) ─────────────────────────────────────────────────
  {code:"ISTE 1.3a",fw:"ISTE",fc:"#ec4899",subj:"Computer Science",
   text:"Knowledge Constructor — Students plan and employ effective research strategies to locate information and other resources for their intellectual or creative pursuits.",
   kw:["research","information","search","source","strategy","find","locate","digital","library","inquir"]},
  {code:"ISTE 1.4a",fw:"ISTE",fc:"#ec4899",subj:"Computer Science",
   text:"Innovative Designer — Students know and use a deliberate design process for generating ideas, testing theories, creating innovative artifacts, or solving authentic problems.",
   kw:["design","create","innovate","prototype","test","artifact","process","engineer","problem","creative"]},
  {code:"ISTE 1.5a",fw:"ISTE",fc:"#ec4899",subj:"Computer Science",
   text:"Computational Thinker — Students formulate problem definitions suited for technology-assisted methods such as data analysis, abstract models, and algorithmic thinking in exploration and finding solutions.",
   kw:["algorithm","computational","decompose","problem","define","abstract","model","data","code","program"]},
  {code:"ISTE 1.5c",fw:"ISTE",fc:"#ec4899",subj:"Computer Science",
   text:"Computational Thinker — Students break problems into component parts, extract key information, and develop descriptive models to understand complex systems or facilitate problem-solving.",
   kw:["decompose","algorithm","system","component","model","break","structure","procedure","module","construct"]},
  {code:"ISTE 1.5d",fw:"ISTE",fc:"#ec4899",subj:"Computer Science",
   text:"Computational Thinker — Students understand how automation works and use algorithmic thinking to develop a sequence of steps to create and test automated solutions.",
   kw:["automate","algorithm","sequence","code","program","test","debug","construct","develop","procedure"]},
  {code:"ISTE 1.6a",fw:"ISTE",fc:"#ec4899",subj:"Computer Science",
   text:"Creative Communicator — Students choose appropriate platforms and tools for meeting the desired objectives of their creation or communication.",
   kw:["communicate","platform","tool","digital","create","media","express","produce","audience","present"]},
  {code:"ISTE 1.7a",fw:"ISTE",fc:"#ec4899",subj:"Computer Science",
   text:"Global Collaborator — Students use digital tools to broaden their perspectives and enrich their learning by collaborating with others and working effectively in teams locally and globally.",
   kw:["collaborat","digital","global","team","communicate","network","connect","partner","diverse"]},
];

function cq(a, g) {
  if (a < 0.35 && g >= 0.45) return "deepen";
  if (a >= 0.35 && g >= 0.45) return "transform";
  if (a >= 0.35 && g < 0.45) return "streamline";
  return "anchor";
}

// ─── Skills KB with learning-science strategies + AI guidance ────────────────
const KB = {
  "Critical reading": { q: "anchor", kw: ["read","text","comprehend","literary","inference","interpret"],
    strat: "Use Fishbowl Discussions: an inner circle engages in deep textual discussion while an outer circle observes and records insights — then groups rotate. Protect regular Independent Sustained Silent Reading with self-selected complex texts to build stamina and interpretive range. Both skills develop only through authentic unassisted reading practice.",
    links: [["Fishbowl Discussion (Facing History)","https://www.facinghistory.org/resource-library/fishbowl"],["Power of Independent Reading (Reading Rockets)","https://www.readingrockets.org/topics/motivation/articles/power-reading"]],
    ai: { use: "AI should NOT be used during initial close reading — the cognitive struggle of parsing difficult text independently builds interpretive capacity. After students have formed their own interpretation, AI can surface alternative readings for comparison.", avoid: "Do not allow AI to summarize texts before students read them. Summaries bypass the interpretive work that builds comprehension." }},
  "Ethical reasoning": { q: "anchor", kw: ["ethic","moral","justice","fairness","responsib","civic"],
    strat: "Use Deliberation & Mock Trial: students take on civic roles and argue constitutional or moral questions with real stakes and live counterargument — the embodied practice of defending a position in front of peers develops ethical reasoning through lived consequence. Follow with Structured Metacognitive Reflection where students journal which arguments moved them and why.",
    links: [["iCivics: Deliberation Tools","https://www.icivics.org/"],["Metacognitive Reflection (Edutopia)","https://www.edutopia.org/article/power-self-reflection"]],
    ai: { use: "AI should NOT be used to generate ethical positions for students. Use AI only after deliberation to surface perspectives students may have missed — then have students evaluate whether those perspectives change their reasoning.", avoid: "Do not use AI to provide 'balanced' answers to ethical questions. The learning happens through students wrestling with the tension themselves." }},
  "Experimental design": { q: "anchor", kw: ["experiment","investig","laboratory","lab","hypothesis","variable","control","homeostasis"],
    strat: "Use Student-Designed Investigations: students formulate their own research questions and design procedures from scratch, confronting real-world constraints without predetermined steps. Combine with Hands-On Laboratory work where students physically set up equipment, encounter unexpected results, and troubleshoot in real time — embodied experience that no simulation replicates.",
    links: [["Student-Designed Investigations (NGSS)","https://www.nextgenscience.org/"],["Hands-On Lab Assessment (NRC)","https://www.nap.edu/catalog/18409"]],
    ai: { use: "AI should NOT design experiments for students. After students draft a design, AI can identify potential confounding variables they may have overlooked — students then decide whether and how to address them.", avoid: "Do not use AI to generate procedures. The learning is in the design decisions — which variables to control, how to measure, what counts as evidence." }},
  "Mathematical problem-solving": { q: "anchor", kw: ["problem.solv","mathematical.think","persisten","non.routine"],
    strat: "Use Rich Mathematical Tasks (Low Floor / High Ceiling): open-ended tasks accessible to all students but extendable to high complexity, requiring perseverance and multiple approaches (Boaler). Follow with Math Talks and Justification where students orally defend not just their answer but why their approach works — metacognitive awareness that emerges only through repeated articulation practice.",
    links: [["Low Floor High Ceiling Tasks (youcubed)","https://www.youcubed.org/tasks/"],["Math Talks (NCTM: Principles to Actions)","https://www.nctm.org/PtA/"]],
    ai: { use: "AI should NOT solve problems for students during initial attempts. After students have attempted a solution pathway, AI can verify answers or suggest alternative approaches for comparison.", avoid: "Do not let AI show step-by-step solutions before students have struggled independently. The frustration-to-insight cycle is where mathematical intuition develops." }},
  "Active listening & dialogue": { q: "anchor", kw: ["listen","discuss","dialogue","collaborat","conversation","debate","seminar"],
    strat: "Use Fishbowl Discussions with structured observation roles: the outer circle tracks specific listening behaviors (who builds on prior speaker, who shifts topics, who asks clarifying questions) before rotating in. Extend with Collaborative Problem Solving on open-ended challenges requiring genuine negotiation — Vygotsky's social constructivism: communication skills only develop through authentic reciprocal interaction with real stakes.",
    links: [["Fishbowl Protocol (Facing History)","https://www.facinghistory.org/resource-library/fishbowl"],["Collaborative Problem Solving (OECD)","https://www.oecd.org/pisa/pisaproducts/Draft%20PISA%202015%20Collaborative%20Problem%20Solving%20Framework%20.pdf"]],
    ai: { use: "AI should NOT participate in dialogues as a substitute for peer interaction. AI can help students prepare for discussions by exploring background information, but the live exchange must be human-to-human.", avoid: "Do not use AI chatbots as discussion partners. Active listening and collaborative reasoning develop through reciprocal human interaction with real stakes." }},
  "Spatial reasoning": { q: "anchor", kw: ["spatial","geometr","3d","2d","figure","shape"],
    strat: "Use Rich Mathematical Tasks with physical construction: students build, rotate, and disassemble 3D models by hand before ever working with diagrams — embodied cognition research (Lakoff & Núñez) shows spatial intuition is grounded in physical manipulation. Pair with Math Talks focused on spatial justification: students describe transformations orally using precise geometric language before symbolic notation.",
    links: [["Spatial Tasks (youcubed)","https://www.youcubed.org/tasks/"],["NCTM: Geometry & Spatial Sense","https://www.nctm.org/Standards-and-Positions/Principles-and-Standards/Geometry/"]],
    ai: { use: "AI should NOT replace hands-on spatial exploration. After students have physically manipulated objects, AI visualization tools can help them see cross-sections or transformations at scale.", avoid: "Do not skip physical modeling. Spatial intuition develops through tactile engagement that screens cannot replicate." }},
  "Troubleshooting": { q: "anchor", kw: ["troubleshoot","debug","diagnos","fix","error"],
    strat: "Use Project-Based Learning with authentic broken systems: students receive non-functional programs, circuits, or models and must diagnose and repair them through systematic hypothesis testing — the persistence and adaptive thinking required only emerge from genuine problem ownership (Barron & Darling-Hammond). Follow with Collaborative Problem Solving debrief where groups share their diagnostic reasoning paths.",
    links: [["PBLWorks: What is PBL?","https://www.pblworks.org/what-is-pbl"],["CSTA: CS Standards & Practices","https://www.csteachers.org/page/standards"]],
    ai: { use: "AI should NOT fix errors for students. After students have formed a hypothesis about the bug, they can describe the problem to AI and evaluate whether its suggestion matches their diagnosis.", avoid: "Do not let AI auto-fix code. The diagnostic reasoning — forming hypotheses about what went wrong and testing them — is the learning." }},
  "Causal inference": { q: "anchor", kw: ["cause","effect","causal","mechanism","consequence"],
    strat: "Use Hands-On Laboratory Investigations where students physically manipulate variables and observe results firsthand — the surprise of unexpected outcomes and the need to re-examine assumptions builds causal reasoning that reading about causation cannot replicate. Extend with Student-Designed follow-up studies where students formulate their own causal hypothesis and design the test to check it.",
    links: [["NGSS Science & Engineering Practices","https://www.nextgenscience.org/science-engineering-practices"],["NRC Framework for K-12 Science","https://www.nap.edu/catalog/13165"]],
    ai: { use: "AI should NOT generate causal explanations for students. After students propose a causal mechanism, AI can surface alternative explanations for students to evaluate and rank.", avoid: "Do not accept AI-generated causal claims at face value. Students must trace the mechanism themselves." }},
  "Oral communication": { q: "deepen", kw: ["oral","speak","present","verbal","non.verbal","voice","tone"],
    strat: "Use Self-Explanation during rehearsal: students verbalize their reasoning about WHY they structured their talk the way they did — Chi et al. research shows self-explaining doubles retention and surfaces gaps. Layer with Productive Failure: students attempt an unrehearsed presentation first, receive targeted feedback, then formally present again — the initial struggle activates prior knowledge and makes coaching more effective (Kapur).",
    links: [["Self-Explanation (The Learning Scientists)","https://www.learningscientists.org/elaborative-interrogation"],["Productive Failure (Kapur)","https://www.manukapur.com/productive-failure/"]],
    ai: { use: "USE AI as a practice coach: AI tools can provide feedback on speech clarity, pacing, and word choice during rehearsal. Students use AI feedback to set specific improvement goals.", avoid: "Do not use AI to write speeches for students. The thinking-through-speaking process is where ideas clarify. AI coaches delivery, not content." }},
  "Creativity & innovation": { q: "deepen", kw: ["creativ","innovat","original","novel","design","imagin"],
    strat: "Use Concept Mapping to externalize creative connections: students map non-obvious relationships between domains before ideating solutions — Ausubel's meaningful learning theory shows creativity builds when new concepts anchor to diverse existing structures. Extend with Design Thinking Sprints (Stanford d.school): empathy → define → ideate → prototype → test cycles that mirror the iterative creative process professionals use.",
    links: [["Concept Maps (Vanderbilt CFT)","https://cft.vanderbilt.edu/guides-sub-pages/concept-mapping/"],["Design Thinking (Stanford d.school)","https://dschool.stanford.edu/resources"]],
    ai: { use: "USE AI as a creative springboard: generate 10 conventional ideas with AI, then challenge students to create something that breaks every pattern the AI suggested. Use AI outputs as 'the obvious' that students must transcend.", avoid: "Do not use AI to generate final creative products. AI produces average outputs by design. Students must push past conventional to develop distinctive voice." }},
  "Evidence evaluation": { q: "deepen", kw: ["evidence","evaluat","credib","bias","source","reliab","valid"],
    strat: "Use Structured Academic Controversy (SAC): pairs advocate opposing positions using only primary sources, then swap sides, then seek synthesis — develops the source-weighing and perspective-taking central to evidence evaluation (Johnson & Johnson cooperative learning research). Extend with Document-Based Questions (DBQs) using deliberately conflicting sources requiring students to adjudicate between competing accounts.",
    links: [["Structured Academic Controversy (Facing History)","https://www.facinghistory.org/resource-library/structured-academic-controversy"],["DBQ Project","https://www.dbqproject.com/"]],
    ai: { use: "USE AI to rapidly surface a larger pool of sources, then have students apply evaluation frameworks to rank and filter them. AI expands the evidence base; students apply judgment about quality.", avoid: "Do not let AI evaluate evidence quality for students. The skill is in the judgment about what makes evidence reliable in a specific context." }},
  "Probabilistic thinking": { q: "deepen", kw: ["probabil","statistic","uncertain","risk","likelihood","predict"],
    strat: "Use Number Talks focused on probability: short daily discussions where students share and compare mental estimation strategies for likelihood questions — builds the intuitive numeracy needed to evaluate whether AI-generated probability outputs are reasonable (Parrish). Follow with Three-Act Math Tasks using real uncertain scenarios: Act 1 sparks the question, Act 2 requires students to identify what information they need, Act 3 reveals the answer for comparison.",
    links: [["Number Talks (Math Solutions)","https://www.mathsolutions.com/number-talks/"],["Three-Act Tasks (Dan Meyer)","https://www.101qs.com/"]],
    ai: { use: "USE AI to run simulations and generate probability distributions that would be impractical by hand. Students interpret outputs, explain what the distributions mean, and make recommendations based on the uncertainty.", avoid: "Do not let AI make probabilistic judgments for students. The human skill is deciding what level of uncertainty is acceptable and what actions to take given that uncertainty." }},
  "Source credibility assessment": { q: "deepen", kw: ["source","credib","author","perspectiv","primary","secondary"],
    strat: "Use Stanford History Education Group's Lateral Reading: students immediately open new tabs to check what other sources say ABOUT a source before reading it deeply — the technique professional fact-checkers use. Pair with Elaborative Interrogation applied to sources: students ask 'why would this author frame it this way?' and 'what incentives shape this perspective?' to drive deeper critical analysis.",
    links: [["Lateral Reading (Stanford SHEG)","https://sheg.stanford.edu/"],["Elaborative Interrogation (The Learning Scientists)","https://www.learningscientists.org/elaborative-interrogation"]],
    ai: { use: "USE AI to locate additional context about source authors, publication history, and potential biases. Students use this contextual information to make credibility judgments — AI provides the data, students provide the judgment.", avoid: "Do not let AI determine which sources are credible. Credibility is context-dependent — a source reliable for one question may be unreliable for another." }},
  "Intercultural competence": { q: "deepen", kw: ["cultur","intercultural","global","divers","multicultural"],
    strat: "Use Concept Mapping across cultural systems: students create visual maps connecting cultural values, practices, and histories — making assumptions explicit and revealing where cultural mental models diverge (Ausubel's meaningful learning). Extend with Structured Academic Controversy on cross-cultural questions where students must argue from within a cultural perspective different from their own, building perspective-taking through deliberate role adoption.",
    links: [["Concept Maps (Vanderbilt CFT)","https://cft.vanderbilt.edu/guides-sub-pages/concept-mapping/"],["SAC Protocol (Facing History)","https://www.facinghistory.org/resource-library/structured-academic-controversy"]],
    ai: { use: "USE AI for real-time translation to access authentic cultural materials and facilitate cross-cultural dialogue. AI can provide cultural context and background that enriches student understanding.", avoid: "Do not use AI as a substitute for genuine human cross-cultural interaction. Empathy and perspective-taking develop through real relationships, not AI simulations." }},
  "Written communication": { q: "transform", kw: ["writ","essay","draft","compos","prose","author","text","argument","claim","evidence"],
    strat: "Use Mentor Text Analysis: students study exemplary writing to identify specific craft moves (sentence rhythm, transitions, evidence weaving), then apply those techniques in their own drafts — apprenticeship models of writing instruction build the editorial eye needed to evaluate AI output. Follow every AI revision session with a Revision Decision Log where students document each change: what AI suggested, what they accepted, rejected, and why.",
    links: [["Mentor Texts (Heinemann)","https://www.heinemann.com/"],["Process Writing (WAC Clearinghouse)","https://wac.colostate.edu/resources/writing/guides/"]],
    ai: { use: "AFTER students write their own complete first draft, AI can provide targeted feedback on specific sections the student identifies as weak (e.g., 'Is my counterargument convincing?' or 'Does my conclusion follow from the evidence?'). The student's draft comes first — AI responds to it, not the other way around.", avoid: "Do not let AI generate drafts, outlines, or thesis statements for students. A student who starts from AI output learns to edit, not to think through prose. The cognitive architecture of writing — discovering ideas through the struggle of articulation — is bypassed entirely when AI drafts first." }},
  "Analytical writing": { q: "transform", kw: ["analy","interpret","synthesis","thesis"],
    strat: "Use Critique & Revision Protocols (Austin's Butterfly): structured peer critique sessions where students evaluate drafts against explicit criteria and provide kind, specific, helpful feedback — trains the editorial judgment essential for evaluating AI output (Black & Wiliam formative assessment research). Pair with Rhetorical Analysis Comparison: students compare multiple versions of an analysis (their own, a peer's, an AI's) and identify what makes each effective or weak.",
    links: [["Austin's Butterfly (EL Education)","https://eleducation.org/resources/austins-butterfly"],["Rhetorical Situation (Purdue OWL)","https://owl.purdue.edu/owl/general_writing/academic_writing/rhetorical_situation/index.html"]],
    ai: { use: "AFTER students form their own interpretation and write their own analysis, AI can suggest additional evidence they may have missed or generate counterarguments to test the strength of their claim. Students evaluate whether AI's suggestions improve or weaken their argument.", avoid: "Do not let AI generate the analytical claim or the interpretive framework. The insight — seeing a pattern, making an unexpected connection, forming a thesis — must originate with the student. If AI provides the interpretation, the student practices editing, not analyzing." }},
  "Research design & planning": { q: "transform", kw: ["research","inquiry","investig","plan","methodology","study"],
    strat: "Use Process Portfolios: students document their full research workflow — initial questions, search decisions, source selection rationale, methodology choices, and revision history. The portfolio shifts assessment from the final product to the thinking behind it (portfolio-based assessment research). Combine with Design Thinking's define-phase protocols: students write a precise 'How might we...?' question before any investigation begins.",
    links: [["Digital Portfolios (Edutopia)","https://www.edutopia.org/topic/project-based-learning"],["Research Proposal Protocols (PBLWorks)","https://www.pblworks.org/"]],
    ai: { use: "AFTER students design their research plan, AI can suggest additional sources, identify methodological gaps, and help organize logistics (timelines, source lists). Students evaluate AI suggestions against their own plan and decide what to incorporate.", avoid: "Do not let AI formulate the research question or design the methodology. The question must reflect genuine student curiosity, and the design must reflect their understanding of what constitutes valid evidence for their specific question." }},
  "Data visualization": { q: "transform", kw: ["data","visual","graph","chart","display","represent"],
    strat: "Use Data Talks: students examine a real-world visualization and respond to three prompts — What do you notice? What do you wonder? What's going on? — before generating their own (youcubed data literacy research). Follow with Notice and Wonder on AI-generated charts: students evaluate whether the AI's visualization choices accurately represent the data or could mislead, building the editorial judgment central to Transform.",
    links: [["Data Talks (youcubed)","https://www.youcubed.org/resource/data-talks/"],["Notice & Wonder (NCTM)","https://www.nctm.org/noticeandwonder/"]],
    ai: { use: "USE AI to generate multiple visualization options rapidly. Students critique each: Does this chart accurately represent the data? What story does it tell? Could it mislead? Students select and justify their choice.", avoid: "Do not let AI choose the visualization type without student rationale. The human judgment is in knowing which representation serves the argument." }},
  "Statistical reasoning": { q: "transform", kw: ["statistic","data.analy","significan","correlation","regress"],
    strat: "Use Comparing Solution Methods: present students with multiple statistical approaches to the same problem and have them evaluate trade-offs (efficiency, assumptions, appropriateness for the data type) — research by Rittle-Johnson & Star shows comparative reasoning builds the judgment needed to evaluate AI-generated analyses. Add Which One Doesn't Belong (WODB) with statistical outputs: which of these four results is the outlier, and why?",
    links: [["Comparing Methods (Rittle-Johnson & Star)","https://scholar.harvard.edu/jstar/publications"],["WODB (Which One Doesn't Belong)","https://wodb.ca/"]],
    ai: { use: "USE AI to perform calculations and generate statistical outputs. Students focus entirely on selecting the right test for the question, interpreting what results mean in context, and identifying limitations.", avoid: "Do not skip conceptual understanding of why tests work. Students who cannot explain what a p-value means cannot judge whether an AI's statistical conclusion is valid." }},
  "Rhetorical reasoning": { q: "transform", kw: ["rhetor","persuad","audience","appeal","tone","style"],
    strat: "Use Thinking Routines (See-Think-Wonder from Harvard's Project Zero) applied to professional communications: students slow down and analyze a text's rhetorical choices before producing their own — makes evaluative judgment visible and transferable (Ritchhart et al. visible thinking research). Extend with Mentor Text Analysis: students identify specific craft moves (rhetorical appeals, sentence structure, evidence placement) in exemplary texts, then deliberately apply them.",
    links: [["Project Zero Thinking Routines","https://pz.harvard.edu/thinking-routines"],["Mentor Texts (Heinemann)","https://www.heinemann.com/"]],
    ai: { use: "AFTER students write their own draft for a specific audience, AI can analyze the rhetorical appeals present (ethos, pathos, logos) and identify where the argument may not land with the intended audience. Students decide whether and how to revise based on this feedback.", avoid: "Do not let AI generate rhetorical variations for students to choose from. The strategic choice of HOW to persuade — which appeal, which tone, which evidence to lead with — is the human skill. If AI generates the options, students practice selecting, not strategizing." }},
  "Systems thinking": { q: "transform", kw: ["system","model","interact","feedback","complex","emergent"],
    strat: "Use POGIL (Process Oriented Guided Inquiry Learning): teams work through structured activities that guide them to construct understanding of system dynamics through questions rather than lecture — the process of asking, analyzing models, and drawing conclusions mirrors the workflow of directing AI to explore complex systems (extensive controlled studies in STEM). Follow with Thinking Routines (See-Think-Wonder) applied to AI-generated system diagrams.",
    links: [["POGIL (Process Oriented Guided Inquiry)","https://pogil.org/"],["Project Zero Thinking Routines","https://pz.harvard.edu/thinking-routines"]],
    ai: { use: "USE AI to generate system models, run simulations, and visualize feedback loops. Students define system boundaries, identify key variables, and interpret what the model reveals — and what it leaves out.", avoid: "Do not let AI define the system boundaries. Deciding what to include and exclude from a model requires human judgment about what matters most." }},
  "Computational thinking": { q: "transform", kw: ["comput","algorithm","code","program","decompos","automat","module","procedure","construct"],
    strat: "Use Code Review & Refactoring on AI-generated code: students review every function for readability, correctness, and edge case handling — refactoring AI output to improve quality teaches the editorial judgment central to this quadrant (standard industry practice with strong pedagogical support, CSTA). Combine with Pair Programming: one student as navigator (strategic direction) and one as driver (implementation), which mirrors the human-AI collaboration workflow.",
    links: [["CSTA CS Standards & Practices","https://www.csteachers.org/page/standards"],["Pair Programming Research (UT Austin)","https://www.cs.utexas.edu/users/EWD/"]],
    ai: { use: "USE AI to generate code implementations after students have designed the architecture. Students review, test, and refine AI code — understanding what it does, why it works, and where it might fail.", avoid: "Do not let AI generate solutions before students have decomposed the problem. The architectural thinking — breaking a problem into components and designing interfaces — is the irreplaceable skill." }},
  "Quantitative modeling": { q: "transform", kw: ["model","quantitat","equat","function","formula","simulat"],
    strat: "Use Notice and Wonder on real-world data scenarios: students generate their own questions about a messy dataset before being told what to analyze — develops problem formulation, the human skill of deciding what to ask that AI cannot perform (NCTM inquiry-based instruction). Follow with Comparing Solution Methods: students analyze multiple model formulations and evaluate trade-offs in assumptions, precision, and generalizability.",
    links: [["Notice & Wonder (NCTM)","https://www.nctm.org/noticeandwonder/"],["Math Modeling (COMAP)","https://www.comap.com/"]],
    ai: { use: "USE AI to build and solve models after students have formulated the mathematical setup. Students interpret solutions in context: Does this answer make sense? What are the limitations? When does the model break down?", avoid: "Do not let AI formulate the model. Translating a messy real-world problem into mathematical form is the highest-value cognitive work." }},
  "Grammar & syntax": { q: "streamline", kw: ["grammar","syntax","punctuat","spelling","convention","mechanic"],
    strat: "Use Grammar Mini-Lessons in Context: teach grammar concepts when they arise in students' own writing — comma usage during essay revision, not through isolated worksheets (Weaver's research shows contextualized grammar instruction transfers far better than traditional approaches). Use Worked Examples with Fading: begin with fully corrected example sentences, then gradually remove corrections so students complete more independently, building pattern recognition efficiently.",
    links: [["Grammar in Context (NCTE)","https://ncte.org/statement/grammarexercises/"],["Worked Examples (The Learning Scientists)","https://www.learningscientists.org/worked-examples"]],
    ai: { use: "USE AI grammar tools freely as writing aids during revision. Students should learn to use AI for proofreading just as professionals do — but must understand enough grammar to evaluate AI suggestions and override incorrect ones.", avoid: "Do not spend extended class time on grammar worksheets. AI handles mechanical correction reliably. Invest reclaimed time in rhetorical judgment and evidence evaluation." }},
  "Vocabulary usage": { q: "streamline", kw: ["vocabular","word.choice","terminolog","lexic"],
    strat: "Use Vocabulary Through Wide Reading: students encounter and acquire words through extensive reading of complex texts — research by Nagy & Herman shows wide reading accounts for most vocabulary growth; explicit instruction is effective only as a supplement in context. Embed new terms in Just-in-Time mini-lessons during writing revision rather than pre-teaching word lists, grounding learning in immediate communicative need.",
    links: [["Vocabulary Instruction (Reading Rockets)","https://www.readingrockets.org/topics/vocabulary"],["Just-in-Time Instruction (Cambridge: Situated Cognition)","https://www.cambridge.org/core/"]],
    ai: { use: "USE AI thesaurus and word-choice tools during writing revision. Students evaluate suggestions for contextual appropriateness — is this synonym actually right for this specific sentence and audience?", avoid: "Do not spend class time on vocabulary memorization drills. AI handles word retrieval. Students need judgment about when word choices serve their purpose." }},
  "Algebraic fluency": { q: "streamline", kw: ["algebra","manipulat","symbol","simplif","factor","solve.equat","equation","inequalit","linear","nonlinear","polynomial","radical","quadratic","exponential"],
    strat: "Use Fluency Through Problem Solving: embed algebraic manipulation inside real-world modeling tasks so students see why the procedure matters — aligned with NCTM's emphasis on building procedural fluency from conceptual understanding. Layer with Estimation as Verification Habit: students estimate an answer before solving and check reasonableness after — efficient way to maintain number sense without extended drill.",
    links: [["Fluency from Conceptual Understanding (NCTM)","https://www.nctm.org/Standards-and-Positions/Position-Statements/Procedural-Fluency-in-Mathematics/"],["Estimation (youcubed)","https://www.youcubed.org/"]],
    ai: { use: "USE AI calculation tools (like CAS systems) for complex manipulation after students understand the procedure conceptually. Students verify AI solutions make sense in context and can identify when AI makes algebraic errors.", avoid: "Do not spend weeks on isolated equation-solving drills. Sufficient procedural fluency for error-catching can be built through applied practice in less time." }},
  "Information literacy": { q: "streamline", kw: ["information","search","database","library","navigate","find.source"],
    strat: "Use Just-in-Time Instruction: teach search and database skills at the moment they are needed within an actual research project, not in isolated library units — situated cognition theory (Brown, Collins & Duguid) shows skills learned in context transfer better. Combine with Retrieval Practice on search strategy: brief low-stakes exercises embedded within projects maintain search fluency without dedicating full units to it.",
    links: [["Situated Cognition (Cambridge)","https://www.cambridge.org/core/"],["Retrieval Practice Strategies","https://www.retrievalpractice.org/strategies"]],
    ai: { use: "USE AI search tools freely for locating sources — this mirrors professional practice. Redirect all saved instructional time to source credibility assessment and evidence evaluation, where human judgment is essential.", avoid: "Do not spend class time teaching database navigation as a standalone skill. AI handles retrieval efficiently. Invest time in teaching students to evaluate what they find." }},
  "Citation management": { q: "streamline", kw: ["citat","reference","bibliography","format","mla","apa"],
    strat: "Use Citation as Research Ethics: teach citation not as a formatting exercise but as an ethical practice embedded within research projects — students learn when and why to cite while conducting actual investigations, shifting from MLA drills to understanding attribution and intellectual honesty in context (C3 Framework). Use Just-in-Time instruction: introduce citation tools when students first need them in a project, not as a standalone pre-unit.",
    links: [["C3 Framework for Social Studies","https://www.socialstudies.org/standards/c3"],["Zotero (Free Citation Manager)","https://www.zotero.org/"]],
    ai: { use: "USE AI citation tools freely. Students should verify AI-generated citations for accuracy, but formatting time should be near zero. Redirect all saved time to evidence evaluation and analytical writing.", avoid: "Do not teach citation formatting as a standalone unit. This is precisely the kind of rule-based task AI handles perfectly." }},
  "Procedural fluency": { q: "streamline", kw: ["fluenc","arithmetic","calculat","procedur","operation","drill","function"],
    strat: "Use Interleaved Practice: instead of massed practice on one procedure, mix different operation types within the same session — Rohrer et al. research shows interleaving improves the ability to recognize which skill to apply, which is the key human task when AI handles execution. Combine with Worked Examples with Fading: start with fully solved examples, then progressively remove steps so students complete more independently, minimizing unnecessary cognitive load (Sweller).",
    links: [["Interleaving (The Learning Scientists)","https://www.learningscientists.org/interleaving"],["Worked Examples (The Learning Scientists)","https://www.learningscientists.org/worked-examples"]],
    ai: { use: "USE AI calculators for complex computation after students understand the underlying concepts. Students verify AI outputs using estimation and reasonableness checks.", avoid: "Do not spend extended units on procedural drill. Build sufficient fluency through brief, spaced practice embedded in meaningful problems." }},
};

function detect(text) {
  const l = text.toLowerCase();
  const found = [];
  for (const [n, info] of Object.entries(KB)) {
    const mc = info.kw.filter(kw => kw.split(".").every(p => l.includes(p))).length;
    if (mc > 0) found.push({ n, ...info, mc });
  }
  found.sort((a, b) => b.mc - a.mc);
  return found.slice(0, 6);
}

function subj(text) {
  const l = text.toLowerCase();
  if (/math|equation|algebra|geometry|calculus|statistic|probability|function|polynomial|linear/.test(l)) return "Mathematics";
  if (/science|experiment|hypothesis|lab|organism|ecosystem|physics|chemistry|biology|energy|homeostasis/.test(l)) return "Science";
  if (/history|civic|government|constitution|democracy|economic|geography|social.stud|historical/.test(l)) return "Social Studies";
  if (/comput|algorithm|program|code|software|hardware|cyber|digital|network|module|procedure/.test(l)) return "Computer Science";
  if (/language|culture|intercultural|multilingual|target.language/.test(l)) return "World Languages";
  if (/read|writ|text|literary|grammar|rhetoric|vocabulary|essay|argument|claim|evidence/.test(l)) return "ELA";
  return "Interdisciplinary";
}

function suggestStandards(text, subject) {
  if (!text || text.trim().length < 10) return [];
  const l = text.toLowerCase();
  const scored = STANDARDS_DB.map(std => {
    const subjBonus = std.subj === subject ? 3 : 0;
    const kwScore = std.kw.filter(kw => l.includes(kw.toLowerCase())).length;
    return { ...std, score: subjBonus + kwScore };
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
  if (subject === "Interdisciplinary") {
    const seen = new Set(); const result = [];
    for (const s of scored) { if (!seen.has(s.fw) && result.length < 5) { seen.add(s.fw); result.push(s); } }
    return result;
  }
  return scored.slice(0, 5);
}

function matches(text) {
  const l = text.toLowerCase();
  return LO.map(lo => {
    const ws = lo.o.toLowerCase().split(/\s+/);
    const iw = l.split(/\s+/).filter(w => w.length > 3);
    let m = 0;
    for (const w of iw) { if (ws.some(ow => ow.includes(w) || w.includes(ow))) m++; }
    return { ...lo, s: m / Math.max(iw.length, 1) };
  }).filter(x => x.s > 0.12).sort((a, b) => b.s - a.s).slice(0, 3);
}

// ─── Sample task generator ──────────────────────────────────────────────────
// ─── Sample tasks following aiEDU "Model Scenario, Revised" format ───────────
// Structure: Learning Objective → Task → 3-Step AI Parameters → Accountability → Assessment
const SAMPLE_TASKS = {
  "ELA": {
    title: "Persuasive Writing + AI Revision Workshop",
    learning_objective: "Write and revise precise, compelling arguments using valid reasoning, credible evidence, and effective rhetorical strategies. Analyze the impact of AI as a feedback and revision tool.",
    scenario: "Your school board is considering a policy change that affects students directly (e.g., phone use, schedule changes, dress code). Write a clear, persuasive op-ed aimed at school board members advocating your position. Be prepared to share your initial draft, your AI prompts, and your revised draft. We'll discuss the process and compare revisions as a class.",
    steps: [
      { num: 1, label: "Think First — No AI", desc: "Write your initial draft WITHOUT any AI support. Develop your claim, select your strongest evidence, and structure your argument. Let your thinking start the process! This is where your original voice and reasoning take shape.", quadrant: "anchor" },
      { num: 2, label: "Plan Your AI Prompts", desc: "Write the specific prompts you would use with AI. Think through what you want AI to help with: Is it strengthening your counterargument? Improving rhetorical appeals for this specific audience? Finding gaps in your logic? Be intentional about what AI should and shouldn't touch.", quadrant: "deepen" },
      { num: 3, label: "Refine with AI as Collaborator", desc: "Use school-approved AI tools to refine your draft. For each AI suggestion, document in your revision log: what AI suggested, whether you accepted or rejected it, and WHY. Your editorial judgment — not AI's suggestions — drives the final product.", quadrant: "transform" },
    ],
    accountability: "Submit all three artifacts: (1) your initial human-only draft, (2) your AI prompt plan with rationale, and (3) your final revised draft with a revision decision log. Be prepared to defend your revision choices in a class discussion.",
    assessment: {
      process: "Collect and compare initial drafts vs. final drafts. Assess the quality of the revision decision log: Did students make thoughtful editorial choices? Did they reject AI suggestions when their own voice was stronger? The decision log carries equal weight to the final essay.",
      performance: "Students participate in a structured peer review discussion: each student presents their strongest revision choice (where AI helped) and a choice where they overrode AI (where their judgment was better). Class discusses what makes human editorial judgment valuable.",
      product: "Final op-ed assessed holistically for claim quality, evidence use, rhetorical effectiveness, and audience awareness — but ONLY in conjunction with the process documentation. A polished essay without a substantive decision log receives reduced credit."
    }
  },
  "Mathematics": {
    title: "Real-World Modeling + AI Verification Challenge",
    learning_objective: "Translate real-world scenarios into mathematical models, solve systems of equations, and evaluate the reasonableness and limitations of solutions in context.",
    scenario: "Your community center has a $5,000 budget for a youth event and must decide between venue options with different cost structures (fixed costs + per-person rates). You need to determine the optimal choice for different attendance scenarios and present a recommendation to the planning committee.",
    steps: [
      { num: 1, label: "Think First — No AI", desc: "Set up the mathematical model WITHOUT AI. Identify the variables, define the cost equations, and set up the system. Sketch graphs by hand to build intuition about where solutions might be. Let your mathematical reasoning drive the formulation.", quadrant: "anchor" },
      { num: 2, label: "Plan Your AI Prompts", desc: "Write the prompts you'll use to verify and extend your work. Think through: Do you want AI to check your solution? Run sensitivity analysis? Generate visualizations? Be specific about what AI should calculate vs. what you need to interpret yourself.", quadrant: "deepen" },
      { num: 3, label: "Refine with AI as Collaborator", desc: "Use AI tools to solve, verify, and extend your model. Run 'what-if' scenarios: What if the budget changes by 20%? What if attendance doubles? Document what the AI outputs mean in real-world terms — the numbers are meaningless without your interpretation.", quadrant: "transform" },
    ],
    accountability: "Submit: (1) your hand-worked problem setup with variable definitions, (2) your AI prompt plan, and (3) your final analysis with a 'Model Limitations' section explaining what your model assumes and where it could fail. Present your recommendation to the class with a Q&A.",
    assessment: {
      process: "Assess the quality of problem formulation — did students correctly identify variables, constraints, and relationships? Compare hand-worked setup against AI-verified solution. The formulation work carries equal weight to the correct answer.",
      performance: "Students present their recommendation in a 3-minute pitch to the 'planning committee' (class). Audience asks 'what if' questions that test whether students truly understand their model or just copied AI outputs.",
      product: "Final recommendation assessed on mathematical accuracy, interpretation quality, AND the Model Limitations brief. A correct answer without limitations analysis receives reduced credit — understanding where models break is essential mathematical maturity."
    }
  },
  "Science": {
    title: "Investigation Design + AI Data Analysis Lab",
    learning_objective: "Design and conduct a controlled experiment, collect and analyze data using appropriate methods, and construct evidence-based explanations that account for uncertainty.",
    scenario: "Your lab group is investigating a factor that affects plant growth (light, water, soil type, etc.). Design an experiment that isolates your chosen variable, collect data over two weeks, then use AI to help analyze results — but your scientific judgment drives every interpretation.",
    steps: [
      { num: 1, label: "Think First — No AI", desc: "Design your experiment WITHOUT AI assistance. Write your hypothesis, identify all variables (independent, dependent, controlled), design your procedure, and anticipate potential sources of error. The experimental design must come from your scientific reasoning.", quadrant: "anchor" },
      { num: 2, label: "Plan Your AI Prompts", desc: "After collecting data, write the specific prompts you'll use. Think through: Do you want AI to run a statistical test? Generate a visualization? Compare your results to published studies? Be explicit about what analysis you need and why.", quadrant: "deepen" },
      { num: 3, label: "Refine with AI as Collaborator", desc: "Use AI to generate statistical analyses and visualizations of your data. For each output, write an interpretation: What does this number mean scientifically? Does it support your hypothesis? What alternative explanations exist? Write a 'So What?' conclusion.", quadrant: "transform" },
    ],
    accountability: "Submit: (1) your experimental design document with peer review feedback, (2) your AI prompt plan with rationale for each analysis requested, and (3) your lab report with AI-generated outputs AND your interpretive annotations. Present your findings in a lab conference format.",
    assessment: {
      process: "Assess experimental design quality: variable identification, control adequacy, error anticipation. Collect evidence evaluation logs where students document which data points they trust and why. Design quality carries the most weight.",
      performance: "Students conduct a 'design defense' presenting their experimental plan and responding to peer challenges. In the lab conference, students must answer questions about their methodology that reveal whether they understand the science or just the AI output.",
      product: "Lab report assessed on interpretation quality and scientific reasoning — not just whether the hypothesis was confirmed. AI-generated statistics without student interpretation annotations receive reduced credit."
    }
  },
  "Social Studies": {
    title: "Historical Inquiry + Source Analysis Workshop",
    learning_objective: "Integrate evidence from multiple relevant historical sources and interpretations into a reasoned argument about the past, evaluating source credibility and weighing conflicting accounts.",
    scenario: "Was [historical figure/event] primarily motivated by [interpretation A] or [interpretation B]? Using primary and secondary sources, construct a historical argument that addresses this question. Be prepared to share your source analysis, AI research process, and final argument with the class.",
    steps: [
      { num: 1, label: "Think First — No AI", desc: "Read and annotate 3-4 primary sources WITHOUT AI summaries or explanations. For each source, identify: Who created it? When and why? What does it reveal? What does it conceal? Write your initial interpretive claim based solely on your own reading.", quadrant: "anchor" },
      { num: 2, label: "Plan Your AI Prompts", desc: "Write prompts to deepen your source analysis. Think through: Do you want AI to provide context about the author? Locate additional sources from the same period? Suggest counterarguments to your thesis? Be intentional about using AI to challenge your thinking, not confirm it.", quadrant: "deepen" },
      { num: 3, label: "Refine with AI as Collaborator", desc: "Use AI to research source context, locate additional evidence, and organize your argument. Create a 'research trail' documenting how your thesis evolved: What was your original claim? How did new evidence change it? Which sources do you weight most heavily, and why?", quadrant: "transform" },
    ],
    accountability: "Submit: (1) your annotated primary sources with initial claim, (2) your AI prompt plan showing what you asked and why, and (3) your final argument with a research trail showing thesis evolution. Participate in a structured academic controversy debate.",
    assessment: {
      process: "Assess annotated primary sources for depth — are students reading 'against the grain'? Collect research trails showing how the thesis evolved through engagement with new evidence. The quality of source evaluation matters more than the final argument.",
      performance: "Students participate in a structured academic controversy: argue both sides of the question using only primary sources, then synthesize toward a more nuanced position. Assess the quality of reasoning during live deliberation.",
      product: "Final argument essay assessed on the quality of evidence integration, source weighting, and acknowledgment of limitations — but ONLY with the research trail documentation. A polished essay without evidence of interpretive evolution receives reduced credit."
    }
  },
  "Computer Science": {
    title: "System Architecture + AI Implementation Workshop",
    learning_objective: "Design, develop, and test algorithmic solutions using modular components, demonstrating understanding of problem decomposition, system design, and code quality evaluation.",
    scenario: "Build a program that solves a real problem for your school community (e.g., a schedule optimizer, event sign-up system, or resource tracker). Design the architecture first, then use AI to assist with implementation — but you must understand and be able to explain every line of code.",
    steps: [
      { num: 1, label: "Think First — No AI", desc: "Decompose the problem and design your architecture WITHOUT AI. Write pseudocode, draw component diagrams, define inputs/outputs for each module. The architectural thinking — deciding how to break this problem into pieces — must come from you.", quadrant: "anchor" },
      { num: 2, label: "Plan Your AI Prompts", desc: "Write the specific prompts you'll use for implementation. Think through: Which modules do you want AI to help code? What edge cases should you ask it to handle? What are you checking for in the generated code? Be a project manager, not a passive recipient.", quadrant: "deepen" },
      { num: 3, label: "Refine with AI as Collaborator", desc: "Use AI to generate code for your architecture. Review every function: Does it match your design? Does it handle edge cases? Is it readable? Refactor AI code to improve quality. Document every change you made and why in a code review log.", quadrant: "transform" },
    ],
    accountability: "Submit: (1) your architecture document (pseudocode + diagrams) created without AI, (2) your AI prompt plan, and (3) your final code with a code review log documenting every AI-generated section you modified and why. Conduct a live code walkthrough with a peer.",
    assessment: {
      process: "Assess architecture quality: problem decomposition, component design, interface definitions. The architecture document carries more weight than whether the code runs. Code review logs should show genuine understanding of what AI generated.",
      performance: "Students conduct a live code walkthrough: explain their design decisions, walk through a function AI generated, and answer 'what does this do?' questions that test understanding. If a student can't explain code in their project, that signals a problem.",
      product: "Working solution assessed on architecture quality AND code review documentation — not just whether it runs. A functioning program without architecture docs or code review annotations receives reduced credit."
    }
  },
  "World Languages": {
    title: "Cross-Cultural Communication + AI Translation Critique",
    learning_objective: "Communicate effectively in the target language using precise vocabulary and culturally appropriate expressions. Analyze the capabilities and limitations of AI translation tools.",
    scenario: "Write a short persuasive message (email, social media post, or letter) in the target language to an authentic audience on a topic you care about. Then use AI translation to test and improve your work — developing judgment about when AI captures meaning and when it misses nuance.",
    steps: [
      { num: 1, label: "Think First — No AI", desc: "Write your message in the target language WITHOUT AI translation support. Use the vocabulary, grammar, and cultural knowledge you have. It's okay if it's imperfect — your authentic expression is the starting point. Let your thinking start the process!", quadrant: "anchor" },
      { num: 2, label: "Plan Your AI Prompts", desc: "Write the prompts you'll use with AI translation tools. Think through: Do you want AI to check grammar? Suggest more natural phrasing? Translate back to English so you can verify meaning? Be specific about what kind of language support you need.", quadrant: "deepen" },
      { num: 3, label: "Refine with AI as Collaborator", desc: "Use AI translation tools to refine your message. For each AI suggestion, evaluate: Does this sound natural to a native speaker? Does it preserve my intended tone and meaning? Where did AI miss cultural nuance? Annotate your revisions.", quadrant: "transform" },
    ],
    accountability: "Submit: (1) your original human-written message, (2) your AI prompt plan, and (3) your revised message with annotations explaining each change. Present your original vs. revised version to the class, highlighting where AI helped and where your cultural knowledge was better.",
    assessment: {
      process: "Compare original and revised messages. Assess whether students made culturally informed decisions about AI suggestions — not just grammatical ones. The annotation quality matters more than linguistic perfection.",
      performance: "Students present their 'AI Translation Audit' to the class: showing specific examples where AI was helpful and where it missed cultural context or nuance. Class discusses patterns in what AI gets right and wrong.",
      product: "Final message assessed on communicative effectiveness, cultural appropriateness, and vocabulary use — but the annotation log showing critical evaluation of AI suggestions carries equal weight."
    }
  },
};

function analyze(text) {
  const m = matches(text);
  const s = subj(text);
  let skills = detect(text);
  const defs = {
    "ELA": ["Critical reading","Written communication","Evidence evaluation","Grammar & syntax","Rhetorical reasoning"],
    "Mathematics": ["Mathematical problem-solving","Algebraic fluency","Quantitative modeling","Computational thinking","Probabilistic thinking"],
    "Science": ["Experimental design","Evidence evaluation","Statistical reasoning","Causal inference","Research design & planning"],
    "Social Studies": ["Critical reading","Source credibility assessment","Analytical writing","Research design & planning","Evidence evaluation"],
    "Computer Science": ["Computational thinking","Troubleshooting","Systems thinking","Creativity & innovation","Mathematical problem-solving"],
    "World Languages": ["Intercultural competence","Oral communication","Active listening & dialogue","Grammar & syntax","Creativity & innovation"],
    "Interdisciplinary": ["Critical reading","Written communication","Evidence evaluation","Creativity & innovation","Systems thinking"],
  };
  for (const n of (defs[s] || defs["Interdisciplinary"])) {
    if (!skills.find(x => x.n === n) && KB[n]) skills.push({ n, ...KB[n], mc: 0 });
    if (skills.length >= 5) break;
  }
  const qc = {};
  skills.forEach(x => { qc[x.q] = (qc[x.q] || 0) + 1; });
  const dom = Object.entries(qc).sort((a, b) => b[1] - a[1])[0]?.[0] || "transform";
  const task = SAMPLE_TASKS[s] || SAMPLE_TASKS["ELA"];

  const insights = {
    anchor: "This standard centers on irreducibly human capabilities. Protect authentic practice time — these skills develop through doing, not through instruction about doing. AI stays in the background.",
    deepen: "AI can powerfully enhance how students practice these skills, but core thinking remains human. Build deeper conceptual foundations so students can direct AI as a thinking partner — not accept its output uncritically.",
    transform: "This standard involves skills where AI fundamentally changes the workflow. Students must become directors and editors — which paradoxically requires deeper understanding than solo execution ever did.",
    streamline: "Many foundational skills here can be practiced more efficiently in applied contexts. Reclaim time from standalone drills and invest it in higher-order judgment work.",
  };

  return { s, skills: skills.map(x => ({ name: x.n, quadrant: x.q, strat: x.strat, ai: x.ai, links: x.links || [] })), insight: insights[dom], matched: m, task, dom };
}

export default function App() {
  const [input, setInput] = useState("");
  const [gradeLevel, setGradeLevel] = useState("9-12");
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState(null);
  const [selQ, setSelQ] = useState(null);
  const [taskOpen, setTaskOpen] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [analysisStandard, setAnalysisStandard] = useState(null);
  const ref = useRef(null);

  function go() {
    if (!input.trim()) return;
    setLoading(true); setR(null); setSelQ(null); setTaskOpen(false);
    const capturedStd = selectedStandard;
    setTimeout(() => {
      setR(analyze(input));
      setAnalysisStandard(capturedStd);
      setLoading(false);
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 400);
  }

  const qc = r ? r.skills.reduce((a, s) => { a[s.quadrant] = (a[s.quadrant] || 0) + 1; return a; }, {}) : {};

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(165deg,#0a0e17 0%,#111827 40%,#1a1f35 100%)", fontFamily: "'Outfit','DM Sans',system-ui,sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}::selection{background:#3b82f6;color:white}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fu{animation:fadeUp .4s ease-out forwards;opacity:0}
        .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.2s}.d4{animation-delay:.28s}
        .sh{background:linear-gradient(90deg,#3b82f6,#8b5cf6,#3b82f6);background-size:200% 100%}
        .sh:hover:not(:disabled){animation:shimmer 2s linear infinite}
        .qc{transition:all .25s;cursor:pointer}.qc:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.35)}
        textarea:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
        .sp{transition:all .2s}.sp:hover{transform:scale(1.01)}
        .ex{transition:all .2s}.ex:hover{background:rgba(59,130,246,.12)!important;color:#93c5fd!important}
        .phase-card{transition:all .2s}.phase-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.3)}
      `}</style>

      <header style={{ padding: "32px 24px 24px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,.05)", background: "linear-gradient(180deg,rgba(59,130,246,.06) 0%,transparent 100%)" }}>
        <h1 style={{ fontSize: "clamp(24px,5vw,42px)", fontWeight: 800, background: "linear-gradient(135deg,#e2e8f0,#93c5fd,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1, marginBottom: 8 }}>
          AI Skill Quadrant Analyzer
        </h1>
        <p style={{ fontSize: "clamp(13px,2vw,16px)", color: "#94a3b8", maxWidth: 640, margin: "0 auto", lineHeight: 1.6, fontWeight: 300 }}>
          Enter a learning objective → select a relevant standard (CCSS, NGSS, NCSS, ISTE) → get instructional strategies, AI guidance, and a sample task for each quadrant.
        </p>
      </header>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px" }}>
        <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#93c5fd", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>Enter a Learning Objective or Task</label>
          <textarea value={input} onChange={e => { setInput(e.target.value); setSelectedStandard(null); }} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) go(); }}
            placeholder="e.g., Write arguments to support claims in an analysis of substantive topics or texts, using valid reasoning and relevant evidence."
            rows={3} style={{ width: "100%", background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "12px 14px", fontSize: 15, fontFamily: "inherit", color: "#e2e8f0", lineHeight: 1.6, resize: "vertical" }} />
          {/* Grade Band Selector */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: ".06em" }}>Grade Band</span>
            {[
              { val: "K-5",  label: "K–5"  },
              { val: "6-8",  label: "6–8"  },
              { val: "9-12", label: "9–12" },
            ].map(({ val, label }) => {
              const on = gradeLevel === val;
              return (
                <button key={val} onClick={() => setGradeLevel(val)}
                  style={{ padding: "5px 14px", borderRadius: 8, border: `1px solid ${on ? "#3b82f6" : "rgba(255,255,255,.1)"}`,
                    background: on ? "rgba(59,130,246,.18)" : "rgba(255,255,255,.03)",
                    color: on ? "#93c5fd" : "#94a3b8", fontSize: 13, fontWeight: on ? 700 : 400,
                    cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                  {label}
                </button>
              );
            })}
            <span style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>
              {gradeLevel === "K-5"  ? "aiEDU Domain 1 — Know Your Basics" :
               gradeLevel === "6-8"  ? "aiEDU Domain 2 — Be a Critical Thinker" :
                                       "aiEDU Domain 3 — Lead with Human Advantage"}
            </span>
          </div>
          {/* Standards Suggestions */}
          {input.trim().length > 10 && (() => {
            const subs = subj(input);
            const sugs = suggestStandards(input, subs);
            if (!sugs.length) return null;
            return (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ opacity: 0.7 }}>📎</span> Suggested Standards
                  <span style={{ fontWeight: 400, fontStyle: "italic", textTransform: "none", letterSpacing: 0, color: "#4b5563" }}>— select one or skip</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {sugs.map((std, i) => {
                    const sel = selectedStandard?.code === std.code;
                    return (
                      <button key={i} onClick={() => setSelectedStandard(sel ? null : std)}
                        style={{ textAlign: "left", background: sel ? `${std.fc}10` : "rgba(255,255,255,.015)",
                          border: `1px solid ${sel ? `${std.fc}45` : "rgba(255,255,255,.05)"}`,
                          borderRadius: 8, padding: "7px 11px", cursor: "pointer", fontFamily: "inherit",
                          transition: "all .15s", display: "flex", alignItems: "flex-start", gap: 9 }}>
                        <span style={{ fontSize: 8, fontWeight: 800, background: `${std.fc}20`, color: std.fc,
                          padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap", marginTop: 2, letterSpacing: ".04em", flexShrink: 0 }}>
                          {std.fw}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: sel ? std.fc : "#93c5fd", marginBottom: 2 }}>
                            {std.code} {sel && <span style={{ fontWeight: 400 }}>✓ selected</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>
                            {std.text.length > 105 ? std.text.slice(0, 102) + "…" : std.text}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
            <button className="sh" onClick={go} disabled={loading || !input.trim()}
              style={{ padding: "12px 28px", borderRadius: 12, border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading || !input.trim() ? .45 : 1, fontFamily: "inherit" }}>
              {loading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />Analyzing...</span> : "Analyze Standard"}
            </button>
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#6b7280", alignSelf: "center" }}>Try:</span>
          {["Write arguments to support claims using valid reasoning and evidence","Solve systems of linear equations exactly and approximately","Plan and conduct an investigation about homeostasis","Construct solutions using student-created procedures and modules","Integrate evidence from multiple historical sources into a reasoned argument"].map((ex, i) => (
            <button key={i} className="ex" onClick={() => setInput(ex)} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#94a3b8", cursor: "pointer", fontFamily: "inherit" }}>
              {ex.length > 52 ? ex.slice(0, 49) + "..." : ex}
            </button>
          ))}
        </div>
      </section>

      {r && (
        <section ref={ref} style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 56px" }}>
          {/* Selected Standard Banner */}
          {analysisStandard && (
            <div className="fu" style={{ background: `${analysisStandard.fc}08`, border: `1px solid ${analysisStandard.fc}30`, borderRadius: 14, padding: "11px 16px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 11 }}>
              <span style={{ fontSize: 8, fontWeight: 800, background: `${analysisStandard.fc}22`, color: analysisStandard.fc,
                padding: "3px 8px", borderRadius: 5, whiteSpace: "nowrap", letterSpacing: ".04em", flexShrink: 0, marginTop: 2 }}>
                {analysisStandard.fw}
              </span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: analysisStandard.fc, marginBottom: 3 }}>
                  Standard: {analysisStandard.code}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{analysisStandard.text}</div>
              </div>
            </div>
          )}

          {/* Insight */}
          <div className="fu" style={{ background: "linear-gradient(135deg,rgba(59,130,246,.12),rgba(139,92,246,.12))", border: "1px solid rgba(99,102,241,.25)", borderRadius: 16, padding: "16px 22px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Key Insight • {r.s}</div>
            <p style={{ fontSize: 15, lineHeight: 1.6 }}>{r.insight}</p>
          </div>

          {/* QUADRANT MAP FIRST */}
          <div className="fu d1" style={{ background: "rgba(255,255,255,.015)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, padding: 22, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Quadrant Map</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
              {["anchor","deepen","transform","streamline"].map((k, i) => {
                const q = Q[k]; const c = qc[k] || 0; const on = selQ === k;
                return (
                  <div key={k} className={`qc`} onClick={() => setSelQ(on ? null : k)}
                    style={{ background: on ? `${q.c}14` : "rgba(255,255,255,.01)", border: `1px solid ${on ? `${q.c}40` : "rgba(255,255,255,.04)"}`, borderRadius: 12, padding: "14px 12px", position: "relative", overflow: "hidden" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{q.i}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: q.c }}>{q.n}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, margin: "2px 0" }}>{c}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>{q.d}</div>
                    {c > 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: q.c, opacity: on ? 1 : .25 }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 10, overflow: "hidden", maxWidth: 540, margin: "0 auto" }}>
              {[{ k: "deepen", l: "DEEPEN", s: "Low Auto / High Aug" },{ k: "transform", l: "TRANSFORM", s: "High Auto / High Aug" },{ k: "anchor", l: "ANCHOR", s: "Low Auto / Low Aug" },{ k: "streamline", l: "STREAMLINE", s: "High Auto / Low Aug" }].map(({ k, l, s: sub }) => {
                const q = Q[k]; const sk = r.skills.filter(x => x.quadrant === k);
                return (<div key={k} style={{ background: sk.length > 0 ? `${q.c}0a` : "rgba(255,255,255,.008)", padding: "14px 14px", minHeight: 90, borderLeft: sk.length > 0 ? `3px solid ${q.c}` : "3px solid transparent" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: q.c, letterSpacing: ".1em" }}>{l}</div>
                  <div style={{ fontSize: 9, color: "#4b5563", marginBottom: 8 }}>{sub}</div>
                  {sk.map((x, j) => <div key={j} style={{ fontSize: 12, color: "#cbd5e1", padding: "2px 0" }}>• {x.name}</div>)}
                  {sk.length === 0 && <div style={{ fontSize: 11, color: "#374151", fontStyle: "italic" }}>—</div>}
                </div>);
              })}
            </div>
          </div>

          {/* SKILL BREAKDOWN */}
          <div className="fu d2" style={{ background: "rgba(255,255,255,.015)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, padding: 22, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              Instructional Strategies & AI Guidance {selQ && <span style={{ fontSize: 13, color: Q[selQ].c }}>— {Q[selQ].n}</span>}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {r.skills.filter(s => !selQ || s.quadrant === selQ).map((s, i) => {
                const q = Q[s.quadrant] || Q.anchor;
                return (
                  <div key={i} className="sp" style={{ background: `${q.c}06`, border: `1px solid ${q.c}15`, borderRadius: 14, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 17 }}>{q.i}</span>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: q.c, background: `${q.c}12`, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: ".06em" }}>{q.n}</span>
                    </div>
                    {/* Strategy */}
                    <div style={{ background: "rgba(0,0,0,.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 8, borderLeft: `3px solid ${q.c}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: q.c, marginBottom: 3, textTransform: "uppercase", letterSpacing: ".06em" }}>Instructional Strategy</div>
                      <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.65 }}>{s.strat}</p>
                      {s.links && s.links.length > 0 && (
                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {s.links.map(([label, url], li) => (
                            <a key={li} href={url} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 11, color: "#93c5fd", background: "rgba(59,130,246,.1)", padding: "3px 10px", borderRadius: 6, textDecoration: "none", border: "1px solid rgba(59,130,246,.15)", transition: "all .2s" }}
                              onMouseOver={e => { e.target.style.background = "rgba(59,130,246,.2)"; }}
                              onMouseOut={e => { e.target.style.background = "rgba(59,130,246,.1)"; }}>
                              🔗 {label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* aiEDU Framework Banner */}
                    <div style={{ background: "rgba(34,34,68,.55)", borderRadius: 10, padding: "7px 12px", marginBottom: 8, border: "1px solid rgba(0,217,211,.2)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 9, color: "#00D9D3", textTransform: "uppercase", letterSpacing: ".08em" }}>
                        aiEDU AI Readiness Framework v2.0 •&nbsp;
                        {gradeLevel === "K-5"  ? "Domain 1: Know Your Basics (K–5)"  :
                         gradeLevel === "6-8"  ? "Domain 2: Be a Critical Thinker (6–8)" :
                                                 "Domain 3: Lead with Human Advantage (9–12)"}
                      </span>
                      <a href="https://www.aiedu.org/ai-readiness-framework" target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 9, color: "#00D9D3", textDecoration: "none", border: "1px solid rgba(0,217,211,.3)", borderRadius: 4, padding: "1px 6px", opacity: 0.8 }}>
                        aiedu.org ↗
                      </a>
                    </div>
                    {/* AI Guidance */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ background: "rgba(34,197,94,.06)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(34,197,94,.12)" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#86efac", marginBottom: 6 }}>✅ WHERE AI ENHANCES</div>
                        <p style={{ fontSize: 12, color: "#a7f3d0", lineHeight: 1.55, marginBottom: 8 }}>{s.ai.use}</p>
                        {GRADE_CONTEXT[s.quadrant]?.[gradeLevel]?.use && (
                          <p style={{ fontSize: 10, color: "#86efac", lineHeight: 1.5, marginBottom: 8, fontStyle: "italic", borderTop: "1px solid rgba(34,197,94,.15)", paddingTop: 7, opacity: 0.9 }}>
                            {GRADE_CONTEXT[s.quadrant][gradeLevel].use}
                          </p>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {(QUADRANT_AIEDU[s.quadrant]?.use_s || []).map(tag => (
                            <span key={tag} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 100, background: `${AIEDU_S[tag].color}12`, color: AIEDU_S[tag].color, border: `1px solid ${AIEDU_S[tag].color}40`, fontWeight: 600, whiteSpace: "nowrap" }}>
                              {AIEDU_S[tag].label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ background: "rgba(239,68,68,.06)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(239,68,68,.12)" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#fca5a5", marginBottom: 6 }}>🚫 WHERE AI SHOULD NOT BE USED</div>
                        <p style={{ fontSize: 12, color: "#fecaca", lineHeight: 1.55, marginBottom: 8 }}>{s.ai.avoid}</p>
                        {GRADE_CONTEXT[s.quadrant]?.[gradeLevel]?.avoid && (
                          <p style={{ fontSize: 10, color: "#fca5a5", lineHeight: 1.5, marginBottom: 8, fontStyle: "italic", borderTop: "1px solid rgba(239,68,68,.15)", paddingTop: 7, opacity: 0.9 }}>
                            {GRADE_CONTEXT[s.quadrant][gradeLevel].avoid}
                          </p>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {(QUADRANT_AIEDU[s.quadrant]?.avoid_s || []).map(tag => (
                            <span key={tag} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 100, background: `${AIEDU_S[tag].color}12`, color: AIEDU_S[tag].color, border: `1px solid ${AIEDU_S[tag].color}40`, fontWeight: 600, whiteSpace: "nowrap" }}>
                              {AIEDU_S[tag].label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAMPLE TASK — aiEDU "Model Scenario, Revised" Format */}
          <div className="fu d3" style={{ background: "linear-gradient(135deg,rgba(99,102,241,.06),rgba(16,185,129,.06))", border: "1px solid rgba(99,102,241,.15)", borderRadius: 16, padding: 22, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: taskOpen ? 16 : 0, cursor: "pointer" }} onClick={() => setTaskOpen(!taskOpen)}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 3 }}>📋 Sample Assignment (aiEDU Model Scenario Format) • {r.s}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{r.task.title}</h3>
              </div>
              <span style={{ fontSize: 22, color: "#6b7280", transform: taskOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>▾</span>
            </div>
            {taskOpen && (
              <div>
                {/* Learning Objective */}
                <div style={{ background: "rgba(59,130,246,.08)", borderRadius: 12, padding: "14px 18px", marginBottom: 14, border: "1px solid rgba(59,130,246,.15)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#93c5fd", marginBottom: 4 }}>LEARNING OBJECTIVE</div>
                  <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.6 }}>{r.task.learning_objective}</p>
                </div>

                {/* Task / Scenario */}
                <div style={{ background: "rgba(255,255,255,.03)", borderRadius: 12, padding: "14px 18px", marginBottom: 14, border: "1px solid rgba(255,255,255,.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#e2e8f0", marginBottom: 4 }}>TASK</div>
                  <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>{r.task.scenario}</p>
                </div>

                {/* Parameters & Rationale for AI Use — 3 Steps */}
                <div style={{ background: "rgba(139,92,246,.06)", borderRadius: 12, padding: "14px 18px", marginBottom: 14, border: "1px solid rgba(139,92,246,.15)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#c4b5fd", marginBottom: 10 }}>PARAMETERS AND RATIONALE FOR AI USE</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {r.task.steps.map((step, i) => {
                      const stepQ = Q[step.quadrant] || Q.anchor;
                      return (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ minWidth: 32, height: 32, borderRadius: "50%", background: stepQ.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#0a0e17", flexShrink: 0, marginTop: 2 }}>{step.num}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>
                              {step.label} <span style={{ fontSize: 10, fontWeight: 600, color: stepQ.c, marginLeft: 6 }}>{stepQ.i} {stepQ.n}</span>
                            </div>
                            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, fontStyle: i === 0 ? "italic" : "normal" }}>{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accountability */}
                <div style={{ background: "rgba(245,158,11,.06)", borderRadius: 12, padding: "14px 18px", marginBottom: 14, border: "1px solid rgba(245,158,11,.12)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>ACCOUNTABILITY</div>
                  <p style={{ fontSize: 13, color: "#fde68a", lineHeight: 1.6 }}>{r.task.accountability}</p>
                </div>

                {/* Assessment: Process + Performance + Product */}
                <div style={{ background: "rgba(0,0,0,.12)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(255,255,255,.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#e2e8f0", marginBottom: 12 }}>📊 ASSESSMENT: PROCESS + PERFORMANCE + PRODUCT</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
                    <div style={{ background: "rgba(99,102,241,.08)", borderRadius: 10, padding: "12px 14px", borderTop: "3px solid #818cf8" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#a5b4fc", marginBottom: 4 }}>PROCESS</div>
                      <p style={{ fontSize: 12, color: "#c7d2fe", lineHeight: 1.55 }}>{r.task.assessment.process}</p>
                    </div>
                    <div style={{ background: "rgba(16,185,129,.08)", borderRadius: 10, padding: "12px 14px", borderTop: "3px solid #34d399" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#6ee7b7", marginBottom: 4 }}>PERFORMANCE</div>
                      <p style={{ fontSize: 12, color: "#a7f3d0", lineHeight: 1.55 }}>{r.task.assessment.performance}</p>
                    </div>
                    <div style={{ background: "rgba(245,158,11,.08)", borderRadius: 10, padding: "12px 14px", borderTop: "3px solid #fbbf24" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#fde68a", marginBottom: 4 }}>PRODUCT</div>
                      <p style={{ fontSize: 12, color: "#fef3c7", lineHeight: 1.55 }}>{r.task.assessment.product}</p>
                    </div>
                  </div>
                </div>

                {/* Design Principles callout */}
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,255,255,.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,.05)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 2 }}>ASSIGNMENT DESIGN PRINCIPLES (aiEDU)</div>
                  <p style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.5 }}>Effective AI-integrated assignments include: (1) Explicit student learning objective, (2) Explicit consideration of process and not just product, (3) Parameters for AI use including rationale, (4) Accountability for AI parameters. The question isn't "did you use AI?" — it's "how did you use it, and what was YOUR thinking?"</p>
                </div>
              </div>
            )}
          </div>

          {/* Assessment Redesign + Time Reallocation */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
            <div className="fu d3" style={{ background: "rgba(99,102,241,.05)", border: "1px solid rgba(99,102,241,.12)", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>📝 Assessment Redesign</div>
              <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>
                {r.dom === "anchor" && "Assess through authentic performance: oral defense, live deliberation, hands-on demonstrations. Collect process artifacts — annotated texts, design sketches, reflection journals. The evidence of learning is in the doing, not the final product."}
                {r.dom === "deepen" && "Assess conceptual depth: Can students explain WHY a method works, not just execute it? Use explanation-based assessments where students teach concepts to peers. Collect thinking logs that show how understanding evolved through AI-augmented exploration."}
                {r.dom === "transform" && "Assess the decision trail: Require revision logs documenting what AI suggested, what students accepted/rejected, and WHY. Grade the quality of editorial judgments. Process documentation (decision logs, revision rationale) should carry equal weight to final products."}
                {r.dom === "streamline" && "Embed assessment within applied tasks, not standalone tests. Evaluate whether students recognize when foundational skills matter, catch errors in AI output, and apply foundations purposefully in complex contexts."}
              </p>
            </div>
            <div className="fu d4" style={{ background: "rgba(16,185,129,.05)", border: "1px solid rgba(16,185,129,.12)", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6ee7b7", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>⏱️ Time Reallocation</div>
              <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>
                {r.dom === "anchor" && "Protect dedicated time for hands-on practice. Resist pressure to accelerate. The learning IS the struggle — shortcuts eliminate the learning itself. Reallocate time saved from Streamline drills to expand Anchor practice."}
                {r.dom === "deepen" && "Shift from breadth of execution to depth of reasoning. More time on 'why' and 'what if' questions. Use AI as a practice partner that expands exploration, but protect independent thinking time before AI assistance."}
                {r.dom === "transform" && "Redesign workflows: less time on solo first-draft execution, more time on strategic direction and critical evaluation of AI output. Invest heavily in the 'thinking memo before AI' and 'decision log after AI' phases."}
                {r.dom === "streamline" && "Compress standalone units into brief, spaced retrieval practice (Digital Promise LVP: Spacing Effect). Redirect reclaimed time to Deepen/Transform activities where the pedagogical payoff is highest."}
              </p>
            </div>
          </div>
        </section>
      )}

      <footer style={{ textAlign: "center", padding: "18px", fontSize: 10, color: "#374151", borderTop: "1px solid rgba(255,255,255,.03)" }}>
        Framework: "Which Skills Matter Now?" (Feb 2026) — aiEDU × The Burning Glass Institute
      </footer>
    </div>
  );
}
