import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NovaTarefaPageRoutingModule } from './nova-tarefa-routing.module';

import { NovaTarefaPage } from './nova-tarefa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovaTarefaPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [NovaTarefaPage],
})
export class NovaTarefaPageModule {}
