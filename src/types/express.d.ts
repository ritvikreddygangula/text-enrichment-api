declare global {
  namespace Express {
    interface Request {
      context?: {
        userId: string;
        apiKeyId: string;
      };
    }
  }
}

export {};
