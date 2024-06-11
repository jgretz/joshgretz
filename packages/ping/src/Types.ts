export interface PingResponse {
  alive: boolean;
  timestamp: number;
}

export enum PingCommands {
  Ping = 'ping',
}

export enum PingEvents {
  PingResponse = 'ping_response',
}
