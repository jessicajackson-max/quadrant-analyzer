# AI Skill Quadrant Analyzer

A data-driven tool for K-12 educators to analyze learning standards through the **Deepen / Transform / Streamline / Anchor** framework from ["Which Skills Matter Now?"](https://www.aiedu.org/) by aiEDU and The Burning Glass Institute.

Enter any learning standard → get instructional strategies, AI use/non-use guidance, a sample multi-phase task (following aiEDU's Model Scenario format), and process-based assessment design.

## Features

- **Quadrant Analysis**: Maps skills to Anchor, Deepen, Transform, or Streamline based on AI automation and augmentation scores
- **Instructional Strategies**: Research-backed strategies with links to source materials (Digital Promise LVP, Reading Rockets, Stanford History Education, etc.)
- **AI Guidance**: Explicit green/red guidance on where AI enhances learning vs. where it should not be used
- **Sample Tasks**: Complete assignment templates following aiEDU's academic integrity framework (learning objective → task → AI parameters with rationale → accountability)
- **Process-Based Assessment**: Assessment designs covering Process + Performance + Product — not just final artifacts

## Data Sources

- 140 learning objectives with automation/augmentation scores from the "Which Skills Matter Now?" report
- 30+ intermediating skills mapped to quadrants with strategies
- Assignment design principles from aiEDU's "AI and Academic Integrity" framework

---

## 🚀 Deploy to Vercel (Free) — Step by Step

### What you need:
- A **GitHub account** (free: https://github.com/signup)
- A **Vercel account** (free: https://vercel.com/signup — sign up with your GitHub account)

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Name it `quadrant-analyzer` (or whatever you like)
3. Set it to **Public**
4. Click **Create repository**
5. You'll see a page with instructions — keep this tab open

### Step 2: Upload the Project Files

**Option A — Upload via GitHub's web interface (easiest):**

1. On your new repo page, click **"uploading an existing file"**
2. Drag and drop ALL the files from this project folder:
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - `src/main.jsx`
   - `src/App.jsx`
   - `.gitignore`
3. Click **Commit changes**

> ⚠️ Make sure the `src/` folder structure is preserved. If GitHub flattens it, create the `src` folder first by clicking "Add file" → "Create new file" → type `src/main.jsx` as the filename.

**Option B — Using Git from your terminal:**

```bash
cd quadrant-analyzer
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/quadrant-analyzer.git
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Find and select your `quadrant-analyzer` repo
4. Vercel auto-detects it's a Vite project — **leave all settings as default**
5. Click **Deploy**
6. Wait ~60 seconds ☕
7. You'll get a URL like: `https://quadrant-analyzer.vercel.app`

**That's it!** Share that URL with anyone. It works on phones, tablets, and computers.

### Step 4 (Optional): Custom Domain

If you want a cleaner URL (like `quadrant.yourschool.org`):
1. In Vercel dashboard → your project → Settings → Domains
2. Add your custom domain and follow the DNS instructions

---

## 🔧 Local Development

If you want to run it locally or make changes:

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## How It Works

The app runs entirely in the browser — no server, no database, no API keys needed. It uses:

1. **Keyword matching** against 30+ intermediating skills from the research
2. **Subject detection** to fill contextually appropriate skills
3. **Dataset matching** against 140 learning objectives with actual automation/augmentation scores
4. **Quadrant classification** using threshold logic from the report (automation ≥ 0.35 = high, augmentation ≥ 0.45 = high)

If the Anthropic API is available (e.g., if you add an API key), the app will use Claude for richer analysis. Otherwise, the local engine provides instant results.

---

## Credits

- **Framework**: "Which Skills Matter Now?" (February 2026) — aiEDU × The Burning Glass Institute
- **Assignment Design**: aiEDU "AI and Academic Integrity: Moving Beyond the Binary of Cheating"
- **Learning Science Strategies**: Digital Promise Learner Variability Project
- **Additional Strategy Sources**: Reading Rockets, Stanford History Education Group, Facing History, NCTM, PBLWorks, Purdue OWL

## License

This tool is for educational use. The underlying research and framework belong to their respective authors.
