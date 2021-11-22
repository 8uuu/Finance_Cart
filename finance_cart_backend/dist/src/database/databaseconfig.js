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
exports.dbConnection = void 0;
const typeorm_1 = require("typeorm");
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, typeorm_1.createConnection)({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "admin",
            database: "finanzas",
            entities: ["dist/src/models/**/*.js"],
            synchronize: true
            // entities:["dist/src/models/**/*.js"],
            // sysnchronize:true
        });
        console.log('BD connectada°°');
    }
    catch (err) {
        console.log('err dbConnection: ', err);
        throw new Error('Error a la hora de iniciar la BD');
    }
});
exports.dbConnection = dbConnection;
//# sourceMappingURL=databaseconfig.js.map