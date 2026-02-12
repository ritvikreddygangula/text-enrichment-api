export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Text Enrichment API',
    description: 'REST API for text enrichment: keywords, entities, category. Protected by API keys and rate-limited.',
    version: '1.0.0',
  },
  servers: [{ url: '/', description: 'API root' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                example: { success: true, data: { ok: true }, error: null },
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'object', properties: { ok: { type: 'boolean' } } },
                    error: { type: 'null' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/auth/register': {
      post: {
        summary: 'Register and get API key',
        description: 'Creates a user if needed and returns an API key. The raw key is shown only once.',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email', example: 'user@example.com' } },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'API key issued',
            content: {
              'application/json': {
                example: {
                  success: true,
                  data: { email: 'user@example.com', apiKey: 'abc123...' },
                  error: null,
                },
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: { email: { type: 'string' }, apiKey: { type: 'string' } },
                    },
                    error: { type: 'null' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid email',
            content: {
              'application/json': {
                example: { success: false, data: null, error: { message: 'Invalid email address', code: 'INVALID_EMAIL' } },
              },
            },
          },
        },
      },
    },
    '/v1/enrich': {
      post: {
        summary: 'Enrich text',
        description: 'Extract keywords, entities, and category from text. Requires Bearer token. Min 20 characters.',
        tags: ['Enrich'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text'],
                properties: {
                  text: {
                    type: 'string',
                    minLength: 20,
                    example: 'Apple released a new MacBook with an M3 chip and long battery life.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Enriched result',
            content: {
              'application/json': {
                example: {
                  success: true,
                  data: {
                    keywords: ['apple', 'macbook', 'chip', 'battery', 'life'],
                    entities: ['Apple', 'MacBook', 'M3'],
                    category: 'Technology',
                  },
                  error: null,
                },
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        keywords: { type: 'array', items: { type: 'string' } },
                        entities: { type: 'array', items: { type: 'string' } },
                        category: { type: 'string', enum: ['Technology', 'Business', 'Health', 'General'] },
                      },
                    },
                    error: { type: 'null' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Text too short or invalid',
            content: {
              'application/json': {
                example: { success: false, data: null, error: { message: 'Text must be at least 20 characters', code: 'INVALID_INPUT' } },
              },
            },
          },
          '401': { description: 'Missing or invalid API key' },
          '429': { description: 'Rate limit exceeded' },
        },
      },
    },
    '/v1/usage': {
      get: {
        summary: 'Get usage logs',
        description: 'Returns the last 50 request logs for the authenticated API key.',
        tags: ['Usage'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of request logs',
            content: {
              'application/json': {
                example: {
                  success: true,
                  data: {
                    logs: [
                      {
                        id: '...',
                        method: 'POST',
                        path: '/v1/enrich',
                        statusCode: 200,
                        durationMs: 12,
                        textLength: 45,
                        createdAt: '2026-02-11T21:00:00.000Z',
                      },
                    ],
                  },
                  error: null,
                },
              },
            },
          },
          '401': { description: 'Missing or invalid API key' },
          '429': { description: 'Rate limit exceeded' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API Key',
        description: 'API key from POST /v1/auth/register',
      },
    },
  },
};
