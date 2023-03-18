const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder , PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../../../database/data.json');

module.exports = {
    name: "lista",
    async execute(client, message) {

        // Creo un embed
        const newsEmbed = new EmbedBuilder()
            .setTitle("⭐  LISTA ORDINI - Attualmente sono in sospeso...")
            .setDescription("Utilizza anche `/ordine info` per ottenere info riguardo gli ordine.")
            .setColor(0x2f3136)
            .setFooter({ text: "Inoltrato da " + message.user.tag + "", iconURL: "https://i.imgur.com/wKKtFXA.png"})
            .setTimestamp();

        // Apertura database
        const data = JSON.parse(fs.readFileSync(filePath));


        // --- Codice

        // Stampo tutti gli ordini
        for(const key in data.ordini){
            // Prendo l'utente dall'id
            let cliente = await client.users.fetch(data.ordini[key].addetto);

            // Se l'ordine in questione presenta il testo "non assegnato" allora lo sostituisco con "Non assegnato"
            if(data.ordini[key].stato == "🔴 non assegnato"){
                newsEmbed.addFields([
                    {
                        name: "Ordine "+data.ordini[key].num+"",
                        value: "`Cliente:` "+data.ordini[key].nick+"\n`Stato:`  "+data.ordini[key].stato+"\n`Addetto:` "+cliente.username+"\n`Data:` "+data.ordini[key].data+"",
                        inline: true
                    }
                ]);
            }
            else{
                newsEmbed.addFields([
                {
                    name: "Ordine "+data.ordini[key].num+"",
                    value: "`Cliente:` "+data.ordini[key].nick+"\n`Stato:`  "+data.ordini[key].stato+"\n`Addetto:` "+cliente.username+"\n`Data:` "+data.ordini[key].data+"\n`Lavoro:` "+data.ordini[key].commissione+"\n`Prezzo:` "+data.ordini[key].prezzo+"",
                    inline: true
                }
                ]);
            }



            
        }

        // Invio l'embed
        message.reply({ embeds: [newsEmbed], ephemeral: true });

    }
}