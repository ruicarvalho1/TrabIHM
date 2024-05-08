import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TarefaPageRoutingModule } from './tarefa-routing.module';

import { TarefaPage } from './tarefa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TarefaPageRoutingModule
  ],
  declarations: [TarefaPage]
})
export class TarefaPageModule {}
