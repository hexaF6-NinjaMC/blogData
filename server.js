const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const contactRoutes = require('./routes/blogDataRoutes');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const swaggerOptions = require('./swagger-options');
const createError = require('http-errors');

const port = process.env.PORT || 8080;
const app = express();

app
    .use(cors())
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })
    .use('/', contactRoutes)
    .use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, swaggerOptions))
    .use(express.static('./frontend', {root: __dirname}));

app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
});