
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trello API',
      version: '1.0.0',
      description: 'API documentation for Trello app',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
apis: ['./src/routes/*.ts'],  
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiHandler = swaggerUi.serve;
export const swaggerDocHandler = swaggerUi.setup(swaggerSpec);
