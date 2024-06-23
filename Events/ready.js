module.exports = {
  name: 'ready',
  async execute(bot) {
    await bot.application.commands.set(bot.arrayOfSlashCommands);
    const req = bot.functions.checkBot(bot, bot.user.id)
    if(JSON.parse(req.activity).name) await bot.user.setPresence({ activities: [{ name: JSON.parse(req.activity).name, type: JSON.parse(req.activity).type, url: "https://twitch.tv/ruwin2007yt" }], status: JSON.parse(req.activity).status });
  },
};