import mongoose, { Schema } from 'mongoose';

const TypeBuyerSchema = new mongoose.Schema({  
   name:{
      type: String,
      require: false
   },
   index:{
      type: Number,
      require: true
   }
},{
   timestamps: true,
});

export default mongoose.model("TypeBuyer",TypeBuyerSchema);