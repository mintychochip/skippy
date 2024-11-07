const { Events } = require('discord.js')

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const defaultChannel = guild.systemChannel || guild.channels.cache.find(ch => ch.type === 'GUILD_TEXT');

        if(defaultChannel) {
            try {
                await defaultChannel.send(`Ribbit! Thanks for adding me to, ${guild.name}! 🎉`);
            } catch (error) {
                console.error('Error sending join message:', error);
            }
        }
    },
};