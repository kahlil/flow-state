# oddstream

> One Direction Data Stream

A simple Redux-type library entirely based on RxJS streams.  
This is an easy way to introduce a stream-based unidirectional dataflow into your app.

## Install

`npm install oddstream`

## Usage

```js
import { createOddstream } from 'oddstream';

const oddstream = createOddstream();
```

### Dispatch Actions
In your components dispatch actions by passing the action constant and optionally
an action payload. The payload can be any value.

```js
oddstream.dispatch('SOME_ACTION', { some: 'state' });
```

### Create A State Stream Based On Reducers
In a file that you could call Store,
create and expose state streams for your components
by passing the respective reducers.

Here is also the place where you can combine state streams if they
depend on one another.

```js
// A collection of reducers.
const itemListReducers = {
  deleteItem: (action, state) => state
    .filter(item => state.filter(item.id !== action.payload.id)),
  addItem: (action, state) => [...state, action.payload],
  // ...
};

itemListState$ = oddstream.makeStateStream(itemListReducers, initialState);
```

In your component you can now subscribe to the component state stream: 

```js
itemListState$.subscribe(state => console.log(state));
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
  .subscribe(action => {
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
