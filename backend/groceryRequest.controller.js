const gRequestSchema = require("./groceryRequest.model");
const listSchema = require("./list.model");

exports.fetchGroceryRequests = function(req,res){
    let creator = req.query.creator;

    gRequestSchema.find({generatedBy: creator}).populate('generatedFor').populate('list').exec((err,doc)=>{
        
        if(err){
            console.log(err);
            res.send({success: false});
        }
        if(doc.length!=0){
            
            let payloadArray= [];

            for(let response of doc){
                let payload = {
                    requestID: response._id,
                    shopName: response.generatedFor.shopName,
                    shopAddress: response.generatedFor.shopAddress,
                    shopPhone: response.generatedFor.phone,
                    listName: response.list.listName,
                    dateOfGeneration: response.dateOfGeneration,
                    accepted: response.accepted,
                    rejected: response.rejected,
                    totalCost: response.totalCost,
                    delivered: response.delivered,
                    individualCost: response.individualCost
                }

                payloadArray.push(payload);
            }

            res.send({
                success: true,
                payload: payloadArray
            });

        } else {
            res.send({success: true,payload: null});
        }
    })
}

exports.deliveryConfirmation = function(req,res){
    const ID = req.query.reqid;
    console.log("DELIVERY CONFIRMATION");
    console.log(req.query.reqid);
    gRequestSchema.findOneAndUpdate({_id: ID},{delivered: true}).then((document)=>{
        if(document!=undefined){
            res.send({success: true});
        }else{
            res.send({success: false});
        }
    }).catch((err)=>{
        console.log(err);
        res.send({success: false});
    });

}

exports.requestNumbers = function(req,res){

    const sp = req.query.spid;

    gRequestSchema.find({generatedFor: sp}).then((document)=>{

        if(document.length==0){
            res.send({
                success: true,
                active: 0,
                pending: 0
            });
        }

        let active = 0,pending = 0;
        for(let item of document){
            if(!item.accepted&&!item.rejected){
                active++;
            }else if(item.accepted&&!item.rejected){
                pending++;
            }
        }

        res.send({
            success: true,
            active: active,
            pending: pending
        });
    }).catch((err)=>{
        console.log(err);
        res.send({
            success: false
        })
    })

}

exports.fetchActiveOrders = function(req,res){

    const sp = req.query.spid;

    gRequestSchema.find({generatedFor: sp,accepted: false,rejected: false}).populate('generatedBy').populate('list').exec((err,document)=>{

        let realPayload = [];

        if(err){
            console.log(err);
            res.send({
                success: false
            });
        }

        if(document.length!=0){

            for(let item of document){

                var payload = {
                    requestID: item._id,
                    consumerName: item.generatedBy.name,
                    listName: item.list.listName,
                    listItems: item.list.listItems,
                    consumerPhone: item.generatedBy.phone,
                    consumerAddress: item.generatedBy.address,
                    totalCost: item.totalCost,
                    dateOfGeneration: item.dateOfGeneration,
                    consumerID: item.generatedBy._id,
                    individualCost: item.individualCost
                }
                realPayload.push(payload);
            }

            res.send({
                success: true,
                payload: realPayload
            });

            

        }else{
            res.send({
                success: true,
                payload: null
            });
        }


    });

}

exports.fetchPendingOrders = function(req,res){

    const sp = req.query.spid;

    gRequestSchema.find({generatedFor: sp,accepted: true,rejected: false}).populate('generatedBy').populate('list').exec((err,document)=>{

        if(err){
            console.log(err);
            res.send({
                success: false
            });
        }
        let realPayload = [];
        if(document.length!=0){

            for(let item of document){

                var payload = {
                    requestID: item._id,
                    consumerName: item.generatedBy.name,
                    listName: item.list.listName,
                    listItems: item.list.listItems,
                    consumerPhone: item.generatedBy.phone,
                    consumerAddress: item.generatedBy.address,
                    totalCost: item.totalCost,
                    dateOfGeneration: item.dateOfGeneration,
                    consumerID: item.generatedBy._id,
                    individualCost: item.individualCost
                }
                realPayload.push(payload);
            }

            res.send({
                success: true,
                payload: realPayload
            });
        }else{
            res.send({
                success: true,
                payload: null
            });
        }


    });
}

exports.fetchHistory = function(req,res){
    const sp = req.query.spid;

    gRequestSchema.find({generatedFor: sp, rejected: true}).populate('generatedBy').populate('list').exec((err,document)=>{

        if(err){
            console.log(err);
            res.send({
                success: false
            });
        }

        let realPayload = [];
        if(document.length!=0){

            for(let item of document){

                var payload = {
                    requestID: item._id,
                    consumerName: item.generatedBy.name,
                    listName: item.list.listName,
                    listItems: item.list.listItems,
                    consumerPhone: item.generatedBy.phone,
                    consumerAddress: item.generatedBy.address,
                    totalCost: item.totalCost,
                    dateOfGeneration: item.dateOfGeneration,
                    consumerID: item.generatedBy._id,
                    rejected: item.rejected,
                    accepted: item.accepted,
                    individualCost: item.individualCost
                }
                realPayload.push(payload);
            }

            res.send({
                success: true,
                payload: realPayload
            });

            

        }else{
            res.send({
                success: true,
                payload: null
            });
        }


    });
}
