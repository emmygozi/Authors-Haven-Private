import express from 'express';
import debug from 'debug';
import logger from 'morgan';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/api/users';
import swaggerSpec from './config/swagger';
import errorHandler from './middlewares/errorHandler';

const debugged = debug('app');
config();

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api/v1/auth', authRoutes);
// swagger-ui-express for API endpoint documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);
app.use('*', (req, res) => res.status(404).send({
  status: 404,
  message: 'Page Not Found'
}));

app.listen(port, () => {
  debugged(`Listening from port ${port}`);
});

export default app;
