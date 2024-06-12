export interface PingResponse {
  alive: boolean;
  timestamp: number;
}

export enum PingMessages {
  Ping = 'ping',
}
