import { CorsOptions } from 'cors'
import { Server } from 'http'
import { Application, IRouterMatcher, Request, Response } from 'express'

/**
 * Const Object Values & keys
 * (ObjectValues type can be used as a safer substitute for enum) : prevents
 * invalid values assignment
 */
// prettier-ignore
interface PlainObjectValues {
  [key: string]:  | bigint | boolean | null | number | string  | symbol
                  | undefined | Record<string, any> | PlainObjectValues
}
export type ObjectValues<T extends PlainObjectValues> = T[keyof T]
export type ObjectKeys<T extends PlainObjectValues> = keyof T

/**
 * Extend the express Request object with request id
 */
declare module 'express-serve-static-core' {
  interface Request {
    id?: string
  }
}

/**
 * Constant for flagging routes that require authentication
 */
export const API_AUTH_REQUIRED = true

/**
 * Console colors
 */
export const ConsoleColor = {
  green: '\x1b[32m$',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
} as const
export type ConsoleColor = ObjectValues<typeof ConsoleColor>

/**
 * Generic type for plain javascript objects
 */
// export type PlainObject = { [k: string]: any } & { prototype?: never }

/**
 * Instance of an http Server (alias)
 */
type callbackFunction = (error?: Error) => void
export interface RESTApiServiceHTTPServer extends Server {
  shutdown: (callback: callbackFunction) => void
  forceShutdown: (callback: callbackFunction) => void
}

/**<
 * Instance of an express Application (alias)
 */
export type RESTApiServiceExpressApp = Application

/**
 * Express Network Request Object (alias)
 */
export type RESTApiServiceHTTPServerRequest = Request

/**
 * Express Network Request Response Object (alias)
 */
export type RESTApiServiceHTTPServerResponse = Response

/**
 * Object with the configuration for network CORS (alias of express CorsOptions)
 */
export type RESTApiServiceHTTPServerCorsOptions = CorsOptions | undefined

/**
 * Network Request handler by method (express IRouterMatcher alias)
 */
export type RESTApiServiceExpressAppRequestHandler = IRouterMatcher<
  RESTApiServiceHTTPServer
>

/**
 * Method to validate a request access using the auth-token. Returns a boolean
 */
export type RESTApiServiceRequestAuthorizer = (
  token: string
) => boolean | Promise<boolean>

/**
 * Available Network request methods
 */
export class RESTApiServiceRequestMethods {
  public readonly POST: string = 'post'
  public readonly PUT: string = 'put'
  public readonly PATCH: string = 'patch'
  public readonly DELETE: string = 'delete'
  public readonly GET: string = 'get'
}

/**
 * Network request resource URI pattern
 */
export type RESTApiServiceURIPattern = string

/**
 * Network request resource private flag. When set to true Authorizer method
 * is executed to grant/deny access top resource
 */
export type RESTApiServicePrivateFlag = boolean

/**
 * Array containing requestMethod , requestURI , requestController, requestPrivateFlag
 */
export type RESTApiServiceRoute = [
  keyof RESTApiServiceRequestMethods,
  RESTApiServiceURIPattern,
  RESTApiServiceController,
  RESTApiServicePrivateFlag?
]

/**
 * Instance of a RESTApiService
 */
export interface RESTApiServiceInstance {
  readonly port: number
  readonly authorizer: RESTApiServiceRequestAuthorizer
  readonly expressApp: RESTApiServiceExpressApp
  logErrors: boolean
  verbose: boolean
  log: (...args: unknown[]) => void
}

/**
 * Object to define the HTTPS server credentials
 */
export type RESTApiServiceHTTPSCredentials = {
  key: string
  cert: string
}

type RESTApiServiceOptionsHTTP = {
  readonly protocol?: 'http'
  readonly cors?: RESTApiServiceHTTPServerCorsOptions
  readonly port?: number
  readonly verbose?: boolean
  readonly auth?: RESTApiServiceRequestAuthorizer
  readonly logErrors?: boolean
}

type RESTApiServiceOptionsHTTPS = {
  readonly protocol: 'https'
  readonly credentials: RESTApiServiceHTTPSCredentials
  readonly cors?: RESTApiServiceHTTPServerCorsOptions
  readonly port?: number
  readonly verbose?: boolean
  readonly auth?: RESTApiServiceRequestAuthorizer
  readonly logErrors?: boolean
}

/**
 * Configuration object after merging custom with user options
 */
export type RESTApiServiceEffectiveOptions = {
  readonly protocol: 'http' | 'https'
  readonly cors: RESTApiServiceHTTPServerCorsOptions
  readonly port: number
  readonly verbose: boolean
  readonly auth: RESTApiServiceRequestAuthorizer
  readonly logErrors: boolean
  readonly credentials?: RESTApiServiceHTTPSCredentials
}

/**
 * Configuration object required for the RESTApiService initialization
 */
export type RESTApiServiceOptions =
  | RESTApiServiceOptionsHTTP
  | RESTApiServiceOptionsHTTPS

/**
 * Network Route entry Object obtainer from a Route descriptor
 */
export interface RESTApiServiceRouteDescriptor {
  readonly method: keyof RESTApiServiceRequestMethods
  readonly uri: RESTApiServiceURIPattern
  readonly controller: RESTApiServiceController
  readonly private: RESTApiServicePrivateFlag
}

/**
 * Network request payload object. Contains the data from body, url params,
 * and url query params
 */
export interface RESTApiServiceRequestPayload {
  readonly body: unknown
  readonly params: unknown
  readonly query: unknown
}

/**
 * Network request interceptor
 */
export type RESTApiServiceRequestInterceptor = (
  request: RESTApiServiceHTTPServerRequest,
  response: RESTApiServiceHTTPServerResponse
) => Promise<void>

/**
 * Method to respond to a network request. Accepts status code as first argument
 * and an object with response data as second argument
 */
export type RESTApiServiceRequestResponder = (
  statusCode: number,
  responseData?: Record<string, any>
) => void

/**
 * Method bound to a route, that will be executed when network request against
 * the route is performed.
 */
export type RESTApiServiceController = (
  response: RESTApiServiceRequestResponder,
  payload: RESTApiServiceRequestPayload,
  token: string
) => (undefined | void) | Promise<undefined | void>

/**
 * RESTApiService Error codes
 */
export const RESTApiServiceErrorCode = {
  // Options validation
  INVALID_OPTIONS_TYPE: 90,
  INVALID_OPTIONS_PORT: 91,
  INVALID_OPTIONS_VERBOSE: 92,
  INVALID_OPTIONS_LOG_ERRORS: 93,
  INVALID_OPTIONS_CORS: 94,
  INVALID_OPTIONS_AUTH: 95,
  INVALID_OPTIONS_PROTOCOL: 96,
  INVALID_OPTIONS_CREDENTIALS: 97,
  INVALID_OPTIONS_CREDENTIALS_CERTIFICATE: 98,
  INVALID_OPTIONS_CREDENTIALS_KEY: 99,
  // Routes validation
  INVALID_ROUTES_COLLECTION: 100,
  INVALID_ROUTE_TYPE: 101,
  INVALID_ROUTE_METHOD: 102,
  INVALID_ROUTE_URI: 103,
  INVALID_ROUTE_CONTROLLER: 104,
  INVALID_ROUTE_PRIVATE_FLAG: 105
} as const

export type RESTApiServiceErrorCode = ObjectValues<
  typeof RESTApiServiceErrorCode
>

/**
 * Custom RESTApiServiceError error with errCode support
 */
export class RESTApiServiceError extends Error {
  constructor(message: string, errCode: RESTApiServiceErrorCode) {
    super(message)
    /**
     * When extending the Error class with typescript the new constructor
     * reference is lost. Because of this "special behavior" of typescript
     * we need to assign the prototype manually...
     * More details here :
     * https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
     */
    Object.setPrototypeOf(this, RESTApiServiceError.prototype)

    this.code = errCode
  }
  code: RESTApiServiceErrorCode
}
