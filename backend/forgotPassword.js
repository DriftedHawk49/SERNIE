const bcrypt = require("bcryptjs");
const ServiceProvider = require('./sp.model');
const Consumer = require('./consumer.model');
const Mailer = require('nodemailer');


var sendMail = function(email,otp){
    // Create a Transport 
    const transport = Mailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'reid.wilkinson38@ethereal.email',
            pass: 'T173Zrwdtbvq3RdHzM'
        }
    });

    transport.sendMail({
        from:' "Admin" <iamkratos489@gmail.com>',
        to: email,
        subject: "OTP for your Sernie Account",
        text: `Your OTP to reset Password on Sernie Account is : ${otp}`,
        tls:{
            rejectUnauthorized: false
        }
    }).then((response)=>{
        response.json();
    }).then((arg)=>{
        console.log(arg);
    }).catch((err)=>{
        console.log(err);
    });

}

var otpGenerator = function(email,identity){
    var otp = Math.floor(100000 + Math.random() * 900000);

    bcrypt.genSalt(10).then((salt)=>{
        
        bcrypt.hash(String(otp),salt).then((hash)=>{
            
            console.log(identity);
            if(identity=="Consumer"){
                Consumer.findOneAndUpdate({email: email},{otp: hash},{upsert: false},(err,arg)=>{
                    if(err){
                        console.log(err);
                        console.log("ERROR UPDATING OTP FIELD");
                    }else{
                        console.log(arg);
                        sendMail(email,otp);
                    }
                });
            } else{
                ServiceProvider.findOneAndUpdate({email: email},{otp: hash},{upsert: false},(err,arg)=>{
                    if(err){
                        console.log(err);
                        console.log("ERROR UPDATING OTP FIELD");
                    }else{
                        console.log(arg);
                        sendMail(email,otp);
                    }
                    
                    
                });
            }

        }).catch((err)=>{
            console.log("BCRYPTJS ERROR : HASHING");
            console.log(err);
        });
    }).catch((err)=>{
        console.log("BCRYPTJS ERROR : SALT GENERATION");
        console.log(err);
    });
}


exports.findEmail = function(req,res){
let email = req.query.email;
let identity = req.query.identity;

if(identity=="Consumer"){
    Consumer.findOne({email: email}).then((user)=>{
        
            console.log(user);
            res.send({found: true});
            otpGenerator(email,identity);
        
    }).catch((err)=>{
        console.log(err);
        res.send({found: false});
    });
} else {
    ServiceProvider.findOne({email: email},(user)=>{
        
            console.log(user);
            res.send({found: true});
            otpGenerator(email,identity);
        
    }).catch((err)=>{
        console.log(err);
        res.send({found: false});
    });
}
};

exports.otpVerifier = function(req,res){
    let email = req.query.email;
    let otp = req.query.otp;
    let identity = req.query.identity;

    if(identity=="Consumer"){
        Consumer.findOne({email: email},(err,user)=>{
            if(err){
                console.log(err);
                res.send({match: false});
            }
            else{
                console.log(user);
                bcrypt.compare(otp,user.otp).then((response)=>{
                    console.log(response);
                    if(response){
                        res.send({match: true});
                    } else {
                        res.send({match: false});
                    }
                });
            }
        });
    }
    

};

exports.changePassword = function(req,res){
    var password = req.body.password;
    var email = req.body.email;
    var identity = req.body.identity;

    if(identity=="Consumer"){
        bcrypt.genSalt(10).then((salt)=>{
            bcrypt.hash(password,salt).then((hash)=>{
                Consumer.findOneAndUpdate({email: email},{password: hash, otp: null}, (err,arg)=>{
                    if(err){
                        console.log(err);
                        res.send({success:false});
                    } else {
                        console.log(arg);
                        res.send({success: true});
                    }
                })
            })
        })
    } else{
        
            bcrypt.genSalt(10).then((salt)=>{
                bcrypt.hash(password,salt).then((hash)=>{
                    ServiceProvider.findOneAndUpdate({email: email},{password: hash, otp: null}, (err,arg)=>{
                        if(err){
                            console.log(err);
                            res.send({success:false});
                        } else {
                            console.log(arg);
                            res.send({success: true});
                        }
                    })
                })
            })
        
    }
}