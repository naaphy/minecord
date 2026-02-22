
const {Rcon} = require("rcon-client");

const testRcon = async () => {
    console.log("🚀 TEST RCON EN COURS...");
    try {
        const rcon = await Rcon.connect({
            host: "188.155.72.30",
            port: 25671,
            password: "abc12345"
        });
        console.log("✅ CONNECTÉ ! Envoi du message...");
        await rcon.send("say TEST DEPUIS LE BOT");
        await rcon.end();
        console.log("👋 DÉCONNECTÉ PROPREMENT");
    } catch (err) {
        console.error("❌ LE TEST A ÉCHOUÉ :", err.message);
    }
};

testRcon();