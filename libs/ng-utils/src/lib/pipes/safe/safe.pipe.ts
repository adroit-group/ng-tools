import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
  SafeValue,
} from '@angular/platform-browser';

/**
 * Union type of all possible safe value types.
 */
export type SafeValueType = 'url' | 'script' | 'style' | 'resourceUrl' | 'html';

/**
 * @ignore
 */
type SafeValueResultMap = {
  html: SafeHtml;
  resourceUrl: SafeResourceUrl;
  script: SafeScript;
  style: SafeStyle;
  url: SafeUrl;
};

/**
 * A pipe that bypasses Angular's built-in sanitization for the following
 * security contexts:
 * - HTML
 * - Style
 * - Script
 * - URL
 * - Resource URL
 *
 * @remarks The pipe assumes HTML content to be sanitized by default.
 *
 * Usage:
 *
 * @example ```html
 * {{ value | safe }}
 * {{ value | safe:'html' }}
 * {{ value | safe:'style' }}
 * {{ value | safe:'script' }}
 * {{ value | safe:'url' }}
 * {{ value | safe:'resourceUrl' }}
 * ```
 */
@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  /**
   * @ignore
   */
  private readonly actionMap: Record<
    SafeValueType,
    (content: string) => SafeValue
  > = {
    html: this.sanitizer.bypassSecurityTrustHtml,
    resourceUrl: this.sanitizer.bypassSecurityTrustResourceUrl,
    script: this.sanitizer.bypassSecurityTrustScript,
    style: this.sanitizer.bypassSecurityTrustStyle,
    url: this.sanitizer.bypassSecurityTrustUrl,
  };

  constructor(private readonly sanitizer: DomSanitizer) {}

  /**
   * Use Angular's DOMSanitizer to bypass security for the specified content.
   *
   * @param content The content to be sanitized.
   * @param type The type of the content to be sanitized.
   * @returns A safe value of the specified type.
   */
  public transform<Type extends SafeValueType = 'html'>(
    content: string,
    type?: Type
  ): SafeValueResultMap[Type] {
    return this.actionMap[type ?? 'html'](content);
  }
}
