import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RecibosService } from '../services/recibos.service';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment' 

// Capacitor v2
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  anios:Array<string>
  recibos:Array<any>
  defaultDate = new Date();
  mydate:any 
  slidesOptions = {
    slidesPerView: 1.5
  }
  constructor(private recibosServices: RecibosService,private alertController: AlertController,private router: Router) {}
  ngOnInit(): void {
    this.getRecibos()
  }
 
  getRecibos(){
    const fecha= moment(this.mydate).format('MM-YYYY')
    console.log(fecha)
    this.recibosServices.getRecibosEmpleado(fecha).subscribe(
      res => {
        this.recibos = res.recibos
        console.log(this.recibos)
      } 
    )
  }

  openPDF(url:string){
    //./modules/recibos/client/output/0c3e2a9a-d1b8-46cf-860a-f2c786a929f2.pdf
   const arrayUrl =  url.split('./')
    Browser.open({ url: `http://e07c-201-190-175-17.ngrok.io/${arrayUrl[1]}`});
  }


  async presentAlert(recibo:any) {
    const alert = await this.alertController.create({
      header: 'Porfavor ingrese su pin',
      buttons: [
        {
          text: 'Ok',
          handler: (alertData) => {
              console.log(alertData.pin);
              const data = {
                recibos: [recibo],
                empleador: false,
                motivo: "EN CONFORMIDAD",
                certPassword: alertData.pin,
                fecha: new Date().toString()
            };
            this.recibosServices.firmar(data).subscribe(
              async (res) => {
               const alert = await this.alertController.create({
                  header: 'Recibo Firmado',
                  buttons: [
                    {
                      text: 'Ok',
                      handler: (alertData) => {
                        this.getRecibos()
                      }
                    }
                  ]
                })
                await alert.present()
              },
              (err) => {
                console.log(err)
              }
            )
          }
        },
        {
          text: 'cancelar',
        }
    
    ],
      inputs: [
        {
          name:'pin',
          placeholder: 'pin',
        },

      ],
      
    });

    await alert.present();
    
  }
  navigate(){
    this.getRecibos()

  }
}
