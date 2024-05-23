import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChildren, QueryList } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import {
  SupabaseClient,
  createClient,
  RealtimeChannel,
} from '@supabase/supabase-js';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  user = this.authService.getCurrentUser();

  group: any = null;

  appLanguageList = [
    { code: 'en', title: 'Inglês', text: 'Changed to English' },
    { code: 'es', title: 'Espanhol', text: 'Cambiado a Español' },
    { code: 'pt', title: 'Português', text: 'Alterado para Português' },
  ];

  @ViewChildren('toast') toastComponents!: QueryList<any>; // Inicialização da propriedade

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService
  ) {}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

  onchangeLanguage(e: any) {
    const selectedLanguage = e.detail.value ? e.detail.value : 'en';
    const selectedLanguageData = this.appLanguageList.find(
      (lang) => lang.code === selectedLanguage
    );
    if (selectedLanguageData) {
      this.translateService.use(selectedLanguage).subscribe(() => {
        this.presentToast(selectedLanguageData.text);
      });
    }
  }

  async ionViewWillEnter() {
    const id = '1';
    this.group = await this.data.getUserById(id);
    console.log('group: ', this.group);
  }

  signOut() {
    this.authService.signOut();
  }
}
