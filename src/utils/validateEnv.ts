import { cleanEnv, port, str, host } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    IP: host(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN_MINUTES: str(),
    JWT_REFRESH_EXPIRES_IN_MINUTES: str(),
    CORS: str(),
  });
};

export default validateEnv;
