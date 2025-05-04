fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=6d3b03e1-de9c-42a8-bb08-91ba564c2f34&limit=32000')
  .then(response => response.json())
  .then(data => {
    const records = data.result.records;

    const groupAndSum = (records, field) => {
      const map = {};
      records.forEach(r => {
        const key = r[field] || 'לא ידוע';
        const val = parseFloat(r.NISCurrencyAmount) || 0;
        map[key] = (map[key] || 0) + val;
      });
      return map;
    };

    const renderChartAndTable = (map, canvasId, tableId, labelText) => {
      const labels = Object.keys(map);
      const values = labels.map(k => map[k]);

      // גרף
      const ctx = document.getElementById(canvasId).getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: labelText,
            data: values,
            backgroundColor: labels.map((_, i) => `hsl(${i * 37 % 360}, 70%, 70%)`),
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });

      // טבלה
      const tableBody = document.querySelector(`#${tableId} tbody`);
      labels.forEach((label, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${label}</td><td>${values[i].toLocaleString()}</td>`;
        tableBody.appendChild(row);
      });
    };

    // יצירת גרפים וטבלאות
    renderChartAndTable(groupAndSum(records, 'Origin_Country'), 'chartByCountry', 'tableByCountry', 'לפי מדינה');
    renderChartAndTable(groupAndSum(records, 'TermsOfSale'), 'chartByTerms', 'tableByTerms', 'לפי שיטת מכירה');
    renderChartAndTable(groupAndSum(records, 'Quantity_MeasurementUnitName'), 'chartByUnit', 'tableByUnit', 'לפי יחידת מידה');
  })
  .catch(err => console.error('שגיאה בטעינת נתונים לגרפים:', err));
