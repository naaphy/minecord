const { SlashCommandBuilder } = require("discord.js");
const { Rcon } = require("rcon-client");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('Replies with the list of connected players on the server.'),
    async execute(interaction) {
        try {
            const rcon = new Rcon({
                host: process.env.HOST,
                port: parseInt(process.env.PORT),
                password: process.env.PASSWORD
            })

            await rcon.connect();
            const response = await rcon.send('list');
            await interaction.reply(response);
            rcon.end()
        } catch (error) {
            console.log(error);
        }
    }
}