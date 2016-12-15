"use strict";
var multiline = require('multiline-template');
function duplicateActionCreator(key) {
    return (_a = ["\n    | An action creator with the key ", " already exists.\n    | Please only add new action creators or use setActionCreators\n    | to overwrite the current collection of action creators.\n  "], _a.raw = ["\n    | An action creator with the key ", " already exists.\n    | Please only add new action creators or use setActionCreators\n    | to overwrite the current collection of action creators.\n  "], multiline(_a, key));
    var _a;
}
exports.duplicateActionCreator = duplicateActionCreator;
function missingActionCreator(actionType) {
    return (_a = ["\n    | No action creator defined for this action: ", "\n  "], _a.raw = ["\n    | No action creator defined for this action: ", "\n  "], multiline(_a, actionType));
    var _a;
}
exports.missingActionCreator = missingActionCreator;
//# sourceMappingURL=error-texts.js.map