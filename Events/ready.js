const { Events } = require('discord.js');
require('colors')

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute (client) {
        console.clear()
        console.log('[+] Connected'.green)
    }
}