import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {


  appLanguageList= [
    {code: "en", title: "Inglês", text:"english"},
    {code: "es", title: "Espanhol", text:"Spanish"},
    {code: "pt", title: "Português", text:"Portuguese"},
    
  ]

  constructor(private translateService: TranslateService) { }

  onchangeLanguage( e: any) {
    this.translateService.use(e.target.value ? e.target.value: "en")
  }

  

 
}
