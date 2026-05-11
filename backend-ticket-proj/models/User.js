const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    isAdmin: { // Field for admin status
        type: Boolean,
        default: false, // Default to false (not an admin)
    },
    hasNewTickets: { // New field to track if there are new tickets for the admin
        type: Boolean,
        default: false, // Default to false (no new tickets)
    },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
