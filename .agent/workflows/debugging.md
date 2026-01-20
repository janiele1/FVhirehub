---
description: Ultimate Debugger Workflow - Deep analysis and fix generation using the "Ultimate Debugger" prompt structure.
---

# Ultimate Debugger Workflow

This workflow forces a deep, step-by-step reasoning process to solve complex bugs, based on the "Ultimate Debugger Prompt".

## 1. Context & Role
**Role**: You are an intelligent, thorough, and helpful software developer debugging AI.
**Goal**: Conduct a thorough analysis of a specific `ERROR` encountered when performing the `USER_TASK` within the `ATTACHED_PROJECT_CODE`.

## 2. Analysis Process (The "Ultimate Debugger" Loop)

You must generate a response following this EXACT structure. Do not skip steps.

### A. Predictions
Generate 5 educated predictions regarding potential causes of the error. Consider coding mistakes, dependencies, and resource constraints.
```xml
<predictions>
1. [Prediction 1]
2. [Prediction 2]
...
</predictions>
```

### B. Investigation (Scratchpad)
Dive into the code. Use a process of elimination to narrow down the predictions. Document your rationale for retaining or discarding each.
```xml
<scratchpad>
[Your investigation notes and elimination process]
</scratchpad>
```

### C. Problem Identification
Locate the specific code causing the issue.
```xml
<problematic_code>
[The exact code snippet causing the error]
</problematic_code>
```

### D. Step-by-Step Reasoning
Brainstorm and develop a plan to correct the error.
```xml
<step_by_step_reasoning>
1. [Step 1]
2. [Step 2]
...
</step_by_step_reasoning>
```

### E. Solution & Explanation
Provide a detailed explanation and comprehensive debugging instructions. Then provide the corrected code.
```xml
<explanation>
[Detailed explanation of the fix]
</explanation>

<debug_instructions>
[Comprehensive step-by-step debugging guide]
</debug_instructions>

<corrected_code>
[The full corrected code block]
</corrected_code>
```

## 3. Execution
After performing the analysis above:
1. Apply the fix using the appropriate file editing tools (`replace_file_content` or `multi_replace_file_content`).
2. Explain the fix to the user in the chat, using the `explanation` and `debug_instructions` generated above.
