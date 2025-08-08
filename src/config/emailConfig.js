// Configuration EmailJS pour la galerie d'art
// Suivez ces étapes pour configurer EmailJS :
// 1. Créez un compte sur https://www.emailjs.com/
// 2. Créez un nouveau service (Gmail, Outlook, etc.)
// 3. Créez un template d'email avec les variables suivantes :
//    - {{to_name}} : Nom du destinataire (votre nom)
//    - {{from_name}} : Nom de l'expéditeur
//    - {{from_email}} : Email de l'expéditeur
//    - {{artwork_title}} : Titre de l'œuvre d'art
//    - {{message}} : Message de l'utilisateur
//    - {{reply_to}} : Email pour répondre
// 4. Copiez vos identifiants ici

export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_x7kjc18', // Votre Service ID Gmail
  TEMPLATE_ID: 'template_6etsxyi', // Votre Template ID Contact Us  
  PUBLIC_KEY: 'g8riB2BJJdNMcx_B0', // Votre Public Key
};

// Template d'email suggéré :
/*
Sujet : Nouveau message d'intérêt pour "{{artwork_title}}"

Bonjour {{to_name}},

Vous avez reçu un nouveau message d'intérêt pour l'œuvre d'art "{{artwork_title}}".

Détails du contact :
- Nom : {{from_name}}
- Email : {{from_email}}
- Message : {{message}}

Vous pouvez répondre directement à cet email.

Cordialement,
Système de galerie NArt
*/
