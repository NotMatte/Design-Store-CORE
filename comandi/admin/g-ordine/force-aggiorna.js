const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder , PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../../../database/data.json');

module.exports = {
    name: "force-aggiorna",
    async execute(client, message) {

        // Prende i dati inseriti nel comando
        const cliente = message.options.getUser('cliente');
        const stato = message.options.getString('stato');

        // Apertura database
        const data = JSON.parse(fs.readFileSync(filePath));
        const idOrdine = data.ordini[cliente.id].num;

        // Creo un embed
        const newsEmbed = new EmbedBuilder()
            .setTitle("📌  Lo stato del tuo ordine è stato modificato")
             .setDescription("L'ordine "+ idOrdine +" è stato aggiornato in `" + stato + "`\n controlla sempre lo stato del tuo ordine con `/ordine info "+ cliente.username +"`\ne attendi eventuali aggiornamenti che ti verranno notificati in DM.")
            .setColor(0x8becff)
            .setFields([
                {
                    name: "<:8808985803:970628760355373096> ID Ordine:",
                    value: ""+ idOrdine +"`",
                    inline: true
                },
                {
                    name: "<:88090116978916:970628760376340480> Addetto:",
                    value: "<@"+message.user.id+">",
                    inline: true
                },
                {
                    name: "<:88090003736064000:970628760384700506> Stato:",
                    value: "`"+ stato +"`",
                    inline: true
                }
            ])
            .setFooter({ text: "Inoltrato da " + message.user.tag + "", iconURL: "https://i.imgur.com/wKKtFXA.png"})
            .setTimestamp();

        const logEmbed = new EmbedBuilder()
            .setTitle("NEW • Ho force aggiornato l'ordine "+ idOrdine +" con successo")
            .setDescription("L'ordine "+ idOrdine +" è stato aggiornato a STATO.")
            .setColor(0x8becff)
            .setFields([
                {
                    name: "<:8808985803:970628760355373096> ID Ordine:",
                    value: ""+ idOrdine +"`",
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
        
        // Controllo se l'utente non è presente nel database
        if(data.ordini[cliente.id] == null)
            return message.reply({ content: "<:error:1058549228605022309> • L'utente inserito non ha un ordine in sospeso. Riprova?", ephemeral: true });

        // Controllo se lo stato dell'ordine è uguale a quello inserito
        if(data.ordini[cliente.id].stato == stato)
            return message.reply({ content: "<:error:1058549228605022309> • Lo stato dell'ordine è già `"+ stato +"`. Riprova?", ephemeral: true });


        // --- Codice
        const canale = client.channels.cache.get(data.ordini[cliente.id].chat);
        const logChannel = client.channels.cache.get(data.log.private);
        
        logEmbed.setDescription("L'ordine "+ idOrdine +" è stato aggiornato a `"+ stato +"`");
        message.reply({ content: "Ho aggiornato correttamente l'ordine "+ idOrdine +" di "+ cliente.username +" in: `" + stato + "`" , ephemeral: true });
        logChannel.send({ content: ``, embeds: [logEmbed] });
        

        // Prendo la data di oggi
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes();

        // Aggiorna il database
        clienteId = cliente.id;
        data.ordini[clienteId].stato = stato;


        if(stato == "🟡 In lavorazione"){
            data.ordini[cliente.id].addetto = message.user.id;

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
        }

        if(stato == "🟢 Pronto, in attesa..."){

            try {
                client.users.fetch(clienteId).then(user => {
                    user.send("🟢 Il tuo ordine è pronto, corri a vedere l'anteprima <#" + canale.id + ">");
                    canale.send({ content: ``, embeds: [newsEmbed] });
                });
            } 
            catch (error) {
                console.log(error);
                canale.send({ content: `<@${cliente.id}>`, embeds: [newsEmbed] });
            }
        }

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