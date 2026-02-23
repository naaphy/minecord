const { SlashCommandBuilder } = require('discord.js')
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
        .addStringOption(option => option.setName('options').setDescription('The options for the poll, separated by commas').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('The duration of the poll in seconds').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('end')
        .setDescription('End an existing poll')
        .addStringOption(option => option.setName('poll_id').setDescription('The ID of the poll to end').setRequired(true))
    ),
    async execute (interaction) {
        const { options } = interaction
        const subcommand = options.getSubcommand()

        switch (subcommand) {
            case 'create':
                const question = options.getString('question')
                const pollOptions = options.getString('options').split(',').map(option => option.trim())
                const duration = parseInt(options.getString('duration'))

                // Here you would implement the logic to create a poll, for example by storing it in a database
                await interaction.reply(`Poll created with question: "${question}" and options: ${pollOptions.join(', ')}. Duration: ${duration} seconds.`)
                break

            case 'end':
                const pollId = options.getString('poll_id')
                // Here you would implement the logic to end a poll, for example by updating its status in a database
                await interaction.reply(`Poll with ID: "${pollId}" has been ended.`)
                break
            default:
                await interaction.reply('Unknown subcommand.')
        }
    }
}