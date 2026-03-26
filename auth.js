const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const authMessage = document.getElementById("auth-message");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const resetForm = document.getElementById("reset-form");
const logoutBtn = document.getElementById("logout-btn");
const profileBox = document.getElementById("profile-box");
const profileEmail = document.getElementById("profile-email");
const profileId = document.getElementById("profile-id");
const profileName = document.getElementById("profile-name");
const tabButtons = document.querySelectorAll(".tab-btn");
const formPanels = {
  signup: document.getElementById("signup-panel"),
  login: document.getElementById("login-panel"),
  reset: document.getElementById("reset-panel")
};

if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_URL") {
  setMessage("Add your Supabase URL and anon key in auth.js before using this page.", "warning");
}

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

function setMessage(text, type = "") {
  authMessage.textContent = text;
  authMessage.className = "message";
  if (type) {
    authMessage.classList.add(type);
  }
}

function clearMessage() {
  setMessage("");
}

function showTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  Object.entries(formPanels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === tabName);
  });
}

function getDisplayName(user) {
  return user?.user_metadata?.display_name || "Not set";
}

function renderUser(user) {
  if (!user) {
    profileBox.classList.remove("visible");
    profileEmail.textContent = "—";
    profileId.textContent = "—";
    profileName.textContent = "—";
    return;
  }

  profileBox.classList.add("visible");
  profileEmail.textContent = user.email || "—";
  profileId.textContent = user.id || "—";
  profileName.textContent = getDisplayName(user);
}

async function loadCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
loadCurrentUser();
