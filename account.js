const SUPABASE_URL = "https://wuobmtoskxqiiaejyrax.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MzNTtCgbH6gkTVts8myt2w_qyMztjIy";

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

const messageEl = document.getElementById("message");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const resetForm = document.getElementById("reset-form");

const profileBox = document.getElementById("profile-box");
const profileEmail = document.getElementById("profile-email");
const profileId = document.getElementById("profile-id");
const logoutBtn = document.getElementById("logout-btn");

const profileMenu = document.getElementById("profile-menu");
const profileTrigger = document.getElementById("profile-trigger");
const profileDropdown = document.getElementById("profile-dropdown");
const dropdownEmail = document.getElementById("dropdown-email");
const dropdownLogout = document.getElementById("dropdown-logout");

const tabButtons = document.querySelectorAll(".tab-btn");
const formPanels = {
  signup: document.getElementById("signup-panel"),
  login: document.getElementById("login-panel"),
  reset: document.getElementById("reset-panel")
};

const signedInOnlyEls = document.querySelectorAll(".signed-in-only");
const signedOutOnlyEls = document.querySelectorAll(".signed-out-only");

function setMessage(text, type = "") {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = "message";
  if (type) {
    messageEl.classList.add(type);
  }
}

function clearMessage() {
  if (!messageEl) return;
  messageEl.textContent = "";
  messageEl.className = "message";
}

function showTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  Object.entries(formPanels).forEach(([name, panel]) => {
    if (!panel) return;
    panel.classList.toggle("active", name === tabName);
  });
}

function setSignedInUi(user) {
  signedInOnlyEls.forEach((el) => el.classList.remove("hidden"));
  signedOutOnlyEls.forEach((el) => el.classList.add("hidden"));

  if (profileBox) profileBox.classList.add("visible");
  if (profileEmail) profileEmail.textContent = user?.email || "—";
  if (profileId) profileId.textContent = user?.id || "—";

  if (profileMenu) profileMenu.classList.add("visible");
  if (dropdownEmail) dropdownEmail.textContent = user?.email || "Signed in";
}

function setSignedOutUi() {
  signedInOnlyEls.forEach((el) => el.classList.add("hidden"));
  signedOutOnlyEls.forEach((el) => el.classList.remove("hidden"));

  if (profileBox) profileBox.classList.remove("visible");
  if (profileEmail) profileEmail.textContent = "—";
  if (profileId) profileId.textContent = "—";

  if (profileMenu) profileMenu.classList.remove("visible");
  if (profileDropdown) profileDropdown.classList.remove("open");
  if (dropdownEmail) dropdownEmail.textContent = "Signed out";
}

function renderUser(user) {
  if (user) {
    setSignedInUi(user);
  } else {
    setSignedOutUi();
  }
}

async function loadUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    const ignored = [
      "Auth session missing",
      "Invalid Refresh Token",
      "Refresh Token Not Found"
    ];

    const shouldIgnore = ignored.some((text) => error.message?.includes(text));

    if (shouldIgnore) {
      clearMessage();
      renderUser(null);
      return null;
    }

    setMessage(error.message, "error");
    renderUser(null);
    return null;
  }

  const user = data.user || null;
  renderUser(user);
  return user;
}

async function requireAuth() {
  const user = await loadUser();
  if (!user) {
    const current = encodeURIComponent(window.location.pathname.split("/").pop() || "members.html");
    window.location.href = `auth.html?redirect=${current}`;
  }
}

async function goToPostLoginDestination() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");

  if (redirect && !redirect.includes("http") && !redirect.includes("//")) {
    window.location.href = redirect;
    return true;
  }

  return false;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    clearMessage();
    showTab(button.dataset.tab);
  });
});

signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("signup-email")?.value.trim();
  const password = document.getElementById("signup-password")?.value;
  const confirm = document.getElementById("signup-confirm")?.value;

  if (!email || !password || !confirm) {
    setMessage("Please fill out all sign up fields.", "error");
    return;
  }

  if (password !== confirm) {
    setMessage("Passwords do not match.", "error");
    return;
  }

  if (password.length < 8) {
    setMessage("Password must be at least 8 characters.", "error");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://kelaris.io/auth.html"
    }
  });

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  if (data.user && !data.session) {
    setMessage("Account created. Check your email to confirm your account.", "success");
  } else {
    setMessage("Account created and signed in.", "success");
    await goToPostLoginDestination();
  }

  signupForm.reset();
  await loadUser();
});

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    setMessage("Please enter your email and password.", "error");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  setMessage("Logged in successfully.", "success");
  loginForm.reset();
  await loadUser();
  await goToPostLoginDestination();
});

resetForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("reset-email")?.value.trim();

  if (!email) {
    setMessage("Please enter your email.", "error");
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: "https://kelaris.io/auth.html"
  });

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  setMessage("Password reset email sent.", "success");
  resetForm.reset();
});

async function doLogout() {
  clearMessage();

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  renderUser(null);
  setMessage("Logged out.", "success");
}

logoutBtn?.addEventListener("click", doLogout);
dropdownLogout?.addEventListener("click", doLogout);

profileTrigger?.addEventListener("click", () => {
  profileDropdown?.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!profileMenu || !profileDropdown) return;
  if (!profileMenu.contains(e.target)) {
    profileDropdown.classList.remove("open");
  }
});

supabaseClient.auth.onAuthStateChange(async (_event, session) => {
  renderUser(session?.user || null);
});

loadUser();
window.kelarisRequireAuth = requireAuth;
