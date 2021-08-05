const Joi = require('joi')

const postSchema = Joi.object({
    post: Joi.object({
        body: Joi.string().required().trim().max(63206).truncate(),
        author: Joi.string().required().trim().max(50).truncate()
    }).required()
}).required()

const commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().trim().max(63206).truncate()
    }).required()
}).required()

module.exports = {
    postSchema,
    commentSchema
}