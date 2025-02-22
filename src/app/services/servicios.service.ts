/**
 * se envia desde la pagina servicios (parametro servicio)
 * GET parametro: servicio , retorna  lista de {año,mes,dia,hora,minutos,trabajador,duracion}
 * 
 * 
 * se envia desde la pagina calendario para guardar la cita
 * POST {año,mes,dia,hora,minutos,servicio,trabajador,cliente}
 * 
 * Desde la pagina login se abre la pagina mis citas 
 * GET parametro: cliente, retorna lista de  {año,mes,dia,hora,minutos,servicio,duracion,trabajador}
 *
 * Hay que implementar las funciones bien y poner las llamadas en los componentes que las necesiten
 * */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';

 
import { Trabajador } from '../models/trabajador';
import { Categoria } from '../models/categoria';
import { Servicio } from '../models/servicio';
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private currentServicioSubject: BehaviorSubject<Servicio>;
  private port = 3000;
  private urlgetTrabajadoresServicio = 'http://localhost:' + this.port + '/api/get_trabajadores_servicio';
  private urlgetCategorias = 'http://localhost:' + this.port + '/api/get_categorias';
  private urlgetServicios = 'http://localhost:' + this.port + '/api/get_servicios';

  
  //TODO: revisar para modificar citas y anularlas
  //private urldelete = 'http://localhost:' + this.port + '/api/delete_product';
  // private urlput = 'http://localhost:' + this.port + '/api/put_product';
  constructor(private httpClient: HttpClient) {
    this.currentServicioSubject = new BehaviorSubject<Servicio>(JSON.parse(localStorage.getItem('servicio') || '{}'));
   }

  /**
   * lista de trabajadores que ralizan el servicio id_sevicio
   */
  getTrabajadoresServicio(id_servicio:string): Observable<Trabajador[]> {
    return this.httpClient.get<Trabajador[]>(this.urlgetTrabajadoresServicio + '/' + id_servicio).pipe(catchError(this.handleError<any>('getTrabajadoresServicio')));
  }
  getCategorias(): Observable<Categoria[]> {
    return this.httpClient.get<Categoria[]>(this.urlgetCategorias).pipe(catchError(this.handleError<any>('getCategorias')));
  }
  getServicios(id_categoria: string): Observable<Servicio[]> {
    return this.httpClient.get<Servicio[]>(this.urlgetServicios + '/' + id_categoria , { observe: 'body' }).pipe(catchError(this.handleError<any>('getServicios')));
  } 



  /**
 * FUNCIONES PARA Beahovirrrlll Subject servicio
 */
  public get nombre_servicio(): string {
    return this.currentServicioSubject.value.nombre;
  }
  public get duracion_servicio(): number {
    return this.currentServicioSubject.value.duracion;
  }
  public get currentServicioValue(): Servicio | undefined {
    const servicio = JSON.parse(localStorage.getItem('servicio')!);
    this.currentServicioSubject.next(servicio);
    if (this.currentServicioSubject !== null) {
      return this.currentServicioSubject.value;
    }
    return undefined;
  }
  cleanLS_Servicio(): void {
    localStorage.removeItem('servicio');
    this.currentServicioSubject.next({
      _id: '',
      nombre: '',
      duracion: 0,
      descripcion: '',
      precio: 0,
      categoria: '',
      foto: ''
    })
    //this.router.navigate(['']);
  }
  /**
   * 
   * @param servicio 
   */

  setLocalStorageServicio(servicio: Servicio): void {
    localStorage.setItem('servicio', JSON.stringify(servicio));
    this.currentServicioSubject.next(servicio);
  }
  private handleError<T>(operation = 'opearation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);// log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }
}
