import RateModel from '../models/Rate.js';


 export const getAllSc = async(req,res) => {
    /*
       #swagger.tags = ["Settings"]
       #swagger.summary = 'Получить все коэф'
    */   
    try{
       const entity = await RateModel.find().exec().catch((err)=>{
          res.status(404).json({
             message: 'not found'
          })
       });
 
       res.json(entity);   
    }catch(err){
       console.log(err);
       res.status(500).json({
          message: "server error"
       });
    }
 }
 
 export const getOneSc = async(req,res) => {
    /*
       #swagger.tags = ["Settings"]
       #swagger.summary = 'Получение 1 коэффициента'
    */   
    try{
 
       const entity = await RateModel.find().catch((err)=>{
          res.status(404).json({
             message: 'not found'
          })
       });
 
       res.json(entity);        
    }catch(err){
       console.log(err);
       res.status(500).json({
          message: "server error"
       });
    }
 };

 export const createSc = async (req, res) => {
   /*
      #swagger.tags = ["Settings"]
      #swagger.summary = 'Создание коэффициентов'
      #swagger.deprecated = true
      #swagger.parameters['obj'] = {
                in: 'body',
                description: 'indexes',
                required: true,
                schema: { $ref: "#/definitions/Rate" }
      }
   */
   try{
      const doc = new RateModel({
         score:         req.body.score,
         type_buyer:    req.body.type_buyer,
         type_order:    req.body.type_order,
         is_urgent:     req.body.is_urgent,
         is_express:    req.body.is_express,
         count_region:  req.body.count_region,
         is_open:       req.body.is_open,
         is_sale:       req.body.is_sale
      });

      const entity = await doc.save();

      res.json(entity);   
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Failed to create"
      })
   }
};

 export const updateSc = async(req,res) => {
   /*
      #swagger.tags = ["Settings"]
      #swagger.summary = 'Измениние коэффициентов'
      #swagger.parameters['obj'] = {
                in: 'body',
                description: 'indexes',
                required: true,
                schema: { $ref: "#/definitions/Rate" }
      }
   */   
   await RateModel.updateOne({_id:req.params.id},{
      $set: { 
         $score:         req.body.score,
         $type_buyer:    req.body.type_buyer,
         $type_order:    req.body.type_order,
         $is_urgent:     req.body.is_urgent,
         $is_express:    req.body.is_express,
         $count_region:  req.body.count_region,
         $is_open:       req.body.is_open,
         $is_sale:       req.body.is_sale
      }
   }).then(()=> res.json({
         access: true
   })).catch((err)=>{
         console.log(err);
         res.status(404).json({
            message: "not found or update"
         });
   });
}

export const removeSc = async(req,res) => {
   /*
      #swagger.tags = ["Settings"]
      #swagger.summary = 'удалить коэф'
      #swagger.deprecated = true
   */   
   await RateModel.findByIdAndDelete(req.params.id)
   .then(()=> res.json({
      access: true
   })).catch((err)=>{
      console.log(err);
      res.status(404).json({
         message: "not found or delete"
      });
   });
}

export const removeManySc = async(req,res) => {
   /*
      #swagger.tags = ["Settings"]
      #swagger.summary = 'удалить коэф-ты'
      #swagger.deprecated = true
   */   
   await RateModel.deleteMany({_id: { $in: req.body.rates}})
   .then(()=> res.json({
      access: true
   })).catch((err)=>{
      console.log(err);
      res.status(404).json({
         message: "not found or delete"
      });
   });
}