const mongodb = require('../db/connect.js');
const createObjectId = require('mongodb').ObjectId.createFromHexString;
const { blogSchema } = require('../helpers/validation_schema.js');
const createError = require('http-errors');

const getBlog = async (req, res, next) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Get Blog by ID on server root'
    // #swagger.parameters['id'] = {description: 'HexString of 24 characters', type: 'string'}
    // #swagger.responses[200] = {description: 'Blog data successfully retrieved.'}
    // #swagger.responses[400] = {description: 'Bad Request: ID should be 24 characters long.'}
    // #swagger.responses[404] = {description: 'Nothing found with that ID.'}
    // #swagger.responses[422] = {description: 'Unprocessable Entity: Data is not valid.'}
    // #swagger.responses[500] = {description: 'Server error occurred while retrieving the blog data.'}
    try {
        const _blogId = req.params.id;
        if (_blogId.length != 24) {
            throw createError(400, 'No blog can be found with that ID. ID should be 24 characters long.');
        }
        const blogId = createObjectId(_blogId);
        const result = await mongodb.getDb().db('BlogData').collection('blogs').findOne({ _id: blogId });
        
        if (!result) {
            throw createError(404, 'No blogs found with that ID.');
        }
        const resultJSON = JSON.parse(JSON.stringify(result));
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(resultJSON);
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
};

const getAllBlogs = async (req, res, next) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Get all blogs on server root'
    // #swagger.responses[200] = {description: 'Blog data successfully retrieved.'}
    // #swagger.responses[422] = {description: 'Unprocessable Entity: Data is not valid.'}
    // #swagger.responses[500] = {description: 'Server error occurred while retrieving all blog data.'}
    try {
        const result = await mongodb.getDb().db('BlogData').collection('blogs').find();
        result.toArray()
        .then((res_arr) => {
            if (res_arr.length == 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({"message": "No blogs to display."});
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(res_arr);
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
};

const createBlog = async (req, res, next) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Create blog on server root'
    // #swagger.responses[200] = {description: 'Created blog data successfully.'}
    // #swagger.responses[422] = {description: 'Unprocessable Entity: Data is not valid.'}
    // #swagger.responses[500] = {description: 'Server error occurred while creating the blog data.'}
    try {
        const blog = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            content: req.body.content,
            title: req.body.title,
            UUID: req.body.UUID,
            date: req.body.date
        };
        const blogData = await blogSchema.validateAsync(blog);

        const response = await mongodb.getDb().db('BlogData').collection('blogs').insertOne(blogData);
        
        if (response.acknowledged) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(response);
        } else {
            throw createError(500, 'Some error occurred while creating the blog.');
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
};

const updateBlog = async (req, res, next) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description = 'Update blog by ID on server root'
    // #swagger.parameters['id'] = {description: 'HexString of 24 characters', type: 'string'}
    // #swagger.responses[200] = {description: 'Updated blog data successfully.'}
    // #swagger.responses[400] = {description: 'Bad Request: ID should be 24 characters long.'}
    // #swagger.responses[404] = {description: 'Nothing found with that ID.'}
    // #swagger.responses[422] = {description: 'Unprocessable Entity: Data is not valid.'}
    // #swagger.responses[500] = {description: 'Server error occurred while updating the blog data.'}
    try {
        const _blogId = req.params.id;
        if (_blogId.length != 24) {
            throw createError(400, 'No blog can be found with that ID. ID should be 24 characters long.');
        }
        const blogId = createObjectId(_blogId);
        const blog = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            content: req.body.content,
            title: req.body.title,
            UUID: req.body.UUID,
            date: req.body.date
        };
        const blogData = await blogSchema.validateAsync(blog);

        const response = await mongodb.getDb().db('BlogData').collection('blogs').replaceOne({ _id: blogId }, blogData);
        
        if (response.modifiedCount == 0) {
            throw createError(404, 'No blogs found with that ID.');
        }

        if (response.acknowledged) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(response);
        } else {
            throw createError(500, 'Some error occurred while updating the blog.');
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
};

const deleteBlog = async (req, res, next) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Delete blog by ID on server root'
    // #swagger.parameters['id'] = {description: 'HexString of 24 characters', type: 'string'}
    // #swagger.responses[200] = {description: 'Deleted blog data successfully.'}
    // #swagger.responses[400] = {description: 'Bad Request: ID should be 24 characters long.'}
    // #swagger.responses[404] = {description: 'Nothing found with that ID.'}
    // #swagger.responses[422] = {description: 'Unprocessable Entity: Data is not valid.'}
    // #swagger.responses[500] = {description: 'Server error occurred while deleting the blog data.'}
    try {
        const _blogId = req.params.id;
        if (_blogId.length != 24) {
            throw createError(400, 'No blog can be found with that ID. ID should be 24 characters long.');
        }
        const blogId = createObjectId(_blogId);

        const response = await mongodb.getDb().db('BlogData').collection('blogs').deleteOne({ _id: blogId }, true);

        if (response.deletedCount == 0) {
            throw createError(404, 'No blogs found with that ID.');
        } else if (response.deletedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ "message": `Deleted ${response.deletedCount} blog(s) with ID of ${_blogId} successfully.` });
        } else {
            throw createError(500, 'Some error occurred while deleting the blog.');
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
};

const deleteAll = async (req, res, next) => {
    // #swagger.tags = ['Blogs']
    // #swagger.description='Delete all blogs on server root.'
    // #swagger.responses[200] = {description: 'Deleted blog data successfully.'}
    // #swagger.responses[422] = {description: 'Unprocessable Entity: Data is not valid.'}
    // #swagger.responses[500] = {description: 'Server error occurred while deleting all blog data.'}
    try {
        const response = await mongodb.getDb().db('BlogData').collection('blogs').deleteMany({});

        if (response.deletedCount == 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ "message": 'No blogs to delete!' });
        } else if (response.deletedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                "message": `Deleted ${response.deletedCount} blogs successfully.`
            });
        } else {
            throw createError(500, 'Some error occurred while deleting all the blogs.');
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
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