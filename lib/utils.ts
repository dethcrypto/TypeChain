export function getVersion(): string {
  const packageJson: any = require("../package.json");

  return packageJson.version;
}
