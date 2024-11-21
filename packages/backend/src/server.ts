import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('API del Menú de Restaurante');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

