import { body } from 'express-validator';

export const registerValidation = [
   body('fio','Введите фио').isLength({ min: 3 }),
   body('email','Введите почту').isEmail(),
   body('telephone','Введите ').isString(),
   body('organization','Выберите форму организации').isBoolean(),
   body('region','Укажите страну').isLength({ min: 3 }),
   body('business_line','').isArray(),
   body('access_to_open','Выберите доступ').isBoolean(),
   body('isAdmin','').isBoolean(),
   body('balance','').isNumeric()
]

export const loginValidation = [
   body('login','Введите логин').isLength({ min: 3 }),
   body('password','Введите пароль').isLength({ min: 6 })
]
