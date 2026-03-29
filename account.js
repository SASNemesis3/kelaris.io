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

const SITE_ORIGIN = window.location.origin && window.location.origin.startsWith("http") ? window.location.origin : "https://kelaris.io";

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

const dropdownAvatar = document.getElementById("dropdown-avatar");
const triggerAvatar = document.getElementById("trigger-avatar");
const triggerLabel = document.getElementById("trigger-label");

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

function getUserDisplayText(user) {
  return user?.email || "Signed in";
}

function getInitialsFromUser(user) {
  const email = user?.email?.trim();
  if (!email) return "U";

  const localPart = email.split("@")[0];
  if (!localPart) return "U";

  const cleaned = localPart.replace(/[^a-zA-Z0-9._-]/g, "");
  const splitParts = cleaned.split(/[._-]+/).filter(Boolean);

  if (splitParts.length >= 2) {
    return (
      (splitParts[0][0] || "") +
      (splitParts[1][0] || "")
    ).toUpperCase();
  }

  return cleaned.slice(0, 2).toUpperCase();
}

function fillAvatar(el, initials) {
  if (!el) return;
  el.textContent = initials;
}

function fillSharedProfileFields(user) {
  const emailText = getUserDisplayText(user);
  const initials = getInitialsFromUser(user);

  if (profileEmail) {
    profileEmail.textContent = user?.email || "—";
  }

  if (profileId) {
    profileId.textContent = user?.id || "—";
  }

  if (dropdownEmail) {
    dropdownEmail.textContent = emailText;
  }

  fillAvatar(dropdownAvatar, initials);
  fillAvatar(triggerAvatar, initials);

  if (triggerLabel) {
    triggerLabel.textContent = "Account";
  }
}

function clearSharedProfileFields() {
  if (profileEmail) {
    profileEmail.textContent = "—";
  }

  if (profileId) {
    profileId.textContent = "—";
  }

  if (dropdownEmail) {
    dropdownEmail.textContent = "Signed out";
  }

  fillAvatar(dropdownAvatar, "U");
  fillAvatar(triggerAvatar, "U");

  if (triggerLabel) {
    triggerLabel.textContent = "Account";
  }
}

function setSignedInUi(user) {
  signedInOnlyEls.forEach((el) => el.classList.remove("hidden"));
  signedOutOnlyEls.forEach((el) => el.classList.add("hidden"));

  if (profileBox) {
    profileBox.classList.add("visible");
  }

  if (profileMenu) {
    profileMenu.classList.add("visible");
  }

  fillSharedProfileFields(user);
}

function setSignedOutUi() {
  signedInOnlyEls.forEach((el) => el.classList.add("hidden"));
  signedOutOnlyEls.forEach((el) => el.classList.remove("hidden"));

  if (profileBox) {
    profileBox.classList.remove("visible");
  }

  if (profileMenu) {
    profileMenu.classList.remove("visible");
  }

  if (profileDropdown) {
    profileDropdown.classList.remove("open");
  }

  clearSharedProfileFields();
}

function renderUser(user) {
  if (user) {
    setSignedInUi(user);
  } else {
    setSignedOutUi();
  }
}

function getSafeRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");

  if (!redirect) {
    return null;
  }

  if (
    redirect.includes("http") ||
    redirect.includes("//") ||
    redirect.includes("\\") ||
    redirect.startsWith("/")
  ) {
    return null;
  }

  return redirect;
}

async function loadUser() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      const ignoredErrors = [
        "Auth session missing",
        "Invalid Refresh Token",
        "Refresh Token Not Found"
      ];

      const shouldIgnore = ignoredErrors.some((text) =>
        error.message?.includes(text)
      );

      if (shouldIgnore) {
        clearMessage();
        renderUser(null);
        return null;
      }

      setMessage(error.message, "error");
      renderUser(null);
      return null;
    }

    const user = data?.user || null;
    renderUser(user);
    return user;
  } catch (_err) {
    setMessage("Could not load account session.", "error");
    renderUser(null);
    return null;
  }
}

async function requireAuth() {
  const user = await loadUser();

  if (!user) {
    const currentPage =
      window.location.pathname.split("/").pop() || "members.html";
    const safePage = encodeURIComponent(currentPage);
    window.location.href = `auth.html?redirect=${safePage}`;
  }
}

async function goToPostLoginDestination() {
  const redirect = getSafeRedirectTarget();

  if (!redirect) {
    return false;
  }

  window.location.href = redirect;
  return true;
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
      emailRedirectTo: `${SITE_ORIGIN}/auth.html`
    }
  });

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  if (data.user && !data.session) {
    setMessage(
      "Account created. Check your email to confirm your account.",
      "success"
    );
  } else {
    setMessage("Account created and signed in.", "success");
    await loadUser();
    await goToPostLoginDestination();
  }

  signupForm.reset();
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
    redirectTo: `${SITE_ORIGIN}/auth.html`
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

  if (window.location.pathname.endsWith("members.html")) {
    window.location.href = "auth.html";
  }
}

logoutBtn?.addEventListener("click", doLogout);
dropdownLogout?.addEventListener("click", doLogout);

profileTrigger?.addEventListener("click", () => {
  if (profileDropdown) {
    profileDropdown.classList.toggle("open");
  }
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
