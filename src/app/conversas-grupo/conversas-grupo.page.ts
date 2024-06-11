/* Importação de componentes importantes como por exemplo rotas, serviços de autenticação 
(para ser utilizado com supabase) cmponente de tradução, serviços de dados 
(queries à base de dados retornando informação para a página). */
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

/*Expostação de uma classe que contém os dados a serem apresentados na respetiva página, 
sendo o utilizador proveniente de um serviço de autenticação e os restantes dados provenientes
da base de dados gurardados em formato de arrray que contém toda a informação retornada.
Foi importante utilizar arrys pois facilita o uso do "*ngFor" */
export class ConversasGrupoPage {
  user = this.authService.getCurrentUser();
  users: any = null;

  tarefas: any[] = [];
  disciplinas: any[] = [];

  /* Construtor de cada um dos módulos importados no topo do ficheiro.*/

  constructor(
    private authService: AuthService,
    private data: DataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navController: NavController,
    private router: Router,
    private translateService: TranslateService
  ) {}

  /*Método que atualiza os valores das "strings" atualizadas, sempre que acionado (página de perfil)*/

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  /*Método assíncrono que permite través do utilizador atualmente com login obter as 
  respetivas tarefas, esprando pela resposta da base dados e do services (await) 
  visto que é um método assíncrono*/

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      // Obter as tarefas do utilizador
      this.tarefas = await this.data.getTarefasDoUtilizador(userId);
      this.disciplinas = await this.data.getDisciplinasDoUtilizador(userId);

      // Obter as informações do utilizador
      this.users = await this.data.getUserById(userId);
    }
  }
}
