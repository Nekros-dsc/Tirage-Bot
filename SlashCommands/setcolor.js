const Discord = require('discord.js');
const array = [
    { name: "Rouge", value: "#FF0000" }, 
    { name: "Vert", value: "#00FF00" }, 
    { name: "Bleu", value: "#0000FF" }, 
    { name: "Jaune", value: "#FFFF00" }, 
    { name: "Orange", value: "#FFA500" }, 
    { name: "Violet", value: "#800080" }, 
    { name: "Rose", value: "#FFC0CB" }, 
    { name: "Marron", value: "#A52A2A" }, 
    { name: "Gris", value: "#808080" }, 
    { name: "Noir", value: "#000000" }, 
    { name: "Blanc", value: "#FFFFFF" }
];
module.exports = {
    name: 'setcolor',
    description: 'Définit la couleur de l\'embed de tirage.',
    dm_permission: false,
    perm: 'OWNER',
    options: [
        {
            type: 3,
            name: 'color',
            description: 'New color.',
            required: true,
            choices: array
        }
    ],
    run: async (bot, interaction, args, config, data) => {
        const color = interaction.options.getString('color')
        const embed = new Discord.EmbedBuilder()
        .setColor(color)
        .setTitle(`La couleur a bien été changée !`)
        .setFooter({ text: config.footerText })
        bot.db.prepare(`UPDATE guild SET color = @coins WHERE id = @id`).run({ coins: color, id: interaction.guild.id });
        interaction.reply({ embeds: [embed]})
    }
}