const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

// check login middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.userId = decoded.userId;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}






// GET
// admin login page

router.get('/admin', async (req, res) => {

    try {
        const locals = {
            title: "Admin panel",
            description: "simple blog created with nodeJs, Express & MongoDB"
        }

        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

// POST
// Admin -check login
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne( { username });

        if (!user) {
            return res.status(401).json( { message: 'invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials'});
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

// POST
// Admin -dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    res.render('./admin/dashboard');
});

// POST
// Admin - register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password:hashedPassword });
            res.status(201).json({ message: 'User Created', user });

        } catch (error) { 
            console.log(error)
            if (error.code === 11000 ) {
                res.status(409).json({ message: 'User already in user'});
            }
            res.status(500).json({ message: 'Internal server error'});
        }

        // res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});
module.exports = router; 