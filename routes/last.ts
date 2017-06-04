import API from '../lib/API'

const Discogs = new API(process.env.USERNAME, process.env.TOKEN)

export function handler(event: {}, context: {}, callback: Function): void {
  Discogs.Last().then(
    (data) => callback(null, {
      statusCode: 200,
      body: JSON.stringify(data)
    })
  ).catch(
    (error) => callback(error)
  )
}