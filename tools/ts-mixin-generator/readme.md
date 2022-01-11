# TS Mixin Generator

## Base rules and principles form mixins

### General principles of mixins

- Mixin function are regular JS functions that return a class expression.
- The class expressions return by mixin function should have names to make debugging easier.
- AS of now mixin class expressions cannot use Decorators due to TS limitations.
  - This may change in the future as the JS Decorators proposal is implemented in TS.
  - For the time being it means that these mixin class expressions cannot utilize on features that requires a decorator to work. i.e.: @Input decorators of Angular.
- A class extending a class expression returned by a mixin function (a mixin class) should be able to use both the instance, prototype and static sides of the mixin classes it extends.

### Design principles of mixins

- Mixin functions should always be prepared to receive a base class constructor as their first parameter.
  - This ensures that mixin functions can be composed together.
  - This does not say that a mixin function can not accept multiple parameters for configuration or other purposes.
- A mixin function should do as little as possible both in terms of JS and TS.
  - This means that a mixin function should return a class expression without doing any side effects.
  - And also that a mixin function should do as little type casting and TS type wizardry as possible.
    - A main design goal is to have the TS compiler and tools set do the heavy lifting of type assertions.
    - This way we stay as close to the default behavior of the compiler as possible.
- Mixin class expressions should extend the base class constructor received by the mixin function or an empty anonymous class.
  - Allowing the return class expression to extend other classes of mixins would essentially defat the whole purpose of using mixins in the first place.
    - Extending regular classes here would mean that the mixin can not extend any other mixin's return class expression that it could have received as it's first parameter.
    - Extending another mixin function here would mean that even though we have logic broken up into reusable piece we choose to glue them together just like they were one singular entity in a single inheritance scenario.
    - Creating functions that act as an alias for composing frequently used mixin functions together
    - Mixin chain aliases (or meta mixins)
- Name collisions between multiple mixin class expressions at the usage site of the client code should be handled by the TS compiler.
  - This refers back to the previous principle about the compiler doing most of the heavy lifting of type inferences.
  - There are some cases where a name collision should not result in an error neither related to TS types not to JS runtime functionality.
    - Multiple mixin class expressions having a prototype member with the same name should NOT result in an error.
      - These members are living on the prototype objects of the dynamically created class expressions. i.e.: instance methods, getters and setters.
      - In such cases these members are shadowing each other, but due to how the JS property resolution algorithm works the runtime will find the correct member highest up the prototype chain (closes to the derived class) as it would in the case of regular single inheritance classes.

### Mixin function best practices

- Mixin functions should have a PascalCase name (like regular JS classes) with some suffix (preferably Mixin) to make them easily distinguishable from other functions.
- Files containing mixin functions should have a suffix (preferably .mixin) before their file extension part to make them easily distinguishable from regular JS classes and functions.
- Mixin functions and the mixin class expressions returned by them should be self containing units.
  - Ideally they shouldn't have to do any assumption about where and how they are going to be used.
  - In the case when they have to make such assumptions, we should try to keep it as little as possible and mostly rely on globally available values and apis.
