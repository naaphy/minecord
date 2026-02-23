const { SlashCommandBuilder, MessageFlags, ContainerBuilder } = require('discord.js')
const { exec } = require('../../Functions/rcon')
const pollStore = require('../../Functions/pollStore')
const { text } = require('express')

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

                const messagee = await interaction.channel.send({
                    content: 'Creating poll...',
                })

                const container = new ContainerBuilder()
                    .addTextDisplayComponents(
                        text => text.setContent(`# ${question}`),
                        text => text.setContent(`> *Poll created by <@${poll.author}>*`),
                        text => text.setContent(`> *Poll ID : ${pollId}*`)
                    )
                    .addSeparatorComponents(sep => sep)
                    .addSectionComponents(section => section
                        .addTextDisplayComponents(text => text.setContent(answer1))
                        .setButtonAccessory(button => button
                            .setCustomId(`poll_${messagee.id}_1`).setLabel('Vote').setStyle('Success')
                        )
                    )
                    .addSectionComponents(section => section
                        .addTextDisplayComponents(text => text.setContent(answer2))
                        .setButtonAccessory(button => button
                            .setCustomId(`poll_${messagee.id}_2`).setLabel('Vote').setStyle('Danger')
                        )
                    )

                await messagee.edit({
                    content: '',
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                })

                pollStore.createPoll(messagee.id, {
                    question,
                    answer1,
                    answer2,
                    yes: new Set(),
                    no: new Set(),
                    author: interaction.user.id
                })

                await exec(`tellraw @a ${JSON.stringify([
                    { text: `${interaction.user.username} created a poll on Discord !\n\n`, color: "white" },
                    { text: `${question}\n\n`, color: "dark_aqua" },
                    { text: `[${answer1}] `, color: "green" },
                    { text: `[${answer2}] `, color: "red" }
                ])}`);

                break

            case 'end':
                const pollId = options.getString('poll_id')
                const poll = pollStore.getPoll(pollId)

                if (!poll) {
                    return interaction.reply({
                        content: 'Sondage introuvable.',
                        flags: MessageFlags.Ephemeral
                    })
                }

                const message = await interaction.channel.messages.fetch(pollId)

                const total = poll.yes.size + poll.no.size
                const yesPercent = total ? Math.round((poll.yes.size / total) * 100) : 0
                const noPercent = total ? Math.round((poll.no.size / total) * 100) : 0

                await interaction.reply({
                    content: `Poll terminé.`,
                    flags: MessageFlags.Ephemeral
                })

                await exec(`tellraw @a ${JSON.stringify([
                    { text: `${interaction.user.username} ended a poll on Discord !\n\n`, color: "white" },
                    { text: `${poll.question}\n\n`, color: "dark_aqua" },
                    { text: `[${poll.answer1}: ${yesPercent}%] `, color: "green" },
                    { text: `[${poll.answer2}: ${noPercent}%] `, color: "red" }
                ])}`);

                await message.edit({
                    components: [new ContainerBuilder()
                        .addTextDisplayComponents(
                            text => text.setContent(`# ${poll.question} (Ended)`),
                            text => text.setContent(`> *Poll created by <@${poll.author}>*`),
                            text => text.setContent(`> *Poll ID : ${pollId}*`)
                        )
                        .addSeparatorComponents(sep => sep)
                        .addSectionComponents(section => section
                            .addTextDisplayComponents(text => 
                                text.setContent(`${poll.answer1} — ${poll.yes.size} vote(s)`)
                            )
                            .setButtonAccessory(button => button
                                .setCustomId('disabled1')
                                .setLabel('Vote')
                                .setStyle('Success')
                                .setDisabled(true)
                            )
                        )
                        .addSectionComponents(section => section
                            .addTextDisplayComponents(text =>
                                text.setContent(`${poll.answer2} — ${poll.no.size} vote(s)`)
                            )
                            .setButtonAccessory(button => button
                                .setCustomId('disabled2')
                                .setLabel('Vote')
                                .setStyle('Danger')
                                .setDisabled(true)
                            )
                        )
                    ],
                    flags: MessageFlags.IsComponentsV2
                })

                pollStore.deletePoll(pollId)
                break
            default:
                await interaction.reply('Unknown subcommand.')
        }
    }
}