# AFAQ Club — Static site + Firebase backend (proposed)

This project started as a static site. The repository now contains client-side integration with Firebase (Auth, Firestore, Storage) and example Cloud Functions to manage user roles.

What I added
- Firebase SDK includes and `assets/firebase-config.example.js` (copy to `assets/firebase-config.js` and fill your config).
- `pages/register.html` and `pages/login.html` updated to use Firebase Auth for register/login flows.
- `pages/forum.html` — forum front-end using Firestore (`threads` collection). Only approved & email-verified users can post.
- `pages/media.html` — media center using Storage and Firestore (`media` collection). Upload allowed for approved users.
- `pages/decisions.html` — protected form visible only to users with role `president` and `approved`.
- `functions/` — example Firebase Cloud Function `setRole` to set user custom claims and update Firestore `users/{uid}` doc.
- `script.js` updated to use Firebase Auth for login/logout and to check user approval/roles.

Quick setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password), Firestore (in native mode), and Storage.
3. Copy `assets/firebase-config.example.js` to `assets/firebase-config.js` and fill your Firebase config values.
4. (Optional) Deploy Cloud Functions:
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize functions (if not yet): `firebase init functions`
   - In `functions/` set env var `FUNCTIONS_ADMIN_SECRET` before deploy or set with `firebase functions:config:set`.
   - Deploy: `firebase deploy --only functions`
5. Host the static site on Netlify (drag & drop or link repo) — enable `_redirects` and set publish directory to project root.

Admin flow for approving users
- After a user registers, they must verify their email.
- An admin uses the Cloud Function endpoint (`/setRole`) or manually updates Firestore `users/{uid}` to set `approved: true` and `roles: ['member']` or `['president']`.

Local testing
- You can run a simple static server locally for the frontend:

```powershell
cd 'C:\Users\حسين عبدالله آل مانع\Desktop\wep'
python -m http.server 8000
# open http://localhost:8000/pages/register.html
```

Notes & next steps
- This implementation uses Firestore to store `users/{uid}` with `approved` and `roles` fields. For stricter security use Firebase custom claims and security rules.
- I can help add Firestore Security Rules, admin UI for approving users, pagination for forum, and moderation tools.

If you want I can continue by:
- Adding an admin interface to approve users from the site.
- Adding Firestore security rules and example rules file.
- Implementing server-side rendering or migration to a Node API instead of purely Firebase.

Tell me which next step to take (e.g., "Add admin UI", "Add security rules", "Deploy functions for me").

Admin UI
--------
I added a basic admin interface at `pages/admin.html` that lists Firestore `users` documents and can call the Cloud Function `setRole` to set `approved` and `roles` for a user. To use it:

- Deploy the Cloud Function `functions/api.setRole` (see `functions/README.md`).
- Copy `assets/functions-config.example.js` to `assets/functions-config.js` and set `FUNCTIONS_BASE_URL` (the functions base URL) and `FUNCTIONS_ADMIN_SECRET` (the secret used by the function). WARNING: do NOT commit the secret to public repos.

The admin UI is a convenience front-end — for production you should secure the functions endpoint and prefer server-side secret management.

Security Rules
--------------
I included example Firestore and Storage rules in `firestore.rules` and `storage.rules`. These rules:

- Allow public read of `threads`, `media`, and decisions.
- Restrict creation of `threads` and `media` to users who have `approved: true` in `users/{uid}`.
- Restrict creation of `decisions` to users with `approved: true` and role `president`.

To apply rules:

1. Install Firebase CLI and login:

```powershell
npm install -g firebase-tools
firebase login
```

2. Deploy rules (from your Firebase project folder):

```powershell
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

Adjust rules to your needs before deploying. The provided rules are a starting point and should be tested.

# AFAQ Club — Static site + Supabase backend

هذا المشروع يستخدم الآن Supabase (Auth, Postgres, Storage) لخاصيات المصادقة، البيانات، والتخزين.

الملفات المهمة
- `assets/supabase-config.example.js` — مثال إعدادات العميل (انسخه إلى `assets/supabase-config.js` أثناء النشر).
- `build-scripts/generate-supabase-config.js` — يولّد `assets/supabase-config.js` من متغيري البيئة `SUPABASE_URL` و`SUPABASE_ANON_KEY` عند البناء.
- `migrations/supabase_schema.sql` — سكربت SQL لإنشاء الجداول (`profiles`, `threads`, `media`, `decisions`) والمشغلات وسياسات RLS.
- `functions/index.js` — دالة إدارية (مثال) تستخدم Supabase service role لتعيين `roles` و`approved` في جدول `profiles`. احفظ مفاتيح الخدمة كأسرار على الخادم.

إعداد سريع
1. أنشئ مشروعًا في Supabase: https://app.supabase.com
2. في لوحة Supabase → SQL Editor نفّذ محتوى `migrations/supabase_schema.sql` لإنشاء الجداول والسياسات.
3. من Storage أنشئ Bucket اسمه `media` (أو غيّر الاسم في الكود ليتطابق).
4. فعّل إعدادات البريد (SMTP) في Authentication → Settings → Email إذا أردت تأكيد البريد.

متغيرات بيئة ضرورية
- للعميل (خاصة بالصفحات الثابتة):
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- للخادم (أسرار — لا تعرض للعميل):
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `FUNCTIONS_ADMIN_SECRET`

كيفية توليد `assets/supabase-config.js` أثناء البناء
- شغِّل السكربت في `build-scripts` أو أضفه إلى خطوات البناء في Netlify/GitHub Actions:

```powershell
# مثال محلي
$env:SUPABASE_URL = "https://your.supabase.co"
$env:SUPABASE_ANON_KEY = "your-anon-key"
node build-scripts/generate-supabase-config.js
```

نشر الدالة الإدارية (اختياري)
- الدالة في `functions/index.js` تستخدم `SUPABASE_SERVICE_ROLE_KEY` وتتحقق من `x-admin-secret`. يمكنك نشرها كـ Firebase Function أو Netlify Function أو أي مزود تدعمه.
- تأكد من ضبط المتغيرات السرية في بيئة النشر (Netlify Secrets / GitHub Secrets / Firebase functions config).

تشغيل محلي سريع
```powershell
npx http-server . -p 8080
# ثم افتح http://localhost:8080
```

ملاحظات أمنية
- لا تضع `SUPABASE_SERVICE_ROLE_KEY` أو `FUNCTIONS_ADMIN_SECRET` في ملفات العميل أو في مستودع عام.
- استخدم الدالة الإدارية فقط عبر اتصال آمن من الخادم وراجع السجلات عند طلبات الإدارة.

هل تريد مساعدة لنشر الموقع إلى Netlify أو تحويل `functions/index.js` إلى Netlify Function؟ أخبرني وسأجهز الملفات والتعليمات اللازمة.
