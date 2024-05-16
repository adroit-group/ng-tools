import { NgModule } from '@angular/core';
import { MixinDependencyResolverModule } from './mixin-dependency-resolver.module';
import { PlatformObserverService } from './services/platform-observer.service';

@NgModule({
  imports: [MixinDependencyResolverModule],
})
export class AdroitNgUtilsCoreModule {
  public static platformObserver: PlatformObserverService;

  constructor(platformObserver: PlatformObserverService) {
    AdroitNgUtilsCoreModule.platformObserver = platformObserver;
  }
}
