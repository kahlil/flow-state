export interface Reducer {
    <S>(action: string, state: S): S;
}
export interface CurriedReducer {
    <S>(state: S): S;
}
export interface Reducers {
    [key: string]: Reducer;
}
