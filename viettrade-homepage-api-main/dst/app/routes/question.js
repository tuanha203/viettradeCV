"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_1 = require("../controllers/question");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const questionValidator = require("../validators/question");
function default_1(db) {
    const questionRouter = (0, express_1.Router)();
    const questionController = new question_1.default(db);
    /**
     * questionCreate API
     */
    questionRouter.post('/', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.questionCreate), questionValidator.create, validator_1.default, questionController.create);
    /**
     * questionUpdate API
     */
    questionRouter.put('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.questionUpdate), questionValidator.update, validator_1.default, questionController.update);
    /**
     * questionSearch API
     */
    questionRouter.get('/', questionValidator.search, validator_1.default, questionController.search);
    /**
     * questionSearchId API
     */
    questionRouter.get('/:id([0-9]+)', questionController.searchId);
    /**
     * questionDelete API
     */
    questionRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.questionDelete), questionController.delete);
    return questionRouter;
}
exports.default = default_1;
//# sourceMappingURL=question.js.map