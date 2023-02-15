import dayjs from "dayjs"
import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import moment from "moment"

class DayRoutes{
  async Day (req: Request, res: Response){
    const getDayParams = z.object({
      date: z.coerce.date(),
    })

    const { date } = getDayParams.parse(req.query)
      
    const parsedDate = moment().tz('America/Belem')
    const weekDay = parsedDate.get('day')

    

    const day = await prisma.day.findFirst({
      where: {
        date: parsedDate.toDate(),
      },
     include:{
      completedHabit: {
        where:{
          userId: req.user.sub
        }
      },
     }
    })

    const possibleHabits = await prisma.habit.findMany({
      where:{
         created_at:{
          lte: parsedDate.toDate()
         },
         weekDays:{
          some:{
            week_day: weekDay,
          }
         },
         user_id: req.user.sub
      }
    })

    

    const completedHabits = day?.completedHabit.map(dayHabig => {
    
        return dayHabig.habitId
      
    }) as string[] ?? []

    return res.status(200).json({
      possibleHabits,
      completedHabits,
  })}
  }



export const dayRoutes = new DayRoutes()