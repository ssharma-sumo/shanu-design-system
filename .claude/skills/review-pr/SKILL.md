---
name: review-pr
description: Full PR review. Runs pr-reviewer and a11y-reviewer agents in parallel and merges their findings. Use when asked to review a PR or branch.
---

Review the changes on the current branch against `master` (or PR number given in the arguments).

1. Spawn both agents **in parallel** (one message, two Agent calls):
   - `pr-reviewer`: correctness, conventions, tests/stories
   - `a11y-reviewer`: accessibility
     Pass each the PR number if one was given; otherwise tell them to diff `master...HEAD`.
2. Merge the two reports into one:
   - Overall verdict (worst of the two)
   - Findings grouped Blocker / Should fix / Nit, tagged `[code]` or `[a11y]`
   - Any "Needs manual testing" items
3. Do not edit files. Report only.
