# Day 1 — Learning Summary

**Date:** 10 April 2026
**Project:** Ecommerce Auth Flow (React + FastAPI)

---

## 1. Project Structure

Folder layout inside `src/`:

| Folder | Purpose |
|--------|---------|
| `api/` | API call functions |
| `components/` | Reusable UI components |
| `config/` | Axios instance + API endpoints |
| `locales/` | `en.js` (strings) + `routes.js` (paths) |
| `pages/` | Page-level components |
| `routes/` | App routing setup |
| `validators/` | Yup schemas |

---

## 2. React Concepts

- Reusable components — `FormInput`, `FormButton`
- **Barrel exports** — `index.js` per folder so imports stay clean
  ```js
  import { Login, Register } from "../pages";
  ```

---

## 3. Routing

- Route paths stored in one file (`routes.js`) — no magic strings scattered around
- Used `BrowserRouter`, `Routes`, `Route`, `Link`

---

## 4. Formik — Form Handling

- `useFormik` with `initialValues`, `validationSchema`, `onSubmit`
- Destructure formik to keep JSX clean:
  ```js
  const {
    values: { email },
    touched: { email: touchedEmail },
    errors: { email: errorEmail },
    handleChange,
    handleSubmit,
  } = formik;
  ```

---

## 5. Yup — Validation

- Schema-based validation paired with Formik
- Key methods: `.string()`, `.email()`, `.required()`, `.min()`, `.oneOf()`, `.ref()`
- Factory function pattern so error messages come from `en.js`:
  ```js
  const createLoginSchema = (v) => yup.object({ ... });
  ```

---

## 6. en.js — String Externalization

- All UI text in one file, grouped by section (AUTH, LOGIN, REGISTER, VALIDATION …)
- Keys sorted in **ascending (A→Z) order**
- No hardcoded strings inside components
- Route paths kept separately in `routes.js`

---

## 7. Axios — API Setup

- Single `axiosInstance` created with `baseURL`, `timeout`, `headers` — reused everywhere
- API endpoint paths in `apiConfig.js`
- Base URL stored in `.env`:
  ```
  VITE_API_URL=http://127.0.0.1:8000
  ```
- Error handling:
  ```js
  err.response?.data?.detail ?? ERROR_FALLBACK
  // optional chaining (?.)  +  nullish coalescing (??)
  ```

---

## 8. React Toastify — Notifications

- `<ToastContainer>` placed once in `App.jsx`
- `successToast` / `errorToast` as separate util functions
- v11 fix: must pass `theme="light"` to avoid grey overlay bug

---

## 9. JS Patterns

- **Destructuring** — objects, nested, with aliases
- **Import order:**
  1. React / core
  2. External libraries
  3. Internal project files
  4. Styles / images / data
Formik

---

## 10. Axios Interceptors

- Axios interceptors run before a request leaves the app or after a response comes back.
- Request interceptor:
  ```js
  axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  ```
- Response interceptor:
  - catches global API errors
  - can log out the user on `401 Unauthorized`
  - avoids repeating the same token logic in every API file

---

## 11. Redux Auth Storage

- Redux keeps login credentials in one central store:
  - `token`
  - `username`
  - `email`
  - `role`
- Components read auth data with selectors instead of reading `localStorage` directly.
- The store can still persist auth data to `localStorage` so refresh does not immediately log the user out.
- Main flow:
  ```js
  dispatch(setCredentials(response));
  dispatch(clearCredentials());
  ```

---

## 12. Role-Based Auth

- Registration now stores a user role such as:
  - `customer`
  - `sales`
  - `support`
  - `admin`
- Login can send the selected role, but the backend verifies it against the saved account role.
- Never trust the role only from the frontend dropdown.
- JWT token payload includes the role so protected APIs can know what kind of user is logged in.

---

## 13. Role-Based Routing

- Admin users redirect to:
  ```txt
  /admin
  ```
- Customer, sales, and support users redirect to:
  ```txt
  /dashboard
  ```
- `ProtectedRoute` checks:
  - user is logged in
  - required role matches when a page is admin-only
- Admin dashboard and normal dashboard are separate components, so admins do not see the same buying/product dashboard as customers.

---

## 14. PostgreSQL Auth Mode

- `VITE_AUTH_MODE=api` uses the FastAPI backend instead of local demo users.
- Signup data is stored in PostgreSQL in the `users` table.
- The backend database URL is stored in:
  ```txt
  backend/.env
  ```
- Current local DB URL:
  ```txt
  postgresql://postgres@localhost:5433/reactproject
  ```
- SQLAlchemy creates the table from `backend/models/user.py`.
- Passwords are not stored as plain text in PostgreSQL; the backend stores `hashed_password`.
- After successful login, only the active session is stored in Redux.

---

## 15. Local Auth Mode

- `VITE_AUTH_MODE=local` skips the backend login request and checks users from `src/data/users.js`.
- Demo credentials live in:
  ```txt
  src/data/users.js
  ```
- After login, the active session is stored in Redux:
  ```js
  dispatch(setCredentials(response));
  ```
- Redux persists the active session to browser `localStorage` using:
  ```txt
  authCredentials
  ```
- Newly registered local users cannot be written back to source files from the browser, so they are saved in browser `localStorage` using:
  ```txt
  localUsers
  ```

---

## 16. Extending an Existing Backend Without Breaking It

- New DB tables = new files under `backend/models/`, one model per file, same shape as the existing `models/user.py`
- `main.py` has to explicitly import every new model module so `Base.metadata.create_all` picks it up:
  ```python
  from models import product as product_model  # noqa: F401 — registers Product model with Base
  ```
- New routers get added the same way — `app.include_router(catalog.router)` — never edit the old router files, just add new ones and wire them in

---

## 17. Shared Auth Dependency (`deps.py`)

- Every protected route needs the current user — instead of repeating JWT-decode logic in each router, write it once:
  ```python
  def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User: ...
  def require_roles(*roles: str):
      def dependency(user: User = Depends(get_current_user)) -> User:
          if user.role not in roles:
              raise HTTPException(status_code=403, ...)
          return user
      return dependency
  ```
- Usage: `Depends(require_roles("admin", "seller"))` — reads like a sentence at the route definition

---

## 18. Storing Images Directly in Postgres

- For a small catalog it's fine to skip disk/cloud storage — add a `LargeBinary` column and store raw bytes
- Frontend sends the image as a base64 **data URL** (`FileReader.readAsDataURL`), backend parses it:
  ```python
  DATA_URL_RE = re.compile(r"^data:(?P<mime>[\w/.+-]+);base64,(?P<data>.+)$")
  ```
- Serving it back is just a raw `Response`, not JSON:
  ```python
  return Response(content=product.image_data, media_type=product.image_mime_type)
  ```

---

## 19. Mocking External Services (Payment / Email)

- When there are no real API keys yet, isolate the fake behavior in its own service file so it's a one-file swap later — don't scatter mock logic across routers
- `services/payment_gateway.py`: `create_order()` then `verify_payment()` as two separate calls, even though both are fake — matches how the real Razorpay flow works, so nothing else has to change when real keys arrive
- `services/email_service.py`: logs the invoice instead of sending it — same idea

---

## 20. Ownership-Based Authorization

- Instead of special-casing "admin can edit anything, seller can only edit their own," give every row a `created_by` and check `product.created_by == current_user.id` for **everyone**, admin included
- One rule, no branching per role — simpler and harder to get wrong

---

## 21. Redux Circular Import Bug (real bug hit this session)

- `store/index.js` imports every slice → if a slice imports an API file → which imports `axiosInstance` → which imports `{ store }` from `store/index.js`, that's a cycle
- Symptom: `Cannot access 'xReducer' before initialization` — crashes the whole app on load
- Fix: **never import the API layer inside a slice file.** Keep slices to reducers/actions only; do the API call in the component and dispatch the plain action with the result:
  ```js
  // bad: inside cartSlice.js
  export const refreshCartCount = createAsyncThunk("cart/refresh", () => getCart());

  // good: inside the component
  const cart = await addToCart(productId, 1);
  dispatch(setCartCount(cart.total_count));
  ```

---

## 22. Adding a Third Role to Existing Role-Based Routing

- `USER_ROLES` object and `createUserRoleOptions()` were already data-driven, so adding `SELLER: "seller"` there was enough to make it show up in the login/register role dropdowns automatically — no dropdown JSX to touch
- `ProtectedRoute requiredRole={...}` pattern just needed one more wrapped route block for `/seller`
- `authRedirect.js`'s `getDashboardRouteForRole()` needed one more `if` branch — same pattern as the existing admin check, just extended

---

## 23. End-to-End Testing With Playwright (no dev browser available)

- In a headless/sandboxed environment there's no real browser to click around in — `npx playwright install chromium` gets a real one, then drive it with a plain script:
  ```js
  const { chromium } = require("playwright");
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(url);
  await page.fill('input[name="identifier"]', "admin_demo");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin$/);
  await page.screenshot({ path: "out.png" });
  ```
- Screenshots + `console --errors`-style listening (`page.on("console", ...)`) catch real render/runtime bugs that lint and build alone miss
