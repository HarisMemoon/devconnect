// validators/blogValidators.js
import { body } from 'express-validator';

export const createBlogValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),

  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
];

export const commentValidator = [
  body('text')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters'),
];
