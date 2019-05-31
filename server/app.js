import express from 'express';
import debug from 'debug';
import logger from 'morgan';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import apiRoutes from './routes';
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

app.use('/', apiRoutes);
app.use(errorHandler);

app.listen(port, () => {
  debugged(`Listening from port ${port}`);
});

export default app;
