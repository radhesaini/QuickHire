const { Router } = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = Router();

router.post('/register', async (req, res)=> {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;

    const salt = await bcrypt.genSalt(10);
    
    //password hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    const isExist = await User.exists({ email: email });
    if (isExist) {
        return res.status(400).send({ message: "Email is Already registered!"});
    }
    else {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        const result = await user.save();

        //JWT token
        const { _id } = await result.toJSON();

        const token = jwt.sign({_id: _id}, "secret");

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24*60*60*1000 //1day
        })

        // res.json({
        //     user: result
        // });
        res.send({
            message: "User Successfully Created!"
        })
    }
})

router.post('/login', async (req, res)=> {
    let email = req.body.email;
    let password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    
    //password hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).send({ message: "User not Found!"});
    }
    else if(!(await bcrypt.compare(password, user.password))){
        return res.status(400).send({ message: "You have Entered Incorrect Password!"});
    }
    else{
        const { _id } = await user.toJSON();

        const token = jwt.sign({_id: _id}, "secret");

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24*60*60*1000 //1day
        })
        res.send({"message": "success"});
    }
})

router.post('/logout', async (req, res)=> {
    // res.send("User Successfully login!");
    res.cookie("jwt", maxAge=0);
    res.send({message: "success"});
})

router.get('/users', async (req, res)=> {
    let users = await User.find({});
    res.json(users);
})

router.get('/user', async (req, res)=> {
    try{
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, 'secret');
        if(!claims){
            return res.status(401).send({message: "unAuthenticated"});
        }
        else{
            const user = await User.findOne({_id: claims._id});
            
            const {password, ...data} = await user.toJSON();
            res.send(data);
        }
    }
    catch(err){
        res.status(401).send({
            message: "unAuthenticated"
        })

    }
})


module.exports = router;