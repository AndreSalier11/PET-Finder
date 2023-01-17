import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") })

interface ENV {
  HOST: string | undefined,
  PORT: number | undefined,
  SECRETKEY: string | undefined
  DB_HOST: string | undefined,
  DB_PORT: number | undefined,
  DATABASE: string | undefined,
  DB_USER: string | undefined,
  DB_PASSWORD: string | undefined,
  DIR: string | undefined,
}

interface Config {
  HOST: string,
  PORT: number,
  SECRETKEY: string,
  DB_HOST: string,
  DB_PORT: number,
  DATABASE: string,
  DB_USER: string,
  DB_PASSWORD: string,
  DIR: string,
}


const getConfig = (): ENV => {
  return {
    HOST: process.env.HOST,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    SECRETKEY: process.env.SECRETKEY,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    DATABASE: process.env.DATABASE,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DIR: process.env.DIR,
  };
};


const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;