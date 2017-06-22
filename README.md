# FH Server (new version)

This is the brand new FH server, which (as for now) is not complete.

During the transition meantime from the legacy server to this one, all APIs of this server should **NOT** be
accessible publicly, as they are meant to be called from a pass-through the legacy server.

## Server structure

```
config/                      config for the different environments
docs/                        project docs and coding guides
public/                      static files root
reports/                     test and coverage reports
server/                      project source code
|- app/                      app components
|- core/                     shared helpers
|- hooks/                    common service hookds
|- middleware/               custom middleware
|- services/                 app services
|- app.ts                    app and middleware setup
+- server.ts                 server entry point
```

## Main tasks

Task automation is based on [NPM scripts](https://docs.npmjs.com/misc/scripts).

Tasks                         | Description
------------------------------|---------------------------------------------------------------------------------------
npm start                     | Launch server.
npm test                      | Run unit tests, lint code and check for package vulnerabilities
npm run lint                  | Lint code
npm run freeze                | Lock down NPM dependencies with [shrinkwrap](ttps://docs.npmjs.com/cli/shrinkwrap)
npm run docs                  | Display project documentation

# What's in the box

- REST API server based on [Feathers](http://feathersjs.com) and [TypeScript](http://www.typescriptlang.org)
- Static code analysis via [TSLint](https://github.com/palantir/tslint)
- Unit tests using [Jasmine](http://jasmine.github.io) and [SuperTest](https://github.com/visionmedia/supertest)
- Security enforcements using [Helmet](https://github.com/helmetjs/helmet) and [Node Security](https://github.com/nodesecurity/nsp)
- [Swagger](http://swagger.io) API documentation
- Local knowledgebase server using [Hads](https://github.com/sinedied/hads)
- Authentication with JSON Web Token (JWT) using [Passport](http://passportjs.org)
- Configurable logger using [winston](https://github.com/winstonjs/winston)
- API versioning

## Documentation

Use `npm run docs` for easier navigation.

[[index]]
