import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FacturaService } from '../../../services/factura.service';
import { IDocumentResponse } from '../../../interface/document.interface';
import { Router } from '@angular/router';
import { IAppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.scss'],
})
export class ViewDataComponent implements OnInit {
  sortedData: any[] = [
  ];
  public selectedTasa: string = 'Efectiva';

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataModel: any,
    private facturaService: FacturaService,
    private router:Router,
    private store: Store<IAppState>,
  ) {}

  ngOnInit(): void {
    this.sortedData = this.dataModel;
    console.log('dataModel: ', this.dataModel);

    this.store.select('person').subscribe( resp => {
      this.selectedTasa = resp.setSelectedTasa!;
    })

  }

  public openDialogSave() {
    Swal.fire({
      title: '¿Quieres registrar la operación?',
      text: 'Los calculos mostrados se guardarán en el listado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, quiero registrarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Esta operación se ha guardado exitosamente!',
          'Podrás visualizarlo en la vista principal',
          'success'
        ).then(() => {
          this.facturaService
          .createFactura({
            fechaEmision: this.dataModel.dataRequest.fechaEmision,
            fechaPago: this.dataModel.dataRequest.fechaPago,
            diasTranscurridos: this.dataModel.dataRequest.diasTranscurridos,
            fechaDescuento: this.dataModel.dataRequest.fechaDescuento,
            totalRecibir: this.dataModel.dataRequest.totalRecibir,
            retencion: this.dataModel.dataRequest.retencion,
            diasxAnio: this.dataModel.dataRequest.diasxAnio,
            plazoTaza: this.dataModel.dataRequest.plazoTaza,
            tasaEfectiva: this.dataModel.dataRequest.tasaEfectiva,
            CyGI: this.dataModel.dataRequest.CyGI,
            CyGF: this.dataModel.dataRequest.CyGF,
            periodoCapital: this.dataModel.dataRequest.periodoCapital,
            tasaNominal: this.dataModel.dataRequest.tasaNominal,
            save: 1,
            accountId: this.dataModel.dataRequest.accountId,
            tasa:  this.selectedTasa
          })
          .subscribe((resp: IDocumentResponse) => {
            console.log('[[resp SAVE]]::', resp);

            // this.router.navigate(['personProfiles']);

          });
        });
      }
    });
  }
}
