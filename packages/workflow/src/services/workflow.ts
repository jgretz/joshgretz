import {publishExpectResponse} from './publish';
import {type Event} from '../Types';

type BusCommand = {key: string};
type CodeCommand = (payload?: any) => any | Promise<any>;
type Command = BusCommand | CodeCommand;

async function execute(command: Command, payload: any) {
  try {
    if ((command as BusCommand).key !== undefined) {
      const response = await publishExpectResponse((command as BusCommand).key, payload);
      if (response.success) {
        return {
          success: true,
          result: (response.result as Event).payload,
        };
      }

      return {
        success: false,
      };
    }

    const result = await (command as CodeCommand)(payload);
    return {
      success: true,
      result,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
}

export class Workflow {
  private commands: Command[];

  public key: string;

  constructor(key: string) {
    this.key = key;
    this.commands = [];
  }

  use(command: string | string[] | CodeCommand | Workflow | Workflow[]) {
    if (Array.isArray(command)) {
      command.forEach((c) => this.use(c));
    } else if (command instanceof Workflow) {
      this.commands.push(...command.commands);
    } else if (typeof command === 'string') {
      this.commands.push({key: command});
    } else {
      this.commands.push(command);
    }
    return this;
  }

  async execute(payload?: any) {
    let nextPayload = payload;
    for await (const command of this.commands) {
      const response = await execute(command, nextPayload);
      if (!response.success) {
        break;
      }

      const {result} = response;
      if (result !== null && typeof result === 'object') {
        nextPayload = {
          ...nextPayload,
          ...(result as object),
        };
      }
    }

    return nextPayload;
  }
}
