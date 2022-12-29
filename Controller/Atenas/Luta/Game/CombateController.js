const Utils = require("../../Utils/Utils");

/*
"forca":"20",
"destreza":"30",
"resistencia":"34",
"velocidade":"68",
"dano_combo":"27",
"adrenalina":"19"
*/

module.exports = {
  async createSimpleCombate(atk, def, combo) {
    let damage = 0;
    //let random = Utils.generateRandom(0, 100);

    //(20 * (19/10))/34 -> (20 * 1.9)/34 -> 38/34 -> 1.11
    console.log(
      `Processando o ataque de ${atk.name}: \nForça-${atk.status.forca}\nDestreza-${atk.status.destreza}\nResistencia-${def.status.resistencia}`
    );
    let attack = (atk.status.forca * (atk.status.destreza / 10)) / def.status.resistencia;

    //(27/10) * 1 = 2.7
    let comboMultiplayer = Utils.clamp(
      (atk.status.dano_combo / 10) * Utils.clamp(combo - 1, 0, 5),
      1,
      1000
    );

    damage = (attack + comboMultiplayer) * 10;
    console.log(
      `Total -> Attack: ${attack}\nCombo Multiplayer: ${comboMultiplayer}\nDamage: ${damage}`
    );
    return Math.round(damage);
  },

  async createSpecialCombate(atk) {
    let damage = 0;

    let special = atk.special.filter((sp) => sp.cost < atk.status.adrenalina);
    let specialFinal = special.random();

    if (!specialFinal) {
      return false;
    }

    atk.status.adrenalina -= specialFinal.cost;
    damage = specialFinal.damage;

    return {
      status: atk.status,
      damage: Math.round(damage),
      name: specialFinal.name,
    };
  },
};
