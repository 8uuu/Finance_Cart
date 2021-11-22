import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Account } from "./account.model";

@Entity("honoraries")
export class Honorary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tasaEfectivaAnual: string;

  @Column()
  diasTranscurridos: string;

  @Column()
  tasaEfectivaXdias: string;

  @Column()
  tasaDescontada: string;

  @Column()
  descuentoTotal: string;

  @Column()
  retencionRt: string;

  @Column()
  retencionInput: string;

  @Column()
  valorNeto: string;

  @Column()
  valorTotalRecibirVR: string;

  @Column()
  valorTotalEntregarVE: string;

  @Column()
  tasaCosteEfectivaAnual: string;

  @Column()
  fechaEmision: string;

  @Column()
  fechaPago: string;
  
  @Column()
  fechaDescuento: string;
  
  @Column()
  CyGI: string;
  
  @Column()
  CyGF: string;
  


  @ManyToOne(() => Account, (account) => account.honoraries)
  account: Account;
}
