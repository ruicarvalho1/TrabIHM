import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.page.html',
  styleUrls: ['./tarefa.page.scss'],
})
export class TarefaPage implements OnInit {
  user: any = null;
  tarefaSelecionada: any;
  disciplinas: any = null;

  constructor(
    private authService: AuthService,
    private data: DataService,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.ionViewWillEnter();
  }

  // Função para mudar o idioma

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  // Função para entrar na página
  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.user = this.authService.getCurrentUser();

      const tarefasDoUtilizador = await this.data.getTarefasDoUtilizador(
        userId
      );
      console.log('Tarefas do utilizador:', tarefasDoUtilizador);

      if (tarefasDoUtilizador.length > 0) {
        const tarefaIdParam = this.route.snapshot.paramMap.get('id');
        if (tarefaIdParam) {
          const tarefaId = +tarefaIdParam;
          if (!isNaN(tarefaId)) {
            this.tarefaSelecionada = tarefasDoUtilizador.find(
              (tarefa) => tarefa.id_tarefa === tarefaId
            );
            if (this.tarefaSelecionada) {
              console.log('Tarefa selecionada:', this.tarefaSelecionada);
            } else {
              console.log(
                'Tarefa não encontrada na lista de tarefas do utilizador.'
              );
            }
          } else {
            console.log('ID da Tarefa não é um número válido.');
          }
        } else {
          console.log('ID da tarefa não encontrado na URL.');
        }
      } else {
        console.log('Nenhuma tarefa encontrada para este utilizador.');
      }
    } else {
      console.log('Nenhum utilizador autenticado encontrado.');
    }
  }
}
