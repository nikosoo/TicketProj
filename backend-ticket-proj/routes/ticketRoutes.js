const express = require('express');
const authenticate = require('../middleware/authMiddleware'); // Authentication middleware
const {
    createTicket,
    getTickets,
    updateTicketStatus,
    updateTicketPriority,
    addComment,
    deleteComment,
    updateTicketPrivacy,
    deleteTicket,
    checkNewTickets,
    clearNewTicketsFlag  // Add this to handle updating privacy status
} = require('../controllers/ticketController');

const router = express.Router();

// Route to create a new ticket
router.post('/', authenticate, createTicket); // Protected route to create a ticket

// Route to get all tickets (you may want to protect this route depending on the use case)
router.get('/', authenticate, getTickets); // Protect this route

// Route to update the status of a ticket by ID
router.patch('/:id/status', authenticate, updateTicketStatus); // Protect this route

// Route to update the priority of a ticket by ID
router.patch('/:id/priority', authenticate, updateTicketPriority); // Protect this route

// Route to add a comment to a ticket by ID
router.post('/:id/comments', authenticate, addComment); // Protect this route

// Route to delete a comment from a ticket by ticket ID and comment ID
router.delete('/:id/comments/:commentId', authenticate, deleteComment); // Protect this route

// Route to update the privacy status of a ticket by ID
router.patch('/:id/privacy', authenticate, updateTicketPrivacy); // New route to update the privacy status
// Route to delete a ticket by ID (Admin only)
router.delete('/:id', authenticate, deleteTicket); // Protect this route

// Route to check if there are new tickets for the admin
router.get('/admin/check-new-tickets', authenticate, checkNewTickets); // Admin-only route

// Route to clear the new tickets flag after the admin views the tickets
router.post('/admin/clear-new-tickets', authenticate, clearNewTicketsFlag); // Admin-only route




module.exports = router;
