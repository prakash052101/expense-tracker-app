# Deploying to Render

## Prerequisites

1. MongoDB Atlas account with a cluster created
2. Render account

## Environment Variables

Set the following environment variables in your Render dashboard:

### Required Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret
PORT=4000
NODE_ENV=production
```

### Email Configuration

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

### Payment Gateway (Razorpay)

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRECT=your_razorpay_key_secret
```

### Email Service (Sendinblue)

```
user=your_sendinblue_user
pass=your_sendinblue_pass
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database user password
7. Add database name (e.g., `expense-tracker`) to the connection string

## Render Deployment Steps

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add all environment variables listed above
5. Deploy!

## Testing the Connection

After deployment, you can test the MongoDB connection by running:

```bash
npm run test:db
```

This will verify that your `MONGODB_URI` is correctly configured.

## Notes

- Ensure your MongoDB Atlas cluster allows connections from all IPs (0.0.0.0/0)
- Use strong passwords for production
- Keep your JWT_SECRET secure and unique
- Monitor your MongoDB Atlas usage to stay within free tier limits
