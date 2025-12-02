import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import dbConfig from './config/dbConfig.js';

const server = express();
const PORT = process.env.PORT || 5000;


server.use(cors());
server.use(express.json());
dbConfig;
server.use('/api/v1/auth',userRoutes)

server.get('/', (req, res) => {
  res.send('API is running...');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
