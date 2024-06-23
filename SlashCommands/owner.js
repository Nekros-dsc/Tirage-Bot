const Discord = require('discord.js');

module.exports = {
    name: 'owner',
    description: 'Gère les owners du bot',
    dm_permission: false,
    perm: 'BUYER',
    options: [
        {
            type: 3,
            name: 'action',
            description: 'Veuillez sélectionner l\'action à effectuer',
            required: true,
            choices: [{ name: 'Ajouter un owner', value: 'addowner'}, { name: 'Retire un owner', value: 'removeowner'}, { name: 'Affiche les owners', value: 'ownerlist' }, { name: 'Clear les owners', value: 'clearowners '}]
        }, 
        {
            type: 6,
            name: 'membre',
            description: 'Veuillez sélectionner le membre à owner/unowner.',
            autocomplete: true 
        },
        {
            type: 3,
            name: 'id',
            description: 'id du membre à owner/unowner.',
            autocomplete: true 
        },
    ],
    run: async (bot, interaction, args, config, data) => {
        let owners = JSON.parse(bot.functions.checkBot(bot, bot.user.id).owners)
        const actions = interaction.options.getString('action')
        if(actions == "addowner") {
            const member = interaction.options.getUser('membre') || bot.users.cache.get(interaction.options.getString('id')).catch(e => false)
            if(!member || member.bot) return interaction.reply({ content: `👮‍♂️ Veuillez préciser un membre valide`, ephemeral: true })
            
            if(owners.includes(member.id)) return interaction.reply({ content: `👮‍♂️ Ce membre est déjà owner du bot !`, ephemeral: true })
            owners.push(member.id)
            bot.db.prepare(`UPDATE bot SET owners = @coins WHERE id = @id`).run({ coins: JSON.stringify(owners), id: bot.user.id });
            interaction.reply(`:white_check_mark: ${member.username} est désormais owner du bot !\n:warning: Owner permet de modifier les gains des tirages`)
        } else if(actions == "removeowner") {
            const member = interaction.options.getUser('membre') || bot.users.cache.get(interaction.options.getString('id')).catch(e => false)
            if(!member || member.bot) return interaction.reply({ content: `👮‍♂️ Veuillez préciser un membre valide`, ephemeral: true })

            if(config.buyers.includes(member.id) || !owners.includes(member.id)) return interaction.reply({ content: `👮‍♂️ Ce membre n'est pas owner du bot !`, ephemeral: true})

            owners = owners.filter(u => u !== member.id)

            bot.db.prepare(`UPDATE bot SET owners = @coins WHERE id = @id`).run({ coins: JSON.stringify(owners), id: bot.user.id });
            interaction.reply(`:white_check_mark: ${member.username} a été retiré des owners du bot !`)
        } else if(actions == "ownerlist") {
            const description = owners.map(u => `[${bot.users.cache.get(u).username}](https://discord.gg/jNJBgmMeqn) (id: ${u})`).join('\n')
            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Voici la liste des owners`)
            .setDescription(description)
            .setFooter({ text: config.footerText })
            interaction.reply({ embeds: [embed]})
        } else if(actions == "clearowners") {
            let buttonAccept = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Success).setCustomId('accept').setEmoji("✅")
            let buttonRefuse = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setCustomId('refuse').setEmoji("❌")

            let button_row = new Discord.ActionRowBuilder().addComponents([buttonAccept, buttonRefuse])
            const msg = await interaction.reply({ content: `Êtes-vous sûr de vouloir retirer tous les owners ?`, components: [button_row]})

            const collector = msg.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button,
                time: 150000
              })
            collector.on("collect", async (i) => {
                if (i.user.id !== interaction.user.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces bouttons !", ephemeral: true }).catch(() => { })
                
                if(i.customId == "refuse") {
                    i.reply(`:x: Action annulée !`)
                    collector.stop()
                } else if(i.customId == "accept") {
                    bot.db.prepare(`UPDATE bot SET owners = @coins WHERE id = @id`).run({ coins: JSON.stringify(config.buyers), id: bot.user.id });
                    i.reply(`:white_check_mark: L'ensemble des owners ont bien été retiré (sauf buyer)`)
                    collector.stop()
                }
            })

            collector.on("end", async (i) => {
                msg.edit({ content: `Expiré !`, components: []})
            })
        }
    }
}