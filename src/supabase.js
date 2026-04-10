const URL = 'https://idtubtkpsikblmgrhkjr.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkdHVidGtwc2lrYmxtZ3Joa2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTIzMjQsImV4cCI6MjA1OTg2ODMyNH0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkdHVidGtwc2lrYmxtZ3Joa2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTA2OTMsImV4cCI6MjA5MDYyNjY5M30.MXj8BHrN9iG0C6acvP6Mqpn73KWC5cgTPbcV-CTrUiA';

const headers = {
  'apikey': KEY,
  'Authorization': 'Bearer ' + KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

export const supabase = {
  from: (table) => ({
    select: (cols) => ({
      order: (col) => fetch(`${URL}/rest/v1/${table}?select=${cols || '*'}&order=${col}`, { headers }).then(r => ({ data: r.ok ? r.json() : null })).then(async r => ({ data: await r.data })),
      eq: (col, val) => ({
        single: () => fetch(`${URL}/rest/v1/${table}?select=${cols || '*'}&${col}=eq.${val}&limit=1`, { headers }).then(async r => { const d = await r.json(); return { data: Array.isArray(d) ? d[0] : d }; }),
        then: (fn) => fetch(`${URL}/rest/v1/${table}?select=${cols || '*'}&${col}=eq.${val}`, { headers }).then(r => r.json()).then(d => fn({ data: d }))
      }),
      then: (fn) => fetch(`${URL}/rest/v1/${table}?select=${cols || '*'}`, { headers }).then(r => r.json()).then(d => fn({ data: d }))
    }),
    insert: (row) => ({
      select: () => ({ single: () => fetch(`${URL}/rest/v1/${table}`, { method: 'POST', headers, body: JSON.stringify(row) }).then(async r => ({ data: (await r.json())?.[0], error: r.ok ? null : 'err' })) }),
      catch: () => fetch(`${URL}/rest/v1/${table}`, { method: 'POST', headers, body: JSON.stringify(row) }).catch(() => {}),
      then: (fn) => fetch(`${URL}/rest/v1/${table}`, { method: 'POST', headers, body: JSON.stringify(row) }).then(r => r.json()).then(d => fn({ data: d }))
    }),
    upsert: (row) => fetch(`${URL}/rest/v1/${table}?on_conflict=id`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(row)
    }).catch(() => {}),
    delete: () => ({
      eq: (col, val) => fetch(`${URL}/rest/v1/${table}?${col}=eq.${val}`, { method: 'DELETE', headers }).catch(() => {})
    })
  })
};