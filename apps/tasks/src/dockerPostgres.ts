import {spawn, execSync} from 'child_process';

interface DockerConfig {
  containerName: string;
  port: number;
  password: string;
  database: string;
  image: string;
}

const getConfig = (): DockerConfig => ({
  containerName: process.env.PGBOSS_CONTAINER_NAME || 'joshgretz-pgboss',
  port: parseInt(process.env.PGBOSS_DB_PORT || '5434', 10),
  password: process.env.PGBOSS_DB_PASSWORD || 'pgboss_local_dev',
  database: 'pgboss',
  image: 'postgres:16-alpine',
});

export const getPgBossConnectionString = (): string => {
  const config = getConfig();
  return `postgresql://postgres:${config.password}@localhost:${config.port}/${config.database}`;
};

const isContainerRunning = (containerName: string): boolean => {
  try {
    const result = execSync(
      `docker inspect -f '{{.State.Running}}' ${containerName} 2>/dev/null`,
      {encoding: 'utf-8'},
    );
    return result.trim() === 'true';
  } catch {
    return false;
  }
};

const containerExists = (containerName: string): boolean => {
  try {
    execSync(`docker inspect ${containerName} 2>/dev/null`, {encoding: 'utf-8'});
    return true;
  } catch {
    return false;
  }
};

const isPortInUse = (port: number): boolean => {
  try {
    const result = execSync(
      `docker ps -a --filter "publish=${port}" --format "{{.Names}}"`,
      {encoding: 'utf-8'},
    );
    return result.trim().length > 0;
  } catch {
    return false;
  }
};

const removeContainer = (containerName: string): void => {
  try {
    execSync(`docker rm -f ${containerName} 2>/dev/null`, {encoding: 'utf-8'});
    console.log(`Removed container '${containerName}'`);
  } catch {
    // Container doesn't exist or couldn't be removed
  }
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const ensureDockerPostgres = async (): Promise<void> => {
  const config = getConfig();

  if (isContainerRunning(config.containerName)) {
    console.log(`Docker postgres container '${config.containerName}' already running`);
    return;
  }

  if (containerExists(config.containerName)) {
    console.log(`Removing stopped container '${config.containerName}'...`);
    removeContainer(config.containerName);
  }

  if (isPortInUse(config.port)) {
    throw new Error(
      `Port ${config.port} is already in use. Check for other containers or processes using this port.`,
    );
  }

  console.log(`Creating new postgres container '${config.containerName}'...`);

  return new Promise((resolve, reject) => {
    const args = [
      'run',
      '-d',
      '--name',
      config.containerName,
      '-p',
      `${config.port}:5432`,
      '-e',
      `POSTGRES_PASSWORD=${config.password}`,
      '-e',
      `POSTGRES_DB=${config.database}`,
      config.image,
    ];

    const proc = spawn('docker', args, {stdio: ['ignore', 'pipe', 'pipe']});

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`Container created: ${stdout.trim().substring(0, 12)}`);
        resolve();
      } else {
        reject(new Error(`Failed to create container: ${stderr}`));
      }
    });

    proc.on('error', (error) => {
      reject(new Error(`Failed to spawn docker: ${error.message}`));
    });
  });
};

export const waitForReady = async (maxWaitMs: number = 30000): Promise<void> => {
  const config = getConfig();
  const startTime = Date.now();

  console.log('Waiting for postgres to be ready...');

  while (Date.now() - startTime < maxWaitMs) {
    try {
      execSync(
        `docker exec ${config.containerName} pg_isready -U postgres -d ${config.database}`,
        {encoding: 'utf-8', stdio: 'pipe'},
      );
      console.log('Postgres is ready');
      return;
    } catch {
      await sleep(500);
    }
  }

  throw new Error(`Postgres not ready after ${maxWaitMs}ms`);
};

export const stopDockerPostgres = async (): Promise<void> => {
  const config = getConfig();

  if (!isContainerRunning(config.containerName)) {
    console.log(`Container '${config.containerName}' not running`);
    return;
  }

  console.log(`Stopping container '${config.containerName}'...`);
  execSync(`docker stop ${config.containerName}`, {encoding: 'utf-8'});
  console.log('Container stopped');
};

export const isDockerPostgresRunning = (): boolean => {
  const config = getConfig();
  return isContainerRunning(config.containerName);
};
