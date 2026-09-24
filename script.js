const totalEarnings = document.getElementById("dayamount");
const porterPercentage = document.getElementById("percentage");
const earnings = document.getElementById("earnings");

function calculateEarnings() {
    const total = Number(totalEarnings.value);
    const percentage = Number(porterPercentage.value);

    if (total > 0 && percentage >= 0) {
        const porterAmount = total * percentage / 100;
        const balance = total - porterAmount;

        earnings.value = balance;
    } else {
        earnings.value = "";
    }
}

totalEarnings.addEventListener("input", calculateEarnings);
porterPercentage.addEventListener("input", calculateEarnings);

const salaryType = document.getElementById("salarytype");
const workerIncome = document.getElementById("workerincome");
const ownerIncome = document.getElementById("ownerincome");

function calculateIncome() {
    const earning = Number(earnings.value);

    if (salaryType.value === "commission") {
        const owner = earning * 45 / 100;
        const worker = earning - owner;

        ownerIncome.value = owner;
        workerIncome.value = worker;
    } else {
        ownerIncome.value = "";
        workerIncome.value = "";
    }
}

salaryType.addEventListener("change", calculateIncome);
earnings.addEventListener("input", calculateIncome);


document.getElementById("searchBtn").addEventListener("click", async () => {

    const name = document.getElementById("searchName").value.trim();
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    if (!name || !fromDate || !toDate) {
        alert("Please enter name, from date and to date");
        return;
    }

    if (fromDate > toDate) {
        alert("From Date cannot be greater than To Date");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/workers/search?name=${encodeURIComponent(name)}&fromDate=${fromDate}&toDate=${toDate}`
        );

        const result = await response.json();

        const tableBody = document.getElementById("workerTableBody");

        tableBody.innerHTML = "";

        if (result.data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        No data found
                    </td>
                </tr>
            `;

            return;
        }

        result.data.forEach(worker => {

            const row = `
                <tr>
                    <td>${worker.date}</td>
                    <td>${worker.driverName}</td>
                    <td>${worker.totalEarnings}</td>
                    <td>${worker.porterPercentage}%</td>
                    <td>${worker.earnings}</td>
                    <td>${worker.salaryType}</td>
                    <td>${worker.workerIncome}</td>
                    <td>${worker.ownerIncome}</td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });

    } catch (error) {

        console.error("Search error:", error);

        alert("Unable to connect to server");

    }

});


const workerForm = document.getElementById("workerForm");

workerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const workerData = {
        driverName: document.getElementById("Drivername").value,
        totalEarnings: Number(document.getElementById("dayamount").value),
        porterPercentage: Number(document.getElementById("percentage").value),
        earnings: Number(document.getElementById("earnings").value),
        salaryType: document.getElementById("salarytype").value,
        workerIncome: Number(document.getElementById("workerincome").value),
        ownerIncome: Number(document.getElementById("ownerincome").value),
        date: document.getElementById("date").value
    };

    console.log("Sending data:", workerData);

    try {
        const response = await fetch("http://localhost:3000/api/workers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workerData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Worker data stored successfully!");

            console.log("Server response:", result);

            workerForm.reset();

        } else {
            alert("Error: " + result.message);
            console.error(result);
        }

    } catch (error) {
        console.error("Fetch error:", error);

        alert(
            "Server connection failed. Make sure MongoDB and Node.js server are running."
        );
    }
});