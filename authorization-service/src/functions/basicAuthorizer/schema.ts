export default {
  type: "object",
  properties: {
    type: { type: 'string' },
    authorizationToken: {type: 'string'},
    methodArn: {type: 'string'}
  },
  required: ['type']
} as const;
