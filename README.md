# Links · Paróquia São Judas Tadeu (Pederneiras/SP)

Página de links para a bio do Instagram, em `https://saojudaspederneiras.com.br`. Site estático (sem build, sem servidor), mesma identidade da Agenda de Missas.

## Onde editar
Tudo está em `data/links.json`: link da agenda, número do WhatsApp, as **mensagens-modelo** (`whatsapp.mensagens`, uma por assunto), o Terço dos Homens (`eventos`), atendimento, mapa e Pix. Não precisa mexer em HTML.

- Para trocar o link da agenda quando o domínio estiver ativo: `agenda.url` → `https://agenda.saojudaspederneiras.com.br/`.
- Cada mensagem-modelo abre o WhatsApp com o texto já escrito; `\n` é quebra de linha.
- Novo evento semanal: copie o bloco de `eventos` (`diaSemana`: 0 = domingo … 6 = sábado). O botão baixa um `.ics` que se repete toda semana.

## QR Code do Pix
O QR Code é gerado no próprio navegador a partir de `pix` em `data/links.json` (`chave`, `nome`, `cidade`), no padrão do Banco Central (Pix estático, sem valor). Para trocar a chave, edite só o JSON. `nome` (até 25 caracteres) e `cidade` (até 15) saem sem acento e em maiúsculas. O aplicativo do banco mostra o nome verdadeiro do favorecido da chave. A biblioteca está em `vendor/qrcode.js` (qrcode-generator, MIT).

## Testar localmente
```bash
python3 -m http.server
```
e abra http://localhost:8000.

## Publicar (GitHub Pages)
Repositório público, Settings → Pages → branch `main`, pasta `/ (root)`. Enquanto o DNS do domínio não estiver pronto, o arquivo está como `CNAME.pendente`; quando a raiz do domínio já apontar para o GitHub, renomeie para `CNAME` (e configure o domínio em Settings → Pages). No Registro.br, a raiz do domínio aponta para os endereços do GitHub Pages (registros A e AAAA, conforme a documentação do GitHub).

## Cuidados
- Nunca colocar senha, chave de API ou dados de pessoas neste repositório (ele é público).
- A fonte Cormorant Garamond (licença OFL) está em `fonts/`.
