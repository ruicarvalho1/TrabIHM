import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarGrupoPage } from './criar-grupo.page';

describe('CriarGrupoPage', () => {
  let component: CriarGrupoPage;
  let fixture: ComponentFixture<CriarGrupoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarGrupoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
