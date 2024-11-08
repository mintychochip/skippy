const { RankDatabase, RankDatabaseError } = require('../../temp/rank.js');
const {
  SlashCommandSubcommandBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const set_points_rank = new SlashCommandSubcommandBuilder()
  .setName('points')
  .setDescription('set rank points')
  .addStringOption((option) =>
    option.setName('name').setDescription('name of the rank').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('points').setDescription('points').setRequired(true)
  );
const set_name_rank = new SlashCommandSubcommandBuilder()
  .setName('name')
  .setDescription('set new name of rank')
  .addStringOption((option) =>
    option.setName('old').setDescription('old name').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('new').setDescription('new name').setRequired(true)
  );
const set_rank = new SlashCommandBuilder()
  .setName('set')
  .setDescription('set commands')
  .addSubcommand(set_points_rank)
  .addSubcommand(set_name_rank);

const RANK_DB = new RankDatabase('./database.db');

module.exports = {
  data: set_rank,
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;
    switch (subcommand) {
      case 'name': {
        const oldName = interaction.options.getString('old', true);
        const newName = interaction.options.getString('new', true);

        try {
          await RANK_DB.updateRankName(oldName, newName, guild.id);

          await interaction.reply(`The rank was updated`);
        } catch (err) {
          if (err instanceof RankDatabaseError) {
            displayRankDatabaseErr(err);
          }
          console.error(err);
        }
        break;
      }

      case 'points': {
        const name = interaction.options.getString('name', true);
        const points = interaction.options.getInteger('points', true);
        if (!(name && points)) {
          return await interaction.reply('The fields were invalid');
        }
        if (points < 0) {
          return await interaction.reply(
            `The points specified: ${points} must be greater than 0`
          );
        }

        try {
          await RANK_DB.updateRankPoints(name, points, guild.id);

          await interaction.reply('The rank was updated');
        } catch (err) {
          if (err instanceof RankDatabaseError) {
            displayRankDatabaseErr(err);
          }
          console.error(err);
        }
        break;
      }
      default: {
        await interaction.reply('Invalid subcommand');
        break;
      }
    }
  },
};

async function displayRankDatabaseErr(err) {
  switch (err.errorCode) {
    case 1:
    case 2: {
      await interaction.reply(`
                    The rank "${oldName}" was unable to be found, use one of the choices provided.
                    `);
      break;
    }
    default: {
      await interaction.reply('misc error');
      break;
    }
  }
}
