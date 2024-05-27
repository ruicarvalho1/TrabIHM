import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { NovaDisciplinaPageRoutingModule } from './nova-disciplina-routing.module';

import { NovaDisciplinaPage } from './nova-disciplina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovaDisciplinaPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [NovaDisciplinaPage],
})
export class NovaDisciplinaPageModule {}
