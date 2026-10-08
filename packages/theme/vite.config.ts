import { createPackageConfig, packageDirFromUrl } from "../../vite.config.base.mts";

export default createPackageConfig({
  packageDir: packageDirFromUrl(import.meta.url),
  entry: "src/index.ts",
});
