
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API documentation for task manager app',
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
