const express = require('express');
const router = express.Router();
const Post = require(`../models/Post`);

//routers
// GET
// Home
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Node js blog",
            description: "Simple Blog created with NodeJS, Express and MongoDB"
        }
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
        // const data = await Post.find();
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

// get
// posts
router.get('/post/:id', async (req, res) => {
    try {
        const locals = {
            title: data.title,
            description: "Simple Blog created with nodeJS, express & mongodb"
        }
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });
        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
});

// POST
// Search
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple blog created with NodeJs, Express & MongoDB"
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });
        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;