import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChildren, QueryList } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {

  appLanguageList= [
    {code: "en", title: "Inglês", text: "Changed to English"},
    {code: "es", title: "Espanhol", text: "Cambiado a Español"},
    {code: "pt", title: "Português", text: "Alterado para Português"},
  ];

  @ViewChildren('toast') toastComponents!: QueryList<any>; // Inicialização da propriedade

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController
  ) { }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  onchangeLanguage(e: any) {
    const selectedLanguage = e.detail.value ? e.detail.value : 'en';
    const selectedLanguageData = this.appLanguageList.find(lang => lang.code === selectedLanguage);
    if (selectedLanguageData) {
      this.translateService.use(selectedLanguage).subscribe(() => {
        this.presentToast(selectedLanguageData.text);
      });
    }
  }
}
