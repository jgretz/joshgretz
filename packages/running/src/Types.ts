export interface RunningConfig {
  databaseUrl: string;
  amqpUrl: string;
  geoApiKey?: string;
}

export enum Queues {
  Running = 'running',
}

export enum Tasks {
  LoadActivitiesSince = 'load-activities-since',
}
