import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NovaTarefaPageRoutingModule } from './nova-tarefa-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NovaTarefaPage } from './nova-tarefa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovaTarefaPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [NovaTarefaPage],
})
export class NovaTarefaPageModule {}
