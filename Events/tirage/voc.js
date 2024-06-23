const Discord = require('discord.js');

module.exports = {
    name: 'ready',
    async execute(bot) {
        setInterval(async () => {
            bot.guilds.cache.forEach(async g => {
                g.members.cache.forEach((u) => {
                    if(u.voice.channel) {
                        const dure = bot.functions.checkUser(bot, u.id).timeInVoc
                        bot.db.prepare(`UPDATE user SET timeInVoc = @coins WHERE id = @id`).run({ coins: Number(dure) - 60000, id: u.id });
                        if(dure < 0) {
                            bot.functions.addJetons(bot, u.id, 1)
                            bot.db.prepare(`UPDATE user SET timeInVoc = @coins WHERE id = @id`).run({ coins: Number(dure), id: u.id });
                        }
                    }
                })
            })
        }, 60000)
    }
}