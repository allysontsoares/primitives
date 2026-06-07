import { createPackageTsupConfig } from "../../tooling/package-tsup";

export default createPackageTsupConfig({
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@kenos-ui/react-datepicker",
    "@kenos-ui/react-select",
  ],
});