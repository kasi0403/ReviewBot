const mongoose = require("mongoose")

const RegisterSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true,'Please add a name']
    },
    email : {
        type: String,
        required : [true,'Please add an email'],
        unique : true
    },
    password : {
        type: String,
        required : [true,'Please add a password'],
    },
},
{
    timestamps:true
}
)

const RegisterModel = mongoose.model("users",RegisterSchema)



// products list

const ProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    productName: {
        type: String,
        required: true,
    },
    reviewList: [{
        reviewText: String,
        reviewRating: {
            type: Number,
            min: 0,
            max: 5,
            required: true,
        },
    }],
    AvgRating: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewSummary: {
        type: String,
        required: true,
    },
    pros: {
        type: [String],
    },
    cons: {
        type: [String],
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);


// specific chats
const ChatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    conversation:{
        type:Map,
        of:String,
        required: true,
    }
},{timestamps:true});
const Chat = mongoose.model("chats",ChatSchema)



// chats list for every user
const ChatHistorySchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'users'
    },
    // store the id's of the chats 
    chat : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'chats'  
    }]
},{timestamps:true});

const ChatHistory = mongoose.model("chatHistory",ChatHistorySchema)

module.exports = {
    RegisterModel,
    Product,
    Chat,
    ChatHistory
};



