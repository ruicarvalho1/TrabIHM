import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversasGrupoPageRoutingModule } from './conversas-grupo-routing.module';

import { ConversasGrupoPage } from './conversas-grupo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversasGrupoPageRoutingModule
  ],
  declarations: [ConversasGrupoPage]
})
export class ConversasGrupoPageModule {}
