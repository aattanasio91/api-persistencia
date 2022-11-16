const { check } = require('express-validator');
const { validateResult } = require('../helpers/validatorHelper');

const validateCreate = [ 
    check('usuario')
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 5 }),
    check('pass')
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 5 }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateCreate }
