const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
  info: {
    title: 'Contacts API',
    description: 'Contacts List API documentation'
  },
  servers: [
    {
        url: 'https://blogdata-3q6n.onrender.com',
        description: 'Render URL'
    },
    {
        url: 'http://localhost:8080',
        description: 'Development Server'
    }
  ]
};

const outputFile = './swagger.json';
const routes = ['./server.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);