# Outsourcing requirements agents

**Runner-up (2nd place), DX Cup Mongolia 2023**, the JICA / DX Mongolia
competition for Mongolian and Japanese student teams. Team AXLETH. Final held
in January 2024 at Z.com ASA Arena, Ulaanbaatar.

A hackathon prototype from November–December 2023. A client who wants
software built answers nine questions, and a set of GPT-4 "agents" turn the
answers into the documents an outsourcing vendor needs before it can quote: an
epic document, a PRD, user stories, a sequence diagram, and a time and budget
estimate.

The problem it was built for: outsourcing teams in Mongolia working for
Japanese clients lose the first weeks of every project to requirements
back-and-forth. The prototype moves that work into the client's first session.

## How it works

```
general-info (5 questions)  →  ba-questions (3 more)
        ↓
  /agents/ba      business-analyst agent: epic document and process requirements
  /stories        product-owner agent: user stories as a table
  /agents/sa      system-architect agent: Mermaid sequence diagram from the stories
  /budget         hours per story × hourly rate → cost in ₮, sliders, PDF export
```

Each agent is a streaming chat route under `src/pages/api/` with its own
system prompt (`src/lib/form/prompts.ts`):

| Route | Role | Prompt, in short |
|---|---|---|
| `api/agents/ba` | Business analyst | write the epic document with all requirements and the BPMN modelling requirements |
| `api/agents/po` | Product owner | write a PRD: subject, problem, goals, user stories, technical requirements, KPIs, risks |
| `api/story` | Product owner | answer with as many user stories as possible, as a markdown table |
| `api/agents/sa` | System architect | return only the Mermaid sequence-diagram code for these user stories |
| `api/time` | Estimator | return the project time as an integer hour range, e.g. `[10,12]` |

The client's answers and each chat live in one Zustand store
(`src/lib/form/store.ts`), so the agents build on each other: the architect
and the estimator both read the stories, and the budget page multiplies the
estimate by a rate and renders it with sliders and a PDF export (`jspdf`).
Diagrams render client-side with `mermaid`.

## Stack

Next.js (pages router), TypeScript, tRPC, Prisma + Kysely on Postgres (Neon),
NextAuth, Tailwind + shadcn/ui, Vercel AI SDK with the OpenAI client, Zustand,
Mermaid, jsPDF. Scaffolded with `create-t3-app`.

Data model (`prisma/schema.prisma`, diagram in `prisma/ERD.svg`): User, Agent,
Project, Question, Answer, Requirement.

## Run it

```bash
pnpm install
cp .env.example .env     # DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY
pnpm db:push
pnpm dev                 # http://localhost:3000
```

`OPENAI_API_KEY` is needed by every agent route; the routes call `gpt-4`.

## Team and state of the code

- Dolgoon Amartaivan: product, backend and most of the frontend (17 of 21
  commits).
- Unubold: frontend, Mermaid integration, build fixes.

Hackathon code, left as it was at the competition apart from a December 2024
pass that fixed type errors and finished the budget UI. There are no tests,
and the agent routes have no auth. The prompts are in English because the
judging panel was mixed Mongolian and Japanese; the product idea was a
Mongolian-language version for local clients.

Organized by JICA and DX Mongolia with the Ministry of Education and Science,
KITE, KOSEN and the Japan Deep Learning Association. Sponsors on the day: usp
lab, Nasha Tech, TAB Solution, Gerege Systems.
