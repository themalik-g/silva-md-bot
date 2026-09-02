<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=MALIK%20MD%20BOT&fontSize=70&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Next-Gen%20WhatsApp%20Automation&descAlignY=60&descSize=20" width="100%"/>

<br>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=800&size=22&duration=2500&pause=800&color=FF00A6&center=true&vCenter=true&width=700&lines=1200%2B+Commands+%F0%9F%9A%80;AI+Agent+Built+In+%F0%9F%A4%96;Anti-Ban+Protection+%F0%9F%9B%A1%EF%B8%8F;Smart+Automation+Features+%E2%9C%A8;Multi-Device+WhatsApp+Bot+%F0%9F%93%B1)](https://git.io/typing-svg)

<br>

<p>
<a href="https://github.com/themalik-g/malik-md/stargazers"><img src="https://img.shields.io/github/stars/themalik-g/malik-md?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=FF00A6" /></a>
<a href="https://github.com/themalik-g/malik-md/network/members"><img src="https://img.shields.io/github/forks/themalik-g/malik-md?style=for-the-badge&logo=git&logoColor=white&labelColor=0d1117&color=6f42c1" /></a>
<a href="https://github.com/themalik-g/malik-md/commits"><img src="https://img.shields.io/github/last-commit/themalik-g/malik-md?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=00d4aa" /></a>
<a href="LICENSE"><img src="https://img.shields.io/github/license/themalik-g/malik-md?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=0d1117&color=3b82f6" /></a>
</p>

<br>

> **A powerful multi-device WhatsApp bot — 1200+ commands, AI agent, smart features, anti-ban protection.**

</div>

---

## 📋 Contents

| | |
|---|---|
| [🚀 Deploy](#-step-2--deploy) | [✨ Features](#-features) |
| [🎨 Themes](#-themes) | [🤝 Connect](#-connect-with-malik) |

---

## 🚀 Step 2 — Deploy

<div align="center">

### Choose your host and click to deploy instantly

<br>

| Platform | Badge | Notes |
|:--------:|:-----:|:------|
| <img src="https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=heroku&logoColor=white" /> | [![Deploy on Heroku](https://img.shields.io/badge/Deploy%20Now-Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)](https://dashboard.heroku.com/new?template=https://github.com/themalik-g/malik-md) | 24/7 uptime · Auto-restart |
| <img src="https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white" /> | [![Deploy on Railway](https://img.shields.io/badge/Deploy%20Now-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/new) | $5 free credits/month |
| <img src="https://img.shields.io/badge/Koyeb-121212?style=flat-square&logo=koyeb&logoColor=white" /> | [![Deploy on Koyeb](https://img.shields.io/badge/Deploy%20Now-Koyeb-121212?style=for-the-badge&logo=koyeb&logoColor=white)](https://app.koyeb.com) | Free tier · No cold-starts |
| <img src="https://img.shields.io/badge/Replit-F26207?style=flat-square&logo=replit&logoColor=white" /> | [![Deploy on Replit](https://img.shields.io/badge/Deploy%20Now-Replit-F26207?style=for-the-badge&logo=replit&logoColor=white)](https://replit.com) | Browser IDE · Edit live |

</div>

<br>

<details>
<summary><img src="https://img.shields.io/badge/💻%20LOCAL%20/%20VPS-Full%20Control%20·%20Developer%20Mode-2ea44f?style=for-the-badge&logo=gnubash&logoColor=white" /></summary>

<br>

**Requirements:** Node.js 20+ · Git

```bash
# Clone & Install
git clone https://github.com/themalik-g/malik-md.git
cd malik-md
npm install

# Configure
cp config.env.example config.env
# → Fill in SESSION_ID, OWNER_NUMBER, etc.

# Start
node silva.js
```

**Keep running 24/7 with PM2:**
```bash
npm install -g pm2
pm2 start silva.js --name malik-md
pm2 save && pm2 startup
```

</details>

---

## ⚙️ Environment Variables

> Set these as secrets on your host, or in a local `config.env` file.

### 🔑 Essential

| Variable | Default | Description |
|----------|:-------:|-------------|
| `SESSION_ID` | **required** | Your WhatsApp session |
| `OWNER_NUMBER` | auto | Your WhatsApp number with country code |
| `BOT_NAME` | `MALIK MD` | Bot display name |
| `PREFIX` | `.` | Command prefix (`.` `,` `!` `/` or comma-separated) |
| `MODE` | `public` | `public` · `private` · `group` · `inbox` |
| `THEME` | `malik` | Bot personality — see [Themes](#-themes) |

### 📸 Auto-Status

| Variable | Default | Description |
|----------|:-------:|-------------|
| `AUTO_STATUS_SEEN` | `true` | Auto-view contacts' statuses |
| `AUTO_STATUS_REACT` | `true` | Auto-react to statuses |
| `AUTO_STATUS_REPLY` | `false` | Auto-reply to statuses |

### 🛡️ Protection

| Variable | Default | Description |
|----------|:-------:|-------------|
| `ANTICALL` | `true` | Auto-reject all incoming calls |
| `ANTIDELETE_GROUP` | `true` | Recover deleted group messages → forward to owner |
| `ANTIDELETE_PRIVATE` | `true` | Recover deleted private messages → forward to owner |
| `ANTILINK` | `false` | Block links from non-admins in groups |
| `ANTIVV` | `true` | Auto-reveal view-once media → forward to owner |

---

## ✨ Features

<div align="center">

![Protection](https://img.shields.io/badge/🛡️%20Protection%20Suite-Always%20On-FF00A6?style=for-the-badge)
![Media](https://img.shields.io/badge/🎵%20Media%20&%20Downloads-Available-6f42c1?style=for-the-badge)
![AI](https://img.shields.io/badge/🤖%20AI%20&%20Smart%20Tools-Active-00d4aa?style=for-the-badge)
![Groups](https://img.shields.io/badge/👥%20Group%20Management-Included-3b82f6?style=for-the-badge)

</div>

---

## 🤝 Connect With MALIK

<div align="center">

<br>

[![Support Group](https://img.shields.io/badge/Support%20Group-Join%20Now-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/FfJZtyvL1PM46pLmInoHcZ)
[![GitHub](https://img.shields.io/badge/GitHub-themalik--g-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/themalik-g)

<br>

</div>

---

## 👨‍💻 Built By

<div align="center">

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/themalik-g">
        <img src="https://github.com/themalik-g.png?size=100" width="90" style="border-radius:50%"/><br>
        <b>MALIK MEHTAB</b><br>
        <sub>Creator & Developer</sub>
      </a>
    </td>
  </tr>
</table>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&text=MALIK%20MD&fontSize=28&fontColor=fff&animation=twinkling" width="100%"/>

**Built by [MALIK MEHTAB](https://github.com/themalik-g)**

`MALIK MD Bot — Unlimited possibilities.`

</div>
