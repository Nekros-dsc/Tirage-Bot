function checkbot(bot, botId) {
    let req = bot.db.prepare('SELECT * FROM bot WHERE id = ?').get(botId)
    if(!req) {
        bot.db.exec(`INSERT INTO bot (id) VALUES ('${botId}')`);
        req = bot.db.prepare('SELECT * FROM bot WHERE id = ?').get(botId)
        return req
    } else return req
}

function checkguild(bot, guildId) {
    let req = bot.db.prepare('SELECT * FROM guild WHERE id = ?').get(guildId)
    if(!req) {
        bot.db.exec(`INSERT INTO guild (id) VALUES ('${guildId}')`);
        req = bot.db.prepare('SELECT * FROM guild WHERE id = ?').get(guildId)
        return req
    } else return req
}

function checkuser(bot, userId) {
    let req = bot.db.prepare('SELECT * FROM user WHERE id = ?').get(userId)
    if(!req) {
        bot.db.exec(`INSERT INTO user (id) VALUES ('${userId}')`);
        req = bot.db.prepare('SELECT * FROM user WHERE id = ?').get(userId)
        return req
    } else return req
}

function addjetons(bot, userId, number) {
    let req = checkuser(bot, userId)
    bot.db.prepare(`UPDATE user SET jetons = @coins WHERE id = @id`).run({ coins: Number(req.jetons) + Number(number), id: userId });
}

function removejetons(bot, userId, number) {
    let req = checkuser(bot, userId)
    bot.db.prepare(`UPDATE user SET jetons = @coins WHERE id = @id`).run({ coins: Number(req.jetons) - number, id: userId });
}
module.exports = {
    checkBot: checkbot,
    checkUser: checkuser,
    checkGuild: checkguild,
    addJetons: addjetons,
    removeJetons: removejetons
}
