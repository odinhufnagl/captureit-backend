"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToGraphql = void 0;
const objectToGraphql = (input) => {
    const inputJSON = JSON.stringify(input);
    const graphQLInput = inputJSON.replace(/"([^(")"]+)":/g, "$1:");
    return graphQLInput;
};
exports.objectToGraphql = objectToGraphql;
//# sourceMappingURL=helpers.js.map