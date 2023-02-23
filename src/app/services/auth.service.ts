import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, filter, from, map, Observable, of, switchMap, take } from 'rxjs';
const helper = new JwtHelperService()
const TOKEN_KEY = 'access'
export interface resLogin {
  tokens:any,
  user:any
}
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  public user:Observable<any>;
  private userData = new BehaviorSubject(null)
  private _storage: Storage ;
  private storageRady = new BehaviorSubject(false)
  constructor( private storage:Storage, private http:HttpClient,
    private plt : Platform, private router:Router) { 
      this.loadStoredToken()
      this.init()
    }
  ngOnInit(): void {
    
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;  
    this.storageRady.next(true)
  }

    loadStoredToken() {
      this.user = this.storageRady.pipe(
        filter( ready => ready),
        switchMap(async () =>{
            const token = await this._storage.get(TOKEN_KEY)
            if(token){
              let decoded = helper.decodeToken(token.toString());
              this.userData.next(decoded);
              return true
            }else{
              return false
            }
        }
        ),
      );
    }

    getToken():Observable<any>{
      
      return from( this._storage.get(TOKEN_KEY))
    }


    login(credentials: {email: string, password: string }) {
      // Normally make a POST request to your APi with your login credentials

  
      return this.http.post<resLogin>('http://e07c-201-190-175-17.ngrok.io/api/auth/new/jwt/signin',credentials).pipe(
        take(1),
        map(res=> {
         return res
        }),
        switchMap(async token => {
          debugger
          let decoded = helper.decodeToken(token.tokens.access.token);
          this.userData.next(token.user);
          let storageObs = await this._storage.set(TOKEN_KEY, token.tokens.access.token);
          return storageObs;
        })
      );
    }
  
    getUser() {
      return this.userData.getValue();
    }
  
    logout() {
      this._storage?.remove(TOKEN_KEY).then(() => {
        this.router.navigateByUrl('/');
        this.userData.next(null);
      });
    }
}


