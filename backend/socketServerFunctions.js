const groceryRequestSchema = require('./groceryRequest.model');

const findInUserArray = function(id,userArray){
    let result = {
        found: false,
        item: {}
    }
    console.log(id);

    for(let item of userArray){
        console.log(item.userID);
        if(item.userID==id){
            result.found = true;
            result.item = item;
        }
    }

    return result;
}

const acceptRequest = function(obj, senderSocket,userArray){

    groceryRequestSchema.findByIdAndUpdate(obj.data.reqID,{accepted: true},{new: true}).then((document)=>{
        if(document!=null){
            senderSocket.emit("response",{status:"ACCEPT",success: true});
            var userOnline = findInUserArray(obj.otherID,userArray);

            if(userOnline.found){
                userOnline.item.socNode.emit("response",{status: "ACCEPT",reqID: obj.data.reqID});
            }
        } else {
            console.log(document);
            senderSocket.emit("response",{status:"ACCEPT",success: false});
        }
    }).catch((err)=>{
        console.log(err);
        senderSocket.emit("response",{status:"ACCEPT",success: false});
    })


}

const rejectRequest = function(obj, senderSocket,userArray){

    groceryRequestSchema.findByIdAndUpdate(obj.data.reqID,{rejected: true},{new: true}).then((document)=>{
        if(document!=null){
            senderSocket.emit("response",{status:"REJECT",success: true});
            var userOnline = findInUserArray(obj.otherID,userArray);

            if(userOnline.found){
                userOnline.item.socNode.emit("response",{status: "REJECT",reqID: obj.data.reqID});
            }
        }else {
            console.log(document);
            senderSocket.emit("response",{status:"REJECT",success: false});
        }
    }).catch((err)=>{
        console.log(err);
        senderSocket.emit("response",{status:"REJECT",success: false});
    });
}

const requestDelivered = function(obj, senderSocket,userArray){
    groceryRequestSchema.findByIdAndUpdate(obj.data.reqID,{accepted: true,rejected: true,totalCost: obj.data.totalCost,individualCost: obj.data.individualCost},{new: true}).then((document)=>{
        if(document!=null){
            senderSocket.emit("response",{status: "DELIVER",success: true});
            
            var userOnline = findInUserArray(obj.otherID,userArray);

            if(userOnline.found){
                userOnline.item.socNode.emit("response",{status: "DELIVER",reqID: obj.data.reqID});
            }
            
        }else {
            console.log(document);
            senderSocket.emit("response",{status:"DELIVER",success: false});
        }
    }).catch((err)=>{
        console.log(err);
        senderSocket.emit("response",{status:"DELIVER",success: false});
    });
}

const placeOrder = function(obj, senderSocket,userArray){

    let newRequest = new groceryRequestSchema();
    newRequest.list = obj.data.listID;
    newRequest.generatedFor = obj.otherID;
    newRequest.generatedBy = obj.ID;
    newRequest.dateOfGeneration = new Date();
    newRequest.accepted = false;
    newRequest.rejected = false;
    newRequest.totalCost = 0;
    newRequest.delivered = false;

    let individualCost = [];
    for(let i=0;i<obj.data.lengthOfList;i++){
        individualCost.push(0);
    }
    newRequest.individualCost = individualCost;
    newRequest.save().then((document)=>{
        senderSocket.emit("response",{status:"PLACE",success: true});
        
        var userOnline = findInUserArray(obj.otherID,userArray);

            if(userOnline.found){
                console.log("USER FOUND")
                userOnline.item.socNode.emit("response",{status: "PLACE",reqID: obj.data.reqID});
            }else{
                console.log("USER NOT FOUND");
            }

    }).catch((err)=>{
        console.log(err);
        senderSocket.emit("response",{status:"PLACE",success: false});
        
    });





}

exports.identifierFunction = function(obj,senderSocket,userArray){
    
    obj = JSON.parse(obj);
    console.log(obj);

    if(obj.function=="ACCEPT"){
        acceptRequest(obj,senderSocket,userArray);
    }else if(obj.function=="REJECT"){
        rejectRequest(obj,senderSocket,userArray);
    } else if(obj.function=="DELIVER"){
        requestDelivered(obj,senderSocket,userArray);
    } else if(obj.function=="PLACE"){
        placeOrder(obj,senderSocket,userArray);
    }else{
        console.log("INVALID IDENTIFIER");
    }
}