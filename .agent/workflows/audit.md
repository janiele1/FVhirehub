---
description: This is an audit to make sure that every app is functional and looks great. 
---

# 🔍 Visual & Functional Quality Gate (/audit)

# **🛠️ Step 1: Environmental Check**
- [ ] Open the integrated browser and navigate to the local development URL.
- [ ] Verify the build is stable and the Next.js compiler has finished the initial render.

# **🎨 Step 2: Visual Excellence Audit**
Analyze the current view against these non-negotiable standards:
1. **Information Architecture (IA):** Is the page organized by user goals? (Scannable in <3 seconds).
2. **Modular Bento Grid:** Is the layout structured in a clean, high-density grid? Check for consistent spacing tokens.
3. **Glassmorphism:** Are backdrop-blur and transparency effects applied consistently to cards and sidebars?
4. **Typography:** Is Kinetic Typography active? Ensure fonts are legible and reactive to interaction.
5. **Sidebar Audit:** Is the sidebar visually quiet? Grouped by intent, not features?

# **⚡ Step 3: Interaction & Trust Audit**
Perform a "Stress Test" on the UX:
1. **Immediate Feedback:** Do all buttons and links acknowledge input instantly (<100ms)?
2. **System States:** Verify existence of Loading (Skeletons), Empty (CTAs), Error (Recoverable), and Success (Toast) states.
3. **Optimistic UI:** Do mutations update the UI immediately before the server responds?
4. **Intent Check:** Are Modals used for high-commitment tasks and Popovers for quick edits?

# **📊 Step 4: The Audit Report**
Output a report in the chat with the following structure:
- 🚦 **Squad Status**
    - **Visual Score:** [1-10]
    - **Functional Score:** [1-10]
    - **Trust Score:** [1-10]
- ✅ **Visual Wins** - [List standout UI elements]
- ❌ **Critical Fails (Immediate Fix Required)** - [List broken grids, noise, accessibility issues]
- 🐛 **Logic & Trust Bugs** - [List broken endpoints, missing states]

# **🚥 Step 5: The Recursive Self-Correction Loop**
**Score Threshold:** 9/10.

**Action:** If any category (Visual, Functional, Trust) scores below the threshold:

1. **Diagnose:** Analyze the "Critical Fails" and "Bugs" listed in Step 4.
2. // turbo
   **Assign & Fix:** 
   - If Visual < 9: Immediately assume the **Design Lead** persona and refactor CSS/Layout.
   - If Functional < 9: Immediately assume the **Builder** persona and fix logic/API.
3. **Validate:** Re-run the `/audit` command automatically.

**Exit Condition:** Only stop when all scores are ≥ 9 OR after 3 failed healing attempts (at which point, escalate to the human in the Inbox with a "Blocked" status).

# **📝 Step 6: Final Sync**
Once satisfied (Score ≥ 9):
- Update `PLAN.md` to "Verified & Polished."
- Commit the working code to Git with the prefix: `[AUTO-HEALED]`.