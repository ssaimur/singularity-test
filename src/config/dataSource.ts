import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import fs from 'fs';

import config from './config';
import { User, UserRole, UserShift } from '../models';
import path from 'path';

// Models
const models = [User, UserRole, UserShift];

const postgresConfig: {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} = config.postgresConfig;

// TLS configuration for database
const sslConfig: {
  require: boolean;
  rejectUnauthorized: boolean;
  ca?: string;
} = {
  require: config.tlsConnection.ssl,
  rejectUnauthorized: false,
};

if (config.tlsConnection.ca) {
  const pathCA = config.isLocal ? path.resolve(__dirname, config.tlsConnection.ca) : config.tlsConnection.ca;
  sslConfig.ca = fs.readFileSync(pathCA).toString();
}

const sequelize = new Sequelize({
  ...postgresConfig,
  dialect: 'postgres',
  logging: false,
  ...(config.tlsConnection.ssl ? { dialectOptions: { ssl: sslConfig } } : {}),
  models,
  timezone: '+00:00',
});

export default sequelize;
