```markdown
# Zaeon — AI‑Powered EdTech with On‑Chain Research Funding

Zaeon is an educational platform powered by **AI agents** that gamify access to daily **science, business, and entrepreneurship**. Students, teachers, and researchers collaborate with specialized agents that turn ideas into projects — and high‑rank users can unlock **on‑chain funding rails on the Sei blockchain** to support real‑world research and innovation.

> For the public, Zaeon is a playful, agent‑powered learning platform. Under the hood, it’s a modular research & funding stack that merges AI, data, and blockchain — without making users think about the chain.

---

## Highlights
- 🧠 **Agent Workforce**: Specialized skills, tools, and memory; built‑in planning and evaluation.
- 🕹️ **Gamification**: Quests, streaks, levels, and seasonal rewards tied to learning outcomes.
- ⛓️ **Sei Integration**: Funding pools, proposals, and milestone‑based payouts via CosmWasm contracts, with adapters for **goat‑sdk**, **Cambrian**, and **eliza plugin‑sei**.
- 📊 **Data & Analytics**: Event pipeline, pgvector embeddings, feature store, and model registry.
- 🧩 **Monorepo**: Shared UI, types, prompts, and chain SDK; one PR ships cross‑stack.

---

## Architecture (overview)
```

apps/\* (Next.js apps)  → users
services/agents        → planning, tools, memory, evals
services/gamification  → xp, quests, leaderboards
services/api           → public REST, webhooks, on‑chain reads/writes
packages/chain-sei     → {goat|cambrian|eliza} adapters
packages/db            → Postgres + pgvector
services/analytics     → ingestion → warehouse → dashboards
packages/feature-store → typed features (Postgres now)
services/model-registry→ MLflow/W\&B proxy + model cards

```

---

## Repo Structure (short)
See `/docs/Zaeon Monorepo Structure — v1.md` for rationale. Key roots:

```

apps/{web,admin,studio,docs}
services/{agents,worker,api,gamification,analytics,notifier,model-registry}
packages/{ui,types,db,prompts,agents-runtime,chain-sei,chain-contracts,trpc,sdk,utils,feature-store,evals}
platform/{infra,docker,k8s,gh-actions,slsa}
experiments/, features/, data/{seed,knowledge,research,contracts}, docs/

````

---

## Stacks ** [may change or vary during development] **
**Frontend**: Next.js (App Router), Tailwind, shadcn/ui, React Query, Zustand  
**Backend**: Next Route Handlers + (opt) Nest/Express service  
**DB**: Postgres + pgvector; Drizzle ORM (TS‑first)  
**Cache/Queue**: Redis + BullMQ  
**Agents**: custom runtime + LangChain/LlamaIndex where pragmatic  
**Blockchain**: CosmJS + `packages/chain-sei` adapters (goat, cambrian, eliza)  
**MLOps**: Model registry (MLflow/W&B), feature store (typed, Postgres), evals  
**Observability**: OpenTelemetry, Sentry, Grafana/Tempo/Loki  
**Infra**: Docker/Compose (local), Terraform (cloud), GitHub Actions CI/CD

---

## Quickstart (local)
```bash
pnpm i
# spin infra
docker compose -f platform/docker/compose.dev.yml up -d
# run all workspaces
pnpm dev
````

### Environment

Copy `.env.example` to `.env` at root and per app/service as needed.

**Essentials**

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/zaeon
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=changeme
OPENAI_API_KEY=sk-...
SEI_RPC_URL=https://sei-testnet-rpc...
SEI_CHAIN_ID=atlantic-2
WALLET_MNEMONIC="swallow trend ..." # dev only
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

---

## Development Workflow

* **Turborepo** drives tasks: `dev`, `build`, `lint`, `test`.
* **Changesets** for versioning packages; PRs require green `lint` + unit tests.
* **Preview deploys** per app on each PR; contracts/tests run in parallel.
* **Codeowners** gate sensitive paths (e.g., `packages/chain-sei`, `services/agents`).

---

## Data Science Playbook

* Use `/experiments` for notebooks and small datasets (checked in only if <5MB).
* Promote successful notebooks into `services/analytics` jobs or `packages/feature-store` pipelines.
* Register models via `services/model-registry` and ship **model cards** with eval metrics.
* Keep **dataset contracts** under `data/contracts` (Great Expectations or similar) and validate in CI.

---

## Agents

* Orchestrated via `services/agents` with a tool registry and memory backends.
* Prompts stored in `packages/prompts` with version tags; evals in `packages/evals`.
* Safety: tool quotas, sandboxed code runner, redaction on logs, PII minimization.

---

## Blockchain (Sei)

* All on‑chain ops go through `packages/chain-sei` high‑level API (create pool, proposal, vote, payout).
* Choose adapter in config: `goat`, `cambrian`, `eliza`.
* **Dry‑run** sim available for users without wallets.

---

## Testing

* **Vitest** for TS; **contract tests** via local wasmd; **prompt evals** via `packages/evals`.
* E2E smoke via Playwright for `apps/web` critical flows.

---

## Security (!!!!!!!!!!)

* Secret scanning, dependency review, SBOM (Syft) & image scans (Trivy).
* Audit logs for admin actions and payouts; rate limits on agent tools.

---

## Contributing

1. Create a branch: `feat/<scope>`
2. Add tests/docs.
3. Run `pnpm lint && pnpm test`.
4. Open PR; fill checklist in PR template.

---

## License

Apache-2.0

```
```
