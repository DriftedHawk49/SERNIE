export class Request {
    _id: String;
    consumer: string;
    sp: string;
    dateRaised: Date = new Date(); // Date When Request was raised
    dateScheduled: Date = null; // Date When it is scheduled to be fulfilled.
    dateFulfilled: Date = null; // Actual Date when it is fulfilled.
    dateLatestHop: Date = null; // Date (Time) when latest hop happened.
    numberOfHops: Number = 0; // Total Number of Hops made , Default = 0
    rating: Number = null; // A number (1-5) to rate the services of a SP 
    accepted: Boolean = false; // True: Yes Service was accepted. , False: 
    delay: Boolean = false; // True: Service was delayed , False: Service was not delayed.
}