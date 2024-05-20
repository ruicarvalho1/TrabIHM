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

  get password() {
    return this.credentials.controls.password;
  }

  async createAccount() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService
      .signUp(this.credentials.getRawValue())
      .then(async (data) => {
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
      });
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
