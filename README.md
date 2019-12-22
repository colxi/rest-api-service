# rest-api-service

RESTAPiService microlibrary brings a quick and flexible solution to initiate a generic node RESTful API server service.

- ✅ Flexible & Configurable
- ✅ Tiny & light : only 30 kB
- ✅ Private Endpoint (token authentication)
- ✅ Support for secure connections ( https )
- ✅ Minimum boilerplate
- ✅ Simple routes declaration syntax
- ✅ ES6 & CommonJS module import syntax supported (import & require)
- ✅ Typescript support

Usage example :

```typescript
import RESTApiService from 'rest-api-service'

// declare api routes
const routes = [
  ['GET', 'user/:id/profile', Controllers.user.getProfile, false],
  ['POST', 'user/:id/email', Controllers.user.setEmail, true]
]

// initialize service
const RESTAPi = await RESTApiService.create(routes, {
  protocol: 'http',
  port: 8080
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

The asynchronous constructor returns an instance to the RESTApiService.

```typescript
async RESTApiService.create( routes:RESTApiServiceRoute[] [, options:RESTApiServiceOptions] )
```

- `routes` : Array containing a collection of routes.
- `options` (optional) : Object containing the initialization options.

## Routes Syntax

The RESTApiService constructor expects you to provide a Collection (array) of routes Routes. Each route is itself an Array too, which is expected to have the following structure :

```
[HTTPMethod, URIPattern, RouteController, PrivateRouteFlag]
```

- `HTTPMethod` (string) : Available methods : `GET | POST | PUT | PATCH | DELETE`
- `URIPattern` (string) : Define the endpoints at which requests can be made. Route paths can be string patterns, containing **route parameters**, to capture values ([more info here](https://expressjs.com/tr/guide/routing.html))
- `RouteController`(function) : Method to handle the calls to the different endpoints.
- `PrivateRouteFlag` (boolean, optional) : Boolean value to flag those endpoints that are private and require authentication

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
  } // default : {}
}
```

- `port`: Number of port to listen
- `protocol`: Protocol to use
- `verbose`: When set to true, activity will be output to console
- `logErrors`: When set to true, Controller errors will be printed in the console
- `cors`: Object to set the CORS configuration ([use this syntax](https://expressjs.com/en/resources/middleware/cors.html))
- `auth`: Authorizer (sync or sync) function to block/allow access to a private endpoint. Receives a token as single argument, and must return a boolean
- `credentials` : Object containing the secret key and the certificate for secure connections (only for https)

## Route Controller

```typescript
const myController = (response, { payload, params, query }, token) => {
  // ...do some stuff
  response(200, { success: true })
}
```

Controller methods are functions (sync or async) that perform specific actions related to its endpoint, and execute the `response` method to return the result. **They are not meant to return any value**.

- If the controller method finishes its execution without executing the `response` method, a `response(200)` will be executed automatically.

- Any error during a Controller execution will be catch and a `response(500)` (Server internal error) will be emitted as a response.

> Controller errors will not be output to the console, unless the `logErrors` option has been set to true during initialization stage.

### Route Controller Parameters:

All Route controllers will be executed with the following parameters :

- **Response method** : Is a function provided as first argument to the Controller. It expects 2 values :

  - Status Code : Number representing the HTTP status code
  - Data : JSON object containing the data to return

- **Payload** : Provided as the second argument, is an object that acts as a container for all the incoming data, which is grouped (depending of its source) in the following properties :

  - `payload` : Body of the request (for requests like POST or PUT)
  - `params` : Any URL parameter from the route (eg : user/:id )
  - `query` : Any url query parameter (eg : ?foo=bar)

- **Token** : In the third argument the Route Controller receives the auth token extracted frm the request header. Is specially useful to identify the requested.

## Route Access Authorizer

Those routes that are declared with the `PrivateRouteFlag` set to `true` will trigger the execution of the Authorizer (provided during initialization stge with the `auth` property)

The `Route Authorizer` (sync or async) function receives the request auth token (extracted from the `auth-token` request header) , and returns a `boolean` indicating if the request can proceed or must be blocked.

Rejected requests will be finished with a `401` status code.

A pseudo-code implementation of an Authorizer could be the following:

```typescript
const requestAuthorizer = token => {
  // perform token validation
  const result = validateToken(token)
  // allow or block according the validation
  return result ? true : false
}
```

## Setting CORS options

CORS can be configured during initialization stage using the `cors` option.
An example of a permissive configuration, which allows request from any source would be :

```typescript
 "cors": {
    "credentials": true,
    "origin": "*"
  }
```

More information about setting up CORS , and available CORS configuration can be found here :
https://expressjs.com/en/resources/middleware/cors.html

## Typescript support

Types can be easily imported using :

```typescript
import {
  RESTApiServiceOptions, // type for constructor options
  RESTApiServiceRoute, // type for route definition
  RESTApiServiceRequestAuthorizer, // type for request authorizer
  RESTApiServiceController, // type for route controller
  API_AUTH_REQUIRED // constant for route private flags
} from 'rest-api-service'
```

\*Additional types are also available

## Development

Available scripts :

- `yarn start` : starts the service
- `yarn lint` : run the linter
- `yarn test` : run the tests
- `yarn build` : compiles to javascript the library
- `yarn publish` : compiles to javascript the library and publishes to npm registry

## License

This library is released using a MIT license
