// ==============================
// SUPABASE CONFIG (REPLACE THESE)
// ==============================
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// ==============================
// INIT
// ==============================
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// ==============================
// ELEMENTS
// ==============================
const msg = document.getElementById("message");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const resetForm = document.getElementById("reset-form");

const profileBox = document.getElementById("profile");
const profileEmail = document.getElementById("profile-email");

const logoutBtn = document.getElementById("logout");

// ==============================
// HELPERS
// ==============================
function setMessage(text, type = "") {
  msg.textContent = text;
  msg.className = type;
}

function clearMessage() {
  msg.textContent = "";
  msg.className = "";
}

function showProfile(user) {
  if (!user) {
    profileBox.style.display = "none";
    return;
  }

  profileBox.style.display = "block";
  profileEmail.textContent = user.email;
}

// ==============================
// LOAD USER
// ==============================
async function loadUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  showProfile(data.user);
}

// ==============================
// SIGN UP
// ==============================
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (password !== confirm) {
    setMessage("Passwords do not match", "error");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.href
    }
  });

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  setMessage("Account created. Check your email.", "success");
  signupForm.reset();
});

// ==============================
// LOGIN
// ==============================
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  setMessage("Logged in!", "success");
  loginForm.reset();
  loadUser();
});

// ==============================
// RESET PASSWORD
// ==============================
resetForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("reset-email").value;

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.href
  });

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  setMessage("Reset email sent", "success");
});

// ==============================
// LOGOUT
// ==============================
logoutBtn?.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  setMessage("Logged out", "success");
  showProfile(null);
});

// ==============================
// AUTH STATE LISTENER
// ==============================
supabaseClient.auth.onAuthStateChange((_event, session) => {
  showProfile(session?.user || null);
});

// ==============================
// INIT LOAD
// ==============================
loadUser();
