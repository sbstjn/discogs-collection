import * as fetchMock from 'fetch-mock'
import API from '../lib/API'

describe('API', () => {
  afterEach(fetchMock.restore)

  it('define user token', () => {
    const Discogs = new API('username', 'lorem')

    expect(Discogs.Token()).toBe('lorem')
  })

  it('requests value', done => {
    fetchMock.mock('https://api.discogs.com/users/username/collection/value?token=lorem', {
      status: 200,
      body: {
        maximum: '€30,000.00',
        minimum: '€15,000.00',
        median: '€20,000.00'
      }
    })

    const Discogs = new API('username', 'lorem')

    Discogs.Value().then(
      data => {
        expect(data.maximum).toEqual(30000)
        expect(data.minimum).toEqual(15000)
        expect(data.median).toEqual(20000)

        done()
      }
    ).catch(
      done.fail
    )
  })

  it('requests items', done => {
    fetchMock.mock('https://api.discogs.com/users/username/collection/folders/0/releases?token=lorem&sort=added&sort_order=desc&per_page=1', {
      status: 200,
      body: { pagination: { items: 50 } }
    })

    const Discogs = new API('username', 'lorem')

    Discogs.Items().then(
      data => {
        expect(data.items).toEqual(50)

        done()
      }
    ).catch(
      done.fail
    )
  })

  it('requests last', done => {
    fetchMock.mock('https://api.discogs.com/users/username/collection/folders/0/releases?token=lorem&sort=added&sort_order=desc&per_page=1', {
      status: 200,
      body: {
        'pagination': {
          'items': 267
        },
        'releases': [
          {
            'basic_information': {
              'artists': [
                {
                  'name': 'Lakman'
                }
              ],
              'title': 'Aus Dem Schoß Der Psychose',
              'year': 2016
            }
          }
        ]
      }
    })

    const Discogs = new API('username', 'lorem')

    Discogs.Last().then(
      data => {
        expect(data.title).toEqual('Aus Dem Schoß Der Psychose')
        expect(data.artist).toEqual('Lakman')
        expect(data.year).toEqual(2016)

        done()
      }
    ).catch(
      done.fail
    )
  })
})