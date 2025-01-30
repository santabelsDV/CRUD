const Joi = require("joi");

const validationScheme = Joi.object({
    Pages: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'Pages must be a number',
            'number.min': 'Pages must be at least 1',
            'any.required': 'Pages is required'
        }),
    Name: Joi.string().trim().min(2).max(100).required()
        .messages({
            'string.empty': 'Book name is required',
            'string.min': 'Book name must be at least 2 characters',
            'string.max': 'Book name must be less than 100 characters'
        }),
    Author: Joi.string().trim().min(2).max(50).required()
        .messages({
            'string.empty': 'Author name is required',
            'string.min': 'Author name must be at least 2 characters',
            'string.max': 'Author name must be less than 50 characters'
        }),
    Year: Joi.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).required()
        .messages({
            'string.pattern.base': 'Year must be in the format YYYY-MM-DD',
            'string.empty': 'Year is required',
        }),
    login: Joi.string().trim().min(2).max(100).required()
        .messages({
            'string.empty': 'Login is required',
            'string.min': 'Login must be at least 2 characters',
            'string.max': 'Login must be less than 100 characters'
        }),
    password: Joi.string().trim().min(2).max(200).required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 2 characters',
            'string.max': 'Password must be less than 200 characters'

    }),
    refreshToken: Joi.string().trim().min(2).max(200).required()
        .messages({
            'string.empty': 'Refresh token is required',
            'string.min': 'Refresh token must be at least 2 characters',
            'string.max': 'Refresh token must be less than 200 characters'
    }),
    email: Joi.string().trim().email().required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email is invalid'
    }),
    code: Joi.string().trim().min(300).max(9999).required()
        .messages({
            'string.empty': 'Code is required',
            'string.min': 'Code must be at least 300 characters',
            'string.max': 'Code must be less than 9999 characters'
    }),
    firstName: Joi.string().trim().min(2).max(200).required()
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name must be less than 200 characters'
    }),
    lastName: Joi.string().trim().min(2).max(200).required()
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name must be less than 200 characters'
    })
});

function validateData(data, fields) {
    let schema = validationScheme;

    // Видаляємо `required()` у всіх полях, які не передані
    Object.keys(validationScheme.describe().keys).forEach((key) => {
        if (!fields.includes(key)) {
            schema = schema.fork([key], (s) => s.optional()); // Робимо поле необов'язковим
        }
    });

    schema = schema.fork(fields, (s) => s.required()); // Робимо вибрані поля обов'язковими

    const { error } = schema.validate(data);
    return error ? error.details[0].message : 'Validation passed';
}


module.exports = { validationScheme, validateData };