import express, { json, NextFunction, Request, Response } from 'express';
import { router } from './routes';
import cors from 'cors'

const app = express();

const port = process.env.PORT || 8080
app.use(json())

app.use((req: Request, res: Response, next: NextFunction) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers","Content-Type, Authorization")
    app.use(cors());
    next();
});

 app.use(router)

app.listen(port, () =>{
  return console.log(`Server is running on ${port}`)
})