import { HttpException, HttpStatus } from '@nestjs/common'

export class MultipleErrorsException extends HttpException {
  constructor(errors: string[]) {
    super({ errors }, HttpStatus.BAD_REQUEST)
  }
}
