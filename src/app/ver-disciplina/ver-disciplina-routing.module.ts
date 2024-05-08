import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerDisciplinaPage } from './ver-disciplina.page';

const routes: Routes = [
  {
    path: '',
    component: VerDisciplinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerDisciplinaPageRoutingModule {}
