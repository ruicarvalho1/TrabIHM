import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.page.html',
  styleUrls: ['./disciplinas.page.scss'],
})
export class DisciplinasPage {
  tasksAndDisciplines: any[] = [];
  disciplinas: any[] = [];
  users: any = null;
  user = this.authService.getCurrentUser();

  constructor(
    private translateService: TranslateService,
    private toastController: ToastController,
    private authService: AuthService,
    private data: DataService
  ) {}
}
