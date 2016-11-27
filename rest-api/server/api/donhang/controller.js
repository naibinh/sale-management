var DonHang = require('./model');
var _ = require('lodash');
var controller = {};

controller.params = function(req, res, next, id) {
    // use the id to find object from DB and attach to req
    DonHang
        .findById(id)
        .populate('khachhang sanpham')
        .exec()
        .then(
            function(item){
                if(!item){
                    next(new Error('Khong co don hang voi id=' + id));
                }else{
                    req.donhang = item;
                    next();
                }
            }, 
            function(err){
                next(err);
            }
        );
};

controller.get = function(req, res, next) {
    DonHang
        .find({})
        .populate('khachhang sanpham')
        .exec()
        .then(
            function(items){
                res.json(items);
            }, 
            function(err){
                next(err);
            }
        );
};

controller.getOne = function(req, res, next) {
    var donhang = req.donhang;
    res.json(donhang);
};

controller.put = function(req, res, next) {
    var curdonhang = req.donhang;
    var newdonhang = req.body;

    _.merge(curdonhang, newdonhang);

    curdonhang.save(function(err, item){
        if(err){
            next(err);
        }else{
            res.json(item);
        }
    });
};

controller.post = function(req, res, next) {
    var newdonhang = req.body;
    DonHang
        .create(newdonhang)
        .then(
            function(item){
                res.json(item);
            }, 
            function(err){
                next(err);
            }
        );
};

controller.delete = function(req, res, next) {
    var donhang = req.donhang;
    donhang.remove(function(err, item){
        if(err){
            next(err);
        }else{
            res.json(item);
        }
    });
};

module.exports = controller;