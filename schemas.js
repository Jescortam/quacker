const Joi = require('joi')

const postSchema = Joi.object({
    body: Joi.string().required().trim().max(63206).truncate(),
    author: Joi.string().required().trim().max(50).truncate(),
    date: Joi.date().max('now').required()
}).required();

module.exports = postSchema;