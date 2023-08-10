const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const dotenv=require("dotenv").config()

const app=express();
app.use(cors())
app.use(express.json({limit:"10mb"}))

const PORT= process.env.PORT || 8080


//MONGODB CONNECTION
console.log(process.env.MONGODB_URL)
mongoose.set('strictQuery',false);//comment this
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Connected to database "))
.catch((err)=>console.log(err))

//schema
const userSchema=mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type:String,
        unique:true,
    },
    password: String,
    confirmPassword: String,
    image:String,
})

// model
const userModel=mongoose.model("user",userSchema)






//API
app.get("/",(req,res)=>{
    res.send("server is running")
})

//sign up
app.post("/signup",(req,res)=>{
    console.log(req.body)
    const {email}=req.body

    userModel.findOne({email:email})
       .then((result) => {
        console.log(result)
        if(result){
            res.send({message:"Email id already register ",alert:false})
        }else{
            const data= userModel(req.body)    
            const save=  data.save()   
            res.send({message:"Successfully sign up",alert:true})
        }

       })
       .catch((error) => {
        console.log(error)

       })



        
    })

    // api login
    app.post("/login",(req,res) => {
        console.log(req.body)
        const {email}= req.body
        userModel.findOne({email:email})
        .then((result) => {
       
         if(result){
            // console.log(result)
            const dataSend ={
                _id:result._id,
                firstName:result.firstName,
                lastName: result.lastName,
                email: result.email,
                image:result.image,
            };
            console.log(dataSend)
             res.send({message:"login is successful ",alert:true,data:dataSend})
         
         }else{
            //  const data= userModel(req.body)    
            //  const save=data.save()   
             res.send({message:"email is not available,please sign up ",alert:false })
         }
 
        })
        .catch((error) => {
         console.log(error)
 
        });
    });
//product section

const schemaProduct=mongoose.Schema({
    name: String,
    category:String,
    image:String,
    price:String,
    description:String,
});
const productModel = mongoose.model("product",schemaProduct)

//save product in data
//api

app.post("/uploadProduct",async(req,res) => {
    console.log(req.body)
    const data = await productModel(req.body)
    const datasave=await data.save();
    res.send({message : "upload successfully"})



})

//
app.get("/product",async(req,res) => {
    const data=await productModel.find({})
    res.send(JSON.stringify(data));

})


















//server is running 
app.listen(PORT,()=>console.log("server is running at port : " +PORT))