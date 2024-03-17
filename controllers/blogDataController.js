const mongodb = require('../db/connect.js');
const createObjectId = require('mongodb').ObjectId.createFromHexString;

const getBlog = async (req, res) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Get Blog by ID on server root'
    // #swagger.parameters['id'] = {description: 'HexString of 24 characters', type: 'string'}
    const userId = createObjectId(req.params.id);
    const result = await mongodb.getDb().db('BlogData').collection('blogs').find({ _id: userId });
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};

const getAllBlogs = async (req, res) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Get all blogs on server root'
    const result = await mongodb.getDb().db('BlogData').collection('blogs').find();
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
};

const createBlog = async (req, res) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Create blog on server root'
    const blog = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        content: req.body.content,
        title: req.body.title,
        UUID: req.body.UUID,
        date: req.body.date
    };

    const response = await mongodb.getDb().db('BlogData').collection('blogs').insertOne(blog);
    if (response.acknowledged) {
        res.status(200).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occured while creating the blog.');
    }
};

const updateBlog = async (req, res) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description = 'Update blog by ID on server root'
    // #swagger.parameters['id'] = {description: 'HexString of 24 characters', type: 'string'}
    const userId = createObjectId(req.params.id);
    const blog = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        content: req.body.content,
        title: req.body.title,
        UUID: req.body.UUID,
        date: req.body.date
    };
    const response = await mongodb.getDb().db('BlogData').collection('blogs').replaceOne({ _id: userId }, blog);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the blog.');
    }
};

const deleteBlog = async (req, res) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Delete blog by ID on server root'
    // #swagger.parameters['id'] = {description: 'HexString of 24 characters', type: 'string'}
    const userId = createObjectId(req.params.id);
    const response = await mongodb.getDb().db('BlogData').collection('blogs').deleteOne({ _id: userId }, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the user.');
    }
};

const deleteAll = async (req, res) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Delete all blogs on server root.'
    const response = await mongodb.getDb().db('BlogData').collection('blogs').deleteMany({});
    if (response.deletedCount > 0) {
        res.status(204).send({
            "message": `Deleted ${response.deletedCount} blogs successfully.`
        });
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting all blogs.');
    }
};

module.exports = {
    getBlog,
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    deleteAll
};