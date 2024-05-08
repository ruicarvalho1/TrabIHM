import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovaDisciplinaPage } from './nova-disciplina.page';

describe('NovaDisciplinaPage', () => {
  let component: NovaDisciplinaPage;
  let fixture: ComponentFixture<NovaDisciplinaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaDisciplinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
