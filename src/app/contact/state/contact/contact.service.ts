import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ContactDto} from "./contact.model";

@Injectable({providedIn: 'root'})
export class ContactService {

  private http = inject(HttpClient);
  private readonly contactBaseUrl = `${environment.baseUrl}/contact`;

  sendContactMail(contactDto: ContactDto) {
    return this.http.post(`${this.contactBaseUrl}`, contactDto);
  }

}
