const Consumer = require('./consumer.model');
const bcrypt = require('bcryptjs');


exports.registerConsumer = function(req,res){
    var newConsumer = new Consumer();
    newConsumer.name = req.body.name;
    newConsumer.phone = req.body.phone;
    newConsumer.email = req.body.email;
    newConsumer.address = req.body.address;
    newConsumer.zone = req.body.zone;
    newConsumer.pincode = req.body.pincode;
    newConsumer.location = req.body.location;
    newConsumer.customHash = null;
    newConsumer.otp = null;

    bcrypt.genSalt(10, function(err, salt){
        if(err){
            console.log("BCRYPTJS ERROR : SALT GENERATION");
            console.log(err);
            return;
        }
        bcrypt.hash(req.body.password, salt, function(err, hash){
            if(err){
                console.log("BCRYPTJS ERROR : HASHING");
                console.log(err);
                return;
            }
            newConsumer.password = hash;

            newConsumer.save(function(err,user){
                if(err){
                        res.send({code : 500,
                                  success: false,
                                  message:  "Internal Server Error."});
                    console.log(err.message);
                    console.log(err);
                    
                } else {
                    console.log(user);
                    res.send({code: 200,
                              success: true,
                              message: "Response Saved."});
                }
            })

        });
    });
    
}

