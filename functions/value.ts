import API, { ResponseCollectionValue } from '../lib/API'
import * as AWS from 'aws-sdk'

const Discogs = new API(process.env.TOKEN)
const CloudWatch = new AWS.CloudWatch()

function build(name: string, value: number): AWS.CloudWatch.MetricDatum {
  return {
    MetricName: 'Value',
    Dimensions: [
      {
        Name: 'CollectionValue',
        Value: name
      }
    ],
    Timestamp: new Date(),
    Value: value,
    Unit: 'Count'
  } 
}

function save({ minimum, median, maximum }: ResponseCollectionValue): Promise<ResponseCollectionValue> {
  return CloudWatch.putMetricData(
    {
      Namespace: 'Discogs',
      MetricData: [
        build('Maximum', maximum),
        build('Minimum', minimum),
        build('Median', median)
      ]
    }
  ).promise().then(
    () => ({ minimum, median, maximum })
  )
}

export function handler(event: {}, context: {}, callback: Function): void {
  Discogs.Value().then(
    save
  ).then(
    ({ minimum, maximum, median }) => callback(null, { minimum, maximum, median })
  ).catch(
    (error) => callback(error)
  )
}