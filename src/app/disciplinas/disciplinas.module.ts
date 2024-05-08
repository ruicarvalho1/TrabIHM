import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisciplinasPageRoutingModule } from './disciplinas-routing.module';

import { DisciplinasPage } from './disciplinas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisciplinasPageRoutingModule
  ],
  declarations: [DisciplinasPage]
})
export class DisciplinasPageModule {}
