# ⚡️ Discogs Collection Info

[![license](https://img.shields.io/github/license/sbstjn/discogs-collection.svg)](https://github.com/sbstjn/discogs-collection/blob/master/LICENSE.md)

Crawl the value of your [Discogs](https://discogs.com) Collection with AWS Lambda and log `maximum`, `minimum`, and `median` collection values, as well as the number of items in your collection to custom CloudWatch metrics. 

![Discogs.com Collection Value](/cloudwatch.png)

## Install

```bash
$ > yarn install
```

## Configure

Make sure to update your Discogs username in `serverless.yml` or set the `USERNAME` environment variable before you deploy your functions.

## Deploy

First [create an access token](https://www.discogs.com/de/settings/developers) for accessing the Discogs API, then use [Serverless](https://serverless.com) to deploy everything:

```bash
$ > TOKEN=YOUR_DISCOGS_ACCESS_TOKEN yarn deploy && yarn invoke
```

## Usage

[Serverless](https://serverless.com) will configure a CloudWatch Schedule that triggers the AWS Lambda function every 10 minutes per default. Just update the `serverless.yml` configuration and deploy your updated interval.

```yaml
events:
  - schedule: rate(10 minutes)
```

## License

Feel free to use the code, it's released using the [MIT license](https://github.com/sbstjn/discogs-collection/blob/master/LICENSE.md).

## Contributors

- [Sebastian Müller](https://github.com/sbstjn)

## Contribution

You are more than welcome to contribute to this project! 😘

To make sure you have a pleasant experience, please read our [code of conduct](CODE_OF_CONDUCT.md). It outlines core values and believes and will make working together a happier experience.
