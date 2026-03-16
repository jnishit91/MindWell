# MindWell Irregularities Report

**Date:** 2026-03-16
**Repository:** jnishit91/MindWell

---

## Critical Issues

### 1. Missing API Authentication Headers (Security - CRITICAL)
**Location:** `src/App.jsx` lines 253, 264

Both fetch calls to `https://api.anthropic.com/v1/messages` are missing the required `x-api-key` and `anthropic-version` headers. These API calls will fail with 401 Unauthorized.

```js
// Current (broken):
headers: {"Content-Type": "application/json"}

// Required:
headers: {
  "Content-Type": "application/json",
  "x-api-key": ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01"
}
```

Additionally, calling the Anthropic API directly from the browser is a **security risk** — the API key would be exposed in client-side code/network traffic. A backend proxy should be used.

### 2. Hardcoded Test Razorpay Key (Security - CRITICAL)
**Location:** `src/App.jsx` line 280

```js
key: "rzp_test_placeholder_key" // placeholder in production code
```

This should be loaded from environment variables (`import.meta.env.VITE_RAZORPAY_KEY`).

### 3. No `.gitignore` File (Security - CRITICAL)
There is no `.gitignore` file. Any `.env` files, `node_modules/`, or `dist/` artifacts could be accidentally committed.

---

## High Severity Issues

### 4. Mock Authentication — No Real OTP Verification
**Location:** `src/App.jsx` lines 224-234

The OTP flow is entirely fake. `doAuth()` never actually sends or verifies an OTP — it just sets `otpSent = true` and accepts any input. Anyone can sign up with any phone number.

### 5. All Data in localStorage Only
**Location:** `src/App.jsx` lines 120, 147-158, 192-198

User data, wallet balance, transactions, journal entries, and sessions are all stored exclusively in `localStorage`. This means:
- Data is unencrypted and accessible via DevTools
- A user can manipulate their wallet balance trivially
- Data is lost when browser storage is cleared
- No server-side persistence or backup

### 6. Client-Side Wallet Balance Manipulation
**Location:** `src/App.jsx` lines 151, 241, 285

Wallet balance is stored in localStorage (`mw_bal`) and debited/credited entirely on the client side. A user can simply run `localStorage.setItem("mw_bal", "999999")` to give themselves unlimited balance.

---

## Medium Severity Issues

### 7. Session Cost Calculation Bug
**Location:** `src/App.jsx` line 240

```js
const cost = Math.max(50, Math.round(sessElapsed/60 * (selDoc.hourly/60)));
```

This divides `hourly` by 60 (to get per-minute rate) and multiplies by `sessElapsed/60` (which is also minutes). The math is actually correct but uses floating-point seconds division which can produce unexpected rounding. Should use `Math.ceil` for the time component to avoid undercharging:

```js
const cost = Math.max(50, Math.round(Math.ceil(sessElapsed/60) * (selDoc.hourly/60)));
```

### 8. Empty Error Handling in API Calls
**Location:** `src/App.jsx` lines 256, 267

```js
catch { setAiMsgs(m => [...m, {role:"assistant", text:"I'm here with you..."}]); }
```

Errors are silently swallowed with a generic message. No logging, no error differentiation. Users won't know if the issue is authentication, rate limiting, or network failure.

### 9. No Phone Number Validation
**Location:** `src/App.jsx` line 226

Only checks `.trim()` — no format validation. Accepts any string as a phone number (letters, single characters, etc.). Indian mobile numbers should be validated with `/^[6-9]\d{9}$/`.

### 10. Community Posts Not Persisted
**Location:** `src/App.jsx` line 169

Community posts are initialized from `INIT_COMMUNITY` on every page load. Unlike journal entries and sessions, user-created community posts are not saved to localStorage, so they are lost on refresh.

### 11. Unused `obDone` State Variable
**Location:** `src/App.jsx` line 125

`obDone` (onboarding done) is initialized from localStorage and persisted, but never used to conditionally render anything. Dead state variable.

### 12. No Rate Limiting on AI Chat
**Location:** `src/App.jsx` lines 247-258

Users can send unlimited messages to the Claude API with no throttling or rate limiting, which could result in excessive API costs.

---

## Low Severity Issues

### 13. Monolithic Component Architecture
The entire application (1207 lines) lives in a single `App.jsx` file with 30+ state variables. This should be decomposed into separate components (Auth, Therapists, Journal, Chat, Wallet, Community, etc.).

### 14. No Lock File
No `package-lock.json` or `yarn.lock` exists. Dependency versions are not pinned, which could lead to inconsistent builds.

### 15. Outdated Vite Version
`vite: ^4.4.0` — Vite 6.x is current. Major versions behind.

### 16. No Accessibility (a11y) Support
No ARIA labels, no keyboard navigation support, no semantic HTML in modals/dialogs. Screen reader users cannot navigate the app.

### 17. Inline CSS Everywhere
All styles are inline or in a global CSS string. No CSS modules, styled-components, or separate stylesheets. Makes theming and maintenance difficult.

### 18. Mock Therapy Session Responses
**Location:** `src/App.jsx` line 834 area

Therapist responses in sessions are hardcoded with a 1200ms delay — not connected to any AI or real therapist.

---

## Summary

| Severity | Count | Examples |
|----------|-------|---------|
| Critical | 3 | Missing API auth, hardcoded keys, no .gitignore |
| High | 3 | Fake OTP, client-side wallet, localStorage only |
| Medium | 6 | Cost calc bug, empty catch blocks, no validation |
| Low | 6 | Monolithic architecture, no a11y, no lock file |

**Total irregularities found: 18**

The application is currently a frontend-only prototype with no backend services. The most urgent issues are the missing API authentication headers (which make the AI chat completely non-functional) and the absence of a `.gitignore` file (which poses a risk of accidentally committing secrets).
