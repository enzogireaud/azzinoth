# 🚀 Guide de Déploiement en Production

## 📋 Variables d'environnement nécessaires

Ton application utilise ces variables d'environnement :

```bash
STRIPE_SECRET_KEY=sk_live_...           # Clé secrète Stripe LIVE
STRIPE_WEBHOOK_SECRET=whsec_...         # Secret webhook Stripe
DISCORD_BOT_TOKEN=MTQwODc...            # Token bot Discord
DISCORD_GUILD_ID=123456789...           # ID serveur Discord
NEXT_PUBLIC_BASE_URL=https://ton-domaine.vercel.app
```

## 🔧 Étape 1: Configuration Stripe Production

### 1.1 Activer le mode Live dans Stripe
1. Va sur [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Bascule en mode "Live"** (toggle en haut à droite)
3. Va dans **Developers > API Keys**
4. Copie ta **"Secret key"** qui commence par `sk_live_...`

### 1.2 Créer un webhook en production
1. Dans Stripe Dashboard (mode Live), va sur **Developers > Webhooks**
2. Clique **"Add endpoint"**
3. URL endpoint: `https://TON-DOMAINE.vercel.app/api/stripe/webhook`
4. Événements à écouter: `checkout.session.completed`
5. Copie le **"Signing secret"** qui commence par `whsec_...`

## ⚡ Étape 2: Déploiement Vercel

### 2.1 Connecter le repo GitHub
```bash
# Si pas encore fait, installe Vercel CLI
npm i -g vercel

# Deploy depuis le repo
vercel --prod
```

### 2.2 Configurer les variables d'environnement
Dans le dashboard Vercel de ton projet :

1. Va sur **Settings > Environment Variables**
2. Ajoute ces variables **pour PRODUCTION** :

| Variable | Valeur | Type |
|----------|---------|------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | **Secret** |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | **Secret** |
| `DISCORD_BOT_TOKEN` | `MTQwODc...` | **Secret** |
| `DISCORD_GUILD_ID` | `123456789...` | Plain Text |
| `NEXT_PUBLIC_BASE_URL` | `https://ton-domaine.vercel.app` | Plain Text |

⚠️ **IMPORTANT**: Assure-toi de sélectionner **"Production"** dans Environment!

## 🔄 Étape 3: Redéploiement

Après avoir ajouté les variables :
```bash
# Redéploie pour appliquer les nouvelles variables
vercel --prod
```

## 🧪 Étape 4: Tests en Production

### 4.1 Test Stripe
1. Va sur ton site en production
2. Utilise une **vraie carte de crédit** (en mode live)
3. Vérifie que :
   - ✅ Le paiement fonctionne
   - ✅ Le channel Discord se crée
   - ✅ Le message de bienvenue arrive
   - ✅ La page de succès s'affiche

### 4.2 Test webhook
1. Vérifie dans Stripe Dashboard > Webhooks
2. L'endpoint doit montrer des **"✅ Successful"**
3. Si erreurs, check les logs dans Vercel

## 🔒 Sécurité

### Variables à NE JAMAIS commit :
- ❌ `.env.local` (déjà dans .gitignore ✅)
- ❌ `STRIPE_SECRET_KEY`
- ❌ `STRIPE_WEBHOOK_SECRET` 
- ❌ `DISCORD_BOT_TOKEN`

### Variables publiques OK :
- ✅ `NEXT_PUBLIC_BASE_URL` (commence par NEXT_PUBLIC_)

## 📊 Monitoring

### Logs Vercel
```bash
# Voir les logs en temps réel
vercel logs ton-domaine.vercel.app
```

### Stripe Dashboard
- **Payments** : Voir tous les paiements
- **Webhooks** : Voir les événements webhook
- **Logs** : Debugging si problème

## 🚨 Rollback d'urgence

Si problème en prod :
```bash
# Revenir à la version précédente
vercel rollback
```

## ✅ Checklist finale

- [ ] Stripe en mode Live activé
- [ ] Webhook configuré avec la bonne URL
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Site déployé en production
- [ ] Test paiement réel effectué
- [ ] Discord automation fonctionne
- [ ] Monitoring en place

🎉 **Ton site de coaching est maintenant LIVE !**
