import { CanActivateFn, Router  } from '@angular/router';
import { Injectable } from '@angular/core'
import { DbService } from './dbservice.service';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};