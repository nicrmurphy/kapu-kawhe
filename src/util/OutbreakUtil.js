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

const getChromaScale = palette => {
  switch (palette) {
    default:
    case 'cool':
      return chroma.scale(['#dcedc8', '#42b3d5', '#1a273e']).mode('lch') // cool
    case 'warm':
      return chroma.scale(['#feeb65', '#e4521b', '#4d342f']).mode('lch') // warm
    case 'neon':
      return chroma.scale(['#ffecb3', '#e85285', '#6a1b9a']).mode('lch') // neon
    case 'go pack go':
      return chroma.scale(['#fafa6e', '#2A4858']).mode('lch') // packers
  }
}

// set colors of dataset
export function setPalette(data, palette) {
  const scale = getChromaScale(palette)
  if (data && data.palette !== palette) {
    data = data.map((county, i) => {
      const palette = scale.domain([0, Math.log10(data[0].POSITIVE)])
      county.COLOR = palette(Math.log10(county.POSITIVE))
      return county
    })
    data.palette = palette
  }
  return data
}
