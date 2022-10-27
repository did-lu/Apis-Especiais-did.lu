# Apis Especiais da did.lu

Conjunto de apis e serviços com funções uteis para diversos projetos da [did.lu](http://did.lu/)

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/did-lu/Apis-Especiais-did.lu
```

Entre no diretório do projeto

```bash
  cd Apis-Especiais-did.lu
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm start
```

#### ou

```bash
  nodemon server.js
```

# Serviços

- [Open Ia](##openia)
- [Once Upon Ai](##once-upon-ai)

## Documentação da API

- ### Verifica se o serviço esta rodando

```http
  GET /health
```

- ### Retorna a url onde o arquivo vai ser salvo

```http
  GET /storage
```

Sobe um arquivo do tipo `.zip` no storage do google

| Parâmetro    | Tipo     | Descrição                                                             |
| :----------- | :------- | :-------------------------------------------------------------------- |
| `file`       | `string` | **Obrigatório**. Url do arquivo tipo `.zip`                           |
| `callback`   | `string` | **Obrigatório**. Url que vai ser chamada após a finalização do update |
| `bucketName` | `string` | **Obrigatório**. Nome do bucket para ser salvo                        |

## OpenIA

- ### Conversar com o bot [MARVIN](https://beta.openai.com/examples/default-marv-sarcastic-chat)

```http
  POST /ai/marvin
```

_\*O historico de mensgens pode ser util para manter o bot com um contexto de conversas_

| Body           | Tipo       | Descrição                                                     |
| :------------- | :--------- | :------------------------------------------------------------ |
| `question`     | `string`   | **Obrigatório**. Pergunta a ser feita                         |
| `my_historic`  | `[string]` | **Opcional**. Array contendo as perguntas que ja foram feitas |
| `bot_historic` | `[string]` | **Opcional**. Array contendo as respostas que ja foram dadas  |

#### Resposta

```
{
	my_historic: [string],
	bot_historic: [string],
	answer: string
}
```

- ## Once Upon Ai [Gerador de Historia](https://beta.openai.com/examples/default-micro-horror)
  cria uma introdução para uma historia

```http
  POST /ai/onceUponAi
```

_\*O historico de mensgens pode ser util para manter o bot com um contexto de conversas_

| Body    | Tipo     | Descrição                                             |
| :------ | :------- | :---------------------------------------------------- |
| `topic` | `string` | **Obrigatório**. Topico para iniciar o texto _(Tema)_ |
| `genre` | `string` | **Obrigatório**. Genero da história                   |

#### Resposta

```
{
	answer: string
}
```

- ### Retorna as palavras chaves de um texto [Keywords](https://beta.openai.com/examples/default-keywords)

```http
  POST /ai/keywords
```

_\*O historico de mensgens pode ser util para manter o bot com um contexto de conversas_

| Body          | Tipo     | Descrição                                                 |
| :------------ | :------- | :-------------------------------------------------------- |
| `text`        | `string` | **Obrigatório**. Texto a ser extraido                     |
| `temperature` | `float`  | **Obrigatório**. "Criatividade" do bot (min:0.0, max:1.0) |

#### Resposta

```
{
	answer: string
}
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`OPENAI_API_KEY`

## Autores

- [@PedroGomes15](https://github.com/PedroGomes15)
