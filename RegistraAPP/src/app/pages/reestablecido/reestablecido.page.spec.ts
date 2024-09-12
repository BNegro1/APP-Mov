import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReestablecidoPage } from './reestablecido.page';

describe('ReestablecidoPage', () => {
  let component: ReestablecidoPage;
  let fixture: ComponentFixture<ReestablecidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReestablecidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
