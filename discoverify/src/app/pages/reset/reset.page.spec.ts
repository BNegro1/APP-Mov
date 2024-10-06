import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPage } from './reset.page';

describe('ResetPage', () => {
  let component: ResetPage;
  let fixture: ComponentFixture<ResetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
