# ⚙️ React & Node.js Skill Test

## 📌 How to Run the App

1. Start backend

cd server

npm start

2. Start frontend

cd client

npm start


## API Testing via cURL

 

You can test the backend functionality independently using `cURL`:


For Sign in

curl -X POST http://localhost:3001/api/auth/signin \

  -H "Content-Type: application/json" \

  -d '{"email": "admin@gmail.com", "password": "admin123"}'


For Create a Meeting

curl -X POST http://localhost:3001/api/meeting/add \

  -H "Content-Type: application/json" \

  -H "Authorization: Bearer <token>" \

  -d '{

    "agenda": "welcome",

    "dateTime": "2025-10-25T10:00:00.000Z",

    "related": "Lead",

    "attendesLead": ["64f66c2e1220e920a7fc0be9"]

  }'


For View Meeting by ID

curl http://localhost:3001/api/meeting/view/<meeting_id> \

  -H "Authorization: Bearer <token>"


 For Delete Meeting(s)

curl -X POST http://localhost:3001/api/meeting/deleteMany \

  -H "Authorization: Bearer <token>" \

  -H "Content-Type: application/json" \

  -d '["<meeting_id1>", "<meeting_id2>"]'

---

Known Issue & Justification

 Issue

Navigating to `/metting/:id` sometimes renders an empty view or causes a 404-style response due to `undefined` being passed during fast redirects.

Justification

During routing, Redux or props hydration happens faster than routing. Importantly:
- Wallet successfully integrated with sign-in

- All meeting data is correctly stored and retrievable

- Meeting creation and deletion are fully functional

- API endpoints respond reliably to manual calls (`cURL` above)

📌 Finally "Thank You"

I would like to sincerely thank Metatheory for the opportunity to work on this technical test. It has been a valuable and enjoyable experience, and I appreciate the chance to demonstrate my skills.
