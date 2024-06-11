import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChildren, QueryList } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { DataService } from './../services/data.service';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  user = this.authService.getCurrentUser();
  notificationState: boolean = false;
  users: any = null;

  appLanguageList = [
    { code: 'en', title: 'Inglês', text: 'Changed to English' },
    { code: 'es', title: 'Espanhol', text: 'Cambiado a Español' },
    { code: 'pt', title: 'Português', text: 'Alterado para Português' },
  ];

  @ViewChildren('toast') toastComponents!: QueryList<any>; // Inicia da propriedade

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService,
    private storage: Storage,
    private router: Router
  ) {
    this.initStorage();
  }
  // Função para iniciar o armazenamento
  async initStorage() {
    this.storage = await this.storage.create(); // Inicia o armazenamento
  }
  // Função para apresentar um toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }
  // Função para mudar o idioma
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
  // Função para mostrar o user atual
  async ionViewWillEnter() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.users = await this.data.getUserById(userId);
    } else {
      console.log('Nenhum utilizador autenticado encontrado.');
    }
  }
  // Função de sair
  signOut() {
    this.authService.signOut();
  }

  //Função para ir para a página de ajuda
  paginaAjuda() {
    this.router.navigate(['/ajuda'], { queryParams: { from: 'perfil' } });
  }
}
