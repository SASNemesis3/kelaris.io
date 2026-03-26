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

const msg = document.getElementById("message");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const resetForm = document.getElementById("reset-form");
const profileBox = document.getElementById("profile");
const profileEmail = document.getElementById("profile-email");
const logoutBtn = document.getElementById("logout");

function setMessage(text, type = "") {
  if (!msg) return;
  msg.textContent = text;
  msg.className = type;
}

function clearMessage() {
  if (!msg) return;
  msg.textContent = "";
  msg.className = "";
}

function showProfile(user) {
  if (!profileBox) return;

  if (!user) {
    profileBox.style.display = "none";
    if (profileEmail) profileEmail.textContent = "";
    return;
  }

  profileBox.style.display = "block";
  if (profileEmail) profileEmail.textContent = user.email || "";
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

      if (!shouldIgnore) {
        setMessage(error.message, "error");
      }

      showProfile(null);
      return;
    }

    showProfile(data.user || null);
  } catch (err) {
    setMessage("Could not load account session.", "error");
    showProfile(null);
  }
}

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
  }

  signupForm.reset();
  loadUser();
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
  loadUser();
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

logoutBtn?.addEventListener("click", async () => {
  clearMessage();

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  showProfile(null);
  setMessage("Logged out.", "success");
});

supabaseClient.auth.onAuthStateChange((_event, session) => {
  showProfile(session?.user || null);
});

loadUser();
