// import { useMutation, useQuery } from '@apollo/client'
// import { UpdateNameDocument, ViewerDocument } from 'lib/graphql-operations'
// import Link from 'next/link'
// import { useState } from 'react'
// import { initializeApollo } from '../lib/apollo'
// import { Alert } from 'flowbite-react'
import { Navbar } from 'components/navbar'
import KwhPrice from '@components/kwhPrice'
import { nordpool } from 'nordpool'
import dayjs from 'dayjs'
import dayjsPluginUtc from 'dayjs/plugin/utc.js'
import dayjsPluginTimezone from 'dayjs/plugin/timezone.js'
dayjs.extend(dayjsPluginUtc) // Used by timezone
dayjs.extend(dayjsPluginTimezone) // Used to convert from one timezone to another

const Index = () => {
  // prices.hourly().then((results) => {
  //   for (const item of results) {
  //     const row = item.date + ': ' + item.value + ' €/kWh in ' + item.area
  //     console.log(row)
  //   }
  // })

  // const { data } = useQuery(ViewerDocument)
  // const [newName, setNewName] = useState('')
  // const [updateNameMutation] = useMutation(UpdateNameDocument)

  return (
    <div className="container mx-auto space-y-10">
      <Navbar />
      <KwhPrice />
      {/* <div className="grid grid-flow-row-dense grid-cols-4 grid-rows-3">
        <div className="text-xl"></div>
        <div className="col-start-3">04</div>
        <div className="col-start-4">05</div>
      </div> */}
    </div>
  )
}

export async function getServerSideProps(context) {
  const prices = new nordpool.Prices()
  const formatter = new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: 'NOK',
  })
  const opts = {
    area: 'Kr.sand', // https://www.nordpoolgroup.com/en/Market-data1/Dayahead/Area-Prices/NO/Hourly/?view=table
    currency: 'NOK', // can also be 'DKK', 'EUR', 'NOK'
    // from: '2022-09-17',
    to: '2022-09-17 21:00',
  }
  let results
  try {
    results = await prices.hourly(opts)
  } catch (error) {
    console.error(error)
    return
  }
  console.log(results)
  for (let i = 0; i < results.length; i++) {
    const date = results[i].date
    const price = results[i].value
    const time = dayjs.tz(date, 'UTC').tz('Europe/Oslo').format('D.M. H:mm')
    // console.log(time + '\t' + formatter.format(price / 1000) + '/kWh')
  }
  return {
    props: { data: 'test' }, // will be passed to the page component as props
  }
}

export default Index
