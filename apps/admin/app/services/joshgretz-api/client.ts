import {treaty} from '@elysiajs/eden';
import type {App} from '@api';

export default treaty<App>(process.env.JOSHGRETZ_API_URL || '', {
  headers: {
    Authorization: `Bearer ${process.env.JOSHGRETZ_API_TOKEN}`,
  },
});
