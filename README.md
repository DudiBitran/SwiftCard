# 🧾 Swift Card

Swift Card is a sleek and modern business card management platform built with React. It allows users to view, like, and manage business cards through a responsive and intuitive interface. Admins and Business Users have extended access for creating and managing content, while Regular Users can engage by browsing and favoriting cards.

## 🚀 Features

- 🔐 **Authentication & Authorization**

  - Secure login & registration using JWT
  - Role-based access:
    - **Regular User** – can view all cards, like/unlike them, and manage their **Favorite Cards**
    - **Business User** – can create, edit, and delete their own business cards
    - **Admin** – can **view**, **delete**, and **like** any card, and also **manage users**, but **cannot edit** cards
    - **Business Admin** – has full access: can **create**, **edit**, **delete** any card, and manage users via the **User Management Sandbox**

- 📝 **Card Management**

  - Business Users can create, edit, and delete business cards for their company
  - **Admins** can delete any card and manage users, but **cannot edit cards**
  - **Business Admins** have full control, including creating, editing, deleting all cards, and managing users
  - View full card details
  - Like & Unlike cards

- ❤️ **Favorites System**

  - Regular Users can like cards and store them in the **Favorite Cards** tab
  - Favorites are easily accessible and personalized

- 🔍 **Search & Filter**

  - Search cards by title or subtitle
  - Filter views: My Cards / All Cards / Favorite Cards

- 🛠️ **Admin Tools**

  - Assign or update **BizNumbers** for cards
  - Access to all cards system-wide
  - **User Management Sandbox** (Business Admin only) to control user permissions and roles

- 🌗 **Theme Toggle**

  - Switch between **Dark Mode** and **Light Mode** for a personalized experience

- 🛎️ **Smart Notifications**

  - Interactive feedback with **React Toastify**

- 📱 **Responsive Design**
  - Clean, mobile-first design using Bootstrap 5

## 🧰 Tech Stack

- **React 19**
- **React Router v7**
- **Bootstrap 5 + Bootstrap Icons**
- **Formik** – Forms handling
- **Joi** – Schema validation
- **Axios** – HTTP requests
- **JWT Decode** – Token parsing
- **Lodash.isEqual** – Deep object comparison
- **React Toastify** – Toast notifications

## 📦 Installation

```bash
git clone https://github.com/DudiBitran/SwiftCard-frontend.git
cd SwiftCard-frontend
cd business-cards-platrorm
npm install
npm run dev
```
