const { Events } = require('discord.js')
const pollStore = require('../Functions/pollStore')

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isButton()) {
            const poll = pollStore.getPoll(interaction.message.id)
            if (!poll) return

            const userId = interaction.user.id

            if (interaction.customId === `poll_${interaction.message.id}_1`) {
                poll.no.delete(userId)
                poll.yes.add(userId)
            } else if (interaction.customId === `poll_${interaction.message.id}_2`) {
                poll.yes.delete(userId)
                poll.no.add(userId)
            }
        }
    }
}