class ErrorClass extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        Error.captureStackTrace(this, this.constructor)
    }
}

const ErrorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'fail'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err,
        stack: err.stack
    })
}


module.exports = {ErrorClass, ErrorController}