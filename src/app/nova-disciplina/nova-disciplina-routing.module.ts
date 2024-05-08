import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovaDisciplinaPage } from './nova-disciplina.page';

const routes: Routes = [
  {
    path: '',
    component: NovaDisciplinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NovaDisciplinaPageRoutingModule {}
