import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
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
    nome: ['', [Validators.required, Validators.minLength(1)]],
    numero: ['', [Validators.required, Validators.minLength(1)]],
    curso: ['', [Validators.required, Validators.minLength(1)]],
    universidade: ['', [Validators.required, Validators.minLength(1)]],
  });

  constructor(
    private fb: FormBuilder,
    private dataservice: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

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

      if (this.dadosAtualizados.valid) {
        const userDataToUpdate = this.dadosAtualizados.value;
        // Obtém o ID do usuário atualmente logado
        const userId = this.authService.getCurrentUserId();
        // Atualiza os dados do usuário com o Supabase
        await this.authService.updateUserData({
          id: userId,
          ...userDataToUpdate,
        });
        console.log('Perfil do usuário atualizado com sucesso.');
        // Exibe um toast de sucesso
        const successToast = await this.toastController.create({
          message: 'Perfil atualizado com sucesso!',
          duration: 2000,
          color: 'success',
        });
        await successToast.present();
      } else {
        console.error('Dados do formulário inválidos.');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      // Exibe um toast de erro
      const errorToast = await this.toastController.create({
        message: 'Erro ao atualizar perfil. Tente novamente.',
        duration: 2000,
        color: 'danger',
      });
      await errorToast.present();
    } finally {
      await loading.dismiss();
    }
  }
}
