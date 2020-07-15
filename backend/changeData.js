const Consumer = require('./consumer.model');
const ServiceProvider = require('./sp.model');
const bcrypt = require('bcryptjs');





exports.changeEmail = function(req,res){

    if(req.body.identity=="Consumer"){
        Consumer.findOneAndUpdate({_id: req.body.id, customHash: req.body.customHash},{email: req.body.email},{new: true}).then((user)=>{
            console.log(user);
            const customHashString = user.id+user.email+user.name;

            bcrypt.genSalt(10).then((salt)=>{
                bcrypt.hash(customHashString,salt).then((hash)=>{
                    Consumer.findOneAndUpdate({_id : user.id},{customHash : hash},{new: true}).then((user)=>{
                        res.send({success: true, email: user.email, customHash: hash});
                    }).catch((err)=>{
                        console.log("ERROR IN SAVING CUSTOM_HASH TO DATABASE");
                        console.log(err);
                        res.send({success: false});
                    });
                }).catch((err)=>{
                    console.log("BCRYPT ERROR IN GENERATING HASH");
                    console.log(err);
                    res.send({success: false});
                });
            }).catch((err)=>{
                console.log("BCRYPT ERROR IN GENERATING SALT");
                console.log(err);
                res.send({success: false});
            });
        }).catch((err)=>{
            console.log("ERROR IN SAVING NEW DETAILS TO DB");
            console.log(err);

            res.send({success: false});
        });
    } else if(req.body.identity=="Service_Provider"){
        ServiceProvider.findOneAndUpdate({_id: req.body.id, customHash: req.body.customHash},{email: req.body.email},{new: true}).then((user)=>{
            console.log(user);
            const customHashString = user.id+user.email+user.name;

            bcrypt.genSalt(10).then((salt)=>{
                bcrypt.hash(customHashString,salt).then((hash)=>{
                    ServiceProvider.findOneAndUpdate({_id : user.id},{customHash : hash},{new: true}).then((user)=>{
                        res.send({success: true, email: user.email, customHash: hash});
                    }).catch((err)=>{
                        console.log("ERROR IN SAVING CUSTOM_HASH TO DATABASE");
                        console.log(err);
                        res.send({success: false});
                    });
                }).catch((err)=>{
                    console.log("BCRYPT ERROR IN GENERATING HASH");
                    console.log(err);
                    res.send({success: false});
                });
            }).catch((err)=>{
                console.log("BCRYPT ERROR IN GENERATING SALT");
                console.log(err);
                res.send({success: false});
            });
        }).catch((err)=>{
            console.log("ERROR IN SAVING NEW DETAILS TO DB");
            console.log(err);

            res.send({success: false});
        });
    }
}

exports.changePhone = function(req, res){

    if(req.body.identity=="Consumer"){
        Consumer.findOneAndUpdate({_id: req.body.id, customHash: req.body.customHash},{phone: req.body.phone},{new: true}).then((user)=>{
            res.send({success: true, phone: user.phone});
            
        }).catch((err)=>{
            console.log("ERROR IN SAVING NEW DETAILS TO DB");
            console.log(err);
            res.send({success: false});
        });

    } else if(req.body.identity=="Service_Provider"){
        ServiceProvider.findOneAndUpdate({_id: req.body.id, customHash: req.body.customHash},{email: req.body.email},{new: true}).then((user)=>{
            res.send({success: true, phone: user.phone});

        }).catch((err)=>{
            console.log("ERROR IN SAVING NEW DETAILS TO DB");
            console.log(err);

            res.send({success: false});
        });
    }

}

exports.changePass = function(req,res){

    if(req.body.identity=="Consumer"){

        Consumer.findOne({_id: req.body.id, customHash: req.body.customHash}).then((user)=>{
            bcrypt.compare(req.body.oldPassword, user.password).then((arg)=>{
                if(arg){
                    bcrypt.genSalt(10).then((salt)=>{

                        bcrypt.hash(req.body.newPassword,salt).then((hash)=>{
            
                            Consumer.findOneAndUpdate({_id: req.body.id}, {password: hash},{new: true}).then((user)=>{
                                console.log("SUCCESS");
                                console.log(user);
                                res.send({success: true, remark: "Password changed Succesfully!"});
                            }).catch((err)=>{
                                console.log("ERROR IN SAVING IN DATABASE");
                                console.log(err);
                                res.send({success: false, remark: "Database Error. Try Later"});
                            })
            
                        }).catch((err)=>{
                            console.log("BCRYPT ERROR IN GENERATING HASH");
                            console.log(err);
                            res.send({success: false, remark: "Unknown error occurred. Try Later"});
                        });
            
                    }).catch((err)=>{
                        console.log("BCRYPT ERROR IN GENERATING SALT");
                        console.log(err);
                        res.send({success: false, remark: "Unknown error occurred. Try Later"});
                    });

                } else {
                    console.log("WRONG OLD PASSWORD");
                    res.send({success: false, remark: "Wrong Old Password"});
                }
            }).catch((err)=>{
                console.log("BCRYPT ERROR IN COMPARING");
                console.log(err);
                res.send({success: false, remark: "Unknown Error Occured"});
            });
        }).catch((err)=>{
            console.log("ERROR IN CONTACTING DB");
            console.log(err);
            res.send({success:false, remark: "Error Contacting Databse. Try Later."});
        });



        

    } else if(req.body.identity=="Service_Provider"){

        ServiceProvider.findOne({_id: req.body.id, customHash: req.body.customHash}).then((user)=>{
            bcrypt.compare(req.body.oldPassword, user.password).then((arg)=>{
                if(arg){
                    bcrypt.genSalt(10).then((salt)=>{

                        bcrypt.hash(req.body.newPassword,salt).then((hash)=>{
            
                            ServiceProvider.findOneAndUpdate({_id: req.body.id}, {password: hash},{new: true}).then((user)=>{
                                console.log("SUCCESS");
                                console.log(user);
                                res.send({success: true, remark: "Password changed Succesfully!"});
                            }).catch((err)=>{
                                console.log("ERROR IN SAVING IN DATABASE");
                                console.log(err);
                                res.send({success: false, remark: "Database Error. Try Later"});
                            })
            
                        }).catch((err)=>{
                            console.log("BCRYPT ERROR IN GENERATING HASH");
                            console.log(err);
                            res.send({success: false, remark: "Unknown error occurred. Try Later"});
                        });
            
                    }).catch((err)=>{
                        console.log("BCRYPT ERROR IN GENERATING SALT");
                        console.log(err);
                        res.send({success: false, remark: "Unknown error occurred. Try Later"});
                    });

                } else {
                    console.log("WRONG OLD PASSWORD");
                    res.send({success: false, remark: "Wrong Old Password"});
                }
            }).catch((err)=>{
                console.log("BCRYPT ERROR IN COMPARING");
                console.log(err);
                res.send({success: false, remark: "Unknown Error Occured"});
            });
        }).catch((err)=>{
            console.log("ERROR IN CONTACTING DB");
            console.log(err);
            res.send({success:false, remark: "Error Contacting Databse. Try Later."});
        });

    }


}