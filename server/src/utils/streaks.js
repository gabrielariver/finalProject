function computeStreaks(dates) {
  if (!dates || dates.length === 0) return { current: 0, best: 0, percent: 0 };

    const sortedDates = dates
    .map(d => new Date(d))          
    .sort((a, b) => a - b);        

  const set = new Set(sortedDates.map(d => d.toISOString().slice(0, 10))); 
  const todayStr = new Date().toISOString().slice(0, 10);
  
  let cur = 0;
  let cursor = new Date(todayStr);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    cur++;
    cursor.setDate(cursor.getDate() - 1);
  }
  
  let best = 1;
  let run = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) run++;
    else run = 1;
    best = Math.max(best, run);
  }

  const start = sortedDates[0];
  const end = new Date(todayStr);
  const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  const percent = Math.round((dates.length / totalDays) * 100);

  return { current: cur, best, percent };
}

export default { computeStreaks };
