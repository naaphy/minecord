const { ContainerBuilder, SlashCommandBuilder, MessageFlags } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('pong (jus a mf test cmd)'),
    async execute(interaction) {
        await interaction.reply({
            components: [
                new ContainerBuilder()
            .addTextDisplayComponents(
                t => t.setContent('Pong !')
            )
            ],
            flags: MessageFlags.IsComponentsV2
        })
    }
}