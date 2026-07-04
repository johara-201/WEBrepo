const nodemailer = require("nodemailer");

const transporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : null;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendEmail(to, subject, html) {
  if (!to) return;

  if (!transporter) {
    console.log("Email skipped: EMAIL_USER or EMAIL_PASS is missing");
    console.log("To:", to);
    console.log("Subject:", subject);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
}

const FIELD_LABELS = {
  he: {
    title: "שם המשרה",
    organization: "ארגון",
    city: "יישוב",
    jobType: "סוג תפקיד",
    employmentPercent: "אחוז משרה",
    distanceMinutes: "מרחק נסיעה",
    suitableForStudents: "התאמה לסטודנטים",
    description: "תיאור המשרה",
    applyUrl: "קישור הגשה",
  },
  ar: {
    title: "اسم الوظيفة",
    organization: "المؤسسة",
    city: "البلدة",
    jobType: "نوع الوظيفة",
    employmentPercent: "نسبة الوظيفة",
    distanceMinutes: "مدة السفر",
    suitableForStudents: "مناسب للطلاب",
    description: "وصف الوظيفة",
    applyUrl: "رابط التقديم",
  },
};

function getLanguage(application) {
  return application?.preferredLanguage === "ar" ? "ar" : "he";
}

function getChangedFields(oldJob, updatedJob, language) {
  const labels = FIELD_LABELS[language] || FIELD_LABELS.he;

  const fields = [
    "title",
    "organization",
    "city",
    "jobType",
    "employmentPercent",
    "distanceMinutes",
    "suitableForStudents",
    "description",
    "applyUrl",
  ];

  return fields
    .filter((key) => {
      const oldValue = oldJob?.[key];
      const newValue = updatedJob?.[key];

      return String(oldValue ?? "") !== String(newValue ?? "");
    })
    .map((key) => labels[key]);
}

function buildDeletedEmail(application, job) {
  const language = getLanguage(application);

  if (language === "ar") {
    return {
      subject: `تحديث بخصوص وظيفة قدّمتِ/قدّمتَ لها: ${job.title}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8;">
          <h2>تحديث بخصوص طلب التقديم</h2>

          <p>مرحبًا ${escapeHtml(application.fullName)},</p>

          <p>
            نود إعلامك بأن الوظيفة
            <strong>${escapeHtml(job.title)}</strong>
            ${
              job.organization
                ? `في مؤسسة <strong>${escapeHtml(job.organization)}</strong>`
                : ""
            }
            تم حذفها من النظام.
          </p>

          <p>
            سيبقى طلب التقديم محفوظًا في النظام، لكن الوظيفة نفسها لم تعد فعّالة.
          </p>

          <p>مع التحية،<br/>نظام الوظائف</p>
        </div>
      `,
    };
  }

  return {
    subject: `עדכון לגבי משרה שהגשת אליה: ${job.title}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8;">
        <h2>עדכון לגבי מועמדות שהגשת</h2>

        <p>שלום ${escapeHtml(application.fullName)},</p>

        <p>
          רצינו לעדכן אותך שהמשרה
          <strong>${escapeHtml(job.title)}</strong>
          ${
            job.organization
              ? `בארגון <strong>${escapeHtml(job.organization)}</strong>`
              : ""
          }
          נמחקה מהמערכת.
        </p>

        <p>
          המועמדות שלך נשמרה במערכת, אבל המשרה עצמה כבר לא פעילה.
        </p>

        <p>בברכה,<br/>מערכת המשרות</p>
      </div>
    `,
  };
}

function buildUpdatedEmail(application, oldJob, updatedJob) {
  const language = getLanguage(application);
  const changedFields = getChangedFields(oldJob, updatedJob, language);

  if (language === "ar") {
    const changedList =
      changedFields.length > 0
        ? `
          <p>الحقول التي تم تحديثها:</p>
          <ul>
            ${changedFields
              .map((field) => `<li>${escapeHtml(field)}</li>`)
              .join("")}
          </ul>
        `
        : `<p>تم تحديث تفاصيل الوظيفة.</p>`;

    return {
      subject: `تم تحديث وظيفة قدّمتِ/قدّمتَ لها: ${updatedJob.title}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8;">
          <h2>تحديث بخصوص وظيفة قدّمتِ/قدّمتَ لها</h2>

          <p>مرحبًا ${escapeHtml(application.fullName)},</p>

          <p>
            الوظيفة
            <strong>${escapeHtml(updatedJob.title)}</strong>
            ${
              updatedJob.organization
                ? `في مؤسسة <strong>${escapeHtml(updatedJob.organization)}</strong>`
                : ""
            }
            تم تحديثها في النظام.
          </p>

          ${changedList}

          <p>
            ننصحك بالدخول إلى حسابك الشخصي ومراجعة تفاصيل الوظيفة المحدّثة.
          </p>

          <p>مع التحية،<br/>نظام الوظائف</p>
        </div>
      `,
    };
  }

  const changedList =
    changedFields.length > 0
      ? `
        <p>השדות שעודכנו:</p>
        <ul>
          ${changedFields
            .map((field) => `<li>${escapeHtml(field)}</li>`)
            .join("")}
        </ul>
      `
      : `<p>בוצע עדכון בפרטי המשרה.</p>`;

  return {
    subject: `עודכנה משרה שהגשת אליה: ${updatedJob.title}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8;">
        <h2>עדכון לגבי משרה שהגשת אליה</h2>

        <p>שלום ${escapeHtml(application.fullName)},</p>

        <p>
          המשרה
          <strong>${escapeHtml(updatedJob.title)}</strong>
          ${
            updatedJob.organization
              ? `בארגון <strong>${escapeHtml(updatedJob.organization)}</strong>`
              : ""
          }
          עודכנה במערכת.
        </p>

        ${changedList}

        <p>
          מומלץ להיכנס לאזור האישי ולבדוק את פרטי המשרה המעודכנים.
        </p>

        <p>בברכה,<br/>מערכת המשרות</p>
      </div>
    `,
  };
}

async function notifyApplicantsJobDeleted(applications, job) {
  await Promise.allSettled(
    applications.map((application) => {
      const emailContent = buildDeletedEmail(application, job);

      return sendEmail(
        application.email,
        emailContent.subject,
        emailContent.html
      );
    })
  );
}

async function notifyApplicantsJobUpdated(applications, oldJob, updatedJob) {
  await Promise.allSettled(
    applications.map((application) => {
      const emailContent = buildUpdatedEmail(application, oldJob, updatedJob);

      return sendEmail(
        application.email,
        emailContent.subject,
        emailContent.html
      );
    })
  );
}

async function sendPasswordResetEmail(to, resetUrl, language = "he") {
  const isAr = language === "ar";

  const subject = isAr
    ? "إعادة تعيين كلمة المرور"
    : "איפוס סיסמה";

  const html = isAr
    ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; max-width: 520px; margin: auto;">
        <h2 style="color: #4f46e5;">إعادة تعيين كلمة المرور</h2>
        <p>استلمنا طلبًا لإعادة تعيين كلمة المرور الخاصة بك.</p>
        <p>انقر/ي على الزر أدناه لإعادة تعيين كلمة المرور. الرابط صالح لمدة ساعة واحدة فقط.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${escapeHtml(resetUrl)}"
             style="background: #4f46e5; color: white; padding: 14px 32px; border-radius: 12px;
                    text-decoration: none; font-weight: bold; font-size: 15px;">
            إعادة تعيين كلمة المرور
          </a>
        </div>
        <p style="color: #888; font-size: 13px;">إذا لم تطلب/ي إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.</p>
        <p>مع التحية،<br/>فريق النظام</p>
      </div>
    `
    : `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; max-width: 520px; margin: auto;">
        <h2 style="color: #4f46e5;">איפוס סיסמה</h2>
        <p>קיבלנו בקשה לאיפוס הסיסמה שלך.</p>
        <p>לחץ/י על הכפתור למטה לאיפוס הסיסמה. הקישור תקף לשעה אחת בלבד.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${escapeHtml(resetUrl)}"
             style="background: #4f46e5; color: white; padding: 14px 32px; border-radius: 12px;
                    text-decoration: none; font-weight: bold; font-size: 15px;">
            איפוס סיסמה
          </a>
        </div>
        <p style="color: #888; font-size: 13px;">אם לא ביקשת לאפס סיסמה, אפשר להתעלם מאימייל זה.</p>
        <p>בברכה,<br/>צוות המערכת</p>
      </div>
    `;

  await sendEmail(to, subject, html);
}

module.exports = {
  notifyApplicantsJobDeleted,
  notifyApplicantsJobUpdated,
  sendPasswordResetEmail,
};