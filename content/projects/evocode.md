---
title: "Evocode: AI-Powered Learning Ecosystem"
slug: evocode
oneLiner: "Adaptive learning ecosystem using LangGraph to orchestrate LLM agents for generating personalized syllabi and mastery-based assessments."
hykon: false
order: 5
tech: ["LangGraph", "FastAPI", "Google Firestore", "React", "LLM agents"]
links:
  github: ""
  live: ""
---

# Evocode: AI-Powered Learning Ecosystem

A personal project — an adaptive learning platform that uses LangGraph-orchestrated LLM agents to generate personalized syllabi and mastery-based assessments.

## What it does
- Builds an adaptive learning path for a learner, based on their stated goal and prior knowledge
- Uses a LangGraph-orchestrated set of LLM agents to generate the syllabus, the lessons, and the assessments
- Re-tests concepts the learner gets wrong, escalating to harder variants as they demonstrate mastery

## Why it matters
- A real testbed for agent design — multi-agent flows are easy to draw, hard to make robust, and Evocode is where I push on that
- Useful in its own right: the assessment quality on harder topics is better than most static quiz generators I've seen

## Highlights
- LangGraph agent orchestration with stateful learner profiles
- FastAPI backend, Google Firestore for learner data
- React frontend with progress dashboards
- Mastery loop: a concept is "done" only after the learner passes a generated assessment
