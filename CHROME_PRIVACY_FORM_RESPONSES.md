# Chrome Web Store - Réponses au Formulaire de Confidentialité

## 📋 Objectif Unique

### Description de l'objectif unique
```
SubStyle allows users to customize and enhance YouTube subtitles with beautiful styling and animations. The extension loads YouTube's native transcripts and applies user-chosen fonts, colors, sizes, and animation effects to improve readability and viewing experience. All customization happens locally in the browser - no data is collected or transmitted.
```

---

## 🔐 Justification des Autorisations

### Justification de l'autorisation activeTab
```
The activeTab permission is required to detect when users are watching YouTube videos and to read the current page URL. This allows SubStyle to activate only on YouTube watch pages and to identify which video the user is viewing. No browsing data is collected or stored.
```

### Justification de l'autorisation storage
```
The storage permission is used exclusively to save users' subtitle style preferences (font family, size, color, animation type) locally on their device. This allows users to maintain their preferred subtitle styles across browser sessions. No personal data is stored, and all data remains on the user's device.
```

### Justification de l'autorisation notifications
```
The notifications permission is used to inform users when subtitle loading is complete and ready to display. These are simple success/error notifications that enhance user experience by providing feedback on subtitle processing status. No data is collected through notifications.
```

### Justification de l'autorisation scripting
```
The scripting permission is required to inject styled subtitles into YouTube video pages. This allows SubStyle to overlay custom-styled subtitles on top of videos while hiding native YouTube subtitles. The injected code runs entirely in the browser and does not communicate with external servers.
```

### Justification de l'autorisation Autorisation d'accès à l'hôte
```
Host access to https://www.youtube.com/* is essential for SubStyle's core functionality. The extension needs to:
1. Detect YouTube video pages
2. Extract native transcript data from YouTube's DOM
3. Inject styled subtitle overlays on video pages
4. Synchronize subtitles with video playback

All processing happens locally in the browser. No YouTube data is transmitted to external servers. The extension only accesses YouTube pages when users actively navigate to them.
```

---

## 💻 Code Distant

### Utilisez-vous code distant ?
**Sélectionnez : Non, je n'utilise pas "Code distant"**

### Justification
```
SubStyle does not use any remote code. All JavaScript and resources are bundled within the extension package. There are no external script references, no eval() calls, and no dynamically loaded code from external sources. The extension is completely self-contained.
```

---

## 📊 Consommation des Données

### Quelles données prévoyez-vous de collecter ?

**DÉCOCHEZ TOUTES LES CASES** - Aucune donnée n'est collectée

- ❌ Informations permettant d'identifier personnellement l'utilisateur
- ❌ Information sur la santé
- ❌ Informations financières et de paiement
- ❌ Informations d'authentification
- ❌ Communications personnelles
- ❌ Localisation
- ❌ Historique Web
- ❌ Activité de l'utilisateur
- ❌ Contenu du site Web

---

## ✅ Certifications

**COCHEZ LES TROIS CASES :**

✅ Je certifie que je ne vends ni ne transfère les données des utilisateurs à des tiers en dehors des cas d'utilisation approuvés

✅ Je certifie que je n'utilise ni ne transfère les données des utilisateurs à des fins sans rapport avec la fonctionnalité de base de mon article

✅ Je certifie que je n'utilise ni ne transfère les données des utilisateurs pour déterminer leur solvabilité ou à des fins de prêt

---

## 🔒 Règles de Confidentialité

### URL des règles de confidentialité
```
https://github.com/MattJeff/mySubtitle/blob/main/PRIVACY.md
```

---

## 📝 Notes Importantes

1. **Aucune donnée collectée** : SubStyle ne collecte, ne stocke ni ne transmet aucune donnée utilisateur
2. **Traitement local uniquement** : Tout le traitement se fait dans le navigateur
3. **Pas de serveurs externes** : Aucune communication avec des serveurs tiers
4. **Stockage local** : Seules les préférences de style sont stockées localement via Chrome Storage API
5. **Open source** : Le code source est public sur GitHub pour vérification

---

## ✅ Checklist Finale

Avant de soumettre :
- [ ] Toutes les justifications copiées-collées
- [ ] "Non" sélectionné pour le code distant
- [ ] TOUTES les cases de collecte de données DÉCOCHÉES
- [ ] Les 3 certifications COCHÉES
- [ ] URL de confidentialité saisie
- [ ] Double vérification de toutes les réponses

---

**🚀 Vous êtes prêt à soumettre !**
