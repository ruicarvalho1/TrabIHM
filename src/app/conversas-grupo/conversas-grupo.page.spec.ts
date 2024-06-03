/* Impostação de elementos "angular" para criar testes em angular (TestBed) e (ComponentFixture) para debug*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversasGrupoPage } from './conversas-grupo.page';

/*Cria um grupo de especificações,podendo ser também chamado de (suite)*/

describe('ConversasGrupoPage', () => {
  let component: ConversasGrupoPage;
  let fixture: ComponentFixture<ConversasGrupoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversasGrupoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
