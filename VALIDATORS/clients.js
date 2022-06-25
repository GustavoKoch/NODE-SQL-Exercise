
const { check } = require("express-validator");

const clientValidators = [
  check(  "first_name",  "The first name is mandatory and should be at least 2 characters")
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage(),
  check("last_name").notEmpty().isLength({ min: 2 }),
  check("age").notEmpty().isLength({ min: 1 }),
  check("active", "This is boolean!")
    .notEmpty()
    
];

module.exports = {
  clientValidators,
};
