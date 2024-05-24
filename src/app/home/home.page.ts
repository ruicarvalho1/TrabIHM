import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Swiper } from 'swiper';
import { DataService } from './../services/data.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  users: any = null;
  user = this.authService.getCurrentUser();
  public swiper!: Swiper;
  tarefas: any[] = [];

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService
  ) {}

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }

  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.tarefas = await this.data.getTarefasDoUsuario(userId);
      this.users = await this.data.getUserById(userId);

      console.log('group: ', this.users);
    } else {
      console.log('Nenhum usuário autenticado encontrado.');
    }
  }
}
