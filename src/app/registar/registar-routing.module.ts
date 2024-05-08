import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistarPage } from './registar.page';

const routes: Routes = [
  {
    path: '',
    component: RegistarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistarPageRoutingModule {}
