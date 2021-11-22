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
exports.createUsuario = exports.getUsuarios = void 0;
const typeorm_1 = require("typeorm");
const account_model_1 = require("../models/account.model");
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, typeorm_1.getRepository)(account_model_1.Account).find();
    const { fechaEmision, fechaPago, totalRecibir, retencion, diasxAnio, plazoTaza, tasaEfectiva, fechaDescuento, CyGI, resta, periodoCapital, tasaNominal } = req.body;
    const tasaEfectivaAnual = TEA(tasaEfectiva, diasxAnio, plazoTaza, periodoCapital, tasaNominal);
    // 2 = diastranscurridos
    const tasaEfectivaXdias = TasaEfectiva(tasaEfectivaAnual, 2, diasxAnio);
    const tasaDescontada = TasaDescontada(tasaEfectivaXdias);
    const descuentoTotal = Descuentototal(totalRecibir, tasaDescontada);
    const retencionRt = RetencionCal(totalRecibir, retencion);
    const valorNeto = ValorNeto(totalRecibir, descuentoTotal);
    const valorTotalRecibirVR = ValorTotalRecibirVR(valorNeto, retencion, CyGI);
    const valorTotalEntregarVE = valorTotalEntregar(totalRecibir, retencion, resta);
    const tasaCosteEfectivaAnual = TCostoEAnual(valorTotalEntregarVE, valorTotalRecibirVR, diasxAnio, 2);
    const diastrans = Diastrans(fechaPago, fechaEmision);
    return res.json({
        msg: 'resultado',
        tasa_efectiva_anual: tasaEfectivaAnual,
        tasa_efectiva: tasaEfectivaXdias,
        tasa_descontada: tasaDescontada,
        descuento_total: descuentoTotal,
        retencionRt: retencionRt,
        valor_neto: valorNeto,
        valor_total_recibir_vr: valorTotalRecibirVR,
        valor_total_entregar_ve: valorTotalEntregarVE,
        tcea: tasaCosteEfectivaAnual,
        dias_trans: diastrans
    });
});
exports.getUsuarios = getUsuarios;
const createUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({
        body: req.body
    });
});
exports.createUsuario = createUsuario;
const aprox7digit = (result) => {
    return Math.round(result * 10000000) / 10000000;
};
const aprox2digit = (result) => {
    return Math.round(result * 100) / 100;
};
const TEA = (tasaEfectiva, diasxAnio, plazoTasa, periodoCapital, tasaNominal) => {
    let result = 0;
    if (tasaEfectiva != null) {
        result = (Math.pow(1.00 + (tasaEfectiva * 1.0 / 100.0), diasxAnio * 1.0 / plazoTasa * 1.0) - 1.00) * 100.0;
    }
    else {
        let m = plazoTasa * 1.0 / (periodoCapital * 1.0);
        let n = diasxAnio * 1.0 / (periodoCapital * 1.0);
        result = (Math.pow(1.00 + ((tasaNominal * 1.0 / 100.0) / m), n) - 1.00) * 100.0;
    }
    const tea = aprox7digit(result);
    return tea;
};
const Diastrans = (fechaPago, fechaDescuento) => {
    return ((fechaPago.getTime() - fechaDescuento.getTime()) / 86400000);
};
/*------------------------*/
const FpagoMenosFemision = (fechaPago, fechaEmision) => {
    let dias = ((fechaPago.getTime() - fechaEmision.getTime()) / 86400000);
    return dias;
};
const FepagoMenosFDescuento = (fechaPago, fechaEmision) => {
    let dias = ((fechaPago.getTime() - fechaEmision.getTime()) / 86400000);
    return dias;
};
/*----------------------*/
const TasaEfectiva = (tea, diastrans, diasxAnio) => {
    let result = (Math.pow((1.00 + (tea * 1.0 / 100.0)), diastrans * 1.0 / (diasxAnio * 1.0)) - 1.00) * 100.0;
    // let tasaefectivaXdias=aprox7digit(result);
    return result;
};
const TasaDescontada = (tasaefectivaXdias) => {
    let result = ((tasaefectivaXdias * 1.0 / 100.0) / (1 + (tasaefectivaXdias * 1.0 / 100.0))) * 100.0;
    return result;
};
const Descuentototal = (tRecibir, tasaDescontada) => {
    let result = tRecibir * (tasaDescontada * 1.0 / 100.0);
    return result;
};
const ValorNeto = (tRecibir, Descuento) => {
    let result = tRecibir - Descuento;
    // vNeto=aprox2digit(result);
    return result;
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
    return vRecibir;
};
const valorTotalEntregar = (tRecibir, retencion, CyGFee) => {
    const result = tRecibir - retencion;
    let vEntregar = aprox2digit(Number(result) + Number(CyGFee));
    return vEntregar;
};
const TCostoEAnual = (vEntregar, vRecibir, diasxAnio, diastrans) => {
    const result = (Math.pow(vEntregar * 1.0 / vRecibir * 1.0, diasxAnio * 1.0 / (diastrans * 1.0)) - 1.00) * 100.0;
    const TCEA = aprox7digit(result);
    return TCEA;
};
//# sourceMappingURL=users.controller.js.map