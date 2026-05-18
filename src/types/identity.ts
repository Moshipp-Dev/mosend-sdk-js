import type { ISODateString, UUID } from "./common.js";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: UUID;
  email: string;
  name?: string;
  twoFactorEnabled?: boolean;
  createdAt: ISODateString;
}

export interface LoginInput {
  email: string;
  password: string;
  twoFactorCode?: string;
  recoveryCode?: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface SignupInput {
  email: string;
  password: string;
  name?: string;
  organizationName?: string;
}

export interface ApiKey {
  id: UUID;
  prefix: string;
  name: string;
  scopes: string[];
  lastUsedAt?: ISODateString;
  expiresAt?: ISODateString;
  createdAt: ISODateString;
}

export interface CreateApiKeyInput {
  name: string;
  scopes?: string[];
  expiresAt?: ISODateString;
}

export interface CreateApiKeyResponse extends ApiKey {
  secret: string;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string;
  locale?: string;
  timezone?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface Organization {
  id: UUID;
  name: string;
  slug: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
}

export type UpdateOrganizationInput = Partial<CreateOrganizationInput>;

export interface Membership {
  id: UUID;
  userId: UUID;
  organizationId: UUID;
  roleId: UUID;
  user?: { id: UUID; email: string; name?: string };
  role?: { id: UUID; name: string };
  wabaScope?: "ALL" | "SELECTED";
  wabaIds?: string[];
  createdAt: ISODateString;
}

export interface SetRoleInput {
  roleId: UUID;
}

export interface SetWabaScopeInput {
  scope: "ALL" | "SELECTED";
  wabaIds?: string[];
}

export interface Role {
  id: UUID;
  name: string;
  description?: string;
  builtin: boolean;
  permissions?: string[];
}

export interface Permission {
  key: string;
  description?: string;
  category?: string;
}

export interface Invitation {
  id: UUID;
  organizationId: UUID;
  email: string;
  roleId: UUID;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  expiresAt?: ISODateString;
  createdAt: ISODateString;
}

export interface CreateInvitationInput {
  email: string;
  roleId: UUID;
}

export interface AcceptInvitationInput {
  token: string;
}

export interface TwoFactorEnrollResponse {
  secret: string;
  otpauthUrl: string;
  qrSvg?: string;
  recoveryCodes?: string[];
}

export interface TwoFactorVerifyInput {
  code: string;
}

export interface Passkey {
  id: UUID;
  name?: string;
  credentialId: string;
  createdAt: ISODateString;
  lastUsedAt?: ISODateString;
}

export interface PasskeyRegistrationOptions {
  challenge: string;
  rp: Record<string, unknown>;
  user: Record<string, unknown>;
  pubKeyCredParams: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface PasskeyLoginOptions {
  challenge: string;
  rpId?: string;
  allowCredentials?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface PasskeyLoginVerifyResponse {
  user: User;
  tokens: AuthTokens;
}
