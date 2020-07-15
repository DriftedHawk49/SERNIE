exports.addNewSocket = function(sockObj,userArray){
    let found = false;

    for(let item of userArray){
        if(item.userID==sockObj.userID){
            found = true;
        }
    }
    if(!found){
        console.log("USER ACTIVE");
        userArray.push(sockObj);
    }
    
    sockObj.socNode.emit("reponse",{status: "CONNECT",success: true});
    
    console.log(userArray.length);
    return userArray;
}

exports.removeSocket = function(socket,userArray){
    let newArray = [];
    console.log("removing user from Server");
    console.log(userArray.length);
    for(let item of userArray){
        if(item.socNode!=socket){
            newArray.push(item);
        }else{
            console.log("User Removed!");
        }
    }
    console.log(newArray.length);
    return newArray;
}