import { IMapCenter } from '../types'
import axios from 'axios'
import * as crypto from 'crypto'
// 地址转经度纬度
export async function GetXY(address: string) {
  const key: string = '2961583f62cde1f1489064bc604e2214'
  const url =
    'https://restapi.amap.com/v3/geocode/geo?address=' +
    encodeURI(address) +
    '&key=' +
    key
  try {
    const result = await axios.get(url)
    const XYdata: string[] = result.data.geocodes[0].location.split(',')
    const res: IMapCenter = {
      longitude: XYdata[0],
      latitude: XYdata[1]
    }
    return res
  } catch (error) {
    console.log(error)
  }
}

// 加密
export function Sha1(psw: string) {
  const hash = crypto.createHash('sha1')
  hash.update(psw)
  return hash.digest('hex')
}
