import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Account } from "../models/account.model";
import { Honorary } from "../models/honorary.mode";

export const createHonorary = async (req: Request, res: Response) => {
  const {
    fechaEmision,
    fechaPago,
    fechaDescuento,
    diasTranscurridos,
    totalRecibir,
    retencion, //retencion input
    diasxAnio,
    plazoTaza,
    tasaEfectiva,
    CyGI,
    CyGF,
    periodoCapital,
    tasaNominal,
    accountId,
    save,
    tasa
  } = req.body;

  const tasaEfectivaAnual = TEA(
    tasaEfectiva,
    diasxAnio,
    plazoTaza,
    periodoCapital,
    tasaNominal,
    tasa
  );
  // 2 = diastranscurridos
  const tasaEfectivaXdias = TasaEfectiva(
    tasaEfectivaAnual,
    diasTranscurridos,
    diasxAnio
  );

  const tasaDescontada = TasaDescontada(tasaEfectivaXdias);

  const descuentoTotal = Descuentototal(totalRecibir, tasaDescontada);

  const retencionRt = RetencionCal(totalRecibir, retencion);

  const valorNeto = ValorNeto(totalRecibir, descuentoTotal);

  const valorTotalRecibirVR = ValorTotalRecibirVR(valorNeto, retencion, CyGI);

  const valorTotalEntregarVE = valorTotalEntregar(
    totalRecibir,
    retencion,
    CyGF
  );

  const tasaCosteEfectivaAnual = TCostoEAnual(
    valorTotalEntregarVE,
    valorTotalRecibirVR,
    diasxAnio,
    diasTranscurridos
  );

  //guardar BD
  if (save === 1) {
    const newHonorary = getRepository(Honorary).create({
      tasaEfectivaAnual,
      diasTranscurridos: diasTranscurridos.toFixed(),
      tasaEfectivaXdias,
      tasaDescontada,
      descuentoTotal,
      retencionRt: retencionRt.toFixed(),
      valorNeto,
      valorTotalRecibirVR,
      valorTotalEntregarVE,
      tasaCosteEfectivaAnual,
      retencionInput: retencion,
      fechaEmision,
      fechaPago,
      fechaDescuento,
      CyGI: CyGI.toFixed(),
      CyGF: CyGF.toFixed(),
      account: accountId,
    });

    const results = await getRepository(Honorary).save(newHonorary);

    return res.json({
      ok: true,
      body: results,
    });
  } else {
    return res.json({
      ok: true,
      body: {
        tasaEfectivaAnual,
        diasTranscurridos: diasTranscurridos.toFixed(),
        tasaEfectivaXdias,
        tasaDescontada,
        descuentoTotal,
        retencionRt: retencionRt.toFixed(),
        valorNeto,
        valorTotalRecibirVR,
        valorTotalEntregarVE,
        tasaCosteEfectivaAnual ,
        retencionInput: retencion,
        fechaEmision,
        fechaPago,
        fechaDescuento,
        CyGI: CyGI.toFixed(),
        CyGF: CyGF.toFixed(),
        account: accountId,
      },
    });
  }
};

export const getHonorariesByUserId = async (req: Request, res: Response) => {
  try {
    // const honoraries = await getRepository(Honorary).find();
    const { accountId } = req.body;
    const honoraries = await getRepository(Honorary)
      .createQueryBuilder("honoraries")
      .where("honoraries.accountId = :accountId ", { accountId: accountId })
      .getMany();
    return res.json({
      ok: true,
      body: honoraries,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      body: "Contactese con el administrador",
    });
  }
};

const aprox2digit = (result: any) => {
  return Math.round(result * 100) / 100;
};

const TEA = (
  tasaEfectiva: any,
  diasxAnio: any,
  plazoTasa: any,
  periodoCapital: any,
  tasaNominal: any,
  tasa:any
) => {
  let result = 0;
  if ( tasa == "Efectiva") {
    result =
      (Math.pow(
        1.0 + (tasaEfectiva * 1.0) / 100.0,
        ((diasxAnio * 1.0) / plazoTasa) * 1.0
      ) -
        1.0) *
      100.0;
  } else {
    if(tasa == "Nominal"){
      let m = (plazoTasa * 1.0) / (periodoCapital * 1.0);
      let n = (diasxAnio * 1.0) / (periodoCapital * 1.0);
      result = (Math.pow(1.0 + (tasaNominal * 1.0) / 100.0 / m, n) - 1.0) * 100.0;
    }
  }
  // const tea = aprox7digit(result);
  const tea = result.toFixed(7);

  return tea;
};

/*----------------------*/
const TasaEfectiva = (tea: any, diastrans: any, diasxAnio: any) => {
  let result =
    (Math.pow(
      1.0 + (tea * 1.0) / 100.0,
      (diastrans * 1.0) / (diasxAnio * 1.0)
    ) -
      1.0) *
    100.0;
  return result.toFixed(7);
};

const TasaDescontada = (tasaefectivaXdias: any) => {
  let result =
    ((tasaefectivaXdias * 1.0) /
      100.0 /
      (1 + (tasaefectivaXdias * 1.0) / 100.0)) *
    100.0;
  return result.toFixed(7);
};
const Descuentototal = (tRecibir: any, tasaDescontada: any) => {
  let result = tRecibir * ((tasaDescontada * 1.0) / 100.0);
  return result.toFixed(2);
};
const ValorNeto = (tRecibir: any, Descuento: any) => {
  let result = tRecibir - Descuento;
  return result.toFixed(2);
};
const RetencionCal = (tRecibir: any, retencionInput: any) => {
  let temp = retencionInput;
  if (tRecibir > 1500) {
    temp = tRecibir * 1.0 * 0.08;
  } else {
    temp = 0.0;
  }
  return temp;
};

const ValorTotalRecibirVR = (vNeto: any, retencion: any, CyGI: any) => {
  let result = vNeto - retencion;
  result = result - CyGI; //menos costos y gastos iniciales
  const vRecibir = aprox2digit(result);
  return vRecibir.toFixed(2);
};

const valorTotalEntregar = (
  tRecibir: number,
  retencion: number,
  CyGF: number
) => {
  const result: number = tRecibir - retencion;
  let vEntregar = aprox2digit(Number(result) + Number(CyGF));
  return vEntregar.toFixed(2);
};

const TCostoEAnual = (
  vEntregar: any,
  vRecibir: any,
  diasxAnio: any,
  diastrans: any
) => {
  let result =
    (Math.pow(
      ((vEntregar * 1.0) / vRecibir) * 1.0,
      (diasxAnio * 1.0) / (diastrans * 1.0)
    ) -
      1.0) *
      100.0;
  return result.toFixed(7);
  /* 
  let result =
    (Math.pow(
      ((vEntregar * 1.0) / vRecibir) * 1.0,
      (diasxAnio * 1.0) / (diastrans * 1.0)
    ) -
      1.0) /
      100000000000;
  return result.toFixed(7); */
};
