const { Client, ChannelType, roles, Guild, Events, SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

// Costruisci il percorso del file
const filePath = path.join(__dirname, '../../database/data.json');

module.exports = {
    name: "blaklist",
    data: {
        name: "blaklist",
        description: "Blacklista un utente e il suo server. (Solo admin)",
        options: [
            {
                name: "utente",
                description: "Seleziona l'utente da blaklistare.",
                type: 6, //User type
                required: true
            },
            {
                name: "ragione",
                description: "Seleziona la motivazione del blaklist.",
                type: 3 //String type
            },
            {
                name: "server",
                description: "Inserisci il server da blacklistare.",
                type: 3 //String type
            }
        ]
    },
    /**
    * @param {Client} client
    * @param {Interaction} interaction
    */
    async execute(client, message) {

        // Prende i dati inseriti nel comando
        const utente = message.options.getUser('utente');
        const ragione = message.options.getString('ragione') || "Nessuna ragione fornita";
        const server = message.options.getString('server') || "n/a";
        const random = Math.floor(Math.random() * 999) + 1;
        
        // Apertura dataase
        const data = JSON.parse(fs.readFileSync(filePath));

        // Creo un embed
        const newsEmbed = new EmbedBuilder()
            .setDescription("<:2813hello:1023168324433100841>  Il server "+ server +" è stato blaklistato dallo store per vilazione del regolamento.")
            .setColor(0xdd2e44)
            .setFooter({ text: "Operatore: " + message.user.tag + "", iconURL: "https://i.imgur.com/wKKtFXA.png"})
            .setTimestamp();

        const logEmbed = new EmbedBuilder()
            .setTitle("🔴  NEW Blacklist - Utente "+ utente.username)
            .setDescription("L'untente **"+ utente.tag +"** è stato blacklistato dal server con successo\n(Utilizza anche /blacklist lista per info su tutto le blacklist attive).")
            .setColor(0xdd2e44)
            .setFields([
                { name: "<:88090116978916:970628760376340480> Staffer:", value: ""+message.user.tag, inline: true },
                { name: "<:88089855602052:970628760158208053> Utente:", value: "<@"+utente.id+">", inline: true },
                { name: "<:error:1058549228605022309> Server blacklistato:", value: ""+server, inline: true },
                { name: "<:880900065898668:970628760359534593> ID Blacklist:", value: ""+random, inline: true },
                { name: "<:8808985803:970628760355373096> Ragione:", value: ""+ragione, inline: true }
            ])
            .setFooter({ text: message.guild.name })
            .setTimestamp();

        const dmEmbed = new EmbedBuilder()
            .setTitle("Ops, sei stato blacklistato...")
            .setDescription(utente.tag +" sei stato blacklistato dal server, ecco le info della blacklist:")
            .setColor(0xdd2e44)
            .setFields([
                { name: "<:88090116978916:970628760376340480> Staffer:", value: ""+message.user.tag, inline: true },
                { name: "<:error:1058549228605022309> Server blacklistato:", value: ""+server, inline: true },
                { name: "<:88089855602052:970628760158208053> ID Blacklist:", value: ""+random, inline: true },
                { name: "<:88090003736064000:970628760384700506> Data:", value: ""+new Date().toLocaleString(), inline: true },
                { name: "<:8808985803:970628760355373096> Ragione:", value: ""+ragione, inline: true }
            ])
            .setFooter({ text: message.guild.name })
            .setTimestamp();

        //Bottone
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
 					.setLabel('🔗 Crea un appeal')
                    .setURL('https://ds.notmatte.store/')
					.setStyle(ButtonStyle.Link),
			);

        // --- Prendo i canali

        const logChannelPublic = message.guild.channels.cache.get('967104706126151721');
        const logChannelPrivate = message.guild.channels.cache.get(data.log.private);

        // --- Controlli
        
        var manager = message.member.roles.cache.has(data.perms.manager);
        var staff = message.member.roles.cache.has(data.perms.staff);
        var all = message.member.roles.cache.has(data.perms.all);

        if(!manager && !staff && !all)
            return message.reply({ content: "<:error:1058549228605022309> • Non hai i permessi per usare questo comando, riprova?", ephemeral: true });

        // Controllo se l'utente del server ha il ruolo con l'id 88089855602052
        const utenteBlacklist = message.guild.members.cache.get(utente.id);
        var managerc = utenteBlacklist.roles.cache.has(data.perms.manager);
        var staffc = utenteBlacklist.roles.cache.has(data.perms.staff);
        var allc = utenteBlacklist.roles.cache.has(data.perms.all);

        // Controllo se l'utente da blacklistare non ha un ruolo staff
        if(managerc || staffc || allc)
            return message.reply({ content: "<:error:1058549228605022309> • Non puoi blacklistare un membro dello staff, riprova?", ephemeral: true });
            
        // Controllo se l'utente è già blacklistato
        if(!data.blacklist[utente.id] == null){
            return message.reply({ content: "<:error:1058549228605022309> • L'utente è già blacklistato, riprova?", ephemeral: true });
        }
            


        // --- Aggiungo l'utente alla blacklist

        data.blacklist[utente.id] = {
            "username": utente.username,
            "tag": ""+utente.tag+"",
            "server": ""+server+"",
            "motivo": ""+ragione+"",
            "staff": ""+message.user.id+"",
            "data": ""+new Date().toLocaleString()+"",
            "id_blacklist": ""+random+""
        }

        // Banno l'utente dal server
        utenteBlacklist.ban({ reason: "Blacklistato da " + message.user.tag + " per: " + ragione + "" });

        // Mando i log
        logChannelPrivate.send({ embeds: [logEmbed] });
        if(server != "n/a"){
            // Prendo la stringa server e la metto in maiuscolo
            let newServer = server.toUpperCase();
            newsEmbed.setDescription("<:2813hello:1023168324433100841>  Il server "+ newServer +" è stato blaklistato dallo store per vilazione del regolamento.")
            logChannelPublic.send({ embeds: [newsEmbed] });
        }


        // --- Mando i log in DM dell'utente blacklistato
        const clienteId = utente.id;
        try {
            client.users.fetch(clienteId).then(user => {
                user.send({ embeds: [dmEmbed], components: [row] });
                message.reply({ content: "<:9294passed:1023185182573985852> • Ho blacklistato correttamente **"+ utente.username +"** dal server. (DM inoltrato)" , ephemeral: true });
            });
        } 
        catch (error) {
            logChannelPrivate.send({ content: "<:error:1058549228605022309> • Non sono riuscito a inoltrare le informazioni della blacklist a " + utente.tag });
            message.reply({ content: "<:9294passed:1023185182573985852> • Ho blacklistato correttamente **"+ utente.username +"** dal server. (DM non inoltrato)" , ephemeral: true });
        }

        // --- Controlle se l'utente non aveva un ordine e se ce l'ha lo rimuovo

        if(!data.ordini[utente.id] == null){
            // Rimuovo l'ordine
            delete data.ordini[utente.id];
            // Mando il log
            logChannelPrivate.send({ content: "<:9294passed:1023185182573985852> • Ho rimosso l'ordine di **"+ utente.username +"** dal dataase." });
        }

        let json = JSON.stringify(data);

        fs.writeFile(filePath, json, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('(/) dataase aggiornato con successo!');
            }
        });
    }
}