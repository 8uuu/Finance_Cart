"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_controller_1 = require("../controllers/account.controller");
const router = (0, express_1.Router)();
// router.get('/', getUsuarios);
router.post('/', account_controller_1.createAccounts);
router.post('/login', account_controller_1.getAccountLogin);
exports.default = router;
//# sourceMappingURL=users.routes%20copy.js.map