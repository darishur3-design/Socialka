const exportBtn = document.getElementById("exportReportBtn");

if (exportBtn) {
    exportBtn.addEventListener("click", exportReport);
}

function exportReport() {
    const table = document.querySelector("table");

    if (!table) {
        alert("Таблица не найдена");
        return;
    }

    let csv = [];

    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {
        const cols = row.querySelectorAll("td, th");
        let rowData = [];

        cols.forEach(col => {
            // Экранируем двойные кавычки внутри текста и оборачиваем поле в кавычки
            let cellText = col.innerText.trim().replace(/"/g, '""');
            rowData.push(`"${cellText}"`);
        });

        csv.push(rowData.join(","));
    });

    const csvString = csv.join("\n");
    // Добавляем BOM для корректного отображения кириллицы в Excel
    const blob = new Blob(['\uFEFF' + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "event_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}