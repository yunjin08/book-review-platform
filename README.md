# 📚 Book Review Platform

A platform for managing and reviewing books. This guide helps you set up both the frontend and backend.

---

## 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Backend Setup

### 1. Create and Activate Virtual Environment

```bash
python -m venv venv
source venv/bin/activate       # For macOS/Linux
# OR
venv\Scripts\activate          # For Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Migrations (Before running this, insert the env)

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Populate Initial Data (Optional)

```bash
python manage.py initialize_data
```

---

## 🔐 Environment Variables

All required environment variables are listed here (UP access):  
➡️ [Environment Setup Guide](https://docs.google.com/document/d/1UqNh61WIitqJ4tXoXBUMkpUMcrNn-GTRKiZCo8iydyQ/edit?usp=sharing)

---

## ✅ Notes

- Ensure your database (e.g., PostgreSQL) is running and properly configured.
- Store sensitive information in a `.env` file at the root of your backend directory.
