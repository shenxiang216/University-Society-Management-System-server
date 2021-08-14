import * as fs from 'fs'
import * as path from 'path'
import { MongoClient, Collection, ObjectId, Db, InsertOneResult } from 'mongodb'

import {
  IUser,
  ICompany,
  IJobs,
  IHotJobs,
  IHotCompanies,
  IToken,
  UserRole,
  Status
} from './types'

let client: MongoClient
let userCollection: Collection<IUser>
let companyCollection: Collection<ICompany>
let jobsCollection: Collection<IJobs>
let hotjobsCollection: Collection<IHotJobs>
let hotcompaniesCollection: Collection<IHotCompanies>
let tokenCollection: Collection<IToken>

async function connect() {
  client = await MongoClient.connect('mongodb://localhost:27017')
  const db = client.db('bossJobs')
  userCollection = db.collection('users')
  companyCollection = db.collection('companies')
  jobsCollection = db.collection('jobs')
  hotjobsCollection = db.collection('hotjobs')
  hotcompaniesCollection = db.collection('hotcompanies')
  tokenCollection = db.collection('tokens')
}

async function run() {
  try {
    await userCollection.drop()
    await companyCollection.drop()
    await jobsCollection.drop()
    await hotjobsCollection.drop()
    await hotcompaniesCollection.drop()
    await tokenCollection.drop()
  } catch (err) {}
  const userSource = await fs.promises.readFile(
    path.join(__dirname, '../src/assets/data/users.json'),
    'utf-8'
  )
  const jobsSource = await fs.promises.readFile(
    path.join(__dirname, '../src/assets/data/jobs.json'),
    'utf-8'
  )
  const companieSource = await fs.promises.readFile(
    path.join(__dirname, '../src/assets/data/companie.json'),
    'utf-8'
  )
  const userjson = JSON.parse(userSource)
  const jobsjson = JSON.parse(jobsSource)
  const companiejson = JSON.parse(companieSource)
  for (const user of userjson) {
    await userCollection.insertOne(user)
  }
  const userId: ObjectId[] = []
  for (const jobs of jobsjson) {
    const obj = {
      companyName: jobs.company
    }
    for (const companie of companiejson) {
      if (companie.companyName === obj.companyName) {
        const time = new Date()
        const result = await companyCollection.insertOne({
          ...companie,
          refreshTime: time.toLocaleDateString(),
          state: Status.Normal
        })
        for (const user of jobs.user) {
          user.role = parseInt(user.role)
          let userboss: InsertOneResult<IUser>
          await userCollection
            .insertOne({
              ...user,
              myCompany: result.insertedId
            })
            .then(re => {
              userboss = re
              if (re.insertedId !== undefined && user.role === UserRole.Admin) {
                userId.push(re.insertedId)
              }
            })
          if (user.role === UserRole.Boss) {
            await companyCollection.updateOne(
              { _id: result.insertedId },
              { $set: { bossId: userboss.insertedId } }
            )
          }
        }
        for (const job of jobs.jobs) {
          const n = Math.floor(Math.random() * userId.length + 1) - 1
          const iss = userId[n]
          await jobsCollection.insertOne({
            ...job,
            ownedCompany: result.insertedId,
            issuer: iss
          })
        }
      }
    }
  }
  for (const jobs of jobsjson) {
    for (const job of jobs.jobs) {
      await hotjobsCollection.insertOne({
        jobName: job.jobName
      })
    }
  }
  const results = await companyCollection.find().toArray()
  // for (const result of results) {
  //   await hotcompaniesCollection.insertOne({
  //     companyId: result._id,
  //     companyName: result.companyName,
  //     companyLogo: result.companyLogo
  //   })
  // }

  client.close()
}
connect().then(run)
