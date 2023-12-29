import express, { Request as ExRequest, Response as ExResponse } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { RegisterRoutes } from '../dist/routes/routes';

import appDataSource from './config/dataSource';
import validateEnv from './utils/validateEnv';

// Sync ENV file
import config from './config/config';
import { errorHandler } from './handles/errorHandler';

appDataSource
  .sync({ force: false })
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // Body parser
    app.use(express.json({ limit: '50mb' }));

    // Logger
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

    // Cookie Parser
    app.use(cookieParser());

    // Cors
    app.use(
      cors({
        origin: config.cors.split(','),
        credentials: true,
        allowedHeaders: ['Accept', 'Content-Type', 'Authorization', 'local-time'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
      }),
    );

    // Routes
    // root
    app.get('/', function (req, res) {
      res.status(200).json({
        status: true,
        message: 'OK',
      });
    });

    // Swagger
    app.use('/api/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
      return res.send(swaggerUi.generateHTML(await import('../docs/swagger.json')));
    });

    // Routes
    RegisterRoutes(app);

    // Use express static folder
    app.use(express.static(__dirname + '/public'));

    //  apply to all requests
    const limiter = rateLimit({
      windowMs: 1000, // 1 second
      max: 10, // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);

    // Global Error Handler
    app.use(errorHandler);

    // Start server
    const serverHttp = require('http').createServer(app);
    function startServer() {
      const port = config.server.port;
      const ip = config.server.ip;
      serverHttp.listen(port, ip, function () {
        console.log('Express server listening on %s:%d, in %s mode', ip, port, app.get('env'));
      });
    }
    setImmediate(startServer);
  })
  .catch((error) => console.log(error));
