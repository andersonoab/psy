# Assessment Sonova - Entrevista Estruturada

Projeto estático em HTML, CSS e JavaScript para aplicação de entrevista comportamental estruturada com apoio ao recrutador.

## Objetivo
Criar uma jornada simples, visual e clara para:
- conduzir a entrevista em tela
- registrar percepções do recrutador
- gerar leitura final estruturada
- sugerir tags ATS
- exportar resultado em JSON
- permitir hospedagem simples via GitHub Pages

## Estrutura
- `index.html` -> interface principal
- `style.css` -> paleta Sonova clara com azul claro e laranja
- `app.js` -> regras de interação, scoring, resumo e exportação

## Funcionalidades
- identificação do candidato e recrutador
- escolha simbólica inicial
- situação de negociação
- situação de chefia / pressão
- notas do recrutador em escala
- cálculo de:
  - colaboração
  - assertividade
  - estabilidade sob pressão
  - organização
  - autonomia
  - risco operacional
- classificação de senioridade
- resumo executivo automático
- tags ATS sugeridas
- salvamento local via `localStorage`
- exportação do resultado em JSON

## Como usar localmente
Basta abrir o arquivo `index.html` no navegador.

## Como publicar no GitHub Pages
1. criar um repositório no GitHub
2. enviar os arquivos `index.html`, `style.css` e `app.js`
3. abrir Settings
4. entrar em Pages
5. escolher a branch principal e a pasta `/root`
6. salvar
7. aguardar o link público

## Sugestão de evolução
- múltiplos candidatos em histórico local
- ranking por vaga
- comparação lado a lado
- exportação para PDF
- radar visual com canvas ou SVG
- painel executivo por área (Payroll, RH, DP, Finance, CS)

Rodapé padrão: Anderson Marinho | Igarapé Digital
