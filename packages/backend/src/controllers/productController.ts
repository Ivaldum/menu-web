import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import multer from 'multer';
import path from 'path';

// Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products: IProduct[] = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product: IProduct | null = await Product.findById(req.params.id).populate('category');
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

export const createProduct = [
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, price, category } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      const newProduct: IProduct = new Product({
        name,
        description,
        price,
        category,
        image
      });

      const savedProduct: IProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear el producto', error });
    }
  }
];

export const updateProduct = [
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, price, category } = req.body;
      const updateData: Partial<IProduct> = { name, description, price, category };
      
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updatedProduct: IProduct | null = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedProduct) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el producto', error });
    }
  }
];

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduct: IProduct | null = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};

