import { Request } from './request.model';


export class Consumer{
    _id: String = "";
    name: String = "";
    email: String = "";
    password: String = "";
    phone: Number = 0;
    address: String = "";
    zone: String = "";
    pincode: String = "";
    location: String = "";
    activeRequests: Request = null;
    pastRequests: Request = null;

}