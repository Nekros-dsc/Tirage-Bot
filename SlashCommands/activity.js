const Discord = require('discord.js');

const activity = {
    "COMPETING": Discord.ActivityType.Competing,
    "CUSTOM": Discord.ActivityType.Custom,
    "PLAYING": Discord.ActivityType.Playing,
    "WATCHING": Discord.ActivityType.Watching,
    "STREAMING": Discord.ActivityType.Streaming,
    "LISTENING": Discord.ActivityType.Listening
}

const status = {
    "Inactif": "idle",
    "En ligne": "online",
    "Ne pas déranger": "dnd",
    "Invisible": "offline"
}
module.exports = {
    name: 'activity',
    description: 'Modifie l\'activité du bot.',
    dm_permission: false,
    perm: 'OWNER',
    options: [
        {
            type: 3,
            name: 'value',
            description: 'Nouvelle valeur (null pour retirer)',
            required: false,
        },
        {
            type: 3,
            name: 'type',
            description: 'Type de l\'activité.',
            required: false,
            choices: ['COMPETING', 'CUSTOM', 'PLAYING', 'WATCHING', 'STREAMING', 'LISTENING'].map(i => ({ name: i, value: i }))
        },
        {
            type: 3,
            name: 'status',
            description: 'Status de l\'activité.',
            required: false,
            choices: ['Inactif', 'En ligne', 'Ne pas déranger', 'Invisible'].map(i => ({ name: i, value: i }))
        }
    ],
    run: async (bot, interaction, args, config) => {
        const req = bot.functions.checkBot(bot, bot.user.id)
        let json = {"name": null, "type": null, "status": null }
        if(req.activity) json = JSON.parse(req.activity)

        json["status"] = interaction.options.getString('status') ? status[interaction.options.getString('status')] : json.value
        json["type"] = interaction.options.getString('type') ? activity[interaction.options.getString('type')] : json.type
        json["name"] = interaction.options.getString('value') ? interaction.options.getString('value') : json.name

        bot.db.prepare(`UPDATE bot SET activity = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: bot.user.id });
        await bot.user.setPresence({ activities: [{ name: json.name, type: json.type, url: "https://twitch.tv/ruwin2007yt" }], status: json.status });
        interaction.reply({ content: `:white_check_mark: Mon activité a bien été modifié !\n*Si celle-ci ne s'est pas modifié veuillez patienter*`, ephemeral: true })
    }
}
