import RESTApiServiceError from '@/service-error'

import {
  RESTApiServiceRoute,
  RESTApiServiceRequestMethods,
  RESTApiServiceErrorCode
} from '@/types'

export class RoutesValidator {
  static allowedMethods = new RESTApiServiceRequestMethods()

  static checkCollectionType(r: unknown[]): void {
    if (!Array.isArray(r)) {
      throw new RESTApiServiceError(
        'First argument must be an array',
        RESTApiServiceErrorCode.INVALID_ROUTES_COLLECTION
      )
    }
  }

  static checkRouteType(x: unknown, i?: number): void {
    // each route must be an array
    if (!Array.isArray(x)) {
      throw new RESTApiServiceError(
        `Route in index ${i} must be an array`,
        RESTApiServiceErrorCode.INVALID_ROUTE_TYPE
      )
    }
  }

  static checkMethod(x: unknown, i?: number): void {
    // only valid http method allowed
    if (
      typeof x !== 'string' ||
      !Object.prototype.hasOwnProperty.call(RoutesValidator.allowedMethods, x)
    ) {
      throw new RESTApiServiceError(
        `Invalid http method set for route with index ${i}. Allowed methods are : ${Object.keys(
          RoutesValidator.allowedMethods
        )}`,
        RESTApiServiceErrorCode.INVALID_ROUTE_METHOD
      )
    }
  }

  static checkURI(x: unknown, i?: number): void {
    // must be a string (URI pattern)
    if (typeof x !== 'string') {
      throw new RESTApiServiceError(
        `Invalid URI set for route with index ${i} . Expecting a string`,
        RESTApiServiceErrorCode.INVALID_ROUTE_URI
      )
    }
  }

  static checkController(x: unknown, i?: number): void {
    // third argument must be a function (controller)
    if (typeof x !== 'function') {
      throw new RESTApiServiceError(
        `Invalid Controller set for route with index ${i}. Expecting a function`,
        RESTApiServiceErrorCode.INVALID_ROUTE_CONTROLLER
      )
    }
  }

  static checkPrivateFlag(x: unknown, i?: number): void {
    // forth argument (optional) must be a boolean
    if (typeof x !== 'boolean') {
      throw new RESTApiServiceError(
        `Invalid Private Flag used in route with index ${i}. Expecting a boolean`,
        RESTApiServiceErrorCode.INVALID_ROUTE_PRIVATE_FLAG
      )
    }
  }
}

export function validateRoute(route: RESTApiServiceRoute, i?: number): void {
  RoutesValidator.checkRouteType(route, i)
  RoutesValidator.checkMethod(route[0], i)
  RoutesValidator.checkURI(route[1], i)
  RoutesValidator.checkController(route[2], i)
  if (route[3] !== undefined) RoutesValidator.checkPrivateFlag(route[3], i)
}

export default function validateRoutes(routes: RESTApiServiceRoute[]): void {
  RoutesValidator.checkCollectionType(routes)
  for (let i = 0; i < routes.length; i++) validateRoute(routes[i], i)
}
