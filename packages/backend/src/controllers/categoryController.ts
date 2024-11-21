import { Request, Response } from 'express';
import Category, { ICategory } from '../models/Category';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories: ICategory[] = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category: ICategory | null = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la categoría', error });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCategory: ICategory = new Category(req.body);
    const savedCategory: ICategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la categoría', error });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedCategory: ICategory | null = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la categoría', error });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedCategory: ICategory | null = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría', error });
  }
};

