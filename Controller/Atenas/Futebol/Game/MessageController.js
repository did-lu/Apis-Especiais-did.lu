const message = {
  pass: [
    "{p1} toca a bola para {p2}",
    "{p1} recua com {p2}",
    "{p1} passa mais a frente para {p2}",
    "troca de passes entre {p1} e {p2}",
    "{p1} prefere o recuo com {p2}",
  ],
  goal: [
    "GOOOOL do {p1}",
    "É do {t}, gol de {p1}",
    "{p1} tomou um energético, recebeu asas e chutou para o gol!",
    "{p1} fez um jutsu e cabeceou para o gol!",
    "{p1} manda duplo carpado e marca de bicicleta!",
    "No ângulo e é gol de {p1}!",
  ],
  lost: [
    "{p2} rouba a bola de {p1}",
    "{p1} leva um caixote na cabeça da torcida e perde a bola.",
    "{p2} dá uma cambalhota e distrai o oponente, roubando a bola.",
    "{p1} leva um raio congelante de {p2} e perde a bola.",
  ],
  miss: [
    "{p1} chuta para fora",
    "{p2} defende o chute de {p1}",
    "O chute de {p1} bate na trave e não entra",
  ],
  fouled: ["{p2} maceta {p1} e é falta"],
  fHalf: [
    "Fim do primeiro tempo! O segundo tempo promete!",
    "Um vira-lata caramelo invade o campo e rouba a bola. Fim do primeiro tempo!",
  ],
  sHalf: ["Apita o juiz, fim de jogo"],
};

module.exports = {
  async generateMessage(event, p1, p2, team, time) {
    let selectedMessage;

    selectedMessage = message[event].random().toString();
    selectedMessage = selectedMessage.replace("{p1}", p1);
    selectedMessage = selectedMessage.replace("{p2}", p2);
    selectedMessage = selectedMessage.replace("{t}", team);

    return prepareMessage(selectedMessage, time, team);
  },
};

function prepareMessage(auxText, auxTime, auxTeam) {
  return { event: auxText, time: auxTime, team: auxTeam };
}
