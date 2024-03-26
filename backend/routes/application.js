const { Router } = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Application = require('../models/application');
const mongoose = require('mongoose');
const router = Router();

/* GET ALL Applications */
router.get('/', async (req, res)=> {
  const application = await Application.find({});
  if(application) {
    res.json(application);
}else{
  res.status(401).send(err);}
})

/* GET SINGLE Application BY ID */
router.get('/:id',   async (req, res)=> {
  const application = await Application.findById(req.params.id);
  if(application) {
    res.json(application);
}else{
  res.status(404).send(err);}
})

/* SAVE Application */
router.post('/', function(req, res, next) {
  Application.create(req.body).then((data)=>{
    res.status(201).send(data);
  }).catch(error=>res.status(400).send(error));
});


/* UPDATE Application */
router.put('/:id', function(req, res, next) {
  Application.findByIdAndUpdate(req.params.id, req.body)
  .then(data=>res.status(200).send(data))
  .catch(err=>res.status(400).send(err));
});

/* DELETE Application */
router.delete('/:id', function(req, res, next) {
  Application.deleteOne({_id:req.params.id})
  .then(data=>res.status(200).send(data))
  .catch(err=>res.status(400).send(err));
});

module.exports = router;
