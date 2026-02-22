import { Rcon } from "rcon-client";
import dotenv from "dotenv";
dotenv.config();

/**
 * @param {string} command - La commande à exécuter sans "/"
 */

export async function exec (command) {
    const rcon = new Rcon({
        host: process.env.HOST,
        port: parseInt(process.env.PORT),
        password: process.env.PASSWORD
    })

    try {
        await rcon.connect()
        const response = await rcon.send(command)
        console.log(response)
        await rcon.end()
        return response
    } catch (error) {
        console.log(error)
        throw new Error('Impossible de rejoindre le serveur Minecraft.')
    }
}