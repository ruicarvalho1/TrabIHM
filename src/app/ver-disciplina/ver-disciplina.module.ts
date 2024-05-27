import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { VerDisciplinaPageRoutingModule } from './ver-disciplina-routing.module';
import { VerDisciplinaPage } from './ver-disciplina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerDisciplinaPageRoutingModule,
    TranslateModule,
  ],
  declarations: [VerDisciplinaPage],
})
export class VerDisciplinaPageModule {}
