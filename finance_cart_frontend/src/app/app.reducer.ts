import { ActionReducerMap } from '@ngrx/store';
import * as ui from './redux/reducers/ui.reducer';
import * as person from './redux/reducers/person.reducer';

export interface IAppState {
  ui: ui.State,
  person: person.State,
}

export const appReducers: ActionReducerMap<IAppState> = {
    ui: ui.uiReducer,
    person: person.personReducer,
};
