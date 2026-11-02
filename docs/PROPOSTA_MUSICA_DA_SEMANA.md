# Karaoke⭐Time! — Proposta: Música da semana

Status: **proposta, nada implementado**. Precisa de aprovação da dona e de uma mudança no banco (ChatGPT).

## Ideia

Uma música por semana ganha destaque e um quadro próprio, **"Top 5 da música da semana"**, além dos três quadros que já existem (Pontuação, Acertos e Combo). Só contam os shows feitos com essa música.

A semana é a mesma do ranking e da vista da janela: começa **domingo à 0h de Brasília**. A música combina com a vista da semana:

| Vista da janela | Música da semana | Por quê |
|---|---|---|
| 🏘️ Gigoia | 🌙 Doce Melodia (90 BPM · ★) | vila calma à beira d'água |
| 🏮 Liberdade | 🌛 Moon⭐Duo! (84 BPM · ★) | rua de lanternas, clima de noite |
| 🛕 Tailândia | ⭐ Brilha Comigo (108 BPM · ★★) | templo dourado, música luminosa |
| 🎀 Harajuku | 💗 Love × Debut (132 BPM · ★★) | rua lotada e agitada |
| 🏖️ Praia | 🎰 Star⭐Gacha! (124 BPM · ★★★) | sol, festa e energia |

Ficam de fora do rodízio: 🌷 TsuLiPa⭐World e 🏁 Center⭐Run! (continuam jogáveis normalmente). Se a dona preferir, dá para trocar qualquer par.

## Por que não um ranking completo por música

São 7 músicas para cerca de 18 jogadores com Idol na vitrine, com 5 shows por dia. Sete rankings × três quadros deixariam quase tudo vazio ("Em breve"). A música da semana concentra todo mundo numa música só, e os **recordes pessoais por música** (já guardados no aparelho e agora mostrados ao lado da Trilha) cobrem o resto.

## O que muda

**Na sala (GitHub):**
- Selo "⭐ Música da semana" na opção da Trilha e na Biblioteca musical.
- Quarto quadro "Top 5 da música da semana", com a mesma linha "Você · Nº" fora do Top 5.
- O show envia ao servidor qual música foi tocada.

**No banco (ChatGPT, com autorização):**
- Hoje `kt_run_finish` não recebe a música. Seria preciso:
  - guardar a música do show em `kt_run_start` ou `kt_run_finish` (parâmetro novo, opcional, para não quebrar versões antigas);
  - uma tabela nova com o melhor resultado de cada conta **na música da semana**;
  - `kt_ranking` (ou uma função nova) devolver esse quadro.
- O servidor decide qual é a música da semana com a mesma regra do site (domingo 0h de Brasília, mesma ordem), para ninguém conseguir enviar outra música.

## Riscos e cuidados

- Não mexe em estrelas, tickets nem no limite de 5 shows por dia.
- O ranking atual (Pontuação, Acertos, Combo) continua igual.
- Sem conta: o quadro da música da semana fica só no aparelho, como os outros.
