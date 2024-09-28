import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContributePage } from './contribute.page';

describe('ContributePage', () => {
  let component: ContributePage;
  let fixture: ComponentFixture<ContributePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
