const MessageController = require("./MessageController");
const CombateController = require("./CombateController");
const Utils = require("../../Utils/Utils");
const GameController = require("./GameController");

let totalEvents = {
  casa: {},
  visitante: {},
};

module.exports = {
  async defineNextMove(time) {
    let lucky = 10 * defineLucky();
    gol;
    let actionRandom = Utils.generateRandom(0, 100);

    totalEvents[GameController.currentTeam.name]++;

    if (actionRandom < 20 + lucky) {
      //Ação solta
      return;
    } else if (actionRandom < 40 + lucky) {
      //Tentando o passe na mesma linha
      let passData = tryPass(true);
      return MessageController.generateMessage(
        "pass",
        passData.oldPlayer,
        passData.currentPlayer,
        GameController.currentTeam.name,
        time
      );
    } else if (actionRandom < 65 + lucky) {
      //Tentando o passe para proxima linha
      let passData = await tryPass(false);
      if (passData.gol == true) {
        //Chute ao gol
        let goleiro = getRandomPlayer(getAnotherTeam(), "Goleiro");
        let result = await CombateController.createCombate(GameController.currentPlayer, goleiro);
        let msg = "";
        if (result == true) {
          msg = MessageController.generateMessage(
            "goal",
            passData.currentPlayer,
            passData.oldPlayer,
            GameController.currentTeam.name,
            time
          );
          await newGoal();
        } else {
          msg = await MessageController.generateMessage(
            "miss",
            passData.currentPlayer,
            goleiro.name,
            GameController.currentTeam.name,
            time
          );
          lostBall();
        }
        return msg;
      } else {
        //Só passa
        return await MessageController.generateMessage(
          "pass",
          passData.oldPlayer,
          passData.currentPlayer,
          GameController.currentTeam.name,
          time
        );
      }
    } else if (actionRandom < 90) {
      let passData = lostBall();

      return await MessageController.generateMessage(
        "lost",
        passData.oldPlayer,
        passData.currentPlayer,
        GameController.currentTeam.name,
        time
      );
    } else {
      let passData = fouled(time);
      return await MessageController.generateMessage(
        "fouled",
        passData.oldPlayer,
        passData.currentPlayer,
        GameController.currentTeam.name,
        time
      );
    }
  },

  endGame() {
    let totalEventsSum = totalEvents["casa"] + totalEvents["visitante"];
    gameStatus.casa.possesion = `${Math.round((totalEvents["casa"] / totalEventsSum) * 100)}%`;
    gameStatus.visitante.possesion = `${Math.round(
      (totalEvents["visitante"] / totalEventsSum) * 100
    )}%`;
  },
};

function getRandomPlayer(team, position) {
  let filteredTeam = team[position].filter((element) => element != GameController.currentPlayer);

  if (filteredTeam.length > 0) {
    return filteredTeam.random();
  } else {
    return GameController.currentPlayer;
  }
}

function tryPass(inSameLine) {
  let oldPlayer = GameController.currentPlayer;
  if (inSameLine) {
    let auxPlayer = getRandomPlayer(
      GameController.currentTeam,
      GameController.currentPlayer.absolutPosition
    );
    if (auxPlayer) GameController.currentPlayer = auxPlayer;
  } else {
    let next = getNextPosition(ballPosition, 1);
    if (next == "Gol") {
      return { oldPlayer: null, currentPlayer: GameController.currentPlayer.name, gol: true };
    }

    ballPosition = next;
    GameController.currentPlayer = getRandomPlayer(GameController.currentTeam, next);
  }
  return {
    oldPlayer: oldPlayer.name,
    currentPlayer: GameController.currentPlayer.name,
    gol: false,
  };
}

function lostBall() {
  GameController.currentTeam = getAnotherTeam();
  let oldPlayer = GameController.currentPlayer;
  ballPosition = getInvertedBallPosition();
  GameController.currentPlayer = getRandomPlayer(GameController.currentTeam, ballPosition);

  return {
    oldPlayer: oldPlayer.name,
    currentPlayer: GameController.currentPlayer.name,
    gol: false,
    eventType: "lost ball",
  };
}

function fouled(time) {
  let auxTeam = getAnotherTeam();
  let playerAux = getRandomPlayer(auxTeam, ballPosition);
  let eventType = "fouled";
  let randomAux = Utils.generateRandom(0, 100);

  if (randomAux < 5) {
    eventType = "expelled";
    auxTeam.card = "red";
    auxTeam = removePlayerFromTeam(auxTeam, playerAux);
  } else if (randomAux < 30) {
    eventType = "yellow_card";
    auxTeam.card = "yellow";
    if (GameController.currentPlayer.card && GameController.currentPlayer.card == "yellow") {
      auxTeam.card = "red";
      eventType = "expelled";
      auxTeam = removePlayerFromTeam(auxTeam, playerAux);
    }
  }

  if (auxTeam.card) {
    gameStatus
      .find((el) => el.name == auxTeam.name)
      .fouls.push({
        card: auxTeam.card,
        time: time,
      });
  }

  return {
    oldPlayer: GameController.currentPlayer.name,
    currentPlayer: playerAux.name,
    gol: false,
    eventType: "eventType",
  };
}

async function newGoal() {
  if (GameController.currentTeam.name == homeFiltered.name) {
    totalScore.home.score++;
  } else {
    totalScore.visitor.score++;
  }

  GameController.currentTeam = getAnotherTeam();
  GameController.currentPlayer = getRandomPlayer(GameController.currentTeam, "Ataque");
  ballPosition = "Meio";
}

function getNextPosition(currentPosition, nextPosition) {
  if (currentPosition == "Goleiro") {
    if (nextPosition > 0) {
      return "Zagueiro";
    } else return "Gol";
  }
  if (currentPosition == "Defesa") {
    if (nextPosition > 0) {
      return "Meio";
    } else return "Goleiro";
  }
  if (currentPosition == "Meio") {
    if (nextPosition > 0) {
      return "Ataque";
    } else return "Defesa";
  }
  if (currentPosition == "Ataque") {
    if (nextPosition > 0) {
      return "Gol";
    } else return "Meio";
  }
}

function getAnotherTeam() {
  if (GameController.currentTeam.name == homeFiltered.name) {
    return visitorFiltered;
  } else {
    return homeFiltered;
  }
}

function getInvertedBallPosition() {
  if (ballPosition == "Ataque") return "Defesa";
  if (ballPosition == "Defesa") return "Defesa";
  return ballPosition;
}

function removePlayerFromTeam(team, player) {
  team[player.absolutPosition] = team[player.absolutPosition].filter((el) => el != player);
  return team;
}

function defineLucky() {
  if (GameController.currentPlayer.absolutPosition == ballPosition) {
    return 1.5;
  }
  return 1;
}
