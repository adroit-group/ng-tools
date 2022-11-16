import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[typedNgTemplate]',
})
export class TypedNgTemplateDirective<TypeToken> {
    // how you tell the directive what the type should be
    @Input('typedNgTemplate')
    public typeToken!: TypeToken;

    // the directive gets the template from Angular
    constructor(private readonly contentTemplate: TemplateRef<TypeToken>) {}

    // this magic is how we tell Angular the context type for this directive, which then propagates down to the type of the template
    static ngTemplateContextGuard<TypeToken>(
        _dir: TypedNgTemplateDirective<TypeToken>,
        ctx: unknown
    ): ctx is { $implicit: TypeToken } {
        return true;
    }
}
