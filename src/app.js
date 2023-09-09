import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { __dirname } from './dirname.js';
import { connectMongo } from './utils/connections.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import productsRoutes from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import realtimeRouter from './routes/realtime.router.js';
import productsViewRouter from './routes/productsView.router.js';
import cartViewRouter from './routes/cartView.router.js';
import loginRouter from './routes/login.router.js';
import registerRouter from './routes/register.router.js';
import { userRouter } from './routes/users.router.js';
import { routerMessages } from "./routes/messages.router.js";
import { sessionRouter } from "./routes/session.router.js";
import { ProductService } from './services/products.service.js';
import { MessageService } from './services/messages.service.js';
import { checkAdmin, checkUser } from './middlewares/auth.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import 'dotenv/config.js';
import { faker } from '@faker-js/faker';
import { logger } from './utils/logger.js';
import { specs } from './utils/swagger.js';
import swaggerUiExpress from 'swagger-ui-express';
//import { ProductModel } from './daos/models/products.model.js';

connectMongo();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const port = 8080;

const productService = new ProductService();
const messageService = new MessageService();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '\\views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '\\public'));
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.CONNECTION_URL, ttl: 86400 * 7 }),
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport();

app.use(passport.initialize());
app.use(passport.session());
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/realtimeproducts", realtimeRouter);
app.use("/chat", routerMessages);
app.use("/products", productsViewRouter);
app.use("/cart", cartViewRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);

io.on('connection', (socket) => {
  socket.on('add_product', async (newProduct) => {
    try {
      const addedProduct = await productService.addProduct(newProduct);
      io.emit("new_item", addedProduct);
    } catch (err){
      logger.error(err);
    }
  });
  socket.on('send_message', checkUser, async (data) => {
    try {
      const addedMessage = await messageService.addMessage(data);
      io.emit('new_message', addedMessage);
    } catch (err) {
      logger.error(err);
    }
  })
})

app.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render('errorPage', {msg: "No se pudo cerrar la sesion"});
    }
    return res.redirect("/login");
  })
})

app.get('/solo-para-admin', checkAdmin, async (req, res) => {
  res.send("Si estas viendo esto, es por que estas logueado como administrador.")
})

app.get('/mockingproducts', async (req, res) => {
  const products = [];
  for (let i = 0; i < 400; i++) {
    products.push({
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      code: faker.string.alphanumeric(10),
      price: faker.commerce.price(),
      stock: faker.number.int(9999),
      category: faker.commerce.productAdjective()
    })
  }
  res.status(200).json(products);
})

app.get('/loggerTest', async (req, res) => {
  logger.fatal("Testing fatal");
  logger.error("Testing error");
  logger.warning("Testing warning");
  logger.info("Testing info");
  logger.http("Testing http");
  logger.debug("Testing debug");
  res.status(200).send("OK");
});

app.get('*', (req, res) => {
  res.status(404).json({"error": "Page not found."});
});

httpServer.listen(port, () => {
/*   const products = [];
  for (let i = 0; i < 400; i++) {
    products.push({
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      code: faker.string.alphanumeric(10),
      price: faker.commerce.price(),
      stock: faker.number.int(9999),
      category: faker.commerce.productAdjective()
    })
  }
  ProductModel.insertMany(products); */
  logger.info(`Server running on port ${port}`);
});