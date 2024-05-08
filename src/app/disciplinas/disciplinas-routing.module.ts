import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisciplinasPage } from './disciplinas.page';

const routes: Routes = [
  {
    path: '',
    component: DisciplinasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisciplinasPageRoutingModule {}
