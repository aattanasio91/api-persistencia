const { check } = require('express-validator');
const { validateResult } = require('../helpers/validatorHelper');

const validateCreate = [ 
    check('nombre')
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 5 }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateCreate }
