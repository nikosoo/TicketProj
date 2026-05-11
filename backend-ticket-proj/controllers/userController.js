const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration controller
const registerUser = async (req, res) => {
    const { name, email, password, telephone, organization, isAdmin, secretKey } = req.body;

    const expectedSecretKey = process.env.ADMIN_SECRET_KEY; // Ensure this is loaded correctly

    // Log the incoming data for debugging
    console.log('Registering user:', { name, email, isAdmin, secretKey });

    // If the user is an admin, check the secret key
    if (isAdmin) {
        if (!secretKey || secretKey !== expectedSecretKey) {
            console.log('Invalid secret key provided.');
            return res.status(403).json({ message: 'Forbidden: Invalid secret key' });
        }
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ 
            name, 
            email, 
            password, 
            telephone, 
            organization,
            isAdmin // Ensure isAdmin is included
        });
        await newUser.save();

        const token = jwt.sign({ 
            id: newUser._id, 
            name: newUser.name, 
            telephone: newUser.telephone, 
            organization: newUser.organization, 
            isAdmin: newUser.isAdmin 
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ 
            token, 
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                email: newUser.email, 
                telephone: newUser.telephone, 
                organization: newUser.organization,
                isAdmin: newUser.isAdmin 
            },
            message: 'User registered successfully' 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
};





const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign({ 
            id: user._id, 
            name: user.name, 
            telephone: user.telephone, 
            organization: user.organization, 
            isAdmin: user.isAdmin 
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and user's info
        res.status(200).json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,  
                telephone: user.telephone, 
                organization: user.organization,
                isAdmin: user.isAdmin 
            } 
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Middleware to verify token and fetch user info
const getUserInfo = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password'); // Exclude the password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate token', error: error.message });
    }
};

const updateUserDetails = async (req, res) => {
    const { email, telephone, organization } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user details
      user.email = email || user.email;
      user.telephone = telephone || user.telephone;
      user.organization = organization || user.organization;
  
      await user.save();
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user details', error: error.message });
    }
  };
  
  const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude the password field from the response
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

// Update user information controller for admins
const updateUserByAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, email, telephone, organization } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        user.telephone = telephone || user.telephone;
        user.organization = organization || user.organization;

        await user.save();

        res.status(200).json({ user, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    updateUserDetails,
    getAllUsers,
    deleteUser,
    updateUserByAdmin
};
