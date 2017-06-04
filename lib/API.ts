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

export interface ResponseCollectionLast {
  artist: string
  title: string
  year: number
}

interface DiscogsCollections {
  pagination: {
    items: number
  }

  releases: {
    basic_information: {
      artists: {
        name: string
      }[]
      title: string
      year: number
    }
  }[]
}

export default class API {
  constructor(private username: string, private token: string) { }

  public Token(): string {
    return this.token
  }

  public Items(): Promise<ResponseCollectionItems> {
    return this.request('users/' + this.username + '/collection/folders/0/releases', 'sort=added&sort_order=desc&per_page=1').then(
      (res: {json: Function}) => res.json()
    ).then(
      (res: DiscogsCollections) => ({ items: res.pagination.items })
    )
  }

  public Last(): Promise<ResponseCollectionLast> {
    return this.request('users/' + this.username + '/collection/folders/0/releases', 'sort=added&sort_order=desc&per_page=1').then(
      (res: {json: Function}) => res.json()
    ).then(
      (res: DiscogsCollections) => ({
        artist: res.releases[0].basic_information.artists[0].name,
        title: res.releases[0].basic_information.title,
        year: res.releases[0].basic_information.year
      })
    )
  }

  public Value(): Promise<ResponseCollectionValue> {
    return this.request('users/' + this.username + '/collection/value').then(
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
