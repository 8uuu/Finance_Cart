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
exports.getHonorariesByUserId = exports.createHonorary = void 0;
const typeorm_1 = require("typeorm");
const honorary_mode_1 = require("../models/honorary.mode");
const createHonorary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fechaEmision, fechaPago, fechaDescuento, diasTranscurridos, totalRecibir, retencion, //retencion input
    diasxAnio, plazoTaza, tasaEfectiva, CyGI, CyGF, periodoCapital, tasaNominal, accountId, save, tasa } = req.body;
    const tasaEfectivaAnual = TEA(tasaEfectiva, diasxAnio, plazoTaza, periodoCapital, tasaNominal, tasa);
    // 2 = diastranscurridos
    const tasaEfectivaXdias = TasaEfectiva(tasaEfectivaAnual, diasTranscurridos, diasxAnio);
    const tasaDescontada = TasaDescontada(tasaEfectivaXdias);
    const descuentoTotal = Descuentototal(totalRecibir, tasaDescontada);
    const retencionRt = RetencionCal(totalRecibir, retencion);
    const valorNeto = ValorNeto(totalRecibir, descuentoTotal);
    const valorTotalRecibirVR = ValorTotalRecibirVR(valorNeto, retencion, CyGI);
    const valorTotalEntregarVE = valorTotalEntregar(totalRecibir, retencion, CyGF);
    const tasaCosteEfectivaAnual = TCostoEAnual(valorTotalEntregarVE, valorTotalRecibirVR, diasxAnio, diasTranscurridos);
    //guardar BD
    if (save === 1) {
        const newHonorary = (0, typeorm_1.getRepository)(honorary_mode_1.Honorary).create({
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
        const results = yield (0, typeorm_1.getRepository)(honorary_mode_1.Honorary).save(newHonorary);
        return res.json({
            ok: true,
            body: results,
        });
    }
    else {
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
                tasaCosteEfectivaAnual,
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
});
exports.createHonorary = createHonorary;
const getHonorariesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const honoraries = await getRepository(Honorary).find();
        const { accountId } = req.body;
        const honoraries = yield (0, typeorm_1.getRepository)(honorary_mode_1.Honorary)
            .createQueryBuilder("honoraries")
            .where("honoraries.accountId = :accountId ", { accountId: accountId })
            .getMany();
        return res.json({
            ok: true,
            body: honoraries,
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            body: "Contactese con el administrador",
        });
    }
});
exports.getHonorariesByUserId = getHonorariesByUserId;
const aprox2digit = (result) => {
    return Math.round(result * 100) / 100;
};
const TEA = (tasaEfectiva, diasxAnio, plazoTasa, periodoCapital, tasaNominal, tasa) => {
    let result = 0;
    if (tasa == "Efectiva") {
        result =
            (Math.pow(1.0 + (tasaEfectiva * 1.0) / 100.0, ((diasxAnio * 1.0) / plazoTasa) * 1.0) -
                1.0) *
                100.0;
    }
    else {
        if (tasa == "Nominal") {
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
const TasaEfectiva = (tea, diastrans, diasxAnio) => {
    let result = (Math.pow(1.0 + (tea * 1.0) / 100.0, (diastrans * 1.0) / (diasxAnio * 1.0)) -
        1.0) *
        100.0;
    return result.toFixed(7);
};
const TasaDescontada = (tasaefectivaXdias) => {
    let result = ((tasaefectivaXdias * 1.0) /
        100.0 /
        (1 + (tasaefectivaXdias * 1.0) / 100.0)) *
        100.0;
    return result.toFixed(7);
};
const Descuentototal = (tRecibir, tasaDescontada) => {
    let result = tRecibir * ((tasaDescontada * 1.0) / 100.0);
    return result.toFixed(2);
};
const ValorNeto = (tRecibir, Descuento) => {
    let result = tRecibir - Descuento;
    return result.toFixed(2);
};
const RetencionCal = (tRecibir, retencionInput) => {
    let temp = retencionInput;
    if (tRecibir > 1500) {
        temp = tRecibir * 1.0 * 0.08;
    }
    else {
        temp = 0.0;
    }
    return temp;
};
const ValorTotalRecibirVR = (vNeto, retencion, CyGI) => {
    let result = vNeto - retencion;
    result = result - CyGI; //menos costos y gastos iniciales
    const vRecibir = aprox2digit(result);
    return vRecibir.toFixed(2);
};
const valorTotalEntregar = (tRecibir, retencion, CyGF) => {
    const result = tRecibir - retencion;
    let vEntregar = aprox2digit(Number(result) + Number(CyGF));
    return vEntregar.toFixed(2);
};
const TCostoEAnual = (vEntregar, vRecibir, diasxAnio, diastrans) => {
    let result = (Math.pow(((vEntregar * 1.0) / vRecibir) * 1.0, (diasxAnio * 1.0) / (diastrans * 1.0)) -
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
//# sourceMappingURL=honorary.controller.js.map