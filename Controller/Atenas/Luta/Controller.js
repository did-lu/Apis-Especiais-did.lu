const GameController = require("./Game/GameController");
const Utils = require("../Utils/Utils");

var axios = require("axios");

module.exports = {
  async game(req, res) {
    Utils.setup();
    let player_1 = req.body.player_1;
    let player_2 = req.body.player_2;

    res.json({ game: await GameController.processGame(player_1, player_2) });
  },
};
