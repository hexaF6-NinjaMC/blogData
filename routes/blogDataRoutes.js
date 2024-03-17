const router = require('express').Router();

const blogDataController = require('../controllers/blogDataController');

router.get('/blogs', blogDataController.getAllBlogs);

router.get('/blogs/:id', blogDataController.getBlog);

router.post('/blogs', blogDataController.createBlog);

router.put('/blogs/:id', blogDataController.updateBlog);

router.delete('/blogs/:id', blogDataController.deleteBlog);

router.delete('/blogs', blogDataController.deleteAll);

module.exports = router;