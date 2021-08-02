var express = require('express');
var router = express.Router();
const locationModel = require("../model/location");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/about', function(req, res) {
  res.render('about');
});

router.get('/map', function(req, res) {
  res.render('map');
});

router.get('/dataex', function(req, res) {
  res.render('dataex');
});

router.get('/seouldata', function(req, res) {
  res.render('seouldata');
});

router.post('/location', (req, res, next) => {
  const {title, address, day, start, end, pay, phone, lat, lng} = req.body;
  let location = new locationModel();
  location.title=title;
  location.address=address;
  location.day=day;
  location.start=start;
  location.end=end;
  location.pay=pay;
  location.phone=phone;
  location.lat=lat;
  location.lng=lng;
  location.save().then((result) => {
    console.log(result);
    res.json({
      message:"success",
    });
  }).catch((error) => {
    console.log(error);
    res.json({
      message:"error",
    });
  });
});

router.get('/location', (req, res, next) => {
  locationModel.find({}).then((result) => {
    res.json({
      message:"success",
      data: result,
    });
  }).catch((error) => {
    res.json({
      message:"error",
    });
  });
});

module.exports = router;