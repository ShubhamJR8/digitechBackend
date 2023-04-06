const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const validateMongoDbId = require('../utils/validateMongodbId');
const jwt = require('jsonwebtoken');



const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if(!findUser) {
        //create a new user
        const newUser = await User.create(req.body)
        res.json(newUser);
    } else {
        res.json({
            message: "User Already Exists"
        })
    }
},);

//login 
const loginUserCtrl = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if(findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        res.json({
            message: "Invalid Credentials!"
        })
        // throw new Error("Invalid credentials!")
    }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });

// logout for user
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  });

// update a user
const updateaUser = asyncHandler(async(req, res)=>{
    try{
        const { _id } = req.user;
        validateMongoDbId(_id);
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile
        },
        { new: true });
        res.json(updateUser)
    }catch(error){
        throw new Error(error);
    }
})

// update a user Password
const updateaUserPassword = asyncHandler(async(req, res)=>{
    try{
        const { _id } = req.user;
        validateMongoDbId(_id);
        const updateUser = await User.findByIdAndUpdate(_id, {
            password:req?.body?.password,
        },
        { new: true });
        res.json({
            updateUser,
            message: "password updated successfully"
        })
    }catch(error){
        res.json({
            status: 200,
            message: "Got some error!"
        });
        // throw new Error(error);
    }
})

// get all users
const getAllUsers = asyncHandler(async(req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error){
        throw new Error(error);
    }
})

// get all users
const getaUser = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const getaUser = await User.findById(id);
        res.json(getaUser)
    } catch (error){
        throw new Error(error);
    }
});

// delete a users
const deleteaUser = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json(deleteaUser)
    } catch (error){
        throw new Error(error);
    }
});

// block a user
const blockUser = asyncHandler(async(req,res)=> {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const block = User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "user blocked"
        });
    }catch (error){
        throw new Error(error);
    }
});
// unblock a user
const unblockUser = asyncHandler(async(req,res)=> {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const unblock = User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "user unblocked"
        })
    }catch (error){
        throw new Error(error);
    }
});

module.exports = { updateaUserPassword, logout, createUser, loginUserCtrl, updateaUser, getAllUsers, getaUser, deleteaUser, blockUser, unblockUser, handleRefreshToken };