const config = require('dotenv').config();

const { Client, changeNickname, ChannelType, roles, Guild, Events ,SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations]}); 

const token = process.env.TOKEN;

// --- Command handler
const fs = require("fs")
client.commands = new Collection()

const commandsFolder = fs.readdirSync("./comandi");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./comandi/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandsFiles) {
        const command = require(`./comandi/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

// --- Bot ready
client.on("ready", () => {

    client.user.setActivity('NotMatte Design Store'); /* Attività del bot */
    client.user.setStatus('online'); /* Stato del bot */
    console.log("\n"+"\x1b[32m" + `[#] CORE-BOT by NotMatte is ready\n[#] Made for NotMatte Design Store` + "\x1b[37m" + "\n"); /* Console log */

    /* Slash commands Creator */
    client.guilds.cache.forEach(guild => {
        client.commands.forEach(command => {
            guild.commands.create(command.data);
        });
    });

});

// ── Ad ogni canale creato nella categoria "970623959336886293" (Ordini) mando un avviso in DM al creatore del bot

/*client.on("channelCreate", channel => {
    if (channel.parentId == "970623959336886293") {

        // Mando un DM al creatore del bot con il nome della chat
        try {
            client.users.fetch(process.env.ID_ADMIN).then(user => {
                user.send(":champagne_glass: • E' stato creato un nuovo ordine, corri a vederlo <#" + channel.id + ">");
            });
        } catch (error) {
            console.log(error);
        }
        
    }
});*/

client.on("interactionCreate", interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
        command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        interaction.reply({ content: 'Ho riscontrato un errore nel farlo, riprova?\n`' + error + "`.", ephemeral: true });
    }
});


client.login(token);