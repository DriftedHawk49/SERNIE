import { Request } from './request.model';

export class ServiceProvider {
    _id: String;
    name: String;
    email: String;
    password: String;
    phone: Number;
    address: String;
    zone: String;
    pincode: String;
    service: String;
    location: Object;
    shopAddress: String = null;
    shopName: String = null;
    online: Boolean = true;
    currentRequests: Request = null;
    appointments: Request = null;
    pastRequests: Request = null;
}