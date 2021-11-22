"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const honorary_controller_1 = require("../controllers/honorary.controller");
const router = (0, express_1.Router)();
router.post('/', honorary_controller_1.createHonorary);
router.post('/honorariesByAccountId', honorary_controller_1.getHonorariesByUserId);
exports.default = router;
//# sourceMappingURL=honorary.routes.js.map