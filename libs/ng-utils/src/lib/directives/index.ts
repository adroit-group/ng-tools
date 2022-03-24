import { NgForAugmentationDirective } from './ng-for-augmentation.directive';
import { NgIfAugmentedDirective } from './ng-if-augmentation.directive';
import { NgLetDirective } from './ng-let.directive';
import { NgSubscribeDirective } from './ng-subscribe.directive';
import { TypedNgTemplateDirective } from './typed-ng-template.directive';
import {
  NgRenderInDirective,
  NgRenderInBrowserDirective,
  NgRenderInServerDirective,
} from './ng-render-in.directive';

export { NgForAugmentationDirective } from './ng-for-augmentation.directive';
export { NgIfAugmentedDirective } from './ng-if-augmentation.directive';
export { NgLetDirective } from './ng-let.directive';
export { NgSubscribeDirective } from './ng-subscribe.directive';
export {
  NgRenderInDirective,
  NgRenderInBrowserDirective,
  NgRenderInServerDirective,
} from './ng-render-in.directive';
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
  TypedNgTemplateDirective
];
