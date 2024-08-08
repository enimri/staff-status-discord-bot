const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const staffRoleId = 'YOUR_STAFF_DISCORD_ROLE_ID'; // Replace with your staff role ID
const channelId = 'YOUR_CHANNEL_DISCORD_ID'; // Replace with your channel ID
let statusMessage; // To store the message object

client.on('presenceUpdate', async (oldPresence, newPresence) => {
    const member = newPresence.member;

    if (!member.roles.cache.has(staffRoleId)) return;

    const avatarUrl = member.user.displayAvatarURL({ dynamic: true });

    if (newPresence.status === 'online') {
        if (!statusMessage) {
            const embed = new EmbedBuilder()
                .setColor('#00ff00') // Green color
                .setTitle('Staff Member Online')
                .setDescription(`${member.displayName} is online :green_circle:`)
                .setThumbnail(avatarUrl) // Set the staff member's avatar as thumbnail
                .setTimestamp();

            const channel = client.channels.cache.get(channelId);
            statusMessage = await channel.send({ embeds: [embed] });
        }
    } else {
        if (statusMessage) {
            await statusMessage.delete();
            statusMessage = null;
        }
    }
});

// Manual trigger for testing purposes
client.on('messageCreate', async (message) => {
    const member = message.member;

    if (message.content === '!online') {
        const avatarUrl = member.user.displayAvatarURL({ dynamic: true });

        if (!statusMessage) {
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Manual Trigger: Staff Member Online')
                .setDescription(`${member.displayName} is online :green_circle:`)
                .setThumbnail(avatarUrl)
                .setTimestamp();

            const channel = client.channels.cache.get(channelId);
            statusMessage = await channel.send({ embeds: [embed] });
        }
    }

    if (message.content === '!offline') {
        if (statusMessage) {
            await statusMessage.delete();
            statusMessage = null;
        }
    }
});

client.login(YOUT_DISCORD_TOKEN_BOT'); // Replace with your bot token
