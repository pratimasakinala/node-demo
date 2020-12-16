import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as logger from 'morgan';

const dotenv = require('dotenv').config();

import init from './utilities/db';

init();

const app = express();

const devWhitelist: RegExp[] = [
  /http:\/\/localhost(?::\d{1,5})?$/
],
  prodWhitelist: RegExp[] = [
    /https:\/\/node-demo\.shift3sandbox\.com/
  ];

app.get('/api/v1/health-check', (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send('API up and healthy!');
});

app.use(cors({
  origin: process.env.NODE_ENV === 'development' ?
    devWhitelist : prodWhitelist
}));

app.use(helmet());
app.use(helmet.hidePoweredBy());

app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '25mb' }));
app.use(cookieParser());
app.use(express.static('/public'));

export default app;