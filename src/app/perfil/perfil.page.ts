import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChildren, QueryList } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { DataService } from './../services/data.service';
import { Plugins } from '@capacitor/core';

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

  @ViewChildren('toast') toastComponents!: QueryList<any>; // Inicialização da propriedade

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService,
    private storage: Storage
  ) {
    this.initStorage();
  }

  async initStorage() {
    this.storage = await this.storage.create(); // Inicializa o armazenamento
  }

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
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.users = await this.data.getUserById(userId);
      console.log('group: ', this.users);
    } else {
      console.log('Nenhum usuário autenticado encontrado.');
    }

    // Obtém e define o estado atual das notificações
    this.notificationState = await this.getNotificationState();

    // Verifica e pergunta ao usuário sobre as notificações
    await this.checkAndAskForNotifications();
  }
  async setNotificationState(enabled: boolean) {
    await this.storage.set('notificationState', enabled);
  }

  async getNotificationState() {
    return (await this.storage.get('notificationState')) || false;
  }

  async toggleNotifications() {
    // Alterna o estado das notificações
    this.notificationState = !this.notificationState;

    // Solicita permissão para notificações se o usuário estiver ativando as notificações
    if (this.notificationState) {
      await this.requestNotificationPermissions();
    }

    // Exibe um toast informando que as notificações foram ativadas ou desativadas
    const message = this.notificationState
      ? 'Notificações ativadas'
      : 'Notificações desativadas';
    this.presentToast(message);
  }

  // Função para solicitar permissões de notificação
  async requestNotificationPermissions() {
    try {
      const permission = await PushNotifications['requestPermission']();
      console.log('Permission:', permission);
      if (permission.granted) {
        console.log('Permission granted');
      } else {
        console.warn('Permission denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  }

  async checkAndAskForNotifications() {
    // Verifica se as notificações estão desativadas
    if (!this.notificationState) {
      const toast = await this.toastController.create({
        message: 'Deseja ativar as notificações?',
        buttons: [
          {
            text: 'Ativar',
            handler: () => {
              // Ativa as notificações
              this.toggleNotifications();
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Ação cancelada');
            },
          },
        ],
      });
      await toast.present();
    }
  }
  signOut() {
    this.authService.signOut();
  }
}
