import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nova-tarefa',
  templateUrl: './nova-tarefa.page.html',
  styleUrls: ['./nova-tarefa.page.scss'],
})
export class NovaTarefaPage {
  formularioTarefa: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.formularioTarefa = this.fb.group({
      prioridade: [''],
      concluida: [false],
      tarefa: [''],
      nome_tarefa: [''],
      data_limite: [''],
      imagem: [''],
    });
  }

  async criarTarefa() {
    try {
      const novaTarefa = this.formularioTarefa.value;
      await this.dataService.createTarefa(novaTarefa);
      console.log('Tarefa criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  }

  cancelar() {
    console.log('Operação cancelada');
  }

  async guardar() {
    try {
      console.log('Tarefa criada e guardada com sucesso!');
    } catch (error) {
      console.error('Erro ao guardar a tarefa:', error);
    }
  }
}
