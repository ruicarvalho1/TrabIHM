import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-nova-disciplina',
  templateUrl: './nova-disciplina.page.html',
  styleUrls: ['./nova-disciplina.page.scss'],
})
export class NovaDisciplinaPage {
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
      nome: [''],
      area_estudo: [''],
      notas: [''],
      imagem: [''],
    });
  }

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  async criarDisciplina() {
    const loading = await this.loadingController.create({
      message: 'Criando Disciplina...',
      spinner: 'circles',
      backdropDismiss: false,
    });

    try {
      await loading.present();

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

      await this.dataService.createDisciplina(novaDisciplina);
      console.log('Tarefa criada com sucesso!');

      await loading.dismiss();

      // Exibe um toast de sucesso
      const successToast = await this.toastController.create({
        message: 'Disciplina criada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await successToast.present();
    } catch (error) {
      console.error('Erro ao criar Disciplina:', error);

      await loading.dismiss();

      // Exibe um toast de erro
      const errorToast = await this.toastController.create({
        message: 'Erro ao criar Disciplina. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    }
  }
}
