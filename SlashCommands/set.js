const Discord = require('discord.js');

module.exports = {
    name: 'set',
    description: 'set commands',
    dm_permission: false,
    perm: 'BUYER',
    options: [
        {
            type: 1,
            name: 'avatar',
            description: 'Modifie l\'avatar du bot',
            options: [
                {
                    type: 11,
                    name: 'attach',
                    description: 'Nouvelle image de profil du bot.',
                    required: true
                },
            ],
        }, 
        {
            type: 1,
            name: 'name',
            description: 'Modifie le pseudo du bot',
            options: [
                {
                    type: 3,
                    name: 'value',
                    description: 'Nouveau pseudo du bot',
                    required: true
                },

            ],
        }
    ],
    run: async (bot, interaction, args, config, data) => {
        if(interaction.options.getSubcommand() == "avatar") {
            const attachments = interaction.options.getAttachment('attach').url
            bot.user.setAvatar(attachments).catch(() => false)
            interaction.reply({ content: `✅ Mon avatar a bien été modifié !`, ephemeral: true })
        } else if(interaction.options.getSubcommand() == "name") { 
            const name = interaction.options.getString('value')
            bot.user.setUsername(name).catch(e => false)
            interaction.reply({ content: `✅ Mon pseudo a bien été modifié !`, ephemeral: true })
        }
    }
}