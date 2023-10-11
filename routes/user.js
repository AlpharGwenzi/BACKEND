const router = require('express').Router();
const {User, validateUser} = require('../models/user');
const{hashPassword} = require ('../hash');
const auth = require('../middleware/auth');

//create user
router.post('/', async(req,res)=> {
    const {error}= validateUser(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    const isUnique = (await User.count({username: req.body.username}))=== 0;
    if(!isUnique)
    return res
      .status(400)
      .json({error: 'This user already exits'});

    try{
        const user = new User(req.body);
        user.password = await hashPassword(user.password);
        await user.save();
    }catch (err) {
        return res.status(500).json(err);
    }
    res.sendStatus(201);
});
//get current user details
router.get('/', auth, async(req, res)=>{
    res.send({currentUser: req.user});
});

module.exports = router;