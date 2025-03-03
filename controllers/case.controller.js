// controllers/caseController.js
import cloudinary from 'cloudinary'; 
import prisma from '../lib/prisma.js'; 
import { $Enums } from '@prisma/client';


export const createCase = async (req, res) => {
  try {
    const { title, description, location, category } = req.body;
    const createdByIdInt = parseInt(req.user.id, 10);

    
    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        location,
        category,
        status: 'PENDING',  
        createdBy: {
          connect: { id: createdByIdInt }, 
        },
      },
    });

    res.status(201).json({
      message: 'Case created successfully!',
      caseId: newCase.id,  
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating case' });
  }
};
