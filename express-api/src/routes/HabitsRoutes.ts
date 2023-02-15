import dayjs from "dayjs";
import { Request, Response } from "express";
import { coerce, z } from "zod";
import { prisma } from "../lib/prisma";
import moment from 'moment-timezone'

export class HabitsRoutes{

  async createHabit (req: Request, res: Response) {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      ),
    })

    const { title, weekDays } = createHabitBody.parse(req.body)

    const today = moment(Date.now()).startOf('d').tz('America/Belem').toDate()
    const habit = await prisma.habit.create({
      data: {
        title,
        user_id:req.user.sub,
        weekDays:{
          create: weekDays.map(i => {return {
            week_day: i
          }})
        },
        created_at: today
      }
    })

    return res.status(201).json({habit})
  }

  async habitRemove(req: Request, res: Response){
    const idHabitBody = z.object({
      id: z.string(),
    })

    const {id} = idHabitBody.parse(req.params)

    const habitExists= await prisma.habit.findUnique({
      where:{
        id
      }
    })

    if(habitExists){
      const removedHabits = await prisma.habit.delete({
        where:{
          id
        },include:{
          weekDays:{
            where:{
              habit_id: id,
  
            }
          },
        }
      })
      return res.status(200).json({removedHabits})
    } else {
      return res.status(402).jsonp("Nao foi encontrado")
    }

    
  }
  

  async toggleHabit(req: Request, res: Response){
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    })

    


    const { id} = toggleHabitParams.parse(req.params)


    const today = moment(Date.now()).tz('America/Belem').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    })

    if(!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        }
      })
    }

    const completedHabit = await prisma.completedHabit.findUnique({
      where:{
        day_id_habitId_userId:{
          day_id: day.id,
          habitId: id,
          userId: req.user.sub
        }
      }
    })
    
    if(completedHabit){
     const update = await prisma.completedHabit.delete({
        where:{
          id: completedHabit.id
        },
        
      })

      return  res.status(200).json({update})
    } else {
     const create =  await prisma.completedHabit.create({
        data:{
          day_id: day.id,
          habitId: id,
          userId: req.user.sub
        }
      })

      return res.status(200).json({create})
    }

    
  }

  async summary(req: Request, res: Response){
   
    
    const summary = await prisma.$queryRaw`
    SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM completed_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON H.id = HDW.habit_id
            AND H.user_id = ${req.user.sub}
          WHERE
            HDW.week_day = cast(TO_CHAR(D.date , 'ID') as int )
            AND H.created_at <= D.date
        ) as amount
      FROM days D
  `

  return res.status(200).json({summary, iduser: req.user.sub})
  }
}

export const habitsRoutes = new HabitsRoutes()