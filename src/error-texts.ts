const multiline = require('multiline-template');

export function duplicateActionCreator(key) {
  return multiline`
    | An action creator with the key ${key} already exists.
    | Please only add new action creators or use setActionCreators
    | to overwrite the current collection of action creators.
  `;
}

export function missingActionCreator(actionType) {
  return multiline`
    | No action creator defined for this action: ${actionType}
  `;
}
