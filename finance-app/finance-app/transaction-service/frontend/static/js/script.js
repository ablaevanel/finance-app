function getJWTToken() {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split('=');
        if (key === 'jwtToken') {
            return value; 
        }
    }
    return null; 
}

async function loadTransactions() {
    const token = getJWTToken();
    if (!token) {
        alert('Пожалуйста, войдите в систему');
        return;
    }

    try {
        const response = await fetch('http://localhost:8081/api/transactions/list', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        let data = await response.json();
        let transactionsList = document.getElementById('transactions');
        transactionsList.innerHTML = '';

        data.transactions.forEach(transaction => {
            const li = document.createElement('li');
            let date = String(transaction.date).substring(0, 10)
            li.innerHTML = `
        ${date} - ${transaction.description} (${transaction.amount} ₽) - ${transaction.category}
        <button onclick="editTransaction('${transaction.id}')">Редактировать</button>
        <button onclick="deleteTransaction('${transaction.id}')">Удалить</button>
    `;
            transactionsList.appendChild(li);
        });

        const statsResponse = await fetch('http://localhost:8081/api/transactions/list/statistics', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (statsResponse.ok) {
            const statistics = await statsResponse.json();
            document.getElementById('income').textContent = statistics.income || 0;
            document.getElementById('expense').textContent = statistics.expense || 0;
        }

    } catch (error) {
        console.error('Ошибка при загрузке транзакций или статистики:', error);
    }
}

function editTransaction(transactionID) {
    window.location.href = `http://localhost:8081/api/transactions/${transactionID}`; 
}

async function deleteTransaction(transactionID) {
    const token = getJWTToken();
    if (!token) {
        alert('Пожалуйста, войдите в систему');
        return;
    }

    const confirmDelete = confirm("Вы уверены, что хотите удалить эту транзакцию?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:8081/api/transactions/${transactionID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();
        const messageElement = document.getElementById('message');

        if (response.ok) {
            messageElement.textContent = 'Транзакция удалена успешно!';
            messageElement.style.color = 'green';
            await loadTransactions();
        } else {
            messageElement.textContent = result.error || 'Ошибка при удалении транзакции';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Ошибка при удалении транзакции:', error);
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Ошибка при удалении транзакции';
        messageElement.style.color = 'red';
    }
}

window.addEventListener('load', loadTransactions);