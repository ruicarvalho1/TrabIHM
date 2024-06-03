import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nova-tarefa',
  templateUrl: './nova-tarefa.page.html',
  styleUrls: ['./nova-tarefa.page.scss'],
})
export class NovaTarefaPage implements OnInit {
  formularioTarefa: FormGroup;
  disciplinas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private translateService: TranslateService
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

  ngOnInit() {
    // Carrega as disciplinas ao iniciar a página
    this.carregarDisciplinas();
  }

  async carregarDisciplinas() {
    try {
      this.disciplinas = await this.data.getAllDisciplinas();
      console.log('Disciplinas:', this.disciplinas);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  }

  formatarData(event: any) {
    const data = new Date(event.detail.value);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${dia}-${mes}-${ano}`;
    this.formularioTarefa.patchValue({ data_limite: dataFormatada });
    console.log('formularioTarefa:', this.formularioTarefa.value);
  }
  getMinDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }
  resetToMinDate(event: any) {
    const selectedDate = new Date(event.detail.value);
    const minDate = new Date(this.getMinDate());

    if (selectedDate < minDate) {
      this.formularioTarefa.patchValue({ data_limite: this.getMinDate() });
    }
  }

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  async criarTarefa() {
    const loading = await this.loadingController.create({
      message: 'Criando tarefa...',
      spinner: 'circles',
      backdropDismiss: false,
    });

    try {
      await loading.present();

      const novaTarefa = this.formularioTarefa.value;
      const userId = this.authService.getCurrentUserId();
      novaTarefa.user_id = userId;

      // Faz o upload da imagem
      const fileInput = document.getElementById(
        'imagemUpload'
      ) as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        const imageUrl = await this.data.uploadImagem(file);
        novaTarefa.imagem = imageUrl; // Define o URL da imagem no objeto da tarefa
      }

      await this.data.createTarefa(novaTarefa);
      console.log('Tarefa criada com sucesso!');

      await loading.dismiss();

      // Mostra um toast de sucesso
      const successToast = await this.toastController.create({
        message: 'Tarefa criada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await successToast.present();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);

      await loading.dismiss();

      // Mostra um toast de erro
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
