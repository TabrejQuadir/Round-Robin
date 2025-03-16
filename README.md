# 🎟️ Round-Robin Coupon Distribution with Admin Panel

## 📌 Overview
This is a full-stack web application that distributes coupons to guest users in a round-robin manner while providing an admin panel for coupon management and abuse prevention.

## 🛠 Tech Stack
- **Frontend:** React, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Cookies

## 🚀 Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone https://github.com/TabrejQuadir/Round-Robin.git
   cd Round-Robin

2. **Install Dependencies**
   ```sh
   cd client
   npm install

3. **Run the Application**
   ```sh
   npm run dev

4. **Backend Setup**
   ```sh
   cd ../server
   npm install
   npm server.js

   Api Endpoints:
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/coupons
   - POST /api/coupons
   - DELETE /api/coupons/:id
   - GET /api/user-coupons/claimed → Get claimed coupon history (Admin only)

   Features:
- ✅ Users can claim coupons without logging in
- ✅ Prevent abuse using IP & cookie tracking
- ✅ Admin panel to add, edit, and view coupon history
- ✅ JWT authentication for admins
- ✅ Real-time updates on coupon claims   

## 🛠️ Implementation Details

### Frontend
- User Interface for claiming coupons
- Admin Panel for managing coupons and history
- Real-time updates

### Backend
- JWT authentication for admin users
- MongoDB for storing coupons and history
- Round-robin distribution logic
- Abuse prevention measures

### Security
- Secure authentication with JWT
- Protected admin routes
- IP and cookie tracking for abuse prevention

## 📝 License
MIT License

🔐 Admin Panel
To access the admin panel, log in with:
📧 Email: admin@gmail.com
🔑 Password: admin

🌍 Live Deployment
🔗 URL: https://roundrobin-y25v.onrender.com
