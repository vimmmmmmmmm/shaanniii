import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FileCode, Layout, Palette, Sparkles, Code } from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  category: "frontend" | "component" | "animation" | "layout" | "interactive";
  html: string;
  css: string;
  js: string;
  thumbnail?: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (html: string, css: string, js: string) => void;
}

const templates: Template[] = [
  {
    id: "responsive-landing",
    title: "Responsive Landing Page",
    description:
      "A modern responsive landing page with hero section and features",
    category: "frontend",
    thumbnail:
      "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    html: `<header class="header">
  <div class="container">
    <div class="logo">CodePen<span>Pro</span></div>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
    <button class="mobile-menu-btn">☰</button>
  </div>
</header>

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <h1>Create Amazing Web Experiences</h1>
      <p>Build, test, and showcase your HTML, CSS, and JavaScript creations with our powerful online editor.</p>
      <div class="cta-buttons">
        <button class="btn primary">Get Started</button>
        <button class="btn secondary">Learn More</button>
      </div>
    </div>
    <div class="hero-image">
      <div class="code-block">
        <pre><code>&lt;div class="awesome"&gt;
  &lt;h1&gt;Code Better&lt;/h1&gt;
  &lt;p&gt;With CodePen Pro&lt;/p&gt;
&lt;/div&gt;</code></pre>
      </div>
    </div>
  </div>
</section>

<section class="features">
  <div class="container">
    <h2>Powerful Features</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <div class="icon">📝</div>
        <h3>Live Editing</h3>
        <p>See your changes in real-time as you code.</p>
      </div>
      <div class="feature-card">
        <div class="icon">🔄</div>
        <h3>Auto-Save</h3>
        <p>Never lose your work with automatic saving.</p>
      </div>
      <div class="feature-card">
        <div class="icon">📱</div>
        <h3>Responsive Testing</h3>
        <p>Test your designs across multiple screen sizes.</p>
      </div>
      <div class="feature-card">
        <div class="icon">🌐</div>
        <h3>Share Instantly</h3>
        <p>Share your creations with a simple link.</p>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <p>&copy; 2023 CodePen Clone. All rights reserved.</p>
  </div>
</footer>`,
    css: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Styles */
.header {
  background-color: #1e1e2e;
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.logo span {
  color: #3b82f6;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 30px;
}

nav a {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover {
  color: #3b82f6;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #1e1e2e 0%, #2d2b42 100%);
  color: white;
  padding: 80px 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
  background: linear-gradient(90deg, #ffffff, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-content p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #e2e8f0;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn.primary {
  background-color: #3b82f6;
  color: white;
}

.btn.primary:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.btn.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid #3b82f6;
}

.btn.secondary:hover {
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-block {
  background-color: #282a36;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.code-block::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: #1e1e2e;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.code-block::after {
  content: "• • •";
  position: absolute;
  top: 8px;
  left: 15px;
  color: #6c7983;
  letter-spacing: 10px;
}

.code-block pre {
  margin-top: 15px;
  font-family: "Fira Code", monospace;
  color: #f8f8f2;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
}

/* Features Section */
.features {
  padding: 100px 0;
  background-color: #f8fafc;
}

.features h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 60px;
  color: #1e1e2e;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.feature-card .icon {
  font-size: 36px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #1e1e2e;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}

/* Footer */
.footer {
  background-color: #1e1e2e;
  color: #e2e8f0;
  padding: 30px 0;
  text-align: center;
}

/* Responsive Styles */
@media (max-width: 768px) {
  nav ul {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 36px;
  }
  
  .cta-buttons {
    justify-content: center;
  }
  
  .hero-image {
    margin-top: 40px;
    order: 2;
  }
  
  .features h2 {
    font-size: 28px;
  }
}`,
    js: `// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav ul');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
}

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    
    // Close mobile menu if open
    if (window.innerWidth <= 768) {
      nav.style.display = 'none';
    }
  });
});

// Add animation to feature cards on scroll
const featureCards = document.querySelectorAll('.feature-card');

function checkScroll() {
  featureCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    const triggerBottom = window.innerHeight * 0.8;
    
    if (cardTop < triggerBottom) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }
  });
}

// Initialize feature cards
featureCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Check on load and scroll
window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);

// Add typing animation to code block
const codeBlock = document.querySelector('.code-block code');
const originalText = codeBlock.textContent;
codeBlock.textContent = '';

let i = 0;
const typeWriter = () => {
  if (i < originalText.length) {
    codeBlock.textContent += originalText.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
};

setTimeout(typeWriter, 1000);`,
  },
  {
    id: "animated-card",
    title: "Animated Card Component",
    description: "Interactive card with hover effects and animations",
    category: "component",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    html: `<div class="card-container">
  <div class="card">
    <div class="card-content">
      <div class="card-image">
        <img src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Mountain landscape">
      </div>
      <div class="card-info">
        <div class="card-title">Interactive Card</div>
        <div class="card-subtitle">Hover to see effects</div>
        <p class="card-description">This card demonstrates various CSS animations and transitions. Hover over it to see the magic happen!</p>
        <div class="card-footer">
          <button class="card-button primary">Learn More</button>
          <button class="card-button secondary">Dismiss</button>
        </div>
      </div>
    </div>
    <div class="card-shine"></div>
    <div class="card-shadow"></div>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 2rem;
}

.card-container {
  perspective: 1000px;
  width: 350px;
  height: 500px;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(23, 23, 43, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s;
  transform-style: preserve-3d;
}

.card:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.card-image {
  height: 50%;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s;
}

.card:hover .card-image img {
  transform: scale(1.1);
}

.card-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: linear-gradient(to bottom, rgba(23, 23, 43, 0) 0%, rgba(23, 23, 43, 1) 20%);
  transform: translateY(10px);
  opacity: 0.8;
  transition: transform 0.5s, opacity 0.5s;
}

.card:hover .card-info {
  transform: translateY(0);
  opacity: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #fff, #a5b4fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: translateY(10px);
  opacity: 0;
  transition: transform 0.5s 0.1s, opacity 0.5s 0.1s;
}

.card:hover .card-title {
  transform: translateY(0);
  opacity: 1;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #a5b4fc;
  margin-bottom: 1rem;
  transform: translateY(10px);
  opacity: 0;
  transition: transform 0.5s 0.2s, opacity 0.5s 0.2s;
}

.card:hover .card-subtitle {
  transform: translateY(0);
  opacity: 1;
}

.card-description {
  font-size: 0.875rem;
  color: #cbd5e1;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  transform: translateY(10px);
  opacity: 0;
  transition: transform 0.5s 0.3s, opacity 0.5s 0.3s;
}

.card:hover .card-description {
  transform: translateY(0);
  opacity: 1;
}

.card-footer {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
  transform: translateY(10px);
  opacity: 0;
  transition: transform 0.5s 0.4s, opacity 0.5s 0.4s;
}

.card:hover .card-footer {
  transform: translateY(0);
  opacity: 1;
}

.card-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.card-button.primary {
  background-color: #4f46e5;
  color: white;
}

.card-button.primary:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
}

.card-button.secondary {
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.card-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.card:hover .card-shine {
  opacity: 1;
}

.card-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transform: translateY(50%);
  filter: blur(30px);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
  z-index: -1;
  transition: opacity 0.5s, transform 0.5s;
}

.card:hover .card-shadow {
  opacity: 1;
  transform: translateY(10%);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .card-container {
    width: 100%;
    max-width: 350px;
    height: 450px;
  }
  
  .card-info {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
  
  .card-description {
    font-size: 0.75rem;
    margin-bottom: 1rem;
  }
}`,
    js: `// Track mouse movement for 3D effect
const card = document.querySelector('.card');
const cardContainer = document.querySelector('.card-container');
const shine = document.querySelector('.card-shine');

if (cardContainer && card && shine) {
  cardContainer.addEventListener('mousemove', (e) => {
    const rect = cardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = (x - centerX) / 10;
    const rotateX = (centerY - y) / 10;
    
    // Apply rotation
    card.style.transform = 'rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg) translateY(-10px)';
    
    // Move shine effect
    shine.style.background = 'radial-gradient(' +
      'circle at ' + x + 'px ' + y + 'px,' +
      'rgba(255, 255, 255, 0.2) 0%,' +
      'rgba(255, 255, 255, 0) 60%' +
    ')';
  });
  
  // Reset card position when mouse leaves
  cardContainer.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
    shine.style.background = 'none';
  });
}

// Add click effects to buttons
const buttons = document.querySelectorAll('.card-button');

buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    
    // Position the ripple
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    // Show alert based on button type
    if (this.classList.contains('primary')) {
      alert('You clicked Learn More!');
    } else {
      alert('Card dismissed!');
    }
  });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = '\
  .card-button {\
    position: relative;\
    overflow: hidden;\
  }\
  \
  .ripple {\
    position: absolute;\
    border-radius: 50%;\
    background-color: rgba(255, 255, 255, 0.4);\
    width: 100px;\
    height: 100px;\
    margin-top: -50px;\
    margin-left: -50px;\
    animation: ripple 0.6s linear;\
    transform: scale(0);\
    pointer-events: none;\
  }\
  \
  @keyframes ripple {\
    to {\
      transform: scale(2.5);\
      opacity: 0;\
    }\
  }\
';

document.head.appendChild(style);`,
  },
  {
    id: "interactive-form",
    title: "Interactive Form",
    description: "Modern form with validation and animations",
    category: "interactive",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    html: `<div class="form-container">
  <div class="form-header">
    <h2>Create an Account</h2>
    <p>Fill in the form below to get started</p>
  </div>
  
  <form id="signup-form">
    <div class="form-step active" data-step="1">
      <div class="form-group">
        <label for="fullname">Full Name</label>
        <input type="text" id="fullname" name="fullname" placeholder="John Doe" required>
        <div class="error-message"></div>
      </div>
      
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="john@example.com" required>
        <div class="error-message"></div>
      </div>
      
      <div class="form-buttons">
        <button type="button" class="btn next-btn">Continue</button>
      </div>
    </div>
    
    <div class="form-step" data-step="2">
      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-container">
          <input type="password" id="password" name="password" placeholder="Create a strong password" required>
          <button type="button" class="toggle-password">👁️</button>
        </div>
        <div class="password-strength">
          <div class="strength-bar"></div>
          <div class="strength-text">Password strength</div>
        </div>
        <div class="error-message"></div>
      </div>
      
      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required>
        <div class="error-message"></div>
      </div>
      
      <div class="form-buttons">
        <button type="button" class="btn back-btn">Back</button>
        <button type="button" class="btn next-btn">Continue</button>
      </div>
    </div>
    
    <div class="form-step" data-step="3">
      <div class="form-group">
        <label>Profile Picture</label>
        <div class="avatar-upload">
          <div class="avatar-preview">
            <div id="avatar-image"></div>
          </div>
          <label for="avatar-input" class="avatar-edit">Choose Image</label>
          <input type="file" id="avatar-input" accept="image/*" hidden>
        </div>
      </div>
      
      <div class="form-group">
        <label for="bio">Short Bio</label>
        <textarea id="bio" name="bio" placeholder="Tell us a bit about yourself" rows="3"></textarea>
        <div class="character-count">0/200</div>
      </div>
      
      <div class="form-group checkbox-group">
        <input type="checkbox" id="terms" name="terms" required>
        <label for="terms">I agree to the <a href="#">Terms and Conditions</a></label>
        <div class="error-message"></div>
      </div>
      
      <div class="form-buttons">
        <button type="button" class="btn back-btn">Back</button>
        <button type="submit" class="btn submit-btn">Create Account</button>
      </div>
    </div>
  </form>
  
  <div class="form-progress">
    <div class="progress-step active" data-step="1">1</div>
    <div class="progress-bar"></div>
    <div class="progress-step" data-step="2">2</div>
    <div class="progress-bar"></div>
    <div class="progress-step" data-step="3">3</div>
  </div>
  
  <div class="success-message">
    <div class="success-icon">✓</div>
    <h3>Account Created Successfully!</h3>
    <p>Thank you for signing up. You can now log in to your account.</p>
    <button type="button" class="btn reset-btn">Start Over</button>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #333;
}

.form-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
}

.form-step {
  display: none;
}

.form-step.active {
  display: block;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

input[type="text"],
input[type="email"],
input[type="password"],
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.toggle-password:hover {
  opacity: 0.8;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  margin-bottom: 0.25rem;
  position: relative;
  overflow: hidden;
}

.strength-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: #f87171;
  transition: width 0.3s, background-color 0.3s;
}

.strength-bar.weak::before {
  width: 33.33%;
  background-color: #f87171;
}

.strength-bar.medium::before {
  width: 66.66%;
  background-color: #facc15;
}

.strength-bar.strong::before {
  width: 100%;
  background-color: #4ade80;
}

.strength-text {
  font-size: 0.75rem;
  color: #666;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  min-height: 1rem;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 1rem;
}

.next-btn, .submit-btn {
  background-color: #4f46e5;
  color: white;
  margin-left: auto;
}

.next-btn:hover, .submit-btn:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.back-btn {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.back-btn:hover {
  background-color: #f9fafb;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 3px solid #eee;
}

#avatar-image {
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
  background-image: url('https://api.dicebear.com/7.x/avataaars/svg?seed=default');
  background-size: cover;
  background-position: center;
}

.avatar-edit {
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.avatar-edit:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
}

.character-count {
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}

.checkbox-group label {
  font-size: 0.875rem;
  margin-bottom: 0;
}

.checkbox-group a {
  color: #4f46e5;
  text-decoration: none;
}

.checkbox-group a:hover {
  text-decoration: underline;
}

.form-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.progress-step {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.progress-step.active {
  background-color: #4f46e5;
  color: white;
}

.progress-step.completed {
  background-color: #4ade80;
  color: white;
}

.progress-bar {
  height: 3px;
  width: 60px;
  background-color: #f3f4f6;
  margin: 0 0.5rem;
  position: relative;
}

.progress-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: #4f46e5;
  transition: width 0.3s;
}

.progress-bar.active::before {
  width: 100%;
}

.success-message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s, visibility 0.5s;
  text-align: center;
}

.success-message.show {
  opacity: 1;
  visibility: visible;
}

.success-icon {
  width: 60px;
  height: 60px;
  background-color: #4ade80;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.success-message h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.success-message p {
  color: #666;
  margin-bottom: 1.5rem;
}

.reset-btn {
  background-color: #4f46e5;
  color: white;
}

.reset-btn:hover {
  background-color: #4338ca;
}

@media (max-width: 576px) {
  .form-container {
    padding: 1.5rem;
    border-radius: 12px;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .form-buttons {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .next-btn, .submit-btn, .back-btn {
    width: 100%;
    margin-left: 0;
  }
  
  .progress-step {
    width: 25px;
    height: 25px;
    font-size: 0.75rem;
  }
  
  .progress-bar {
    width: 40px;
  }
}`,
    js: `document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signup-form');
  const steps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressBars = document.querySelectorAll('.progress-bar');
  const nextButtons = document.querySelectorAll('.next-btn');
  const backButtons = document.querySelectorAll('.back-btn');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const togglePasswordButton = document.querySelector('.toggle-password');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');
  const avatarInput = document.getElementById('avatar-input');
  const avatarPreview = document.getElementById('avatar-image');
  const bioTextarea = document.getElementById('bio');
  const characterCount = document.querySelector('.character-count');
  const successMessage = document.querySelector('.success-message');
  const resetButton = document.querySelector('.reset-btn');
  
  let currentStep = 1;
  
  // Initialize the form
  function init() {
    updateProgressBar();
    setupEventListeners();
  }
  
  // Update the progress bar and steps
  function updateProgressBar() {
    progressSteps.forEach((step, index) => {
      const stepNum = index + 1;
      
      if (stepNum < currentStep) {
        step.classList.add('completed');
        step.classList.add('active');
        if (progressBars[index]) {
          progressBars[index].classList.add('active');
        }
      } else if (stepNum === currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
        if (index > 0 && progressBars[index - 1]) {
          progressBars[index - 1].classList.add('active');
        }
      } else {
        step.classList.remove('active');
        step.classList.remove('completed');
        if (progressBars[index - 1]) {
          progressBars[index - 1].classList.remove('active');
        }
      }
    });
  }
  
  // Go to the next step
  function nextStep() {
    if (currentStep < steps.length && validateStep(currentStep)) {
      steps[currentStep - 1].classList.remove('active');
      currentStep++;
      steps[currentStep - 1].classList.add('active');
      updateProgressBar();
    }
  }
  
  // Go to the previous step
  function prevStep() {
    if (currentStep > 1) {
      steps[currentStep - 1].classList.remove('active');
      currentStep--;
      steps[currentStep - 1].classList.add('active');
      updateProgressBar();
    }
  }
  
  // Validate the current step
  function validateStep(step) {
    let isValid = true;
    
    if (step === 1) {
      const fullname = document.getElementById('fullname');
      const email = document.getElementById('email');
      const fullnameError = fullname.nextElementSibling;
      const emailError = email.nextElementSibling;
      
      // Reset errors
      fullnameError.textContent = '';
      emailError.textContent = '';
      
      // Validate fullname
      if (!fullname.value.trim()) {
        fullnameError.textContent = 'Full name is required';
        isValid = false;
      }
      
      // Validate email
      if (!email.value.trim()) {
        emailError.textContent = 'Email is required';
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }
    }
    
    if (step === 2) {
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirm-password');
      const passwordError = password.parentElement.nextElementSibling.nextElementSibling;
      const confirmPasswordError = confirmPassword.nextElementSibling;
      
      // Reset errors
      passwordError.textContent = '';
      confirmPasswordError.textContent = '';
      
      // Validate password
      if (!password.value) {
        passwordError.textContent = 'Password is required';
        isValid = false;
      } else if (password.value.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters long';
        isValid = false;
      }
      
      // Validate confirm password
      if (!confirmPassword.value) {
        confirmPasswordError.textContent = 'Please confirm your password';
        isValid = false;
      } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = 'Passwords do not match';
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  // Check if email is valid
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // Check password strength
  function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Update UI
    strengthBar.className = 'strength-bar';
    
    if (password.length === 0) {
      strengthText.textContent = 'Password strength';
    } else if (strength < 3) {
      strengthBar.classList.add('weak');
      strengthText.textContent = 'Weak password';
    } else if (strength < 5) {
      strengthBar.classList.add('medium');
      strengthText.textContent = 'Medium password';
    } else {
      strengthBar.classList.add('strong');
      strengthText.textContent = 'Strong password';
    }
  }
  
  // Toggle password visibility
  function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordButton.textContent = type === 'password' ? '👁️' : '🔒';
  }
  
  // Handle avatar upload
  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        avatarPreview.style.backgroundImage = 'url(' + e.target.result + ')';
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Update character count for bio
  function updateCharacterCount() {
    const count = bioTextarea.value.length;
    characterCount.textContent = count + '/200';
    
    if (count > 200) {
      characterCount.style.color = '#ef4444';
    } else {
      characterCount.style.color = '#666';
    }
  }
  
  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    
    if (validateStep(3)) {
      // In a real app, you would send the form data to a server here
      console.log('Form submitted successfully!');
      
      // Show success message
      successMessage.classList.add('show');
    }
  }
  
  // Reset the form
  function resetForm() {
    form.reset();
    currentStep = 1;
    
    // Reset UI elements
    steps.forEach(step => step.classList.remove('active'));
    steps[0].classList.add('active');
    
    progressSteps.forEach(step => {
      step.classList.remove('active');
      step.classList.remove('completed');
    });
    progressSteps[0].classList.add('active');
    
    progressBars.forEach(bar => bar.classList.remove('active'));
    
    strengthBar.className = 'strength-bar';
    strengthText.textContent = 'Password strength';
    
    avatarPreview.style.backgroundImage = "url('https://api.dicebear.com/7.x/avataaars/svg?seed=default')";
    
    characterCount.textContent = '0/200';
    
    // Hide success message
    successMessage.classList.remove('show');
    
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(error => {
      error.textContent = '';
    });
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Next buttons
    nextButtons.forEach(button => {
      button.addEventListener('click', nextStep);
    });
    
    // Back buttons
    backButtons.forEach(button => {
      button.addEventListener('click', prevStep);
    });
    
    // Password strength
    passwordInput.addEventListener('input', function() {
      checkPasswordStrength(this.value);
    });
    
    // Toggle password
    togglePasswordButton.addEventListener('click', togglePasswordVisibility);
    
    // Avatar upload
    avatarInput.addEventListener('change', handleAvatarUpload);
    
    // Bio character count
    bioTextarea.addEventListener('input', updateCharacterCount);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Reset button
    resetButton.addEventListener('click', resetForm);
  }
  
  // Initialize the form
  init();
});`,
  },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <FileCode className="h-4 w-4 mr-2" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Template Gallery</DialogTitle>
          <DialogDescription>
            Choose a template to jumpstart your project
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              All
            </TabsTrigger>
            <TabsTrigger
              value="frontend"
              onClick={() => setSelectedCategory("frontend")}
            >
              <Layout className="h-4 w-4 mr-2" />
              Frontend
            </TabsTrigger>
            <TabsTrigger
              value="component"
              onClick={() => setSelectedCategory("component")}
            >
              <Code className="h-4 w-4 mr-2" />
              Components
            </TabsTrigger>
            <TabsTrigger
              value="animation"
              onClick={() => setSelectedCategory("animation")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Animations
            </TabsTrigger>
            <TabsTrigger
              value="interactive"
              onClick={() => setSelectedCategory("interactive")}
            >
              <Palette className="h-4 w-4 mr-2" />
              Interactive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  >
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${template.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"})`,
                      }}
                    />
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">
                        {template.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button
                        onClick={() =>
                          onSelectTemplate(
                            template.html,
                            template.css,
                            template.js,
                          )
                        }
                      >
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {["frontend", "component", "animation", "interactive"].map(
            (category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      >
                        <div
                          className="h-40 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${template.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"})`,
                          }}
                        />
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">
                            {template.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-end">
                          <Button
                            onClick={() =>
                              onSelectTemplate(
                                template.html,
                                template.css,
                                template.js,
                              )
                            }
                          >
                            Use Template
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ),
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
