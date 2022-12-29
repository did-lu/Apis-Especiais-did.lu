const MessageController = require("./MessageController");
const CombateController = require("./CombateController");
const { setup, generateRandom } = require("../../Utils/Utils");

let player_1, player_2;

let p1_base, p2_base;
let roundController = {
  p1_wins: 0,
  p2_wins: 0,
};

let combo = {
  player: 1,
  count: 0,
};

module.exports = {
  async processGame(p1, p2) {
    setup();

    p1_base = p1;
    p2_base = p2;

    let finalArray = [];

    for (let round = 1; round < 4; round++) {
      player_1 = JSON.parse(JSON.stringify(p1_base));
      player_2 = JSON.parse(JSON.stringify(p2_base));
      let turn = {};
      while (player_1.hp > 0 && player_2.hp > 0) {
        console.log("\n<<<<------------------------------->>>>>\n");
        turn = await nextMove();
        turn.hp = {
          player_1: player_1.hp,
          player_2: player_2.hp,
        };
        finalArray.push(turn);
      }
      if (player_1.hp <= 0) {
        roundController.p2_wins++;
        turn.event = `${player_1.name} foi derrotado`;
        turn.hp = {
          player_1: player_1.hp,
          player_2: player_2.hp,
        };
        turn.event_type = "end round";
      } else if (player_2.hp <= 0) {
        roundController.p1_wins++;
        turn.event = `${player_2.name} foi derrotado`;
        turn.event_type = "end round";
      }
      if (roundController.p1_wins >= 2) {
        turn.event = `${player_1.name} foi o vitorioso`;
        turn.event_type = "end match";
        round = 5;
      } else if (roundController.p2_wins >= 2) {
        turn.event = `${player_2.name} foi o vitorioso`;
        turn.event_type = "end match";
        round = 5;
      }

      finalArray.push(turn);
    }

    return finalArray;
  },
};

async function nextMove() {
  let playerNumber = generateRandom(1, 2);
  let action = {
    player: "player_" + playerNumber,
    action_type: "",
  };
  let currentPlayer;

  if (playerNumber == 1) {
    currentPlayer = player_1;
  } else if (playerNumber == 2) {
    currentPlayer = player_2;
  }

  let random_action = generateRandom(0, 100);

  let another = another_player(playerNumber);

  if (random_action < 50) {
    if ((combo.player = playerNumber)) {
      combo.count++;
    } else {
      combo.player = playerNumber;
      combo.count = 0;
    }
    return await attack_success(currentPlayer, another, combo);
  } else if (random_action < 80) {
    combo.count = 0;
    return await special(currentPlayer, another, combo);
  } else {
    combo.count = 0;
    return await attack_fail(currentPlayer, another);
  }
}

async function attack_success(currentPlayer, another, combo) {
  let damage = await CombateController.createSimpleCombate(currentPlayer, another, combo.count);

  another.status.adrenalina += damage;
  another.hp -= damage;

  return {
    event_type: "simple_combat",
    event: `${currentPlayer.name} acertou uma porrada em ${another.name} (${damage} dmg)`,
  };
}

async function special(currentPlayer, another, combo) {
  let special = await CombateController.createSpecialCombate(currentPlayer, another);

  if (!special) {
    return attack_success(currentPlayer, another, combo);
  }

  another.hp -= special.damage;
  return {
    event_type: "special_combat",
    event: `${currentPlayer.name} acertou um ${special.name} (${special.damage} dmg)`,
  };
}

function attack_fail(currentPlayer, another) {
  return {
    event_type: "block_combat",
    event: `${another.name} bloqueou o golpe de ${currentPlayer.name}`,
  };
}

function another_player(playerNumber) {
  if (playerNumber == 2) {
    return player_1;
  } else if (playerNumber == 1) {
    return player_2;
  }
}
