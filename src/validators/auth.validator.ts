import { body } from 'express-validator';
import { UserRole } from '../types/roles.js';

export const registerValidation = [

  body('nombres')
    .notEmpty().withMessage('Los nombres son obligatorios'),

  body('apellidos')
    .notEmpty().withMessage('Los apellidos son obligatorios'),

  body('email')
    .isEmail().withMessage('Debe ser un email válido'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener mínimo 6 caracteres'),

  body('rol')
    .isIn(Object.values(UserRole))
    .withMessage('Rol inválido'),

  body('edad').optional().isNumeric().withMessage('La edad debe ser un número'),
  body('genero').optional().isIn(['MASCULINO', 'FEMENINO', 'OTRO']).withMessage('Género inválido'),
  body('direccion').optional().isString().withMessage('La dirección debe ser una cadena de texto'),

];