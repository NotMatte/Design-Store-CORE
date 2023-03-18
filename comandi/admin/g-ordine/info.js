const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder , PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../../../database/data.json');

module.exports = {
    name: "info",
    async execute(client, message) {
        
        // Creo un embed
        const infoEmbed = new EmbedBuilder()
            .setTitle("📌  ORDINE 000 - Info & stato")
            .setDescription("Sei stato riconosciuto con successo come proprietario dell'ordine.")
            .setColor(0x2f3136)
            .setFooter({ text: "Richiesto da " + message.user.tag + "", iconURL: "https://i.imgur.com/wKKtFXA.png"})
            .setTimestamp();

        // Prende i dati inseriti nel comando
        const cliente = message.options.getUser('utente');

        // Apertura database
        const data = JSON.parse(fs.readFileSync(filePath));
        

        // --- Codice
        const clienteId = ""+cliente.id+"";
    
        // Controllo se l'utente ha già un ordine aperto
        if(data.ordini[clienteId] == null){
            message.reply({ content: "<:error:1058549228605022309> • L'utente inserito non ha un ordine in sospeso. Riprova?", ephemeral: true });
            return;
        }

        var manager = message.member.roles.cache.has(data.perms.manager);
        var staff = message.member.roles.cache.has(data.perms.staff);
        var all = message.member.roles.cache.has(data.perms.all);

        // Controlla che l'utente sia proprio dell'ordine
        if(clienteId != message.user.id && message.user.id != data.ordini[clienteId].addetto && message.user.id != process.env.ID_ADMIN && !all && !manager && !staff){
            // Non è autorizzato
            return message.reply({ content: "<:error:1058549228605022309> • Non sei autorizzato a ottenere info riguardo questo ordine. Riprova?", ephemeral: true });
        }
        else{
            infoEmbed.setTitle("📌  ORDINE "+data.ordini[clienteId].num+" - Info & stato");
            if(data.ordini[clienteId].stato == "🔴 non assegnato"){
                infoEmbed.setFields([
                    {
                        name: "<:88089855602052:970628760158208053> Cliente:",
                        value: ""+cliente.tag,
                        inline: true
                    },
                    {
                        name: "<:88090003736064000:970628760384700506> Stato:",
                        value: ""+data.ordini[clienteId].stato,
                        inline: true
                    },
                    {
                        name: "<:88090116978916:970628760376340480> Addetto:",
                        value: "<@"+data.ordini[clienteId].addetto+">",
                        inline: true
                    }
                ]);
            }
            else{
                infoEmbed.setFields([
                    {
                        name: "<:88089855602052:970628760158208053> Cliente:",
                        value: ""+cliente.tag,
                        inline: true
                    },
                    {
                        name: "<:88090003736064000:970628760384700506> Stato:",
                        value: ""+data.ordini[clienteId].stato,
                        inline: true
                    },
                    {
                        name: "<:88090116978916:970628760376340480> Addetto:",
                        value: "<@"+data.ordini[clienteId].addetto+">",
                        inline: true
                    },
                    {
                        name: "<:880900049855463524:970628760476979220> Aperto il:",
                        value: ""+data.ordini[clienteId].data+"",
                        inline: true
                    },
                    {
                        name: "<:8808985803:970628760355373096> Commissione:",
                        value: ""+data.ordini[clienteId].commissione+"",
                        inline: true
                    },
                    {
                        name: "<:880900065898668:970628760359534593> Prezzo:",
                        value: ""+data.ordini[clienteId].prezzo+"",
                        inline: true
                    }
                ]);
            }

            message.reply({ content: '', embeds: [infoEmbed], ephemeral: true });
        }
    }
}