const { SlashCommandBuilder, MessageFlags, ContainerBuilder } = require('discord.js')
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
                .addStringOption(option => option.setName('answer1').setDescription('The first answer for the poll').setRequired(false))
                .addStringOption(option => option.setName('answer2').setDescription('The second answer for the poll').setRequired(false))
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
                const answer1 = options.getString('answer1') || 'Yes'
                const answer2 = options.getString('answer2') || 'No'

                await interaction.reply({
                    content: 'Poll created successfully.',
                    flags: MessageFlags.Ephemeral
                })

                const container = new ContainerBuilder()
                .addTextDisplayComponents(
                    text => text.setContent(question)
                )
                .addSeparatorComponents(sep => sep)
                .addSectionComponents(section => section
                    .addTextDisplayComponents(text => text.setContent(answer1))
                    .setButtonAccessory(button => button
                        .setCustomId(`poll_${interaction.id}_1`).setLabel('Vote').setStyle('Success')
                    )
                )
                .addSectionComponents(section => section
                    .addTextDisplayComponents(text => text.setContent(answer2))
                    .setButtonAccessory(button => button
                        .setCustomId(`poll_${interaction.id}_2`).setLabel('Vote').setStyle('Danger')
                    )
                )

                await interaction.channel.send({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                })

                await exec(`tellraw @a ${JSON.stringify([
                    { text: `${interaction.user.username} created a poll on Discord !\n\n`, color: "white" },
                    { text: `${question} (Duration: ${duration} hours)\n\n`, color: "dark_aqua" },
                    { text: `[${answer1}]`, color: "green" },
                    { text: `[${answer2}]`, color: "red" }
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
                    { text: `[${pollMessage.poll.answers[0]?.text || 'Yes'}: ${yesVotes}] `, color: "green" },
                    { text: `[${pollMessage.poll.answers[1]?.text || 'No'}: ${noVotes}]`, color: "red" }
                ])}`);

                break
            default:
                await interaction.reply('Unknown subcommand.')
        }
    }
}