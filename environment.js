require('dotenv').config();
const environment = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID
}
module.exports = { environment };