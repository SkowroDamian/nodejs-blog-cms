const express = require('express');
const router = express.Router();
const Post = require(`../models/Post`);

//routers
// GET
// Home
router.get('', async (req, res) => {
    const locals = {
        title: "Node js blog",
        description: "Simple Blog created with NodeJS, Express and MongoDB"
    }

    try {
        const data = await Post.find();
        res.render('index', { locals, data });
    } catch (error) {
        console.log(error);
    }

});

// insertp dummy data post

// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Building a blog",
//             body: "This is the body text"
//         }
//     ])
// }

// insertPostData();

router.get('/about', (req, res) => {
    res.render('about')
});

module.exports = router;