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

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.user = this.authService.getCurrentUser();

      const tarefasDoUsuario = await this.data.getTarefasDoUsuario(userId);
      console.log('Tarefas do usuário:', tarefasDoUsuario);

      if (tarefasDoUsuario.length > 0) {
        const tarefaIdParam = this.route.snapshot.paramMap.get('id');
        if (tarefaIdParam) {
          const tarefaId = +tarefaIdParam;
          if (!isNaN(tarefaId)) {
            this.tarefaSelecionada = tarefasDoUsuario.find(
              (tarefa) => tarefa.id_tarefa === tarefaId
            );
            if (this.tarefaSelecionada) {
              console.log('Tarefa selecionada:', this.tarefaSelecionada);
            } else {
              console.log(
                'Tarefa não encontrada na lista de tarefas do usuário.'
              );
            }
          } else {
            console.log('ID da Tarefa não é um número válido.');
          }
        } else {
          console.log('ID da tarefa não encontrado na URL.');
        }
      } else {
        console.log('Nenhuma tarefa encontrada para este usuário.');
      }
    } else {
      console.log('Nenhum usuário autenticado encontrado.');
    }
  }
}
