import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import {
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { createClient } from '@supabase/supabase-js';
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
    numero: ['', [Validators.required, Validators.minLength(1)]],
    curso: ['', [Validators.required, Validators.minLength(1)]],
    universidade: ['', [Validators.required, Validators.minLength(1)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  supabase: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.supabase = createClient(
      'https://fbygxfimudlqdbxzkmpo.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZieWd4ZmltdWRscWRieHprbXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzMzM1NjQsImV4cCI6MjAzMDkwOTU2NH0.mEZm_BbKRRV9QcrzOgKE1pheMtt8zzhGIyZMwzdmsek'
    );
  }

  get email() {
    return this.credentials.controls.email;
  }
  get nome() {
    return this.credentials.controls.nome;
  }
  get numero() {
    return this.credentials.controls.numero;
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
      const credentials = this.credentials.getRawValue();

      // Cria a conta no Supabase com email e password
      const { data, error } = await this.authService.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        await loading.dismiss();
        this.showAlert('Registo Falhou', error.message);
        return;
      }

      const user = data?.user;

      if (user?.id) {
        // Salva os dados adicionais na tabela users
        const insertResult = await this.authService.insertUserData({
          id: user.id,
          email: credentials.email,
          nome: credentials.nome,
          numero: credentials.numero,
          curso: credentials.curso,
          universidade: credentials.universidade,
        });

        if (insertResult.error) {
          const error = insertResult.error as { message: string };
          await loading.dismiss();
          this.showAlert('Registo Falhou', error.message);
          return;
        }

        await loading.dismiss();
        this.showAlert(
          'Registo feito com sucesso',
          'Por favor confirma o email'
        );
        this.navCtrl.navigateBack('');
      } else {
        await loading.dismiss();
        this.showAlert('Registo Falhou', 'O ID do usuário não foi retornado.');
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
