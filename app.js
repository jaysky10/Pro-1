function saveShopee() {
  const tracker = getData('shopee');
  const date = document.getElementById('shopeeDate').value || new Date().toISOString().slice(0, 10);
  const trackingNumber = document.getElementById('trackingNumber').value.trim();
  const amount = parseFloat(document.getElementById('shopeeAmount').value);
  const released = document.getElementById('paymentReleased').checked;

  if (!trackingNumber || isNaN(amount)) return alert('Fill all fields');

  tracker.push({ id: Date.now(), date, trackingNumber, amount, released });
  setData('shopee', tracker);
  clearShopeeForm();
  renderShopee();
}

function clearShopeeForm() {
  document.getElementById('shopeeDate').value = "";
  document.getElementById('trackingNumber').value = "";
  document.getElementById('shopeeAmount').value = "";
  document.getElementById('paymentReleased').checked = false;
}

function renderShopee() {
  const tracker = getData('shopee');
  const list = document.getElementById('shopeeList');
  const totals = document.getElementById('shopeeTotals');

  list.innerHTML = "";
  let totalReleased = 0;
  let totalPending = 0;

  tracker.forEach(t => {
    if (t.released) totalReleased += t.amount;
    else totalPending += t.amount;

    const item = document.createElement('div');
    item.innerHTML = `
      <div>
        <b>${t.date}</b> - ${t.trackingNumber} - ₱${t.amount.toFixed(2)} -
        Released: <input type="checkbox" ${t.released ? 'checked' : ''} onchange="toggleShopee(${t.id}, this.checked)">
        <button onclick="editShopee(${t.id})">Edit</button>
        <button onclick="deleteShopee(${t.id})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });

  totals.innerHTML = `
    <p><b>Total Released:</b> ₱${totalReleased.toFixed(2)}</p>
    <p><b>Total Pending:</b> ₱${totalPending.toFixed(2)}</p>
  `;
}

function toggleShopee(id, value) {
  const tracker = getData('shopee');
  const item = tracker.find(t => t.id === id);
  if (item) {
    item.released = value;
    setData('shopee', tracker);
    renderShopee();
  }
}

function editShopee(id) {
  const tracker = getData('shopee');
  const item = tracker.find(t => t.id === id);
  if (!item) return;

  const newDate = prompt("Edit date", item.date);
  const newTracking = prompt("Edit tracking number", item.trackingNumber);
  const newAmount = prompt("Edit amount", item.amount);

  if (newDate && newTracking && !isNaN(parseFloat(newAmount))) {
    item.date = newDate;
    item.trackingNumber = newTracking;
    item.amount = parseFloat(newAmount);
    setData('shopee', tracker);
    renderShopee();
  }
}

function deleteShopee(id) {
  const tracker = getData('shopee').filter(t => t.id !== id);
  setData('shopee', tracker);
  renderShopee();
}
