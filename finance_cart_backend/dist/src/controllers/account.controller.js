"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountLogin = exports.createAccounts = void 0;
const typeorm_1 = require("typeorm");
const account_model_1 = require("../models/account.model");
const createAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const users = await getRepository(Account).find();
    const newUser = (0, typeorm_1.getRepository)(account_model_1.Account).create(req.body);
    const results = yield (0, typeorm_1.getRepository)(account_model_1.Account).save(newUser);
    return res.json({
        ok: true,
        body: results
    });
});
exports.createAccounts = createAccounts;
const getAccountLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const results = yield (0, typeorm_1.getRepository)(account_model_1.Account).createQueryBuilder("accounts").where("accounts.email = :email and accounts.password = :password", { email: email, password: password }).getOne();
        if (!results) {
            return res.status(400).json({
                ok: false,
                body: 'Usuario / Password no son correctas'
            });
        }
        return res.json({
            ok: true,
            body: results
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            body: 'Contactese con el administrador'
        });
    }
});
exports.getAccountLogin = getAccountLogin;
//# sourceMappingURL=account.controller.js.map