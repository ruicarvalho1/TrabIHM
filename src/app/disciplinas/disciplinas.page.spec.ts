import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisciplinasPage } from './disciplinas.page';

describe('DisciplinasPage', () => {
  let component: DisciplinasPage;
  let fixture: ComponentFixture<DisciplinasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplinasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
