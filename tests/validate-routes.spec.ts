import each from 'jest-each'

import validateRoutes, { RoutesValidator } from '../src/validate-routes'
import RESTApiServiceError from '../src/service-error'
import { RESTApiServiceErrorCode } from '../src/types'

function getErrorFrom(f): RESTApiServiceError {
  try {
    f()
  } catch (e) {
    return e
  }
}

describe('Validate Routes collection (direct)', (): void => {
  it('Succeeds for valid route collection ', (): void => {
    const a = [
      ['GET', '/foo/bar', (): void => null, true],
      ['POST', '/foo/:id', (): void => null, false],
      ['PUT', '/foo', (): void => null]
    ]
    const t = (): void => validateRoutes(a)
    expect(t).not.toThrowError()
  })
})

describe('Validate Routes collection', (): void => {
  it('Succeeds for valid type : array', (): void => {
    const t = (): void => RoutesValidator.checkCollectionType([])
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, 1, '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => RoutesValidator.checkCollectionType(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_ROUTES_COLLECTION
    )
  })
})

describe('Validate Route type', (): void => {
  it('Succeeds for valid type : array', (): void => {
    const t = (): void => RoutesValidator.checkRouteType([])
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, 1, '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => RoutesValidator.checkRouteType(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_ROUTE_TYPE
    )
  })
})

describe('Validate Route Method', (): void => {
  const validValues = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  each(validValues).it('Succeeds for valid value  %p ', a => {
    const t = (): void => RoutesValidator.checkMethod(a)
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], 1, '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => RoutesValidator.checkMethod(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_ROUTE_METHOD
    )
  })
})

describe('Validate Route URI', (): void => {
  it('Succeeds for valid type : string', (): void => {
    const t = (): void => RoutesValidator.checkURI('_A_STRING_')
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], 1, true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => RoutesValidator.checkURI(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_ROUTE_URI
    )
  })
})

describe('Validate Route Controller', (): void => {
  it('Succeeds for valid type : function', (): void => {
    const t = (): void => RoutesValidator.checkController((): void => null)
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], 1, '', 'FOO', true, false, undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => RoutesValidator.checkController(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_ROUTE_CONTROLLER
    )
  })
})

describe('Validate Route PrivateFlag', (): void => {
  it('Succeeds for valid type : boolean', (): void => {
    const t = (): void => RoutesValidator.checkPrivateFlag(true)
    expect(t).not.toThrowError()
  })

  const invalidValues = [{}, [], 1, '', 'FOO', undefined, null]
  each(invalidValues).it('Fails for invalid value  %p ', a => {
    const t = (): void => RoutesValidator.checkPrivateFlag(a)
    expect(t).toThrow(RESTApiServiceError)
    expect(getErrorFrom(t).code).toBe(
      RESTApiServiceErrorCode.INVALID_ROUTE_PRIVATE_FLAG
    )
  })
})
