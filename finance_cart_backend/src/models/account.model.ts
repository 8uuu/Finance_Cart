import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany} from 'typeorm'
import { Honorary } from './honorary.mode';

@Entity('accounts')
export class Account extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  
  @Column()
  dni: string;

  @OneToMany(() => Honorary, honorary => honorary.account)
  honoraries: Honorary[];



}