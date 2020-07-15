const Request = require('./request.model');
const Consumer = require('./consumer.model');
const ServiceProvider = require('./sp.model');

exports.addRequest = function(req,res){

    console.log(req.body);

let newReq = new Request();

ServiceProvider.findOne({_id:req.body.spID}).then((user)=>{
    if(user.online){
        newReq.consumer = req.body.consID;
    newReq.sp = req.body.spID;
    newReq.dateRaised = new Date();
    newReq.dateScheduled = req.body.dateScheduled;
    newReq.dateLatestHop = null;
    newReq.numberOfHops = 0;
    newReq.rating = null;
    newReq.accepted = false;
    newReq.delay = false;
    newReq.rejected = false;
    newReq.activeRequest = true;
    newReq.markDoneConsumer = false;
    newReq.markDoneSP = false;


    newReq.save().then((request)=>{
        console.log("request saved");
        res.send({success: true});
    }).catch((err)=>{
        console.log(err);
        res.send({success: false});
    });
    } else {
        res.send({success: false,remarks: "Service Provider is Offline. Please Refresh."});
    }
})


}

// Rewrite Fetch Function using populate

exports.fetchRequests = function(req,res){
    
    const id = req.query.id;

    

    if(req.query.identity=="Consumer"){
        
        
        Request.find({consumer: id}).populate('consumer').populate('sp').exec((err,responses)=>{
            if(err){
                console.log(err);
                res.send({success: false});

            } else {
                
                // Send Back response
                let payloadArr = [];
                for(let response of responses){
                    let payloadObj = {
                        id : response._id,
                        typeOfService: response.sp.service,
                        nameOfSP: response.sp.name,
                        phone: response.sp.phone,
                        dateCreated: (response.dateRaised),
                        dateScheduled: response.dateScheduled,
                        rating: response.rating,
                        accepted: response.accepted,
                        delay: response.delay,
                        rejected: response.rejected,
                        activeRequest: response.activeRequest,
                        markDoneConsumer: response.markDoneConsumer
                    }
                    payloadArr.push(payloadObj);
                }
                console.log("request fetched");
                console.log(payloadArr);
                
                res.send({success: true, payload: payloadArr});
            }
        });

    } else {
        Request.find({sp: id}).populate('consumer').populate('sp').exec((err,responses)=>{
            if(err){
                console.log(err);
                res.send({success: false});

            } else {

                let payloadArr = [];
                for(let response of responses){
                    let payloadObj = {
                        id : response._id,
                        nameOfConsumer: response.consumer.name,
                        dateScheduled: response.dateScheduled,
                        phone: response.consumer.phone,
                        address: response.consumer.address,
                        accepted: response.accepted,
                        delay: response.delay,
                        markDoneSP: response.markDoneSP,
                        rejected: response.rejected,
                        rating: response.rating,
                        activeRequest: response.activeRequest
                    }
                    payloadArr.push(payloadObj);
                }
                console.log("request fetched");
                res.send({success: true, payload: payloadArr});
            }
        });
    }
    
}


exports.acceptRequest = function(req,res){

    const id = req.query.id;
    Request.findOneAndUpdate({_id: id},{accepted: true}, {new: true}).then((req)=>{
        console.log("request accepted");
        res.send({success: true});
    }).catch((err)=>{
        console.log(err);
        res.send({success: false});
    });

}

exports.rejectRequest = function(req, res){

    const id = req.query.id;
    Request.findOneAndUpdate({_id: id},{activeRequest: false, rejected: true},{new : true}).then((req)=>{
        console.log("request Rejected");
        res.send({success: true});
    }).catch((err)=>{
        console.log(err);
        res.send({success: false});
    })
}

exports.deactivateRequest = function(req, res){

    Request.findOneAndUpdate({_id: req.query.id}, {activeRequest: false}).then((response)=>{
        console.log("request deactivated");
        res.send({success: true});
    }).catch((err)=>{
        console.log(err);
        res.send({success: false});
    })

}

exports.serviceCompleted = function(req,res){
    if(req.query.identity=="Consumer"){
        
        // Later On Change Rating Also Side By Side
        Request.findOneAndUpdate({_id: req.query.id},{markDoneConsumer: true, rating: Number(req.query.rating)},{new: true}).then((response)=>{
            console.log("Consumer Task Completed.");
            res.send({success: true});
        }).catch((err)=>{
            console.log(err);
            res.send({success: false});
        });
    } else {
        Request.findOneAndUpdate({_id: req.query.id},{markDoneSP: true},{new: true}).then((response)=>{
            console.log("Service Provider Task Completed.");
            res.send({success: true});
        }).catch((err)=>{
            console.log(err);
            res.send({success: false});
        });
    }
}
