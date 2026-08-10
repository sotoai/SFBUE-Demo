# Evolv, an enterprise walkthrough

A playable demo of a work surface that reads capability from real work, invisibly, while the person just does the job.

**Open it:** https://sotoai.github.io/SFBUE-Demo/

You are the professional. A brief arrives, you interrogate it, you work a go-to-market plan for a fictional company, you catch a confident claim that does not hold, and you make a pricing call under real uncertainty. A narration rail on the right names what the system is reading as you go. At the end you get a mirror, not a verdict.

Runs from the link with no setup. Desktop first. About ten minutes.

## Two ways it answers

**Cold, the default.** No setup. Conversational moments are answered from a staged bank that routes on what you actually type and never repeats itself.

**Live.** Click `live` in the top right and paste an Anthropic API key. Conversations then run on a live model held in character by a fenced prompt. Your key is stored in your own browser only, and calls go directly from your browser to Anthropic. Nothing is sent anywhere else, and there is no server in between.

If a live call fails for any reason, the staged bank answers instead, so the demo never stalls.

## Notes

Everything is one self-contained file, `index.html`. No build step, no dependencies, no tracking. The company, the numbers, and the pilot data in the scenario are invented.
