import { Action, createReducer, on } from '@ngrx/store';
import {
  setPersonAction,
  setPersonProviderAction,
} from '../actions/person.actions';
import { setPersonProductTypeAction, setPersonProductAction, setSelectedTasa } from '../actions/person.actions';
import { IUser } from '../interface/user.interface';

export interface State {
  user: IUser | null;
  selectedProvider: any | null;
  selectedProductType: number | null;
  selectedProduct: any | null;
  setSelectedTasa:string | null;
}

export const initialState: State = {
  user: null,
  selectedProvider: null,
  selectedProductType: 1,
  selectedProduct: null,
  setSelectedTasa:'Efectiva'
};

const _personReducer = createReducer(
  initialState,

  on(setPersonAction, (state, { person }) => ({
    ...state,
    user: { ...person },
  })),

  on(setPersonProviderAction, (state, { selectedProvider }) => ({
    ...state,
    selectedProvider: { ...selectedProvider },
  })),

  on(setPersonProductTypeAction, (state, { selectedProductType }) => ({
    ...state,
    selectedProductType: selectedProductType,
  })),

  on(setPersonProductAction, (state, { selectedProduct }) => ({
    ...state,
    selectedProduct: { ...selectedProduct },
  })),
  on(setSelectedTasa, (state, { setSelectedTasa }) => ({
    ...state,
    setSelectedTasa: setSelectedTasa,
  })),
);

export function personReducer(state: State | undefined, action: Action) {
  return _personReducer(state, action);
}
