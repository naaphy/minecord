async function F (string, message) {
    string
    .replaceAll('[user]', `<@${message.user.id}>`)
    .replaceAll('[channel]', `<@${message.channel}>`)
    .replaceAll('[day]', new Date().getDay())
    .replaceAll('[month]', new Date().getMonth())
    .replaceAll('[year]', new Date().getFullYear())
    .replaceAll('[hour]', new Date().getHours())
    .replaceAll('[minute]', new Date().getMinutes())
    .replaceAll('[second]', new Date().getSeconds())

    return string
}

module.exports = F