import { apiLocation, dbRoute } from '../env'
import { format } from 'date-fns'
import chroma from 'chroma-js'

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
  const url = 'https://cors-anywhere.herokuapp.com/https://bit.ly/3dqNGE1'
  let res = await fetchJSON(url)
  return res ? res.features.map(county => county.attributes) : null
}

// set colors of dataset
export function setPalette(data) {
  // const scale = chroma.scale(['#fafa6e', '#2A4858']).mode('lch')
  // const scale = chroma.scale(['#feeb65','#e4521b', '#4d342f']).mode('lch') // warm
  const scale = chroma.scale(['#dcedc8','#42b3d5', '#1a273e']).mode('lch') // cool
  // const scale = chroma.scale(['#ffecb3','#e85285', '#6a1b9a']).mode('lch') // neon
  // const scale = chroma.scale(chroma.brewer.OrRd).mode('lch') // red
  if (data && !data[0].COLOR) {
    return data.map((county, i) => {
      const palette = scale.domain([data.length - 1, 0])
      county.COLOR = palette(i)
      // console.log(county.NAME, county.POSITIVE, county.COLOR.rgb())
      return county
    })
  }
  return data
}