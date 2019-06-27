import swaggerJsdoc from 'swagger-jsdoc';
import { config } from 'dotenv';

// Initialize dotenv
config();

// define host url
const host = process.env.HOST_NAME || (process.env.HEROKU_APP_NAME ? `${process.env.HEROKU_APP_NAME}.herokuapp.com` : 'localhost:3000');
const projectName = process.env.PROJECT_NAME || 'Author\'s Haven';

// Swagger Definitions
const swaggerDefinition = {
  info: {
    title: projectName,
    version: '1.0.0',
    description: 'A Social platform for the creative at heart',
  },
  host,
  basePath: '/api/v1'
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['swagger.yaml']
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
