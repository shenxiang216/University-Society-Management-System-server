import { ObjectId } from 'mongodb'
import * as db from '../db'
import { IUser, Sex, Status, UserRole } from '../types'
import { stats } from '../stats'
import * as crypto from 'crypto'
import { Sha1 } from '../middlewares/tools'
// 1、用户登陆、注册   修改
export async function adminLogin(username: string, password: string) {
  const hash = crypto.createHash('sha1')
  hash.update(password)
  const psw = hash.digest('hex')
  const result = await db.usersCollection.findOne({
    username: username,
    password: psw
  })
  if (result) {
    const newToken = crypto.randomBytes(12).toString('hex')
    const token = await db.tokensCollection.findOneAndUpdate(
      {
        userId: new ObjectId(result._id)
      },
      {
        $set: { userToken: newToken }
      }
    )
    if (token.value === null) {
      const newTokenResult = await db.tokensCollection.insertOne({
        userId: new ObjectId(result._id),
        userToken: newToken
      })
    }
    return {
      // 登陆成功返回值
      newToken, // 返回的token 给router设置cookie中的token
      user: result,
      message: 'login success'
    }
  } else {
    // 未注册
    const result = await db.usersCollection.findOne({
      username: username
    })
    if (result) {
      throw stats.ERR_LOGIN
    }
    const user: IUser = {
      username: username,
      password: psw,
      nickname: '默认用户101',
      role: UserRole.Worker,
      sex: Sex.Man,
      photo: '9a90590306f556da3ca7732f26463d11',
      position: '暂无职位',
      interested: [],
      state: Status.Normal,
      myCompany: null
    }
    const register = await db.usersCollection.insertOne(user)
    // adminLogin(username, password)
    return {
      message: 'Not found user,but register success'
    }
  }
}

// 2、用户退出登录 7.29 tsk
export async function logout(token: string) {
  const result = await db.tokensCollection.findOneAndDelete({
    userToken: token
  })
}

// 3、获取个人信息 hm
export async function UserInfo(token: string) {
  const user = await hasLogin(token)
  if (user != null) {
    const result = await db.usersCollection.findOne(
      { _id: user._id },
      { projection: { password: false } }
    )
    return result
  }
  throw stats.ERR_NOT_FOUND
}

// 3、获取个人信息 hm
export async function Info(token: string, username: string) {
  const user = await hasLogin(token)
  if (user != null) {
    const result = await db.usersCollection.findOne(
      { username: username },
      { projection: { password: false } }
    )
    return result
  }
  throw stats.ERR_NOT_FOUND
}

// 4、更新个人信息
export async function updUserinfo(record: IUser, token: string) {
  const user = await hasLogin(token)
  if (user != null) {
    const result = await db.usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          photo: record.photo,
          nickname: record.nickname,
          sex: record.sex,
          position: record.position
        }
      }
    )
    return result
  }
  throw stats.ERR_NOT_FOUND
}

// 5、修改密码 tsk
export async function password(
  token: string,
  oldPassword: string,
  newPassword: string
) {
  if (oldPassword === newPassword) {
    return {
      message: '原密码与新密码不能相同'
    }
  }
  const user = await hasLogin(token)
  if (user === null) {
    throw stats.ERR_NOT_FOUND
  }
  const oldPsw = Sha1(oldPassword)
  if (user.password === oldPsw) {
    const newPsw = Sha1(newPassword)
    const result = await db.usersCollection.findOneAndUpdate(
      {
        _id: user._id
      },
      {
        $set: { password: newPsw }
      }
    )
    return { message: '修改密码成功' }
  } else {
    return { message: '原密码错误' }
  }
}

/** 功能函数 获取登录信息 */
async function hasLogin(token: string) {
  const tokens = await db.tokensCollection.findOne({
    userToken: token
  })
  if (tokens != null) {
    const user = await db.usersCollection.findOne({
      _id: tokens.userId
    })
    return user
  }
  return null
}

// 添加兴趣
export async function addInterest(token: string, id: string) {
  const user = await hasLogin(token)
  if (user != null) {
    const title = await db.jobsCollection.findOne({
      _id: new ObjectId(id)
    })
    const result = await db.usersCollection.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { interested: { id: id, title: title.title } } }
    )
    return result
  }
}

// 查看兴趣
export async function findInterest(token: string) {
  const user = await hasLogin(token)
  if (user != null) {
    const result = await db.usersCollection.findOne(
      {
        _id: new ObjectId(user._id)
      },
      { projection: { interested: true, _id: false } }
    )
    return result
  }
}

// 删除兴趣
export async function delInterest(token: string, id: string) {
  const user = await hasLogin(token)
  if (user === null) throw stats.ERR_NOT_FOUND
  await db.usersCollection.updateOne(
    {
      _id: new ObjectId(user._id)
    },
    { $pull: { interested: { id: id } } }
  )
}
