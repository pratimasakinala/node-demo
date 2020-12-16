import * as fs from 'fs';
import * as bluebird from 'bluebird';
import * as mongoose from 'mongoose';
import * as path from 'path';

import mongooseHelpers from './mongoose-helpers';

function init() {
  const models = fs.readdirSync(path.join(__dirname, '../models'));
  (<any>mongoose).Promise = bluebird;

  if (process.env.NODE_ENV === 'development') mongoose.set('debug', true);

  mongooseHelpers.connection()
    .on('error', console.error.bind(console, 'Error connecting to mongodb: '))
    .once('open', console.log.bind(console, 'Database connected.'));

  models.forEach(m => {
    if (process.env.NODE_ENV === 'production' && /.js/.test(m) && !/.js.map/.test(m)) require(`../models/${m.replace('.js', '')}`);
    else if (process.env.NODE_ENV === 'development') require(`../models/${m.replace('.ts', '')}`);
  });
}

export default init;