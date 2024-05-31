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
        body: JSON.stringify({email, password})
    })

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
    const data = await response.json()
    return data;
};
const registerToEvent = async (userId: string, eventId: string) => {
    const response = await fetch(`${apiUrl}/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId,
            eventId
        })
    })
    return response.ok
};

const updateTicket = async (ticketId: string) => {
    const response = await fetch(`${apiUrl}/ticket/${ticketId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            onSale: true,
        })
    })
    if(!response.ok){
        return;
    }
    const data = await response.json()
    return data
}
// // Function to get tickets by event ID
// const getTicketsByEventId = async (eventId) => {
//   const response = await fetch(`${apiUrl}/ticket?eventId=${eventId}`);
//   const data = await response.json()
//   return data;
// };

// // Function to create a notification
// const createNotification = async (userId, eventId) => {
//   const response = await axios.post(${apiUrl}/notifications, {
//     userId,
//     eventId,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });
//   return response.data;
// };

// // Function to upload a new ticket
// const uploadTicket = async (eventId) => {
//   const response = await axios.post(${apiUrl}/ticket, {
//     eventId,
//     seatNumber: 'A1', // Example seat number
//     price: 100, // Example price
//   });
//   return response.data;
// };

// // Function to get notifications for a user
// const getNotificationsByUserId = async (userId) => {
//   const response = await axios.get(${apiUrl}/notifications/user/${userId});
//   return response.data;
// };

// // Function to prompt the user for input
// const promptUser = (query) => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   return new Promise((resolve) => rl.question(query, (ans) => {
//     rl.close();
//     resolve(ans);
//   }));
// };

// Main function to execute the flow
const main = async () => {
    try {
        // Prompt user for login
        console.log("Please enter your username and password.");
        const email = await prompt("Email: ");
        const password = await prompt("Password: ");
        console.log(email)
        console.log(password)

        // User login
        console.log("Logging in...");
        const user = await loginUser(email, password);
        if (user) {
            console.log("Successfully logged in...");
        }
        else {
            console.log("Failed to login...")
            return;
        }

        // Step 1: Display shows
        const events = await getEvents();
        console.log('Available shows:');
        for (const event of events) {
            // Check if tickets are sold out
            //   const tickets = await getTicketsByEventId(event._id);
            //   const soldOut = tickets.length === 0;
            console.log(`EventId: ${event._id} Event: ${event.name}, Status: ${event.status}`);
            //   console.log(`Tickets sold out: ${soldOut}`);
        }

        ///step 2: register to event 
        const eventId = await prompt('Enter the event id of the show you want to attend (it must be a sold-out show):');

        if (eventId) {
            const successfullyToRegister = registerToEvent(eventId, user._id)
            if(successfullyToRegister) {
                console.log('register successfully...')
            }
            else {
                console.log('Faild to register to event ...')
            }
        } else {
            console.log('Show not exists...');
        }

        const updatedTicket = updateTicket("6659b92ae4373275b057a7d3")
        if(updatedTicket){
            console.log(`Ticket added to event : ${eventId}`)
        }

        // // Step 2: Ask user to pick a show
        // const eventName = await promptUser('Enter the name of the show you want to attend (it must be a sold-out show): ');
        // const selectedEvent = events.find(event => event.name.toLowerCase() === eventName.toLowerCase());

        // if (!selectedEvent) {
        //   console.log('Show not found.');
        //   return;
        // }

        // // Step 3: Check if the selected show is sold out
        // const tickets = await getTicketsByEventId(selectedEvent._id);
        // const soldOut = tickets.length === 0;

        // if (!soldOut) {
        //   console.log('The selected show still has tickets available.');
        //   return;
        // }

        // // Step 4: Ask user if they want to register for notifications
        // const userResponse = await promptUser(`Tickets for "${selectedEvent.name}" are sold out. Do you want to register for this event? (yes/no): `);
        // if (userResponse.toLowerCase() !== 'yes') {
        //   console.log('User chose not to register.');
        //   return;
        // }

        // // Step 5: Register user for the event
        // const userId = 'exampleUserId'; // Replace with actual user ID
        // await createNotification(userId, selectedEvent._id);
        // console.log('User registered for notifications.');

        // // Step 6: Simulate uploading a new ticket for the event
        // console.log('Simulating ticket upload by another user...');
        // await uploadTicket(selectedEvent._id);
        // console.log('New ticket uploaded.');

        // // Step 7: Notify user of new ticket
        // const notifications = await getNotificationsByUserId(userId);
        // console.log('Notifications for the user:', notifications);

    } catch (error) {
        console.error('Error during flow execution:', error);
    }
};

// Execute the main function
main();