/*Importações de componentes para rotas e páginas necessáris (correspondente a este código específico para rotas)*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConversasGrupoPage } from './conversas-grupo.page';

/*Definição de uma rota padrão para a página de conversas de grupo, sendo a mesma composta por um array com os dados abaixo*/

const routes: Routes = [
  {
    path: '',
    component: ConversasGrupoPage,
  },
];

/*Configuração de rotas, especificando as mesmas, e transmitindo também as configurções de rotas parrando para elementos child
sem recorrer a uma nova rota. (As rotas estão acima definidas) */

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversasGrupoPageRoutingModule {}
