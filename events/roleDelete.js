const { Events } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
module.exports = {
    name: Events.GuildRoleDelete,
    async execute(role) {
        //TODO: add logging
        db.run(`
            DELETE FROM ranks WHERE role_name=? AND guild_id=?;`,
            [role.name,role.guild.id]);
    }
}