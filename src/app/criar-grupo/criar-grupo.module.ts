import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CriarGrupoPageRoutingModule } from './criar-grupo-routing.module';

import { CriarGrupoPage } from './criar-grupo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriarGrupoPageRoutingModule
  ],
  declarations: [CriarGrupoPage]
})
export class CriarGrupoPageModule {}
