import { json } from 'body-parser';
import readline from 'readline';
import user from './models/user';

const apiUrl = 'http://localhost:3000';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        return;
    }

    const data = await response.json();
    return data;
};

const prompt = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

// Function to get all events
const getEvents = async () => {
    const response = await fetch(`${apiUrl}/event`);
    const data = await response.json();
    return data;
};

const registerToEvent = async (userId: string, eventId: string) => {
    const response = await fetch(`${apiUrl}/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, eventId })
    });

    return response.ok;
};

const updateTicket = async (ticketId: string) => {
    const response = await fetch(`${apiUrl}/ticket/${ticketId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ onSale: true })
    });

    if (!response.ok) {
        return;
    }

    const data = await response.json();
    return data;
};

// Main function to execute the flow
const main = async () => {
    try {
        // Prompt user for login
        console.log("Please enter your username and password.");
        const email = await prompt("Email: ");
        const password = await prompt("Password: ");

        // User login
        console.log("Logging in...");
        const user = await loginUser(email, password);
        if (!user) {
            console.log("Failed to login...");
            return;
        }
        console.log("Successfully logged in...");

        // Display shows
        const events = await getEvents();
        console.log('Available shows:');
        for (const event of events) {
            console.log(`EventId: ${event._id} Event: ${event.name}, Status: ${event.status}`);
        }

        // Register to event
        const eventId = await prompt('Enter the event id of the show you want to attend (it must be a sold-out show):');
        if (eventId) {
            const successfullyRegistered = await registerToEvent(user._id, eventId);
            if (successfullyRegistered) {
                console.log('Registered successfully...');
            } else {
                console.log('Failed to register to event...');
            }
        } else {
            console.log('Show not exists...');
        }

        // Update ticket
        const updatedTicket = await updateTicket("6659b92ae4373275b057a7d3");
        if (updatedTicket) {
            console.log(`Ticket added to event: ${eventId}`);
        }

    } catch (error) {
        console.error('Error during flow execution:', error);
    }
};

// Execute the main function
main();
