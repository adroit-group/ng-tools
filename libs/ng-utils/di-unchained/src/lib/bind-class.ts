import { bindDescriptor } from "./bind-descriptor";

/**
 * @internal
 */
export function bindCLass(protoOrCtor: object) {
  const protoMembers = Object.entries(
    Object.getOwnPropertyDescriptors(protoOrCtor)
  ).filter(
    ([member, descriptor]) =>
      (typeof descriptor.value === 'function' && member !== 'constructor') ||
      descriptor.get ||
      descriptor.set
  );

  protoMembers.forEach(([member, descriptor]) =>
    bindDescriptor(protoOrCtor, member, descriptor)
  );
}
