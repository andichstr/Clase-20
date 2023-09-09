export default class Ticket {
    constructor() {
        this.tickets = [];
    }

    async get() {
        return this.tickets;
    }

    async create(ticket) {
        this.tickets.push(ticket);
    }

    async getById(id) {
        const index = this.tickets.findIndex(ticket => ticket.id==id);
        return index == -1 ? null : this.tickets[index];
    }

    async getByCode(code) {
        const index = this.tickets.findIndex(ticket => ticket.code==code);
        return index == -1 ? null : this.tickets[index];
    }

    async getByPurchaser(email) {
        const foundTickets = [];
        this.tickets.forEach(ticket => {
            if (ticket.purchaser == email) foundTickets.push(ticket);
        })
        return foundTickets;
    }
}
