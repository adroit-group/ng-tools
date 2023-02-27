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

export type SafeValueType = 'url' | 'script' | 'style' | 'resourceUrl' | 'html';

type SafeValueResultMap = {
  html: SafeHtml;
  resourceUrl: SafeResourceUrl;
  script: SafeScript;
  style: SafeStyle;
  url: SafeUrl;
};

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  readonly actionMap: Record<SafeValueType, (content: string) => SafeValue> = {
    html: this.sanitizer.bypassSecurityTrustHtml,
    resourceUrl: this.sanitizer.bypassSecurityTrustResourceUrl,
    script: this.sanitizer.bypassSecurityTrustScript,
    style: this.sanitizer.bypassSecurityTrustStyle,
    url: this.sanitizer.bypassSecurityTrustUrl,
  };

  constructor(private readonly sanitizer: DomSanitizer) {}

  public transform<Type extends SafeValueType = 'html'>(
    content: string,
    type?: Type
  ): SafeValueResultMap[Type] {
    return this.actionMap[type ?? 'html'](content);
  }
}
