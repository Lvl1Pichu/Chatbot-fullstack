const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Token of your bot - keep this secure!
const token = '';

// Channel ID of the channel you want to fetch messages from
const channelId = '1099790630818959533';

// Login to Discord with your client's token
client.login(token);

client.once('ready', async () => {
    console.log('Ready!');

    const channel = await client.channels.fetch(channelId);
    if (!channel) {
        console.log('Channel not found!');
        return;
    }

    // Fetch all messages from the channel
    let messages = [];
    let lastId;

    while (true) {
        const options = { limit: 100 };
        if (lastId) {
            options.before = lastId;
        }

        const fetchedMessages = await channel.messages.fetch(options);
        if (fetchedMessages.size === 0) {
            break;
        }

        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastId = fetchedMessages.last().id;
    }

    // Sort messages by creation date
    messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    // Format messages
    const formattedMessages = messages.map(message => {
        const date = new Date(message.createdTimestamp);
        return `[${date.toISOString()}] ${message.author.username}: ${message.content}`;
    }).join('\n');

    // Save to a file
    fs.writeFileSync('messages.txt', formattedMessages);

    console.log('Messages saved to messages.txt');
});
