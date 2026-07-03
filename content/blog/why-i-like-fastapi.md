---
title: "Why I Like FastAPI"
date: 2026-07-03
slug: why-i-like-fastapi
summary: "A short note on why FastAPI is my go-to for AI engineering work."
---

If you build anything with LLMs, you'll spend a lot of time wrapping them in an API.
I've tried Flask, Django REST, and a few others — but FastAPI is the one I keep coming back to.

It's simple. The decorator-based routing feels natural, the type hints double as
request validation, and the auto-generated docs at `/docs` mean I never have to write
a separate API spec. For an AI engineer who wants to ship agents and RAG pipelines
fast, that combination is hard to beat.

It also plays nicely with the rest of the AI stack. Async support, Pydantic models
for structured LLM outputs, easy streaming responses — everything I need for an
LLM-powered endpoint is one import away.

It's not the right tool for every job, but for the kind of AI apps I like to build,
it's the closest thing to a perfect match I've found.
