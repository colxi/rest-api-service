# rest-api-service

[![...](https://img.shields.io/badge/types-available-blue.svg)](https://github.com/colxi/midi-parser-js)
[![...](https://img.shields.io/badge/tests-pass-green.svg)](https://github.com/colxi/midi-parser-js)
[![...](https://img.shields.io/badge/licence-MIT-brightgreen.svg)](https://www.npmjs.com/package/midi-parser-js)

RESTAPiService microlibrary brings a quick and flexible solution to initiate a generic RESTful API server application with NodeJs.

- ✅ Flexible & Configurable
- ✅ Tiny & light : only 30 kB
- ✅ Private Endpoints supported (token authentication)
- ✅ Support for secure connections ( https )
- ✅ Minimum boilerplate to initialize
- ✅ Simple routes declaration syntax
- ✅ ES6 & CommonJS module import syntax supported (import & require)
- ✅ Typescript support

Usage example :

```typescript
// import the module
import RESTApiService from 'rest-api-service'
// or using require...
// const RESTApiService = require('rest-api-service').default

// declare api routes
const myRoutes = [
  ['GET', 'user/:id/profile', Controllers.user.getProfile, false],
  ['POST', 'user/:id/email', Controllers.user.setEmail, true]
]

// initialize service
const myService = await RESTApiService.create(myRoutes, {
  protocol: 'http',
  port: 8080,
  verbose: true
})

// done!
```

## Installation

This package can be installed locally with both `yarn` and `npm` :

```bash
# using yarn...
$ yarn add rest-api-service
# or with npm...
$ npm install rest-api-service
```

## Constructor Syntax

The asynchronous constructor initiates the service and returns an instance of the RESTApiService.

```typescript
async RESTApiService.create( routes:RESTApiServiceRoute[] [, options:RESTApiServiceOptions] )
```

- `routes` : Array containing a collection of routes.
- `options` (optional) : Object containing the configuration options.

## Routes Syntax

The RESTApiService constructor expects you to provide a Collection (array) of routes. Each route is itself an Array too, and is expected to have the following structure (indexes values) :

```
[HTTPMethod, URIPattern, RouteController, PrivateRouteFlag]
```

- `HTTPMethod` (string) : Available methods : `GET | POST | PUT | PATCH | DELETE`
- `URIPattern` (string) : Define the endpoints at which requests can be made. Route paths must be string patterns, containing -if needed- **route parameters**, to capture values ([more info here](https://expressjs.com/tr/guide/routing.html))
- `RouteController`(function) : Method to handle the calls to the different endpoints.
- `PrivateRouteFlag` (boolean, optional) : Boolean value to flag those endpoints that are private and require authentication.

## Initialization options

The RESTApiService constructor accepts the following configuration options :

```typescript
{
  port: number // default : 8080
  protocol: 'http' | 'https' // default : http
  verbose: boolean // default : false
  logErrors: boolean // default : false
  cors: Object // default : {}
  auth: Function // default : ()=>true
  credentials: {
    cert: string // content of a .crt file
    key: string // content of a .key file
  }
}
```

- `port`: Number of port to listen
- `protocol`: Protocol to use
- `verbose`: When set to true, activity will be output to console
- `logErrors`: When set to true, Controller errors will be printed in the console
- `cors`: Object to set the CORS configuration ([use this syntax](https://expressjs.com/en/resources/middleware/cors.html))
- `auth`: Authorizer (sync or sync) function to block/allow access to a private endpoint. Receives a token as single argument, and must return a boolean
- `credentials` : Object containing the secret key and the certificate for secure connections (only required when using https protocol)

## Route Controller

```typescript
const myController = (response, { payload, params, query }, token) => {
  // ...do some stuff
  response(200, { success: true })
}
```

Controller methods are functions (sync or async) that handle the calls to an endpoint. **They are not meant to return any value**, instead they can execute the provided `response` method to deliver the result of their operations to the client.

- If the controller method finishes its execution without executing the `response` method, a `response(200)` will be executed automatically.

- Any unhandled error triggered during a Controller execution will be catch and a `response(500)` (Server internal error) will be emitted as a response to the client.

> Controller errors will not be output to the console unless the `logErrors` option has been set to true during initialization stage.

### Route Controller Parameters:

All Route controllers will be invoked providing to them the following parameters :

- **Response method** : Is a function provided as first argument to the Controller. It can be used to emit a response to the client, it accepts 2 parameters :

  - Status Code : Number representing the HTTP status code
  - Data (optional) : JSON object containing the data to return

- **Payload** : Provided as the second argument, is an object that acts as a container for all the incoming -client provided- data, which is grouped , according to its source, in the following properties :

  - `payload` : Body of the request (for requests like POST or PUT)
  - `params` : Any URL parameter from the route (eg : user/:id )
  - `query` : Any url query parameter (eg : ?foo=bar)

- **Token** : In the third argument the Route Controller receives the auth token extracted from the request header (auth-token header). Is specially useful to identify the requester.

## Route Access Authorizer

Those routes that are declared with the `PrivateRouteFlag` set to `true` will trigger the execution of the Authorizer (provided during initialization stage with the `auth` property)

The `Route Authorizer` (sync or async) function receives the request auth token (extracted from the `auth-token` request header) , and must return a `boolean` indicating if the request can proceed or must be blocked.

Rejected requests will be finished with a `401` status code.

A pseudo-code implementation of an Authorizer could be the following:

```typescript
function requestAuthorizer(token) {
  // ...perform token validation
  const result = myTokenValidationRoutine(token)
  // allow or block according the validation
  return result ? true : false
}
```

## Setting CORS options

CORS can be configured during initialization stage using the `cors` option.
An example of a permissive configuration, which allows request from any source would be :

```json
 "cors": {
    "credentials": true,
    "origin": "*"
  }
```

More information about setting up CORS , and available CORS configuration can be found here :
https://expressjs.com/en/resources/middleware/cors.html

## Stop the service

The `destroy` method will terminate and shutdown gracefully the server and all its connections.

```typescript
const myService = await RESTApiService.create()
await myService.destroy()
```

## Typescript support

RESTApiService ha been implemented using Typescript. Types signatures can be easily imported using :

```typescript
import {
  RESTApiServiceOptions, // type for constructor options
  RESTApiServiceRoute, // type for route definition
  RESTApiServiceRequestAuthorizer, // type for request authorizer
  RESTApiServiceController, // type for route controller
  API_AUTH_REQUIRED // constant for route private flags
} from 'rest-api-service'
```

\*Additional types are also available for import

## Development

Available scripts :

- `yarn start` : starts the service
- `yarn lint` : run the linter
- `yarn test` : run the tests
- `yarn build` : compiles to javascript the library
- `yarn publish` : compiles to javascript the library and publishes to npm registry

## License

This library is released using a MIT license
