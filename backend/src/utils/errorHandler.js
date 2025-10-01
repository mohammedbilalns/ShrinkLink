export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  console.error("Error", err);
  res.status(500).json({
    success: false,
    message: err.message|| "Internal server error",
  });
};


export class NotFoundError extends AppError {
    constructor(message = "Resource not found"){
        super(message, 404)
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict occured"){
        super(message,409)
    }
}

export class BadReqeustError extends AppError {
    constructor(message = "Bad Request"){
        super(message,400)
    }
}

export class UnAuthorizedError extends AppError {
    constructor(message = "Unauthorized"){
        super(message,401)
    }
}
