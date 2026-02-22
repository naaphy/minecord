const {Events, ContainerBuilder, MessageFlags} = require('discord.js')
const setting = require('../Config/bot.json')

const F = require('../Functions/Format')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute (message, client) {
        const args = message.content.trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === `${setting.prefix}setup` && args[1] === 'test') {
            await message.reply({
                components: [
                    new ContainerBuilder()
                    .addTextDisplayComponents(t => t
                        .setContent(F("[user] a exécuté la version test de la commande `setup` ! dans [channel]\n-# [day]/[month]/[year] - [hour]:[minute]:[second]", message))
                    )
                ], flags: MessageFlags.IsComponentsV2
            })
        }
    }
}