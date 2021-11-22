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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_routes_1 = __importDefault(require("./src/routes/users.routes"));
const honorary_routes_1 = __importDefault(require("./src/routes/honorary.routes"));
require("reflect-metadata");
const databaseconfig_1 = require("./src/database/databaseconfig");
class Server {
    constructor() {
        // private usuariosPath: string;
        this.apiPaths = {
            usuarios: '/api/v1/users',
            honoraries: '/api/v1/honoraries'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        // this.usuariosPath = '/api/usuarios';
        // Conexion a base de datos
        this.conectarDB();
        //middlewares
        this.middlewares();
        // definir mis rutas
        this.routes();
    }
    conectarDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, databaseconfig_1.dbConnection)();
        });
    }
    middlewares() {
        // CORS
        this.app.use((0, cors_1.default)());
        // Lectura y parseo del body
        this.app.use(express_1.default.json());
        // Directorio publico
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        // this.app.use(this.authPath, require('./src/routes/users'));
        this.app.use(this.apiPaths.usuarios, users_routes_1.default);
        this.app.use(this.apiPaths.honoraries, honorary_routes_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto: ' + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=index.js.map