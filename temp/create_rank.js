const { SlashCommandSubcommandBuilder, SlashCommandBuilder } = require('discord.js');

const create_role = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('creates a new role')
    .addStringOption(option => 
        option.setName('name')
            .setDescription('name of role')
            .setRequired(true))
    .addStringOption(option => 
        option.setName('color')
            .setDescription('sets the color of rank')
            .setRequired(false))
    .addIntegerOption(option => 
        option.setName('points')
            .setDescription('sets the required amount of points to set this rank')
            .setRequired(false));
const delete_role = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('deletes a role')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('name being deleted')
            .setRequired(true));

const rank_command = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('role commands')
    .addSubcommand(create_role)
    .addSubcommand(delete_role)
module.exports = { rank_command };