# Gerador do mapa (SVG em Python)

Rodar sempre de dentro desta pasta (`cd tools/mapa`).

- `mapa.py`: mapa original de 1 nível (é o `mapa-cidade.svg` do site). Todos os prédios e ajudantes de desenho (`madeira`, `listras`, `babado`, `vidro`, `brilhos`, `holofote`, `arvore`, `sakura`, `flor`, `cloud`, `qpts`, `ic`, `grad`...) moram aqui.
- `lib.py`: reaproveita o `mapa.py` para outras cenas. `bloco('# Happy⭐Cafe!', x, b)` redesenha um prédio em outra posição; `novo()` limpa; `salvar(nome, W, H)` grava `nome.html`. Para não desenhar a plaquinha do prédio: `G['placa'] = lambda *a, **k: None`.
- `mundo2.py`: **mapa do mundo APROVADO** (6 bairros) → `docs/mapa-provas/mundo_v2.jpg`.
- `rua.py`: **cena da Rua Harajuku APROVADA** → `docs/mapa-provas/rua_harajuku.jpg`.
- `sep.py`: separa os `<text>` do SVG num JSON (o site desenha os textos no canvas com a fonte Mochiy Pop One).
- `shotx.js nome W H`: tira o PNG de `nome.html` (Playwright).

Exemplo: `python3 mundo2.py && node shotx.js mundo2 1600 1000`

Estilo obrigatório: igual às cenas do jogo. Sem contorno grosso; madeira, listras, babado, vidro com brilho, sombras suaves, tons pastel (#7b3ff0, #ff6fb5, #4169e1, #b6ff3b). Nada solto voando além da ilha do Céu.

## Mapa em dois níveis — preparação das artes (PR #88)

Rode **da pasta `tools/mapa`**:

```sh
python3 gerar_2_niveis.py
node shotx.js mundo2 1600 1000
for bairro in palco harajuku fofo praca arena ceu; do node shotx.js "rua_$bairro" 1600 760; done
cd ../..
for f in tests/*.js; do node "$f"; done
```

O gerador produz os SVGs `mapa-mundo.svg` e `mapa-rua-{palco,harajuku,fofo,praca,arena,ceu}.svg` na raiz do projeto, além dos arquivos HTML/SVG de conferência em `tools/mapa/`. Ele valida o XML de cada SVG.

**Importante:** as novas ruas ainda precisam de conferência visual. O gerador não muda `tw-mapa.js` nem ativa a navegação de dois níveis. As figuras mantêm os textos SVG para a prova visual; a separação das etiquetas para desenho no canvas será validada antes da integração.
