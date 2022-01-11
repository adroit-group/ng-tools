import { capitalize, ITsMixinCliOpts } from '../utils';

export function populateTemplate(
  template: string,
  opts: ITsMixinCliOpts
): string {
  const { name: n, summary: s, description: d, remarks: r } = opts ?? {};

  return (
    template
      .replace(/{\$MixinName\|camelCase}/gi, n)
      .replace(/{\$MixinName}/gi, capitalize(n))
      .replace(/{\$summary}/gi, s ?? '')
      .replace(/{\$description}/gi, d ?? '')
      .replace(/{\$remarks}/gi, r ?? '') + '\n'
  );
}
