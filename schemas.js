const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Extension to sanitize the forms
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
const Joi = BaseJoi.extend(extension);

// Post schema
const postSchema = Joi.object({
    post: Joi.object({
        body: Joi.string().required().trim().max(2048).truncate().escapeHTML()
    }).required(),
    image: Joi.binary().encoding('base64'),
    deleteImgs: Joi.array()
}).required()

// Comment schema
const commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().trim().max(2048).truncate().escapeHTML()
    }).required()
}).required()

// User schema
const userSchema = Joi.object({
    username: Joi.string().alphanum().trim().min(4).max(32).required(),
    email: Joi.string().email().trim().max(64).required(),
    password: Joi.string().trim().min(8).max(20).required()
})

module.exports = {
    postSchema,
    commentSchema,
    userSchema
}