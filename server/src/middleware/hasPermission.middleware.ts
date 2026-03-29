import { prisma } from '../config/prisma';
import { redis } from '../config/redis';
import { ApiError } from '../utils/apiError';
import { Request, Response, NextFunction } from 'express';
export const hasPermission = (permissionName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return next(new ApiError(401, 'Unauthorized'));
      }

      // ✅ SUPER ADMIN
      if (user.roleType === 'SUPER_ADMIN') {
        return next();
      }

      const cacheKey = `perm:${user.userId}`;

      // 🔥 1. Check Redis
      const cached = await redis.get(cacheKey);

      if (cached) {
        const permissions: string[] = JSON.parse(cached);

        if (permissions.includes(permissionName)) {
          return next();
        }

        return next(new ApiError(403, 'Permission denied'));
      }

      // 🔴 2. Fetch from DB
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
          userPermissions: {
            include: { permission: true },
          },
        },
      });

      if (!dbUser) {
        return next(new ApiError(404, 'User not found'));
      }

      // 🔥 3. Collect Role Permissions
      const rolePermissions =
        dbUser.role?.rolePermissions.map((rp: any) => rp.permission.name) || [];

      // 🔥 4. Apply User Overrides
      const finalPermissions = new Set(rolePermissions);

      for (const up of dbUser.userPermissions) {
        if (up.allowed) {
          finalPermissions.add(up.permission.name);
        } else {
          finalPermissions.delete(up.permission.name);
        }
      }

      const permissionsArray = Array.from(finalPermissions);

      // 🔥 5. Cache it
      await redis.set(cacheKey, JSON.stringify(permissionsArray), 'EX', 3600);

      // 🔥 6. Check permission
      if (permissionsArray.includes(permissionName)) {
        return next();
      }

      return next(new ApiError(403, 'Permission denied'));
    } catch (err: unknown) {
      if (err instanceof Error) {
        return next(new ApiError(403, err.message));
      }
      return next(new ApiError(403, 'Something went wrong'));
    }
  };
};

// router.post(
//   '/products',
//   authMiddleware,
//   hasPermission('product.create'),
//   createProduct
// );
