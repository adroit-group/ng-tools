import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';
import { METHOD_INVOKER_PIPE_HOST } from '~tokens';
import { InvokableMethod } from '~types';

/**
 * Egy meta pipe, mely más pipe-ok helyettesítésére szolgál.
 * A pipe működésének lényege, hogy a pipe által végrehajtandó metódust nem egy külön pipeban adjuk meg hanem oda adjuk ennek a pipenak mint bemenő paraméter.
 * A pipe a megkapott függvény hívja meg, a megadott inputokat valamint az opcionálisan megadható kontextsut használva.
 * Ha megadunk kontextust, akkor egy adott komponens vagy direktív osztály példányának a this kontextusát tudjuk használni a pipe által meghívott függvényen belül.
 * Ennek akkor van jelentősége, ha a pipe, olyan komponens metódust hív meg, mely használ a komponens adatai vagy metódusait közül valamit.
 *
 */
@Pipe({
  name: 'invoke',
})
export class MethodInvokerPipe implements PipeTransform {
  /**
   * konstruktor
   *
   * @param host Az opcionálisan rendelkezésre álló host kontextus
   */
  constructor(
    @Optional()
    @Inject(METHOD_INVOKER_PIPE_HOST)
    private readonly host?: unknown
  ) {}

  /**
   * A PipeTransform interface implementációja
   *
   * @param value A meghívandó függvény első bementi paramétere (value)
   * @param method a meghívandó függvény
   * @param restArgs a meghívandó függvény többi paraméterét tartalmazó lista
   */
  public transform<T extends unknown, U>(
    value: T,
    method: InvokableMethod<T, U>,
    ...restArgs: Array<unknown>
  ): U {
    return method?.call(this.host, value, ...(restArgs ?? []));
  }
}
