const joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const passwordComplexitySchema = joi.string()
  .min(8)
  .max(255)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  .required()
  .label('Password')
  .messages({
    'string.pattern.base': 'The password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
  });

const userSchema = joi.object({
    Name: joi.string().trim().min(2).max(30).required(),
    Email : joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] }}).required(),
    Password : passwordComplexitySchema
})

const emailSchema = joi.object({
    Email : joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] }}).required()
})

const passwordSchema = joi.object({
    Password : passwordComplexitySchema
})

const eventSchema = joi.object({
    Title: joi.string().trim().min(5).max(256).required(),
    "Short description" : joi.string().trim().min(10).max(256).required(),
    Description: joi.string().trim().min(100).max(5000).required(),
    Platform: joi.string().trim().min(3).max(256).required(),
    Host: joi.string().trim().min(3).max(256).required(),
    Policy: joi.string().trim().min(0).max(256),
})

const categorySchema = joi.object({
    Name: joi.string().trim().max(256).required(), 
    Slug: joi.string().trim().max(256).required()
})

const postSchema = joi.object({
    Title: joi.string().trim().min(5).max(256).required(),
    "Meta description" : joi.string().trim().max(160).required(),
    Description: joi.string().trim().min(100).max(10000).required(),
    Slug: joi.string().trim().max(200).required()
})

const testimonialSchema = joi.object({
    Name: joi.string().trim().min(2).max(30).required(),
    Title : joi.string().trim().max(40).required(),
    Review: joi.string().trim().min(120).max(140).required()
})

const faqSchema = joi.object({
    Title: joi.string().trim().min(5).max(256).required(),
    Description : joi.string().trim().min(10).max(1500).required()
})

const teamSchema = joi.object({
    Name: joi.string().trim().max(30).required(),
    Position : joi.string().trim().max(100).required(),
    Link: joi.string().uri().allow('').optional()
})

// -------------- FUNCTIONS ----------------------------
// ----------------------------------------------------- 

function userValidation(data){
    return userSchema.validate(data);
}

function emailValidation(data){
    return emailSchema.validate(data);
}

function passwordValidation(data){
    return passwordSchema.validate(data);
}

function eventValidation(data){
    return eventSchema.validate(data);
}

function categoryValidation(data){
    return categorySchema.validate(data);
}

function postValidation (data){
    return postSchema.validate(data);
}

function testimonialValidation(data){
    return testimonialSchema.validate(data);
}

function faqValidation(data){
    return faqSchema.validate(data);
}

function teamValidation(data){
    return teamSchema.validate(data);
}


module.exports.userValidate = userValidation;
module.exports.emailValidate = emailValidation;
module.exports.passwordValidate = passwordValidation;
module.exports.eventValidate = eventValidation;
module.exports.categoryValidate = categoryValidation;
module.exports.postValidate = postValidation;
module.exports.testimonialValidate = testimonialValidation;
module.exports.faqValidate = faqValidation;
module.exports.teamValidate = teamValidation;