# Costco Calorie Tracker

This project has a **frontend** (React) and a **backend** (Node.js/Express).
You will need **two terminals** to run them simultaneously.

---

## Setup

### 1. Set up environment

**Create following .env file in root of backend directory:**

```bash
DB_USER=<your username>
DB_HOST=localhost
DB_NAME=costco_tracker
DB_PASSWORD=<your password>
DB_PORT=5432
JWT_SECRET=costco-calorie-tracker-secret-key
```

**Database:**

```bash
createdb costco_tracker && psql -d costco_tracker -f costco.sql
```

### 2. Install dependencies

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

### 3. Run the project

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



