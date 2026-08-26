<p align="center">
  <img src=".github/deep-academy.png" alt="Deep Academy icon" width="128">
</p>

# Deep Academy

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) [![Release](https://img.shields.io/github/v/release/infinition/deep-math-academy?style=flat)](https://github.com/infinition/deep-math-academy/releases) [![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/infinition)

An interactive browser platform for the mathematical foundations of AI. Each module teaches a concept visually and interactively, then connects it to a concrete machine learning application.

Live: https://infinition.github.io/deep-math-academy/

<img width="805" height="437" alt="Deep Academy" src="https://github.com/user-attachments/assets/b85d75bc-b470-41af-b4b0-8cfdff3ab797" />

<img width="1352" height="944" alt="Deep Academy modules" src="https://github.com/user-attachments/assets/75eae69a-949c-4780-b36f-4bad0f17fc7c" />

---

## Content organization

The 127 modules are preserved and organized by purpose rather than merged destructively:

**Guided paths** -- Two progressive 11-level curricula: AI from mathematical notation to research level (107 concept cards), and quantum computing from complex numbers to practitioner level (82 concept cards).

**Interactive foundations** -- Mathematical notation, analysis and calculus, linear algebra, statistics and probability. These modules add visual explanations, canvas experiments and manipulable examples to concepts also covered by the cards.

**Labs and references** -- A broad ML/DL/RL/GenAI/MLOps reference, modern AI dynamics labs, and 33 focused quantum modules. Use these to investigate a specific topic or go beyond the guided paths.

Overlap is intentional: cards provide the learning sequence, foundations build intuition, and references provide breadth and advanced detail.

---

## Running

No server, no build step.

```bash
git clone https://github.com/infinition/deep-math-academy.git
cd deep-math-academy
# open index.html in your browser
```

`index.html` works directly through `file://` as well as through an HTTP server.
After editing a course or `courses_config.json`, refresh the generated offline bundle:

```bash
node build_content_bundle.js
```

Content integrity can be checked at any time:

```bash
node audit_structure.js
node audit_densite.js
node offline_smoke_test.js
```

---

## Stack

- Vanilla JavaScript, HTML5
- Tailwind CSS (CDN)
- MathJax (LaTeX)
- Chart.js (statistical graphs)
- Canvas API (vector and gradient visualizations)

---

## Star History

<a href="https://www.star-history.com/?repos=infinition%2Fdeep-math-academy&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=infinition/deep-math-academy&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=infinition/deep-math-academy&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=infinition/deep-math-academy&type=date&legend=top-left" />
 </picture>
</a>

---

## License

MIT. See [LICENSE](LICENSE).
