import {
  RESTApiServiceRoute,
  RESTApiServiceOptions,
  RESTApiServiceRequestMethods
} from '@/types'

function validateUserRoutes(routes: RESTApiServiceRoute[]): void {
  const allowedMethods = new RESTApiServiceRequestMethods()
  /*
   * Validate routes. Iterate all routes and check for proper formating
   */
  if (!Array.isArray(routes)) {
    throw new Error('First argument must be an array')
  }

  for (const route of routes) {
    // each route must be an array
    if (!Array.isArray(route)) {
      throw new Error(`Route "${route}" must be an array`)
    }
    // first index must be a valid http method
    if (!Object.prototype.hasOwnProperty.call(allowedMethods, route[0])) {
      throw new Error(
        `Route "${route}" HTTP methods is invalid. Allowed methods are : ${Object.keys(
          allowedMethods
        )}`
      )
    }
    // second index must be a string (URI pattern)
    if (typeof route[1] !== 'string') {
      throw new Error(`Route "${route}" URI is invalid. Expecting a string`)
    }
    // third argument must be a function (controller)
    if (typeof route[2] !== 'function') {
      throw new Error(
        `Route "${route}" controller is invalid. Expecting a function`
      )
    }
    // forth argument (optional) must be a boolean
    if (typeof route[3] !== 'boolean') {
      throw new Error(
        `Route "${route}" private route flag is invalid. Expecting a boolean`
      )
    }
  }
}

function validateUserOptions(options: RESTApiServiceOptions): void {
  /*
   * Validate the options object. Check all internal properties
   */

  // options must be an object
  if (!options || typeof options !== 'object') {
    throw new Error('Second argument must be an object')
  }
  // protocol (optional) must be http or https
  if (options.protocol && !['https', 'http'].includes(options.protocol)) {
    throw new Error('Options.protocol must be "http" or "https"')
  }
  // port (optional) must be a number
  if (options.port && typeof options.port !== 'number') {
    throw new Error('Options.port must be a number')
  }
  // verbose (optional) must be a boolean
  if (options.verbose && typeof options.verbose !== 'boolean') {
    throw new Error('Options.verbose must be a boolean')
  }
  // logControllerErrors (optional) must be a boolean
  if (
    options.logControllerErrors &&
    typeof options.logControllerErrors !== 'boolean'
  ) {
    throw new Error('Options.logControllerErrors must be a boolean')
  }
  // cors (optional) must be an object
  if (options.cors && typeof options.cors !== 'object') {
    throw new Error('Options.cors must be an object')
  }
  // auth (optional) must be a function
  if (options.auth && typeof options.cors !== 'function') {
    throw new Error('Options.auth must be a function')
  }
}

/**
 * Perform validation on the user input (useful for non typescript environments)
 */
export default function validateOptions(
  routes: RESTApiServiceRoute[],
  options: RESTApiServiceOptions
): void {
  validateUserRoutes(routes)
  validateUserOptions(options)
}
