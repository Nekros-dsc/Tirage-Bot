const Discord = require('discord.js')
const { parseHuman, parseMS } = require("human-ms");
const axios = require('axios')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, bot, config) {
        if(interaction.customId == "showJetons") {
            const jetons = bot.functions.checkUser(bot, interaction.user.id).jetons
            interaction.reply({ content: `💿 Vous avez ${Math.round(jetons)} jeton${jetons > 1 ? "s" : ""} !`, ephemeral: true })
        } else if(interaction.customId == "info") {
            const guild = bot.functions.checkGuild(bot, interaction.guild.id)
            const dure = guild.duration
            interaction.reply({ content: `> Salut à toi ! Grâce à ce **système inédit & innovant** tu vas pouvoir **gagner de nombreux lots** comme par exemple un **${JSON.parse(guild.items)[Math.floor(Math.random() * JSON.parse(guild.items).length)]?.name || "Ya aucun items défini là comment je fais pour choisir.."}** !\n> **Pour gagner des jetons** et ainsi lancer la roue tu dois faire exactement ${parseMS(dure).replace('days', 'jours').replace('and', '').replace('hours', 'heures').replace('seconds', 'secondes')} de vocal sur le serveur \`${interaction.guild.name}\` !\n\n*Ce bot a été pensé et développé par [Ⲉpic Bots](https://discord.gg/7hDfsSZeCK) :rocket:*`, ephemeral: true })
        } else if(interaction.customId == "timeJetons") {
            const dure = bot.functions.checkUser(bot, interaction.user.id).timeInVoc
            interaction.reply({ content: `🔊 Vous devez encore faire **${parseMS(dure).replace('days', 'jours').replace('and', '').replace('hours', 'heures').replace('seconds', 'secondes')} de vocal avant de gagner un jeton** !`, ephemeral: true })
        } else if(interaction.customId == "startTirage") {
            const guild = bot.functions.checkGuild(bot, interaction.guild.id)
            const dure = guild.duration
            const jetons = bot.functions.checkUser(bot, interaction.user.id).jetons
            if(jetons == 0) return interaction.reply({ content: `:x: Vous devez avoir au moins 1 jeton pour lancer la roue !\n:information_source: *Vous gagnez 1 jeton chaque ${parseMS(dure).replace('days', 'jours').replace('and', '').replace('hour', 'heure').replace('second', 'seconde').replace('hours', 'heures').replace('seconds', 'secondes')} passées en vocal sur ${interaction.guild.name}*`, ephemeral: true })
            else {
                let array = JSON.parse(guild.items)
                bot.functions.removeJetons(bot, interaction.user.id, 1)
                interaction.reply({ content: `## Roue lancée....\n__Résultat dans 10 secondes !__`, ephemeral: true })
                const item = gen(array)
                setTimeout(async () => {
                    interaction.followUp({ content: `__Vous venez de remporter ${item.name} !__\n\`${item.number - 1}\` personne${item.number > 1 ? "s" : ""} ont déjà remportée ce lot !`, ephemeral: true })
                    array = array.filter(a => a.name !== item.name)
                    array.push(item)
                    bot.db.prepare(`UPDATE guild SET items = @coins WHERE id = @id`).run({ coins: JSON.stringify(array), id: interaction.guild.id });
                    const channelLogs = interaction.guild.channels.cache.get(guild.logs)
                    if(channelLogs) {
                        const embed = new Discord.EmbedBuilder()
                        .setColor(guild.color)
                        .setDescription(`${interaction.user} (${interaction.user.id}) vient de remporter \`${item.name}\` !`)
                        .setFooter({ text: config.footerText })
                        channelLogs.send({ embeds: [embed]})
                    }
                    if(interaction.guild.roles.cache.get(item.role)) {
                        interaction.member.roles.add(item.role)
                    }
                    if(item.jetons) {
                        bot.functions.addJetons(bot, interaction.user.id, item.jetons)
                    }

                    if(item.coins) {
                        try {
                            await axios.post(`${config.url}/addcoins`, null, {
                              params: {
                                apiKey: guild.apikey,
                                userId: interaction.user.id,
                                amount: item.coins
                              }
                            });
                        } catch (error) { console.log(error) }
                    }

                    if(item.rep) {
                        try {
                            await axios.post(`${config.url}/addrep`, null, {
                              params: {
                                apiKey: guild.apikey,
                                userId: interaction.user.id,
                                amount: item.rep
                              }
                            });
                        } catch (error) { console.log(error) }
                    }

                }, 10000)
            }
        }
    }
}

function gen(db) {
    const totalRarity = db.reduce((sum, item) => sum + item.rarity, 0);
    let random = Math.random() * totalRarity;
    
    for (let item of db) {
        if (random < item.rarity) {
            item.number += 1;
            return item;
        }
        random -= item.rarity;
    }
}