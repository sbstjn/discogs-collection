require('isomorphic-fetch')
import * as util from 'util'

export interface ResponseCollectionValue {
  minimum: number
  median: number
  maximum: number
}

export interface ResponseCollectionItems {
  items: number
}

export default class API {
  constructor(private token: string) { }

  public Token(): string {
    return this.token
  }

  public Items(): Promise<ResponseCollectionItems> {
    return this.request('users/' + process.env.USERNAME + '/collection/folders/0/releases', 'sort=added&sort_order=desc&per_page=1').then(
      (res: {json: Function}) => res.json()
    ).then(
      (res: {pagination: ResponseCollectionItems}) => ({ items: res.pagination.items })
    )
  }

  public Value(): Promise<ResponseCollectionValue> {
    return this.request('users/' + process.env.USERNAME + '/collection/value').then(
      (res: {json: Function}) => res.json()
    ).then(
      (res: ResponseCollectionValue) => {
        Object.keys(res).map((key) => {
          res[key] = Number(res[key].replace(/[^0-9\.]+/g, ''))
        })

        return res
      }
    )
  }

  private request(path: string, query?: string): Promise<Response> {
    return fetch(
      util.format('https://api.discogs.com/%s?token=%s%s', path, this.token, (query ? ('&' + query) : ''))
    )
  }
}
