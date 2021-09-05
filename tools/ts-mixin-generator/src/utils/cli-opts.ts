import { ETsMixinMode } from "./ts-mixin-mode";

export interface ITsMixinCliOpts {
    mode: ETsMixinMode;
    name: string;
    summary: string;
    force: boolean;
    description: string;
    remarks: string;
    path: string;
    skip: boolean;
    project: boolean;
}