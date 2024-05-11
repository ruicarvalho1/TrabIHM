import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //translate
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("pt");
    this.translate.addLangs(['pt','en','es'])
  }
  //end
}







