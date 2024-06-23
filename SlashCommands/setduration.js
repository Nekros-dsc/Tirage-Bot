const Discord = require('discord.js');
const { parseHuman, parseMS } = require("human-ms");

module.exports = {
    name: 'setduration',
    description: 'Modifie la durée requise pour obtenir un tirage.',
    dm_permission: false,
    perm: 'OWNER',
    options: [
        {
            type: 3,
            name: 'time',
            description: 'New time (ex: 2h).',
            required: true
        }
    ],
    run: async (bot, interaction, args, config, data) => {
        const dure = parseHuman(interaction.options.getString('time'))
        if(!dure) {
            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Paramètre invalide !`)
            .setDescription(`La durée doit être de type \`2h\` pour 2 heures, \`30m\` pour 30 minutes.`)
            .setFooter({ text: config.footerText })

            return interaction.reply({ embeds: [embed] })
        } else {
            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`La durée a bien été modifiée !`)
            .setDescription(`Les membres gagneront un jeton chaque ${parseMS(dure).replace('hour', 'heure').replace('second', 'seconde').replace('days', 'jours').replace('and', '').replace('hours', 'heures').replace('seconds', 'secondes')} de vocal !`)
            .setFooter({ text: config.footerText })

            bot.db.prepare(`UPDATE guild SET duration = @coins WHERE id = @id`).run({ coins: dure, id: interaction.guild.id });

            interaction.reply({ embeds: [embed]})
        }
    }
}