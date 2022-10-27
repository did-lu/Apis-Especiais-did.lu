const Utils = require("./Utils");

module.exports = {
  async createCombate(atkP, defP) {
    let result = atkP.status.fin - defP.status.def;
    let random = Utils.generateRandom(0, 100);
    let finalValue = result + random;
    if (finalValue > 50) {
      return true;
    } else return false;
  },
};
