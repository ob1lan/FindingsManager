async function fetchSessionExpiry() {
  const response = await fetch("/me/session-expiry");
  const data = await response.json();
  return new Date(data.expiry);
}

function updateCountdown(expiryDate) {
  const now = new Date();
  const timeDifference = expiryDate - now;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  document.getElementById("sessionCountdown").textContent =
    "\u00A0(" + hours + "h " + minutes + "m " + seconds + "s left)";
}

async function initCountdown() {
  const expiryDate = await fetchSessionExpiry();
  updateCountdown(expiryDate);
  setInterval(() => updateCountdown(expiryDate), 1000);
}

initCountdown();
