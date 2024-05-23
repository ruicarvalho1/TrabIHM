import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  public swiper!: Swiper;

  constructor(private translateService: TranslateService) {}

  onchangeLanguage(e: any) {
    this.translateService.use(e.target.value ? e.target.value : 'en');
  }
}
