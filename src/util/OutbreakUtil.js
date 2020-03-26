import { apiLocation, dbRoute } from '../env'
import { format } from 'date-fns'

export async function fetchJSON(url) {
  try {
    let res = await fetch(url)
    return await res.json()
  } catch (err) {
    console.log(err)
  }
}

export async function execFetch(date) {
  const queryString = `?state=wi${date ? `&date=${date}` : ''}`
  const url = `${apiLocation}${dbRoute}${queryString}`
  const today = format(new Date(), 'M/d/yyyy')
  let data = await fetchJSON(url)

  if (data.length === 0 && date === today) {
    data = await fetchDHS()
  }
  return data
}

export async function fetchDHS() {
  const url = 'https://cors-anywhere.herokuapp.com/https://bit.ly/3a5VWXQ'
  let res = await fetchJSON(url)
  return res.features.map(county => county.attributes)
}