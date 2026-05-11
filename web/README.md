# SoftWorker Web

Interface local do SoftWorker para editar currículos e acompanhar a pré-visualização do PDF em tempo real.

## Requisitos

- Node.js 22+ recomendado
- npm 10+

## Rodando localmente

Na pasta `web/`:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Fluxo de desenvolvimento

O editor oferece dois modos:

- `Formulário`: edição estruturada dos campos do currículo
- `JSON`: edição direta da fonte JSON

A coluna da direita renderiza a pré-visualização do documento final e também permite baixar:

- `Baixar JSON`
- `Baixar PDF`

## Checks úteis

```bash
npm run lint
npm run typecheck
```

## Estrutura resumida

- `src/app/`: shell principal da aplicação
- `src/components/workspace/`: editor, cabeçalho e seções
- `src/components/preview/`: painel e frame da pré-visualização
- `src/server/services/`: renderização HTML/PDF usada pela interface

Para instruções do repositório inteiro, incluindo a CLI Python, veja o README da raiz.
