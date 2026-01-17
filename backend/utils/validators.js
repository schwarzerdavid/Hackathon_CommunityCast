import Joi from 'joi';

export const createBusinessSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Business name is required',
      'string.min': 'Business name must be at least 2 characters',
      'string.max': 'Business name cannot exceed 100 characters'
    }),
  contact_info: Joi.string().trim().min(5).max(500).required()
    .messages({
      'string.empty': 'Contact information is required',
      'string.min': 'Contact information must be at least 5 characters'
    })
});

export const createAdvertisementSchema = Joi.object({
  business_id: Joi.string().required()
    .messages({
      'string.empty': 'Business ID is required'
    }),
  title: Joi.string().trim().min(3).max(100).required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters'
    }),
  short_text: Joi.string().trim().min(5).max(200).required()
    .messages({
      'string.empty': 'Short text is required'
    }),
  promo_text: Joi.string().trim().min(10).max(1000).required()
    .messages({
      'string.empty': 'Promotion text is required'
    }),
  start_time: Joi.date().iso().required()
    .messages({
      'date.base': 'Start time must be a valid date'
    }),
  end_time: Joi.date().iso().greater(Joi.ref('start_time')).required()
    .messages({
      'date.base': 'End time must be a valid date',
      'date.greater': 'End time must be after start time'
    }),
  status: Joi.string().valid('draft', 'active', 'disabled').default('draft')
});

export const businessCodeSchema = Joi.object({
  business_code: Joi.string().length(8).pattern(/^[A-Z0-9]+$/).required()
    .messages({
      'string.empty': 'Business code is required',
      'string.length': 'Business code must be 8 characters',
      'string.pattern.base': 'Business code must contain only uppercase letters and numbers'
    })
});
