import fetch from 'node-fetch'
import * as util from 'util'

export interface CollectionValue {
  minimum: number
  median: number
  maximum: number
}

export default class API {
  constructor(private token: string) { }

  request(url: string, query?: string): Promise<{}> {
    return fetch(
      util.format('https://api.discogs.com/%s?token=%s&%s', url, this.token, query)
    )
  }

  items(): Promise<{ items: number }> {
    return this.request('users/' + process.env.USERNAME + '/collection/folders/0/releases', 'sort=added&sort_order=desc&per_page=1').then(
      (res: {json: Function}) => res.json()
    ).then(
      (res: { pagination: { items: number } }) => {
        return {
          items: res.pagination.items
        }
      }
    )
  }

  value(): Promise<{ maximum: number, median: number, minimum: number}> {
    return this.request('users/' + process.env.USERNAME + '/collection/value').then(
      (res: {json: Function}) => res.json()
    ).then(
      (res) => {
        Object.keys(res).map((key) => {
          res[key] = Number(res[key].replace(/[^0-9\.]+/g, ''))
        })

        return res
      }
    )
  }
}
