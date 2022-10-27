const message = {
  pass: [
    "{p1} toca a bola para {p2}",
    "{p1} recua com {p2}",
    "{p1} passa mais a frente para {p2}",
    "troca de passes entre {p1} e {p2}",
    "{p1} prefere o recuo com {p2}",
  ],
  goal: ["GOOOOL do {p1}", "É do {t}, gol de {p1}"],
  goalWinning: ["{p1} aumenta a diferença para o {t}"],
  goalLosing: ["{p1} diminui a diferença para o {t}"],
  lost: ["{p2} rouba a bola de {p1}", "{p2} rouba a bola"],
  miss: [
    "{p1} chuta para fora",
    "{p2} defende o chute de {p1}",
    "O chute de {p1} bate na trave e não entra",
  ],
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
