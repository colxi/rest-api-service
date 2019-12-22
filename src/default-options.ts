import { RESTApiServiceEffectiveOptions } from '@/types'

const defaultOptions: RESTApiServiceEffectiveOptions = {
  protocol: 'http',
  port: 8080,
  cors: {},
  verbose: false,
  auth: () => true,
  logErrors: false,
  credentials: {
    key: '',
    cert: ''
  }
}

export default defaultOptions
