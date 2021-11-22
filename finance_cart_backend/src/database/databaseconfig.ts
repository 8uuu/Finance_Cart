import { createConnection } from 'typeorm';

export const dbConnection = async() => {
    try{
        await createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "admin",
            database: "finanzas",
            entities:["dist/src/models/**/*.js"],
            synchronize: true
            // entities:["dist/src/models/**/*.js"],
            // sysnchronize:true
        });
        console.log('BD connectada°°');
        
    } catch (err) {
        console.log('err dbConnection: ',err);
        throw new Error('Error a la hora de iniciar la BD')
        
    }
}