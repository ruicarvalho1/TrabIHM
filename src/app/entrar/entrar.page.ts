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
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      }
    });
  }

  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService
      .signIn(this.credentials.getRawValue())
      .then(async (data) => {
        await loading.dismiss();

        if (data.error) {
          this.showAlert('O Login falhou', data.error.message);
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

  async getMagicLink() {
    const alert = await this.alertController.create({
      header: 'Get a Magic Link',
      message: 'We will send you a link to magically log in!',
      inputs: [
        {
          type: 'email',
          name: 'email',
          value: 'isaacout@gmail.com',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Get Magic Link',
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.signInWithEmail(
              result.email,
              'http://localhost:8100/tabs/home'
            );
            await loading.dismiss();
            console.log('after signup: ', data);
            console.log('after signup error: ', error);

            if (error) {
              this.showAlert('Failed', error.message);
            } else {
              this.showAlert(
                'Success',
                'Please check your emails for further instructions!'
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
