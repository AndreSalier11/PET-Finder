import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface ENV {
  HOST: string | undefined,
  PORT: number | undefined,
  DATABASE: string | undefined,
  USER: string | undefined,
  PASSWORD: string | undefined
}

interface Config {
  HOST: string,
  PORT: number,
  DATABASE: string,
  USER: string,
  PASSWORD: string
}


const getConfig = (): ENV => {
  return {
    HOST: process.env.HOST,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    DATABASE: process.env.DATABASE,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD
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