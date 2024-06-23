const Discord = require('discord.js');

module.exports = {
    name: 'setlogs',
    description: 'Définit le salon des logs des tirages.',
    dm_permission: false,
    perm: 'OWNER',
    options: [
        {
            type: 7,
            name: 'channel',
            description: 'New logs channel.',
            required: true,
            channel_types: [Discord.ChannelType.GuildText]
        }
    ],
    run: async (bot, interaction, args, config, data) => {
        const channel = interaction.options.getChannel('channel')
        const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Le salon de logs a bien été modifié !`)
        .setDescription(`Les logs seront désormais envoyés dans le salon ${channel}`)
        .setFooter({ text: config.footerText })

        bot.db.prepare(`UPDATE guild SET logs = @coins WHERE id = @id`).run({ coins: channel.id, id: interaction.guild.id });
        interaction.reply({ embeds: [embed]})
    }   
}