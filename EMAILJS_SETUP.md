# Configuration EmailJS pour la Galerie NArt 📧

## Étapes de configuration

### 1. Créer un compte EmailJS
1. Allez sur [EmailJS.com](https://www.emailjs.com/)
2. Créez un compte gratuit

### 2. Configurer le service d'email
1. Dans le dashboard EmailJS, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez votre fournisseur d'email :
   - **Gmail** (recommandé)
   - **Outlook**
   - **Yahoo**
   - Ou autre
4. Suivez les instructions pour connecter votre compte email
5. Notez le **Service ID** généré

### 3. Créer le template d'email
1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Utilisez ce template :

**Sujet :**
```
Nouveau message d'intérêt pour "{{artwork_title}}"
```

**Corps du message :**
```
Bonjour,

Vous avez reçu un nouveau message d'intérêt pour l'œuvre d'art "{{artwork_title}}".

Détails du contact :
- Nom : {{from_name}}
- Email : {{from_email}}
- Message : {{message}}

Vous pouvez répondre directement à cet email.

Cordialement,
Système de galerie NArt
```

4. Dans les paramètres du template :
   - **To Email** : Votre email (où vous voulez recevoir les messages)
   - **From Name** : `{{from_name}}`
   - **Reply To** : `{{from_email}}`

5. Sauvegardez et notez le **Template ID**

### 4. Obtenir la clé publique
1. Allez dans **Account** > **General**
2. Copiez votre **Public Key**

### 5. Configurer l'application
1. Ouvrez le fichier `src/config/emailConfig.js`
2. Remplacez les valeurs par vos identifiants :

```javascript
export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_xxxxxxx', // Votre Service ID
  TEMPLATE_ID: 'template_xxxxxxx', // Votre Template ID
  PUBLIC_KEY: 'xxxxxxxxxxxxxxx', // Votre Public Key
};
```

### 6. Test
1. Redémarrez l'application
2. Testez l'envoi d'un message d'intérêt
3. Vérifiez votre boîte email

## Variables disponibles

Dans votre template EmailJS, vous pouvez utiliser ces variables :

- `{{to_name}}` : Nom du destinataire (votre nom)
- `{{from_name}}` : Nom de la personne intéressée
- `{{from_email}}` : Email de la personne intéressée
- `{{artwork_title}}` : Titre de l'œuvre d'art
- `{{message}}` : Message de la personne
- `{{reply_to}}` : Email de réponse

## Limites du plan gratuit
- 200 emails/mois
- Suffisant pour une galerie d'art personnelle

## Support
Si vous avez des problèmes, consultez la [documentation EmailJS](https://www.emailjs.com/docs/).
