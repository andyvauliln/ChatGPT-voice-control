const Client = require("./src/fakeyou/Client");
const fy = new Client({
    // token: 'eyJhbGciOiJIUzI1NiJ9.eyJjb29raWVfdmVyc2lvbiI6IjIiLCJzZXNzaW9uX3Rva2VuIjoiU0VTU0lPTjo3d3ExcmUzdnY4cjduOTM0Z2Zmd3FiOXgiLCJ1c2VyX3Rva2VuIjoiVToyRVlRS1dBSzBQTVk0In0.VmCMwM1DdK5M0Kwt7yLo6PkOmA3x',
    usernameOrEmail: "promtwizard@gmail.com",
    password: "7895123avA!",
});

async function start() {
    await fy.start();
    //let models = await fy.searchModel('Rick Sanchez (Version 2.0)');//required

    let result = await fy.makeTTS(
        "TM:ebgxj0j4fvzp",
        "Heh, conference, huh? Remember, Morty, when the person at the podium has less hair, they are usually full of more bullshit."
    );
    console.log(result.audioURL(), "result.audioURL()");

    result.audioURL();
}

start();
