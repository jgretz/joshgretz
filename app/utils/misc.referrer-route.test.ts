import { faker } from '@faker-js/faker';
import { expect, test } from 'vitest';
import { getReferrerRoute } from './misc.ts';

test('referer header', () => {
  const root = faker.internet.url({ appendSlash: false });
  const route = '/route';
  const referer = `${root}${route}`;

  const request = new Request(root, {
    headers: { referer },
  });

  expect(getReferrerRoute(request)).toBe(route);
});

test('referrer header', () => {
  const root = faker.internet.url({ appendSlash: false });
  const route = '/route';
  const referrer = `${root}${route}`;

  const request = new Request(root, {
    headers: { referrer },
  });

  expect(getReferrerRoute(request)).toBe(route);
});

// skipping thist test for now because something strips the referrer property
// when it comes from the init params.
test.skip('referrer property', () => {
  const root = faker.internet.url({ appendSlash: false });
  const route = '/route';
  const referrer = `${root}${route}`;

  const request = new Request(root, { referrer });
  expect(getReferrerRoute(request)).toBe(route);
});

test('no referrer', () => {
  const root = faker.internet.url({ appendSlash: false });
  const request = new Request(root);
  expect(getReferrerRoute(request)).toBe('/');
});
