const Schemes = require('./scheme-model')
const yup = require('yup')

const validateSc = yup.object({
  scheme_name: yup.string()
    .typeError('invalid scheme_name')
    .required('invalid scheme_name')
    .matches(/^[aA-zZ\s]+$/, 'invalid scheme_name')
})

const validatest = yup.object({
  step_number: yup.number()
    .required()
    .typeError("invalid step")
    .positive("invalid step"),
  instructions: yup.string()
    .required("invalid step")
    .typeError("invalid step")
    .matches(/^[aA-zZ\s]+$/, "invalid step")
})

const checkSchemeId = async (req, res, next) => {
  try {
    const scheme = await Schemes.findById(req.params.scheme_id);
    if (!scheme.scheme_id) {
      next({ status: 404, message: `scheme with scheme_id ${req.params.scheme_id} not found` })
    } else {
      next();
    }
  } catch (err) {
    next(err)
  }
}

const validateScheme = async (req, res, next) => {
  try {
    const validate = await validateSc.validate(req.body, { stripUnknown: true })
    req.body = validate
    next()
  } catch (err) {
    next({ status: 400, message: err.message })
  }
}

const validateStep = async (req, res, next) => {
  try {
    const validate = await validatest.validate(req.body, { stripUnknown: true })
    req.body = validate
    next()
  } catch (err) {
    next({ status: 400, message: err.message })
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
