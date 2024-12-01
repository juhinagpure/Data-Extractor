let results = [];
let extracting = false;

function generateDynamicData() {
  const keywords = ["Salon", "Spa", "Gym", "Restaurant"];
  const locations = ["Nagpur", "Pune", "Mumbai", "Delhi", "Bangalore"];
  const companyNames = ["Company A", "Company B", "Company C"];
  const categories = ["Health", "Beauty", "Fitness"];
  const websites = ["example1.com", "example2.com", "example3.com"];
  const phones = ["1234567890", "9876543210", "5555555555"];

  return {
    keyword: keywords[Math.floor(Math.random() * keywords.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    companyName: companyNames[Math.floor(Math.random() * companyNames.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    website: websites[Math.floor(Math.random() * websites.length)],
    phone: phones[Math.floor(Math.random() * phones.length)],
  };
}

function startExtracting() {
  if (extracting) {
    alert("Extraction already in progress!");
    return;
  }

  extracting = true;
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  setTimeout(() => {
    const newData = generateDynamicData();
    results.push(newData);

    const tbody = document.getElementById("data-table-body");
    if (tbody.querySelector(".no-data")) {
      tbody.innerHTML = "";
    }
    const newRow = document.createElement("tr");
    Object.values(newData).forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      newRow.appendChild(td);
    });
    tbody.appendChild(newRow);

    document.getElementById(
      "results-found"
    ).textContent = `${results.length} Results Found`;

    document.getElementById("download-btn").disabled = false;

    loader.style.display = "none";
    extracting = false;
  }, 2000);
}

function clearData() {
  results = [];
  const tbody = document.getElementById("data-table-body");
  tbody.innerHTML = "<tr><td colspan='6' class='no-data'>No data</td></tr>";
  document.getElementById("results-found").textContent = "0 Results Found";
  document.getElementById("download-btn").disabled = true;
}

function filterTable() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  setTimeout(() => {
    const keywordInput = document
      .getElementById("search-keyword")
      .value.toLowerCase();
    const locationInput = document
      .getElementById("search-location")
      .value.toLowerCase();
    const rows = document.querySelectorAll("#data-table-body tr");

    rows.forEach((row) => {
      const cells = row.getElementsByTagName("td");
      if (!cells.length) return;
      const keyword = cells[0].textContent.toLowerCase();
      const location = cells[1].textContent.toLowerCase();

      const matchesKeyword = !keywordInput || keyword.includes(keywordInput);
      const matchesLocation =
        !locationInput || location.includes(locationInput);

      row.style.display = matchesKeyword && matchesLocation ? "" : "none";
    });

    loader.style.display = "none";
  }, 500);
}

function downloadCSV() {
  if (results.length === 0) {
    alert("No data available to download!");
    return;
  }

  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["Keyword,Location,Company Name,Category,Website,Phone"]
      .concat(
        results.map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(",")
        )
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "extracted_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
