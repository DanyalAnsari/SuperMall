const validator = require("validator");
const mongoose = require("mongoose");

const validators = {
  // String validators
  isName: (value) => {
    // Allows letters, spaces, periods, hyphens, and apostrophes
    return /^[a-zA-Z\s.'-]+$/.test(value);
  },

  isProductName: (value) => {
    // Allows letters, numbers, spaces, hyphens, ampersands, parentheses, commas, and forward slashes
    return /^[a-zA-Z0-9\s\-&(),'"\/]+$/.test(value);
  },

  isCategoryName: (value) => {
    // Allows letters, numbers, spaces, and ampersands
    return /^[a-zA-Z0-9&\s]+$/.test(value);
  },

  isZipCode: (value) => {
    return validator.isPostalCode(value, "any");
  },

  isPhone: (value) => {
    return validator.isMobilePhone(value, "any", { strictMode: false });
  },

  isEmail: validator.isEmail,

  // Number validators
  isPositiveNumber: (value) => {
    return value > 0;
  },

  isNonNegativeInteger: (value) => {
    return Number.isInteger(value) && value >= 0;
  },

  isValidRating: (value) => {
    return value >= 0 && value <= 5;
  },

  // URL and ObjectId validators
  isValidObjectId: (value) => {
    return mongoose.Types.ObjectId.isValid(value);
  },

  isValidURL: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // Schema validation helpers
  getNameValidation: (fieldName) => ({
    validator: validators.isName,
    message: `${fieldName} should only contain letters and spaces`,
  }),
  getCategoryNameValidation: (fieldName) => ({
    validator: validators.isCategoryName,
    message: `${fieldName} should only contain letters and spaces and [&]`,
  }),
  getProductNameValidation: (fieldName) => ({
    validator: validators.isProductName,
    message: `${fieldName} should only contain letters, numbers and spaces `,
  }),
};

module.exports = validators;
