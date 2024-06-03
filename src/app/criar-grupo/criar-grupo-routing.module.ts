/*Importação de módulos importantes para o funcionamento da aplicação*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CriarGrupoPage } from './criar-grupo.page';

const routes: Routes = [
  {
    path: '',
    component: CriarGrupoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriarGrupoPageRoutingModule {}
