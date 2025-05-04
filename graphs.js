console.log('התחברתי ל-graphs.js');

// מביאים את הנתונים מה-API
fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=6d3b03e1-de9c-42a8-bb08-91ba564c2f34&limit=32000')
  .then(response => response.json())
  .then(data => {
    const records = data.result.records;

    // מריצים 4 סיכומים:
    createSummary(records, 'Origin_Country', 'importChartCountries', 'tableContainerCountries', 'יבוא לפי מדינות');
    createSummary(records, 'CustomsItem_8_Digits', 'importChartCommodities', 'tableContainerCommodities', 'יבוא לפי סוגי מוצרים');
    createSummary(records, 'CustomsHouse', 'importChartPorts', 'tableContainerPorts', 'יבוא לפי נמלי כניסה');
    createSummary(records, 'Quantity_MeasurementUnitName', 'importChartUnits', 'tableContainerUnits', 'יבוא לפי יחידות מידה');
  })
  .catch(error => {
    console.error('שגיאה בקבלת הנתונים לגרפים:', error);
  });

// פונקציה כללית לסיכום, גרף + טבלה
function createSummary(records, fieldName, chartId, tableId, title) {
  const totals = {};

  // סוכמים לפי השדה
  records.forEach(record => {
    const key = record[fieldName];
    const value = parseFloat(record.NISCurrencyAmount);

    if (key && key.trim() !== '' && !isNaN(value)) {
      if (!totals[key]) {
        totals[key] = 0;
      }
      totals[key] += value;
    }
  });

  // מיון לפי ערך + סינון ריקים
  let sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length > 10) {
    sorted = sorted.slice(0, 10);
  }

  const labels = sorted.map(item => item[0]);
  const values = sorted.map(item => item[1]);

  // צבעים
  const backgroundColors = labels.map((_, index) => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#C9CBCF', '#66BB6A',
      '#BA68C8', '#FF7043', '#26A69A', '#8D6E63'
    ];
    return colors[index % colors.length];
  });

  // גרף
  const ctx = document.getElementById(chartId).getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: values,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          position: 'right'
        }
      }
    }
  });

  // טבלה
  const tableContainer = document.getElementById(tableId);
  const table = document.createElement('table');
  table.className = 'table table-bordered text-center';

  table.innerHTML = `
    <thead class="table-light">
      <tr>
        <th>${title.includes('יחידות') ? 'יחידת מידה' :
             title.includes('נמלים') ? 'נמל כניסה' :
             title.includes('מוצרים') ? 'סוג מוצר' :
             'מדינה'}</th>
        <th>סך ערך יבוא (₪)</th>
      </tr>
    </thead>
    <tbody>
      ${sorted.map(([label, total]) => `
        <tr>
          <td>${label}</td>
          <td>${total.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  tableContainer.appendChild(table);
}
