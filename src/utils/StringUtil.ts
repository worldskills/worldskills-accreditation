import {GenericUtil} from "@worldskills/worldskills-angular-lib";

export function isEmpty(s: string) {
    return !GenericUtil.isNullOrUndefined(s) && s.trim().length === 0;
}
