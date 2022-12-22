const FutebolController = require("./Futebol/Controller");
const CorridaController = require("./Corrida/Controller");

module.exports = {
  async futebol(req, res) {
    return FutebolController;
  },
  async corrida(req, res) {
    return CorridaController;
  },
};
