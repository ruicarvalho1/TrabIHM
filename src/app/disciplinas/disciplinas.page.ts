import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.page.html',
  styleUrls: ['./disciplinas.page.scss'],
})
export class DisciplinasPage {
  tasksAndDisciplines: any[] = [];

  disciplinas: any[] = [];
  users: any = null;
  user = this.authService.getCurrentUser();
  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService
  ) {}

  /*
  async ngOnInit() {
    try {
      this.tasksAndDisciplines =
        await this.data.getUserTasksAndDisciplines();
      console.log(
        'Tarefas e disciplinas do usuário:',
        this.tasksAndDisciplines
      );
      // Faça o que você precisa com os dados aqui, como atribuir a uma variável da página
    } catch (error) {
      console.error('Erro ao obter tarefas e disciplinas do usuário:', error);
    }
  }
  */

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.disciplinas = await this.data.getDisciplinasDoUsuario(userId);
      this.users = await this.data.getUserById(userId);

      console.log('disciplinas: ', this.disciplinas);
    } else {
      console.log('Nenhum usuário autenticado encontrado.');
    }
  }
}
