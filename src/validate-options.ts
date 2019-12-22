import RESTApiServiceError from '@/service-error'
import {
  RESTApiServiceOptions,
  RESTApiServiceErrorCodes,
  RESTApiServiceHTTPSCredentials
} from '@/types'

export class OptionsValidator {
  static checkOptionsObject(x: unknown): void {
    // options must be an object
    if (!x || typeof x !== 'object') {
      throw new RESTApiServiceError(
        'Second argument must be an object',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_TYPE
      )
    }
  }
  static checkProtocol(x: unknown): void {
    // protocol (optional) must be http or https
    if (typeof x !== 'string' || !['https', 'http'].includes(x)) {
      throw new RESTApiServiceError(
        'Options.protocol must be "http" or "https"',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_PROTOCOL
      )
    }
  }

  static checkPort(x: unknown): void {
    // port (optional) must be a number
    if (typeof x !== 'number') {
      throw new RESTApiServiceError(
        'Options.port must be a number',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_PORT
      )
    }
  }

  static checkVerbose(x: unknown): void {
    // verbose (optional) must be a boolean
    if (typeof x !== 'boolean') {
      throw new RESTApiServiceError(
        'Options.verbose must be a boolean',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_VERBOSE
      )
    }
  }

  static checkCors(x: unknown): void {
    // cors (optional) must be an object
    if (typeof x !== 'object') {
      throw new RESTApiServiceError(
        'Options.cors must be an object',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_CORS
      )
    }
  }

  static checkAuth(x: unknown): void {
    // auth (optional) must be a function
    if (typeof x !== 'function') {
      throw new RESTApiServiceError(
        'Options.auth must be a function',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_AUTH
      )
    }
  }

  static checkLogErrors(x: unknown): void {
    // logErrors (optional) must be a boolean
    if (typeof x !== 'boolean') {
      throw new RESTApiServiceError(
        'Options.logErrors must be a boolean',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_LOG_ERRORS
      )
    }
  }
  static checkCredentials(x: unknown): void {
    if (typeof x !== 'object' || x === null) {
      throw new RESTApiServiceError(
        'Options.credentials must be set when protocol="https"',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_CREDENTIALS
      )
    }
    if (typeof (x as RESTApiServiceHTTPSCredentials).cert !== 'string') {
      throw new RESTApiServiceError(
        'Options.credentials.cert must be a string',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_CREDENTIALS_CERTIFICATE
      )
    }
    if (typeof (x as RESTApiServiceHTTPSCredentials).key !== 'string') {
      throw new RESTApiServiceError(
        'Options.credentials.key must be a string',
        RESTApiServiceErrorCodes.INVALID_OPTIONS_CREDENTIALS_KEY
      )
    }
  }
}

/**
 * Perform validation on the user input (useful for non typescript environments)
 */
export default function validateOptions(o: RESTApiServiceOptions): void {
  const hasOption = (p: string): boolean => {
    return Object.prototype.hasOwnProperty.call(o, p)
  }

  OptionsValidator.checkOptionsObject(o)
  if (hasOption('protocol')) OptionsValidator.checkProtocol(o.protocol)
  if (hasOption('port')) OptionsValidator.checkPort(o.port)
  if (hasOption('verbose')) OptionsValidator.checkVerbose(o.verbose)
  if (hasOption('cors')) OptionsValidator.checkCors(o.cors)
  if (hasOption('auth')) OptionsValidator.checkAuth(o.auth)
  if (hasOption('logErrors')) OptionsValidator.checkVerbose(o.logErrors)
  if (o.protocol === 'https') OptionsValidator.checkCredentials(o.credentials)
}
