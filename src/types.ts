import { CorsOptions } from 'cors'
import { Server } from 'http'
import { Application, IRouterMatcher, Request, Response } from 'express'

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
export type RESTApiServiceHTTPServer = Server

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
  logControllerErrors: boolean
  verbose: boolean
  log: (...args: unknown[]) => void
}

/**
 *
 */
export type RESTApiServiceHTTPSCredentials = {
  key: string
  cert: string
}

/**
 * Configuration object required for the RESTApiService initialization
 */
export type RESTApiServiceOptions =
  | {
      readonly protocol?: 'http'
      readonly cors?: RESTApiServiceHTTPServerCorsOptions
      readonly port?: number
      readonly verbose?: boolean
      readonly auth?: RESTApiServiceRequestAuthorizer
      readonly logControllerErrors?: boolean
    }
  | {
      readonly protocol: 'https'
      readonly credentials: RESTApiServiceHTTPSCredentials
      readonly cors?: RESTApiServiceHTTPServerCorsOptions
      readonly port?: number
      readonly verbose?: boolean
      readonly auth?: RESTApiServiceRequestAuthorizer
      readonly logControllerErrors?: boolean
    }

export type RESTApiServiceEffectiveOptions = {
  readonly protocol: 'http' | 'https'
  readonly cors: RESTApiServiceHTTPServerCorsOptions
  readonly port: number
  readonly verbose: boolean
  readonly auth: RESTApiServiceRequestAuthorizer
  readonly logControllerErrors: boolean
  readonly credentials?: RESTApiServiceHTTPSCredentials
}

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
