import { zx } from 'zodix';

import { filterOptionsSchema, makeTypedFilterOptionsSchema } from '~/domain/shared/schemas.ts';

export const getPaginationParams = (request: Request) =>
  zx.parseQuery(request, filterOptionsSchema);

export const getTypedPaginationParams = <T extends string>(
  request: Request,
  sortColumns: readonly [T, ...T[]],
) => zx.parseQuery(request, makeTypedFilterOptionsSchema(sortColumns));
