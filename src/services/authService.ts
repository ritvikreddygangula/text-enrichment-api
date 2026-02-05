import { prisma } from '../db/client';
import { generateApiKey, hashApiKey } from '../utils/keyUtils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterResult {
  email: string;
  apiKey: string;
}

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export async function register(email: string): Promise<RegisterResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !EMAIL_REGEX.test(normalized)) {
    throw new AuthServiceError('Invalid email address', 'INVALID_EMAIL');
  }

  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  const user = await prisma.user.upsert({
    where: { email: normalized },
    create: {
      email: normalized,
      apiKeys: {
        create: { keyHash },
      },
    },
    update: {
      apiKeys: {
        create: { keyHash },
      },
    },
    include: { apiKeys: true },
  });

  return {
    email: user.email,
    apiKey,
  };
}
