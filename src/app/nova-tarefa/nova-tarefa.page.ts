import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-nova-tarefa',
  templateUrl: './nova-tarefa.page.html',
  styleUrls: ['./nova-tarefa.page.scss'],
})
export class NovaTarefaPage {
  formularioTarefa: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    this.formularioTarefa = this.fb.group({
      prioridade: [''],
      concluida: [false],
      tarefa: [''],
      nome_tarefa: [''],
      data_limite: [''],
      imagem: [''],
      disciplina_id: [null],
    });
  }

  async criarTarefa() {
    const loadingToast = await this.toastController.create({
      message: 'Criando tarefa...',
      duration: 0, // Definimos 0 para que ele não desapareça automaticamente
    });

    try {
      await loadingToast.present(); // Exibe o toast

      const novaTarefa = this.formularioTarefa.value;
      const userId = this.authService.getCurrentUserId();
      novaTarefa.user_id = userId;

      // Faz o upload da imagem
      const fileInput = document.getElementById(
        'imagemUpload'
      ) as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        const imageUrl = await this.dataService.uploadImagem(file);
        novaTarefa.imagem = imageUrl; // Define o URL da imagem no objeto da tarefa
      }

      await this.dataService.createTarefa(novaTarefa);
      console.log('Tarefa criada com sucesso!');

      await loadingToast.dismiss(); // Remove o toast de carregamento quando a tarefa for criada com sucesso

      // Exibe um toast de sucesso
      const successToast = await this.toastController.create({
        message: 'Tarefa criada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await successToast.present();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);

      await loadingToast.dismiss(); // Remove o toast de carregamento em caso de erro

      // Exibe um toast de erro
      const errorToast = await this.toastController.create({
        message: 'Erro ao criar tarefa. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    }
  }

  cancelar() {
    console.log('Operação cancelada');
  }

  async guardar() {
    try {
      console.log('Tarefa criada e guardada com sucesso!');
    } catch (error) {
      console.error('Erro ao guardar a tarefa:', error);
    }
  }
}
