const { Client, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../database/data.json');

module.exports = {
    name: "controlloPerms",
    /**
    * @param {Client} client
    * @param {Interaction} interaction
    */
    controllo(client, message) {

        // Costruisci l'embed
        var stocazzEmbed = new EmbedBuilder()
            .setColor(0xF44336)
            .setTitle('Ho riscontrato un errore nel farlo...')
            .setDescription('Sembrerebbe che tu non abbia il permesso per farlo.\nControlla i tuoi permessi o contatta un admin.')
            .setTimestamp();

        // Leggi il file
        const data = JSON.parse(fs.readFileSync(filePath));

        // Controlla che non sei lo sviluppatore del bot
        if(message.member.id == process.env.ID_ADMIN){
            return true;
        }

        // Controlla se l'utente ha i permessi
        var manager = message.member.roles.cache.has(data.perms.manager);
        var staff = message.member.roles.cache.has(data.perms.staff);
        var all = message.member.roles.cache.has(data.perms.all);

        if( all || manager || staff){
            return true; // Ha i permessi
        }
        else{
            stocazzEmbed.setDescription('Non hai i permessi per eseguire questo comando,\nse pensi sia un errore contatta un admin\ndel server discord in cui ti trovi.');
            message.reply({ content: '', embeds: [stocazzEmbed], ephemeral: true });
            return false; // Non ha i permessi
        }
    }
}