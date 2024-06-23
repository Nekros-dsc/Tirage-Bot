const Discord = require('discord.js');
const { parseHuman, parseMS } = require("human-ms");

module.exports = {
    name: 'ready',
    async execute(bot) {
        setInterval(async () => {
            bot.guilds.cache.forEach(async g => {
                const guild = bot.functions.checkGuild(bot, g.id)
                const msg = JSON.parse(guild.msg)
                if(msg) {
                    const message = await bot.channels.cache.get(msg.channel).messages.fetch(msg.msgId).catch(e => { console.log(e) })
                    if(message) {
                        const embed = new Discord.EmbedBuilder()
                        .setTitle(`Roue de la Chance`)
                        .setDescription(`# Voici les différents gains possibles:`)
                        .setColor(guild.color)
                        .setImage(`https://media.discordapp.net/attachments/1251179906084376728/1251427314554900562/roue_chance.gif?ex=666e8a02&is=666d3882&hm=f202d9ed323479292c682dea0f97222ffc00ced001cb37002f1139afa2142502&=&width=960&height=540`)
                        .setFooter({ text: `Vous devez faire ${parseMS(guild.duration).replace('days', 'jours').replace('and', '').replace('hours', 'heures').replace('seconds', 'secondes')} de vocal pour obtenir un jeton !`})
                        const array = JSON.parse(guild.items).sort((a, b) => a.pourcentage - b.pourcentage);
                
                        if(array.length !== 0) {
                            array.forEach(a => {
                                embed.addFields({ name: a.name, value: `${a.role ? `(<@&${a.role}>) ` : ""}\`${a.rarity}%\``, inline: true })
                            })
                        }
                        message.edit({ embeds: [embed]})
                    }
                }
            })
        }, 180000)
    }
}