import * as Router from 'koa-router'

import userRouter from './routers/user.router'
import superAdminRouter from './routers/superAdmin.router'
import jobsRouter from './routers/jobs.router'
import companyRouter from './routers/company.router'
import adminRouter from './routers/admin.router'
import companyManage from './routers/companyManage.router'
import fileRouter from './routers/file.router'
const router = new Router()
router.use(userRouter.routes())
router.use(superAdminRouter.routes())
router.use(jobsRouter.routes())
router.use(companyRouter.routes())
router.use(adminRouter.routes())
router.use(companyManage.routes())
router.use(fileRouter.routes())
export default router
