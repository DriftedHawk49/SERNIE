const Consumer = require('./consumer.model');
const ServiceProvider = require('./sp.model');



// Function that will check whether a particular consumer with given email/phone exists in database
exports.consumerCheckPresence = function(req,res){
    let presence = {
        phone: false,
        email: false,
    }

    console.log(req.query);

    Consumer.findOne({phone: req.query.phone}).then((arg)=>{
        console.log(arg);
        if(arg!=null){
            console.log("Database hit For Phone");
            presence.phone = true;
            res.send(presence);
        } else {
            console.log("Database miss for Phone");
            Consumer.findOne({email: req.query.email}).then((arg)=>{
                console.log(arg);
                if(arg!=null){
                    console.log("Database hit for Email");
                    presence.email = true;
                } else {
                    console.log("Database miss for Email");
                }
                res.send(presence);
            });
        }
    });
}


// Function that will check whether a particular Service Provider with given email/phone exists in database

exports.serviceProviderCheckPresence = function(req,res){
    let presence = {
        email: false,
        phone: false,
    }

    ServiceProvider.findOne({phone: req.params.phone}).then((arg)=>{
        if(arg!=null){
            console.log("Database hit for phone");
            presence.phone= true;
            res.send(presence);
        } else {
            console.log("Database miss for phone");
            ServiceProvider.findOne({email: req.params.email}).then((arg)=>{
                if(arg!=null){
                    console.log("Database hit for email");
                    presence.email = true;
                } else {
                    console.log("Database miss for email");
                    res.send({presence});
                }
            });
        }
    });
}


