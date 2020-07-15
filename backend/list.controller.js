const listSchema = require('./list.model');
const mongoose = require('mongoose');

exports.addNewList = function(req,res){

    var newList = new listSchema();
    newList.listName = req.body.listName;
    newList.listItems = req.body.listItems;
    newList.dateOfCreation = req.body.dateOfCreation;
    newList.creator = req.body.creator;
    newList.editable = true;

    console.log("hit received");
    console.log(newList);

    newList.save(function(err){
        
        if(err){
            console.log(err);
            res.send({
                success: false
            })
        } else {
            res.send({
                success: true,
            });
        }
    });
    
}

exports.fetchLists = function(req,res){

    listSchema.find({creator: req.query.id}, function(err,result){
        if(err){
            res.send({
                success: false,
            });
        } else {
            res.send({
                success: true,
                payload: result
            });
        }
    })
}

exports.deleteList = function(req,res){

    listSchema.findOneAndDelete({_id: req.query._id}).then((result)=>{
        console.log(result);

        res.send({
            success: true
        });
    }).catch((er)=>{
        console.log(er);

        res.send({
            success: false
        })
    })



}

exports.editList = function(req,res){

    let editList = new listSchema();
    editList._id = req.body._id;
    editList.listName = req.body.listName;
    editList.listItems = req.body.listItems;


    listSchema.findOneAndUpdate({_id: editList._id},{listName : editList.listName, listItems: editList.listItems},{new: true}).then((result)=>{
        
        res.send({
            success: true
        })
    }).catch((err)=>{
        console.log(err);
        res.send({
            success: false
        })
    });

}