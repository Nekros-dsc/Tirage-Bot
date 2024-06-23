const Discord = require('discord.js');

module.exports = {
    name: 'mybot',
    description: 'Envoie la liste de vos bots.',
    dm_permission: false,
    perm: 'BUYER',
    run: async (bot, interaction, args, config, data) => {
        const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setThumbnail(`https://media.discordapp.net/attachments/1249042420163674153/1249364287814631474/boss.png?ex=666ba5ea&is=666a546a&hm=2333e5a909736ef9ea2cad5fd57c2ec3a8288a52d7129f01c3ed925ce6d5fd95&=&format=webp&quality=lossless&width=404&height=404`)
        .setTitle(`Vos bots`)
        .setFooter({ text: config.footerText})
        .setDescription(`[${bot.user.username}](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot%20applications.commands) : <t:${Date.now() + Date.now()}:R>`)

        return interaction.reply({ embeds: [embed]})
    }   
}