const activities = {
  "Kayaking & Paddleboarding": 2500,
  "Boat Rides & Hippo Viewing": 3500,
  "Dunga Hill Camp": 1500,
  "Impala Sanctuary": 2000,
};

const bookingForm = document.querySelector(".booking-form");
const activitySelect = bookingForm?.querySelector('[name="activity"]');
const participantsInput = bookingForm?.querySelector('[name="participants"]');
const priceTotal = bookingForm?.querySelector(".price-summary strong");
const dateInput = bookingForm?.querySelector('[name="date"]');
const toast = document.querySelector("#toast");
const toastTitle = toast?.querySelector(".toast-title");
const toastMessage = toast?.querySelector(".toast-message");
const toastClose = toast?.querySelector(".toast-close");
let toastTimer;

const formatCurrency = (amount) => `KSh ${amount.toLocaleString("en-KE")}`;

function updateBookingTotal() {
  if (!activitySelect || !participantsInput || !priceTotal) return;

  const unitPrice = activities[activitySelect.value] ?? 0;
  const participants = Math.max(1, Number(participantsInput.value) || 1);
  participantsInput.value = Math.min(12, participants);
  priceTotal.textContent = formatCurrency(unitPrice * Number(participantsInput.value));
}

function showToast(title, message) {
  if (!toast || !toastTitle || !toastMessage) return;

  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 6500);
}

if (dateInput) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  dateInput.min = localDate;
  if (!dateInput.value) dateInput.value = localDate;
}

activitySelect?.addEventListener("change", updateBookingTotal);
participantsInput?.addEventListener("input", updateBookingTotal);
bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const activity = formData.get("activity");
  const date = formData.get("date");
  const participants = Number(formData.get("participants"));

  if (!date || participants < 1) {
    showToast("A little more detail needed", "Choose a date and at least one participant to continue.");
    return;
  }

  showToast(
    "Reservation request received",
    `${activity} for ${participants} ${participants === 1 ? "guest" : "guests"}. We will confirm your slot by phone.`,
  );
  bookingForm.reset();
  dateInput.value = date;
  participantsInput.value = 2;
  updateBookingTotal();
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = new FormData(form).get("name") || "there";
  showToast("Message sent", `Thanks, ${name}. The Lakeside team will reply soon.`);
  form.reset();
});

toastClose?.addEventListener("click", () => {
  toast.classList.remove("is-visible");
  window.clearTimeout(toastTimer);
});

updateBookingTotal();
