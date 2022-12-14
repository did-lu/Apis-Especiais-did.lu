const MessageController = require("./MessageController");
const CombateController = require("./CombateController");
const EventController = require("./EventController");
const Utils = require("../../Utils/Utils");

let currentPlayer;
let ballPosition;
let currentTeam;

let homeFiltered;
let visitorFiltered;

let totalScore;
let gameStatus = {};

let totalEvents = {};

module.exports = {
  async processGame(home, visitor) {
    Utils.setup();

    homeFiltered = filterTeam(home.team, home.name);
    homeFiltered.whereas = "casa";
    visitorFiltered = filterTeam(visitor.team, visitor.name);
    visitorFiltered.whereas = "visitante";

    gameStatus.casa = {
      name: home.name,
      attemptsToGoal: [],
      passes: [],
      cards: [],
      fouls: [],
      possesion: 0,
    };
    gameStatus.visitante = {
      name: visitor.name,
      attemptsToGoal: [],
      passes: [],
      cards: [],
      fouls: [],
      possesion: 0,
    };

    totalEvents[home.name] = 0;
    totalEvents[visitor.name] = 0;

    currentPlayer = getRandomPlayer(homeFiltered, "Ataque");
    currentTeam = homeFiltered;
    totalScore = {
      home: {
        name: home.name,
        score: 0,
      },
      visitor: {
        name: visitor.name,
        score: 0,
      },
    };
    ballPosition = "Meio";

    let finalArray = [];

    for (let t = 1; t < 3; t++) {
      let totalTime = Utils.generateRandom(45, 50);
      //let totalTime = Utils.generateRandom(2, 5);

      for (let i = 1; i < totalTime; i++) {
        let nextMove = await defineNextMove(i);
        if (nextMove) {
          nextMove.half = t;
          nextMove.score = totalScore;
          //nextMove.gameStatus = gameStatus;
          let auxString = JSON.stringify(nextMove);
          finalArray.push(JSON.parse(auxString));
        }
        if (Utils.generateRandom(0, 10) < 2) {
          i--;
        }
      }

      let totalEventsSum = totalEvents[home.name] + totalEvents[visitor.name];
      let possesion = {};
      possesion[home.name] = `${Math.round((totalEvents[home.name] / totalEventsSum) * 100)}%`;
      possesion[visitor.name] = `${Math.round(
        (totalEvents[visitor.name] / totalEventsSum) * 100
      )}%`;

      console.log("gameStatus: ", gameStatus);

      if (t == 1) {
        let fHalf = await MessageController.generateMessage("fHalf", null, null, null, totalTime);
        fHalf.half = 1;
        fHalf.score = totalScore;
        finalArray.push(fHalf);
      } else {
        let sHalf = await MessageController.generateMessage("sHalf", null, null, null, totalTime);
        sHalf.half = 1;
        sHalf.score = totalScore;
        finalArray.push(sHalf);
      }
    }

    return finalArray;
  },
};

function filterTeam(team, name) {
  let fTeam = {
    Goleiro: team.filter((n) => n.position == "Goleiro"),
    Defesa: team.filter((n) => n.position == "Zagueiro" || n.position == "Lateral"),
    Meio: team.filter((n) => n.position == "Meio" || n.position == "Volante"),
    Ataque: team.filter((n) => n.position == "Atacante"),
    name: name,
  };

  fTeam.Goleiro.forEach((element) => {
    element.absolutPosition = "Goleiro";
  });
  fTeam.Defesa.forEach((element) => {
    element.absolutPosition = "Defesa";
  });
  fTeam.Meio.forEach((element) => {
    element.absolutPosition = "Meio";
  });
  fTeam.Ataque.forEach((element) => {
    element.absolutPosition = "Ataque";
  });

  return fTeam;
}

function getRandomPlayer(team, position) {
  let filteredTeam = team[position].filter((element) => element != currentPlayer);

  if (filteredTeam.length > 0) {
    return filteredTeam.random();
  } else {
    return currentPlayer;
  }
}

async function defineNextMove(time) {
  let lucky = 10 * defineLucky();
  let actionRandom = Utils.generateRandom(0, 100);

  totalEvents[currentTeam.name]++;

  if (actionRandom < 20 + lucky) {
    //A??????o solta
    return;
  } else if (actionRandom < 40 + lucky) {
    //Tentando o passe na mesma linha
    let passData = tryPass(true);
    return MessageController.generateMessage(
      "pass",
      passData.oldPlayer,
      passData.currentPlayer,
      currentTeam.name,
      time
    );
  } else if (actionRandom < 65 + lucky) {
    //Tentando o passe para proxima linha
    let passData = await tryPass(false);
    if (passData.gol == true) {
      //Chute ao gol
      let goleiro = getRandomPlayer(getAnotherTeam(), "Goleiro");
      let result = await CombateController.createCombate(currentPlayer, goleiro);
      let msg = "";
      if (result == true) {
        msg = MessageController.generateMessage(
          "goal",
          passData.currentPlayer,
          passData.oldPlayer,
          currentTeam.name,
          time
        );
        await newGoal();
      } else {
        msg = await MessageController.generateMessage(
          "miss",
          passData.currentPlayer,
          goleiro.name,
          currentTeam.name,
          time
        );
        lostBall();
      }
      return msg;
    } else {
      //S??? passa
      return await MessageController.generateMessage(
        "pass",
        passData.oldPlayer,
        passData.currentPlayer,
        currentTeam.name,
        time
      );
    }
  } else if (actionRandom < 90) {
    let passData = lostBall();

    return await MessageController.generateMessage(
      "lost",
      passData.oldPlayer,
      passData.currentPlayer,
      currentTeam.name,
      time
    );
  } else {
    let passData = fouled(time);
    return await MessageController.generateMessage(
      "fouled",
      passData.oldPlayer,
      passData.currentPlayer,
      currentTeam.name,
      time
    );
  }
}

function tryPass(inSameLine) {
  let oldPlayer = currentPlayer;
  if (inSameLine) {
    let auxPlayer = getRandomPlayer(currentTeam, currentPlayer.absolutPosition);
    if (auxPlayer) currentPlayer = auxPlayer;
  } else {
    let next = getNextPosition(ballPosition, 1);
    if (next == "Gol") {
      return { oldPlayer: null, currentPlayer: currentPlayer.name, gol: true };
    }

    ballPosition = next;
    currentPlayer = getRandomPlayer(currentTeam, next);
  }
  return { oldPlayer: oldPlayer.name, currentPlayer: currentPlayer.name, gol: false };
}

function lostBall() {
  currentTeam = getAnotherTeam();
  let oldPlayer = currentPlayer;
  ballPosition = getInvertedBallPosition();
  currentPlayer = getRandomPlayer(currentTeam, ballPosition);

  return {
    oldPlayer: oldPlayer.name,
    currentPlayer: currentPlayer.name,
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
    if (currentPlayer.card && currentPlayer.card == "yellow") {
      auxTeam.card = "red";
      eventType = "expelled";
      auxTeam = removePlayerFromTeam(auxTeam, playerAux);
    }
  }

  /*if (auxTeam.card) {
    gameStatus
      .find((el) => el.name == auxTeam.name)
      .fouls.push({
        card: auxTeam.card,
        time: time,
      });
  }*/

  return {
    oldPlayer: currentPlayer.name,
    currentPlayer: playerAux.name,
    gol: false,
    eventType: "eventType",
  };
}

async function newGoal() {
  if (currentTeam.name == homeFiltered.name) {
    totalScore.home.score++;
  } else {
    totalScore.visitor.score++;
  }

  currentTeam = getAnotherTeam();
  currentPlayer = getRandomPlayer(currentTeam, "Ataque");
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
  if (currentTeam.name == homeFiltered.name) {
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
  if (currentPlayer.absolutPosition == ballPosition) {
    return 1.5;
  }
  return 1;
}
