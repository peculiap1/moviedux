# Moviedux Webapp - README

## Projectoverzicht

Deze POC biedt gepersonaliseerde filmaanbevelingen op basis van machine learning. Gebruikers kunnen films aan hun kijklijst toevoegen, en op basis van hun voorkeuren en eerder toegevoegde films, worden nieuwe films aanbevolen. Het project is gebouwd met React voor de frontend en TensorFlow.js voor de machine learning-component.

### Functies:

- **Film zoeken**: Gebruikers kunnen films doorzoeken op basis van genre en beoordelingen.
- **Kijklijst**: Gebruikers kunnen films toevoegen aan hun persoonlijke kijklijst.
- **Aanbevelingen**: De webapplicatie gebruikt machine learning om films aan te bevelen die overeenkomen met de genres en beoordelingen van eerder toegevoegde films.

## Installatie-instructies

Volg de onderstaande stappen om het project lokaal op te zetten en uit te voeren:

### 1. Dependencies installeren

Zorg ervoor dat **Node.js** en **npm** geïnstalleerd zijn. Als je die nog niet hebt, kun je Node.js [hier downloaden](https://nodejs.org/).

Na het downloaden van de broncode, navigeer naar de hoofdmap van het project en installeer de benodigde dependencies:

```bash
cd moviedux
npm install
```

Dit installeert de dependencies uit de `package.json`.

### 2. Het project draaien

Om de applicatie lokaal op te starten, gebruik het volgende commando:

```bash
npm start
```

Dit zal de development server starten en de webapplicatie beschikbaar maken op http://localhost:3000.

### 3. Machine learning model trainen

Het TensorFlow.js model wordt automatisch getraind wanneer je de applicatie start en films toevoegt aan je kijklijst.

## Projectstructuur

Deze POC project volgt een modulaire structuur:

- **_/src_**: Bevat alle broncode voor de applicatie.
- **components**: React componenten zoals `MovieGrid`, `MovieCard` en `Watchlist`.
- `mlModel.js`: Bevat de machine learning logica en TensorFlow.js implementatie.
- `App.js`: Hoofdbestand van de applicatie dat alle componenten samenvoegt.
- `movies.json`: Bevat de voorbeeldfilmgegevens die worden gebruikt in de applicatie.

## Machine Learning

In deze POC wordt er gebruikt gemaakt van TensorFlow.js voor het trainen van een machine learning-model dat films aanbeveelt op basis van genres en beoordelingen. Het model wordt getraind op de films in de movieData.js en gebruikt de voorkeuren van de gebruiker om vergelijkbare films te identificeren en een score te geven. De films met de hoogste scores worden vervolgens automatisch bovenaan de lijst weergegeven.

## Credits/Bronnen

Verder wil ik vermelden dat het UI-gedeelte van dit project is ontwikkeld met behulp van kennis opgedaan uit een Udemy cursus over React (van Jonas Schmedtmann). Deze cursus heeft me geholpen om de basis van de gebruikersinterface op te zetten en om te gaan met component-gebaseerde ontwikkeling in React. Het toepassen van het machine learning gedeelte, zoals het trainen van het model en de aanbevelingen op basis van de watchlist, heb ik vervolgens zelf uitgevoerd en geïntegreerd in de applicatie.
