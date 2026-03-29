import express from 'express';
import { validate } from '../../middleware/validate.middleware';
import { changePasswordSchema, forgetSchema, resetSchema, signinSchema, signupSchema } from './auth.validation';
import {
  changePasswordController,
  forgotPasswordController,
  getLoginUserController,
  refreshTokenController,
  resetPasswordController,
  signinController,
  signoutController,
  signupController,
} from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { refreshAuthMiddleware } from '../../middleware/refresh.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.post('/sign-in', validate(signinSchema), asyncHandler(signinController));
router.post('/sign-up', validate(signupSchema), asyncHandler(signupController));
router.post('/refresh-token', refreshAuthMiddleware, asyncHandler(refreshTokenController));
router.post('/sign-out', authMiddleware, asyncHandler(signoutController));

router.post('/forgot-password',validate(forgetSchema), asyncHandler(forgotPasswordController));

router.post('/reset-password/:token',validate(resetSchema), asyncHandler(resetPasswordController));
router.get('/me', authMiddleware,asyncHandler(getLoginUserController));

router.post('/change-password', authMiddleware,validate(changePasswordSchema), asyncHandler(changePasswordController));

// router.post(
//   '/products',
//   authMiddleware,
//   csrfProtection,   // 🔥 add here
//   hasPermission('product.create'),
//   createProduct
// );

export default router;
