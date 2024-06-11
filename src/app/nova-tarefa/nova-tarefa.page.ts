import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      prioridade: ['', Validators.required],
      concluida: [false],
      tarefa: ['', Validators.required],
      nome_tarefa: ['', Validators.required],
      data_limite: ['', Validators.required],
      imagem: [''],
      disciplina_id: [null, Validators.required],
    });
  }

  ngOnInit() {
    // Carrega as disciplinas ao iniciar a página
    this.carregarDisciplinas();
  }
  //  Função para carregar as disciplinas
  async carregarDisciplinas() {
    try {
      this.disciplinas = await this.data.getAllDisciplinas();
      console.log('Disciplinas:', this.disciplinas);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  }
  // Função para formatar a data
  formatarData(event: any) {
    const data = new Date(event.detail.value);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${dia}-${mes}-${ano}`;
    this.formularioTarefa.patchValue({ data_limite: dataFormatada });
    console.log('formularioTarefa:', this.formularioTarefa.value);
  }
  // Função para obter a data mínima
  getMinDate(): string {
    // Obtém a data atual
    const today = new Date();
    // Formata a data atual
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    // Retorna a data mínima no formato 'YYYY-MM-DD'
    return `${year}-${month}-${day}`;
  }
  // Função para resetar a data
  resetToMinDate(event: any) {
    const selectedDate = new Date(event.detail.value);
    const minDate = new Date(this.getMinDate());

    if (selectedDate < minDate) {
      this.formularioTarefa.patchValue({ data_limite: this.getMinDate() });
    }
  }
  // Função para mudar o idioma
  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }
  // Função para criar a tarefa
  async criarTarefa() {
    if (this.formularioTarefa.invalid) {
      this.displayFormErrors();
      return;
    }

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
  // Função para mostrar os erros do formulário
  displayFormErrors() {
    // Itera sobre os controles do formulário
    Object.keys(this.formularioTarefa.controls).forEach((key) => {
      // Obtém os erros de cada controle
      const controlErrors = this.formularioTarefa.get(key)?.errors;
      if (controlErrors) {
        // Itera sobre os erros de cada controle
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            `Key control: ${key}, keyError: ${keyError}, error: ${controlErrors[keyError]}`
          );
        });
      }
    });
  }
  // Função para cancelar
  cancelar() {
    console.log('Operação cancelada');
  }
  // Função para guardar
  async guardar() {
    try {
      console.log('Tarefa criada e guardada com sucesso!');
    } catch (error) {
      console.error('Erro ao guardar a tarefa:', error);
    }
  }
}
