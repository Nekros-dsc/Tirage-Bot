const Discord = require('discord.js');

module.exports = {
    name: 'roll',
    description: 'roll commands',
    dm_permission: false,
    perm: 'OWNER',
    options: [
        {
            type: 1,
            name: 'add',
            description: 'Ajoute des jetons',
            options: [
                {
                    type: 6,
                    name: 'member',
                    description: 'Member.',
                    required: true
                },
                {
                    type: 10,
                    name: 'amount',
                    description: 'Amount to add.',
                    required: true
                },
            ],
        }, 
        {
            type: 1,
            name: 'remove',
            description: 'Retire des jetons',
            options: [
                {
                    type: 6,
                    name: 'member',
                    description: 'Member.',
                    required: true
                },
                {
                    type: 10,
                    name: 'amount',
                    description: 'Amount to remove.',
                    required: true
                },
            ],
        },
        {
            type: 1,
            name: 'reset',
            description: 'WARNING: remet tous les jetons des membres à 0',
        },
        {
            type: 1,
            name: 'show',
            description: 'Affiche les jetons',
            options: [
                {
                    type: 6,
                    name: 'member',
                    description: 'Member.',
                    required: true
                },
            ],
        },
    ],
    run: async (bot, interaction, args, config, data) => {
        if(interaction.options.getSubcommand() == "add") {
            const member = interaction.options.getUser('member')
            if(!member || member.bot) return interaction.reply({ content: `👮‍♂️ Veuillez préciser un membre valide`, ephemeral: true })

            bot.functions.addJetons(bot, member.id, interaction.options.getNumber('amount'))
            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Jetons ajoutés`)
            .setDescription(`\`${interaction.options.getNumber('amount')}\` jetons ont bien été ajoutés à ${member.username}.`)
            .setFooter({ text: config.footerText })
            interaction.reply({ embeds: [embed] })
        } else if(interaction.options.getSubcommand() == "remove") {
            const member = interaction.options.getUser('member')
            if(!member || member.bot) return interaction.reply({ content: `👮‍♂️ Veuillez préciser un membre valide`, ephemeral: true })

            bot.functions.removeJetons(bot, member.id, interaction.options.getNumber('amount'))
            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Jetons retirés`)
            .setDescription(`\`${interaction.options.getNumber('amount')}\` jetons ont bien été retirés à ${member.username}.`)
            .setFooter({ text: config.footerText })
            interaction.reply({ embeds: [embed] })
        } else if(interaction.options.getSubcommand() == "reset") {
            bot.db.exec(`DELETE FROM user`);
            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Reset terminé !`)
            .setDescription(`L'ensemble des jetons du serveur ont été reset avec succès !`)
            .setFooter({ text: config.footerText })
            interaction.reply({ embeds: [embed] })
        } else if(interaction.options.getSubcommand() == "show") {
            const member = interaction.options.getUser('member')
            if(!member || member.bot) return interaction.reply({ content: `👮‍♂️ Veuillez préciser un membre valide`, ephemeral: true })

            const jetons = bot.functions.checkUser(bot, member.id).jetons
            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Voici le nombre de jetons de ${member.username}`)
            .setDescription(`\`${jetons}\``)
            .setFooter({ text: config.footerText })
            interaction.reply({ embeds: [embed] })
        }
    }
}