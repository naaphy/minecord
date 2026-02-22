const { Events } = require('discord.js')
require('colors')

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName)

            if (!command) interaction.reply({content: 'Commande non trouvée.', ephemeral: true})

            command.execute(interaction, client)
        }
    }
}