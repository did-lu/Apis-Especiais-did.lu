const { Configuration, OpenAIApi } = require("openai");
const translatte = require("translatte");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function translate(text, fromLang, toLang) {
  let tText;

  await translatte(text, { from: fromLang, to: toLang })
    .then((res) => {
      tText = res.text;
    })
    .catch((err) => {
      console.error(err);
    });

  return tText;
}

module.exports = {
  async marvin(req, res) {
    const star_chat_log =
      "Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nMarv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nMarv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nMarv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nMarv: I'm not sure. I'll ask my friend Google.";

    let context = star_chat_log;

    let my_historic = req.body.my_historic || [];
    let bot_historic = req.body.bot_historic || [];
    let question = await translate(req.body.question, "pt", "en");
    console.log("Question ", question);
    let answer = "";

    if (my_historic && bot_historic) {
      let fString;
      for (let i = 0; i < my_historic.length; i++) {
        fString += `\nYou:${my_historic[i]}\nMarv:${bot_historic[i]}`;
      }
      context += fString;
    }
    //console.log("console.log(process.env) ", console.log(process.env));

    let prompt = `${context}\nYou: ${question}\nMarv:`;

    console.log("-------- prompt ------- ", prompt);

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });

    answer = response.data.choices[0].text.trim();
    let ptbrAnswer = await translate(answer, "en", "pt");

    console.log("Answer ", answer);

    my_historic.push(question);
    bot_historic.push(answer);

    let fJson = {
      my_historic: my_historic,
      bot_historic: bot_historic,
      answer: ptbrAnswer,
    };

    console.log("fJson ", fJson);

    res.json(fJson);
  },

  async onceUponAi(req, res) {
    let topic = await translate(req.body.topic, "pt", "en");
    let genre = await translate(req.body.genre, "pt", "en");

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Topic: Breakfast\nTwo-Sentence Horror Story: He always stops crying when I pour the milk on his cereal. I just have to remember not to let him see his face on the carton.\n    \nTopic: ${topic}\nFive-Sentence ${genre} Story:`,
      temperature: 0.8,
      max_tokens: 120,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });

    let answer = response.data.choices[0].text.trim();
    console.log("aswer ", answer);
    let ptbrAnswer = await translate(answer, "en", "pt");

    let fJson = {
      answer: ptbrAnswer,
    };
    res.json(fJson);
  },

  async keywords(req, res) {
    let text = await translate(req.body.text, "pt", "en");
    let temperature = await translate(req.body.temperature);

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Extract keywords from this text:\n\n${text}`,
      temperature: temperature,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.8,
      presence_penalty: 0.0,
    });

    let answer = response.data.choices[0].text.trim();
    console.log("aswer ", answer);
    let ptbrAnswer = await translate(answer, "en", "pt");

    let fJson = {
      answer: ptbrAnswer,
    };
    res.json(fJson);
  },

  /*async dalle() {
    const { Dalle } = await import("dalle-node");
    const dalle = new Dalle("sess-xxxxxxxxxxxxxxxxxxxxxxxxx"); // Bearer Token

    const generations = await dalle.generate("a cat driving a car");

    console.log(generations);
  },*/
};
