import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.page.html',
  styleUrls: ['./tarefa.page.scss'],
})
export class TarefaPage {
  users: any = null;
  user = this.authService.getCurrentUser();
  tarefas: any[] = [];

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService
  ) {}

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.tarefas = await this.data.getTarefasDoUsuario(userId);
      this.users = await this.data.getUserById(userId);
    } else {
      console.log('Nenhum usuário autenticado encontrado.');
    }
  }
}
