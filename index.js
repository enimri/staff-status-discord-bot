const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const staffRoleId = 'YOUR_STAFF_ROLES'; // Replace with your staff role ID
const channelId = 'YOUR_CHANNEL_ID'; // Replace with your channel ID
let statusMessage; // To store the message object

client.on('presenceUpdate', async (oldPresence, newPresence) => {
    const member = newPresence.member;

    if (!member.roles.cache.has(staffRoleId)) return;

    if (newPresence.status === 'online') {
        if (!statusMessage) {
            const channel = client.channels.cache.get(channelId);
            statusMessage = await channel.send(`${member.displayName} is online :green_circle:`);
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
    if (message.content === '!online') {
        const channel = client.channels.cache.get(channelId);
        if (!statusMessage) {
            statusMessage = await channel.send(`Manual trigger: Staff member is online :green_circle:`);
        }
    }

    if (message.content === '!offline') {
        if (statusMessage) {
            await statusMessage.delete();
            statusMessage = null;
        }
    }
});

client.login('yOUR_CLIENT_ID'); // Replace with your bot token
