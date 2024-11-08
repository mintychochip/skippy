const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedAssertions,
} = require("@discordjs/builders");
const { ChannelType, ButtonStyle, ActionRow } = require("discord.js"); // Import ChannelType from discord.js

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Echoes your text into a specified channel")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The text you want to echo")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to echo the message into")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ), // Channel is optional now
  async execute(interaction) {
    // Get the input text and the specified channel (if any)
    const textToEcho = interaction.options.getString("input", true);
    const targetChannel = interaction.options.getChannel("channel");
    if (!targetChannel || targetChannel.name === interaction.channel.name) {
        await interaction.reply({ content: textToEcho, ephemeral: true });
        return;
    }

    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Send")
      .setStyle(ButtonStyle.Primary);
    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(confirm, cancel);

    const response = await interaction.reply({
      content: `Are you sure you want to send "${textToEcho}" to ${targetChannel}?`,
      components: [row],
      ephemeral: true,
    });
    const collectorFilter = (i) => i.user.id === interaction.user.id;
    try {
      const { EmbedBuilder } = require("discord.js");

      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(textToEcho)
        .setURL("https://discord.js.org/")
        .setImage("https://i.imgur.com/AfFp7pu.png")
        .setTimestamp();
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });
      if (confirmation.customId === "confirm") {
        await targetChannel.send({
          content: textToEcho,
          embeds: [exampleEmbed],
        });
        await targetChannel.send;
        await confirmation.update({
          content: `Message was sent to ${targetChannel}`,
          components: [],
        });
      } else if (confirmation.customId === "cancel") {
        await confirmation.update({
          content: "Cancelled",
          components: [],
        });
      }
    } catch (e) {
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        components: [],
      });
    }
  },
};
