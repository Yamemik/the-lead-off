import TypeBuyerModel from '../models/TypeBuyer.js';


 export const getAllTB = async(req,res) => {
    /*
       #swagger.tags = ["Settings"]
       #swagger.summary = 'Получить все типы организации'
    */   
    try{
       const entity = await TypeBuyerModel.find().exec().catch((err)=>{
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
 
 export const getOneTB = async(req,res) => {
    /*
       #swagger.tags = ["Settings"]
       #swagger.summary = 'Получить один тип орг'
    */   
    try{
       const entityId = req.params.id;
 
       const entity = await TypeBuyerModel.findById(entityId).catch((err)=>{
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

 //скрытые запросы//

 export const createTB = async (req, res) => {
   /*
      #swagger.tags = ["Settings"]
      #swagger.summary = 'Создание типa организации'
      #swagger.deprecated = true
   */
   try{
      const doc = new TypeBuyerModel({
        name: req.body.name,
        index: req.body.index
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

 export const updateTB = async(req,res) => {
   /*
      #swagger.tags = ["Settings"]
      #swagger.summary = 'Изменить тип орг'
   */   
   await TypeBuyerModel.updateOne({_id:req.params.id},{
      $set: { 
         name: req.body.name, 
         index: req.body.index 
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

export const removeTB = async(req,res) => {
   /*
      #swagger.tags = ["Settings"]
      #swagger.summary = 'удалить тип орг'
      #swagger.deprecated = true
   */   
   await TypeBuyerModel.findByIdAndDelete(req.params.id)
   .then(()=> res.json({
      access: true
   })).catch((err)=>{
      console.log(err);
      res.status(404).json({
         message: "not found or delete"
      });
   });
}