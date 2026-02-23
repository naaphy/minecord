const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { exec } = require("../../Functions/rcon")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('message')
    .setDescription('Messages a connected player on the server.')
    .addStringOption(opt => opt.
        setName('target')
        .setDescription('The player to message')
        .setRequired(true)
    )
    .addStringOption(opt => opt
        .setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    ),
    async execute(interaction) {
        const {options} = interaction
        const target = options.getString('target')
        const message = options.getString('message')

        try {
            const response = exec(`tellraw ${target} ${message}`)
            await interaction.reply({content: `Message !\n\n${response}`, flags: MessageFlags.Ephemeral})
        } catch (err) {
            await interaction.reply({content: `An error occurred while trying to message the player !\n\n${err.message}`, flags: MessageFlags.Ephemeral})
        }
    }
}