import { BindQueryParamDirective } from './bind-query-param.directive';
import { NgForAugmentationDirective } from './ng-for-augmentation.directive';
import { NgIfAugmentedDirective } from './ng-if-augmentation.directive';
import { NgLetDirective } from './ng-let.directive';
import {
  NgRenderInBrowserDirective, NgRenderInDirective, NgRenderInServerDirective
} from './ng-render-in.directive';
import { NgSubscribeDirective } from './ng-subscribe.directive';
import { TypedNgTemplateDirective } from './typed-ng-template.directive';

export { BindQueryParamDirective } from './bind-query-param.directive';
export { NgForAugmentationDirective } from './ng-for-augmentation.directive';
export { NgIfAugmentedDirective } from './ng-if-augmentation.directive';
export { NgLetDirective } from './ng-let.directive';
export {
  NgRenderInBrowserDirective, NgRenderInDirective, NgRenderInServerDirective
} from './ng-render-in.directive';
export { NgSubscribeDirective } from './ng-subscribe.directive';
export { TypedNgTemplateDirective } from './typed-ng-template.directive';

/**
 * @internal
 */
export const LIB_DIRECTIVES = [
  NgLetDirective,
  NgSubscribeDirective,
  NgForAugmentationDirective,
  NgIfAugmentedDirective,
  NgRenderInDirective,
  NgRenderInBrowserDirective,
  NgRenderInServerDirective,
  BindQueryParamDirective,
  TypedNgTemplateDirective
];
