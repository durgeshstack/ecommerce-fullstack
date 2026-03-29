import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { forceLogoutUser } from '../../utils/session';
import {
  ChangePasswordInput,
  ForgetInput,
  ResetInput,
  SigninInput,
  SignupInput,
} from './auth.validation';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
export const signupService = async (postData: SignupInput) => {
  try {
    const existUser = await prisma.user.findUnique({
      where: { email: postData.email },
    });
    if (existUser) {
      throw new Error('User already exist with same email');
    }

    const tenant = await prisma.tenant.create({ data: {} });

    if (!tenant || !tenant.id) {
      throw new Error('Failed to create tenant');
    }

    const hashedPassword = await bcrypt.hash(postData.password, 10);
    await prisma.user.create({
      data: {
        email: postData.email,
        name: postData.name,
        password: hashedPassword,
        tenantId: tenant.id,
        roleId: 2,
      },
    });

    return { success: true, data: {} };
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: 'something went wrong while signup' };
  }
};

export const signinService = async (postData: SigninInput) => {
  try {
    const { email, password } = postData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password please try again');
    }
    return {
      success: true,
      data: user,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: 'something went wrong while signin' };
  }
};

export const forgetService = async (postData: ForgetInput) => {
  try {
    const email = postData.email;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExp: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // TODO: send email
    const resetUrl = `${env.BACKEND_URL}/reset-password/${resetToken}`;

    return { success: true, message: 'reset link sent to email' };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: 'something went wrong while forget' };
  }
};

export const resetService = async (postData: ResetInput, token: string) => {
  try {
    const { newPassword } = postData;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExp: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExp: null,
        tokenVersion: { increment: 1 },
      },
    });
    await forceLogoutUser(user.id);

    return { success: true, message: 'Password rest successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: 'something went wrong while reset password' };
  }
};
export const changePasswordService = async (postData: ChangePasswordInput, userId: number) => {
  try {
    const { newPassword, oldPassword } = postData;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });

    await forceLogoutUser(userId);

    return { success: true, message: 'Password change successfully' };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: 'something went wrong while change password' };
  }
};

export const getLoginUserService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User Not found');
    }
    return {
      success: true,
      message: 'User found',
      data: user,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: 'something went wrong while getting login user data' };
  }
};
