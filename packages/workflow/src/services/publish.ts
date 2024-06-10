import {connect} from './rabbit/connect';
import {createPublisher} from './rabbit/createPublisher';
import {createRPCClient} from './rabbit/createRPCClient';

export async function publish<P>(key: string, payload?: P): Promise<void> {
  const rabbit = connect();
  const pub = createPublisher(rabbit);

  try {
    await pub.send(key, JSON.stringify(payload || {}));
  } finally {
    await pub.close();
    await rabbit.close();
  }
}

export async function publishExpectResponse<P, R>(key: string, payload?: P): Promise<R> {
  const rabbit = connect();
  const pub = createRPCClient(rabbit);

  try {
    const response = await pub.send(key, JSON.stringify(payload || {}));

    return JSON.parse(response.body) as R;
  } finally {
    await pub.close();
    await rabbit.close();
  }
}
