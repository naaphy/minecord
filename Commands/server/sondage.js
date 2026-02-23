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
                    { text: `${interaction.user.username} created a poll on Discord !\n\n`, color: "white" },
                    { text: `${question} (Duration: ${duration} hours)\n\n`, color: "dark_aqua" },
                    { text: "[Yes] ", color: "green" },
                    { text: "[No]", color: "red" }
                ])}`);

                break

            case 'end':
                const pollId = options.getString('poll_id')
                const pollMessage = await interaction.channel.messages.fetch(pollId, { force: true })

                await interaction.reply({
                    content: `Poll with ID ${pollId} ended successfully.`,
                    flags: MessageFlags.Ephemeral
                })

                const answers = pollMessage.poll.answers

                const yesVotes = answers[0]?.voteCount ?? answers[0]?.count ?? 0
                const noVotes  = answers[1]?.voteCount ?? answers[1]?.count ?? 0

                await exec(`tellraw @a ${JSON.stringify([
                    { text: `${interaction.user.username} ended a poll on Discord !\n\n`, color: "white" },
                    { text: `${pollMessage.poll.question.text}\n\n`, color: "dark_aqua" },
                    { text: `[Yes: ${yesVotes}] `, color: "green" },
                    { text: `[No: ${noVotes}]`, color: "red" }
                ])}`);

                break
            default:
                await interaction.reply('Unknown subcommand.')
        }
    }
}