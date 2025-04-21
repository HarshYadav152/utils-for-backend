import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessToken = async(userID)=>{
    try{
        const user = await User.findOne(userID)
        const accessToken = user.generateAccessToken();
        return {accessToken};
    }catch(error){
        throw new ApiError(500,"SOmwthing went wrong while generating AT.");
    }
}

const signUpUser = asyncHandler(async(req,res)=>{
    const {username,email,password,keyword} = req.body;

    if ([email,password,username,keyword].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required.") // message to be changed in english
    }
    // if(!validateEmail(email)){
    //     throw new ApiError(400,"Please enter a valid email.") // message to be changed in english
    // }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User exist with email. PLease try with another credentials.") // message to be changed in english
    }

    const user = await User.create({
        username:username.toLowerCase(),
        email,
        password,
        keyword
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while signing. Please try again.")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully.")
    )
});

const signInUser = asyncHandler(async(req,res)=>{
    if (!req.body) {
        throw new ApiError(400, "Request body is missing");
    }
    console.log(req.body);
    const {username,password} = req.body

    if(!username){
        throw new ApiError(400,"User doesnot exist on our systems.")
    }

    const user = await User.findOne({
        $or:[{username}]
    })
    const passwordValid = await user.isPasswordCorrect(password)

    if(!passwordValid){
        throw new ApiError(401,"Invalid credentials. Try with different (you have only 3 attempts and you will temporary blocked.)")
    }
    const {accessToken} = await generateAccessToken(user._id);

    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(
            200,
            {
                username:user.username,
                email:user.email,
                accessToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    const options ={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .json(new ApiResponse(200,{},"Logout successfully"));
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    
    console.log("Get user : ",req.user)
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"User fetched successfully."))
})


// const seePassword = asyncHandler(async(req,res)=>{
//     const {username,website,upassword,keyword} = req.body;
//     const ownerId = req.user._id;

//     try{
//         const owner = await User.findById(ownerId);
//         if(!owner){
//             throw new ApiResponse(200,{count:0},"User have not saved any password yet.")
//         }

//         const dpassword = decryptWithKeyword(upassword,keyword);
//         console.log("decrypted password : ",dpassword);
//         const dusername = decryptWithKeyword(username,keyword);
//         console.log("decrypted Website : ",dusername);
//         const dwebsite = decryptWithKeyword(website,keyword);

//         return res.status(200).json(
//             new ApiResponse(200,{
//                 website:dwebsite,
//                 username:dusername,
//                 password:dpassword,
//                 created:createdAt
//             },"Password saved successfully.")
//         )
//     }catch(error){
//         throw new ApiError(500,"Failed to fetch password. Try again")
//     }
// })


const deletePassById = asyncHandler(async(req,res)=>{

})
export {
    signUpUser,
    signInUser,
    logoutUser,
    getCurrentUser
    // seePassword
}