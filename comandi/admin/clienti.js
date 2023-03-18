const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction } = require('discord.js');
console.log("\x1b[32m" + '(/) Caricato comando /clienti' + "\x1b[37m"); /* Console log */

module.exports = {
    name: "cliente",
    data: {
        name: "cliente",
        description: "Rendi cliente un utente. (Solo admin)",
        options: [
            {
                name: "utente",
                description: "Seleziona l'utente da rendere cliente.",
                type: 6, //User type
                required: true
            }
        ]
    },
    /**
    * @param {Client} client
    * @param {Interaction} interaction
    */
    async execute(client, message) {

        //Salva i dati
        const utente = message.options.getUser("utente");
        const member = message.guild.members.cache.get(utente.id);
        const nickname = "(Customer) " + utente.username;

        var canale = client.channels.cache.get('1051100642116120576');
        var ruoloCliente = message.guild.roles.cache.get(process.env.ID_RUOLO_CLIENTE);

        //Creato l'embed
        const embedAtorizzato = new EmbedBuilder()
            .setColor(0x78f597)
            .setAuthor({ name: "NEW CUSTOMER • " + utente.tag })
            .setDescription("<@" + utente.id + "> è stato promosso a <@&"+ process.env.ID_RUOLO_CLIENTE +">")
            .addFields(
                { name: 'Promosso da:', value: message.user.tag, inline: true },
            )
            .setTimestamp()
	        .setFooter({ text: message.guild.name });

        //Controlla se il canale è un ticket
        if (message.member.roles.cache.has(process.env.ID_RUOLO_STAFF)) {
            //E' autorizzato
            if(member.roles.cache.has(process.env.ID_RUOLO_CLIENTE)){
                //Non apposto perche era gia cliente
                await message.reply({ content: '<:3595failed:1023168329462075452> **' + utente.tag + '** risulta già essere un cliente, riprova?', ephemeral: true });
            } else{
                //Apposto perche non era cliente
                await member.setNickname(nickname);
                await member.roles.add(ruoloCliente);
                await message.reply({ content: "<:9294passed:1023185182573985852> **" + utente.tag + "** è diventato un cliente.", ephemeral: true });
                await canale.send({ content: '', embeds: [embedAtorizzato] });  
            }
        } else {
            //Non è autorizzato
            await message.reply({ content: '<:3595failed:1023168329462075452> Non hai il permesso <@&' + process.env.ID_RUOLO_STAFF + '> per eseguire questo comando.', ephemeral: true });
        }
    }
}