export type ComposerEntry = {
  application: string;
  environment: "development" | "production";
  build: string;
};

export type ComposerApiSetBody = {
  base: ComposerEntry;
  dependencies: ComposerEntry[];
};
