const SPREADSHEET_ID = '17_HK3OGjiSa5UvjkzK96VPpIQM5c65yqOUPGGF1lKks';
const SHEET_NAME = 'planets';

function doGet(e) {
  const action = (e.parameter.action || 'list').toLowerCase();
  if (action !== 'list') return json({ success: false, message: 'Unknown action' });
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return json({ success: true, data: [] });
  const data = rows.slice(1).map(r => ({
    id: String(r[0]), type: String(r[1]),
    scores: { O:Number(r[2]), C:Number(r[3]), E:Number(r[4]), A:Number(r[5]), N:Number(r[6]) },
    seed: Number(r[7]), createdAt: r[8]
  }));
  return json({ success: true, data: data });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action !== 'create' || !/^[OCEAN]$/.test(body.type)) throw new Error('Invalid payload');
    const s = body.scores || {};
    getSheet().appendRow([body.id, body.type, s.O, s.C, s.E, s.A, s.N, body.seed, body.createdAt || new Date().toISOString()]);
    return json({ success: true, id: body.id });
  } catch (err) { return json({ success: false, message: err.message }); }
}

function getSheet() {
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(['id','type','O','C','E','A','N','seed','created_at']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
