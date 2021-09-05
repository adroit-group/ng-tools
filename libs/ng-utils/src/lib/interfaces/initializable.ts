/**
 * Az inicializálható service osztályok által implementált interface.
 * Azok az osztályok amelyek ezt az interface-t implementálják az alkalmazás által automatikusan incializálhatónak jelölik meg magukat.
 */
export interface IInitializable {
  /**
   * Az osztály incicializálását végző függvény.
   */
  init(): void;
}
