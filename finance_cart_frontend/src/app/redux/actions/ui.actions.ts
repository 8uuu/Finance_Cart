//ngrx-actions
import { createAction, props } from '@ngrx/store';

export const isLoadingAction = createAction('[UI Component] isLoading');
export const stopLoadingAction = createAction('[UI Component] stopLoading');
export const setRolAction = createAction(
    '[UI Component] setRolAction',
    props<{ setRolAction: number }>()
  );
