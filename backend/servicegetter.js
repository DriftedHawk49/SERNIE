const ServiceProvider = require('./sp.model');


exports.serviceGetter = function(req,res){

    console.log("Server Hit Received");

    const user = {
        serviceType : req.query.serviceType,
        pincode: req.query.pincode,
        zone: req.query.zone,
        lat: req.query.lat,
        lng: req.query.lng
    }
    let mainArr = [];
    let payload = [];

    console.log("Variables set to send request to database");

    console.log("Sending Request to Database to return results");

    ServiceProvider.find({service: user.serviceType, zone: user.zone, online: true}).then((users)=>{

        if(users.length==0){
            res.send({success: false});
            return;
        }
        console.log("Data Returned by Database");
        console.log("Formatting Data to send back to Frontend");
        // users is an array
        for(let dbuser of users){
            if(dbuser.pincode==user.pincode){
                mainArr.unshift(dbuser);
            } else {
                mainArr.push(dbuser);
            }
        }

        for( let element of mainArr){
            var newSP = {
                id: element._id,
                name: element.name,
                phone: element.phone,
                zone: element.zone,
                pincode: element.pincode,
                lat: (JSON.parse(element.location)).lat,
                lng: (JSON.parse(element.location)).lng,
                address: element.address,
                distance: -1,
                marker: null,
            }

            if(user.serviceType=="Grocery Shop"){
                newSP.shopName= element.shopName,
                newSP.shopAddress= element.shopAddress
            }

            payload.push(newSP);
        }
        // console.log("bhej dia");
        console.log("Sending Back data to Frontend");
        console.log("Data Sent!");

        res.send({success: true, payload: payload});


    }).catch((err)=>{
        console.log(err);
        res.send({success: false});
    })
}
