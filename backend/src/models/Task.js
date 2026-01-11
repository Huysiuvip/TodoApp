import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ["active", "complete"],
        default: "active",
    },
    completeAt:{
        type: Date,
        default: null,
    },
   
},
 {
        timestamps: true,  // createDate UpdatedAt
    }
)

const Task = mongoose.model("Task", taskSchema);
export default Task;