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

  items(): Promise<{ items: number, last: { artist: string, title: string, year: number } }> {
    return this.request('users/sbstjn/collection/folders/0/releases', 'sort=added&sort_order=desc&per_page=1').then(
      (res: {json: Function}) => res.json()
    ).then(
      (res: {releases: {}, pagination: { items: number }}) => {
        return {
          items: res.pagination.items,
          last: {
            artist: res.releases[0].basic_information.artists[0].name,
            title: res.releases[0].basic_information.title,
            year: res.releases[0].basic_information.year
          }
        }
      }
    )
  }

  value(): Promise<{ maximum: number, median: number, minimum: number}> {
    return this.request('users/sbstjn/collection/value').then(
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
