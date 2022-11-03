let currentPlayer;
let ballPosition;
let currentTeam;

let homeFiltered;
let visitorFiltered;

let totalScore;

const MessageController = require("./MessageController");
const CombateController = require("./CombateController");
const Utils = require("./Utils");

module.exports = {
  async processGame(home, visitor) {
    Utils.setup();
    homeFiltered = filterTeam(home.team, home.name);
    visitorFiltered = filterTeam(visitor.team, visitor.name);

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
      let totalTime = Utils.generateRandom(45, 48);
      for (let i = 1; i < totalTime; i++) {
        let nextMove = await defineNextMove(i);
        if (nextMove) {
          nextMove.half = t;
          nextMove.score = totalScore;
          let auxString = JSON.stringify(nextMove);
          finalArray.push(JSON.parse(auxString));
        }
        if (Utils.generateRandom(0, 10) < 2) {
          i--;
        }
      }
      if (t == 1) {
        finalArray.push({
          event: "Fim do primeiro tempo",
          time: totalTime,
          team: null,
          half: 1,
          score: totalScore,
        });
      } else {
        finalArray.push({
          event: "Apita o juiz, fim de jogo",
          time: totalTime,
          team: null,
          score: totalScore,
          half: 2,
          score: totalScore,
        });
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
    Name: name,
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
  if (actionRandom < 25 + lucky) {
    return;
  } else if (actionRandom < 50 + lucky) {
    let passData = tryPass(true);
    return MessageController.generateMessage(
      "pass",
      passData.oldPlayer,
      passData.currentPlayer,
      currentTeam.Name,
      time
    );
  } else if (actionRandom < 70 + lucky) {
    let passData = await tryPass(false);
    if (passData.gol == true) {
      let goleiro = getRandomPlayer(getAnotherTeam(), "Goleiro");
      let result = await CombateController.createCombate(currentPlayer, goleiro);
      let msg = "";
      if (result == true) {
        msg = MessageController.generateMessage(
          "goal",
          passData.currentPlayer,
          passData.oldPlayer,
          currentTeam.Name,
          time
        );
        await newGoal();
      } else {
        msg = await MessageController.generateMessage(
          "miss",
          passData.currentPlayer,
          goleiro.name,
          currentTeam.Name,
          time
        );
        lostBall();
      }
      return msg;
    } else {
      return await MessageController.generateMessage(
        "pass",
        passData.oldPlayer,
        passData.currentPlayer,
        currentTeam.Name,
        time
      );
    }
  } else {
    let passData = lostBall();

    return await MessageController.generateMessage(
      "lost",
      passData.oldPlayer,
      passData.currentPlayer,
      currentTeam.Name,
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

  return { oldPlayer: oldPlayer.name, currentPlayer: currentPlayer.name, gol: false };
}

async function newGoal() {
  if (currentTeam.Name == homeFiltered.Name) {
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
  if (currentTeam.Name == homeFiltered.Name) {
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

function defineLucky() {
  if (currentPlayer.absolutPosition == ballPosition) {
    return 1.5;
  }
  return 1;
}
