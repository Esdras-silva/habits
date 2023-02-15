import axios from "axios";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { z } from "zod";
import { prisma } from "../lib/prisma";



class UserRoutes{
 
  async createAndLogin (req: Request, res: Response){
    const createUserBody = z.object({
      access_token: z.string(),
    })

    const { access_token } = createUserBody.parse(req.body)

    await axios('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    }).then(async (response) =>{
      const userData = await response.data

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    })

    const userInfo = userInfoSchema.parse(userData)

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        }
      })
    }
   
  

    const token = jwt.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },`${process.env.SECRET}`,{
      expiresIn: '7 days'
    })

    return res.send({token})
    }).catch(e=>{
      console.log(e);
      
    })

    
  }

  async userInfo (req: Request,res: Response){
    return res.json({ user: req.user })
  }

}

export const userRoutes = new UserRoutes()
