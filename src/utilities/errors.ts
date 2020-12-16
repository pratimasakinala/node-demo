class CustomError extends Error {
    status: number = 500;

    constructor(message: string) {
      super(message);

      this.name = this.constructor.name;
    }
  }

  export class InvalidInputError extends CustomError {
    constructor(message: string) {
      super(message);

      this.status = 400;
    }
  }

  export class NotFoundError extends CustomError {
    constructor(message: string, status?: number) {
      super(message);

      this.status = status ? status : 404;
    }
  }

  export class UnauthenticatedError extends CustomError {
    constructor(message: string) {
      super(message);

      this.status = 401;
    }
  }

  export class UnauthorizedError extends CustomError {
    constructor(message: string) {
      super(message);

      this.status = 403;
    }
  }

  export class UnenrolledError extends CustomError {
    constructor(message: string) {
      super(message);

      this.status = this.status ? this.status : 402;
    }
  }

  export class UnhandledError extends CustomError {
    constructor(message: string) {
      super(message);

      this.status = this.status ? this.status : 500;
    }
  }