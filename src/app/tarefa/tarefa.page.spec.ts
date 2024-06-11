import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarefaPage } from './tarefa.page';

// A descrição do teste da página TarefaPage
describe('TarefaPage', () => {
  let component: TarefaPage;
  let fixture: ComponentFixture<TarefaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TarefaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
