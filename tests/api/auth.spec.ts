import { AuthFailureSchema, AuthTokenSchema } from '@api/schemas';
import { expectJson } from '@api/http';
import { expect, test } from '@fixtures/api.fixtures';
import { env } from '@utils/env';

test.describe('POST /auth', { tag: ['@api'] }, () => {
  test('issues a token for valid credentials', { tag: '@smoke' }, async ({ api }) => {
    const res = await api.authenticate(env.API_USERNAME, env.API_PASSWORD);

    const body = await expectJson(res, 200, AuthTokenSchema);
    expect(body.token).toHaveLength(15);
  });

  test(
    'rejects bad credentials with a reason (HTTP 200 by design)',
    { tag: '@regression' },
    async ({ api }) => {
      const res = await api.authenticate(env.API_USERNAME, 'definitely-wrong');

      // The service answers 200 + {reason} rather than 401; the contract test pins that.
      await expectJson(res, 200, AuthFailureSchema);
    },
  );
});
