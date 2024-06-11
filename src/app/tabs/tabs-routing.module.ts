import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

// Rotas da página TabsPage
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'disciplinas',
        loadChildren: () =>
          import('../disciplinas/disciplinas.module').then(
            (m) => m.DisciplinasPageModule
          ),
      },
      {
        path: 'nova-tarefa',
        loadChildren: () =>
          import('../nova-tarefa/nova-tarefa.module').then(
            (m) => m.NovaTarefaPageModule
          ),
      },
      {
        path: 'conversas-grupo',
        loadChildren: () =>
          import('../conversas-grupo/conversas-grupo.module').then(
            (m) => m.ConversasGrupoPageModule
          ),
      },
      {
        path: 'conversas-grupo/:conversas-grupoid',
        loadChildren: () =>
          import('../conversas-grupo/conversas-grupo.module').then(
            (m) => m.ConversasGrupoPageModule
          ),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../perfil/perfil.module').then((m) => m.PerfilPageModule),
      },

      {
        path: '',
        redirectTo: '/entrar',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/entrar',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
