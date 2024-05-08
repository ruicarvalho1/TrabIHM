import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NovaDisciplinaPageRoutingModule } from './nova-disciplina-routing.module';

import { NovaDisciplinaPage } from './nova-disciplina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovaDisciplinaPageRoutingModule
  ],
  declarations: [NovaDisciplinaPage]
})
export class NovaDisciplinaPageModule {}
