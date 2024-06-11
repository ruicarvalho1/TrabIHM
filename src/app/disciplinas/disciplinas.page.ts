/*Importação de módulos importantes para a aplicação funcinar corretamente*/
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

/*Define informações importantes de onde provêm estilos e a estrutura da página assim 
como o seletor com o nome da página */
@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.page.html',
  styleUrls: ['./disciplinas.page.scss'],
})

/* exporta a classe  abaixo mencionada tendo no seu interior propriedades inicilizadas como arrays de 
informações ou com métodos de autenticação*/
export class DisciplinasPage {
  tasksAndDisciplines: any[] = [];
  disciplinas: any[] = [];
  users: any = null;
  user = this.authService.getCurrentUser();

  /*Construtor de  módulos importados no topo da página*/

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService,
    private router: Router
  ) {}

  /*Método que atualiza os valores das "strings" atualizadas, sempre que acionado (página de perfil)*/

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }
  /*
  async ngOnInit() {
    try {
      this.tasksAndDisciplines =
        await this.data.getUserTasksAndDisciplines();
      console.log(
        'Tarefas e disciplinas do utilizador:',
        this.tasksAndDisciplines
      );
    } catch (error) {
      console.error('Erro ao obter tarefas e disciplinas do utilizador:', error);
    }
  }
  */

  /*Método assíncrono que permite aravés da autênticação atual buscar informação relativa às disciplinas do utilizador
  contendo também o atributo "await" que aguarda que a resposta da base de daodos termine com toda a informação 
  a ser apresentada.*/

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.disciplinas = await this.data.getDisciplinasDoUtilizador(userId);
      this.users = await this.data.getUserById(userId);

      console.log('disciplinas: ', this.disciplinas);
    } else {
      console.log('Nenhum utilizador autenticado foi encontrado !!!');
    }
  }

  /*Método não assíncrono pois é ativado através de um clique em algum componente não sendo necesário 
  aguardar respostas de algum serviço não local ou externo à aplicação. Este método efetua uma rota para
  a respetiva disciplina pressionada parrando como argumento o ID da disciplina, (argumento do tipo número.) */

  verDisciplina(disciplinaId: number) {
    console.log('ID da disciplina:', disciplinaId);
    if (disciplinaId) {
      this.router.navigate(['/ver-disciplina', disciplinaId]);
    } else {
      console.error('ID da disciplina não está definido.');
    }
  }
}
