import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertController,
  NavController,
  LoadingController,
} from '@ionic/angular';
import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conversas-grupo',
  templateUrl: './conversas-grupo.page.html',
  styleUrls: ['./conversas-grupo.page.scss'],
})
export class ConversasGrupoPage {
  user = this.authService.getCurrentUser();
  users: any = null;

  tarefas: any[] = [];
  disciplinas: any[] = [];

  constructor(
    private authService: AuthService,
    private data: DataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navController: NavController,
    private router: Router,
    private translateService: TranslateService
  ) {}

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      // Obter tarefas do usuário
      this.tarefas = await this.data.getTarefasDoUsuario(userId);
      this.disciplinas = await this.data.getDisciplinasDoUsuario(userId);

      // Obter informações do usuário
      this.users = await this.data.getUserById(userId);
    }
  }
}
