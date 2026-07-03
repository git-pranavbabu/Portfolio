---
title: "BPAN Automation Web App"
slug: bpan
oneLiner: "Production automation tool that generates and manages unique 21-digit battery identifiers with QR-linked technical data sheets — built and shipped to production in one week."
hykon: true
order: 1
tech: ["Web app", "Automation", "QR generation", "Production tool"]
links:
  github: ""
  live: ""
---

# BPAN Automation Web App

A production automation tool built and shipped to production in one week.

## What it does
- Generates unique 21-digit battery identifiers (BPAN) for every unit that comes off the production line
- Attaches a QR code to each identifier that links to the unit's technical data sheet
- Manages the lifecycle of these identifiers — generation, lookup, audit, and bulk operations
- Replaces a manual process that was slow and error-prone

## Why it matters
- Every battery Hykon produces gets a BPAN — it is the canonical identifier used across operations, sales, and after-sales
- The QR-linked data sheet means anyone in the field can pull up a unit's full spec sheet by scanning the code
- Built and shipped to production in one week, after a deeper scoping process had stalled for months

## Highlights
- End-to-end ownership — schema design, UI, generation logic, and deployment
- Designed for the floor: large touch targets, fast input flow, minimal clicks per BPAN
- Hand-off ready — the team continues to maintain and extend it post-internship
