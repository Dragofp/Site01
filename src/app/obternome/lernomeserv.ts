import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class Lernomes {
  private endpointurl='http://localhost:3000/api/lerinfo'


  constructor(private http: HttpClient) { }

  obterNome() {
    return this.http.get(this.endpointurl);
  }

}
