//ngrx-actions
import { createAction, props } from '@ngrx/store';
// import {  IPersonProfile } from '../../core/person-profile/home-person/models/personProfile.model';
import { IUser } from '../interface/user.interface';

export const setPersonAction = createAction(
  '[Person Component] setPersonAction',
  props<{ person: IUser }>()
);
export const setPersonProviderAction = createAction(
  '[Person Component] setPersonProvider',
  props<{ selectedProvider: any }>()
);

export const setPersonProductTypeAction = createAction(
  '[Person Component] setPersonProductTypeAction',
  props<{ selectedProductType: number }>()
);

export const setPersonProductAction = createAction(
  '[Person Component] setPersonProductAction',
  props<{ selectedProduct: any }>()
);


export const setSelectedTasa = createAction(
  '[Person Component] setSelectedTasa',
  props<{ setSelectedTasa: string }>()
);
