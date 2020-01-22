import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import addRequestId from 'express-request-id'
import httpServerWithShutdown from 'http-shutdown'

import http from 'http'
import https from 'https'

import initializeRequestRouter from '@/request-router'
import defaultOptions from '@/default-options'
import validateOptions from '@/validate-options'
import validateRoutes from '@/validate-routes'

import {
  RESTApiServiceError,
  RESTApiServiceInstance,
  RESTApiServiceRoute,
  RESTApiServiceOptions,
  RESTApiServiceEffectiveOptions,
  RESTApiServiceExpressApp,
  RESTApiServiceHTTPServer,
  RESTApiServiceRequestAuthorizer,
  RESTApiServiceHTTPSCredentials,
  ConsoleColor
} from '@/types'

/**
 * Make the types available in imports
 */
export * from './types'

export default class RESTApiService implements RESTApiServiceInstance {
  /**
   * RESTApiService Class Factory
   * ---------------------------------------------------------------------------
   * The Class factory allows an asynchronous built of the instance (feature
   * not possible using regular class constructor)
   */
  public static create(
    routes: RESTApiServiceRoute[],
    userOptions: RESTApiServiceOptions
  ): Promise<RESTApiService> {
    /**
     * Perform input validation, and block the construction if input is not
     * properly formated (useful for  non typescript environments)
     */
    validateRoutes(routes)
    validateOptions(userOptions)

    /*
     * Combine user options with default options. To prevent potential
     * 'undefined' values assigned to optional option fields, perform cleanup
     * before merging to remove those keys
     */
    Object.entries(userOptions).reduce(
      (a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }),
      {}
    )
    const options = {
      ...defaultOptions,
      ...userOptions
    } as RESTApiServiceEffectiveOptions

    /*
     * The RESTApiService instance will be returned after the express App is
     * initialized. If server cannot be initialized an Error will be triggered
     */
    return new Promise(resolve => {
      try {
        const expressApp: RESTApiServiceExpressApp = express()
        expressApp.use(bodyParser.urlencoded({ extended: false }))
        expressApp.use(bodyParser.json())
        expressApp.use(addRequestId())
        expressApp.use(cors(options.cors))

        let _httpServer: http.Server
        if (options.protocol === 'http') {
          _httpServer = http.createServer(expressApp)
        } else {
          _httpServer = https.createServer(
            options.credentials as RESTApiServiceHTTPSCredentials,
            expressApp
          )
        }

        const httpServer: RESTApiServiceHTTPServer = httpServerWithShutdown(
          _httpServer
        )

        expressApp.listen(options.port, () => {
          resolve(new RESTApiService(routes, options, expressApp, httpServer))
        })
      } catch (e) {
        console.error(e)
        throw new Error('Cannot initialize RESTApiService')
      }
    })
  }

  /*
   * Class private constructor.
   * ---------------------------------------------------------------------------
   * The constructor, who is called by the class factory (create) after the
   * service has been initialized, performs the registration of the provided
   * api methods routes definitions.
   */
  private constructor(
    routes: RESTApiServiceRoute[],
    options: RESTApiServiceEffectiveOptions,
    expressApp: RESTApiServiceExpressApp,
    httpServer: RESTApiServiceHTTPServer
  ) {
    this.httpServer = httpServer
    this.expressApp = expressApp
    this.port = options.port
    this.authorizer = options.auth
    this.verbose = options.verbose
    this.logErrors = options.logErrors

    this.log(
      `RESTApiService : Listening at port ${options.port} (protocol=${options.protocol})`
    )

    /*
     * Log requests to console (if verbose option=true)
     */
    expressApp.use((req, res, next) => {
      this.log(
        `${ConsoleColor.yellow}${req.id} REQUEST  : ${req.method} ${req.url}`
      )
      next()
    })

    /*
     * Initialize the requests Router, using provided routes definitions
     */
    initializeRequestRouter(this, routes)

    /**
     * Ready!
     */
    this.log(`RESTApiService : Ready!`)
    this.log(`----------------------------------------------------------------`)
  }
  private readonly httpServer: RESTApiServiceHTTPServer

  public readonly expressApp: RESTApiServiceExpressApp

  public readonly authorizer: RESTApiServiceRequestAuthorizer

  public readonly port: number

  public static RESTApiServiceError: typeof RESTApiServiceError = RESTApiServiceError

  public logErrors: boolean

  public verbose: boolean

  public async destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.forceShutdown(error => {
        if (error) reject(error)
        else resolve()
      })
    })
  }

  public log(...message: unknown[]): void {
    if (this.verbose) console.log(...message, ConsoleColor.reset)
  }
}
