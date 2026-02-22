async function Commands(client) {

    const fs = require('fs')

    let cmds = []

    const Folder = fs.readdirSync('./Commands')
    for (const folder of Folder) {
        const files = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'))
        for (const file of files) {
            const command = require(`./Commands/${folder}/${file}`)

            const properties = {folder, ...command}
            client.commands.set(command.data.name, properties)

            cmds.push(command.data.toJSON())
        }
    }
    
    client.application.commands.set(cmds)
}

// 

async function Events(client) {
    
    const fs = require('fs')

    const folder = fs.readdirSync('./Events')
    for (const file of folder) {
        const event = require(`./Events/${file}`)

        if (event.once) 
            client.once(event.name, (...args) => event.execute(...args, client))
        else client.on(event.name, (...args) => event.execute(...args, client))
    }
}

// 

module.exports = {
    Events, Commands
}