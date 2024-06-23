const Discord = require('discord.js');
const { parseHuman, parseMS } = require("human-ms");

module.exports = {
    name: 'setchannel',
    description: 'Définit le salon de la roue.',
    dm_permission: false,
    perm: 'OWNER',
    run: async (bot, interaction, args, config, data) => {
        const embed = new Discord.EmbedBuilder()
        .setTitle(`Roue de la Chance`)
        .setDescription(`# Voici les différents gains possibles:`)
        .setColor(data.color)
        .setImage(`https://media.discordapp.net/attachments/1251179906084376728/1251427314554900562/roue_chance.gif?ex=666e8a02&is=666d3882&hm=f202d9ed323479292c682dea0f97222ffc00ced001cb37002f1139afa2142502&=&width=960&height=540`)
        .setFooter({ text: `Vous devez faire ${parseMS(data.duration).replace('days', 'jours').replace('and', '').replace('hours', 'heures').replace('seconds', 'secondes')} de vocal pour obtenir un jeton !`})
        const array = JSON.parse(data.items).sort((a, b) => a.pourcentage - b.pourcentage);

        if(array.length !== 0) {
            array.forEach(a => {
                embed.addFields({ name: a.name, value: `${a.role ? `(<@&${a.role}>) ` : ""}\`${a.rarity}%\``, inline: true })
            })
        }

        let startTirage = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('startTirage').setEmoji("🍾").setLabel('Lancer la roue')
        let showJetons = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('showJetons').setEmoji("💿").setLabel('Voir mes jetons')
        let timeJetons = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('timeJetons').setEmoji("⏰").setLabel('Temps avant le prochain jeton')
        let info = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('info').setEmoji("ℹ️")   
        let button_row = new Discord.ActionRowBuilder().addComponents([startTirage, showJetons, timeJetons, info])

        interaction.reply({ content: `:white_check_mark:`, ephemeral: true })
        const msg = await interaction.channel.send({ embeds: [embed], components: [button_row]})
        bot.db.prepare(`UPDATE guild SET msg = @coins WHERE id = @id`).run({ coins: JSON.stringify({ "channel": interaction.channel.id, "msgId": msg.id }), id: interaction.guild.id });
    }
}