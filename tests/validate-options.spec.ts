import each from 'jest-each'

import validateOptions, { OptionsValidator } from '../src/validate-options'
import RESTApiServiceError from '../src/service-error'
import { RESTApiServiceErrorCode } from '../src/types'

function getErrorFrom(f): RESTApiServiceError {
  try {
    f()
  } catch (e) {
    return e
  }
}

describe('Validate Options object (direct)', (): void => {
  it('Succeeds with valid empty options object ', (): void => {
    const a = {}
    const t = (): void => validateOptions(a)
    expect(t).not.toThrowError()
  })

  it('Succeeds with valid basic options object (http)', (): void => {
    const a = {
      port: 8080,
      protocol: 'http'
    }
    const t = (): void => validateOptions(a)
    expect(t).not.toThrowError()
  })

  it('Succeeds with valid basic options object (https) ', (): void => {
    const a = {
      protocol: 'https',
      credentials: { cert: '', key: '' }
    }
    const t = (): void => validateOptions(a)
    expect(t).not.toThrowError()
  })
  it('Fails with https without credentials ', (): void => {
    const a = {
      protocol: 'https'
    }
    const t = (): void => validateOptions(a)
    expect(t).toThrowError()
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_OPTIONS_CREDENTIALS
    )
  })
})

describe('Validate Options.port', (): void => {
  it('Succeeds for valid type : number', (): void => {
    const t = (): void => OptionsValidator.checkPort(123)
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => OptionsValidator.checkPort(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_OPTIONS_PORT
    )
  })
})

describe('Validate Options.protocol', (): void => {
  it('Succeeds for valid type : "http"', (): void => {
    const t = (): void => OptionsValidator.checkProtocol('http')
    expect(t).not.toThrowError()
  })

  it('Succeeds for valid type : "https"', (): void => {
    const t = (): void => OptionsValidator.checkProtocol('http')
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => OptionsValidator.checkProtocol(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_OPTIONS_PROTOCOL
    )
  })
})

describe('Validate Options.verbose', (): void => {
  it('Succeeds for valid type : true', (): void => {
    const t = (): void => OptionsValidator.checkVerbose(true)
    expect(t).not.toThrowError()
  })

  it('Succeeds for valid type :  false', (): void => {
    const t = (): void => OptionsValidator.checkVerbose(false)
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], '', 'FOO', 123, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => OptionsValidator.checkVerbose(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_OPTIONS_VERBOSE
    )
  })
})

describe('Validate Options.logErrors', (): void => {
  it('Succeeds for valid type : true', (): void => {
    const t = (): void => OptionsValidator.checkLogErrors(true)
    expect(t).not.toThrowError()
  })

  it('Succeeds for valid type : false', (): void => {
    const t = (): void => OptionsValidator.checkLogErrors(false)
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], '', 'FOO', 123, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => OptionsValidator.checkLogErrors(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_OPTIONS_LOG_ERRORS
    )
  })
})

describe('Validate Options.auth', (): void => {
  it('Succeeds for valid type : function', (): void => {
    const t = (): void => OptionsValidator.checkAuth((): void => null)
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], 123, '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => OptionsValidator.checkAuth(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_OPTIONS_AUTH
    )
  })
})

describe('Validate Options.cors', (): void => {
  it('Succeeds for valid type : object', (): void => {
    const t = (): void => OptionsValidator.checkCors({})
    expect(t).not.toThrowError()
  })

  const invalidValues = [[], 123, '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => OptionsValidator.checkCors(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_OPTIONS_CORS
    )
  })
})

describe('Validate Options.credentials', (): void => {
  it('Succeeds for valid type : object', (): void => {
    const t = (): void =>
      OptionsValidator.checkCredentials({
        cert: '',
        key: ''
      })
    expect(t).not.toThrowError()
  })

  const invalidValues = [[], 123, '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => OptionsValidator.checkCredentials(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_OPTIONS_CREDENTIALS
    )
  })
})
