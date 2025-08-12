import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../config/emailConfig';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [emailStatus, setEmailStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailStatus('sending');

    try {
      const templateParams = {
        to_name: 'Galerie N\'ART',
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      console.log('Email envoyé avec succès:', response);
      setEmailStatus('success');
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Réinitialiser le status après 5 secondes
      setTimeout(() => setEmailStatus(null), 5000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      setEmailStatus('error');
      setTimeout(() => setEmailStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Hero Section avec image de fond */}
      <div className="contact-hero" style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '4rem'
      }}>
        <div className="hero-overlay"></div>
        
        {/* Effet de particules décoratif */}
        <div className="hero-decoration">
          <div className="floating-brush floating-brush-1">🎨</div>
          <div className="floating-brush floating-brush-2">✉️</div>
          <div className="floating-brush floating-brush-3">💌</div>
        </div>
        
        <div className="hero-content" style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '70%',
          margin: '0 auto'
        }}>
          {/* Zone de texte consolidée */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            borderRadius: '30px',
            padding: '2rem 3rem',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
          }}>
            <h1 className="hero-title" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '1.2rem',
              textAlign: 'center',
              textShadow: '0 4px 25px rgba(255, 255, 255, 0.8)',
              letterSpacing: '0.05em'
            }}>Contactez-nous</h1>
            
            <p className="hero-subtitle" style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: '#2c3e50',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: '500',
              textAlign: 'center',
              lineHeight: '1.6',
              margin: '0',
              textShadow: '0 3px 20px rgba(255, 255, 255, 0.7)',
              opacity: '1'
            }}>
              Une question sur nos œuvres ? Un projet d'exposition ? 
              <br />N'hésitez pas à nous écrire !
            </p>
          </div>
        </div>
      </div>

      {/* Section principale - Modèle 2 colonnes */}
      <div className="contact-main-section" style={{
        display: 'flex',
        minHeight: '70vh',
        maxWidth: '1200px',
        margin: '0 auto',
        borderRadius: '25px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(161, 60, 47, 0.15)',
        marginTop: '-12rem',
        position: 'relative',
        zIndex: 10,
        background: 'white'
      }}>
        
        {/* Section gauche - Informations */}
        <div className="contact-left-section" style={{
          flex: '1',
          background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
          padding: '4rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Effet décoratif */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}></div>
          
          {/* Logo/Icône */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            padding: '2rem',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/nart-logo.png" 
              alt="N'ART Logo" 
              style={{ 
                height: '4rem',
                width: '4rem',
                filter: 'brightness(1.2) contrast(1.1)',
                objectFit: 'contain'
              }}
            />
          </div>
          
          {/* Titre principal */}
          <h2 style={{
            fontSize: '2.5rem',
            fontFamily: "'Playfair Display', serif",
            fontWeight: '600',
            color: 'white',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Contactez-nous pour une expérience artistique unique
          </h2>
          
          {/* Sous-titre */}
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: "'Roboto', sans-serif",
            fontWeight: '300',
            lineHeight: '1.6',
            marginBottom: '2.5rem'
          }}>
            Découvrez l'authenticité de l'art véritable et laissez-vous émouvoir par nos créations.
          </p>
          
          {/* Email */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '1.5rem 2rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📧</span>
            <div>
              <h4 style={{ 
                color: 'white', 
                margin: '0 0 0.5rem 0',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: '600'
              }}>Email</h4>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                margin: 0,
                fontSize: '1.1rem'
              }}>contact@naoual.art</p>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="contact-right-section" style={{
          flex: '1',
          padding: '4rem 3rem',
          background: 'linear-gradient(135deg, rgba(248, 246, 242, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)'
        }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '1rem'
            }}>
              Remplissez ce formulaire
            </h3>
            <p style={{
              color: '#5a6c7d',
              fontSize: '1.1rem',
              fontFamily: "'Roboto', sans-serif"
            }}>
              Nous vous répondrons rapidement.
            </p>
          </div>

          {/* Formulaire */}
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="name" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom et prénom"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid rgba(161, 60, 47, 0.2)',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a13c2f';
                    e.target.style.boxShadow = '0 0 10px rgba(161, 60, 47, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(161, 60, 47, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="email" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre.email@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid rgba(161, 60, 47, 0.2)',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a13c2f';
                    e.target.style.boxShadow = '0 0 10px rgba(161, 60, 47, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(161, 60, 47, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="subject" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>Sujet</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid rgba(161, 60, 47, 0.2)',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    color: '#2c3e50'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a13c2f';
                    e.target.style.boxShadow = '0 0 10px rgba(161, 60, 47, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(161, 60, 47, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="" style={{ color: '#999' }}>Choisissez un sujet</option>
                  <option value="Question sur une œuvre" style={{ color: '#2c3e50' }}>Question sur une œuvre</option>
                  <option value="Demande d'achat" style={{ color: '#2c3e50' }}>Demande d'achat</option>
                  <option value="Projet d'exposition" style={{ color: '#2c3e50' }}>Projet d'exposition</option>
                  <option value="Collaboration artistique" style={{ color: '#2c3e50' }}>Collaboration artistique</option>
                  <option value="Presse et médias" style={{ color: '#2c3e50' }}>Presse et médias</option>
                  <option value="Autre" style={{ color: '#2c3e50' }}>Autre</option>
                </select>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="message" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande en détail..."
                  rows="5"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid rgba(161, 60, 47, 0.2)',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a13c2f';
                    e.target.style.boxShadow = '0 0 10px rgba(161, 60, 47, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(161, 60, 47, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                ></textarea>
              </div>

              {/* Status de l'email */}
              {emailStatus && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  background: emailStatus === 'success' 
                    ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
                    : emailStatus === 'error'
                    ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                    : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  color: 'white'
                }}>
                  {emailStatus === 'sending' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span>Envoi en cours...</span>
                    </div>
                  )}
                  {emailStatus === 'success' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>✅</span>
                      <span>Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
                    </div>
                  )}
                  {emailStatus === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>❌</span>
                      <span>Erreur lors de l'envoi. Veuillez réessayer.</span>
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, #a13c2f 0%, #8b2f23 100%)',
                  color: 'white',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(161, 60, 47, 0.3)',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                disabled={isSubmitting}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(161, 60, 47, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(161, 60, 47, 0.3)';
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <span>Envoyer le message</span>
                    <span>📧</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Styles CSS pour l'animation et responsive */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .contact-main-section {
            flex-direction: column !important;
            margin-top: -2rem !important;
            margin-left: 1rem !important;
            margin-right: 1rem !important;
          }
          
          .contact-left-section {
            padding: 3rem 2rem !important;
          }
          
          .contact-left-section h2 {
            font-size: 2rem !important;
          }
          
          .contact-right-section {
            padding: 3rem 2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .contact-left-section {
            padding: 2rem 1.5rem !important;
          }
          
          .contact-left-section h2 {
            font-size: 1.8rem !important;
          }
          
          .contact-right-section {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
