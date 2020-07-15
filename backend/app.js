const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const consumerController = require('./consumer.controller');
const SPController = require("./sp.controller");
const checkPresence = require('./checkPresence');
const cors = require('cors');
const passwordRecovery = require('./forgotPassword');
const auth = require('./auth');
const changeData = require('./changeData');
const serviceGetter = require('./servicegetter');
const RequestController = require('./request.controller');
const listController = require('./list.controller');
const groceryListController = require('./groceryRequest.controller');

const port = 5000;
const db = 'mongodb://localhost:27017/sernie';

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log("database connect Successful");
}).catch((err)=>{
    console.log(err);
    console.log("Database Connect Failed");
});


// Initializing MiddleWare

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}));


// GET URLs

//  accepts GET request for checking presence of consumer by their phone number
app.get('/api/consumerCheckPresence', checkPresence.consumerCheckPresence);
//  accepts GET request for checking presence of Service Provider by their email
app.get('/api/serviceProviderCheckPresence', checkPresence.serviceProviderCheckPresence);
app.get('/api/forgotpassword/validate',passwordRecovery.findEmail);
app.get('/api/forgotpassword/otpverification',passwordRecovery.otpVerifier);
app.get('/api/servicegetter', serviceGetter.serviceGetter);
app.get('/api/fetchrequests', RequestController.fetchRequests);
app.get('/api/deactivaterequest', RequestController.deactivateRequest);
app.get('/api/acceptrequest', RequestController.acceptRequest);
app.get('/api/rejectrequest', RequestController.rejectRequest);
app.get('/api/spchangestatus', SPController.changeStatus);
app.get('/api/servicecomplete', RequestController.serviceCompleted);
app.get('/api/getlists', listController.fetchLists);
app.get('/api/deletelist',listController.deleteList);
app.get('/api/getgroceryrequests',groceryListController.fetchGroceryRequests);
app.get('/api/deliveryconfirmation',groceryListController.deliveryConfirmation);
app.get('/api/requestnumbers',groceryListController.requestNumbers);
app.get('/api/activefetcher',groceryListController.fetchActiveOrders);
app.get('/api/pendingfetcher',groceryListController.fetchPendingOrders);
app.get('/api/historyfetcher',groceryListController.fetchHistory);








app.post('/api/consumerregister', consumerController.registerConsumer);
app.post('/api/spregister', SPController.registerSP);
app.post('/api/forgotpassword/validate',passwordRecovery.changePassword);
app.post('/api/login',auth.login);
app.post('/api/auth', auth.auth);
app.post('/api/changeemail',changeData.changeEmail);
app.post('/api/changephone',changeData.changePhone);
app.post('/api/changepass', changeData.changePass);
app.post('/api/addrequest', RequestController.addRequest);
app.post('/api/addlist', listController.addNewList);
app.post('/api/editlist',listController.editList);
// app.post('/api/addgroceryrequest',groceryListController.createGroceryRequest);






app.listen(port, (req,res)=>{
    console.log("ON at "+port);
})