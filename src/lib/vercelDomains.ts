import axios from "axios"
const TOKEN = process.env.VERCEL_TOKEN!
const PROJECT = process.env.VERCEL_PROJECT_ID!
export async function addDomain(hostname: string) {
  const r = await axios.post(`https://api.vercel.com/v10/projects/${PROJECT}/domains`,
    { name: hostname }, { headers:{ Authorization: `Bearer ${TOKEN}` }})
  return r.data
}
export async function getConfig(hostname: string) {
  const r = await axios.get(`https://api.vercel.com/v6/domains/${hostname}/config`,
    { headers:{ Authorization: `Bearer ${TOKEN}` }})
  return r.data
}
export async function getStatus(hostname: string) {
  const r = await axios.get(`https://api.vercel.com/v6/domains/${hostname}`,
    { headers:{ Authorization: `Bearer ${TOKEN}` }})
  return r.data
}
