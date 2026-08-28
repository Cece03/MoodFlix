// -------------------- IMPORTS --------------------
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(cors());

// -------------------- DATABASE CONNECTION --------------------
const dbURI = 'mongodb://127.0.0.1:27017/MoodFlix';

mongoose.connect(dbURI)
    .then(() => console.log('✅ Connected to MongoDB MoodFlix database'))
    .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// -------------------- USER SCHEMA --------------------
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// 🔐 PASSWORD HASHING
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// 🔐 Compare password
userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// -------------------- ROUTES --------------------

// ✅ SIGNUP
app.post('/signup', async (req, res) => {
    try {
        let { name, email, password } = req.body;

        email = email.toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered ❌' });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully ✅' });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ LOGIN
app.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email.toLowerCase();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found ❌' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password ❌' });
        }

        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });

        res.json({ message: 'Login successful ✅', token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ RESET PASSWORD (DIRECT)
app.post('/reset-password', async (req, res) => {
    try {
        let { email, newPassword } = req.body;

        email = email.toLowerCase();

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found ❌' });
        }

        user.password = newPassword;
        await user.save(); // 🔥 gets hashed automatically

        res.json({ message: "Password updated successfully ✅" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------- TEST ROUTE --------------------
app.get('/', (req, res) => {
    res.send('MoodFlix Auth API is running 🚀');
});

app.get('/test-users', async (req, res) => {
    const users = await User.find();
    console.log("ALL USERS:", users);
    res.json(users);
});

// -------------------- START SERVER --------------------
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});