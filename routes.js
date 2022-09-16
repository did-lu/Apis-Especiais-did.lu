const { Router } = require("express");

const GCloudStorageController = require("./Controller/GCloudStorageController");
const OpenAiController = require("./Controller/OpenAiController");

const routes = Router();

routes.get("/health", function (req, res) {
  res.send("Ta vivinho");
});
routes.get("/storage", GCloudStorageController.store);
routes.post("/ai/marvin", OpenAiController.marvin);
routes.post("/ai/onceUponAi", OpenAiController.onceUponAi);
routes.post("/ai/keywords", OpenAiController.keywords);
//routes.post("/ai/dalle", OpenAiController.dalle);

module.exports = routes;
