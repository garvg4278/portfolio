# 📌 Garv Gupta — Portfolio Website

A fully responsive and modern portfolio built using **HTML**, **CSS**, and **vanilla JavaScript**, showcasing my background in **Cybersecurity**, **DevOps**, and **Data Analysis**.

This site highlights my projects, academic journey, skills, and certifications — built with performance, clarity, and recruiter-friendly UX in mind.

---

## 🚀 Highlights of the Website

- ⚡ Fast, lightweight, and framework-free
- 🌑 Modern dark UI design
- 🎯 Recruiter-friendly layout and structure
- ✨ Smooth animations and responsive UI
- 🧭 Mobile-first navigation system
- 🧪 Certification modal pop-ups
- 🗺 Embedded Google Map showing current university location
- 🔒 Semantic HTML + accessibility enhancements

---

## 📁 File Structure

```

portfolio/
│
├── index.html
├── about.html
├── education.html
├── projects.html
├── skills.html
├── contact.html
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js
│
├── assets/
│
└── README.md

````

---

## 🧪 Run Locally

🔹 **Directly Open:**

Just open `index.html` in any browser.

🔹 **Recommended (Local Server):**

Python:
```bash
python -m http.server 8000
````

Node.js (`http-server`):

```bash
npm install -g http-server
http-server
```

---

## 🌍 Deployment (GitHub Pages)

1. Push to GitHub:

```bash
git add .
git commit -m "Deploy portfolio"
git push origin main
```

2. Go to **Settings → Pages**
3. Select:
   **Deploy from branch → main → /root**
4. Wait for it to build

Your site will be live at:

```
https://username.github.io/portfolio/
```

---

## 🔧 Updating Content

| Area           | File to Edit                       |
| -------------- | ---------------------------------- |
| Projects       | `projects.html`                    |
| Skills         | `skills.html`                      |
| Certifications | `js/main.js` (`certificationInfo`) |
| Map / Contact  | `contact.html`                     |
| Styling        | `css/style.css`                    |
| Animations     | `js/main.js`                       |

---

## 📌 Future Improvements

* 🔁 Dark/Light mode toggle
* 📬 Backend message handling (EmailJS / Formspree)
* 📝 Add project write-ups / blog section

---

## 🐳 Docker Image

You can run the containerized version of this portfolio using Docker:

```bash
docker pull ghcr.io/garvg4278/garv-portfolio:latest
docker run -p 8080:80 ghcr.io/garvg4278/garv-portfolio:latest
```

Then open:
➡ `http://localhost:8080`

---

## 🔗 Live Link

➡ *(Add after Netlify deployment)*

---

Built with curiosity, clarity, and continuous improvement ✨
