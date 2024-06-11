import {connect} from './rabbit/connect';
import {createPublisher} from './rabbit/createPublisher';
import {createRPCClient} from './rabbit/createRPCClient';
import type {Response} from '../Types';

export async function publish<P>(key: string, payload?: P): Promise<Response<void>> {
  const rabbit = connect();
  const pub = createPublisher(rabbit);

  try {
    await pub.send(key, JSON.stringify(payload || {}));

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  } finally {
    await pub.close();
    await rabbit.close();
  }
}

export async function publishExpectResponse<P, R>(key: string, payload?: P): Promise<Response<R>> {
  const rabbit = connect();
  const pub = createRPCClient(rabbit);

  try {
    const response = await pub.send(key, JSON.stringify(payload || {}));
    const result = JSON.parse(response.body) as R;

    return {
      success: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  } finally {
    await pub.close();
    await rabbit.close();
  }
}
