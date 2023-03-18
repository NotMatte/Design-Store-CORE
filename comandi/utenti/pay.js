const { Client, ChannelType, roles, Guild, Events, SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
console.log("\x1b[32m" + '(/) Caricato comando /pay' + "\x1b[37m"); /* Console log */

module.exports = {
    name: "pay",
    data: {
        name: "pay",
        description: "Info e link sui metodi di pagamento."
    },
    async execute(client, message) {
        //Bottone
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('🔗 Vai direttamente a PayPal')
                    .setURL('https://paypal.me/matte05Yt')
					.setStyle(ButtonStyle.Link),
			);

        //Embed
        var testEmbed = new EmbedBuilder()
            .setColor(0x009cde)
            .setTitle('PAGAMENTI TRAMITE PAYPAL')
            .setDescription("Per i pagamenti tramite PayPal puoi utilizzare\n il link diretto (cliccando il bottone) o inviado\nil pagamento alla mail `campomatteo.2.2005@gmail.com`.\n\n<:8808985803:970628760355373096> **FAQ** • Payment methods")
            .addFields(
                { name: 'E per pagamenti PaySafeCard?', value: "Per quel tipo di pagamento devi contattarmi tramite DM o telegram `@NotMatt`", inline: true },
                { name: 'Ci sono altri metodi?', value: 'Purtroppo per adesso i metodi di pagamento sono solo questi.', inline: true },
            )
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/174/174861.png');

        await message.reply({ content: '', embeds: [testEmbed], components: [row] });
    }
}