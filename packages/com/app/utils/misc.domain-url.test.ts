import { faker } from '@faker-js/faker';
import { expect, test } from 'vitest';
import { getDomainUrl } from './misc.ts';

test('gets it from base request', () => {
  const url = faker.internet.url({ appendSlash: false });
  const request = new Request(url);
  expect(getDomainUrl(request)).toBe(url);
});

test('gets it from X-Forwarded-Host header', () => {
  const root = faker.internet.url({ appendSlash: false });
  const forwardedHost = faker.internet.domainName();

  const request = new Request(root, {
    headers: {
      'X-Forwarded-Host': forwardedHost,
    },
  });

  const expected = `https://${forwardedHost}`;
  expect(getDomainUrl(request)).toBe(expected);
});

test('gets it from host header', () => {
  const root = faker.internet.url({ appendSlash: false });
  const host = faker.internet.domainName();

  const request = new Request(root, {
    headers: { host },
  });

  const expected = `https://${host}`;
  expect(getDomainUrl(request)).toBe(expected);
});

test('leaves localhost as http', () => {
  const root = 'http://localhost';
  const request = new Request(root);
  expect(getDomainUrl(request)).toBe(root);
});
