import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Account } from '../models/account.model';

export const createAccounts = async(req: Request, res: Response): Promise<Response> => {

    // const users = await getRepository(Account).find();
    const newUser = getRepository(Account).create(req.body);
    const results = await getRepository(Account).save(newUser);
    return res.json({
     ok:true,
     body: results   
    })
}

export const getAccountLogin = async(req: Request, res: Response) => {

    try {
        const {email, password}=req.body;
        const results = await getRepository(Account).createQueryBuilder("accounts").where("accounts.email = :email and accounts.password = :password", {email:email, password:password}).getOne();

        if(!results){
            return res.status(400).json({
                ok:false,
                body:'Usuario / Password no son correctas'
            })
        }

        return res.json({
            ok:true,
            body: results   
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            body:'Contactese con el administrador'
        })
    }
}

