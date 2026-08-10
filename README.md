# Evolv Platform demo

Capability read from real work, shown in a university seat and an enterprise seat, with the same engine underneath.

**Open it:** https://sotoai.github.io/SFBUE-Demo/

You watch a professor set a real brief, then take the student's seat and do the work: interrogate the brief, select any passage to rewrite it, ask about it, tag it for research, or generate a concept image inside the document. A panel on the left, which is the faculty view narrowed, fills in as you work. It answers four questions: what value the person contributed, what capabilities created it, how we know, and what an organisation does with that at scale.

Nothing is submitted. Nothing is reviewed. The reading comes from the work.

## What is live on this page

This is a static site, so there is no server behind it and no keys in the page. Everything structural is real and runs in your browser:

- The document editor, selection, and all four passage actions
- The evidence engine, which is deterministic, so signals and confidence bands are genuinely computed from what you do
- Branches that matter: the rewrite you refuse, the decision you commit, the record you dispute
- The insights panel and the read back, computed from your session rather than scripted

Two things are prepared rather than live here, and the interface says so in the top right:

- **Language.** Answers and rewrites come from written fallbacks instead of a live model.
- **Images.** The concept visuals were generated ahead of time with Magnific and are served from `images/`. Editing and upscaling an image need the API and are inactive.

## Running it with everything live

The full project, including the server that holds the keys and proxies Anthropic and Magnific, lives outside this repository. With it running you get live conversation in the editor, live image generation, text-guided image editing, and upscaling. Keys sit in a `.env` file on the machine and never reach the browser, which matters because the image key is billed to its owner.

## Notes

The company, the product, the pilot data, and the people are invented. The capability framework and the four questions come from the SFBUE strategy.
