// import Client from "fakeyou.ts";
//const Client = require("./fackeyou2")
import Client from "./fackeyou2/index.js";
const client = new Client();

await client.login({
    username: "promtwizard",
    password: "7895123avA!",
});

async function start() {
    const model = await client.fetchTtsModelByToken("TM:ebgxj0j4fvzp");
    const inference = await model?.infer(
        "Heh, conference, huh? Remember, Morty, when the person at the podium has less hair, they are usually full of more bullshit.!"
    );

    console.log("", inference.resourceUrl);

    // let result = await fy.makeTTS(
    //     "TM:ebgxj0j4fvzp",
    //     "Heh, conference, huh? Remember, Morty, when the person at the podium has less hair, they are usually full of more bullshit."
    // );
    // console.log(result.audioURL(), "result.audioURL()");

    // result.audioURL();
}

start();
