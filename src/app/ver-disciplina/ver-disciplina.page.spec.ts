import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerDisciplinaPage } from './ver-disciplina.page';

describe('VerDisciplinaPage', () => {
  let component: VerDisciplinaPage;
  let fixture: ComponentFixture<VerDisciplinaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerDisciplinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
