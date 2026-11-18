# CareBridge AI

CareBridge AI is a demo-ready elderly care coordination platform designed around AI-assisted daily check-ins, family visibility, caregiver tasking, and consent-first workflows.

## Demo accounts

Use the following demo credentials in the app login screen:

- Elderly user: `elderly@demo.com` / `carebridge123`
- Family member: `family@demo.com` / `carebridge123`
- Caregiver: `caregiver@demo.com` / `carebridge123`
- Administrator: `admin@demo.com` / `carebridge123`

## Local development

### Frontend

```bash
cd frontend
npm install
npx next dev -H 0.0.0.0 -p 3000
```

### Backend

```bash
cd backend
python -m venv .venv
. .venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Production build

```bash
cd frontend
npm run build
npm run start -- -H 0.0.0.0 -p 3000
```

## Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

## Notes

- The dashboard demo supports local check-ins, assistant chat, human-assistance and family-contact requests, caregiver task updates, notification acknowledgment, sharing preferences, and CSV report export.
- These dashboard actions are stored in the browser's local storage. They do not send email, LINE messages, or other external notifications.
- Demo assistant replies are rule-based. No OpenAI provider is connected by default.
- Demo accounts are for local walkthroughs only; frontend role selection is not production authentication or authorization.
- The app is designed for demonstration and research workflows, not medical diagnosis or treatment, and must not replace emergency services or care professionals.
