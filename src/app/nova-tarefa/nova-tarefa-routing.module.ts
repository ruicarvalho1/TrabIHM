import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovaTarefaPage } from './nova-tarefa.page';

const routes: Routes = [
  {
    path: '',
    component: NovaTarefaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NovaTarefaPageRoutingModule {}
