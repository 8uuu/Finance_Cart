import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/users.routes';
import honoraryRoutes from './src/routes/honorary.routes';
import 'reflect-metadata';
import { dbConnection } from './src/database/databaseconfig';


class Server {
    private app: express.Application;
    private port: string;
    // private usuariosPath: string;
    private apiPaths = {
        usuarios:'/api/v1/users',
        honoraries:'/api/v1/honoraries'
    }

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8000';
        // this.usuariosPath = '/api/usuarios';

        // Conexion a base de datos
        this.conectarDB();

        //middlewares
        this.middlewares();

        // definir mis rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    public middlewares() {

        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use( express.static('public'));

    }

    public routes() {
        // this.app.use(this.authPath, require('./src/routes/users'));
        this.app.use(this.apiPaths.usuarios, userRoutes);
        this.app.use(this.apiPaths.honoraries, honoraryRoutes);
    }

    public listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto: '+ this.port);
        })
    }
}

export default Server;