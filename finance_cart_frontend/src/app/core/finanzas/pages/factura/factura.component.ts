import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FacturaService } from '../../services/factura.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewDataComponent } from '../../components/dialog/view-data/view-data.component';
import { IDocumentResponse, IBody } from '../../interface/document.interface';
import { IAppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent implements OnInit {
  public form!: FormGroup;
  dataSourceLeft!: MatTableDataSource<any>;
  dataSourceRight!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorLeft!: MatPaginator;
  @ViewChild(MatPaginator) paginatorRight!: MatPaginator;

  @Input() title1:any = "Fecha de Emisión";
  @Input() title2:any = "Fecha de Pago";
  @Input() title3:any = "Total Facturado";

  public selectedTasa: string = 'Efectiva';

  public selectedDiasxAnio: number = 360;
  public selectedPlazoDeTasa: number = 7;
  public selectedPeriodoCapital: number = 7;
  public selectedMotivoCyGIniciales: any = 'Portes';
  public selectedMotivoCyGFinales: any = 'Portes';
  public selectedEfectivoOPorcentaje: number = 0;
  public sumaTotalCostosIniciales: number = 0;
  public sumaTotalCostosFinales: number = 0;

  displayedColumnsLeft: string[] = ['name', 'valor'];
  displayedColumnsRight: string[] = ['name', 'valor'];

  public listDiasxAnio: any[] = [
    { id: 365, name: '365 dias' },
    { id: 360, name: '360 dias' },
  ];
  public listPlazoDeTasa: any[] = [
    { id: 0, name: 'Diario', valor: 1 },
    { id: 1, name: 'Quincenal', valor: 15 },
    { id: 2, name: 'Mensual', valor: 30 },
    { id: 3, name: 'Bimestral', valor: 60 },
    { id: 4, name: 'Trimestral', valor: 90 },
    { id: 5, name: 'Cuatrimestral', valor: 120 },
    { id: 6, name: 'Semestral', valor: 180 },
    { id: 7, name: 'Anual', valor: 360 },
    { id: 8, name: 'Especial', valor: 0 },
  ];

  public listMotivosCyCI: any[] = [
    { id: 0, name: 'Portes' },
    { id: 1, name: 'Fotocopias' },
    { id: 2, name: 'Comisión de estudio' },
    { id: 3, name: 'Comisión de desembolso' },
    { id: 4, name: 'Comisión de intermediación' },
    { id: 5, name: 'Gastos de administración' },
    { id: 6, name: 'Gastos notariales' },
    { id: 7, name: 'Seguro' },
    { id: 8, name: 'Otros gastos' },
  ];

  public listValorExpresado: any[] = [
    { id: 0, name: 'En Efectivo' },
    { id: 1, name: 'En Porcentaje' },
  ];

  public listPeriodoCapital: any[] = [
    { id: 0, name: 'Diario', valor: 1 },
    { id: 1, name: 'Quincenal', valor: 15 },
    { id: 2, name: 'Mensual', valor: 30 },
    { id: 3, name: 'Bimestral', valor: 60 },
    { id: 4, name: 'Trimestral', valor: 90 },
    { id: 5, name: 'Cuatrimestral', valor: 120 },
    { id: 6, name: 'Semestral', valor: 180 },
    { id: 7, name: 'Anual', valor: 360 },
    { id: 8, name: 'Especial', valor: 0 },
  ];

  public listCostesyGastosIniciales: any[] = [];
  public listCostesyGastosFinales: any[] = [];
  public accountId:number = Number(localStorage.getItem('id'));

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    public dialog: MatDialog,
    private store: Store<IAppState>,
  ) {}

  ngOnInit(): void {
    this.store.select('person').subscribe( resp => {
      this.selectedTasa = resp.setSelectedTasa!;
    })

    this.form = this.fb.group({
      email: [''],
      fecha: [''],
      fechaDeEmision: [new Date()],
      fechaDePago: [''],
      totalFacturado: [''],
      retencion: [''],
      //selectores
      diasXanio: [''],
      plazoDeTasa: [
        {
          value: this.listPlazoDeTasa[this.selectedPlazoDeTasa].valor,
          disabled: true,
        },
      ],
      //
      tasaEfectiva: [''],
      fechaDescuento: [''],

      //CyGI
      cygI: [''],
      valorTemp1: [''],
      valorTemp2: [''],

      //nominal
      tasaNominal: [''],
      periodoCapital: [{
        value: this.listPeriodoCapital[this.selectedPeriodoCapital].valor,
        disabled: true,
      },],
      tasa:['']
    });
  }

  public selectOpt(opt: any) {}

  public selectPlazoTasa(opt: any) {
    const listId: number = opt.source.value;
    if (listId === 8) {
      this.form.controls['plazoDeTasa'].setValue(
        this.listPlazoDeTasa[listId].valor
      );
      this.form.controls['plazoDeTasa'].enable();
    } else {
      this.form.controls['plazoDeTasa'].disable();
      this.form.controls['plazoDeTasa'].setValue(
        this.listPlazoDeTasa[listId].valor
      );
    }
  }

  public selectPeriodoCapital(opt: any) {
    const listId: number = opt.source.value;
    if (listId === 8) {
      this.form.controls['periodoCapital'].setValue(
        this.listPeriodoCapital[listId].valor
      );
      this.form.controls['periodoCapital'].enable();
    } else {
      this.form.controls['periodoCapital'].disable();
      this.form.controls['periodoCapital'].setValue(
        this.listPeriodoCapital[listId].valor
      );
    }
  }

  public selectCyGI(opt: any) {
    console.log('selectCyGI: ',opt.value);
    
  }

  /* Table */
  public crearTablaLeft(data: any) {
    this.dataSourceLeft = new MatTableDataSource(data);
    this.dataSourceLeft.paginator = this.paginatorLeft;
  }

  public crearTablaRight(data: any) {
    this.dataSourceRight = new MatTableDataSource(data);
    this.dataSourceRight.paginator = this.paginatorRight;
  }

  public agregarCostosIniciales() {
    this.listCostesyGastosIniciales.push({
      name: this.selectedMotivoCyGIniciales,
      valor: this.form.value.valorTemp1,
    });

    this.form.controls['valorTemp1'].setValue('0');
    this.crearTablaLeft(this.listCostesyGastosIniciales);
  }

  public agregarCostosFinales() {
    this.listCostesyGastosFinales.push({
      name: this.selectedMotivoCyGFinales,
      valor: this.form.value.valorTemp2,
    });

    this.form.controls['valorTemp2'].setValue('0');

    this.crearTablaRight(this.listCostesyGastosFinales);
  }

  public submit() {
    //  this.openDialog();

    console.log('submit');

    // let sumaTotalGastosIniciales = 0;
    // let sumatTotalGastosFinales = 0;
    this.sumaTotalCostosIniciales = 0;
    this.sumaTotalCostosFinales = 0;

    if (this.listCostesyGastosIniciales.length !== 0) {
      this.listCostesyGastosIniciales.map((item) => {
        this.sumaTotalCostosIniciales += Number(item.valor);
      });
    }

    if (this.listCostesyGastosFinales.length !== 0) {
      this.listCostesyGastosFinales.map((item) => {
        this.sumaTotalCostosFinales += Number(item.valor);
      });
    }

    const fechaDePagoFormat = moment(this.form.value.fechaDePago).format(
      'YYYY-MM-DD'
    );
    const fechaDeEmisionFormat = moment(this.form.value.fechaDeEmision).format(
      'YYYY-MM-DD'
    );
    const fechaDeDescuentoFormat = moment(
      this.form.value.fechaDescuento
    ).format('YYYY-MM-DD');

    const fechaDePagoFormat22 = moment(fechaDePagoFormat + '');
    const fechaDeEmisionFormat11 = moment(fechaDeEmisionFormat + '');
    const fechaDeDescuentoFormat33 = moment(fechaDeDescuentoFormat + '');

    const diasTrancurrido = Math.abs(
      fechaDeDescuentoFormat33.diff(fechaDePagoFormat22, 'days')
    );

    this.facturaService
      .createFactura({
        fechaEmision: fechaDeEmisionFormat,
        fechaPago: fechaDePagoFormat,
        diasTranscurridos: diasTrancurrido,
        totalRecibir: this.form.value.totalFacturado,
        retencion: this.form.value.retencion.toString(),
        diasxAnio: this.selectedDiasxAnio,
        plazoTaza: this.form.controls['plazoDeTasa'].value,
        tasaEfectiva: this.form.value.tasaEfectiva,
        fechaDescuento: fechaDeDescuentoFormat,
        CyGI: this.sumaTotalCostosIniciales,
        CyGF: this.sumaTotalCostosFinales,
        periodoCapital: this.form.controls['periodoCapital'].value,
        tasaNominal: this.form.controls['tasaNominal'].value,
        save: 0,
        accountId: this.accountId,
        tasa:  this.selectedTasa
        // tasa: localStorage.getItem('selectedTasa')
      })
      .subscribe((resp: IDocumentResponse) => {
        console.log('[[resp]]::', resp);
        this.openDialog(resp.body, {
          fechaEmision: fechaDeEmisionFormat,
          fechaPago: fechaDePagoFormat,
          diasTranscurridos: diasTrancurrido,
          totalRecibir: this.form.value.totalFacturado,
          retencion: this.form.value.retencion,
          diasxAnio: this.selectedDiasxAnio,
          plazoTaza: this.form.controls['plazoDeTasa'].value,
          tasaEfectiva: this.form.value.tasaEfectiva,
          fechaDescuento: fechaDeDescuentoFormat,
          CyGI: this.sumaTotalCostosIniciales,
          CyGF: this.sumaTotalCostosFinales,
          periodoCapital: this.form.controls['periodoCapital'].value,
          tasaNominal: this.form.controls['tasaNominal'].value,
          save: 0,
          accountId: this.accountId,
          tasa:  this.selectedTasa
          // tasa: localStorage.getItem('selectedTasa')
        });
      });
  }

  public openDialog(dataResponse: IBody, dataRequest: any) {
    const dialogView = this.dialog.open(ViewDataComponent, {
      width: '900px',
      height: 'auto',
      data: {dataResponse, dataRequest},
    });
  }

  public fechaEmision(opt:any){
    console.log('fechaEmisionClick: ',opt);
    
  }
}
