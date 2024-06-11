import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ajuda',
  templateUrl: './ajuda.page.html',
  styleUrls: ['./ajuda.page.scss'],
})
export class AjudaPage implements OnInit {
  autores: string[] = [];
  fromPage: string | undefined;

  constructor(private storage: Storage, private route: ActivatedRoute) {}
  // Função para iniciar a página
  async ngOnInit() {
    // Obter o parâmetro from da URL
    this.route.queryParams.subscribe((params) => {
      // Guardar o valor do parâmetro from
      this.fromPage = params['from'];
    });
    // Função para iniciar o armazenamento
    await this.storage.create();
    await this.carregarAutores();

    // Se não houver autores, adicionar os autores
    if (this.autores.length === 0) {
      // Adicionar os autores
      this.autores.push(
        'Rui Carvalho nº27628',
        'Miguel Cruz nº27643',
        'André Costa nº27638'
      );
      // Guardar os autores no armazenamento
      await this.storage.set('autores', this.autores);
    }
  }
  // Função para adicionar um autor
  async adicionarAutor(nome: string) {
    if (nome.trim() !== '') {
      this.autores.push(nome);
      await this.storage.set('autores', this.autores);
    }
  }
  // Função para carregar os autores
  async carregarAutores() {
    const autores = await this.storage.get('autores');
    if (autores) {
      this.autores = autores;
    }
  }
}
