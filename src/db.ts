import { MongoClient, Collection, WithId } from 'mongodb'

import config from './config'
import {
  ICompany,
  IHotCompanies,
  IHotJobs,
  IJobs,
  IToken,
  IUser,
  IFile
} from './types'

let client: MongoClient
export let usersCollection: Collection<WithId<IUser>>
export let jobsCollection: Collection<WithId<IJobs>>
export let companiesCollection: Collection<WithId<ICompany>>
export let hotjobsuserCollection: Collection<WithId<IHotJobs>>
export let hotcompaniesCollection: Collection<WithId<IHotCompanies>>
export let tokensCollection: Collection<WithId<IToken>>
export let applycompanyCollection: Collection<WithId<ICompany>>
export let fileCollection: Collection<WithId<IFile>>
export async function connect() {
  client = await MongoClient.connect(`mongodb://${config.mongo_host}`)
  const db = client.db(config.mongo_db)
  usersCollection = db.collection('users')
  jobsCollection = db.collection('jobs')
  companiesCollection = db.collection('companies')
  hotjobsuserCollection = db.collection('hotjobs')
  hotcompaniesCollection = db.collection('hotcompanies')
  tokensCollection = db.collection('tokens')
  applycompanyCollection = db.collection('applycompany')
  fileCollection = db.collection('files')
}
