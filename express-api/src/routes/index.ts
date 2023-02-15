import {Request, Response, Router} from "express"
import { prisma } from "../lib/prisma"
import { habitsRoutes } from "./HabitsRoutes"
import { AuthMiddleware } from "./middlewares/authMiddleware"
import { dayRoutes } from "./DayRoutes"
import { userRoutes } from "./UserRoutes"
import '../lib/dayjs'
const router = Router()

router.get('/',(req:Request, res: Response) => {
  return res.send('Express Typescript on Vercel')
})

router.post('/habits', AuthMiddleware, habitsRoutes.createHabit)
router.delete('/habits/:id', AuthMiddleware, habitsRoutes.habitRemove)
router.get('/day', AuthMiddleware, dayRoutes.Day)
router.patch('/habits/:id/toggle', AuthMiddleware, habitsRoutes.toggleHabit)
router.get('/summary', AuthMiddleware, habitsRoutes.summary)
router.post('/users', userRoutes.createAndLogin)
router.get('/me', AuthMiddleware, userRoutes.userInfo)


export {router}