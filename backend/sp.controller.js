var spUser = require('./sp.model');
const bcrypt = require('bcryptjs');

exports.registerSP = function(req, res) {
    var newSP = new spUser();
    newSP.name = req.body.name;
    newSP.phone = req.body.phone;
    newSP.email = req.body.email;
    newSP.address = req.body.address;
    newSP.zone = req.body.zone;
    newSP.pincode = req.body.pincode;
    newSP.service = req.body.service;
    newSP.location = req.body.location;
    newSP.socketid = null;
    if(req.body.service=="Grocery Shop"){
        newSP.shopAddress = req.body.shopAddress;
        newSP.shopName = req.body.shopName;
    } else {
        newSP.shopAddress = null;
        newSP.shopName = null;
    }
    newSP.customHash = null;
    newSP.otp = null;
    newSP.online = true;

    bcrypt.genSalt(10, function(err, salt) {

        if(err){
            console.log("BRCYPTJS ERROR : SALT GENERATION");
            console.log(err);
            return;
        }

        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if(err){
                console.log("BCRYPTJS ERROR : HASHING");
                console.log(err);
                return;
            }
            newSP.password = hash;
            newSP.save(function(err,sp){
                if(err){
                    console.log(err.message);
                    res.send({ 
                        code: 500,
                        success: false,
                        message: 'Error Registering SP'});
                } else {
                    console.log("Registered");
                    res.send({
                        code: 200,
                        success: true,
                        message: "Service Provider Registered."
                    });
                }
            });
                
            });
    });

    
}

exports.changeStatus = function(req,res){

    let status;
    if(req.query.status=="true"){
        status = true;
    }else {
        status = false;
    }
    
    console.log(status)

    spUser.findOneAndUpdate({_id: req.query.id},{online: status},{new: true}).then((arg)=>{
        
        console.log(arg.online);

        if(arg){
            res.send({success: true});
        } else {
            res.send({success: false});
        }
    }).catch((err)=>{
        console.log(err);
        res.send({success: false});
    })
}