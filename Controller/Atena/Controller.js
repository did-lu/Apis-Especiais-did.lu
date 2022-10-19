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
};
