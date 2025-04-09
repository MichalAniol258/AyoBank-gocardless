# 💸 GoCardless Dashboard – Next.js App

A simple web application built with **Next.js** that integrates with the **GoCardless API**.  
It allows you to view account information and transaction history from your GoCardless account.

## 🔍 Features

- Connects to the GoCardless API
- Lists available accounts (mandates)
- Select which account you want to view
- Displays detailed information for the selected account
- Shows transaction history (payments, subscriptions, etc.)

## ⚙️ Tech Stack

- **Next.js** – React framework for building server-side rendered applications
- **TypeScript** – for type safety and better developer experience
- **GoCardless API** – used to fetch account and transaction data

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/MichalAniol258/AyoBank-gocardless.git
cd AyoBank-gocardless
npm install
npm run dev
```

```bash
GC_SECRET_ID=GOCARDLESS_SECRET_ID
GC_SECRET_KEY=GOCARDLESS_SECRET_KEY
URL_WHERE_REDIRECT=
