import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadChildren } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.page.html',
  styleUrls: ['./entrar.page.scss'],
})
export class EntrarPage {
  credentials = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    // Verificar se o utilizador já está autenticado
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      }
    });
  }
  // getters para fazer login
  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }
  // função para fazer login
  async login() {
    // Mostrar um loading enquanto o login é feito
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService
      // Fazer login com as credenciais
      .signIn(this.credentials.getRawValue())
      // Se o login for bem sucedido, redirecionar para a página home
      .then(async (data) => {
        await loading.dismiss();

        if (data.error) {
          this.showAlert('O Login falhou', data.error.message);
        }
      });
  }
  // função para mostrar um alerta
  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
  // função para obter o link mágico
  async getMagicLink() {
    const alert = await this.alertController.create({
      header: 'Entrar com email',
      message: 'Verifique o seu email para obter o link de entrada.',
      inputs: [
        {
          type: 'email',
          name: 'email',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Entrar com email',
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.signInWithEmail(
              result.email,
              'http://localhost:8100/tabs/home'
            );
            await loading.dismiss();

            if (error) {
              this.showAlert('Falhou', error.message);
            } else {
              this.showAlert('Sucesso!', 'Por favor, verifique o seu email');
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
