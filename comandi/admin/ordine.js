const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder, PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const controlloPerms = require('../../funzioni/controlloPerms.js');

console.log("\x1b[32m" + '(/) Caricato il gruppo di comandi: /config' + "\x1b[37m"); /* Console log */

module.exports = {
    name: "ordine",
    data: new SlashCommandBuilder()
        .setName('ordine')
        .setDescription('Gestigli la configurazione del bot.')
        .addSubcommand(subcommand => subcommand /* Sottocomando notify */
            .setName('notify')
            .setDescription('Notifica un cliente che il suo ordine è in corso di preparazione. (Solo staff)')
            .addUserOption(option => option
                .setName('cliente')
                .setDescription('Seleziona il cliente da notificare.')
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand /* Sottocomando lista */
            .setName('lista')
            .setDescription('Visualizza la lista di ordini presenti nel database. (Solo staff)'))
        .addSubcommand(subcommand => subcommand /* Sottocomando force-aggiorna */
            .setName('force-aggiorna')
            .setDescription('Aggiorna forzatamente lo stato di un ordine. (Solo staff)')
            .addUserOption(option => option
                .setName('cliente')
                .setDescription("Seleziona il cliente dell'ordine")
                .setRequired(true))
            .addStringOption(option =>
                option.setName('stato')
                    .setDescription('Seleziona lo stato dell\'ordine da aggiornare. (Solo staff)')
                    .setRequired(true)
                    .addChoices(
                        { name: '🔴 Non assegnato', value: '🔴 Non assegnato' },
                        { name: '📌 Non pronto', value: '🟠 In lista (non pronto)' },
                        { name: '📌 In lavorazione', value: '🟡 In lavorazione' },
                        { name: '📌 Pronto, in attesa', value: '🟢 Pronto, in attesa...' },
                        { name: '🟢 Consegnato', value: '🟢 Consegnato' },
            )))
        .addSubcommand(subcommand => subcommand /* Sottocomando force-add */
            .setName('force-add')
            .setDescription('Aggiungi un utente al database. (Solo staff)')
            .addChannelOption(option => option
                .setName('canale')
                .setDescription("Seleziona il canale dell'ordine")
                .setRequired(true))
            .addStringOption(option => option
                .setName('id-ordine')
                .setDescription("Inserisci l'id dell'ordine (A tre cifre, es: 027)")
                .setRequired(true))
            .addUserOption(option => option
                .setName('cliente')
                .setDescription("Seleziona il cliente dell'ordine")
                .setRequired(true))
            .addStringOption(option => option
                .setName('commissione')
                .setDescription("Inserisci la tipologia di commissione dell'ordine (Es 1x Logo)")
                .setRequired(true))
            .addStringOption(option => option
                .setName('prezzo')
                .setDescription("Inserisci il prezzo della commissione (Es 10,50€)")
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand /* Sottocomando force-avvio */
            .setName('force-avvia')
            .setDescription('Force-avvia la procedura di un ordine. (Solo staff)')
            .addChannelOption(option => option
                .setName('canale')
                .setDescription("Seleziona il canale dell'ordine")
                .setRequired(true))
            .addStringOption(option => option
                .setName('id-ordine')
                .setDescription("Inserisci l'id dell'ordine (A tre cifre, es: 027)")
                .setRequired(true))
            .addUserOption(option => option
                .setName('cliente')
                .setDescription("Seleziona il cliente dell'ordine")
                .setRequired(true))
            .addStringOption(option =>
                option.setName('prdotto')
                    .setDescription('Seleziona il prodotto da commissionare. (Solo staff)')
                    .setRequired(true)
                    .addChoices(
                        { name: '🎨 Logo', value: 'logo' },
                        { name: '📢 Banner Annunci MC', value: 'banner-annunci-mc' },
                        { name: '🏹 Banner MC-ITA', value: 'banner-mc-ita' },
                        { name: '⭐ Banner TW o YT', value: 'banner-social' },
                        { name: '📊 Twitch panels', value: 'twitch-panels' },
                        { name: '💻 Miniatura video', value: 'miniatura' },
                ))
            .addNumberOption(option => option
                .setName('quantità')
                .setDescription("Inserisci la quantità di commissione (Es. 1)")
                .setRequired(true))
            .addStringOption(option => option
                .setName('prezzo')
                .setDescription("Inserisci il prezzo della commissione (Es 10,50€)")
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand /* Sottocomando force-remove */
            .setName('force-remove')
            .setDescription('Rimuovi un utente al database. (Solo staff)')
            .addUserOption(option => option
                .setName('cliente')
                .setDescription("Seleziona il cliente dell'ordine")
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand /* Sottocomando crea */
            .setName('crea')
            .setDescription('Inizia la configurazione di un nuovo ordine. (Solo a ticket aperto)')
            .addUserOption(option => option
                .setName('cliente')
                .setDescription("Seleziona il cliente dell'ordine")
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand /* Sottocomando info */
            .setName('info')
            .setDescription('Ottieni informazioni riguardo il tuo ordine')
            .addUserOption(option => option
                .setName('utente')
                .setDescription("Seleziona l''utente da controllare")
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand /* Sottocomando termina */
            .setName('termina')
            .setDescription('Imposta lo stato di un ordine su PRONTO (Solo staff)')
            .addUserOption(option => option
                .setName('cliente')
                .setDescription("Seleziona un cliente da aggiornare")
                .setRequired(true))),
    /**
    * @param {Client} client
    * @param {Interaction} interaction
    */
    async execute(client, message) {
        
        if(message.options.getSubcommand() == 'info'){  /* Controllo perms disattivato */
            const info = require('./g-ordine/info.js');
            return info.execute(client, message);
        }
        else if(controlloPerms.controllo(client, message)){ /* Controllo perms attivo */
            switch(message.options.getSubcommand()){
                case 'test':
                    //Chiamo la funzione help nella cartella confi
                    const test = require('./g-ordine/test.js');
                    return test.execute(client, message);
                case 'notify':
                    //Chiamo la funzione help nella cartella confi
                    const notify = require('./g-ordine/notify.js');
                    return notify.execute(client, message);
                case 'info':
                    //Chiamo la funzione help nella cartella confi
                    const info = require('./g-ordine/info.js');
                    return info.execute(client, message);
                case 'termina':
                    //Chiamo la funzione help nella cartella confi
                    const termina = require('./g-ordine/termina.js');
                    return termina.execute(client, message);
                case 'help':
                    //Chiamo la funzione help nella cartella confi
                    const help = require('./g-ordine/help.js');
                    return help.execute(client, message);
                case 'force-add':
                    //Chiamo la funzione help nella cartella confi
                    const forceadd = require('./g-ordine/force-add.js');
                    return forceadd.execute(client, message);
                case 'lista':
                    //Chiamo la funzione help nella cartella confi
                    const lista = require('./g-ordine/lista.js');
                    return lista.execute(client, message);
                case 'force-remove':
                    //Chiamo la funzione help nella cartella confi
                    const forceremove = require('./g-ordine/force-remove.js');
                    return forceremove.execute(client, message);
                case 'force-aggiorna':
                    //Chiamo la funzione help nella cartella confi
                    const forceaggiorna = require('./g-ordine/force-aggiorna.js');
                    return forceaggiorna.execute(client, message);
                case 'force-avvia':
                    //Chiamo la funzione help nella cartella confi
                    const forceavvia = require('./g-ordine/force-avvio.js');
                    return forceavvia.execute(client, message);
            }
        }
    }
}