import { CanActivateFn, Router  } from '@angular/router';
import { Injectable } from '@angular/core'
import { DbService } from '../services/dbservice.service'; // Fixear !!!

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};