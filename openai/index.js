require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { exit } = require("process");
const fs = require("fs/promises");
const readline = require("readline");

const OUTPUT_FILE = "./results.txt";

const configuration = new Configuration({
  organization: "org-2MlJhE6e55NiA3JImHKf7ryP",
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

async function getPrompt(question) {
  const result = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    result.question(question, (answer) => {
      result.close();
      resolve(answer);
    });
  });
}

async function main() {
  const prompt = await getPrompt("Create completion for what?\n");
  const max_tokensStr = await getPrompt("How many tokens should we use?\n");
  const max_tokens = Number.parseInt(max_tokensStr);

  if (isNaN(max_tokens)) {
    return exit(0);
  }

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    max_tokens: max_tokens,
    n: 2,
  });
  for (let i = 0; i < response?.data?.choices.length ?? 0; i++) {
    console.log(response.data.choices[i].text);
  }

  const answer = await getPrompt("Save to file? (y/n)\n> ");
  if (typeof answer === "string" && answer.includes("y")) {
    let file = await fs.open(OUTPUT_FILE, "a+");
    file.write(prompt + "??");
    for (let i = 0; i < response?.data?.choices.length ?? 0; i++) {
        if (typeof response?.data?.choices[i]?.text === "string") {
            await file.write(response.data.choices[i].text);
        }
    }
    await file.close();
  }
}

main()
  .then(() => console.log("Finish"))
  .catch((err) => console.log("error:", err));
