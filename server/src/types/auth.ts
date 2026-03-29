export interface PasetoPayload {
  userId: number;
  tenantId?: number;
  roleType: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'USER';
  tokenVersion: number;
  type?: 'access' | 'refresh';
  iat?: string;
  exp?: string;
  sessionId?: string;
}
