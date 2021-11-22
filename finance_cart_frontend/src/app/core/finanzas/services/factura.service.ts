import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  IDocumentRequest,
  IDocumentResponse,
} from '../interface/document.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private url_base: string = environment.URI_BASE;

  constructor(private http: HttpClient, private router: Router) {}

  createFactura(form: any) {
    console.log('[request ingresado]:: ', form);
    return this.http.post<IDocumentResponse>(
      `${this.url_base}/honoraries`,
      form
    );
  }

  getFacturasByAccountId(accountId: any) {
    return this.http.post<IDocumentResponse>(`${this.url_base}/honoraries/honorariesByAccountId`, {
      accountId,
    });
  }
}
