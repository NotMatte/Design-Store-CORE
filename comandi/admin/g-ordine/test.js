const { Client, ChannelType, roles, Guild, Events, channels, SlashCommandBuilder, SlashCommandSubcommandBuilder , PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const fs = require('fs');
const path = require('path');

module.exports = {
    name: "test",
    async execute(client, message) {

        /*
        .addChoices(
					{ name: '🔴 Non assegnato', value: '🔴 Non assegnato' },
					{ name: '📌 Non pronto', value: '🟠 In lista (non pronto)' },
					{ name: '📌 In lavorazione', value: '🟡 In lavorazione' },
                    { name: '📌 Pronto, in attesa', value: '🟢 Pronto, in attesa...' },
                    { name: '🟢 Consegnato', value: '🟢 Consegnato' },
				)),
        */
        const stato = message.options.getString('stato');
        console.log("DEBUG: "+stato);
        return message.reply({ content: 'Funziona tutto.', ephemeral: true });
    }
}