function getClientId(){
  let id = localStorage.getItem('clientId')
  if(!id){ id = crypto.randomUUID(); localStorage.setItem('clientId', id) }
  return id
}
const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function api(path, options={}){
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type':'application/json', 'X-Client-Id': getClientId(), ...(options.headers||{}) },
    ...options
  })
  if(!res.ok){
    let msg = 'Error'
    try{ msg = (await res.json())?.error || msg }catch{}
    throw new Error(msg)
  }
  const ct = res.headers.get('content-type')||''
  return ct.includes('application/json') ? res.json() : res.text()
}
