import {FastifyReply, FastifyRequest,FastifyInstance } from "fastify";
import jwt from '@fastify/jwt'
import { UserRoutes } from "./routes/UserRoutes";
import { HabitsRoutes } from "./routes/HabitsRoutes";
import { DayRoutes } from "./routes/DayRoutes";

export default async (fastify: FastifyInstance,req: FastifyRequest, res: FastifyReply) =>{

  await fastify.register(jwt,{
    secret: 'esdton'
  })

  await fastify.register(UserRoutes)
  await fastify.register(HabitsRoutes)
  await fastify.register(DayRoutes)
}