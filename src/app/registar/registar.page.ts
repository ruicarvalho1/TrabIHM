import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import {
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registar',
  templateUrl: './registar.page.html',
  styleUrls: ['./registar.page.scss'],
})
export class RegistarPage {
  credentials = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    nome: ['', [Validators.required, Validators.minLength(1)]],
    numero_aluno: ['', [Validators.required, Validators.minLength(1)]],
    curso: ['', [Validators.required, Validators.minLength(1)]],
    universidade: ['', [Validators.required, Validators.minLength(1)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  get email() {
    return this.credentials.controls.email;
  }
  get nome() {
    return this.credentials.controls.nome;
  }
  get numero_aluno() {
    return this.credentials.controls.numero_aluno;
  }
  get curso() {
    return this.credentials.controls.curso;
  }
  get universidade() {
    return this.credentials.controls.universidade;
  }
  get password() {
    return this.credentials.controls.password;
  }

  async createAccount() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const data = await this.authService.signUp(
        this.credentials.getRawValue()
      );

      await loading.dismiss();

      if (data.error) {
        this.showAlert('Registo Falhou', data.error.message);
      } else {
        this.showAlert(
          'Registo feito com sucesso',
          'Por favor confirma o email'
        );
        this.navCtrl.navigateBack('');
      }
    } catch (err) {
      await loading.dismiss();
      this.showAlert(
        'Registo Falhou',
        'Ocorreu um erro inesperado. Tente novamente.'
      );
      console.error('Erro ao criar conta:', err);
    }
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
