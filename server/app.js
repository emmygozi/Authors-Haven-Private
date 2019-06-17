import express from 'express';
import debug from 'debug';
import logger from 'morgan';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import apis from '@routes/api';
import errorHandler from '@middlewares/errorHandler';
import swaggerSpec from './config/swagger';

const debugged = debug('app');
config();

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api/v1', apis);

// swagger-ui-express for API endpoint documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((request, response, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
app.use(errorHandler);

app.listen(port, () => {
  debugged(`Listening from port ${port}`);
});

export default app;
