import { CorsOptions } from 'cors'
import { Server } from 'http'
import { Application, IRouterMatcher, Request, Response } from 'express'
import _RESTApiServiceError from '@/service-error'

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
 * RESTApiService custom error. Each error has a message and a code property.
 */
export const RESTApiServiceError = _RESTApiServiceError
export interface RESTApiServiceErrorInterface {
  message: string
  code: number
}

/**
 * Console colors
 */
export enum ConsoleColor {
  green = '\x1b[32m$',
  red = '\x1b[31m',
  yellow = '\x1b[33m',
  reset = '\x1b[0m'
}

/**
 * Generic type for plain javascript objects
 */
export type PlainObject = { [k: string]: unknown } & { prototype?: never }

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
  readonly payload: PlainObject
  readonly params: PlainObject
  readonly query: PlainObject
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
  responseData?: PlainObject
) => unknown

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
export enum RESTApiServiceErrorCodes {
  // Options validation
  INVALID_OPTIONS_TYPE = 90,
  INVALID_OPTIONS_PORT = 91,
  INVALID_OPTIONS_VERBOSE = 92,
  INVALID_OPTIONS_LOG_ERRORS = 93,
  INVALID_OPTIONS_CORS = 94,
  INVALID_OPTIONS_AUTH = 95,
  INVALID_OPTIONS_PROTOCOL = 96,
  INVALID_OPTIONS_CREDENTIALS = 97,
  INVALID_OPTIONS_CREDENTIALS_CERTIFICATE = 98,
  INVALID_OPTIONS_CREDENTIALS_KEY = 99,
  // Routes validation
  INVALID_ROUTES_COLLECTION = 100,
  INVALID_ROUTE_TYPE = 101,
  INVALID_ROUTE_METHOD = 102,
  INVALID_ROUTE_URI = 103,
  INVALID_ROUTE_CONTROLLER = 104,
  INVALID_ROUTE_PRIVATE_FLAG = 105
}
