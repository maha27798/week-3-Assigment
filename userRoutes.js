const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const logger = require('./logger');   // <-- Logging added

let savedUser = null;

// ---------------- SIGNUP ----------------
router.post('/signup', async (req, res) => {
    logger.info("Signup attempt received");

    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn("Signup failed — Missing fields");
        return res.status(400).send("Email and password required");
    }

    if (!validator.isEmail(email)) {
        logger.warn("Signup failed — Invalid email");
        return res.status(400).send("Invalid email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    savedUser = { email, password: hashedPassword };

    logger.info(`User registered: ${email}`);

    res.send({
        message: "User registered",
        email,
        hashedPassword
    });
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
    logger.info("Login attempt");

    const { email, password } = req.body;

    if (!savedUser) {
        logger.error("Login failed — No user exists");
        return res.status(400).send("No user found, please signup first.");
    }

    if (email !== savedUser.email) {
        logger.warn("Login failed — Wrong email");
        return res.status(401).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, savedUser.password);

    if (!isMatch) {
        logger.warn("Login failed — Wrong password");
        return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ email }, "secret123", { expiresIn: "1h" });

    logger.info("Login successful");

    res.send({
        message: "Login successful",
        token
    });
});

module.exports = router;
