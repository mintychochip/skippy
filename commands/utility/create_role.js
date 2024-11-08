const {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} = require("discord.js");
const { RankDatabase } = require("../../temp/rank.js");
const { rank_command } = require("../../temp/create_rank.js");
const sqlite3 = require("sqlite3").verbose();
module.exports = {
  data: rank_command,
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      const guild = interaction.guild;
      switch (subcommand) {
        case "create": {
          const rankName = interaction.options.getString("name", true);
          

          if (!guild) {
            return interaction.reply(
              "This command must be used within a server."
            );
          }
          const rankdb = new RankDatabase("./database.db");
          
          const promises = await Promise.all([
            rankdb.rankExists(rankName, guild.id),
            new Promise((resolve) => {
              const role = guild.roles.cache.find((role) => role.name === rankName);
              resolve(role);
            }),
          ]);

          Promise.all(promises).then(([exists, cachedRole]) => {
            if(exists && cachedRole) {
              return interaction.reply(`The role already exists "${rankName}"`);
            }
            if(!exists) {
              const points = interaction.options.getInteger('points', false);
              addRankToDB(rankName,guild.id,points);
            }
            
            if(!cachedRole) {
              const color = interaction.options.getString('color',false);              
              const rank = createRank(rankName,color);

              guild.roles.create(rank);
            }
            return interaction.reply('Success!');
          }).catch(err => {
            console.log('Error creating rank:', err);
          });
          break;
        }
        default: {
          await interaction.reply("Invalid subcommand");
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
/**
 * 
 * @param {string} name 
 * @param {string} color 
 * @param {int} permissions 
 * @returns 
 */
function createRank(name, color) {
  const rank = {
    name: name,
    reason: 'created by skippy',
  };
  if(color) {
    rank.color = color;
  }
  return rank;
}

function addRankToDB(name,guildId,points) {
  if(points) {
    rankdb.insertRank(rankName,guildId,points).then(id => {
      //return interaction.reply('The role was succesfully created');
    }).catch(err => {
      console.log('Error creating rank:', err);
      //return interaction.reply('There was a problem making that rank?');
    });
  }
  rankdb.insertRank(rankName,guildId).then(id => {
    //return interaction.reply('The role was succesfully created');
  }).catch(err => {
    console.log('Error creating rank:', err);
    //return interaction.reply('There was a problem making that rank?');
  });
}
