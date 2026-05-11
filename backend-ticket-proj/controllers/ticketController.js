const Ticket = require('../models/Ticket');
const User = require('../models/User'); // Adjust the path as necessary

// Create a new ticket
const createTicket = async (req, res) => {
    const { ticketSubject, relatedUrl, description, category, priority, private, userEmail } = req.body;
    const userId = req.user.id;

    try {
        const newTicket = new Ticket({
            ticketSubject,
            relatedUrl,
            description,
            category,
            username: req.user.name,
            userEmail,
            status: 'Open',
            priority: priority || 'Medium',
            userId,
            private: private || false,
        });

        await newTicket.save();

        // Update the hasNewTickets flag for all admins
        await User.updateMany({ isAdmin: true }, { $set: { hasNewTickets: true } });

        res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: 'Error creating ticket', error: error.message });
    }
};

// Get all tickets
const getTickets = async (req, res) => {
    const userId = req.user?.id; 
    const isAdmin = req.user?.isAdmin; 

    try {
        const tickets = isAdmin
            ? await Ticket.find().populate('comments')
            : await Ticket.find({
                $or: [
                    { private: false }, 
                    { userId }
                ]
            }).populate('comments');

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

// Update the status of a ticket
const updateTicketStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.status = status;
        await ticket.save();

        res.status(200).json({ message: 'Ticket status updated successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket status', error: error.message });
    }
};

const addComment = async (req, res) => {
    const { id } = req.params;
    const { username, comment } = req.body;

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const newComment = { username, comment };
        ticket.comments.push(newComment);
        await ticket.save();

        res.status(200).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

const deleteComment = async (req, res) => {
    const { id, commentId } = req.params;

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.comments = ticket.comments.filter(comment => comment._id.toString() !== commentId);
        await ticket.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

const updateTicketPriority = async (req, res) => {
    const { id } = req.params;
    const { priority } = req.body; 

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.priority = priority;
        await ticket.save();

        res.status(200).json({ message: 'Ticket priority updated successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket priority', error: error.message });
    }
};

const updateTicketPrivacy = async (req, res) => {
    const { id } = req.params;
    const { private } = req.body; 

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (ticket.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized to update this ticket' });
        }

        ticket.private = private;
        await ticket.save();

        res.status(200).json({ message: 'Ticket privacy updated successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket privacy', error: error.message });
    }
};

// Delete a ticket by ID (Admin only)
const deleteTicket = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Admins only.' });
        }

        const ticket = await Ticket.findByIdAndDelete(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error: error.message });
    }
};

// Check if there are new tickets for the admin
const checkNewTickets = async (req, res) => {
    try {
        const admin = await User.findOne({ _id: req.user.id, isAdmin: true });

        if (!admin) {
            return res.status(403).json({ message: 'Unauthorized. Admins only.' });
        }

        res.status(200).json({ hasNewTickets: admin.hasNewTickets });
    } catch (error) {
        res.status(500).json({ message: 'Error checking new tickets', error: error.message });
    }
};

const clearNewTicketsFlag = async (req, res) => {
    try {
        await User.updateMany({ isAdmin: true }, { $set: { hasNewTickets: false } });

        res.status(200).json({ message: 'New tickets flag cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing new tickets flag', error: error.message });
    }
};

module.exports = {
    createTicket,
    getTickets,
    updateTicketStatus,
    addComment,
    deleteComment,
    updateTicketPriority,
    updateTicketPrivacy,
    deleteTicket,
    clearNewTicketsFlag,
    checkNewTickets,
};
