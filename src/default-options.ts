import { RESTApiServiceOptions } from '@/types'

const defaultOptions: RESTApiServiceOptions = {
  protocol: 'http',
  port: 8080,
  cors: {},
  verbose: false,
  auth: () => true,
  logControllerErrors: false
}

export default defaultOptions
