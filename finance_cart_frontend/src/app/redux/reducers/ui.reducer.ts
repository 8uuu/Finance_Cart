import { Action, createReducer, on } from '@ngrx/store';
import {
  isLoadingAction,
  stopLoadingAction,
  setRolAction,
} from '../actions/ui.actions';

export interface State {
  isLoading: boolean;
  setRolAction: number;
}

export const initialState: State = {
  isLoading: false,
  setRolAction: 0,
};

const _uiReducer = createReducer(
  initialState,
  on(isLoadingAction, (state) => ({ ...state, isLoading: true })),
  on(stopLoadingAction, (state) => ({ ...state, isLoading: false })),
  on(setRolAction, (state, { setRolAction }) => ({
    ...state,
    setRolAction: setRolAction,
  }))
);

export function uiReducer(state: State | undefined, action: Action) {
  return _uiReducer(state, action);
}
