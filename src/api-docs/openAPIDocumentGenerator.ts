import swaggerJsdoc from 'swagger-jsdoc';

export function generateOpenAPIDocument() {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Swagger API',
      },
      externalDocs: {
        description: 'View the raw OpenAPI Specification in JSON format',
        url: '/swagger.json',
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
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./src/api/user/userRouter.ts', './src/api/auth/authRouter.ts'],
  };

  const openAPIDocument = swaggerJsdoc(options);
  return openAPIDocument;
}
