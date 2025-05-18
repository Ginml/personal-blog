const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


// Routes
router.get('', async (req, res) => {
    try {
        const locals = {
          title: "NodeJs Blog",
          description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
    
        let perPage = 10;
        let page = req.query.page || 1;
    
        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
    
        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
    
        res.render('index', { 
          locals,
          data,
          current: page,
          nextPage: hasNextPage ? nextPage : null,
          currentRoute: '/'
        });
    
      } catch (error) {
        console.log(error);
      }
    
    });


/**
 * get
 * post:id
 */

router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});



/**
 * post
 * post - sarchTerm
 */

router.post('/search', async (req, res) => {
  try{
    const locals = {
      title: "search",
      description: "Simple Blog created with Node]s, Express & MongoDb."
    }
    let sarchTerm = req.body.sarchTerm;
    const searchNospecialChar = sarchTerm.replace(/[^a - zA - Z0 - 9]/g, "")

    const data = await Post.find({
   $or: [
    {title: {$regex: new RegExp(searchNospecialChar, 'i')}},
    {body: {$regex: new RegExp(searchNospecialChar, 'i')}}
   ]
    });

    res.render("search", {
    data,
    locals,
    currentRoute: '/'
    });


  } catch(error) {
    console.log(error);
  }
});


// GET /About
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});   

module.exports = router;