
# 🔐 Secure Vault: Searchable Encryption System

## Problem Statement
**Secured String Matching using Searchable Encryption**  
Design and develop a secure system that enables string matching on encrypted data while preserving confidentiality and privacy.

---

## 🚀 Overview
**Secure Vault** is a full-stack application that implements **Searchable Symmetric Encryption (SSE)**.  
Unlike traditional databases—where searching requires decrypting data or storing it in plaintext—this system uses **Blind Indexing**. This allows the server to locate matching records without ever learning the underlying sensitive data until the final decryption stage.

---

## ✨ Key Features
- **Blind Indexing:** Uses `HMAC-SHA256` to create searchable hashes of sensitive fields.
- **AES-GCM Encryption:** Provides authenticated encryption with associated data (AEAD).
- **Unicode Normalization:** Uses NFKC normalization for consistent and secure matching.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Can search and view fully decrypted sensitive data.
  - **User:** Can verify the existence of a record without viewing its contents.
- **Cyberpunk Terminal UI:** A sleek React interface styled as a secure database terminal.

---

## 🛠️ Tech Stack

| Component  | Technology |
|------------|------------|
| Frontend   | React (Tailwind CSS) |
| Backend    | Python (Flask, Flask-CORS) |
| Database   | MySQL |
| Cryptography | `cryptography` (AES-GCM), HMAC-SHA256 |
| Environment | `python-dotenv` |

---

## 🏗️ System Architecture

### 1. Normalization
Input strings are normalized and lowercased using Unicode NFKC:
```python
unicodedata.normalize('NFKC', name).lower()
````

### 2. Blind Index Generation

A deterministic blind index is created using a dedicated index key:

[
\text{Index} = \text{HMAC-SHA256}(\text{Key}_{index}, \text{Normalized_String})
]

### 3. Storage

Sensitive data is encrypted using AES-GCM and stored as a ciphertext blob.

### 4. Retrieval

When searching:

* The backend computes the blind index for the query
* Matches it against stored index columns in MySQL
* No plaintext exposure during matching

### 5. Decryption

Only after a successful match:

* The ciphertext is decrypted using the `MASTER_KEY`
* AES-GCM validates integrity via `auth_tag`

---

## ⚙️ Setup & Installation

### 1️⃣ Backend Configuration

Navigate to the `backend/` directory and create a `.env` file:

```env
ENCRYPTION_KEY_HEX=your_32_byte_hex_master_key
INDEX_KEY_HEX=your_32_byte_hex_index_key
```

#### Install Dependencies

```bash
pip install flask flask-cors mysql-connector-python python-dotenv cryptography
```

#### Run Backend

```bash
python secure_vault.py
```

---

### 2️⃣ Frontend Configuration

Ensure the API endpoint in `App.jsx` matches your backend IP
(Currently configured for `172.16.9.29`)

#### Install Dependencies

```bash
npm install
npm run dev
```

---

### 3️⃣ Database Schema

Create a MySQL table `secure_vault` with the following structure:

| Column Name       | Type             | Description                      |
| ----------------- | ---------------- | -------------------------------- |
| `idx_name`        | BINARY/VARBINARY | Blind index for name             |
| `idx_account_id`  | BINARY/VARBINARY | Blind index for account ID       |
| `ciphertext_blob` | BLOB             | AES-GCM encrypted data           |
| `nonce`           | BINARY           | AES-GCM nonce                    |
| `auth_tag`        | BINARY           | Authentication tag for integrity |

---

## 🔒 Security Implementation Details

> ⚠️ **Important:** This system prevents inference attacks by using **separate keys** for indexing and encryption.

### 🔑 Key Separation

* `INDEX_KEY`: Generates blind indexes (searchable hashes)
* `MASTER_KEY`: Encrypts and decrypts sensitive data

Even if the database is compromised, attackers **cannot reverse HMAC hashes** without the `INDEX_KEY`.

### 🔠 Normalization Protection

```python
unicodedata.normalize('NFKC', name)
```

Prevents bypass attacks using visually similar Unicode characters.

### 🛡️ Data Integrity

AES-GCM provides an `auth_tag`, ensuring:

* Any tampering with ciphertext causes decryption failure
* Guarantees authenticity and integrity of stored data

---

## 👥 Contributors

* **Backend & Cryptography:** Python/Flask implementation of SSE
* **Frontend & UX:** React-based secure terminal interface

---

## 📜 License

This project is intended for academic and research purposes related to secure searchable encryption systems.

```
```
