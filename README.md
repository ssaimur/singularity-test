# Singularity - Backend

# Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

# Deployed Version

| Name | Version | URL |
| ---- | ------- | --- |

# Environment Variables

You are required to create an environment file (in JSON format) with the following process environments for this library. You may look at the sample Process Environment file [HERE](https://github.com/singpass/verify-demo-app/blob/master/your-vms-server/config/config.js).<br>
**.env** file should be placed inside ./environment of root directory and named as 'development.env' or 'production.env'.<br>
For connecting to staging database, we should add **POSTGRES_SSL**, **POSTGRES_CA** in env file. At this time, **POSTGRES_SSL** should be true and a full path of CA file will be **POSTGRES_CA**

| Name                           | Detail                                     | Default                | Required |
| ------------------------------ | ------------------------------------------ | ---------------------- | -------- |
| NODE_ENV                       | Run Mode                                   | Development            | Yes      |
| PORT                           | Port                                       | 8080                   | Yes      |
| IP                             | IP address                                 | 0.0.0.0                | No       |
| POSTGRES_HOST                  | Database Hostname                          | localhost              | Yes      |
| POSTGRES_PORT                  | Database Port                              | 5432                   | Yes      |
| POSTGRES_USER                  | Database User                              | postgres               | Yes      |
| POSTGRES_PASSWORD              | Database Password                          | passsword              | Yes      |
| POSTGRES_DB                    | Database Name                              | singularity                | Yes      |
| POSTGRES_SSL                   | Flag if database is connected via SSL      | false                  | Yes      |
| POSTGRES_CA                    | Full Path of CA File for DB TLS connection | eg. /etc/root/cert.pem | Yes      |
| JWT_SECRET                     | JWT Secret                                 | singularity                | Yes      |
| JWT_EXPIRES_IN_MINUTES         | Expired time for JWT                       | 60                     | Yes      |
| JWT_REFRESH_EXPIRES_IN_MINUTES | Expired time for JWT refresh token         | 1440                   | Yes      |
| CODE_VERIFY_EXPIRED_SECONDS    | Expired time for OTP token                 | 60                     | Yes      |

# Pre-requisites for server

| Name       | Version | URL                                    |
| ---------- | ------- | -------------------------------------- |
| Node.js    | 18.0    | https://nodejs.org/en/                 |
| TypeScript | 5.0     | https://www.typescriptlang.org/        |
| Sequelize  | v6      | https://sequelize.org/docs/v6/         |
| Tsoa       | 5.1.1   | https://tsoa-community.github.io/docs/ |
| PostgreSQL | 8.19.2  | https://www.postgresql.org/            |

# Getting started

- Clone the repository

```
git clone  <git lab template url> <project_name>
```

- Install dependencies

```
cd <project_name>
npm install
```

- Build and run the project

```
npm build
npm start
```

### For development on local, you should install husky on local

- Install husky

```
npm run prepare:after
```

- Run the project

```
npm run dev
```

Navigate to `http://localhost:8080`

- API Document endpoints
  swagger-ui Endpoint on local : http://localhost:8080/docs

# Deployment

We will use the following branches in staging and production.

- In staging, `dev` branch
- In production, `master` branch

# TypeScript + Node + ExpressJS + Sequelize + OpenApi(Swagger)

The main purpose of this repository is to show a project setup and workflow for writing microservice. The Rest APIs will be using the Swagger (OpenAPI) Specification.

## Install Project

```
npm install
```

## Project Structure

The folder structure of this app is explained below:

| Name                   | Description                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ------------- | -------------------------------------------------------------------- |
| **dist**               | Contains the distributable (or output) from your TypeScript build.                               |
| **node_modules**       | Contains all npm dependencies                                                                    |
| **src**                | Contains source code that will be compiled to the dist dir                                       |
| **configuration**      | Application configuration including environment-specific configs                                 |
| **src/controllers**    | Controllers define functions to serve various express routes.                                    |
| **src/lib**            | Common libraries to be used across your app.                                                     |
| **src/middlewares**    | Express middlewares which process the incoming requests before handling them down to the routes  |
| **src/routes**         | Contain all express routes, separated by module/area of application                              |
| **src/models**         | Models define schemas that will be used in storing and retrieving data from Application database |
| **src/monitoring**     | Prometheus metrics                                                                               |
| **src**/index.ts       | Entry point to express app                                                                       |
| package.json           | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped) | tsconfig.json | Config settings for compiling source code only written in TypeScript |
| .eslintrc.json         | Config settings for ESLint code style checking                                                   |
| .prettierrc            | Config settings for Prettier code style checking                                                 |
| .ecosystem.config.json | Config settings for running production                                                           |
| tsconfig.json          | Config settings for project                                                                      |
| tsoa.json              | Config settings for eslint                                                                       |

## Building the project

### Configuring TypeScript compilation

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "dist",
    "sourceMap": true
  },

  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "test", "node_modules"]
}
```

### Running the build

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script   | Description                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| `start`      | Runs full build and runs node on dist/index.js. Can be invoked with `npm start` |
| `build:live` | Full build. Runs ALL build tasks                                                |
| `build:dev`  | Full build. Runs ALL build tasks with all watch tasks                           |
| `dev`        | Runs full build before starting all watch tasks. Can be invoked with `npm dev`  |
| `test`       | Runs build and run tests using mocha                                            |
| `lint`       | Runs TSLint on project files                                                    |

### Using the debugger in VS Code

Node.js debugging in VS Code is easy to setup and even easier to use.
Press `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/dist/index.js",
      "preLaunchTask": "tsc: build - tsconfig.json",

      "outFiles": ["${workspaceFolder}/dist/*js"]
    },

    {
      // Name of configuration; appears in the launch configuration drop down menu.
      "name": "Run mocha",
      "request": "launch",
      // Type of configuration. Possible values: "node", "mono".
      "type": "node",
      // Workspace relative or absolute path to the program.
      "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",

      // Automatically stop program after launch.
      "stopOnEntry": false,
      // Command line arguments passed to the program.
      "args": ["--no-timeouts", "--compilers", "ts:ts-node/register", "${workspaceRoot}/test/*"],

      // Workspace relative or absolute path to the working directory of the program being debugged. Default is the current workspace.

      // Workspace relative or absolute path to the runtime executable to be used. Default is the runtime executable on the PATH.
      "runtimeExecutable": null,
      // Environment variables passed to the program.
      "env": { "NODE_ENV": "test" }
    }
  ]
}
```

## Testing

The tests are written in Mocha and the assertions done using Chai

```
"mocha": "3.4.2",
"chai": "4.1.2",
"chai-http": "3.0.0",

```

### Example application.spec.ts

```
import chaiHttp = require("chai-http")
import * as chai from "chai"
import app from './application'

const expect = chai.expect;
chai.use(chaiHttp);


describe('App', () => {
  it('works', (done:Function): void => {
  chai.request(app)
      .get('/api/hello?greeting=world')
      .send({})
      .end((err:Error, res: any): void => {

          expect(res.statusCode).to.be.equal(200);
          expect(res.body.msg).to.be.equal("hello world");
          done();
      });

    });
});
```

### Running tests using NPM Scripts

```
npm run test

```

Test files are created under test folder.

# Swagger

## Specification

The swagger specification file is automatically in /docs folder.
The configuration for swagger documentation is in taos.json.

- Swagger UI

  The final piece of middleware enables serving of the swagger-ui interface direct from the Express server. It also serves the raw Swagger schema (.json) that clients can consume. Paths for both are configurable.
  The swagger-ui endpoint is acessible at /docs endpoint.

# ESLint and Prettier

ESLint is a code linter that helps catch minor code quality and style issues.

## ESLint rules

All rules are configured through `.eslintrc.json`.

## Running ESLint

To run ESLint you can call the main build script or just the ESLint task.

```
npm run lint  // runs only ESLint
```

# Common Issues

## npm install fails

The current solution has an example for using a private npm repository. if you want to use the public npm repository, remove the .npmrc file.

# License

The project is licensed under the MIT License.

# Project status

This project is on going
