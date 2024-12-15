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

// History Schema
const HistorySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },
    productIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    }]
}, { timestamps: true });

const History = mongoose.model('History', HistorySchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        default: function () {
            return new mongoose.Types.ObjectId();
        }
    },
    category: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    productLink: {
        type: String,
        required: true,
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
    History,
    Product,
    Chat,
    ChatHistory
};



