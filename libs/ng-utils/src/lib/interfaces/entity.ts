/**
 * Az alkalmazásban használt adat objektumok alap interface-e.
 * Minden adat aminek van azonosítója IEntity-nek számít.
 */
export interface IEntity {
  /**
   * Az adat azonosítója.
   */
  id: string;

  [key: string]: unknown;
}
