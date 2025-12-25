export function randomString(e) {
  e = e || 32;
  const t = "abcdefghijklmnopqrstwxyz1234567890";
  const a = t.length;
  let n = "";
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a));
  }
  return n;
}

export function handleAroundPoints({cells, row, col, maxrow, maxcol, callback}) {
	for(let srow = Math.max(row - 1, 0); srow < Math.min(row + 2, maxrow); srow++) {
		for(let scol = Math.max(col - 1, 0); scol < Math.min(col + 2, maxcol); scol++) {
			if (srow === row && scol === col) continue;
			callback(cells[srow].list[scol], srow, scol)
		}
	}
}