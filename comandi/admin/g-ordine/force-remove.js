const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder , PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../../../database/data.json');

module.exports = {
    name: "force-remove",
    async execute(client, message) {

        // Prende i dati inseriti nel comando
        const cliente = message.options.getUser('cliente');

        // Apertura database
        const data = JSON.parse(fs.readFileSync(filePath));
        const idOrdine = data.ordini[cliente.id].num;

        // Creo un embed
        const logEmbed = new EmbedBuilder()
            .setTitle("NEW • Ho force rimoddo l'ordine "+ idOrdine +" dal database")
            .setDescription("L'ordine "+ idOrdine +" è stato force rimosso dal database con successo.")
            .setColor(0xff6059)
            .setFields([
                {
                    name: "<:8808985803:970628760355373096> Numero ordine:",
                    value: ""+idOrdine+"",
                    inline: true
                },
                {
                    name: "<:88089855602052:970628760158208053> Cliente:",
                    value: ""+cliente.tag,
                    inline: true
                },
                {
                    name: "<:88090116978916:970628760376340480> Addetto:",
                    value: "<@"+message.user.id+">",
                    inline: true
                }
            ])
            .setFooter({ text: message.guild.name })
            .setTimestamp();
        
        // --- Codice

        const clienteId = ""+cliente.id+"";
        const logChannel = client.channels.cache.get(data.log.private);
        const canale = data.ordini[clienteId].chat;

        // Controllo se l'utente non è gia presente nel database
        if(data.ordini[clienteId] == null)
            return message.reply({ content: "<:error:1058549228605022309> • L'utente inserito non ha un ordine in sospeso, prova `/ordine lista`? ", ephemeral: true }); 

        message.reply({ content: "<:accetto:889529595282464808> • Ho rimosso correttamente l'ordine `"+ idOrdine +"` di "+ cliente.tag +" " , ephemeral: true });
        logChannel.send({ content: ``, embeds: [logEmbed] });

        // rimuovo l'ordine dal database
        delete data.ordini[clienteId];

        let json = JSON.stringify(data);

        fs.writeFile(filePath, json, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('(/) Database aggiornato con successo!');
            }
          });
    }
}