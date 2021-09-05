import { Type } from '@angular/core';

/**
 * Az üzleti logikák futtatásához kapcsoló adatokat leíró interface
 */
export interface IBusinessLogicContext {
  /**
   * bármilyen más adat mely rendelkezésre áll az üzleti logika futtatásakor
   */
  [key: string]: unknown;
  /**
   * Az üzleti logika inputa
   */
  input: unknown;
  /**
   * Az üzleti logika számára szükséges függőségeket tartalmazó lista
   */
  resolvedDeps: Array<unknown>;
}

/**
 * Defines the shape of an executable business logic object.
 */
export interface IBusinessLogicDefinition<
  T extends unknown,
  U extends Array<Type<unknown>> = Array<Type<unknown>>
> {
  /**
   * Az üzleti logika neve
   */
  name: string;
  /**
   * Az üzleti logika feladatának leírása
   */
  description?: string;
  /**
   * Az üzleti logika működéséhez szükséges providerek listája
   * Ezeket a függőségeket az üzleti logikák futtatását végző service szedi össze az alkalmazás root Injector-át használva.
   */
  deps?: U;
  /**
   * Alkalmazandó-e az üzelti logika az adott update cycle-ban
   *
   * @param context Az update cycle adatait tartalmazó kontextus objektum
   */
  isApplicable(context: IBusinessLogicContext): boolean;
  /**
   * Az üzleti logika alkalmazása
   *
   * @param context Az update cycle adatait tartalmazó kontextus objektum
   */
  fix(context: IBusinessLogicContext): T;
}

/**
 * Az üzleti logikák szabályok konfigurációját leíró interface.
 * Ez egy base interface, az egyes domain specifikus üzleti szabály objektumoknak saját konkrét konfigurációjait leíró interface-ik vannak.
 */
export interface IBusinessLogicConfig {
  /**
   * A szabály csoport neve, pl.: passengers
   */
  type: string;
  /**
   * A névhez tartozó szabály lista.
   */
  logics: Array<IBusinessLogicDefinition<any, any>>;
}
