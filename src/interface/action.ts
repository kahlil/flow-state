export interface Action {
  type: string;
  payload?: any;
}

export interface ActionCreator {
  (payload?: any): Action;
}

export interface ActionCreators {
  [key: string]: ActionCreator;
}
