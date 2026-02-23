const { Events, MessageFlags } = require('discord.js')
const pollStore = require('../Functions/pollStore')

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isButton()) {
            const poll = pollStore.getPoll(interaction.message.id)
            if (!poll) return

            const userId = interaction.user.id

            if (interaction.customId.endsWith('_1')) {
                poll.no.delete(userId)
                poll.yes.add(userId)
            } else if (interaction.customId.endsWith('_2')) {
                poll.yes.delete(userId)
                poll.no.add(userId)
            }

            await interaction.reply({
                content: 'Vote registered!',
                flags: MessageFlags.Ephemeral
            })

            // const container = interaction.message.components[0]

            // container.components[1].components[1]
            // .setLabel(`Vote (${poll.yes.size})`)

            // container.components[2].components[1]
            // .setLabel(`Vote (${poll.no.size})`)

            // await interaction.message.edit({
            //     components: [container]
            // })
        }
    }
}