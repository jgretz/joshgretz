import {Elysia} from 'elysia';
import Users from 'users';
import Running from 'running';

// environment
const PORT = process.env.PORT || 3003;
const DATABASE_URL = process.env.DATABASE_URL || '';
const AMPQ_URL = process.env.AMQP_URL || '';

// APIs
const {Api: UsersApi} = Users({databaseUrl: DATABASE_URL});
const {Api: RunningApi} = Running({databaseUrl: DATABASE_URL, amqpUrl: AMPQ_URL});

// run
const app = new Elysia().use(UsersApi).use(RunningApi).listen(PORT);
console.log(`JoshGretz-API is running at ${app.server?.hostname}:${app.server?.port}`);

// export type for intellisense
export type App = typeof app;
