const { check } = require("express-validator");

const orderValidators = [
  check(  "price",  "Cannot be empty")
    .notEmpty()
    .isInt(),
  check("date").notEmpty().isDate(),
  check("user_id").notEmpty().isInt(),
 
    
];

module.exports = {
  orderValidators,
};