import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecibosService {

  constructor(
    private http:HttpClient
  ) { }

  getRecibosEmpleado(periodo:string):Observable<any>{
   return this.http.get(`http://e07c-201-190-175-17.ngrok.io/api/recibosByEmpleado/${periodo}`)
  }

  firmar(pdfs:any):Observable<any>{
    return this.http.post(`http://e07c-201-190-175-17.ngrok.io/api/signPDFService`,pdfs)
  }
}
