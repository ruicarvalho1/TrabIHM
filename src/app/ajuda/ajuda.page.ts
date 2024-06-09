import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-ajuda',
  templateUrl: './ajuda.page.html',
  styleUrls: ['./ajuda.page.scss'],
})
export class AjudaPage {
  autores: string[] = [];

  constructor(private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
    await this.carregarAutores();

    if (this.autores.length === 0) {
      this.autores.push(
        'Rui Carvalho nº27628',
        'Miguel Cruz nº27643',
        'André Costa nº27638'
      );
      await this.storage.set('autores', this.autores);
    }
  }

  async adicionarAutor(nome: string) {
    if (nome.trim() !== '') {
      this.autores.push(nome);
      await this.storage.set('autores', this.autores);
    }
  }

  async carregarAutores() {
    const autores = await this.storage.get('autores');
    if (autores) {
      this.autores = autores;
    }
  }
}
