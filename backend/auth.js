const bcrypt = require('bcryptjs');
const ServiceProvider = require('./sp.model');
const Consumer = require('./consumer.model');

exports.login = function(req,res){
    const credentials = {
        username: req.body.username,
        password: req.body.password
    };
    if(req.body.identity=="Consumer"){
        if(req.body.type=="phone"){
            const phoneCheck = Number(credentials.username);
            Consumer.findOne({phone: phoneCheck}).then((user)=>{
                
                bcrypt.compare(credentials.password,user.password).then((success)=>{
                    if(success){
                        user.password = null;

                        let payload = {
                            id: user._id,
                            customHash: "",
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            location: user.location,
                            zone: user.zone,
                            pincode: user.pincode
                        }

                        const customString = user.id+user.email+user.name;

                        bcrypt.genSalt(10).then((salt)=>{
                            bcrypt.hash(customString,salt).then((hash)=>{
                                payload.customHash = hash;
                                Consumer.findOneAndUpdate({_id: user._id},{customHash: hash},{new: true}).then((user)=>{
                                    res.send({success: true, user: payload, remarks: "Login Successful !"});
                                }).catch((err)=>{
                                    console.log(err);
                                    console.log("ERROR IN CONTACTING DATABASE");
                                })
                            }).catch((err)=>{
                                console.log(err);
                                console.log("BCRYPT ERROR IN GENERATING HASH");
                            });
                        }).catch((err)=>{
                            console.log(err);
                            console.log("BCRYPT ERROR IN GENERATING SALT");
                        });
                        
                    } else {
                        res.send({success: false, user: null, remarks: "Wrong Username Or Password"})
                    }
                }).catch((err)=>{
                    console.log(err);
                    console.log("BCRYPT ERROR : COMPARE");
                    res.send({success:false, user: null, remarks: "Error in decryption"});
                });
            }).catch((err)=>{
                console.log(err);
                res.send({success: false, user: null, remarks: "User Doesn't exist. Register Yourself"});
            });
        } else if(req.body.type=="email"){
            Consumer.findOne({email: credentials.username}).then((user)=>{
                
                bcrypt.compare(credentials.password,user.password).then((success)=>{
                    if(success){
                        
                        user.password = null;
                        
                        let payload = {
                            id: user._id,
                            customHash: "",
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            location: user.location,
                            zone: user.zone,
                            pincode: user.pincode

                        }

                        const customString = user.id+user.email+user.name;

                        bcrypt.genSalt(10).then((salt)=>{
                            bcrypt.hash(customString,salt).then((hash)=>{
                                payload.customHash = hash;
                                Consumer.findOneAndUpdate({_id: user._id},{customHash: hash},{new: true}).then((user)=>{
                                    
                                    res.send({success: true, user: payload, remarks: "Login Successful !"});
                                }).catch((err)=>{
                                    console.log(err);
                                    console.log("ERROR IN CONTACTING DATABASE");
                                });
                            }).catch((err)=>{
                                console.log(err);
                                console.log("BCRYPT ERROR IN GENERATING HASH");
                            });
                        }).catch((err)=>{
                            console.log(err);
                            console.log("BCRYPT ERROR IN GENERATING SALT");
                        });
                    } else {
                        res.send({success: false, user: null, remarks: "Wrong Username Or Password"})
                    }
                }).catch((err)=>{
                    console.log(err);
                    console.log("BCRYPT ERROR : COMPARE");
                    res.send({success:false, user: null, remarks: "Error in decryption"});
                })
            }).catch((err)=>{
                console.log(err);
                res.send({success: false, user: null, remarks: "User Doesn't exist. Register Yourself"});
            });
        }
        else{
            console.log("Error ! No type Found");
            res.send({success: false, user: null, remarksL: "No Type Found"});
        }
    } //SERVICE PROVIDER START 
    else{
        if(req.body.type=="phone"){
            ServiceProvider.findOne({phone: Number(credentials.username)}).then((user)=>{
                bcrypt.compare(credentials.password,user.password).then((success)=>{
                    if(success){

                        let payload = {};
                        
                        user.password = null;
                        if(user.service=="Grocery Shop"){
                            payload = {
                                success: true,
                                id: user._id,
                                customHash: "",
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                location: user.location,
                                zone: user.zone,
                                pincode: user.pincode,
                                shopName: user.shopName,
                                shopAddress: user.shopAddress,
                                service: user.service,
                                online: user.online
                            }
                        } else{
                            payload = {
                                success: true,
                                id: user._id,
                                customHash: "",
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                location: user.location,
                                zone: user.zone,
                                pincode: user.pincode,
                                service: user.service,
                                online: user.online
                            }
                        }

                       

                        const customString = user.id+user.email+user.name;

                        bcrypt.genSalt(10).then((salt)=>{
                            bcrypt.hash(customString,salt).then((hash)=>{
                                payload.customHash = hash;
                                ServiceProvider.findOneAndUpdate({_id: user._id},{customHash: hash},{new: true}).then((user)=>{
                                    
                                    res.send({success: true, user: payload, remarks: "Login Successful !"});
                                }).catch((err)=>{
                                    console.log(err);
                                    console.log("ERROR IN CONTACTING DATABASE");
                                });
                            }).catch((err)=>{
                                console.log(err);
                                console.log("BCRYPT ERROR IN GENERATING HASH");
                            });
                        }).catch((err)=>{
                            console.log(err);
                            console.log("BCRYPT ERROR IN GENERATING SALT");
                        });
                    } else {
                        res.send({success: false, user: null, remarks: "Wrong Username Or Password"});
                    }
                }).catch((err)=>{
                    console.log(err);
                    console.log("BCRYPT ERROR : COMPARE");
                    res.send({success:false, user: null, remarks: "Error in decryption"});
                });
            }).catch((err)=>{
                console.log(err);
                res.send({success: false, user: null, remarks: "User Doesn't exist. Register Yourself"});
            });
        } else if(req.body.type=="email"){
            ServiceProvider.findOne({email: credentials.username}).then((user)=>{
                
                bcrypt.compare(credentials.password,user.password).then((success)=>{
                    if(success){
                        
                        user.password = null;

                        var payload = {};
                        
                        if(user.service=="Grocery Shop"){
                            payload = {
                                success: true,
                                id: user._id,
                                customHash: "",
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                location: user.location,
                                zone: user.zone,
                                pincode: user.pincode,
                                service: user.service,
                                shopName: user.shopName,
                                shopAddress: user.shopAddress,
                                online: user.online
                            }
                        } else{
                            payload = {
                                success: true,
                                id: user._id,
                                customHash: "",
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                location: user.location,
                                zone: user.zone,
                                pincode: user.pincode,
                                service: user.service,
                                online: user.online
                            }
                        }

                        const customString = user.id+user.email+user.name;

                        bcrypt.genSalt(10).then((salt)=>{
                            bcrypt.hash(customString,salt).then((hash)=>{
                                payload.customHash = hash;
                                ServiceProvider.findOneAndUpdate({_id: user._id},{customHash: hash},{new: true}).then((user)=>{
                                    
                                    res.send({success: true, user: payload, remarks: "Login Successful !"});
                                }).catch((err)=>{
                                    console.log(err);
                                    console.log("ERROR IN CONTACTING DATABASE");
                                })
                            }).catch((err)=>{
                                console.log(err);
                                console.log("BCRYPT ERROR IN GENERATING HASH");
                            });
                        }).catch((err)=>{
                            console.log(err);
                            console.log("BCRYPT ERROR IN GENERATING SALT");
                        });
                    } else {
                        res.send({success: false, user: null, remarks: "Wrong Username Or Password"});
                    }
                }).catch((err)=>{
                    console.log(err);
                    console.log("BCRYPT ERROR : COMPARE");
                    res.send({success:false, user: null, remarks: "Error in decryption"});
                });
            }).catch((err)=>{
                console.log(err);
                res.send({success: false, user: null, remarks: "User Doesn't exist. Register Yourself"});
            });
        }
        else{
            console.log("Error ! No type Found");
            res.send({success: false, user: null, remarksL: "No Type Found"});
        }
    }
}

exports.auth = function(req,res){
    const hash = req.body.customHash;
    const id = req.body.id;

    console.log(id);
    console.log(hash);
    console.log(req.body.identity);
    
    if(req.body.identity == "Consumer"){
        Consumer.findOne({_id: id}).then((user)=>{
            if(user.customHash==hash){
                res.send({authenticated: true, message: "Authentication Succesful"});
            } else {
                res.send({authenticated: false, message: "Please Login to Continue"});
            }
        }).catch((err)=>{
            console.log(err);
            res.send({authenticated: false, message: "An error occurred"});
        })
    } else {
        ServiceProvider.findOne({_id: id}).then((user)=>{
            if(user.customHash==hash){
                res.send({authenticated: true, message: "Authentication Succesful"});
            } else {
                res.send({authenticated: false, message: "Please Login to Continue"});
            }
        }).catch((err)=>{
            console.log(err);
            res.send({authenticated: false, message: "An error occurred"});
        });
            
    
    }
}