/*Imports importantes para o funcionamneto da aplicação, contendo todos os módulos necessários para o funcionamento 
da página como por exemplo o uso do "translate" e de "forms", todos módulos */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { ConversasGrupoPageRoutingModule } from './conversas-grupo-routing.module';

import { ConversasGrupoPage } from './conversas-grupo.page';

/*Array de módulos que foram importados no topo do código mas serão enviados para o 
funcionamento da aplicação a aprtir daqui: */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversasGrupoPageRoutingModule,
    TranslateModule,
  ],
  declarations: [ConversasGrupoPage],
})
export class ConversasGrupoPageModule {}
