import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new mongoose.Schema({
   status:{
      type: String,
      require: true
   },  
   payment:{
      type: Object,
      require: true
   },
   user_id: {
      type: String,
      require: true
   }
},{
   timestamps: true,
});

export default mongoose.model("Payment",PaymentSchema);