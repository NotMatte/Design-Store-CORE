const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder , PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../../../database/data.json');

module.exports = {
    name: "force-add",
    async execute(client, message) {

        // Prende i dati inseriti nel comando
        const cliente = message.options.getUser('cliente');
        const idOrdine = message.options.getString('id-ordine');
        const canale = message.options.getChannel('canale');
        const commissione = message.options.getString('commissione');
        const prezzo = message.options.getString('prezzo');

        // Controllo se la stringa "prezzo" contiene il simbolo €
        if (!prezzo.includes("€"))
            return message.reply({ content: "<:error:1058549228605022309> • Inserisci un prezzo contentente `€` (Es. 10€ - 4,50€). Riprova?", ephemeral: true });

        // Controllo se nella stringa commissione ci siano anche i numeri
        if (!commissione.match(/\d+/g))
            return message.reply({ content: "<:error:1058549228605022309> • Inserisci anche la quantità e l'eventuale servizio di riferimento nella dichiarazione (Es. `1x Logo (PVPHUB)`). Riprova?", ephemeral: true });


        // Creo un embed
        const newsEmbed = new EmbedBuilder()
            .setTitle("📌  Il tuo ordine è stato aggiunto al database")
            .setDescription("L'ordine "+ idOrdine +" è stato aggiunto al database con successo, visualizza\nlo stato del tuo ordine con `/ordine info "+ cliente.username +"` e attendi che ti\nvenga notificata l'inizio della procedura tramite ping dal bot.\n\nTi ringraziamo ancora per aver scelto i nostri servizi!")
            .setColor(0xff6059)
            .setFooter({ text: "Inoltrato da " + message.user.tag + "", iconURL: "https://i.imgur.com/wKKtFXA.png"})
            .setTimestamp();

        const logEmbed = new EmbedBuilder()
            .setTitle("NEW • Ho force addato l'ordine "+ idOrdine +" al database")
            .setDescription("L'ordine "+ idOrdine +" è stato force addato al database con successo.")
            .setColor(0xff6059)
            .setFields([
                {
                    name: "<:8808985803:970628760355373096> Commissione:",
                    value: ""+ commissione +" `"+ prezzo +"`",
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

        // Apertura database
        const data = JSON.parse(fs.readFileSync(filePath));
        
        // Controllo se l'id dell'ordine non è presente nel database
        function containsOnlyNumbers(str) {
            return /^\d+$/.test(str);
        }
        if(!containsOnlyNumbers(idOrdine) || idOrdine.length != 3){
            message.reply({ content: "<:error:1058549228605022309> • L'ID inserito non è valido. Riprova?", ephemeral: true });
            return;
        }
        for (const key in data.ordini) {
            if (data.ordini.hasOwnProperty(key)) {
                const element = data.ordini[key];
                if(element.num == idOrdine)
                    return message.reply({ content: "<:error:1058549228605022309> • L'ID inserito è già presente nel database.", ephemeral: true });
            }
        }

        // --- Codice
        const clienteId = ""+cliente.id+"";

        // Controllo se l'utente non è gia presente nel database
        if(data.ordini[clienteId] != null)
            return message.reply({ content: "<:error:1058549228605022309> • L'utente inserito ha già un ordine in sospeso.", ephemeral: true });

        const logChannel = client.channels.cache.get(data.log.private);

        message.reply({ content: "Ho aggiornato correttamente l'ordine "+ idOrdine +" di "+ cliente.username +" in " + `<#${canale.id}>` , ephemeral: true });
        logChannel.send({ content: ``, embeds: [logEmbed] });
        canale.send({ content: `<@${cliente.id}>`, embeds: [newsEmbed] });

        // Prendo la data di oggi
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes();

        // Aggiorna il database
        data.ordini[clienteId] = {
            nick: ""+cliente.username+"",
            chat: ""+canale.id+"",
            num: ""+idOrdine+"",
            stato: "🔴 non assegnato",
            addetto: ""+message.user.id+"",
            data:""+date+" "+time+"",
            commissione:""+commissione+"",
            prezzo:""+prezzo+""
        };

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