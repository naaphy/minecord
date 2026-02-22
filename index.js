const Discord = require('discord.js')
const {Commands, Events} = require('./handlers')
require('colors')
require('dotenv').config();
const express = require('express')

const client = new Discord.Client({
    intents: [Object.keys(Discord.GatewayIntentBits)], partials: [Object.keys(Discord.Partials)]
})

client.commands = new Discord.Collection()

const app = express()
app.use(express.json())

client.login(process.env.BOT_TOKEN).then(() => {
    Events(client); Commands(client)
})