import Joi from "joi";

export const memeSchema = Joi.object({
  title: Joi.string().min(3).required(),
  url: Joi.string().uri().required(),
});

export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().min(6).required(),
});
