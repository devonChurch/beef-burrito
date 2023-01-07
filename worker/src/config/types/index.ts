import { data as configData } from "../data";

export type Config = typeof configData;

export type ConfigKeys = keyof typeof configData;

export type ConfigEnvironmentKeys = "production" | "development";

export type ConfigValue = {
  environment: Record<ConfigEnvironmentKeys, ConfigEnvironmentValue>;
};

export type ConfigEnvironmentValue = {
  host: string;
};

