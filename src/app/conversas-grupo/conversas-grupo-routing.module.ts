import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConversasGrupoPage } from './conversas-grupo.page';

const routes: Routes = [
  {
    path: '',
    component: ConversasGrupoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversasGrupoPageRoutingModule {}
