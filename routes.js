const { Router } = require("express");

const GCloudStorageController = require("./Controller/GCloudStorageController");
const OpenAiController = require("./Controller/OpenAiController");
const AtenaFutebol = require("./Controller/Atenas/Futebol/Controller");
const AtenaCorrida = require("./Controller/Atenas/Corrida/Controller");

const routes = Router();

routes.get("/health", function (req, res) {
  res.send("Ta vivinho");
});
routes.get("/storage", GCloudStorageController.store);
routes.post("/ai/marvin", OpenAiController.marvin);
routes.post("/ai/onceUponAi", OpenAiController.onceUponAi);
routes.post("/ai/keywords", OpenAiController.keywords);
routes.post("/ai/dalle", OpenAiController.dalle);
routes.get("/atenas/futebol/player", AtenaFutebol.getPlayer);
routes.post("/atenas/futebol/game", AtenaFutebol.game);
routes.get("/atenas/futebol/team", AtenaFutebol.getTeam);
routes.post("/atenas/corrida/game", AtenaCorrida.game);
routes.get("/atenas/corrida/runner", AtenaCorrida.getRunner);

module.exports = routes;
