import RESTApiService from '../src/index'
import fetch from 'node-fetch'

const PORT = 9918
const allowedToken = 'VALID'
const authorizer = (token): boolean => token === allowedToken
const publicEndpointController = jest.fn()
const privateEndpointController = jest.fn()
const routes = [
  ['POST', '/test/:id', publicEndpointController],
  ['GET', '/test/:id', publicEndpointController],
  ['GET', '/test/private/:id', privateEndpointController, true]
]

RESTApiService.create(routes, {
  port: PORT,
  protocol: 'http',
  auth: authorizer
})

describe('Requests Handling (public endpoints)', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('calls the endpoint controller on request', async () => {
    await fetch(`http://127.0.0.1:${PORT}/test/666`, {
      method: 'get'
    })
    expect(publicEndpointController).toHaveBeenCalled()
  })

  test('calls the endpoint controller on request providing url params (GET)', async () => {
    await fetch(`http://127.0.0.1:${PORT}/test/666`, {
      method: 'get'
    })
    expect(publicEndpointController).toHaveBeenCalledWith(
      expect.any(Function),
      { params: { id: '666' }, payload: {}, query: {} },
      'undefined'
    )
  })

  test.skip('calls the endpoint controller on request providing url query (GET)', async () => {
    await fetch(`http://127.0.0.1:${PORT}/test?data=777`, {
      method: 'get'
    })
    expect(publicEndpointController).toHaveBeenCalledWith(
      expect.any(Function),
      { params: { id: '666' }, payload: {}, query: { data: '777' } },
      'undefined'
    )
  })

  test('calls the endpoint controller on request providing body data (POST)', async () => {
    await fetch(`http://127.0.0.1:${PORT}/test/666`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 777 })
    })
    expect(publicEndpointController).toHaveBeenCalledWith(
      expect.any(Function),
      { params: { id: '666' }, payload: { data: 777 }, query: {} },
      'undefined'
    )
  })
})

describe('Request handling (Private) endpoints', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('does not call private endpoint controller on invalid auth ', async () => {
    await fetch(`http://127.0.0.1:${PORT}/test/private/666`, {
      method: 'get',
      headers: {
        'auth-token': ''
      }
    })
    expect(privateEndpointController).not.toHaveBeenCalled()
  })

  it('calls  private endpoint controller on valid auth ', async () => {
    await fetch(`http://127.0.0.1:${PORT}/test/private/666`, {
      method: 'get',
      headers: {
        'auth-token': allowedToken
      }
    })
    expect(privateEndpointController).toHaveBeenCalled()
  })
})
