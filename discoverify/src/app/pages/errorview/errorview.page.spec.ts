import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorviewPage } from './errorview.page';

describe('ErrorviewPage', () => {
  let component: ErrorviewPage;
  let fixture: ComponentFixture<ErrorviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
