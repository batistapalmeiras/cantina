# Plano de execução — `apps/bp-reserva`

> Fase 2 do projeto. `bp-cantina` + `packages` (bp-core, bp-ui) já estão concluídos e são a **referência**.
> Base: auditoria de 2026-07-06. Padrão: [`CONVENTIONS.md`](../CONVENTIONS.md). Referências de migração: `apps/bp-cantina/{vite.config.ts,index.html,tsconfig.json,package.json,.eslintrc.json}`.

## Contexto que encurta o trabalho

`bp-core` e `bp-ui` já estão prontos (client tipado, contexts com `error`, tokens de cor `success/warning/info/danger`, forwardRef, a11y, `DishQuantity`, etc.). Confirmado na auditoria: **o `bp-reserva` não usa nenhum símbolo removido/renomeado** — a normalização não o quebrou. Então o plano aqui é: **paridade de tooling (Vite)** + **bugs do app** + **consistência/dedup**, sem mexer no core/ui exceto pelas consolidações opcionais da Onda R3.

Cada item: **objetivo · arquivos · aceite · esforço (S<2h / M meio-dia / L 1-2d) · categoria** (🐞 bug · 🔧 tooling · ♻️ consistência).

---

## Onda R0 — Tooling: CRA → Vite + Vitest (fundação)

Espelha o que foi feito no bp-cantina (W0 + W5-1 + W5-2), agora num PR só porque o padrão já existe e é copiável.

### R0-1 · Migrar build para Vite · `M` · 🔧
- **Arquivos:** criar `apps/bp-reserva/vite.config.ts` (copiar do bp-cantina: `@vitejs/plugin-react`, `build.outDir: 'build'`, `define` de `process.env.REACT_APP_SUPABASE_*`, `test` do vitest), `apps/bp-reserva/index.html` (raiz, sem `%PUBLIC_URL%`, `<script type="module" src="/src/index.tsx">`); remover `public/index.html`.
- `package.json`: `"type": "module"`; scripts `dev/build/preview/test(vitest run)/test:watch/lint`; remover `react-scripts`; add `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`; remover `@types/jest`.
- `tsconfig.json`: `types: ["vite/client","vitest/globals","@testing-library/jest-dom"]`.
- **Aceite:** `vite build` gera `build/`; `vite dev` sobe e renderiza a tela de Identificação; sem erros de console.
- **Depende de:** —

### R0-2 · Limpar artefatos do CRA · `S` · 🔧
- **Arquivos:** remover `src/react-app-env.d.ts`, `src/App.css`, `src/index.css`, `src/logo.svg` (todos CRA leftovers, não importados); revisar `src/reportWebVitals.ts` (usa API antiga do web-vitals `getCLS/getFID` — ou atualizar p/ `onCLS/onINP...` ou remover, como avaliar); tirar o `eslintConfig` inline do `package.json`.
- **Aceite:** sem referências a `react-scripts`/CRA; build limpo.

### R0-3 · Lint (paridade com bp-cantina) · `S` · 🔧♻️
- **Arquivos:** criar `apps/bp-reserva/.eslintrc.json` (react-app + `import/no-duplicates` + `import/order` como `warn`); add script `lint`.
- **Aceite:** `pnpm --filter bp-reserva lint` roda (exit 0, warnings informativos).

### R0-4 · Consertar/refazer os testes (Vitest) · `S` · 🔧🐞
- **Arquivos:** `src/App.test.tsx` (boilerplate `learn react` — quebrado); `src/setupTests.ts`.
- **Passos:** substituir por smoke test real (ex.: página Identify monta) no estilo do `bp-cantina/src/pages/Login/index.test.tsx`; `setupTests` só `@testing-library/jest-dom`.
- **Aceite:** `vitest run` verde.
- **Depende de:** R0-1.

---

## Onda R1 — Bugs funcionais (P0)

### R1-1 · `stayForMeal` não é persistido · `S` · 🐞
- **Problema:** os hooks coletam `stayForMeal` e mostram o toggle "Espaço de Convivência", mas o `addOrder({...})` **omite** o campo → sempre grava `false`.
- **Arquivos:** [`Reservation/hooks/useReservation.ts`](../apps/bp-reserva/src/pages/Reservation/hooks/useReservation.ts), [`EditReservation/hooks/useEditReservation.ts`](../apps/bp-reserva/src/pages/EditReservation/hooks/useEditReservation.ts).
- **Aceite:** reserva criada/editada com o toggle ligado grava `stay_for_meal = true`.

### R1-2 · Edição recria o pedido em vez de atualizar · `M` · 🐞
- **Problema:** `useEditReservation` faz `cancelOrder(id)` + `addOrder(...)` — gera novo id, reseta `created_at` e é **não-atômico** (se o `addOrder` falha após o cancel, o convidado perde a reserva).
- **Arquivos:** `EditReservation/hooks/useEditReservation.ts`. Usar `updateOrder(orderId, {...})` do `bp-core` (já existe).
- **Aceite:** editar mantém o id/created_at; falha no meio não apaga a reserva.

### R1-3 · Side-effects durante o render · `S` · 🐞
- **Problema:** `navigate()` no corpo do `ReservationConfirmed` (quando `state` é nulo) e `showToast()` no corpo do `EditReservation`.
- **Arquivos:** [`ReservationConfirmed/index.tsx`](../apps/bp-reserva/src/pages/ReservationConfirmed/index.tsx) (→ `<Navigate replace/>` ou `useEffect`), [`EditReservation/index.tsx`](../apps/bp-reserva/src/pages/EditReservation/index.tsx) (→ `useEffect`, como o Reservation já faz).
- **Aceite:** sem efeitos colaterais na fase de render.

### R1-4 · `useClientHistory`: `any` + race · `S` · 🐞
- **Arquivos:** [`History/hooks/useClientHistory.ts`](../apps/bp-reserva/src/pages/History/hooks/useClientHistory.ts). Tipar rows via `Database` (client já tipado); guard `ignore` no cleanup do effect.
- **Aceite:** sem `any`; resposta lenta não sobrescreve estado novo.

### R1-5 · Nits · `S` · 🐞
- History skeleton com `key={i}` → chave estável; conferir R1 do `EditReservation`: exibe `baseTotal` (sem sobretaxa Pix) mas submete `total` (com) — alinhar com o Reservation (mostra total com sobretaxa) ou confirmar intenção.

---

## Onda R2 — Consistência & convenções

### R2-1 · Barrels e imports por pasta · `S` · ♻️
- Criar `History/hooks/index.ts` (falta o barrel); rotear imports por pasta: `Reservation/index.tsx` (`./components`, `./hooks`), `History/index.tsx` (`./hooks`), `CancelConfirmDialog` via `./components`.

### R2-2 · Tirar lógica de agrupamento do JSX → `domain/` · `M` · ♻️
- **Problema:** `reduce` de agrupamento de tickets inline no JSX em `Reservation` (2×) e `EditReservation`, + dedup inline no `History`. Idêntico ao que extraímos no `Cashier/domain`.
- **Passos:** criar `Reservation/domain/` e `EditReservation/domain/` (ou usar o helper compartilhado da R3-1) com `groupTicketsForSummary`/`summarizeTicketsText`; `index.tsx` só JSX; **adicionar testes de domínio** (Vitest).
- **Depende de:** R0 (rede de teste). Idealmente R3-1 (helper compartilhado) antes, pra não duplicar de novo.

### R2-3 · `DishQuantity` do bp-ui em vez de `DishQty` local · `S` · ♻️
- `useReservation.ts` e `useEditReservation.ts` redefinem `DishQty`; usar `DishQuantity` do `bp-ui` (mesma forma, tipo apagado em runtime) — igual fizemos no Cashier.

### R2-4 · Cores hardcoded → tokens do theme · `S` · ♻️
- Trocar os hex de status (`#f0faf5/#1a7a4a/#b45309`...) por `theme.colors.success*/warning*` em `Reservation/styles`, `History/styles`, `ReservationConfirmed/styles`, `Layout/styles` (`#b0b0b0`→`mutedSoft`, etc.).

### R2-5 · Nits de convenção · `S` · ♻️
- `CancelConfirmDialog.tsx`: mover `styled.div` para `styles/`; `EditReservation`: `styles/EditReservation.ts` + barrel (hoje o styled mora no `index.ts`); tirar inline styles espalhados; espaço `//` em imports.

---

## Onda R3 — Consolidação cross-app (dedup entre os dois apps) — ✅ confirmada no escopo

> Estas tocam `bp-core`/`bp-ui` (já mergeados) para **remover duplicação entre bp-cantina e bp-reserva**.
> Decisão (2026-07-06): **incluída**. Como o `R3-1` define o lar final do helper de agrupamento, **fazer R3-1 antes do R2-2** para não extrair o `domain/` duas vezes. Ao consolidar, atualizar também o `bp-cantina` (Cashier) para consumir o helper/StatusBadge compartilhados.

### R3-1 · Helper de agrupamento de tickets compartilhado · `M` · ♻️
- O `groupTicketsForSummary`/`summarizeTicketsText` existe no `Cashier/domain` e seria reescrito 3× no reserva. Promover para `bp-core/src/utils/` (domain-facing, sobre `Order`/`TicketItem`) e ambos os apps consomem. Elimina 4 cópias.

### R3-2 · `StatusBadge` compartilhado · `S` · ♻️
- O badge de status (mesmo bloco de cores) está em `OrdersList` (bp-ui), `Reservation/styles` e `History/styles`. Extrair um `StatusBadge` no `bp-ui` (usando os tokens) e reusar nos três.

### R3-3 · Constante `CHURCH_PIX_KEY` + `error` no `useClient` · `S` · ♻️🐞
- `CHURCH_PIX_KEY = '16886715000123'` está duplicada em `useReservation` e `useEditReservation` → mover pra config no `bp-core`.
- `useClient` (bp-core) não expõe `error` (os outros contexts passaram a expor no W2-3); adicionar e surfacar no fluxo de convidado (Identify/Profile/Layout engolem falhas).

---

## Sequenciamento sugerido

```
R0 (Vite/tooling) ─► R1 (bugs) ─► R3-1/R3-2 (helper+StatusBadge no core/ui) ─► R2 (consistência, consumindo o compartilhado) ─► R3-3
```
- **R0 primeiro** (destrava Vitest + valida que o app roda).
- **R1** em seguida (bugs de dados: stayForMeal, edição atômica).
- **R3-1 e R3-2 antes do R2-2/R2-4** — assim o grouping e o StatusBadge são extraídos já no lar compartilhado (bp-core/bp-ui) e ambos os apps consomem, sem extrair duas vezes.
- **R2** aplica a consistência no bp-reserva usando o compartilhado; **R3-3** (PIX key + `error` no `useClient`) fecha.

## Definition of Done por PR
- `pnpm --filter bp-reserva lint` e `vitest run` verdes; `tsc --noEmit` limpo; `vite build` ok.
- PRs de refactor (R2/R3) sem mudança de comportamento; PRs de bug (R1) com o fix verificável.
- Nenhum `any`/cor crua/side-effect-no-render **novo**.

## Fora do escopo (pendências gerais do projeto)
- Rotacionar a anon key do Supabase (exposta no histórico do git).
- Foco-trap completo no Modal (bp-ui) — follow-up de a11y anotado no W4-5.
