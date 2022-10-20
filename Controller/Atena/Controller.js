const Default = require("./PositionDefault");

var axios = require("axios");

module.exports = {
  async game(req, res) {
    let home = req.body.home;
    let visitor = req.body.visitor;
    console.log("home ", home);
    console.log("visitor ", visitor);

    res.json({
      game: [
        { event: "O jogo começou", time: 0, team: "" },
        { event: "Falta em claudinho", time: 360, team: "Malvados" },
        { event: "Escanteio para ser cobrado por fabinho", time: 1320, team: "Pingudinhos" },
        { event: "Cleber marca denovo", time: 1860, team: "Pingudinhos" },
        { event: "Fabinho diminui a diferença e marca", time: 2520, team: "Malvados" },
      ],
    });
  },

  async getPlayer(req, res) {
    res.json(await generatePlayer());
  },

  async getTeam(req, res) {
    res.json(await generateTeam());
  },
};

async function generatePlayer(position, forceNumber, excluedNumbers) {
  let player = {
    name: "",
    state: generateRandom(1, 5),
    number: forceNumber ? forceNumber : generateRandom(2, 11, excluedNumbers),
    position: position.name,
    status: {
      fis: position.fis + generateRandom(-10, 20),
      dri: position.dri + generateRandom(-10, 20),
      fin: position.fin + generateRandom(-10, 20),
      def: position.def + generateRandom(-10, 20),
      pas: position.pas + generateRandom(-10, 20),
    },
  };

  //player.number = generateRandom(excluedNumbers || []);
  player.name = await generateName();
  //console.log("player ", player);

  return player;
}

async function generateTeam() {
  let team = [];
  team.push(await generatePlayer(Default.Goleiro, 1, []));
  team.push(await generatePlayer(Default.Zagueiro, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Zagueiro, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Lateral, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Lateral, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Meio, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Meio, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Volante, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Volante, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Atacante, null, excludedNumbers(team)));
  team.push(await generatePlayer(Default.Atacante, null, excludedNumbers(team)));
  return team;
}

function excludedNumbers(team) {
  return team.map((p) => {
    return p.number;
  });
}

function generateRandom(min, max, excluded) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return excluded && excluded.length > 0 && excluded.includes(num)
    ? generateRandom(min, max, excluded)
    : num;
}

async function generateName() {
  let n = Math.floor(Math.random() * 101);
  let name = "";
  let auxNames;
  let auxNick;

  await axios
    .get("https://gerador-nomes.wolan.net/nomes/2")
    .then(async (names) => {
      auxNames = names.data;
      await axios.get("https://gerador-nomes.wolan.net/apelidos/1").then((nick) => {
        auxNick = nick.data;
      });
    })
    .catch((error) => {
      console.log("error ", error);
    });

  if (n < 25) {
    name = `${auxNames[0]} (${auxNick[0]}) ${auxNames[1]}`;
  } else if (n < 50) {
    name = `${auxNames[0]} ${auxNames[1]}`;
  } else if (n < 75) {
    name = `${auxNames[0]}`;
  } else {
    name = `${auxNick[0]}`;
  }

  return name;
}
