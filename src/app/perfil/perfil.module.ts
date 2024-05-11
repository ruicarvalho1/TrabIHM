import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { PerfilPage } from './perfil.page';

//Por em todas as paginas o TranslateModule

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    TranslateModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {}
