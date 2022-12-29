const FutebolController = require("./Futebol/Controller");
const CorridaController = require("./Corrida/Controller");
const LutaController = require("./Luta/Controller");

module.exports = {
  async futebol(req, res) {
    return FutebolController;
  },
  async corrida(req, res) {
    return CorridaController;
  },
  async luta(req, res) {
    return LutaController;
  },
};
