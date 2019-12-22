import { RESTApiServiceErrorInterface } from '@/types'

export default class RESTApiServiceError extends Error
  implements RESTApiServiceErrorInterface {
  constructor(message: string, errCode: number) {
    super(message)
    /**
     * When extending the Error class with typescript the new constructor
     * reference is lost. Because of this "special behavior" of typescript
     * we need to assign the prototype manually...
     * More details here :
     * https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
     */
    Object.setPrototypeOf(this, RESTApiServiceError.prototype)

    this.message = message
    this.code = errCode
  }
  message: string
  code: number
}
