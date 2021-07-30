const ExpressError = require('./utils/ExpressError')

const validateBody = schema => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errMsg = error.details.map(err => err.message).join(',') 
            next(new ExpressError(errMsg, 400));
        } else next();
    }
}

module.exports = {
    validateBody
}