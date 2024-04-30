import {Elysia} from 'elysia';

const JOSHGRETZ_COM = 'https://joshgretz.com';

const Redirect = new Elysia().get('/*', ({redirect, set}) => {
  set.status = 301;
  return redirect(JOSHGRETZ_COM);
});

const app = new Elysia().use(Redirect).listen(3000);
console.log(`Redirect is running at ${app.server?.hostname}:${app.server?.port}`);
