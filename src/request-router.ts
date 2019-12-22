import createRequestInterceptor from '@/request-interceptor'
import {
  RESTApiServiceInstance,
  RESTApiServiceExpressApp,
  RESTApiServiceExpressAppRequestHandler,
  RESTApiServiceRoute,
  RESTApiServiceRouteDescriptor,
  ConsoleColor
} from '@/types'

/**
 * ## initializeRequestRouter :
 * -----------------------------------------------------------------------------
 * Iterates all the provided routes, and initializes a request handler for each
 * one. Requests are not delegated to the controller directly, instead an
 * interceptor performs first some basic preprocessing.
 */
export default function initializeRequestRouter(
  service: RESTApiServiceInstance,
  routes: RESTApiServiceRoute[]
): void {
  service.log(
    `RESTApiServer : Initializing requests router (routesCount=${routes.length})`
  )

  /*
   * Add a listener for all OPTIONS requests and return 200 status Code
   */
  service.expressApp.options('*', (expressRequest, expressResponse) => {
    expressResponse.status(200).end()
  })

  /*
   * Iterate provided routes collection
   */
  for (const routeDescriptor of routes) {
    /*
     * Generate a route object.
     * -------------------------------------------------------------------------
     * Convert the array into a typed object for easier manipulation
     */
    const route: RESTApiServiceRouteDescriptor = {
      method: routeDescriptor[0],
      uri: routeDescriptor[1],
      controller: routeDescriptor[2],
      private: routeDescriptor[3] || false
    }

    /*
     * Log route registration (if verbose=true)
     */
    service.log(
      ' - Registering route...',
      route.method,
      route.uri,
      route.private ? '(private)' : ''
    )

    /*
     * Generate a new interceptor for the route requests.
     * -------------------------------------------------------------------------
     * Interceptor handles each request, triggers token validation in private
     * calls, extracts the request payload, and executes the route controller
     */
    const requestInterceptor = createRequestInterceptor(
      route,
      service.authorizer,
      service
    )

    /*
     * Initialize the router
     * -------------------------------------------------------------------------
     * Use the appropriate request method handler, and initializes the
     * route URI and interceptor, in HTTP server
     */
    const httpServerRequestHandler: RESTApiServiceExpressAppRequestHandler = service.expressApp[
      route.method.toLocaleLowerCase() as keyof RESTApiServiceExpressApp
    ].bind(service.expressApp)
    httpServerRequestHandler(route.uri, requestInterceptor)
  }

  /*
   * Handle 404 Unknown Resources
   * -------------------------------------------------------------------------
   * Declare a route handler for unknown resources for all request methods, and
   * return a 404 status code and an empty response
   */
  service.expressApp.all('*', (expressRequest, expressResponse) => {
    expressResponse.status(404).end()
    service.log(`${ConsoleColor.red}${expressRequest.id} RESPONSE : 404`)
  })

  /*
   * Ready!
   */
}
