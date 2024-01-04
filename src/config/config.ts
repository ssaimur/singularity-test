import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, `../../environment/development.env`) });
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

// Get config from .env
const config = {
  server: {
    port: process.env.PORT || 5000,
    ip: process.env.IP || '127.0.0.1',
  },

  isLocal: process.env.IS_LOCAL,

  cors: process.env.CORS || 'http://localhost:3000',

  postgresConfig: {
    host: process.env.POSTGRES_HOST || '',
    port: Number(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DB || '',
  },

  secrets: {
    session: process.env.JWT_SECRET || 'singularity',
    expiresInMinutes: Number(process.env.JWT_EXPIRES_IN_MINUTES || '14400'),
    refreshExpiresInMinutes: Number(process.env.JWT_REFRESH_EXPIRES_IN_MINUTES || '144000'),
  },

  otp: {
    expiredSeconds: Number(process.env.CODE_VERIFY_EXPIRED_SECONDS || '60'),
  },

  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME || '',
    bucketRegion: process.env.S3_BUCKET_REGION,
    endpoint: process.env.S3_ENDPOINT,
  },

  tlsConnection: {
    ssl: process.env.POSTGRES_SSL === 'true',
    ca: process.env.POSTGRES_CA,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    accountId: process.env.STRIPE_ACCOUNT_ID,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
};

// Create config.json for sequelize database
const dbCommonConfig = {
  ...config.postgresConfig,
  dialect: 'postgres',
  dialectOptions: {
    bigNumberStrings: true,
    useUTC: false,
  },
  timezone: '+00:00',
};
const dbConfig = {
  development: dbCommonConfig,
  test: dbCommonConfig,
  production: dbCommonConfig,
};

fs.writeFile(path.resolve(__dirname, `../../database/config.json`), JSON.stringify(dbConfig), (err) => {
  if (err) console.log('faied to create config.json for database: ', err);
});

export default config;
