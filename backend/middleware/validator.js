/**
 * Input validation middleware using Joi
 */

import Joi from "joi";
import { ValidationError } from "../utils/error.js";

/**
 * Validates request data against a Joi schema
 * @param {Object} schema - Joi schema for validation
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Middleware function
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return next(new ValidationError('Validation error', errors));
    }

    // Replace request data with validated data
    req[property] = value;
    next();
  };
};

/**
 * Common validation schemas
 */

// Auth schemas
export const authSchemas = {
  register: Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Manager', 'Deliverer', 'Customer').required(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[0-9\s-()]{8,20}$/).optional(),
    areas: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    notificationPreferences: Joi.object({
      email: Joi.boolean().default(true),
      sms: Joi.boolean().default(false)
    }).optional()
  }),
  
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({ 'any.only': 'Passwords do not match' })
  })
};

// Customer schemas
export const customerSchemas = {
  createSubscription: Joi.object({
    publicationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    quantity: Joi.number().integer().min(1).default(1),
    startDate: Joi.date().min('now').required(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional(),
    addressId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    deliveryPreferences: Joi.object({
      placement: Joi.string().default('Door'),
      additionalInstructions: Joi.string().optional()
    }).optional()
  }),
  
  modifySubscription: Joi.object({
    quantity: Joi.number().integer().min(1).optional(),
    endDate: Joi.date().optional(),
    addressId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    status: Joi.string().valid('Active', 'Paused', 'Cancelled').optional(),
    deliveryPreferences: Joi.object({
      placement: Joi.string(),
      additionalInstructions: Joi.string().allow('', null)
    }).optional()
  }),
  
  pauseSubscription: Joi.object({
    subscriptionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    startDate: Joi.date().min('now').required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required(),
    reason: Joi.string().optional()
  }),
  
  createAddress: Joi.object({
    streetAddress: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    deliveryInstructions: Joi.string().optional(),
    isDefault: Joi.boolean().default(false)
  }),
  
  payment: Joi.object({
    billId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.string().valid('Cash', 'Cheque', 'Online', 'UPI', 'Card').required(),
    referenceNumber: Joi.string().when('paymentMethod', {
      is: Joi.valid('Cheque', 'Online', 'UPI', 'Card'),
      then: Joi.string().required(),
      otherwise: Joi.optional()
    })
  })
};

// Manager schemas
export const managerSchemas = {
  createPublication: Joi.object({
    name: Joi.string().required(),
    language: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    publicationType: Joi.string().valid('Daily', 'Weekly', 'Monthly', 'Quarterly').required(),
    publicationDays: Joi.array().items(
      Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    ).when('publicationType', {
      is: 'Weekly',
      then: Joi.array().min(1).required(),
      otherwise: Joi.optional()
    }),
    areas: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required()
  }),
  
  createDeliverer: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[0-9\s-()]{8,20}$/).required(),
    areasAssigned: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(),
    bankDetails: Joi.object({
      accountName: Joi.string().required(),
      accountNumber: Joi.string().required(),
      bankName: Joi.string().required(),
      ifscCode: Joi.string().required()
    }).required(),
    commissionRate: Joi.number().default(2.5)
  }),
  
  processSubscriptionRequest: Joi.object({
    status: Joi.string().valid('Approved', 'Rejected').required(),
    comments: Joi.string().optional(),
    delivererId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).when('status', {
      is: 'Approved',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }),
  
  createDeliverySchedule: Joi.object({
    personnelId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    date: Joi.date().required(),
    areaId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    routeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    notes: Joi.string().optional()
  }),
  
  generateBills: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2000).max(2100).required(),
    areaId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    dueDate: Joi.date().required()
  }),
  
  sendPaymentReminder: Joi.object({
    billIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(),
    reminderType: Joi.string().valid('First Notice', 'Final Notice', 'Subscription Suspension Notice').required(),
    deliveryMethod: Joi.string().valid('Email', 'SMS', 'Print').default('Print')
  }),
  
  processDelivererPayment: Joi.object({
    personnelId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    paymentMonth: Joi.number().integer().min(1).max(12).required(),
    paymentYear: Joi.number().integer().min(2000).max(2100).required(),
    paymentMethod: Joi.string().valid('Cash', 'Bank Transfer', 'Cheque').required(),
    transactionId: Joi.string().when('paymentMethod', {
      is: Joi.valid('Bank Transfer', 'Cheque'),
      then: Joi.string().required(),
      otherwise: Joi.optional()
    })
  })
};

// Deliverer schemas
export const delivererSchemas = {
  updateDeliveryStatus: Joi.object({
    status: Joi.string().valid('Delivered', 'Failed', 'Skipped').required(),
    deliveryNotes: Joi.string().optional(),
    deliveryTime: Joi.date().default(Date.now)
  }),
  
  uploadDeliveryProof: Joi.object({
    deliveryItemId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    photoProof: Joi.string().required() // Base64 encoded image
  })
};

// ID parameter validation
export const idSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});
