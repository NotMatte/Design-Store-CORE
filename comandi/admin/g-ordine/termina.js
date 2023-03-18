const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder , PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../../../database/data.json');

module.exports = {
    name: "termina",
    async execute(client, message) {

        // Creo un embed
        const newsEmbed = new EmbedBuilder()
            .setTitle("✅  Ho aggiornato lo stato del tuo ordine")
            .setDescription("Lo stato del tuo ordine è stato aggiornato a **consegnato** pertanto si può definire\nterminato, consigliamo di leggere ugualmente i nostri Termini & Condizioni per\nsapere cosa puoi ancora fare dopo aver effettuato l'ordine, usa `/termini`.")
            .setColor(0x8be956)
            .setFooter({ text: "Aggirnato da " + message.user.tag + "", iconURL: "https://i.imgur.com/wKKtFXA.png"})
            .setTimestamp();
        
        const logEmbed = new EmbedBuilder()
            .setTitle("ORDINE 000 TERMINATO • ")
             .setDescription("L'ordine 000 è stato terminato con successo e il suo stato è stato *consegnato*.")
            .setColor(0xebf38b)
            .setFields([
                {
                    name: "Terminato da:",
                    value: ""+message.user.tag,
                    inline: true
                }
            ])
            .setFooter({ text: message.guild.name })
            .setTimestamp();

        // Prende i dati inseriti nel comando
        const cliente = message.options.getUser('cliente');

        // Apertura database
        const data = JSON.parse(fs.readFileSync(filePath));
        

        // --- Codice
        const clienteId = ""+cliente.id+"";

        // Controllo se l'utente non è gia terminato
        const str = data.ordini[clienteId].stato;
        if(str.includes("consegnato")){
            message.reply({ content: "<:error:1058549228605022309> • L'ordine in questione risulta già consegnato, riprova?", ephemeral: true });
            return;
        }

        // Aggiorna gli embed
        newsEmbed.setFields([
            {
                name: "<:88090116978916:970628760376340480> Addetto:",
                value: "<@"+message.user.id+">",
                inline: true
            }
        ]);

        logEmbed.setTitle("ORDINE "+data.ordini[clienteId].num+" TERMINATO • " + cliente.username);
        logEmbed.setDescription("L'ordine "+data.ordini[clienteId].num+" è stato terminato con successo e il suo stato è stato *consegnato*.");
        logEmbed.setFields([
            {
                name: "<:8808985803:970628760355373096> Numero ordine:",
                value: ""+data.ordini[clienteId].num,
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
        ]);

        var canale = message.guild.channels.cache.get(data.ordini[clienteId].chat);
        var canaleLog = message.guild.channels.cache.get(data.log.private);

        message.reply({ content: "Ho aggiornato correttamente l'ordine "+ data.ordini[clienteId].num +" di "+ data.ordini[clienteId].nick +"in consegnato " + `<#${data.ordini[clienteId].chat}>` , ephemeral: true });
        canaleLog.send({ embeds: [logEmbed] });
        canale.send({ content: `<@${cliente.id}>`, embeds: [newsEmbed] });

        // --- Imposta il ruolo
        const member = message.guild.members.cache.get(clienteId);
        const nickname = "(Customer) " + cliente.username;

        var cannaleLogRuolo = client.channels.cache.get(data.log.private);
        var ruoloCliente = message.guild.roles.cache.get(process.env.ID_RUOLO_CLIENTE);

        //Creato l'embed
        const embedAtorizzato = new EmbedBuilder()
            .setColor(0x78f597)
            .setAuthor({ name: "NEW CUSTOMER • " + cliente.tag })
            .setDescription("<@" + cliente.id + "> è stato promosso a <@&"+ process.env.ID_RUOLO_CLIENTE +">")
            .addFields(
                { name: 'Promosso da:', value: message.user.tag, inline: true },
            )
            .setTimestamp()
	        .setFooter({ text: message.guild.name });

        //E' autorizzato
        if(!member.roles.cache.has(process.env.ID_RUOLO_CLIENTE)){
            await member.setNickname(nickname);
            await member.roles.add(ruoloCliente);
            await cannaleLogRuolo.send({ content: '', embeds: [embedAtorizzato] });  
        }

        // --- Aggiorna il database
        data.ordini[clienteId].stato = "🟢 consegnato";

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