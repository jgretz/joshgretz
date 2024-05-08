import {treaty} from '@elysiajs/eden';
import type {App} from '@joshgretz-api';

export default treaty<App>(process.env.JOSHGRETZ_API_URL || '');
