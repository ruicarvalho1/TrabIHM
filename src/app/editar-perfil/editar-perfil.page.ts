import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { CameraResultType, CameraSource } from '@capacitor/camera';
const { Camera, Permissions } = Plugins;

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

  async openCameraOrGallery(source: string) {
    try {
      const hasPermission = await this.checkCameraPermissions();
      if (!hasPermission) {
        throw new Error('Permissão negada para acessar a câmera ou a galeria.');
      }

      const image = await Plugins['Camera']['getPhoto']({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      });

      // Upload da imagem para o Supabase
      const imageUrl = await this.dataservice.uploadImagemPerfil(image.path);

      // Atualização dos dados do perfil do usuário
      const userId = this.authService.getCurrentUserId();
      await this.authService.updateUserData({
        id: userId,
        imagem: imageUrl,
      });

      console.log('Perfil atualizado com sucesso.');
      // Exibe um toast de sucesso
      const successToast = await this.toastController.create({
        message: 'Perfil atualizado com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await successToast.present();
    } catch (error) {
      console.error('Erro ao acessar a câmera ou a galeria:', error);
      // Lida com erros de acesso à câmera ou à galeria
      const errorToast = await this.toastController.create({
        message: 'Erro ao acessar a câmera ou a galeria. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    }
  }

  async checkCameraPermissions() {
    const result = await Permissions['query']({ name: 'camera' });
    return result.state === 'granted';
  }

  async onAddButtonClick(source: string) {
    await this.openCameraOrGallery(source);
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

      // Inicializa a variável para armazenar a URL da imagem
      let imageUrl: string | undefined;

      // Se houver uma nova imagem selecionada, faz o upload
      if (file) {
        imageUrl = await this.dataservice.uploadImagemPerfil(file);
      }

      // Atualiza apenas os campos que foram modificados no formulário
      const dadosAtualizados: any = {};
      Object.keys(this.dadosAtualizados.controls).forEach((key) => {
        const control = this.dadosAtualizados.get(key);
        if (control && control.dirty) {
          dadosAtualizados[key] = control.value;
        }
      });

      // Se houver uma imagem nova ou outros campos modificados, atualiza o perfil
      if (file || Object.keys(dadosAtualizados).length > 0) {
        if (imageUrl) {
          dadosAtualizados.imagem = imageUrl;
        }

        // Atualiza os dados do perfil no Supabase
        await this.authService.updateUserData({
          id: userId,
          ...dadosAtualizados,
        });

        console.log('Perfil atualizado com sucesso.');
        // Exibe um toast de sucesso
        const successToast = await this.toastController.create({
          message: 'Perfil atualizado com sucesso!',
          duration: 2000,
          color: 'success',
        });
        await successToast.present();
      } else {
        // Se nenhum arquivo de imagem for selecionado e nenhum outro dado for fornecido, exibe uma mensagem informativa
        console.log('Nenhuma alteração feita.');
        // Exibe um toast informativo
        const infoToast = await this.toastController.create({
          message: 'Nenhuma alteração feita.',
          duration: 2000,
          color: 'warning',
        });
        await infoToast.present();
      }
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      // Exibe um toast de erro
      const errorToast = await this.toastController.create({
        message: 'Erro ao atualizar o perfil. Tente novamente.',
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
