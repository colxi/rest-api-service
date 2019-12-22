import {
  RESTApiServiceInstance,
  RESTApiServiceHTTPServerRequest,
  RESTApiServiceHTTPServerResponse,
  RESTApiServiceRequestAuthorizer,
  RESTApiServiceRequestInterceptor,
  RESTApiServiceRouteDescriptor,
  RESTApiServiceRequestPayload,
  RESTApiServiceRequestResponder,
  PlainObject,
  ConsoleColor
} from '@/types'

/**
 * ## createRequestInterceptor :
 * -----------------------------------------------------------------------------
 * Returns an individual request interceptor initialized with the provided
 * parameters.
 */
export default function createRequestInterceptor(
  route: RESTApiServiceRouteDescriptor,
  authorizer: RESTApiServiceRequestAuthorizer,
  service: RESTApiServiceInstance
): RESTApiServiceRequestInterceptor {
  /**
   * ## requestInterceptor :
   * -----------------------------------------------------------------------------
   * Is a middleware functions that is executed when there is a route match.
   * It performs some basic preprocessing and filtering, like  handling HEAD
   * requests, private API authorization, payloads extraction and route
   * controller execution.
   */
  return async function requestInterceptor(
    expressRequest: RESTApiServiceHTTPServerRequest,
    expressResponse: RESTApiServiceHTTPServerResponse
  ): Promise<void> {
    /*
     * Handle HEAD network requests
     * -------------------------------------------------------------------------
     * For known routes, network requests using the method HEAD
     * should always return 200 with an empty body in the response
     */
    if (expressRequest.method === 'HEAD') {
      expressResponse.status(200).end()
      return
    }

    /*
     * Extract auth token
     * -------------------------------------------------------------------------
     * Extract the auth token from the request headers
     */
    const token = String(expressRequest.headers['auth-token'])

    /*
     * Handle private routes access authorization
     * -------------------------------------------------------------------------
     * If the route is flagged as private pass the auth token  to the
     * authorizer function. Block execution returning a 401 Unauthorized
     * to the client if the authorizer return false.
     */
    if (route.private && !(await authorizer(token))) {
      expressResponse.status(401).json({ error: 'Token invalid or expired' })
      service.log(`${ConsoleColor.red}${expressRequest.id} RESPONSE : 401`)
      return
    }

    /*
     * Build a responder method
     * -------------------------------------------------------------------------
     * The responder method accepts a response status code as a first argument
     * and a response payload object (if not provided defaults to  empty object)
     */
    const responder: RESTApiServiceRequestResponder = (
      statusCode: number,
      responseData?: PlainObject
    ) => {
      expressResponse.status(statusCode).json(responseData || {})
      service.log(
        `${statusCode < 300 ? ConsoleColor.green : ConsoleColor.red}${
          expressRequest.id
        } RESPONSE : ${statusCode}`
      )
      return
    }

    /*
     * Build a new payload object
     * -------------------------------------------------------------------------
     * The payload object contains all the request provided data. Data contained
     * in the body (from request methods such POST), data inserted in the URL
     * with interpolation (params), and data from url queries (query) is
     * accessible using this object
     */
    const payload: RESTApiServiceRequestPayload = {
      payload: expressRequest.body || {},
      params: expressRequest.params || {},
      query: expressRequest.query || {}
    }

    /*
     * Call the route Controller
     * -------------------------------------------------------------------------
     * Perform the call to the controller, providing the responder method,
     * the payload and the request auth token. Handle any potential runtime
     * error and return an error 500 (Server internal error)
     */
    try {
      await route.controller(responder, payload, token)
    } catch (e) {
      expressResponse.status(500).end()
      service.log(`${ConsoleColor.red}${expressRequest.id} RESPONSE : 500`)
      if (service.logErrors) console.error('CONTROLLER ERROR', e)
    }

    /*
     * ...if Controller didn't emit a response send a response with code 200
     */
    if (!expressResponse.headersSent) {
      expressResponse.status(200).json({})
      service.log(`${ConsoleColor.green}${expressRequest.id} RESPONSE : 200`)
    }

    /*
     * Done !
     */
  }
}
