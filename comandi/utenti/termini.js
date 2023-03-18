const { Client, ChannelType, roles, Guild, Events, SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Permissions, GatewayIntentBits, Collection } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
console.log("\x1b[32m" + '(/) Caricato comando /termini' + "\x1b[37m"); /* Console log */

module.exports = {
    name: "termini",
    data: {
        name: "termini",
        description: "Mostra gli attuali termini & condizioni dello store."
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
        const embedDue = new EmbedBuilder()
            .setColor(0xcedde0)
            .setTitle("TERMINI & CONDIZIONI - NotMatte design store")
            .addFields(
                { name: "Cosa succede se accetto l'ordine?", value: "Una volta accettato, il tuo ordine passerà in mano di NotMatte che preparerà il `.zip` con tanto di ricevuta.  Dopo la consegna non sarà più possibile richiedere modifiche se di grande scala mentre ce ne saranno 3 disponibili a tutti  nel caso di piccole modifiche. ", inline: true },
                { name: "Politica dei rimborsi.", value: "In quanto prodotti virtuali senza alcuna garanzia non sarà possibile effettuare alcuna richiesta di rimborso per qualsiasi tipo di prodotto. In alternativa siamo organizzati in modo tale che situazioni come queste non accadono (Anteprima > conferma del cliente > pagamento > prodotto finale).", inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Richiesto da ' + message.user.username });

        await message.reply({ embeds: [embedDue] });
    }
}