import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovaTarefaPage } from './nova-tarefa.page';

describe('NovaTarefaPage', () => {
  let component: NovaTarefaPage;
  let fixture: ComponentFixture<NovaTarefaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaTarefaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
