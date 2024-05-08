import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistarPage } from './registar.page';

describe('RegistarPage', () => {
  let component: RegistarPage;
  let fixture: ComponentFixture<RegistarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
