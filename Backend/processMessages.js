const fs = require('fs');
const path = require('path');

// Function to replace usernames and format messages
function processMessages(messages) {
    const messageMap = new Map();

    messages.forEach(message => {
        // Replace usernames
        message.content = message.content.replace(/ankispanki/g, 'Annika').replace(/twrecon/g, 'Linus');

        // Parse the date
        const date = new Date(message.timestamp);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        // Create a key based on the date and username
        const key = `${formattedDate}_${message.author}`;

        // If the key exists, append the message, otherwise create a new entry
        if (messageMap.has(key)) {
            messageMap.get(key).push(message.content);
        } else {
            messageMap.set(key, [message.content]);
        }
    });

    // Create formatted messages
    const formattedMessages = [];
    messageMap.forEach((contents, key) => {
        const [date, author] = key.split('_');
        const formattedContent = contents.join('\n\n');
        formattedMessages.push(`${author} on ${date}:\n\n${formattedContent}\n\n`);
    });

    return formattedMessages.join('\n');
}

// Function to read and parse the input file
function readMessagesFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const messages = [];
    lines.forEach(line => {
        const match = line.match(/^\[(.*?)\] (.*?): (.*)$/);
        if (match) {
            const [, timestamp, author, messageContent] = match;
            messages.push({ timestamp, author, content: messageContent });
        }
    });

    return messages;
}

// Main function
function main() {
    const inputFilePath = path.join(__dirname, 'processed_messages.txt');
    const outputFilePath = path.join(__dirname, 'processed_messages.txt');

    // Read and process the messages
    const messages = readMessagesFromFile(inputFilePath);
    const formattedMessages = processMessages(messages);

    // Write the formatted messages to the output file
    fs.writeFileSync(outputFilePath, formattedMessages, 'utf-8');

    console.log('Messages processed and saved to processed_messages.txt');
}

main();
