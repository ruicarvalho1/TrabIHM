import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService,TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  
})
export class HomePage{



  constructor(private translateService: TranslateService) { }

  onchangeLanguage( e: any) {
    this.translateService.use(e.target.value ? e.target.value: "en")
  }

 

}
