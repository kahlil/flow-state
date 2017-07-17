export interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

export interface ActionCreator {
  (payload?: any): Action;
}

export interface ActionCreators {
  [key: string]: ActionCreator;
}
