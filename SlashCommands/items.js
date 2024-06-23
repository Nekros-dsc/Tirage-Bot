const Discord = require('discord.js');

module.exports = {
    name: 'items',
    description: 'items commands',
    dm_permission: false,
    perm: 'OWNER',
    options: [
        {
            type: 1,
            name: 'add',
            description: 'Ajoute un nouveau item aux récompenses',
            options: [
                {
                    type: 3,
                    name: 'name',
                    description: 'Define the item name',
                    required: true
                },
                {
                    type: 10,
                    name: 'rarity',
                    description: 'Define the rarity of this items.',
                    min_value: 0,
                    max_value: 99,
                    required: true
                },
                {
                    type: 8,
                    name: 'role',
                    description: 'Define the role given.',
                    required: false,
                    autocomplete: true
                },
                {
                    type: 10,
                    name: 'coins',
                    description: '[COINSBOT] Define the amount of coins given.',
                    required: false
                },
                {
                    type: 10,
                    name: 'rep',
                    description: '[COINSBOT] Define the amount of rep given.',
                    required: false
                },
                {
                    type: 10,
                    name: 'jetons',
                    description: 'Define the amount of tokens given.',
                    required: false
                },
                {
                    type: 3,
                    name: 'api_key',
                    description: '[COINSBOT] Your coinsbot guild\'s key to allow me to add coins/rep.',
                    required: false
                }
            ],
        }, 
        {
            type: 1,
            name: 'list',
            description: 'Affiche l\'ensemble des items à gagner',
        },
        {
            type: 1,
            name: 'remove',
            description: 'Retire un item des récompenses',
            options: [
                {
                    type: 3,
                    name: 'name',
                    description: 'Name of item to remove.',
                    required: true
                },
            ]
        }
    ],
    run: async (bot, interaction, args, config, data) => {
        const req = bot.functions.checkGuild(bot, interaction.guild.id)
        if(interaction.options.getSubcommand() == "add") {
            const name = interaction.options.getString('name')
            const rarity = interaction.options.getNumber('rarity') 
            const role = interaction.options.getRole('role')
            const coins = interaction.options.getNumber('coins')
            const rep = interaction.options.getNumber('rep')
            const jetons = interaction.options.getNumber('jetons')

            const api_key = interaction.options.getString('api_key')

            let array = JSON.parse(req.items).filter(o => o.name !== name)
            if(array.length == 20) {
                const embed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setTitle(`Limite atteinte !`)
                .setDescription(`Il ne peut y avoir que 20 items maximum dans la roue !`)
                .setFooter({ text: config.footerText })
                return interaction.reply({ embeds: [embed] })
            }
            if(coins && !api_key || rep && !api_key || rep && !req.apikey || coins && !req.apikey) {
                const embed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setTitle(`Pas de clef d'api précisée !`)
                .setDescription(`Pour pouvoir ajouter des coins/rep via CoinsBot il me faut avoir la clef d'accès !\n*Pour l'obtenir utilisez la commande \`&apikey\` !*`)
                .setFooter({ text: config.footerText })
                return interaction.reply({ embeds: [embed] })
            }
            const json = {
                "name": name,
                "rarity": rarity,
                "role": role ? role.id : null,
                "coins": coins,
                "rep": rep,
                "jetons": jetons,
                "pourcentage": rarity,
                "number": 0
            }

            array.push(json)

            const newJson = array

            bot.db.prepare(`UPDATE guild SET items = @coins WHERE id = @id`).run({ coins: JSON.stringify(newJson), id: interaction.guild.id });
            if(api_key) bot.db.prepare(`UPDATE guild SET apikey = @coins WHERE id = @id`).run({ coins: api_key, id: interaction.guild.id });

            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Récompense ajoutée !`)
            .setDescription(`Nom: \`${name}\` | Rareté: ${rarity}/100 | Chance totale d'être tiré: \`${newJson[newJson.length - 1].rarity}%\` | Rôle donné: ${role || "aucun"} | Jetons: \`${jetons || 0}\` | Coins: \`${coins || 0}\` | Rep: \`${rep || 0}\``)
            .setFooter({ text: config.footerText })

            interaction.reply({ embeds: [embed] })
        } else if(interaction.options.getSubcommand() == "list") {
            const array = JSON.parse(req.items).sort((a, b) => a.pourcentage - b.pourcentage);
            if(array.length == 0) return interaction.reply(`:x: Il n'y a pas encore d'item dans le bot !`)
            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Liste des récompenses`)
            .setFooter({ text: config.footerText })
            .setDescription(`- L'embed de jeu est modifié chaque minute\n- *Clef d'API CoinsBot (pour l'ajout auto des coins/rep): ${req.apikey || "Non défini"}*`)

            array.forEach(c => embed.addFields({ name: `**・ ${c.name} | \`${c.rarity}%\` (rareté: \`${c.pourcentage}/100\`)**`, value: `┖ ${!c.coins && !c.role && !c.rep && !c.jetons ? "Pas de récompense automatique configurée" : `${c.role ? `(<@&${c.role}>) ` : ""}${c.coins ? `(\`${c.coins} coins\`) ` : ""}${c.rep ? `(\`${c.rep} rep\`) ` : ""}${c.jetons ? `(\`${c.jetons} jetons\`)` : ""} `}`}))
            interaction.reply({ embeds: [embed]})
        } else if(interaction.options.getSubcommand() == "remove") {
            const name = interaction.options.getString('name')
            const array = JSON.parse(req.items).filter(o => o.name !== name)

            const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Récompense retirée !`)
            .setFooter({ text: config.footerText })
            .setDescription(`Nom: \`${name}\``)
            bot.db.prepare(`UPDATE guild SET items = @coins WHERE id = @id`).run({ coins: JSON.stringify(array), id: interaction.guild.id });
            interaction.reply({ embeds: [embed]})
        }
    }
}