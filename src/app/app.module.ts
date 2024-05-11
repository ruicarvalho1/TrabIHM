import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/main';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //translate
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(TranslateModule.forRoot(
      {
        loader: {
            provide:TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
        }
      }
    )),
    //end
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
