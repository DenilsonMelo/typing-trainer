# CLAUDE.md

## Contexto do projeto

Trainer de digitação para o teclado **Silakka54** — split column-stagger 54 teclas com firmware VIAL. O layout exibido na tela em [src/data/keyboard.ts](src/data/keyboard.ts) é o teclado físico do usuário, não um teclado genérico. As camadas VIAL (L0 QWERTY, L1 símbolos via Tab hold, L2 navegação via Space hold, L3 numpad via Enter hold, L4 F-keys via Bksp hold) aparecem como sublabels nas thumb keys.

## Convenções

- **Nomes de arquivo em kebab-case**, inclusive componentes: `key.tsx`, `keyboard-half.tsx`, `silakka54-typing-trainer.tsx`. Não usar PascalCase para arquivos.
- **Tipos compartilhados** em [src/types.ts](src/types.ts). Tipos internos a um módulo (ex: `State`/`Action` do reducer, props de componente) ficam co-localizados.
- **Dados em [src/data/](src/data/)**, estado em [src/state/](src/state/), UI em [src/components/](src/components/).
- **`verbatimModuleSyntax: true`** no tsconfig — use `import type { ... }` para imports só-de-tipos.

## Conteúdo dos níveis ([src/data/levels.ts](src/data/levels.ts))

Palavras PT-BR ficam **sem acentos** ("rapido", "precisao", "voce") porque o trainer assume layout QWERTY US sem dead keys. Manter esse padrão ao adicionar palavras.
