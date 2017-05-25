import API, { CollectionValue } from '../lib/API'
import * as AWS from 'aws-sdk'

const Discogs = new API(process.env.TOKEN)
const CloudWatch = new AWS.CloudWatch()

function save({ minimum, median, maximum }: CollectionValue): Promise<CollectionValue> {
  return CloudWatch.putMetricData(
    {
      Namespace: 'Discogs',
      MetricData: [
        {
          MetricName: 'Value',
          Dimensions: [
            {
              Name: 'CollectionValue',
              Value: 'Maximum'
            }
          ],
          Timestamp: new Date(),
          Value: maximum,
          Unit: 'Count'
        },
        {
          MetricName: 'Value',
          Dimensions: [
            {
              Name: 'CollectionValue',
              Value: 'Minimum'
            }
          ],
          Timestamp: new Date(),
          Value: minimum,
          Unit: 'Count'
        },
        {
          MetricName: 'Value',
          Dimensions: [
            {
              Name: 'CollectionValue',
              Value: 'Median'
            }
          ],
          Timestamp: new Date(),
          Value: median,
          Unit: 'Count'
        }
      ]
    }
  ).promise().then(
    () => ({ minimum, median, maximum })
  )
}

export function handler(event: {}, context: {}, callback: Function) {
  Discogs.value().then(
    save
  ).then(
    ({ minimum, maximum, median }) => callback(null, { minimum, maximum, median })
  ).catch(
    (error) => callback(error)
  )
}