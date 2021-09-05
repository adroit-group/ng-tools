import { ITsMixinCliOpts } from "../utils";
import { findPackageJSON, getPackageJSONData } from "./get-package-data";

export function getConfigFromPackageJson():  Partial<ITsMixinCliOpts> {
    return getPackageJSONData(findPackageJSON());
}