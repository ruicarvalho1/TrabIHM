import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-nova-disciplina',
  templateUrl: './nova-disciplina.page.html',
  styleUrls: ['./nova-disciplina.page.scss'],
})
export class NovaDisciplinaPage implements OnInit {
  formularioDisciplina: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private translateService: TranslateService
  ) {
    this.formularioDisciplina = this.fb.group({
      nome: ['', Validators.required],
      area_estudo: ['', Validators.required],
      notas: [''],
      imagem: [''],
    });
  }

  ngOnInit() {}
  // Função para mudar o idioma
  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }
  // Função para criar disciplina
  async criarDisciplina() {
    if (this.formularioDisciplina.invalid) {
      this.formularioDisciplina.markAllAsTouched();
      return;
    }
    // Cria um loading
    const loading = await this.loadingController.create({
      message: 'Criando Disciplina...',
      spinner: 'circles',
      backdropDismiss: false,
    });

    try {
      await loading.present();
      // Obtém os dados do formulário
      const novaDisciplina = this.formularioDisciplina.value;
      const userId = this.authService.getCurrentUserId();
      novaDisciplina.user_id = userId;

      // Faz o upload da imagem
      const fileInput = document.getElementById(
        'imagemUpload'
      ) as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        const imageUrl = await this.dataService.uploadImagemDisciplina(file);
        novaDisciplina.imagem = imageUrl; // Define o URL da imagem no objeto da tarefa
      }
      // Cria a disciplina
      await this.dataService.createDisciplina(novaDisciplina);
      console.log('Disciplina criada com sucesso!');

      await loading.dismiss();

      // Mostra um toast de sucesso
      const successToast = await this.toastController.create({
        message: 'Disciplina criada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await successToast.present();
    } catch (error) {
      console.error('Erro ao criar Disciplina:', error);

      await loading.dismiss();

      // Mosta um toast de erro
      const errorToast = await this.toastController.create({
        message: 'Erro ao criar Disciplina. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    }
  }
}
