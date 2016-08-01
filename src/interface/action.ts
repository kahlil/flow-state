export interface Action {
  type: string;
  payload?: any;
}

export interface ActionCreator {
    (action: string, state: any): Action;
}

export interface ActionCreators {
  [key: string]: ActionCreator;
}
