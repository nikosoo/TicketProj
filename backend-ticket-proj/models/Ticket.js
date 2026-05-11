const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketSubject: {
        type: String,
        required: true,
    },
    relatedUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    userEmail: { // previously ownersEmail
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    private: { // New field for marking tickets as private
        type: Boolean,
        default: false, // By default, tickets are public
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [{
        username: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    }]
});


const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
 