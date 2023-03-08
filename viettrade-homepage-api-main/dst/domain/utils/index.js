"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.addBaseUrlToData = exports.isValidEmail = exports.pick = void 0;
const lodash_1 = require("lodash");
const query = require("./query");
const path = require('path');
const pick = (params, field) => {
    return (0, lodash_1.pick)(params, field);
};
exports.pick = pick;
const isValidEmail = (value) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
};
exports.isValidEmail = isValidEmail;
const addBaseUrlToData = (data, field) => {
    data = JSON.parse(JSON.stringify(data));
    if (Array.isArray(data)) {
        data.map((doc) => {
            if (doc && doc[field]) {
                doc[field] = doc[field].includes('http')
                    ? doc[field]
                    : path.join(process.env.IMAGE_URL, doc[field]);
            }
        });
    }
    else {
        if (data && data[field]) {
            data[field] = data[field].includes('http')
                ? data[field]
                : path.join(process.env.IMAGE_URL, data[field]);
        }
    }
    return data;
};
exports.addBaseUrlToData = addBaseUrlToData;
exports.query = query;
//# sourceMappingURL=index.js.map