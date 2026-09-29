# Mapa-Mental-De-Carreiras

Mapa Digital interativo sobre o curso de Bacharelado em Sistemas de Informação do IFMG Ouro Branco, conectando disciplinas a possíveis trilhas de carreira. (Trabalho de Sistemas De Apoio A Decisão).

## Como funciona

O curso vira um tabuleiro em forma de S deitado. Cada tecla é uma casa:

- **Início**: dados do curso, formas de ingresso e divisão da carga horária.
- **1 a 8**: os períodos. Cada um mostra as disciplinas, a área de cada uma e as carreiras a que ela leva.
- **Carreiras**: os 28 caminhos possíveis. Ao escolher um, as teclas dos períodos que fazem parte da trilha acendem no tabuleiro.

Há também a visão **Áreas**, com as disciplinas agrupadas por tema, e a lista das 37 optativas.

Todos os dados vêm do [PPC do curso](docs/PPC%20Curso.pdf) (outubro/2022) e ficam em [assets/js/data](assets/js/data).

## Estrutura

```text
index.html
assets/
  css/
    base.css         tokens de cor (claro e escuro), reset, botões, chips
    layout.css       topo da página, área central, aviso de caminho
    board.css        tabuleiro, trilho, marcos de ano e keycaps
    window.css       janela de sistema: abas, endereço e barra de status
    views.css        conteúdo das telas: disciplinas, carreiras, áreas
  js/
    app.js           cria o namespace App (dados, views e estado)
    data/            dados do PPC: curso, áreas, períodos, disciplinas, carreiras
    core/
      utils.js       funções utilitárias
      catalog.js     índices e consultas sobre os dados
    components/
      ui.js          peças de HTML reutilizadas (chips, tags, cards)
      board.js       monta e posiciona o tabuleiro
      path.js        caminho de carreira selecionado
      window.js      abre, fecha e navega a janela
    views/           uma tela por arquivo: título da aba, caminho e conteúdo
    main.js          inicialização, cliques e atalhos de teclado
docs/                PPC do curso e enunciado da atividade
```

Os scripts são carregados em ordem pelo `index.html` e compartilham o objeto global `App`. Não há módulos ES, para que o site abra direto com dois cliques no `index.html`, sem servidor.

Para adicionar uma tela nova, crie um arquivo em `assets/js/views/` que registre `App.views.nome = { info, render }` e inclua o `<script>` no `index.html`.

## Rodar e publicar

Não há build. Para testar, abra o `index.html` no navegador.

Para publicar no GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
