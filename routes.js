const { Router } = require("express");

const GCloudStorageController = require("./Controller/GCloudStorageController");
const OpenAiController = require("./Controller/OpenAiController");
const FutebolController = require("./Controller/Atenas/Futebol/Controller");
const LutaController = require("./Controller/Atenas/Luta/Controller");

const routes = Router();

routes.get("/health", function (req, res) {
  res.send("Ta vivinho");
});
//routes.get("/storage", GCloudStorageController.store);
routes.post("/ai/marvin", OpenAiController.marvin);
routes.post("/ai/onceUponAi", OpenAiController.onceUponAi);
routes.post("/ai/keywords", OpenAiController.keywords);
routes.post("/ai/dalle", OpenAiController.dalle);
routes.get("/atenas/futebol/player", FutebolController.getPlayer);
routes.post("/atenas/futebol/game", FutebolController.game);
routes.get("/atenas/futebol/team", FutebolController.getTeam);
routes.post("/atenas/luta/game", LutaController.game);

module.exports = routes;
