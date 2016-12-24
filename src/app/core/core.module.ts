import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { PhoneAppModule } from '../phone-app/phone-app.module';
import { BrowserAppModule } from '../browser-app/browser-app.module';

import { CardComponent } from './card/card.component';
import { DeviceMenuComponent } from './devicemenu/devicemenu.component';
import { HomeComponent } from './home/home.component';
import { LauncherComponent } from './launcher/launcher.component';
import { StatusbarComponent } from './statusbar/statusbar.component';

import { AppsService } from './apps.service';

@NgModule({
  imports: [
    SharedModule,
    PhoneAppModule,
    BrowserAppModule
  ],
  declarations: [
    CardComponent,
    DeviceMenuComponent,
    HomeComponent,
    LauncherComponent,
    StatusbarComponent
  ],
  exports: [HomeComponent],
  providers: [AppsService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded.'
      )
    }
  }
}
