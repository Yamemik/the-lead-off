import PaymentSchema from '../models/Payment.js';


export const getAllPay = async (req, res) => {
   /*
      #swagger.tags = ["User"]
      #swagger.summary = 'Получить все платежи пользователя'
   */
   try {
      const entity = await PaymentSchema.find({ user_id: req.userId })
         .catch((err) => {
            res.status(404).json({
               message: 'not found payment'
            })
         });

      res.json(entity);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "server error"
      });
   }
}

export const createPay = async (req, res) => {
   /*
      #swagger.tags = ["User"]
      #swagger.summary = 'создать запись с платежом '
      #swagger.parameters['obj'] = {
                in: 'body',
                description: 'payment',
                required: true,
                schema: { $ref: "#/definitions/Payment" }
      }
   */
   try {
      const doc = new PaymentSchema({
         payment: req.body.payment,
         user_id: req.userId
      });

      const entity = await doc.save();

      res.json(entity);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Failed create to pay"
      })
   }
};

export const updatePay = async (req, res) => {
   /*
      #swagger.tags = ["User"]
      #swagger.summary = 'создать запись с платежом '
      #swagger.parameters['obj'] = {
                in: 'body',
                description: 'payment',
                required: true,
                schema: { $ref: "#/definitions/Payment" }
      }
   */
      await PaymentSchema.updateOne({_id:req.params.id},{
         $set: { 
            payment: req.body.payment,
         }
      }).then(()=> res.json({
            access: true
      })).catch((err)=>{
            console.log(err);
            res.status(404).json({
               message: "not found or update"
            });
      });
};

export const getAllPayAllUsers = async (req, res) => {
   /*
      #swagger.tags = ["Admin"]
      #swagger.summary = 'Получить все платежи'
   */
   try {
      const entity = await PaymentSchema.find()
      .catch((err) => {
         res.status(404).json({
            message: 'not found payment'
         })
      });

      res.json(entity);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "server error"
      });
   }
}

