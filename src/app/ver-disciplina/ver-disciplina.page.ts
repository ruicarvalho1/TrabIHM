import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ver-disciplina',
  templateUrl: './ver-disciplina.page.html',
  styleUrls: ['./ver-disciplina.page.scss'],
})
export class VerDisciplinaPage {
  user: any = null;
  tarefasDaDisciplinaSelecionada: any[] = [];
  disciplinaId: number | null = null;
  disciplina: any;
  tarefaId = 0;
  concluida = true;

  //Contrutor das depências
  constructor(
    private authService: AuthService,
    private data: DataService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private translateService: TranslateService
  ) {}

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.user = this.authService.getCurrentUser();
      const tarefasDoUtilizador = await this.data.getTarefasDoUtilizador(
        userId
      );
      console.log('Tarefas do utilizador:', tarefasDoUtilizador);

      if (tarefasDoUtilizador.length > 0) {
        // Obter os IDs únicos das disciplinas das tarefas do utilizador
        const disciplinasIds = [
          ...new Set(tarefasDoUtilizador.map((tarefa) => tarefa.disciplina_id)),
        ];

        // Buscar todas as disciplinas
        const disciplinas = await this.data.getAllDisciplinas();

        // Obter o ID da disciplina a partir da URL
        const disciplinaIdParam = this.route.snapshot.paramMap.get('id');
        if (disciplinaIdParam) {
          const disciplinaId = +disciplinaIdParam;
          if (!isNaN(disciplinaId)) {
            this.disciplinaId = disciplinaId;

            // Obter as tarefas da disciplina selecionada
            this.tarefasDaDisciplinaSelecionada =
              await this.data.getTarefasPorDisciplina(this.disciplinaId);
            console.log(
              'Tarefas da disciplina selecionada:',
              this.tarefasDaDisciplinaSelecionada
            );
          } else {
            console.log('ID da disciplina não é um número válido.');
          }
        } else {
          console.log('ID da disciplina não encontrado na URL.');
        }
      } else {
        console.log('Nenhuma tarefa encontrada para este utilizador.');
      }
    } else {
      console.log('Nenhum utilizador autenticado encontrado.');
    }
  }

  // Função para carregar a disciplina
  async loadDisciplina(id: string) {
    try {
      const { data, error } = await this.data.getDisciplinaById(id);
      if (error) {
        console.error('Erro ao carregar a disciplina:', error);
        return;
      }
      this.disciplina = data;
    } catch (error) {
      console.error('Erro ao carregar a disciplina:', error);
    }
  }

  // Função para atualizar a tarefa da disciplina
  async atualizarTarefaDaDisciplina(idTarefa: number, disciplina: any) {
    const loading = await this.loadingController.create({
      message: 'Atualizando tarefa...',
      spinner: 'circles',
      backdropDismiss: false,
    });

    try {
      await loading.present();

      // Imprime o ID da tarefa antes de atualizá-la
      console.log('ID da tarefa selecionada:', idTarefa);

      // Atualize a tarefa específica
      await this.data.atualizarTarefa(idTarefa, disciplina.concluida);

      const successToast = await this.toastController.create({
        message: 'Tarefa atualizada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await successToast.present();
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);

      const errorToast = await this.toastController.create({
        message: 'Erro ao atualizar a tarefa. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    } finally {
      await loading.dismiss();
    }
  }

  // Função para navegar para a página de adicionar tarefa
  verTarefa(tarefaId: number) {
    console.log('ID da disciplina:', tarefaId);
    if (tarefaId) {
      this.router.navigate(['/tarefa', tarefaId]);
    } else {
      console.error('ID da disciplina não está definido.');
    }
  }

  // Função para excluir tarefa
  async excluirTarefa(id: number) {
    try {
      const { error } = await this.data.deleteTarefa(id);
      if (error) {
        throw new Error('Erro ao excluir tarefa');
      } else {
        this.tarefasDaDisciplinaSelecionada =
          this.tarefasDaDisciplinaSelecionada.filter(
            (tarefa) => tarefa.id_tarefa !== id
          );

        const successToast = await this.toastController.create({
          message: 'Tarefa apagada com sucesso!',
          duration: 2000,
          color: 'success',
        });
        await successToast.present();
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);

      const errorToast = await this.toastController.create({
        message: 'Erro ao excluir tarefa. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    }
  }
}
