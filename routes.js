const { Router } = require("express");

const GCloudStorageController = require("./Controller/GCloudStorageController");
const OpenAiController = require("./Controller/OpenAiController");
const Atena = require("./Controller/Atena/Controller");

const routes = Router();

routes.get("/health", function (req, res) {
  res.send("Ta vivinho");
});
routes.get("/storage", GCloudStorageController.store);
routes.post("/ai/marvin", OpenAiController.marvin);
routes.post("/ai/onceUponAi", OpenAiController.onceUponAi);
routes.post("/ai/keywords", OpenAiController.keywords);
routes.post("/ai/dalle", OpenAiController.dalle);
routes.post("/atena/game", Atena.game);
routes.get("/atena/player", Atena.getPlayer);
routes.get("/atena/team", Atena.getTeam);

module.exports = routes;
