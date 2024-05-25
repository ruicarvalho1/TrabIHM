import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

import {
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { createClient } from '@supabase/supabase-js';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage {
  dadosAtualizados = this.fb.nonNullable.group({
    nome: [''],
    numero: [''],
    curso: [''],
    universidade: [''],
    imagem: [''],
  });
  uploadedFileName: string = '';
  users: any = null;
  user = this.authService.getCurrentUser();

  constructor(
    private fb: FormBuilder,
    private dataservice: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private translateService: TranslateService,
    private data: DataService
  ) {}

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  cursos = [
    'Engenharia Informática',
    'Engenharia Alimentar',
    'Enfermagem',
    'Turismo',
    'Contabilidade e Finanças',
    'Design Gráfico',
    'Marketing Digital',
    'Engenharia Civil',
    'Arquitetura',
    'Biomedicina',
    'Direito',
    'Psicologia',
    'Engenharia Mecânica',
    'Engenharia Eletrotécnica',
    'Engenharia de Produção',
    'Medicina Veterinária',
    'Ciências da Comunicação',
    'Gestão de Recursos Humanos',
    'Engenharia Química',
  ].sort();

  get nome() {
    return this.dadosAtualizados.controls.nome;
  }
  get curso() {
    return this.dadosAtualizados.controls.curso;
  }
  get universidade() {
    return this.dadosAtualizados.controls.universidade;
  }
  get numero() {
    return this.dadosAtualizados.controls.numero;
  }
  async updatePerfil() {
    const loading = await this.loadingController.create({
      message: 'Atualizando perfil...',
      spinner: 'circles',
      backdropDismiss: false,
    });

    try {
      await loading.present();

      const userId = this.authService.getCurrentUserId();
      const fileInput = document.getElementById(
        'imagemUpload'
      ) as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (file) {
        const imageUrl = await this.dataservice.uploadImagemPerfil(file);
        // Atualiza apenas a imagem do perfil no Supabase
        await this.authService.updateUserData({
          id: userId,
          imagem: imageUrl,
        });

        console.log('Imagem do perfil atualizada com sucesso.');
        // Exibe um toast de sucesso
        const successToast = await this.toastController.create({
          message: 'Imagem do perfil atualizada com sucesso!',
          duration: 2000,
          color: 'success',
        });
        await successToast.present();
      } else {
        console.error('Nenhuma imagem selecionada.');
      }
    } catch (error) {
      console.error('Erro ao atualizar a imagem do perfil:', error);
      // Exibe um toast de erro
      const errorToast = await this.toastController.create({
        message: 'Erro ao atualizar a imagem do perfil. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    } finally {
      await loading.dismiss();
    }
  }

  onImageUpload(event: any) {
    const fileInput = event.target as HTMLInputElement;
    this.uploadedFileName = fileInput.files?.[0]?.name ?? '';
  }

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.users = await this.data.getUserById(userId);

      console.log('group: ', this.users);
    } else {
      console.log('Nenhum usuário autenticado encontrado.');
    }
  }
}
