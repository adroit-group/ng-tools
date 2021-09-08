export type MergeStrategy = 'extend' | 'inline';

export type DuplicateHandlingStrategy = 'overwrite' | 'throw';

export interface ITsMixinGeneratorConfig {
  mergeSuperClasses?: boolean;
  classMergeStrategy?: MergeStrategy;
  handlerDuplicateClassMember?: DuplicateHandlingStrategy;
  mergeInterfacesOfSuperClasses?: boolean;
  mergeInterfacesOfOriginalClass?: boolean;
  interfaceMergeStrategy?: MergeStrategy;
  handleDuplicateInterfaceMember?: DuplicateHandlingStrategy;
  inferMissingTypes?: boolean;
  addMissingAccessModifiers?: boolean;
  copyDocumentation?: boolean;
  verbose?: boolean;
}
