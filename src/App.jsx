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

function cq(a, g) {
  if (a < 0.35 && g >= 0.45) return "deepen";
  if (a >= 0.35 && g >= 0.45) return "transform";
  if (a >= 0.35 && g < 0.45) return "streamline";
  return "anchor";
}

// ─── Skills KB with learning-science strategies + AI guidance ────────────────
const KB = {
  "Critical reading": { q: "anchor", kw: ["read","text","comprehend","literary","inference","interpret"],
    strat: "Use annotating protocols where students mark up texts for rhetorical moves, assumptions, and gaps. Implement reciprocal teaching — students take turns leading discussion as summarizer, questioner, clarifier, and predictor. Use think-alouds to model expert reading processes.",
    links: [["Annotating (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/content-area/literacy-7-12/strategies/annotating-literacy-7-12/summary"],["Reciprocal Teaching (Reading Rockets)","https://www.readingrockets.org/topics/comprehension/articles/reciprocal-teaching"],["Think-Alouds (Reading Rockets)","https://www.readingrockets.org/topics/comprehension/articles/think-alouds"]],
    ai: { use: "AI should NOT be used during initial close reading — the cognitive struggle of parsing difficult text independently builds interpretive capacity. After students have formed their own interpretation, AI can surface alternative readings for comparison.", avoid: "Do not allow AI to summarize texts before students read them. Summaries bypass the interpretive work that builds comprehension." }},
  "Ethical reasoning": { q: "anchor", kw: ["ethic","moral","justice","fairness","responsib","civic"],
    strat: "Use structured ethical dilemma discussions with frameworks (e.g., utilitarian vs. deontological analysis). Implement Socratic seminars where students must defend positions and respond to counterarguments in real time. Use case studies with genuine ambiguity where reasonable people disagree.",
    links: [["Socratic Seminar Protocol (Facing History)","https://www.facinghistory.org/resource-library/socratic-seminar"],["Ethical Dilemma Discussions (Harvard Project Zero)","https://pz.harvard.edu/"]],
    ai: { use: "AI should NOT be used to generate ethical positions for students. Use AI only after deliberation to surface perspectives students may have missed — then have students evaluate whether those perspectives change their reasoning.", avoid: "Do not use AI to provide 'balanced' answers to ethical questions. The learning happens through students wrestling with the tension themselves." }},
  "Experimental design": { q: "anchor", kw: ["experiment","investig","laboratory","lab","hypothesis","variable","control","homeostasis"],
    strat: "Use inquiry-based learning (Digital Promise LVP) where students design investigations from scratch. Have students critique flawed experimental designs before creating their own. Use the 'fair test' protocol: students identify all variables and justify their controls before collecting data.",
    links: [["Inquiry-Based Learning (Digital Promise)","https://lvp.digitalpromiseglobal.org/content-area/portrait-of-a-learner-9-12/strategies"],["Scientific Argumentation (NSTA)","https://www.nsta.org/science-and-children/science-and-children-januaryfebruary-2022/scientific-argumentation"]],
    ai: { use: "AI should NOT design experiments for students. After students draft a design, AI can identify potential confounding variables they may have overlooked — students then decide whether and how to address them.", avoid: "Do not use AI to generate procedures. The learning is in the design decisions — which variables to control, how to measure, what counts as evidence." }},
  "Mathematical problem-solving": { q: "anchor", kw: ["problem.solv","mathematical.think","persisten","non.routine"],
    strat: "Use productive struggle protocols: present problems slightly beyond current ability and provide structured time without hints (research: Hiebert & Grouws). Implement problem-posing activities where students create their own challenging problems. Use error analysis — students diagnose why incorrect solutions fail.",
    links: [["Productive Struggle (NCTM)","https://www.nctm.org/"],["Problem-Posing (Edutopia)","https://www.edutopia.org/article/getting-students-create-math-problems/"]],
    ai: { use: "AI should NOT solve problems for students during initial attempts. After students have attempted a solution pathway, AI can verify answers or suggest alternative approaches for comparison.", avoid: "Do not let AI show step-by-step solutions before students have struggled independently. The frustration-to-insight cycle is where mathematical intuition develops." }},
  "Active listening & dialogue": { q: "anchor", kw: ["listen","discuss","dialogue","collaborat","conversation","debate","seminar"],
    strat: "Use accountable talk protocols: students must paraphrase the previous speaker before contributing. Implement Socratic seminars with inner/outer circles and structured observation rubrics. Use deliberation exercises where students must find common ground across disagreements.",
    links: [["Accountable Talk (IFL)","https://ifl.pitt.edu/"],["Socratic Seminar (Facing History)","https://www.facinghistory.org/resource-library/socratic-seminar"]],
    ai: { use: "AI should NOT participate in dialogues as a substitute for peer interaction. AI can help students prepare for discussions by exploring background information, but the live exchange must be human-to-human.", avoid: "Do not use AI chatbots as discussion partners. Active listening and collaborative reasoning develop through reciprocal human interaction with real stakes." }},
  "Spatial reasoning": { q: "anchor", kw: ["spatial","geometr","3d","2d","figure","shape"],
    strat: "Use physical manipulatives and construction tasks (Digital Promise LVP: Hands-on Learning). Have students build, rotate, and transform 3D models before working with diagrams. Use gesture-based instruction where students physically trace spatial relationships.",
    links: [["Hands-on Learning (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/"],["Spatial Reasoning Activities (YouCubed)","https://www.youcubed.org/tasks/"]],
    ai: { use: "AI should NOT replace hands-on spatial exploration. After students have physically manipulated objects, AI visualization tools can help them see cross-sections or transformations at scale.", avoid: "Do not skip physical modeling. Spatial intuition develops through tactile engagement that screens cannot replicate." }},
  "Troubleshooting": { q: "anchor", kw: ["troubleshoot","debug","diagnos","fix","error"],
    strat: "Use systematic debugging protocols: hypothesis → test → revise. Present broken systems and require students to isolate the failure point before suggesting fixes. Use rubber-duck debugging — students explain their code line-by-line to a peer before seeking help.",
    links: [["Debugging Strategies (Code.org)","https://code.org/curriculum/debugging"],["Rubber Duck Debugging","https://rubberduckdebugging.com/"]],
    ai: { use: "AI should NOT fix errors for students. After students have formed a hypothesis about the bug, they can describe the problem to AI and evaluate whether its suggestion matches their diagnosis.", avoid: "Do not let AI auto-fix code. The diagnostic reasoning — forming hypotheses about what went wrong and testing them — is the learning." }},
  "Causal inference": { q: "anchor", kw: ["cause","effect","causal","mechanism","consequence"],
    strat: "Use causal chain mapping where students trace mechanisms step by step. Present correlation-vs-causation scenarios and have students design tests that could distinguish them. Use counterfactual reasoning exercises: 'What would have happened if X had not occurred?'",
    links: [["Causal Reasoning (Stanford Encyclopedia)","https://plato.stanford.edu/entries/causal-models/"],["Correlation vs Causation (Khan Academy)","https://www.khanacademy.org/math/probability/study-design-ap-1"]],
    ai: { use: "AI should NOT generate causal explanations for students. After students propose a causal mechanism, AI can surface alternative explanations for students to evaluate and rank.", avoid: "Do not accept AI-generated causal claims at face value. Students must trace the mechanism themselves." }},
  "Oral communication": { q: "deepen", kw: ["oral","speak","present","verbal","non.verbal","voice","tone"],
    strat: "Use video self-review: students record presentations, then analyze their own pacing, eye contact, and filler words (Digital Promise LVP: Analyzing Video Clips). Implement impromptu speaking exercises with 60-second response windows. Use peer feedback protocols with specific observation criteria.",
    links: [["Analyzing Video Clips (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/content-area/adult-learner/strategies/skills-sprint-adult-learner/summary"],["Impromptu Speaking Exercises (Speech & Debate)","https://www.speechanddebate.org/"]],
    ai: { use: "USE AI as a practice coach: AI tools can provide feedback on speech clarity, pacing, and word choice during rehearsal. Students use AI feedback to set specific improvement goals.", avoid: "Do not use AI to write speeches for students. The thinking-through-speaking process is where ideas clarify. AI coaches delivery, not content." }},
  "Creativity & innovation": { q: "deepen", kw: ["creativ","innovat","original","novel","design","imagin"],
    strat: "Use SCAMPER technique (Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse) for structured creative thinking. Implement design thinking sprints with empathy interviews and rapid prototyping. Use 'yes, and...' improv exercises to build creative fluency.",
    links: [["SCAMPER Technique (MindTools)","https://www.mindtools.com/a2wbkbh/scamper"],["Design Thinking (d.school)","https://dschool.stanford.edu/resources"]],
    ai: { use: "USE AI as a creative springboard: generate 10 conventional ideas with AI, then challenge students to create something that breaks every pattern the AI suggested. Use AI outputs as 'the obvious' that students must transcend.", avoid: "Do not use AI to generate final creative products. AI produces average outputs by design. Students must push past conventional to develop distinctive voice." }},
  "Evidence evaluation": { q: "deepen", kw: ["evidence","evaluat","credib","bias","source","reliab","valid"],
    strat: "Use the CRAAP test (Currency, Relevance, Authority, Accuracy, Purpose) as a structured evaluation framework. Present conflicting sources on the same topic and have students weigh evidence quality. Use lateral reading techniques — checking what other sources say about a source.",
    links: [["CRAAP Test (CSU Chico)","https://library.csuchico.edu/help/source-or-information-good"],["Lateral Reading (Stanford History Education)","https://sheg.stanford.edu/lateral-reading"]],
    ai: { use: "USE AI to rapidly surface a larger pool of sources, then have students apply evaluation frameworks to rank and filter them. AI expands the evidence base; students apply judgment about quality.", avoid: "Do not let AI evaluate evidence quality for students. The skill is in the judgment about what makes evidence reliable in a specific context." }},
  "Probabilistic thinking": { q: "deepen", kw: ["probabil","statistic","uncertain","risk","likelihood","predict"],
    strat: "Use prediction activities where students estimate outcomes before seeing data, then compare (Digital Promise LVP: Estimation). Implement scenario analysis: 'What happens to the solution if this parameter changes by 10%?' Use Monte Carlo simulations to visualize uncertainty ranges.",
    links: [["Estimation Activities (Estimation 180)","https://estimation180.com/"],["Monte Carlo Simulations (Khan Academy)","https://www.khanacademy.org/computing/computer-science/algorithms/monte-carlo-simulation/a/monte-carlo-simulation"]],
    ai: { use: "USE AI to run simulations and generate probability distributions that would be impractical by hand. Students interpret outputs, explain what the distributions mean, and make recommendations based on the uncertainty.", avoid: "Do not let AI make probabilistic judgments for students. The human skill is deciding what level of uncertainty is acceptable and what actions to take given that uncertainty." }},
  "Source credibility assessment": { q: "deepen", kw: ["source","credib","author","perspectiv","primary","secondary"],
    strat: "Use the 'sourcing heuristic': before reading content, students analyze who created the source, when, why, and for whom. Implement structured academic controversy where students must argue both sides using only primary sources. Use document-based questions (DBQs) with deliberately conflicting sources.",
    links: [["Sourcing Heuristic (Stanford History Education)","https://sheg.stanford.edu/history-assessments"],["Document-Based Questions (DBQ Project)","https://www.dbqproject.com/"]],
    ai: { use: "USE AI to locate additional context about source authors, publication history, and potential biases. Students use this contextual information to make credibility judgments — AI provides the data, students provide the judgment.", avoid: "Do not let AI determine which sources are credible. Credibility is context-dependent — a source reliable for one question may be unreliable for another." }},
  "Intercultural competence": { q: "deepen", kw: ["cultur","intercultural","global","divers","multicultural"],
    strat: "Use cultural comparison protocols where students analyze the same event from multiple cultural perspectives. Implement virtual exchange programs with classrooms in other countries. Use 'cultural iceberg' activities to explore visible vs. invisible cultural elements.",
    links: [["Cultural Iceberg Model (AFS)","https://afs.org/"],["Virtual Exchange Programs (IVECA)","https://www.iveca.org/"]],
    ai: { use: "USE AI for real-time translation to access authentic cultural materials and facilitate cross-cultural dialogue. AI can provide cultural context and background that enriches student understanding.", avoid: "Do not use AI as a substitute for genuine human cross-cultural interaction. Empathy and perspective-taking develop through real relationships, not AI simulations." }},
  "Written communication": { q: "transform", kw: ["writ","essay","draft","compos","prose","author","text","argument","claim","evidence"],
    strat: "Use process-based writing with explicit stages: students write a thinking memo (their original thesis and reasoning) and a complete first draft BEFORE any AI involvement. Then use revision conferences where students identify specific weaknesses in their own draft and request targeted AI feedback on those sections only. Students explain and defend every editorial decision.",
    links: [["Process-Based Writing (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/content-area/literacy-7-12/strategies"],["Revision Conferences (Writing Workshop)","https://www.nwp.org/"]],
    ai: { use: "AFTER students write their own complete first draft, AI can provide targeted feedback on specific sections the student identifies as weak (e.g., 'Is my counterargument convincing?' or 'Does my conclusion follow from the evidence?'). The student's draft comes first — AI responds to it, not the other way around.", avoid: "Do not let AI generate drafts, outlines, or thesis statements for students. A student who starts from AI output learns to edit, not to think through prose. The cognitive architecture of writing — discovering ideas through the struggle of articulation — is bypassed entirely when AI drafts first." }},
  "Analytical writing": { q: "transform", kw: ["analy","interpret","synthesis","thesis"],
    strat: "Use claim-evidence-reasoning (CER) frameworks where students must articulate their analytical claim BEFORE any AI involvement. Implement 'analysis audit' activities: present AI-generated analysis alongside student analysis and have students identify where AI missed nuance. Use peer review with structured rubrics focused on interpretive depth.",
    links: [["Claim-Evidence-Reasoning Framework","https://www.activatelearning.com/claim-evidence-reasoning/"],["Peer Review Protocols (Expeditionary Learning)","https://eleducation.org/resources/peer-critique"]],
    ai: { use: "AFTER students form their own interpretation and write their own analysis, AI can suggest additional evidence they may have missed or generate counterarguments to test the strength of their claim. Students evaluate whether AI's suggestions improve or weaken their argument.", avoid: "Do not let AI generate the analytical claim or the interpretive framework. The insight — seeing a pattern, making an unexpected connection, forming a thesis — must originate with the student. If AI provides the interpretation, the student practices editing, not analyzing." }},
  "Research design & planning": { q: "transform", kw: ["research","inquiry","investig","plan","methodology","study"],
    strat: "Use the 'research proposal defense' — students formulate their own research question and justify their design choices to peers BEFORE using AI. Students create their research plan first, then use AI to identify gaps in their plan. Use project management protocols where students manage timelines and milestones.",
    links: [["Inquiry-Based Learning (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/content-area/literacy-7-12/strategies"],["Research Proposal Protocols (Buck Institute / PBLWorks)","https://www.pblworks.org/"]],
    ai: { use: "AFTER students design their research plan, AI can suggest additional sources, identify methodological gaps, and help organize logistics (timelines, source lists). Students evaluate AI suggestions against their own plan and decide what to incorporate.", avoid: "Do not let AI formulate the research question or design the methodology. The question must reflect genuine student curiosity, and the design must reflect their understanding of what constitutes valid evidence for their specific question." }},
  "Data visualization": { q: "transform", kw: ["data","visual","graph","chart","display","represent"],
    strat: "Use 'misleading graph detection' exercises where students identify how visualizations distort data. Implement visualization choice justification: students must explain why they selected a specific chart type over alternatives. Use before/after critique: students sketch a visualization by hand, then use AI to generate it, comparing their intent with the output.",
    links: [["Misleading Graphs (Datawrapper)","https://blog.datawrapper.de/"],["Visualization Choice Guide (Storytelling with Data)","https://www.storytellingwithdata.com/chart-guide"]],
    ai: { use: "USE AI to generate multiple visualization options rapidly. Students critique each: Does this chart accurately represent the data? What story does it tell? Could it mislead? Students select and justify their choice.", avoid: "Do not let AI choose the visualization type without student rationale. The human judgment is in knowing which representation serves the argument." }},
  "Statistical reasoning": { q: "transform", kw: ["statistic","data.analy","significan","correlation","regress"],
    strat: "Use 'interpret before you compute' protocols: present students with AI-generated statistical outputs and have them explain what the numbers mean before running any analysis themselves. Implement the 'statistical significance is not practical significance' exercise with real datasets. Use error-checking workflows where students verify AI calculations against known benchmarks.",
    links: [["Statistical vs Practical Significance (ASA)","https://www.amstat.org/"],["Interpret Before You Compute (GAISE)","https://www.amstat.org/education/guidelines-for-assessment-and-instruction-in-statistics-education-(gaise)-reports"]],
    ai: { use: "USE AI to perform calculations and generate statistical outputs. Students focus entirely on selecting the right test for the question, interpreting what results mean in context, and identifying limitations.", avoid: "Do not skip conceptual understanding of why tests work. Students who cannot explain what a p-value means cannot judge whether an AI's statistical conclusion is valid." }},
  "Rhetorical reasoning": { q: "transform", kw: ["rhetor","persuad","audience","appeal","tone","style"],
    strat: "Use audience analysis protocols: students profile their target audience before writing, then predict which rhetorical approaches would be most effective for that audience. Implement 'tone shift' exercises: students rewrite the same argument for three different audiences themselves. Use mentor text analysis of professional communications targeting different stakeholders.",
    links: [["Audience Analysis (Purdue OWL)","https://owl.purdue.edu/owl/general_writing/the_writing_process/audience_analysis.html"],["Mentor Text Analysis (Reading Rockets)","https://www.readingrockets.org/topics/writing/articles/using-mentor-texts-teach-writing"]],
    ai: { use: "AFTER students write their own draft for a specific audience, AI can analyze the rhetorical appeals present (ethos, pathos, logos) and identify where the argument may not land with the intended audience. Students decide whether and how to revise based on this feedback.", avoid: "Do not let AI generate rhetorical variations for students to choose from. The strategic choice of HOW to persuade — which appeal, which tone, which evidence to lead with — is the human skill. If AI generates the options, students practice selecting, not strategizing." }},
  "Systems thinking": { q: "transform", kw: ["system","model","interact","feedback","complex","emergent"],
    strat: "Use causal loop diagramming where students map feedback loops and identify leverage points. Implement 'what's missing from the model?' exercises using AI-generated system models. Use simulation-based learning (Digital Promise LVP) where students adjust parameters and observe emergent behaviors.",
    links: [["Causal Loop Diagramming (Waters Center)","https://waterscenterst.org/"],["Simulation-Based Learning (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/"]],
    ai: { use: "USE AI to generate system models, run simulations, and visualize feedback loops. Students define system boundaries, identify key variables, and interpret what the model reveals — and what it leaves out.", avoid: "Do not let AI define the system boundaries. Deciding what to include and exclude from a model requires human judgment about what matters most." }},
  "Computational thinking": { q: "transform", kw: ["comput","algorithm","code","program","decompos","automat","module","procedure","construct"],
    strat: "Use 'pseudocode first' protocols: students describe algorithms in plain language before any code is written. Implement code review workshops where students evaluate AI-generated code for efficiency, readability, and edge cases. Use pair programming with defined roles: navigator (strategy) and driver (implementation).",
    links: [["Pseudocode First (CS Unplugged)","https://www.csunplugged.org/"],["Code Review Workshops (GitHub Education)","https://education.github.com/"]],
    ai: { use: "USE AI to generate code implementations after students have designed the architecture. Students review, test, and refine AI code — understanding what it does, why it works, and where it might fail.", avoid: "Do not let AI generate solutions before students have decomposed the problem. The architectural thinking — breaking a problem into components and designing interfaces — is the irreplaceable skill." }},
  "Quantitative modeling": { q: "transform", kw: ["model","quantitat","equat","function","formula","simulat"],
    strat: "Use 'messy to mathematical' exercises: start with real-world scenarios and have students identify which variables matter and how to represent relationships mathematically. Implement sensitivity analysis: students explore how model outputs change when assumptions shift. Use model critique exercises where students identify what a model leaves out.",
    links: [["Mathematical Modeling (COMAP)","https://www.comap.com/"],["Sensitivity Analysis (Wolfram)","https://www.wolfram.com/mathematica/"]],
    ai: { use: "USE AI to build and solve models after students have formulated the mathematical setup. Students interpret solutions in context: Does this answer make sense? What are the limitations? When does the model break down?", avoid: "Do not let AI formulate the model. Translating a messy real-world problem into mathematical form is the highest-value cognitive work." }},
  "Grammar & syntax": { q: "streamline", kw: ["grammar","syntax","punctuat","spelling","convention","mechanic"],
    strat: "Embed grammar instruction in authentic writing contexts using just-in-time mini-lessons when patterns emerge in student work. Use mentor text analysis — students identify how published authors use grammar for rhetorical effect. Replace standalone grammar tests with holistic writing assessment.",
    links: [["Just-in-Time Mini-Lessons (WritingFix)","https://www.writingfix.com/"],["Mentor Text Analysis (Reading Rockets)","https://www.readingrockets.org/topics/writing/articles/using-mentor-texts-teach-writing"]],
    ai: { use: "USE AI grammar tools freely as writing aids during revision. Students should learn to use AI for proofreading just as professionals do — but must understand enough grammar to evaluate AI suggestions and override incorrect ones.", avoid: "Do not spend extended class time on grammar worksheets. AI handles mechanical correction reliably. Invest reclaimed time in rhetorical judgment and evidence evaluation." }},
  "Vocabulary usage": { q: "streamline", kw: ["vocabular","word.choice","terminolog","lexic"],
    strat: "Develop vocabulary through wide reading of complex texts rather than isolated word lists (Digital Promise LVP: Direct Instruction: Vocabulary). Use word consciousness activities where students notice and collect interesting word choices in their reading. Embed vocabulary in writing revision, not separate drills.",
    links: [["Direct Instruction: Vocabulary (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/content-area/literacy-7-12/strategies"],["Word Consciousness (Vocabulary.com)","https://www.vocabulary.com/"]],
    ai: { use: "USE AI thesaurus and word-choice tools during writing revision. Students evaluate suggestions for contextual appropriateness — is this synonym actually right for this specific sentence and audience?", avoid: "Do not spend class time on vocabulary memorization drills. AI handles word retrieval. Students need judgment about when word choices serve their purpose." }},
  "Algebraic fluency": { q: "streamline", kw: ["algebra","manipulat","symbol","simplif","factor","solve.equat","equation","inequalit","linear","nonlinear","polynomial","radical","quadratic","exponential"],
    strat: "Embed procedural practice within modeling and application problems — students encounter algebraic manipulation when a real problem requires it. Use spaced practice (Digital Promise LVP: Spacing Effect) with brief retrieval exercises rather than extended drill units. Focus class time on problem setup and interpretation.",
    links: [["Spaced Practice / Spacing Effect (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/"],["Retrieval Practice (Retrieval Practice.org)","https://www.retrievalpractice.org/"]],
    ai: { use: "USE AI calculation tools (like CAS systems) for complex manipulation after students understand the procedure conceptually. Students verify AI solutions make sense in context and can identify when AI makes algebraic errors.", avoid: "Do not spend weeks on isolated equation-solving drills. Sufficient procedural fluency for error-catching can be built through applied practice in less time." }},
  "Information literacy": { q: "streamline", kw: ["information","search","database","library","navigate","find.source"],
    strat: "Embed source-finding in authentic research tasks rather than standalone library units. Teach search strategy within the context of actual investigations where students immediately need sources. Focus instruction on what students do with sources once found, not the mechanics of finding them.",
    links: [["Information Literacy Standards (ACRL)","https://www.ala.org/acrl/standards/ilframework"],["Search Strategy (Common Sense Media)","https://www.commonsensemedia.org/"]],
    ai: { use: "USE AI search tools freely for locating sources — this mirrors professional practice. Redirect all saved instructional time to source credibility assessment and evidence evaluation, where human judgment is essential.", avoid: "Do not spend class time teaching database navigation as a standalone skill. AI handles retrieval efficiently. Invest time in teaching students to evaluate what they find." }},
  "Citation management": { q: "streamline", kw: ["citat","reference","bibliography","format","mla","apa"],
    strat: "Teach citation tool usage (Zotero, EasyBib, etc.) as a practical skill embedded in research projects. Focus instruction on why we cite — intellectual honesty, joining scholarly conversations — not formatting mechanics.",
    links: [["Zotero (Free Citation Manager)","https://www.zotero.org/"],["Why We Cite (Purdue OWL)","https://owl.purdue.edu/owl/research_and_citation/resources.html"]],
    ai: { use: "USE AI citation tools freely. Students should verify AI-generated citations for accuracy, but formatting time should be near zero. Redirect all saved time to evidence evaluation and analytical writing.", avoid: "Do not teach citation formatting as a standalone unit. This is precisely the kind of rule-based task AI handles perfectly." }},
  "Procedural fluency": { q: "streamline", kw: ["fluenc","arithmetic","calculat","procedur","operation","drill","function"],
    strat: "Use spaced retrieval practice (brief daily warm-ups) rather than massed drill units (Digital Promise LVP: Spacing Effect). Embed procedural practice in applied modeling contexts. Use estimation-before-calculation habits so students develop number sense alongside fluency.",
    links: [["Spaced Practice (Digital Promise LVP)","https://lvp.digitalpromiseglobal.org/"],["Retrieval Practice (Retrieval Practice.org)","https://www.retrievalpractice.org/"]],
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
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState(null);
  const [selQ, setSelQ] = useState(null);
  const [taskOpen, setTaskOpen] = useState(false);
  const ref = useRef(null);

  function go() {
    if (!input.trim()) return;
    setLoading(true); setR(null); setSelQ(null); setTaskOpen(false);
    setTimeout(() => {
      setR(analyze(input));
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
        <div style={{ display: "inline-flex", gap: 10, background: "rgba(59,130,246,.1)", borderRadius: 100, padding: "6px 16px", marginBottom: 12, fontSize: 11, fontWeight: 500, color: "#93c5fd", border: "1px solid rgba(59,130,246,.18)" }}>
          Based on "Which Skills Matter Now?" — aiEDU × Burning Glass Institute • Learning science via Digital Promise LVP
        </div>
        <h1 style={{ fontSize: "clamp(24px,5vw,42px)", fontWeight: 800, background: "linear-gradient(135deg,#e2e8f0,#93c5fd,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1, marginBottom: 8 }}>
          AI Skill Quadrant Analyzer
        </h1>
        <p style={{ fontSize: "clamp(13px,2vw,16px)", color: "#94a3b8", maxWidth: 640, margin: "0 auto", lineHeight: 1.6, fontWeight: 300 }}>
          Enter a learning standard → get instructional strategies, AI use/non-use guidance, a sample multi-phase task, and process-based assessment for each quadrant.
        </p>
      </header>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px" }}>
        <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#93c5fd", marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>Paste a Learning Standard or Objective</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) go(); }}
            placeholder="e.g., Write arguments to support claims in an analysis of substantive topics or texts, using valid reasoning and relevant evidence."
            rows={3} style={{ width: "100%", background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "12px 14px", fontSize: 15, fontFamily: "inherit", color: "#e2e8f0", lineHeight: 1.6, resize: "vertical" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
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
                    {/* AI Guidance */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ background: "rgba(34,197,94,.06)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(34,197,94,.12)" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#86efac", marginBottom: 3 }}>✅ WHERE AI ENHANCES</div>
                        <p style={{ fontSize: 12, color: "#a7f3d0", lineHeight: 1.55 }}>{s.ai.use}</p>
                      </div>
                      <div style={{ background: "rgba(239,68,68,.06)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(239,68,68,.12)" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#fca5a5", marginBottom: 3 }}>🚫 WHERE AI SHOULD NOT BE USED</div>
                        <p style={{ fontSize: 12, color: "#fecaca", lineHeight: 1.55 }}>{s.ai.avoid}</p>
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
        Framework: "Which Skills Matter Now?" (Feb 2026) — aiEDU × The Burning Glass Institute • Learning science: Digital Promise Learner Variability Project
      </footer>
    </div>
  );
}
