/// <reference types="jquery" />

document.addEventListener("DOMContentLoaded", function () {
    const customers = [
        { id: 1, name: "Ahmed Ali" },
        { id: 2, name: "Aya Elsayed" },
        { id: 3, name: "Mina Adel" },
        { id: 4, name: "Sarah Reda" },
        { id: 5, name: "Mohamed Sayed" }
    ];

    const transactions = [
        { id: 1, customer_id: 1, date: "2022-01-01", amount: 1000 },
        { id: 2, customer_id: 1, date: "2022-01-02", amount: 2000 },
        { id: 3, customer_id: 2, date: "2022-01-01", amount: 550 },
        { id: 4, customer_id: 3, date: "2022-01-01", amount: 500 },
        { id: 5, customer_id: 2, date: "2022-01-02", amount: 1300 },
        { id: 6, customer_id: 4, date: "2022-01-01", amount: 750 },
        { id: 7, customer_id: 3, date: "2022-01-02", amount: 1250 },
        { id: 8, customer_id: 5, date: "2022-01-01", amount: 2500 },
        { id: 9, customer_id: 5, date: "2022-01-02", amount: 875 }
    ];

    const customerFilter = document.getElementById('customerFilter');
    const amountFilter = document.getElementById('amountFilter');
    const customerTable = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
    const transactionChart = document.getElementById('transactionChart').getContext('2d');
    let chart;

    function populateTable() {
        customerTable.innerHTML = '';
        const filteredCustomers = customers.filter(customer => 
            customer.name.toLowerCase().includes(customerFilter.value.toLowerCase())
        );

        filteredCustomers.forEach(customer => {
            transactions
                .filter(transaction => 
                    transaction.customer_id === customer.id && 
                    (amountFilter.value === '' || transaction.amount >= parseInt(amountFilter.value))
                )
                .forEach(transaction => {
                    const row = customerTable.insertRow();
                    row.insertCell(0).innerText = customer.name;
                    row.insertCell(1).innerText = transaction.date;
                    row.insertCell(2).innerText = transaction.amount;
                });
        });

        updateChart(filteredCustomers);
    }

    function updateChart(filteredCustomers) {
        const data = {};

        filteredCustomers.forEach(customer => {
            transactions
                .filter(transaction => transaction.customer_id === customer.id)
                .forEach(transaction => {
                    if (!data[transaction.date]) data[transaction.date] = 0;
                    data[transaction.date] += transaction.amount;
                });
        });

        const dates = Object.keys(data);
        const amounts = Object.values(data);

        if (chart) chart.destroy();
        chart = new Chart(transactionChart, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Total Transaction Amount',
                    data: amounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Amount' } }
                }
            }
        });
    }

    customerFilter.addEventListener('input', populateTable);
    amountFilter.addEventListener('input', populateTable);

    populateTable();
});

