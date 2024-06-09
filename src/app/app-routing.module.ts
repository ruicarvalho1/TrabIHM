import { TarefaPage } from './tarefa/tarefa.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'entrar',
    loadChildren: () =>
      import('./entrar/entrar.module').then((m) => m.EntrarPageModule),
  },
  {
    path: 'registar',
    loadChildren: () =>
      import('./registar/registar.module').then((m) => m.RegistarPageModule),
  },
  {
    path: 'disciplinas',
    loadChildren: () =>
      import('./disciplinas/disciplinas.module').then(
        (m) => m.DisciplinasPageModule
      ),
  },
  {
    path: 'nova-disciplina',
    loadChildren: () =>
      import('./nova-disciplina/nova-disciplina.module').then(
        (m) => m.NovaDisciplinaPageModule
      ),
  },
  {
    path: 'nova-tarefa',
    loadChildren: () =>
      import('./nova-tarefa/nova-tarefa.module').then(
        (m) => m.NovaTarefaPageModule
      ),
  },
  {
    path: 'ver-disciplina',
    loadChildren: () =>
      import('./ver-disciplina/ver-disciplina.module').then(
        (m) => m.VerDisciplinaPageModule
      ),
  },
  {
    path: 'tarefa',
    loadChildren: () =>
      import('./tarefa/tarefa.module').then((m) => m.TarefaPageModule),
  },
  {
    path: 'conversas-grupo',
    loadChildren: () =>
      import('./conversas-grupo/conversas-grupo.module').then(
        (m) => m.ConversasGrupoPageModule
      ),
  },
  {
    path: 'conversas-grupo/:conversas-grupoid',
    loadChildren: () =>
      import('./conversas-grupo/conversas-grupo.module').then(
        (m) => m.ConversasGrupoPageModule
      ),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatPageModule),
  },
  {
    path: 'criar-grupo',
    loadChildren: () =>
      import('./criar-grupo/criar-grupo.module').then(
        (m) => m.CriarGrupoPageModule
      ),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./perfil/perfil.module').then((m) => m.PerfilPageModule),
  },
  {
    path: 'editar-perfil',
    loadChildren: () =>
      import('./editar-perfil/editar-perfil.module').then(
        (m) => m.EditarPerfilPageModule
      ),
  },
  {
    path: 'ver-disciplina/:id',
    loadChildren: () =>
      import('./ver-disciplina/ver-disciplina.module').then(
        (m) => m.VerDisciplinaPageModule
      ),
  },
  {
    path: 'tarefa/:id',
    loadChildren: () =>
      import('./tarefa/tarefa.module').then((m) => m.TarefaPageModule),
  },
  {
    path: 'ajuda',
    loadChildren: () => import('./ajuda/ajuda.module').then( m => m.AjudaPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
