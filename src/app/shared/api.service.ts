import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { RestaurentData } from '../restaurent-dash/restaurent.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService 
{
  [x: string]: any;
  
  addRestaurent(restaurentModelObj: RestaurentData) 
  {
    throw new Error('Method not implemented.');
  }

  constructor(private _http: HttpClient) { }

  //POST request
  postRestaurent(data:any ) 
  {
    return this._http.post<any>("http://localhost:5200/postData", data).pipe(map((res:any)=>{
      return res;
    }))
  }

  //GET request
  getRestaurent() 
  {
    return this._http.get<any>("http://localhost:5200/getData").pipe(map((res:any)=>{
      return res;
    }));
  }

  //delete request
  deleteRestaurant(id:number) 
  {
    return this._http.delete<any>("http://localhost:5200/deleteData/"+id).pipe(map((res:any)=>{
      return res;
    }));
  }
  


  //update request
  // updateRestaurant(id: number, data: any) 
  // {
  //   return this._http.put<any>("http://localhost:5200/updateData/"+id,data).pipe(map((res:any)=>{
  //     return res;
  //   }));
  // }

  updateRestaurant(id: number, data: any) {
    return this._http.put<any>(`http://localhost:5200/updateData/${id.toString()}`, data).pipe(
        map((res: any) => {
            return res;
        })
    );
}



  // signUpUser(data:any) 
  // {
  //   return this._http.post<any>("http://localhost:5200/postUserData", data).pipe(map((res:any)=>{
  //     return res;
  //   }))
  // }
}
