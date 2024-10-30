import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => { // 
    authServiceMock.isAuthenticated.and.returnValue(true);
    expect(guard.canActivate({} as any, {} as any)).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    routerMock.createUrlTree.and.returnValue({} as any);
    expect(guard.canActivate({} as any, {} as any)).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});