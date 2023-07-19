const addExpenseForm = document.getElementById('submit');
const premiumButton = document.getElementById('premium-button');
const msg = document.getElementById('msg');
const leaderboard = document.getElementById("leaderboard");


addExpenseForm.addEventListener('click', handleAddExpense);
premiumButton.addEventListener('click', BuyPremium);
leaderboard.addEventListener("click", premiumFeature);

async function handleAddExpense(event) {
  event.preventDefault();

  const amount = document.getElementById('amount').value;
  const etype = document.getElementById('etype').value;
  const date = document.getElementById('date').value;

  const obj = {
    amount: amount,
    etype: etype,
    date: date
  };

  try {
    let token = localStorage.getItem("token");
    let response = await axios.post(
      "/add-expense",
      obj,
      { headers: { Authorization: token } }
    );
    console.log(response);
    showOnScreen(response.data.newexpense);
    window.location.href = "/expense";
  } catch (err) {
    console.log(err);
  }
}

async function deleteExpense(expenseId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`/expense/delete-expense/${expenseId}`, {
      headers: { 'Authorization': token },
    });
    console.log(response.data);
    const listItem = document.getElementById(`expense-item-${expenseId}`);
    if (listItem) {
      listItem.remove();
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
}

async function download() {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('/fetch-expense', {
      headers: {
        'Authorization': token
      }
    });
    const userList = document.getElementById('result');
    response.data.forEach(expense => {
      const listItem = document.createElement('li');
      listItem.setAttribute('id', `expense-item-${expense.id}`);
      const date = new Date(expense.date).toLocaleDateString();

      listItem.innerHTML = `
        <strong>Amount:</strong> Rs. ${expense.amount} |
        <strong>Type:</strong> ${expense.etype} |
        <strong>Date:</strong> ${date} |
        <button class="btn-delete" data-expense-id="${expense.id}">Delete Expense</button>
      `;
      userList.appendChild(listItem);
    });

    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const expenseId = button.dataset.expenseId;
        deleteExpense(expenseId);
      });
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
}


async function premiumFeature(e) {
  e.preventDefault();
  try {
    let token = localStorage.getItem("token");
    const response = await axios.get(
      '/leaderboard',
      {
        headers: { Authorization: token },
      }
    );
    const boardList = document.getElementById("boards");
    boardList.innerHTML = "<h2>Leader Board:</h2>";
    console.log(response);
    response.data.forEach((details) => {
      let newItem = document.createElement("li");
      newItem.appendChild(
        document.createTextNode(
          `Name: ${details.name} |
           Total_Amount: - ${details.total_cost}`
        )
      );
      boardList.appendChild(newItem);
    });
  } catch (err) {
    console.log(err);
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

async function BuyPremium(e) {
  if (e) {
    e.preventDefault();
  }
  try {
    let token = localStorage.getItem("token");
    const response = await axios.get("/buypremium", {
      headers: { Authorization: token },
    });

    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (result) {
        const res = await axios.post(
          "/updatetransaction",
          {
            order_id: options.order_id,
            payment_id: result.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("You are a premium member");
        location.reload();


        localStorage.setItem("token", res.data.token);

        // Call checkPremiumStatus() after the user completes the payment
        await checkPremiumStatus();
      },
    };

    const rzpl = new Razorpay(options);
    rzpl.open();
    rzpl.on("payment.failed", async function (res) {
      await axios.post(
        "/updatefailure",
        {
          order_id: response.data.order.id,
        },
        { headers: { Authorization: token } }
      );
      alert("something went wrong");
    });

    
  } catch (err) {
    console.log(err);
  }
}

async function checkPremiumStatus() {
  try {
    let token = localStorage.getItem("token");
    const decode = parseJwt(token);
    console.log(decode)
    const isPremiumUser = decode.ispremiumuser;
    console.log(isPremiumUser)
    if (isPremiumUser) {
      premiumButton.style.display = "none";
      msg.textContent = "You Are a Premium User";
      document.getElementById("leaderboard").textContent = "Show Leaderboard";
      document.getElementById("downloadexpense").textContent = "Download Expenses";
      document.getElementById('downloadshow').style.display='visible'
    } else {
      premiumButton.style.display = "block";
      msg.textContent = "Become a Premium User Now!!!";
      document.getElementById('downloadshow').style.display='hidden';

    }
  } catch (err) {
    console.log(err);
  }
}

async function downloadExpense() {
  let token = localStorage.getItem("token");
  try {
    const response = await axios.get("/expense/download", {
      headers: { Authorization: token },
    });
    var a = document.createElement("a");
    a.href = response.data.fileUrl;
    a.download = "myexpense.csv";
    a.click();
  } catch (err) {
    console.log(err);
  }
}

function showDownloadLinks() {
  const inputElement = document.getElementById('downloadshow')
  inputElement.onclick = async () => {
    const heading = document.getElementById("heading");
    heading.innerText = "Show Download Url";
    const downloadUrl = document.getElementById("downloadlinks");
    const token = localStorage.getItem("token");

    const downloadLinks = await axios.get(
      "/expense/show-downloadLink",
      { headers: { Authorization: token } }
    );
    console.log("downloadLinks", downloadLinks);
    if (downloadLinks.data.url == [] || downloadLinks.data.url == "") {
      const li = document.createElement("li");
      li.innerText = "No Downloaded Url";
      downloadUrl.append(li);
    } else {
      downloadLinks.data.url.forEach((Element) => {
        console.log("Element.filelink", Element);
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `${Element.filelink}`;
        a.innerHTML = ` Url:  ${Element.filelink} `;
        li.appendChild(a);
        downloadUrl.appendChild(li);
      });
    }
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  download();
  checkPremiumStatus();
});