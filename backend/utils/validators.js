import Joi from 'joi';

export const tourValidator = Joi.object({
  title: Joi.string().required(),
  city: Joi.string().required(),
  desc: Joi.string().required(),
  maxGroupSize: Joi.number().required(),
  photo: Joi.string().required(),
  address: Joi.string().required(),
  price: Joi.number().required(),
  distance: Joi.number().required(),
});
import mongoose from 'mongoose';

export const isValidObjectId = id => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const validateRequest = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};
