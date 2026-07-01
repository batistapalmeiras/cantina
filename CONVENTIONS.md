# Convenções do projeto

## Estrutura de uma page

Cada page complexa (com lógica de negócio própria) segue esta estrutura:

```
pages/<Page>/
  domain/
    rules.ts          # funções puras de negócio (sem React, sem Supabase)
    types/             # tipos derivados de regras de negócio (ver "Padrão de pasta types/")
      interfaces.ts
      index.ts
    index.ts            # barrel: export * from './rules'; export * from './types';
  hooks/
    use<Page>.ts       # orquestra dados (contexts/Supabase) + chama domain/rules
  styles/
    <Page>.ts            # styled-components da page
    index.ts              # barrel: export * from './<Page>';
  types/
    enums.ts             # tipos de estado de UI (ver "Padrão de pasta types/")
    index.ts
  components/            # subcomponentes específicos da page, se houver
  index.tsx               # só composição/JSX — sem lógica de negócio, sem styled-components
```

### Toda pasta tem seu `index.ts` como porta de entrada

`domain/`, `types/`, `styles/`, `components/` — todas são importadas de fora **pelo caminho da pasta**, nunca pelo arquivo interno:

```ts
// ✅ certo
import { groupTicketsByDish } from './domain';

// ❌ errado — vaza detalhe de implementação interna da pasta
import { groupTicketsByDish } from './domain/rules';
```

Isso vale mesmo quando a pasta hoje só tem um arquivo (`rules.ts`, `enums.ts`, `<Page>.ts` etc.) — o `index.ts` existe desde o início para não exigir refatorar todos os imports quando a pasta crescer.

Se `styles/<Page>.ts` ficar grande demais, divida por responsabilidade (ex: `Card.ts`, `Tabs.ts`) e mantenha `index.ts` reexportando todos — a mesma lógica de `types/`.

### Padrão de pasta `types/`

Toda pasta `types/` do projeto (seja a raiz de uma page, seja `domain/types/`, seja `src/types/`) segue a mesma divisão por responsabilidade — **nunca um arquivo único misturando tudo**:

```
types/
  enums.ts        # só enums
  interfaces.ts     # só interfaces
  types.ts          # só type aliases (union types, utility types, etc.)
  index.ts           # barrel: export * from './enums'; export * from './interfaces'; export * from './types';
```

Crie **apenas os arquivos que tiverem conteúdo** — se a page só tem um enum, existe só `enums.ts` + `index.ts`. Não criar `interfaces.ts`/`types.ts` vazios "por precaução".

Sempre importe pelo caminho da pasta (`from './types'`), nunca do arquivo específico (`from './types/enums'`) fora da própria pasta — o `index.ts` é o único ponto de entrada público.

### `domain/` vs `types/`: qual usar?

**Teste**: *"Esse tipo/função ainda faria sentido se essa funcionalidade virasse uma API ou script, sem nenhuma tela?"*

- **Sim** → `domain/` (é um conceito do negócio)
- **Não** → `types/` na raiz da page (só existe por causa da UI)

| Exemplo | Onde | Por quê |
|---|---|---|
| `groupTicketsByDish(order)` | `domain/rules.ts` | Regra de negócio: como agrupar itens de um pedido. Faria sentido num relatório, numa API, em testes — sem tela nenhuma. |
| `GroupedItem` (formato do agrupamento) | `domain/types/interfaces.ts` | É o tipo de retorno de uma regra de negócio. |
| `KitchenTab` (`Pending` \| `Delivered`) | `types/enums.ts` | Só existe porque a tela tem abas. É estado de navegação local, não um conceito do domínio "pedido". |

Regra prática: **comece em `types/`**. Só promova para `domain/types/` quando uma camada sem React (um hook, uma rule, um teste) também precisar do tipo.

### `domain/rules.ts`: o que entra

- Funções puras: recebem dados, retornam dados. Sem `useState`, sem `supabase`, sem JSX.
- Testáveis isoladamente sem mock de React/Supabase.
- Exemplos: agrupar/ordenar/filtrar dados, calcular totais, validar regras de negócio.

### `hooks/use<Page>.ts`: o que entra

- Acesso a dados (via contexts como `useSessionCtx`, ou chamadas diretas ao Supabase).
- Orquestra: busca dado bruto → chama `domain/rules` → retorna pronto para a UI.
- Não duplica lógica de negócio que já existe em `domain/`.

### `index.tsx`: o que entra

- Só JSX e composição de componentes.
- Não declara `styled.div` (vai em `styles/`).
- Não declara regra de negócio (vai em `domain/`).
- Não declara enum/interface de domínio solto (vai em `domain/types/` ou `types/`).

## Domínio compartilhado entre páginas

Quando um conceito é usado por mais de uma page (ex: `Order`, `Dish`, `Session` — usados em Kitchen, Cashier, Report, Pedidos), ele **não** entra no `domain/` de uma page específica. Continua em `src/types/` (compartilhado) até que exista necessidade real de uma camada de domínio compartilhada formal — não criar isso preventivamente.

## Domínios de produto (futuro)

O projeto pode crescer para outros produtos além da cantina (ex: reserva de cursos, venda de livros). Quando isso acontecer, **não** criar `domain/` global misturando conceitos de produtos diferentes. Cada produto deve ter seu próprio agrupamento (ex: `domains/cursos/`, `domains/livraria/`), evitando colisão de conceitos como "Pedido" significando coisas diferentes em cada contexto. Não criar essas pastas antecipadamente — só quando o domínio existir de fato.

## Componentes globais (`src/components/`)

Um componente só sai de dentro de uma page e vai para `src/components/` quando é **reutilizado por mais de uma page** (ex: `Button`, `IconButton`, `Tabs`, `Toast`, `BottomSheet`). Componentes usados em uma única page ficam em `pages/<Page>/components/`.

## Páginas já estruturadas neste padrão

- `pages/Kitchen/`
