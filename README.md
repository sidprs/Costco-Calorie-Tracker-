# Costco Calorie Tracker

This project has a **frontend** (React) and a **backend** (Node.js/Express).
You will need **two terminals** to run them simultaneously.

---

## Setup

### 1. Install dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

---

### 2. Run the project

Open **two terminals**:

**Terminal 1 – Backend**

```bash
cd backend
node server.js
```

**Terminal 2 – Frontend**

```bash
cd frontend
npm start
```

---

## Troubleshooting

1. **`Module not found: bcrypt`**

```bash
cd backend
npm install bcryptjs
```

Then update your imports in `auth.js`:

```js
const bcrypt = require('bcryptjs');
```

2. **`Module not found: react-router-dom`**

```bash
cd frontend
npm install react-router-dom
```

```bash
xcode-select --install
```

* For any missing packages, run:

```bash
npm install <package-name>
```



