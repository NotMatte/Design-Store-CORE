const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder , PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../../../database/data.json');

module.exports = {
    name: "notify",
    async execute(client, message) {

        // Prende i dati inseriti nel comando
        const cliente = message.options.getUser('cliente');
        
        // Creo un embed
        const newsEmbed = new EmbedBuilder()
            .setTitle("⚡ Ci sono novità nel tuo ordine")
            .setDescription("Ti informiamo che NotMatte ha iniziato a lavorare al tuo ordine,\ndi solito per lavori di normale difficoltà il tempo necessario va \ndalle **2/6 ore** mentre per lavori più semplici anche sono **1 ora**.\n\nTi ricordiamo che puoi sempre monitorare lo stato del tuo\nordine attraverso il comando `/ordine info <user>`.")
            .setColor(0xffbc58)
            .setFooter({ text: "Inoltrato da " + message.user.tag + "", iconURL: "https://i.imgur.com/wKKtFXA.png"})
            .setTimestamp();

        const logEmbed = new EmbedBuilder()
            .setTitle("⚡ Novità ordine")
            .setDescription("L'addetto <@"+message.user.id+"> ha notificato "+ cliente.username +" in " + `<#${aux}>` +".")
            .setColor(0xffbc58)
            .setFooter({ text: "Inoltrato da " + message.user.tag + "", iconURL: "https://i.imgur.com/wKKtFXA.png"})
            .setTimestamp();


        // Apertura database
        const data = JSON.parse(fs.readFileSync(filePath));
        

        // --- Codice
        const clienteId = ""+cliente.id+"";
        console.log("DEBUG: ID cliente: " + clienteId);

        // Controllo se l'utente ha già un ordine aperto
        if(data.ordini[clienteId] == null){
            message.reply({ content: "<:error:1058549228605022309> • L'utente inserito non ha ancora aperto un ordine. Roprova o usa `/clienti force-add`", ephemeral: true });
            return;
        }

        var aux = data.ordini[clienteId].chat;
        var canale = message.guild.channels.cache.get(aux);

        newsEmbed.setFields([
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

        // Tiene aggiornato l'utente in DM
        try {
            client.users.fetch(clienteId).then(user => {
                user.send("⚡ Ci sono novità nel tuo ordine, corri a vederlo <#" + canale.id + ">");
                canale.send({ content: ``, embeds: [newsEmbed] });
            });
        } 
        catch (error) {
            console.log(error);
            canale.send({ content: `<@${cliente.id}>`, embeds: [newsEmbed] });
        }

        message.reply({ content: "Ho notificato correttamente "+ cliente.username +" in " + `<#${aux}>` , ephemeral: true });
        const logChannel = message.guild.channels.cache.get(data.log.public);
        
        const commissione = data.ordini[clienteId].commissione;
        // Rendo tutto minuscolo la stringa commissione
        const commissioneLower = commissione.toLowerCase();

        // Invia il log con AI integrato
        if(commissioneLower.includes("logo"))
            logChannel.send({ content: "<:8319folder:1023185173824671754> **CURRIENTLY WORKING **\n\n• Customers: `@"+ data.ordini[clienteId].nick +"`\n• Product: `"+ data.ordini[clienteId].commissione +"`\n• Ordine: `"+ data.ordini[clienteId].num +"`\n\nIl lavoro sarà disponibile al pubblico\nnell'apposita sezione <#967102665714708550>" });
        else if(commissioneLower.includes("ita"))
            logChannel.send({ content: "<:8319folder:1023185173824671754> **CURRIENTLY WORKING **\n\n• Customers: `@"+ data.ordini[clienteId].nick +"`\n• Product: `"+ data.ordini[clienteId].commissione +"`\n• Ordine: `"+ data.ordini[clienteId].num +"`\n\nIl lavoro sarà disponibile al pubblico\nnell'apposita sezione <#970046660275228702>" });
        else if(commissioneLower.includes("banner"))
            logChannel.send({ content: "<:8319folder:1023185173824671754> **CURRIENTLY WORKING **\n\n• Customers: `@"+ data.ordini[clienteId].nick +"`\n• Product: `"+ data.ordini[clienteId].commissione +"`\n• Ordine: `"+ data.ordini[clienteId].num +"`\n\nIl lavoro sarà disponibile al pubblico\nnell'apposita sezione <#970046660275228702>" });
        else if(commissioneLower.includes("twitch"))
            logChannel.send({ content: "<:8319folder:1023185173824671754> **CURRIENTLY WORKING **\n\n• Customers: `@"+ data.ordini[clienteId].nick +"`\n• Product: `"+ data.ordini[clienteId].commissione +"`\n• Ordine: `"+ data.ordini[clienteId].num +"`\n\nIl lavoro sarà disponibile al pubblico\nnell'apposita sezione <#970040314138083359>" });
        else if(commissioneLower.includes("trailer"))
            logChannel.send({ content: "<:8319folder:1023185173824671754> **CURRIENTLY WORKING **\n\n• Customers: `@"+ data.ordini[clienteId].nick +"`\n• Product: `"+ data.ordini[clienteId].commissione +"`\n• Ordine: `"+ data.ordini[clienteId].num +"`\n\nIl lavoro sarà disponibile al pubblico\nnell'apposita sezione <#970040314138083359>" });
        else if(!commissioneLower.includes("ita") && !commissioneLower.includes("logo") && !commissioneLower.includes("banner") && !commissioneLower.includes("twitch") && !commissioneLower.includes("trailer")){
            logChannel.send({ content: "<:8319folder:1023185173824671754> **CURRIENTLY WORKING **\n\n• Customers: `@"+ data.ordini[clienteId].nick +"`\n• Product: `"+ data.ordini[clienteId].commissione +"`\n• Ordine: `"+ data.ordini[clienteId].num +"`\n\nIl lavoro sarà disponibile al pubblico\nnell'apposita sezione <#970046660275228702>" }); 
        }
        
            // Aggiorna il database
        data.ordini[clienteId].stato = "🟡 in lavorazione";

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