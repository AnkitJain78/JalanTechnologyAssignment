/**
 * Ticketing software for managing zoo tickets.
 * @module ZooTicketing
 * @description A program to create, manage, and display zoo tickets for guests.
 * @author [Ankit Jain]
 * 
 * @requires chalk
 * @requires readline
 * @requires fs
 * @requires cli-table3
 */

import chalk from "chalk";
import readline from "readline";
import fs from "fs";
import Table from "cli-table3";

/**
 * Represents a guest visiting the zoo.
 * @class
 */
class Guest {
  /**
   * Create a guest.
   * @constructor
   * @param {string} name - The name of the guest.
   * @param {number} age - The age of the guest.
   */
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  /**
   * Get the entrance price based on the guest's age.
   * @method
   * @returns {number} The entrance price for the guest.
   */
  getEntrancePrice() {
    if (this.age <= 2) return 0;
    else if (this.age < 18) return 100;
    else if (this.age < 60) return 500;
    else return 300;
  }
}

/**
 * Represents a ticket for zoo entry.
 * @class
 */
class Ticket {
  /**
   * Create a ticket.
   * @constructor
   * @param {number} id - The ID of the ticket.
   * @param {string} date - The date of the ticket.
   */
  constructor(id, date) {
    this.id = id;
    this.date = date;
    this.guests = [];
    this.totalPrice = 0;
  }

  /**
   * Add a guest to the ticket.
   * @method
   * @param {string} name - The name of the guest.
   * @param {number} age - The age of the guest.
   */
  addGuest(name, age) {
    const guest = new Guest(name, age);
    this.guests.push(guest);
    this.totalPrice += guest.getEntrancePrice();
  }

  /**
   * Display ticket details.
   * @method
   */
  showTicketDetails() {
    console.log(chalk.bold.blue(`Ticket ID: ${this.id}`));
    console.log(chalk.bold.blue(`Ticket for ${this.date}:`));
    this.guests.forEach((guest, index) => {
      console.log(chalk.green(`Guest ${index + 1}:`));
      console.log(chalk.yellow(`   Name: ${guest.name}`));
      console.log(chalk.yellow(`   Age: ${guest.age}`));
    });
    console.log(
      chalk.bold.magenta(`Total Entrance Price: INR ${this.totalPrice}`)
    );
  }

  /**
   * Save ticket details to a file.
   * @method
   * @param {string} filename - The name of the file to save to.
   */
  saveToFile(filename) {
    let tickets = [];
    if (fs.existsSync(filename)) {
      const rawData = fs.readFileSync(filename);
      tickets = JSON.parse(rawData);
    }
    tickets.push({
      id: this.id,
      date: this.date,
      guests: this.guests.map((guest) => ({
        name: guest.name,
        age: guest.age,
      })),
      totalPrice: this.totalPrice,
    });
    fs.writeFileSync(filename, JSON.stringify(tickets));
    console.log(chalk.green(`Ticket details saved to ${filename}`));
  }

  /**
   * Load tickets from a file.
   * @static
   * @method
   * @param {string} filename - The name of the file to load from.
   * @returns {Array} An array of ticket objects.
   */
  static loadFromFile(filename) {
    if (!fs.existsSync(filename)) {
      console.log(chalk.red(`No ticket data found in ${filename}`));
      return [];
    }
    const rawData = fs.readFileSync(filename);
    return JSON.parse(rawData);
  }

  /**
   * Display a list of all tickets.
   * @static
   * @method
   * @param {string} filename - The name of the file to load tickets from.
   */
  static displayTicketList(filename) {
    const tickets = Ticket.loadFromFile(filename);
    const table = new Table({
      head: ["Ticket ID", "Date", "Guests", "Total Price"],
    });

    tickets.forEach((ticket) => {
      const guests = ticket.guests
        .map((guest) => `(${guest.name}, ${guest.age})`)
        .join(", ");
      table.push([ticket.id, ticket.date, guests, `INR ${ticket.totalPrice}`]);
    });

    console.log(table.toString());
  }

  /**
   * Verify if a ticket with the given ID exists and display its details.
   * @static
   * @method
   * @param {number} ticketId - The ID of the ticket to verify.
   * @param {string} filename - The name of the file to load tickets from.
   */
  static verifyIssuedTicket(ticketId, filename) {
    const tickets = Ticket.loadFromFile(filename);
    const ticket = tickets.find((ticket) => ticket.id === ticketId);
    if (!ticket) {
      console.log(chalk.red(`Ticket with ID ${ticketId} not found`));
      return null;
    }
    const table = new Table({
      head: ["Ticket ID", "Date", "Guests", "Total Price"],
    });
    const guests = ticket.guests
      .map((guest) => `(${guest.name}, ${guest.age})`)
      .join(", ");
    table.push([ticket.id, ticket.date, guests, `INR ${ticket.totalPrice}`]);
    console.log(table.toString());
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Validate the input provided by the user for guest details.
 * @function
 * @param {string} input - The input string containing guest details.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
const validateGuestInput = (input) => {
  const [name, age] = input.split(",");
  if (!name || !age || isNaN(age) || parseInt(age) <= 0) {
    console.log(
      chalk.red(
        "Invalid input! Please provide valid input in the format: name, age"
      )
    );
    return false;
  }
  return true;
};

/**
 * Create a new ticket with guest details provided by the user.
 * @function
 */
const createTicket = () => {
  const currentDate = new Date().toLocaleDateString();
  const ticketId = Math.floor(Math.random() * 100000);
  const ticket = new Ticket(ticketId, currentDate);
  rl.question("Enter number of guests: ", (numGuests) => {
    numGuests = parseInt(numGuests);
    let guestCounter = 0;

    const promptGuestDetails = () => {
      rl.question(
        `Enter details of Guest ${guestCounter + 1} (name, age): `,
        (input) => {
          if (validateGuestInput(input)) {
            const [name, age] = input.split(",").map((item) => item.trim());
            ticket.addGuest(name, parseInt(age));
            guestCounter++;
            if (guestCounter === numGuests) {
              ticket.showTicketDetails();
              ticket.saveToFile("tickets.json");
              rl.question(
                "Do you want to create another ticket? (yes/no): ",
                (answer) => {
                  if (answer.toLowerCase() === "yes") {
                    createTicket();
                  } else {
                    rl.close();
                  }
                }
              );
            } else {
              promptGuestDetails();
            }
          } else {
            promptGuestDetails();
          }
        }
      );
    };

    promptGuestDetails();
  });
};

createTicket();
Ticket.displayTicketList('tickets.json');
Ticket.verifyIssuedTicket(77989, 'tickets.json')