module.exports = {
  setup() {
    Array.prototype.random = function () {
      return this[Math.floor(Math.random() * this.length)];
    };
  },

  generateRandom(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  },
};
