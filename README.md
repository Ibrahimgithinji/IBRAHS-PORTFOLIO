# Ibrahim Githinji - Software Developer Portfolio

A modern, responsive portfolio website built with React, JavaScript, and CSS. Showcasing projects, skills, and experience with smooth animations and GitHub API integration.

## 🚀 Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **GitHub API Integration**: Automatically loads repositories from GitHub
- **Smooth Animations**: CSS keyframes and scroll-triggered animations
- **Modern UI**: Clean, professional design with smooth transitions
- **Interactive Components**: Contact form, social links, and navigation
- **Performance Optimized**: Fast loading and efficient code structure

## 🛠️ Tech Stack

- **Frontend**: React 18 with JavaScript
- **Styling**: Pure CSS (no external CSS frameworks)
- **Build Tool**: Vite
- **API**: GitHub REST API for repositories
- **Deployment**: Ready for static hosting

## 📱 Sections

1. **Navigation Bar**: Sticky navigation with smooth scrolling
2. **Hero Section**: Introduction with animated elements
3. **About Section**: Skills, experience, and background
4. **Projects Section**: 
   - Featured projects showcase
   - GitHub repositories (auto-loaded via API)
5. **Contact Section**: Contact form with validation
6. **Footer**: Social links and copyright

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ibrahim-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
ibrahim-portfolio/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx & Navbar.css
│   │   ├── Hero.jsx & Hero.css
│   │   ├── About.jsx & About.css
│   │   ├── Projects.jsx & Projects.css
│   │   ├── ProjectCard.jsx & ProjectCard.css
│   │   ├── FeaturedProjects.jsx & FeaturedProjects.css
│   │   ├── Contact.jsx & Contact.css
│   │   └── Footer.jsx & Footer.css
│   ├── App.jsx & App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

## 🎨 Customization

### Colors and Styling
The color scheme and styling can be customized in `src/index.css`:
```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  /* ... more variables */
}
```

### GitHub Integration
The GitHub username is configured in `src/components/Projects.jsx`. Update the fetch URL to use your GitHub username:
```javascript
const response = await fetch('https://api.github.com/users/YOUR_USERNAME/repos')
```

### Content Updates
- Update personal information in `Hero.jsx`
- Modify skills and experience in `About.jsx`
- Add featured projects in `Projects.jsx`
- Update contact information in `Contact.jsx`

## 📱 Responsive Breakpoints

- **Mobile**: ≤ 480px
- **Tablet**: 481px - 1024px
- **Desktop**: ≥ 1025px

## 🌐 Deployment

This portfolio can be deployed to various static hosting platforms:

### Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deployment scripts to package.json
3. Run: `npm run deploy`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter (if configured)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check issues page.

## 📞 Contact

- **GitHub**: [Ibrahimgithinji](https://github.com/Ibrahimgithinji)
- **LinkedIn**: [Ibrahim Githinji](https://www.linkedin.com/in/ibrahim-githinji-6933652a6/)
- **Email**: ibrahim.githinji@email.com

---

Built with ❤️ using React and modern web technologies.