fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=6d3b03e1-de9c-42a8-bb08-91ba564c2f34&limit=32000')
  .then(response => response.json())
  .then(data => {
    const records = data.result.records;
    const tableBody = document.querySelector('#importTable tbody');

    const years = new Set();
    const countries = new Set();

    records.forEach(record => {
      const row = document.createElement('tr');
      const year = record.Year || '';
      const country = record.Origin_Country || '';
      const product = record.CustomsItem_8_Digits || record.CustomsItem_2_Digits || '—';
      const quantity = record.Quantity || '';
      const value = record.NISCurrencyAmount || '';

      years.add(year);
      countries.add(country);

      row.innerHTML = `
        <td>${year}</td>
        <td>${country}</td>
        <td>${product}</td>
        <td>${quantity}</td>
        <td>${value}</td>
      `;
      tableBody.appendChild(row);
    });

    // מחליף input ב-select בשנה ובמדינה
    const yearSelect = dfetch('https://data.gov.il/api/3/action/datastore_search?resource_id=6d3b03e1-de9c-42a8-bb08-91ba564c2f34&limit=32000')
  .then(response => response.json())
  .then(data => {
    const records = data.result.records;
    const tableBody = document.querySelector('#importTable tbody');

    const years = new Set();
    const countries = new Set();

    // יוצרים את שורות הטבלה
    records.forEach(record => {
      const row = document.createElement('tr');

      const year = record.Year || '';
      const country = record.Origin_Country || '';
      const product = record.CustomsItem_8_Digits || record.CustomsItem_2_Digits || '—';
      const quantity = record.Quantity || '';
      const value = record.NISCurrencyAmount || '';

      years.add(year);
      countries.add(country);

      row.innerHTML = `
        <td>${year}</td>
        <td>${country}</td>
        <td>${product}</td>
        <td>${quantity}</td>
        <td>${value}</td>
      `;

      tableBody.appendChild(row);
    });

    // יצירת select לשנה
    const yearSelect = document.createElement('select');
    yearSelect.className = 'form-select form-select-sm';
    yearSelect.innerHTML = `<option value="">כל השנים</option>` +
      Array.from(years).sort().map(y => `<option value="${y}">${y}</option>`).join('');
    document.querySelector('#importTable thead tr:nth-child(2) th:nth-child(1)').innerHTML = '';
    document.querySelector('#importTable thead tr:nth-child(2) th:nth-child(1)').appendChild(yearSelect);

    // יצירת select למדינה
    const countrySelect = document.createElement('select');
    countrySelect.className = 'form-select form-select-sm';
    countrySelect.innerHTML = `<option value="">כל המדינות</option>` +
      Array.from(countries).sort().map(c => `<option value="${c}">${c}</option>`).join('');
    document.querySelector('#importTable thead tr:nth-child(2) th:nth-child(2)').innerHTML = '';
    document.querySelector('#importTable thead tr:nth-child(2) th:nth-child(2)').appendChild(countrySelect);

    // הפעלת DataTables
    const table = $('#importTable').DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/Hebrew.json'
      },
      footerCallback: function (row, data, start, end, display) {
        const api = this.api();
        const total = api
          .column(4, { search: 'applied' }) // ערך כספי בלבד
          .data()
          .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        $(api.column(4).footer()).html('סה"כ: ' + total.toLocaleString());
      }
    });

    // שינוי select שנה
    $(yearSelect).on('change', function () {
      table.column(0).search(this.value).draw();
    });

    // שינוי select מדינה
    $(countrySelect).on('change', function () {
      table.column(1).search(this.value).draw();
    });

    // סינון בטקסט (מוצר, כמות, ערך)
    $('#importTable thead tr:eq(1) th input').each(function (i) {
      $(this).on('keyup change clear', function () {
        const val = this.value;
        if (i === 3 || i === 4) {
          // סינון מספרי בתחילת ערך
          if (val === '') {
            table.column(i).search('').draw();
          } else {
            table.column(i).search('^' + val, true, false).draw();
          }
        } else {
          table.column(i).search(val).draw();
        }
      });
    });
  })
  .catch(error => {
    console.error('שגיאה בקבלת הנתונים מה-API:', error);
  });
ocument.createElement('select');
    yearSelect.className = 'form-select form-select-sm';
    yearSelect.innerHTML = `<option value="">כל השנים</option>` +
      Array.from(years).sort().map(y => `<option value="${y}">${y}</option>`).join('');
    document.querySelector('#importTable thead tr:nth-child(2) th:nth-child(1)').innerHTML = '';
    document.querySelector('#importTable thead tr:nth-child(2) th:nth-child(1)').appendChild(yearSelect);

    const countrySelect = document.createElement('select');
    countrySelect.className = 'form-select form-select-sm';
    countrySelect.innerHTML = `<option value="">כל המדינות</option>` +
      Array.from(countries).sort().map(c => `<option value="${c}">${c}</option>`).join('');
    document.querySelector('#importTable thead tr:nth-child(2) th:nth-child(2)').innerHTML = '';
    document.querySelector('#importTable thead tr:nth-child(2) th:nth-child(2)').appendChild(countrySelect);

    // מפעיל את הטבלה
    const table = $('#importTable').DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/Hebrew.json'
      },
      footerCallback: function (row, data, start, end, display) {
        const api = this.api();
        const total = api
          .column(3, { search: 'applied' })
          .data()
          .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        $(api.column(3).footer()).html('סה"כ: ' + total.toLocaleString());
      }
    });

    // אירועים על dropdown - שנה ומדינה
    $(yearSelect).on('change', function () {
      table.column(0).search(this.value).draw();
    });

    $(countrySelect).on('change', function () {
      table.column(1).search(this.value).draw();
    });

    // שאר הסינונים (inputים רגילים)
    $('#importTable thead tr:eq(1) th input').each(function (i) {
      $(this).on('keyup change clear', function () {
        const val = this.value;
        if (i === 3 || i === 4) {
          if (val === '') {
            table.column(i).search('').draw();
          } else {
            table.column(i).search('^' + val, true, false).draw();
          }
        } else {
          table.column(i).search(val).draw();
        }
      });
    });
  })
  .catch(error => {
    console.error('שגיאה בקבלת הנתונים מה-API:', error);
  });










