import { ConfigEnvironmentKeys } from "../../config/types"

export type ComposerEntry = {
  application: string;
  environment: ConfigEnvironmentKeys;
  build?: string;
};

export type ComposerApiSetBody = {
  base: ComposerEntry;
  dependencies?: ComposerEntry[];
};
