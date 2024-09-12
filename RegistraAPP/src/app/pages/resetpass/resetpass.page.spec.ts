import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetpassPage } from './resetpass.page';

describe('ResetpassPage', () => {
  let component: ResetpassPage;
  let fixture: ComponentFixture<ResetpassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
