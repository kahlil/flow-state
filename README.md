# oddstream

> One Direction Data Stream

A simple Redux-type library entirely based on RxJS streams.  
This is an easy way to introduce a stream-based unidirectional dataflow into your app.

## Install

`npm install --save oddstream`

## Usage

```js
import { createOddstream } from 'oddstream';

const oddstream = createOddstream();
```

### Set Action Creators
Pass all action creators to the OddStream library.
Preferably in the code of the main component that contains the rest of your app.

```js
// A collection of action creators.
const actionCreators = {
  deleteItem: id => ({ type: 'DELETE_ITEM', payload: { id }}),
  addItem: item => ({ type: 'ADD_ITEM', payload: { item }}),
  // ...
};

oddstream.setActionCreators(actionCreators);
```

### Dispatch Actions
In your components dispatch action by passing
an action stream and the action name or constant.

```js
// There are many ways to create streams from user intent.
// Some frameworks (like Angular 2) offer their own ways.
// In this example I am just using the RxJS library.
buttonClick$ = Rx.Observable.fromEvent('.some-button', click);
oddstream.dispatch(buttonClick$, 'BUTTON_CLICK');
```

### Create A State Stream Based On Reducers
In a file that you could call Store or something,
create and expose state streams for you different components
by passing the respective reducers.

Here is also the place where you can combine state streams if they
depend on one another.

```js
// A collection of reducers.
const reducers = {
  deleteItem: (action, state) => state
    .filter(item => state.filter(item.id !== action.payload.id)),
  addItem: (action, state) => [...state, action.payload],
  // ...
};

someComponentState$ = oddstream.makeStateStream(reducers, initialState);
```

### Trigger Side Effects
You can trigger your side effects by getting the dispatcher stream
and firing effects on specific actions.

When the side effects are done, they themselves can fire actions
to introduce new changes to the user interface.

```js
// An api to fire certain side effects.
const serverApi = new serverApi();
const dispatcher$ = getDispatcher$();

dispatcher$
  .do(action => {
    switch(action.type) {
      case 'DELETE_ITEM':
        serverApi.deleteItem(action.payload);
        break;
      case 'ADD_ITEM':
        serverApi.addItem(action.payload);
        break;
    }
  });
```

## License

MIT © [Kahlil Lechelt](http://kahlil.info)
