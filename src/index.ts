import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import routes from './routes';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());

app.use('/api', routes);

createConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Сервер запущен на порту ${port}`);
        });
    })
    .catch((error) => console.error('Ошибка подключения к БД', error));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Microservice API',
            version: '1.0.0',
            description: 'Документация для приложения'
        },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));