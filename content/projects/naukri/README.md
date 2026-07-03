# Naukri AI Candidate Shortlisting Tool

A two-agent Chrome extension that screens and ranks job candidates entirely client-side.

## What it does
- Lives as a Chrome extension on top of the Naukri recruiter dashboard
- Two collaborating agents: one screens the candidate profile against the job description, the other ranks and explains the result
- Runs entirely client-side — no candidate data leaves the browser

## Why it matters
- Cuts manual HR screening time by ~54 hours per month
- Privacy-preserving by design: the only model calls are made with the user's own API key, and no candidate data is logged server-side
- Two-agent split gives a clearer separation of concerns than a single mega-prompt — easier to debug, easier to extend

## Highlights
- Client-side LLM orchestration
- Agent prompts and tool definitions tuned for the Naukri profile schema
- Worked end-to-end on real recruiter workflows
