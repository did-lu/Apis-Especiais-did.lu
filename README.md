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

- [Open Ia](#openia)
- [Once Upon Ai](#once-upon-ai)
- [Atena](#atena)

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

## Once Upon Ai [Gerador de Historia](https://beta.openai.com/examples/default-micro-horror)

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

## Atena

responsavel pela parte de esportes da did.lu

- ### Cria um jogador aleatorio

```http
  GET /atena/player
```

#### Resposta

```
{
	name: "Zoey Elisete", //nome aleatorio
	state: 1, //(1,5) define o estado atual do jogador
	number: 10, //numero do jogador
	position: "meio", //posição que ele joga
	status: {
		"fis": 99, //(1,99) fisico
		"dri": 99, //(1,99) drible
		"fin": 99, //(1,99) finalização
		"def": 99, //(1,99) defesa
		"pas": 99 //(1,99) passe
	}
}
```

- ### Cria um time completo

```http
  GET /atena/team
```

#### Resposta

```
[
  {
    player:player
  }
]
```

- ### Processa um jogo

```http
  POST /atena/game
```

| Body           | Tipo       | Descrição                                    |
| :------------- | :--------- | :------------------------------------------- |
| `home`         | `json`     | **Obrigatório**. time da casa                |
| `home.name`    | `string`   | **Obrigatório**. nome do time da casa        |
| `home.team`    | `[player]` | **Obrigatório**. lista de players de um time |
| `visitor`      | `json`     | **Obrigatório**. time visitante              |
| `visitor.name` | `string`   | **Obrigatório**. nome do time visitante      |
| `visitor.team` | `[player]` | **Obrigatório**. lista de players de um time |

#### Resposta

```
{
	"game": [
		{
			"event": "Isabelly Rubi prefere o recuo com Maksim Youssef",//Descrição de um lançe
			"time": 1, //tempo de jogo
			"team": "malvado", //time
			"half": 1, //primeiro tempo do jogo
			"score": { //score do jogo no momento atual
				"home": {
					"name": "malvado", //nome do time
					"score": 0 //gols
				},
				"visitor": {
					"name": "pingadão", //nome do time
					"score": 0 //gols
				}
			}
		}
  ]
}
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`OPENAI_API_KEY`

## Autores

- [@PedroGomes15](https://github.com/PedroGomes15)
