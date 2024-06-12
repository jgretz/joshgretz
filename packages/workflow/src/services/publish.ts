import {connect} from './rabbit/connect';
import {createPublisher} from './rabbit/createPublisher';
import {createRPCClient} from './rabbit/createRPCClient';
import {error, success} from './utility/busResponse';
import {encapsulate} from './utility/encapsulate';
import type {BusResponse} from '../Types';

export async function publish<P>(key: string, payload?: P): Promise<BusResponse<void>> {
  const rabbit = connect();
  const pub = createPublisher(rabbit);

  try {
    await pub.send(key, encapsulate(payload));

    return success();
  } catch (err) {
    return error(err);
  } finally {
    await pub.close();
    await rabbit.close();
  }
}

export async function publishAndWaitForResponse<P, R extends {} | void>(
  key: string,
  payload?: P,
): Promise<BusResponse<R>> {
  const rabbit = connect();
  const pub = createRPCClient(rabbit);

  try {
    const response = await pub.send(key, encapsulate(payload));
    const result = JSON.parse(response.body) as R;

    return success(result);
  } catch (err) {
    return error(err);
  } finally {
    await pub.close();
    await rabbit.close();
  }
}
