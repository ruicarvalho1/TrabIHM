import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Swiper } from 'swiper';
import { DataService } from './../services/data.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  users: any = null;
  user = this.authService.getCurrentUser();
  public swiper!: Swiper;
  tarefas: any[] = [];
  disciplinas: any[] = [];

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService
  ) {}

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      try {
        // Obter tarefas do usuário
        this.tarefas = await this.data.getTarefasDoUsuario(userId);
        this.disciplinas = await this.data.getDisciplinasDoUsuario(userId);

        // Log das tarefas para verificar o conteúdo
        console.log('Tarefas:', this.tarefas);

        // Obter informações do usuário
        this.users = await this.data.getUserById(userId);

        // Verificar se há tarefas antes de buscar disciplinas
        if (this.tarefas && this.tarefas.length > 0) {
          // Para cada tarefa, obter a disciplina associada e adicionar à lista de disciplinas
          for (const tarefa of this.tarefas) {
            const disciplinaNome = await this.data.getDisciplinaPorTarefa(
              tarefa.disciplina_id
            );
            if (disciplinaNome !== null) {
              // Adiciona o nome da disciplina à tarefa
              tarefa.nome_disciplina = disciplinaNome;
            }
          }
        } else {
          console.log('Nenhuma tarefa encontrada para o usuário.');
        }

        console.log('group: ', this.users);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    } else {
      console.log('Nenhum usuário autenticado encontrado.');
    }
  }
}
