// Функция для форматирования даты и времени в формате "дд.мм.гггг чч:мм:сс"
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Функция для генерации ссылки на круиз
function generateCruiseLink(id) {
    return `https://www.mosturflot.ru/river-cruises/${id}/`;
};

async function renderTableWithPagination(pageNumber = 1) {
    try {
        const response = await fetch(`cruises${pageNumber}.json`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const { data, pagination } = await response.json();
        const perPage = pagination.per_page;
        const start = (pageNumber - 1) * perPage;
        const end = start + perPage;
        const currentData = data.slice(start, end);
        const tableRows = renderTableRows(currentData);

        const tbody = document.getElementById("my-tbody");
        tbody.innerHTML = "";
        tableRows.forEach((row) => {
            tbody.appendChild(row);
        });

        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = "";

        // Add previous button
        const previousButton = document.createElement("button");
        previousButton.textContent = "<";
        previousButton.disabled = pageNumber === 1;
        previousButton.addEventListener("click", () => {
            renderTableWithPagination(pageNumber - 1);
        });
        paginationContainer.appendChild(previousButton);

        // Add page buttons
        for (let i = 1; i <= pagination.last_page; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            if (i === pageNumber) {
                button.disabled = true;
            }
            button.addEventListener("click", () => {
                renderTableWithPagination(i);
            });
            paginationContainer.appendChild(button);
        }

        // Add next button
        const nextButton = document.createElement("button");
        nextButton.textContent = ">";
        nextButton.disabled = pageNumber === pagination.last_page;
        nextButton.addEventListener("click", () => {
            renderTableWithPagination(pageNumber + 1);
        });
        paginationContainer.appendChild(nextButton);

    } catch (error) {
        console.error(error);
    }
};


function renderTableRows(data) {
    const tableRows = [];
    data.forEach((item) => {
        const row = document.createElement("tr");

        const shipCell = document.createElement("td");
        const shipImage = document.createElement("img");
        shipImage.src = item.ship.image;
        shipImage.alt = item.ship.name;
        shipCell.appendChild(shipImage);
        shipCell.innerHTML += item.ship.name;
        row.appendChild(shipCell);

        const durationCell = document.createElement("td");
        durationCell.textContent = item.days;
        row.appendChild(durationCell);

        const dateFromCell = document.createElement("td");
        dateFromCell.textContent = formatDate(item.boarding_time);
        row.appendChild(dateFromCell);

        const dateToCell = document.createElement("td");
        dateToCell.textContent = formatDate(item.leaving_time);
        row.appendChild(dateToCell);

        const routeCell = document.createElement("td");
        routeCell.textContent = item.routes_text;
        row.appendChild(routeCell);

        const buttonCell = document.createElement("td");
        const button = document.createElement("button");
        const buttonLink = document.createElement("a");
        buttonLink.href = generateCruiseLink(item.id);
        buttonLink.textContent = "Подробнее";
        button.appendChild(buttonLink);
        buttonCell.appendChild(button);
        row.appendChild(buttonCell);

        const tbody = document.getElementById("my-tbody");
        tbody.appendChild(row);
    });
    return tableRows;
};

renderTableWithPagination();