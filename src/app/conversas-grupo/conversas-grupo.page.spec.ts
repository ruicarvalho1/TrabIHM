import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversasGrupoPage } from './conversas-grupo.page';

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
