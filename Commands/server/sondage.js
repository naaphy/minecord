const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { exec } = require('../../Functions/rcon')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sondage')
        .setDescription('Create a poll with the specified question and options.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new poll')
                .addStringOption(option => option.setName('question').setDescription('The question for the poll').setRequired(true))
                .addStringOption(option => option.setName('duration').setDescription('The duration of the poll in hours').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End an existing poll')
                .addStringOption(option => option.setName('poll_id').setDescription('The ID of the poll to end').setRequired(true))
        ),
    async execute(interaction) {
        const { options } = interaction
        const subcommand = options.getSubcommand()

        switch (subcommand) {
            case 'create':
                const question = options.getString('question')
                const duration = parseInt(options.getString('duration')) || 1

                await interaction.reply({
                    content: 'Poll created successfully.',
                    flags: MessageFlags.Ephemeral
                })

                await interaction.channel.send({
                    poll: {
                        question: { text: question },
                        duration: duration,
                        answers: [
                            { text: 'Yes' }, { text: 'No' }
                        ]
                    }
                })

                await exec(`tellraw @a ${JSON.stringify([
                    { text: `${interaction.user.username} created a poll on Discord !\n\n`, color: "gray" },
                    { text: `${question} (Duration: ${duration} hours)\n\n`, color: "aqua" },
                    { text: "[Yes] ", color: "green" },
                    { text: "[No]", color: "red" }
                ])}`);

                break

            case 'end':
                const pollId = options.getString('poll_id')
                const poll = await interaction.channel.messages.fetch(pollId)

                await interaction.reply({
                    content: `Poll with ID ${pollId} ended successfully.`,
                    flags: MessageFlags.Ephemeral
                })

                await exec(`tellraw @a ${JSON.stringify([
                    { text: `${interaction.user.username} ended a poll on Discord !\n\n`, color: "gray" },
                    { text: `${poll.poll.question.text}`, color: "aqua" },
                    { text: `[Yes: ${poll.poll.answers[0].votes}] `, color: "green" },
                    { text: `[No: ${poll.poll.answers[1].votes}]`, color: "red" }
                ])}`);

                break
            default:
                await interaction.reply('Unknown subcommand.')
        }
    }
}