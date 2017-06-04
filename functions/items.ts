import API, { ResponseCollectionItems } from 'discogs-basics'
import * as AWS from 'aws-sdk'

const Discogs = new API(process.env.USERNAME, process.env.TOKEN)
const CloudWatch = new AWS.CloudWatch()

function save({ items }: ResponseCollectionItems): Promise<ResponseCollectionItems> {
  return CloudWatch.putMetricData(
    {
      Namespace: 'Discogs',
      MetricData: [
        {
          MetricName: 'Items',
          Dimensions: [
            {
              Name: 'CollectionItems',
              Value: 'Current'
            }
          ],
          Timestamp: new Date(),
          Value: items,
          Unit: 'Count'
        }
      ]
    }
  ).promise().then(
    () => ({ items })
  )
}

export function handler(event: {}, context: {}, callback: Function): void {
  Discogs.Items().then(
    save
  ).then(
    ({ items }) => callback(null, { items })
  ).catch(
    (error) => callback(error)
  )
}