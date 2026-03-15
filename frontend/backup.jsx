// ==================== COMPONENTS ====================

// Navbar Component
function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo">
          Muhama.<span className="highlight">D</span>.Tamam
        </div>
        <ul className="nav-menu" id="navMenu">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#project">Project</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="menu-toggle" id="menuToggle">
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </nav>
  );
}

// Hero Component
function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <p className="hero-greeting">Hallo, saya 👋</p>
          <h1 className="hero-title">
            Muhama.<span className="hero-subject">D</span>.Tamam
          </h1>
          <p className="hero-subtitle">
            Full Stack <span className="highlight">With</span> Kink JSHT
          </p>
          <p className="hero-description">
            software engineer? yes, I am InshaAllah
          </p>
          <div className="hero-buttons">
            <a href="#project" className="btn btn-primary">View Project</a>
            <a href="#contact" className="btn btn-secondary">Contact</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="asset/image.png" alt="MyProfile" className="profile-img" />
        </div>
      </div>
    </section>
  );
}

// About Component
function About() {
  return (
    <section id="about" className="about full-screen-section">
      <div className="container">
        <h2 className="section-title">
          Tentang <span className="highlight">Saya</span>
        </h2>
        <div className="about-content">
          <p>Salam kenal, saya The next king in the world akan ku ubah dunia dengan king JSHT 😹</p>
          <p>Ini website saya loh ya, mencoba ngoding for to be a software engineer</p>
          <div className="quote-box">
            <p className="quote-text">hanya ada satu raja di dunia, dan itu adalah aku</p>
            <p className="quote-text2">- <strong>Kink Tamam</strong> -</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Skills Component
function Skills() {
  const skills = [
    { icon: 'fab fa-html5', color: '#ff5722', name: 'HTML', percent: 70, desc: 'struktur halaman web' },
    { icon: 'fab fa-css3-alt', color: '#2196f3', name: 'CSS', percent: 50, desc: 'styling & layout' },
    { icon: 'fab fa-js', color: '#ffc107', name: 'JAVASCRIPT', percent: 30, desc: 'interaktivitas' },
    { icon: 'fab fa-react', color: '#61dafb', name: 'REACT', percent: 10, desc: 'next target loh ya 😹' }
  ];

  return (
    <section id="skills" className="skills full-screen-section">
      <div className="container">
        <h2 className="section-title">
          My <span className="highlight">Skill</span>
        </h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <i className={skill.icon} style={{color: skill.color}}></i>
              <h3>{skill.name}</h3>
              <div className="progress-bar">
                <div className="progress" style={{width: skill.percent + '%'}}>
                  {skill.percent}%
                </div>
              </div>
              <p>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Projects Component
function Projects() {
  const projects = [
    {
      img: 'asset/portofolio.png',
      title: 'Website Portofolio',
      desc: 'My first website pertama loh ya 😹, website ini dibuat dengan menggunakan HTML, CSS, JAVASCRIPT',
      tags: ['HTML', 'CSS', 'JAVASCRIPT'],
      link: 'https://tamam-portofolio.vercel.app/',
      linkText: 'View Project'
    },
    {
      img: 'asset/ui.png',
      title: 'Aplikasi To-Do List',
      desc: 'Aplikasi yang ga tau apa gunanya, pake javascript 👍',
      tags: ['HTML', 'CSS', 'JAVASCRIPT'],
      link: '#',
      linkText: 'Dalam Proses Pengerjaan',
      disabled: true
    }
  ];

  return (
    <section id="project" className="projects full-screen-section">
      <div className="container">
        <h2 className="section-title">
          My <span className="highlight">Project</span>
        </h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <img src={project.img} alt={project.title} className="project-img" />
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>
                <a 
                  href={project.link} 
                  className={`project-link ${project.disabled ? 'disabled' : ''}`}
                >
                  {project.linkText} <i className={`fas fa-${project.disabled ? 'clock' : 'arrow-right'}`}></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ContactWidget Component
function ContactWidgetReact() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = React.useState(false);
  const [feedback, setFeedback] = React.useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSending(true);
  setFeedback('');

  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      setFeedback('✅ Pesan berhasil dikirim!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setFeedback(`❌ ${result.message}`);
    }
  } catch (error) {
    setFeedback('❌ Gagal mengirim. Cek koneksi backend.');
    console.error('Error:', error);
  } finally {
    setIsSending(false);
  }
};

  return (
    <div className="react-contact">
      <h3>
        <i className="fas fa-code"></i>
        Kirim Pesan via React
      </h3>
      
      <form onSubmit={handleSubmit} className="react-form">
        <input
          type="text"
          name="name"
          placeholder="Nama Kamu"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email Kamu"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <textarea
          name="message"
          placeholder="Pesan Kamu"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          required
        />
        
        <button type="submit" disabled={isSending}>
          {isSending ? '⚡ Mengirim...' : '📨 Kirim Pesan'}
        </button>
        
        {feedback && <p className="feedback">{feedback}</p>}
      </form>
    </div>
  );
}

// Contact Component
function Contact() {
  return (
    <section id="contact" className="contact full-screen-section">
      <div className="container">
        <h2 className="section-title">
          Contact <span className="highlight">Me</span>
        </h2>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p>muhamadtamam1@yahoo.com</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <p>+62 831-7001-1433</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>Indonesia, Bengkulu</p>
            </div>
            <div className="social-links">
              <a href="https://github.com/mam48" className="social-link"><i className="fab fa-github"></i></a>
              <a href="https://instagram.com" className="social-link"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" className="social-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://twitter.com" className="social-link"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          <ContactWidgetReact />
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2025 Muhamad Tamam || All Rights Reserved</p>
      </div>
    </footer>
  );
}

// ==================== APP ====================
function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

// ==================== RENDER ====================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);