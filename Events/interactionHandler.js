module.exports = {
  name: 'interactionCreate',
  async execute(interaction, bot, config) {
    if (interaction.isCommand()) {
      const cmd = bot.slashCommands.get(interaction.commandName);
         
      const args = [];

      for (let option of interaction.options.data) {
          if (option.type === 1) {
              if (option.name) args.push(option.name);
              option.options?.forEach((x) => {
                  if (x.value) args.push(x.value);
              });
          } else if (option.value) args.push(option.value);
      }
      const guild = bot.functions.checkGuild(bot, interaction.guild.id)
      if(permOrNON(bot, interaction, guild, cmd, config) == true) cmd.run(bot, interaction, args, config, guild);
  }
  }}

  function permOrNON(bot, message, guild, commandFile, config) {
    if(commandFile.perm == "OWNER") {
      const owners = JSON.parse(bot.functions.checkBot(bot, bot.user.id).owners)
      if(owners.includes(message.user.id)) return true
      else if(config.buyers.includes(message.user.id)) return true
      else return message.reply("`❌` Vous devez être `owner` pour utiliser cette commande !")
    } else if(commandFile.perm == "BUYER") {
    if(config.buyers.includes(message.user.id)) return true
      else return message.reply("`❌` Vous devez être `buyer` pour utiliser cette commande !")
    } else return true
  }