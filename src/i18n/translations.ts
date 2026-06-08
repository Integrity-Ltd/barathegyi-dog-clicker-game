export type LanguageCode = "hu" | "en" | "de" | "fi" | "ar" | "zh";

export type TextDirection = "ltr" | "rtl";

export interface LanguageMeta {
  code: LanguageCode;
  nativeName: string;
  locale: string;
  direction: TextDirection;
  documentTitle: string;
}

export interface Messages {
  meta: LanguageMeta;
  start: {
    title: string;
    subtitle: string;
    goalLead: string;
    goalStrong: string;
    goalTail: string;
    helpLead: string;
    helpLabel: string;
    helpTail: string;
    startButton: string;
    helpButton: string;
  };
  ui: {
    language: string;
    appTitle: string;
    help: string;
    reset: string;
    returnHome: string;
    on: string;
    off: string;
    training: string;
    clicks: string;
    click: string;
    openCertificate: string;
    darkMode: string;
    lightMode: string;
    stayProgress: string;
    stayRemaining: string;
  };
  helpScreen: {
    title: string;
    intro: string;
    watchTitle: string;
    watchBody: string;
    rewardTitle: string;
    rewardBody: string;
    avoidTitle: string;
    avoidBody: string;
    progressTitle: string;
    progressBody: string;
    certificateTitle: string;
    certificateBody: string;
    close: string;
    visualLabels: {
      mat: string;
      dog: string;
      handler: string;
      click: string;
      treat: string;
      wait: string;
      doNotClick: string;
      furniture: string;
      progressStart: string;
      progressEnd: string;
      stayTenSeconds: string;
      certificate: string;
    };
  };
  hints: {
    frozenCountdown: string;
    rearLie: string;
  };
  game: {
    initialPrompt: string;
    walkedAway: string;
    stoodUp: string;
    stareWait: string;
    sniffFurniture: string;
    randomLie: string;
    win: string;
    perfectStay: string;
    longerStay: string;
    understanding: string;
    goodTiming: string;
    clickedStare: string;
    waitForTreat: string;
    outsideLiePenalty: string;
    turnedToCarpet: string;
    movingAway: string;
    sideways: string;
    rearLieNeutral: string;
    headLieReward: string;
    bodyLieReward: string;
    wrongTiming: string;
  };
  certificate: {
    assistedTitle: string;
    independentTitle: string;
    exerciseName: string;
    participantIntro: string;
    defaultVolunteerName: string;
    assistedSupportLine: string;
    assistedClickLine: string;
    assistedSuccessLine: string;
    assistedChallengeBody: string;
    independentClickLine: string;
    independentSuccessLine: string;
    independentBadge: string;
    issuedAt: string;
    organizationLine: string;
    modalAssistedSummary: string;
    modalIndependentSummary: string;
    nextChallengeTitle: string;
    nextChallengeBody: string;
    volunteerNameLabel: string;
    volunteerNamePlaceholder: string;
    downloadPng: string;
    close: string;
  };
}

export type GameMessageKey = keyof Messages["game"];

export const translations: Record<LanguageCode, Messages> = {
  hu: {
    meta: {
      code: "hu",
      nativeName: "Magyar",
      locale: "hu-HU",
      direction: "ltr",
      documentTitle: "Klikkertréning – Baráthegyis önkénteseknek",
    },
    start: {
      title: "Klikkertréning",
      subtitle: "Baráthegyis önkéntesek számára",
      goalLead: "Képezd ki a kiskutyát, hogy",
      goalStrong: "legalább 10 másodpercig mozdulatlanul feküdjön a szőnyegen",
      goalTail: "!",
      helpLead: "Ha még nem tudod, hogyan kellene, kapcsold be a",
      helpLabel: "Segítség",
      helpTail: "gombot — végigvezet a tréningen.",
      startButton: "Indítás",
      helpButton: "Játékszabályok és működés",
    },
    ui: {
      language: "Nyelv",
      appTitle: "Klikkertréning",
      help: "Segítség",
      reset: "Újra",
      returnHome: "Kezdőlap",
      on: "BE",
      off: "KI",
      training: "Tanítottság",
      clicks: "Klikkek",
      click: "KLIKK",
      openCertificate: "Tanúsítvány megnyitása",
      darkMode: "Sötét mód",
      lightMode: "Világos mód",
      stayProgress: "10 másodperces helyben maradás",
      stayRemaining: "Még {seconds} mp",
    },
    helpScreen: {
      title: "Hogyan működik a játék?",
      intro:
        "A cél nem az, hogy sokat kattints, hanem hogy pontosan azt jutalmazd, ami a szőnyeg felé viszi a kutyát.",
      watchTitle: "Figyeld az irányt",
      watchBody:
        "Az elején akkor jó a klikk, amikor a kutya a szőnyegen van, vagy egyértelműen a szőnyeg felé fordul.",
      rewardTitle: "A klikk jutalmat indít",
      rewardBody:
        "A klikk után a kutya a gazdihoz megy falatért. Várd meg, míg megeszi, és csak utána klikkelj újra.",
      avoidTitle: "Ne jutalmazz rossz viselkedést",
      avoidBody:
        "Ha a gazdit bámulja, bútort szaglász rossz irányban, vagy a szőnyegen kívül fekszik le, várj.",
      progressTitle: "Kiképzettség: legfeljebb 99%",
      progressBody:
        "A mérő 99%-ig mutatja a fejlődést. A sikerhez ezután még ki kell várni, hogy a kutya 10 másodpercig a szőnyegen maradjon.",
      certificateTitle: "Oklevél a végén",
      certificateBody:
        "A teljesítés eredménye a játék végén lezárul: ha segítséggel játszottál, részvételi oklevelet kapsz, ha anélkül, kiképzési bizonyítványt.",
      close: "Értem",
      visualLabels: {
        mat: "Szőnyeg",
        dog: "Kutya",
        handler: "Gazdi",
        click: "Klikk",
        treat: "Falat",
        wait: "Várj",
        doNotClick: "Ne klikkelj",
        furniture: "Bútor",
        progressStart: "0%",
        progressEnd: "99%",
        stayTenSeconds: "10 mp maradás",
        certificate: "Oklevél",
      },
    },
    hints: {
      frozenCountdown: "gazdit bámulja… {seconds} mp — várj!",
      rearLie: "fenekével fekszik rá — kap falatot, de a tanítottság nem nő",
    },
    game: {
      initialPrompt: "Figyeld a kutyát, és klikkelj a jó pillanatban!",
      walkedAway: "Magától továbbindult. 🐾",
      stoodUp: "Felállt és továbbment. 🐾",
      stareWait: "A gazdit bámulja 👀 – NE klikkelj, várj!",
      sniffFurniture:
        "Elment a bútort szaglászni 🐽 – klikkelj, ha a szőnyeg felé fordul!",
      randomLie: "Csak úgy lefeküdt – de nem a szőnyegen. Ne klikkelj erre! 🚫",
      win: "Megvan! 🏆 10 mp a szőnyegen.",
      perfectStay: "Tökéletes! NE klikkelj – tartsa ki a 10 mp-et! ⏳",
      longerStay: "Egyre tovább marad! Cél: 10 mp.",
      understanding:
        "Kezdi érteni! Most azt jutalmazd, amikor a fejével/testével fekszik rá. 🛑",
      goodTiming: "Jó időzítés! 🎉",
      clickedStare: "A bámulásra klikkeltél – a tétlenséget jutalmaznád. ⬇️",
      waitForTreat: "Várd meg, míg a gazditól megkapja és megeszi a falatkát!",
      outsideLiePenalty: "Szőnyegen kívüli lefekvést jutalmaztál – ez nem cél. ⬇️",
      turnedToCarpet: "A szőnyeg felé fordult – jó döntés! ⬆️",
      movingAway: "Pont elfelé mozgott – ezt jutalmaztad. ⬇️",
      sideways: "Oldalazott – nem egyértelmű irány.",
      rearLieNeutral:
        "A fenekével fekszik rá – kap falatot, de így nem érti meg a szőnyeget, a tanítottság nem változik. ⏸️",
      headLieReward: "A fejével fekszik rá – szuper! ⬆️",
      bodyLieReward: "Az egész testével a szőnyegen – tökéletes! ⬆️",
      wrongTiming: "Hoppá – rossz pillanat.",
    },
    certificate: {
      assistedTitle: "Részvételi oklevél",
      independentTitle: "Kiképzési bizonyítvány",
      exerciseName: "Klikkertréning • „Helyedre – Maradj!” gyakorlat",
      participantIntro: "Ezúton igazoljuk, hogy önkéntes kollégánk",
      defaultVolunteerName: "Önkéntes Kolléga",
      assistedSupportLine: "a bekapcsolt segítség támogatásával,",
      assistedClickLine: "{clicks} kattintással",
      assistedSuccessLine: "sikeresen kiképezte a kutyust.",
      assistedChallengeBody:
        "Gratulálunk! A következő körben próbáld meg a segítség kikapcsolásával is — figyeld a kutya testbeszédét, és klikkelj önállóan a jó pillanatban.",
      independentClickLine: "mindössze {clicks} kattintással",
      independentSuccessLine: "teljesen önállóan kiképezte a kutyust.",
      independentBadge: "★ Segítség nélküli teljesítés ★",
      issuedAt: "Kelt: {date}",
      organizationLine:
        "Baráthegyi Vakvezető és Segítő Kutya Iskola • Önkéntes program",
      modalAssistedSummary:
        "A segítség támogatásával, {clicks} kattintással kiképezted a kutyust! 🎉",
      modalIndependentSummary:
        "{clicks} kattintással, teljesen önállóan kiképezted a kutyust! 🎉",
      nextChallengeTitle: "Következő kihívás:",
      nextChallengeBody:
        "próbáld meg legközelebb segítség nélkül is! Figyeld a kutya testbeszédét, és klikkelj önállóan a jó pillanatban.",
      volunteerNameLabel: "Önkéntes kolléga neve",
      volunteerNamePlaceholder: "Írd be a neved…",
      downloadPng: "{document} letöltése (PNG)",
      close: "Bezárás",
    },
  },
  en: {
    meta: {
      code: "en",
      nativeName: "English",
      locale: "en-US",
      direction: "ltr",
      documentTitle: "Clicker Training – Baráthegyi volunteers",
    },
    start: {
      title: "Clicker Training",
      subtitle: "For Baráthegyi volunteers",
      goalLead: "Train the puppy to",
      goalStrong: "lie still on the mat for at least 10 seconds",
      goalTail: "!",
      helpLead: "If you are not sure what to do, turn on",
      helpLabel: "Help",
      helpTail: "— it guides you through the training.",
      startButton: "Start",
      helpButton: "Rules and mechanics",
    },
    ui: {
      language: "Language",
      appTitle: "Clicker Training",
      help: "Help",
      reset: "Reset",
      returnHome: "Home",
      on: "ON",
      off: "OFF",
      training: "Training",
      clicks: "Clicks",
      click: "CLICK",
      openCertificate: "Open certificate",
      darkMode: "Dark mode",
      lightMode: "Light mode",
      stayProgress: "10-second stay",
      stayRemaining: "{seconds}s remaining",
    },
    helpScreen: {
      title: "How does the game work?",
      intro:
        "The goal is not to click a lot. The goal is to reward exactly what moves the dog toward the mat.",
      watchTitle: "Watch the direction",
      watchBody:
        "At first, click when the dog is on the mat or clearly turns toward the mat.",
      rewardTitle: "A click sends a treat",
      rewardBody:
        "After a click, the dog goes to the handler for a treat. Wait until the dog eats it before clicking again.",
      avoidTitle: "Do not reward the wrong behavior",
      avoidBody:
        "If the dog stares at the handler, sniffs furniture in the wrong direction, or lies down away from the mat, wait.",
      progressTitle: "Training: up to 99%",
      progressBody:
        "The meter shows progress only up to 99%. To finish, wait until the dog stays on the mat for 10 seconds.",
      certificateTitle: "Certificate at the end",
      certificateBody:
        "The completion result is locked when the game ends: help mode gives a participation certificate, no help gives a training certificate.",
      close: "Got it",
      visualLabels: {
        mat: "Mat",
        dog: "Dog",
        handler: "Handler",
        click: "Click",
        treat: "Treat",
        wait: "Wait",
        doNotClick: "Do not click",
        furniture: "Furniture",
        progressStart: "0%",
        progressEnd: "99%",
        stayTenSeconds: "10s stay",
        certificate: "Certificate",
      },
    },
    hints: {
      frozenCountdown: "staring at the handler… {seconds}s — wait!",
      rearLie:
        "lying with the rear on the mat — treat is given, but training does not increase",
    },
    game: {
      initialPrompt: "Watch the dog and click at the right moment!",
      walkedAway: "The dog moved on by itself. 🐾",
      stoodUp: "The dog stood up and moved on. 🐾",
      stareWait: "The dog is staring at the handler 👀 – do NOT click, wait!",
      sniffFurniture:
        "The dog went to sniff furniture 🐽 – click when it turns toward the mat!",
      randomLie: "The dog lay down away from the mat. Do not click this! 🚫",
      win: "Done! 🏆 10 seconds on the mat.",
      perfectStay: "Perfect! Do NOT click – let the dog hold 10 seconds! ⏳",
      longerStay: "The dog stays longer now! Goal: 10 seconds.",
      understanding:
        "The dog is getting it! Reward head/body lying on the mat now. 🛑",
      goodTiming: "Good timing! 🎉",
      clickedStare: "You clicked staring – that would reward doing nothing. ⬇️",
      waitForTreat: "Wait until the dog receives and eats the treat!",
      outsideLiePenalty: "You rewarded lying outside the mat – that is not the goal. ⬇️",
      turnedToCarpet: "The dog turned toward the mat – good choice! ⬆️",
      movingAway: "The dog was moving away – you rewarded that. ⬇️",
      sideways: "Sideways movement – direction is unclear.",
      rearLieNeutral:
        "Rear on the mat – treat is given, but the dog will not understand the mat yet. Training is unchanged. ⏸️",
      headLieReward: "Head on the mat – great! ⬆️",
      bodyLieReward: "Whole body on the mat – perfect! ⬆️",
      wrongTiming: "Oops – wrong moment.",
    },
    certificate: {
      assistedTitle: "Participation Certificate",
      independentTitle: "Training Certificate",
      exerciseName: "Clicker training • “Go to your place – Stay!” exercise",
      participantIntro: "This certifies that our volunteer colleague",
      defaultVolunteerName: "Volunteer Colleague",
      assistedSupportLine: "completed the task with help mode enabled,",
      assistedClickLine: "using {clicks} clicks",
      assistedSuccessLine: "and successfully trained the puppy.",
      assistedChallengeBody:
        "Congratulations! Next time, try turning help mode off too — watch the dog’s body language and click independently at the right moment.",
      independentClickLine: "using only {clicks} clicks",
      independentSuccessLine: "trained the puppy fully independently.",
      independentBadge: "★ Completed without help ★",
      issuedAt: "Issued: {date}",
      organizationLine: "Baráthegyi Guide Dog School • Volunteer program",
      modalAssistedSummary:
        "With help mode enabled, you trained the puppy in {clicks} clicks! 🎉",
      modalIndependentSummary:
        "You trained the puppy fully independently in {clicks} clicks! 🎉",
      nextChallengeTitle: "Next challenge:",
      nextChallengeBody:
        "try it next time without help too. Watch the dog’s body language and click independently at the right moment.",
      volunteerNameLabel: "Volunteer colleague name",
      volunteerNamePlaceholder: "Enter your name…",
      downloadPng: "Download {document} (PNG)",
      close: "Close",
    },
  },
  de: {
    meta: {
      code: "de",
      nativeName: "Deutsch",
      locale: "de-DE",
      direction: "ltr",
      documentTitle: "Clickertraining – Baráthegyi-Freiwillige",
    },
    start: {
      title: "Clickertraining",
      subtitle: "Für Baráthegyi-Freiwillige",
      goalLead: "Trainiere den Hund, damit er",
      goalStrong: "mindestens 10 Sekunden ruhig auf der Matte liegt",
      goalTail: "!",
      helpLead: "Wenn du unsicher bist, aktiviere",
      helpLabel: "Hilfe",
      helpTail: "— sie führt dich durch das Training.",
      startButton: "Starten",
      helpButton: "Regeln und Mechanik",
    },
    ui: {
      language: "Sprache",
      appTitle: "Clickertraining",
      help: "Hilfe",
      reset: "Neu",
      returnHome: "Startseite",
      on: "AN",
      off: "AUS",
      training: "Training",
      clicks: "Klicks",
      click: "KLICK",
      openCertificate: "Zertifikat öffnen",
      darkMode: "Dunkelmodus",
      lightMode: "Hellmodus",
      stayProgress: "10 Sekunden bleiben",
      stayRemaining: "Noch {seconds} s",
    },
    helpScreen: {
      title: "Wie funktioniert das Spiel?",
      intro:
        "Das Ziel ist nicht, viel zu klicken. Belohne genau das Verhalten, das den Hund zur Matte bringt.",
      watchTitle: "Richtung beobachten",
      watchBody:
        "Am Anfang ist ein Klick gut, wenn der Hund auf der Matte ist oder sich klar zur Matte dreht.",
      rewardTitle: "Ein Klick löst Futter aus",
      rewardBody:
        "Nach dem Klick geht der Hund zur Bezugsperson und bekommt Futter. Warte, bis er es gefressen hat.",
      avoidTitle: "Falsches Verhalten nicht belohnen",
      avoidBody:
        "Wenn der Hund die Bezugsperson anstarrt, in die falsche Richtung schnüffelt oder außerhalb der Matte liegt, warte.",
      progressTitle: "Training: bis 99 %",
      progressBody:
        "Die Anzeige zeigt den Fortschritt nur bis 99 %. Danach musst du warten, bis der Hund 10 Sekunden auf der Matte bleibt.",
      certificateTitle: "Zertifikat am Ende",
      certificateBody:
        "Das Ergebnis wird am Spielende festgeschrieben: mit Hilfe gibt es eine Teilnahmeurkunde, ohne Hilfe ein Trainingszertifikat.",
      close: "Verstanden",
      visualLabels: {
        mat: "Matte",
        dog: "Hund",
        handler: "Bezugsperson",
        click: "Klick",
        treat: "Futter",
        wait: "Warten",
        doNotClick: "Nicht klicken",
        furniture: "Möbel",
        progressStart: "0 %",
        progressEnd: "99 %",
        stayTenSeconds: "10 s bleiben",
        certificate: "Zertifikat",
      },
    },
    hints: {
      frozenCountdown: "starrt die Bezugsperson an… {seconds}s — warten!",
      rearLie:
        "liegt mit dem Hinterteil auf der Matte — Futter gibt es, aber der Fortschritt steigt nicht",
    },
    game: {
      initialPrompt: "Beobachte den Hund und klicke im richtigen Moment!",
      walkedAway: "Der Hund läuft von selbst weiter. 🐾",
      stoodUp: "Der Hund steht auf und läuft weiter. 🐾",
      stareWait:
        "Der Hund starrt die Bezugsperson an 👀 – nicht klicken, warten!",
      sniffFurniture:
        "Der Hund schnüffelt an Möbeln 🐽 – klicke, wenn er sich zur Matte dreht!",
      randomLie: "Der Hund legt sich außerhalb der Matte hin. Das nicht klicken! 🚫",
      win: "Geschafft! 🏆 10 Sekunden auf der Matte.",
      perfectStay: "Perfekt! Nicht klicken – 10 Sekunden halten lassen! ⏳",
      longerStay: "Der Hund bleibt immer länger! Ziel: 10 Sekunden.",
      understanding:
        "Der Hund versteht es langsam! Belohne jetzt Kopf/Körper auf der Matte. 🛑",
      goodTiming: "Gutes Timing! 🎉",
      clickedStare:
        "Du hast das Starren geklickt – damit würdest du Untätigkeit belohnen. ⬇️",
      waitForTreat: "Warte, bis der Hund das Leckerli bekommt und frisst!",
      outsideLiePenalty:
        "Du hast Hinlegen außerhalb der Matte belohnt – das ist nicht das Ziel. ⬇️",
      turnedToCarpet: "Der Hund dreht sich zur Matte – gute Entscheidung! ⬆️",
      movingAway: "Der Hund bewegte sich weg – das hast du belohnt. ⬇️",
      sideways: "Seitliche Bewegung – die Richtung ist nicht eindeutig.",
      rearLieNeutral:
        "Hinterteil auf der Matte – Futter gibt es, aber der Hund versteht die Matte so noch nicht. Fortschritt unverändert. ⏸️",
      headLieReward: "Kopf auf der Matte – super! ⬆️",
      bodyLieReward: "Ganzer Körper auf der Matte – perfekt! ⬆️",
      wrongTiming: "Hoppla – falscher Moment.",
    },
    certificate: {
      assistedTitle: "Teilnahmeurkunde",
      independentTitle: "Trainingszertifikat",
      exerciseName: "Clickertraining • Übung „Auf deinen Platz – Bleib!“",
      participantIntro: "Hiermit bestätigen wir, dass unser freiwilliger Kollege",
      defaultVolunteerName: "Freiwilliger Kollege",
      assistedSupportLine: "mit aktivierter Hilfe abgeschlossen hat,",
      assistedClickLine: "mit {clicks} Klicks",
      assistedSuccessLine: "und den Hund erfolgreich trainiert hat.",
      assistedChallengeBody:
        "Glückwunsch! Versuche es in der nächsten Runde auch ohne Hilfe — beobachte die Körpersprache des Hundes und klicke selbstständig im richtigen Moment.",
      independentClickLine: "mit nur {clicks} Klicks",
      independentSuccessLine: "den Hund vollständig selbstständig trainiert hat.",
      independentBadge: "★ Ohne Hilfe abgeschlossen ★",
      issuedAt: "Ausgestellt: {date}",
      organizationLine: "Baráthegyi Blindenführhundeschule • Freiwilligenprogramm",
      modalAssistedSummary:
        "Mit aktivierter Hilfe hast du den Hund mit {clicks} Klicks trainiert! 🎉",
      modalIndependentSummary:
        "Du hast den Hund mit {clicks} Klicks vollständig selbstständig trainiert! 🎉",
      nextChallengeTitle: "Nächste Herausforderung:",
      nextChallengeBody:
        "versuche es das nächste Mal auch ohne Hilfe. Beobachte die Körpersprache des Hundes und klicke selbstständig im richtigen Moment.",
      volunteerNameLabel: "Name des freiwilligen Kollegen",
      volunteerNamePlaceholder: "Gib deinen Namen ein…",
      downloadPng: "{document} herunterladen (PNG)",
      close: "Schließen",
    },
  },
  fi: {
    meta: {
      code: "fi",
      nativeName: "Suomi",
      locale: "fi-FI",
      direction: "ltr",
      documentTitle: "Naksutinkoulutus – Baráthegyin vapaaehtoisille",
    },
    start: {
      title: "Naksutinkoulutus",
      subtitle: "Baráthegyin vapaaehtoisille",
      goalLead: "Kouluta pentu",
      goalStrong: "makaamaan rauhassa matolla vähintään 10 sekuntia",
      goalTail: "!",
      helpLead: "Jos et ole vielä varma mitä tehdä, laita",
      helpLabel: "Ohje",
      helpTail: "päälle — se opastaa koulutuksen läpi.",
      startButton: "Aloita",
      helpButton: "Säännöt ja toimintaperiaate",
    },
    ui: {
      language: "Kieli",
      appTitle: "Naksutinkoulutus",
      help: "Ohje",
      reset: "Alusta",
      returnHome: "Etusivu",
      on: "PÄÄLLÄ",
      off: "POIS",
      training: "Koulutustaso",
      clicks: "Klikkaukset",
      click: "KLIKKI",
      openCertificate: "Avaa todistus",
      darkMode: "Tumma tila",
      lightMode: "Vaalea tila",
      stayProgress: "10 sekunnin paikallaanolo",
      stayRemaining: "{seconds} s jäljellä",
    },
    helpScreen: {
      title: "Miten peli toimii?",
      intro:
        "Tavoite ei ole klikata paljon, vaan palkita täsmälleen sitä käytöstä, joka vie koiraa kohti mattoa.",
      watchTitle: "Seuraa suuntaa",
      watchBody:
        "Alussa klikkaus on hyvä silloin, kun koira on matolla tai kääntyy selvästi mattoa kohti.",
      rewardTitle: "Klikkaus käynnistää palkkion",
      rewardBody:
        "Klikkauksen jälkeen koira menee ohjaajan luo namille. Odota, että koira syö sen, ennen kuin klikkaat uudelleen.",
      avoidTitle: "Älä palkitse väärää käytöstä",
      avoidBody:
        "Jos koira tuijottaa ohjaajaa, haistelee huonekaluja väärään suuntaan tai menee makaamaan pois matolta, odota.",
      progressTitle: "Koulutustaso: enintään 99 %",
      progressBody:
        "Mittari näyttää edistymisen vain 99 prosenttiin asti. Lopuksi pitää vielä odottaa, että koira pysyy matolla 10 sekuntia.",
      certificateTitle: "Todistus lopussa",
      certificateBody:
        "Suorituksen tulos lukitaan pelin päättyessä: ohjeen kanssa saat osallistumistodistuksen, ilman ohjetta koulutustodistuksen.",
      close: "Selvä",
      visualLabels: {
        mat: "Matto",
        dog: "Koira",
        handler: "Ohjaaja",
        click: "Klikki",
        treat: "Nami",
        wait: "Odota",
        doNotClick: "Älä klikkaa",
        furniture: "Huonekalu",
        progressStart: "0 %",
        progressEnd: "99 %",
        stayTenSeconds: "10 s paikallaan",
        certificate: "Todistus",
      },
    },
    hints: {
      frozenCountdown: "tuijottaa ohjaajaa… {seconds} s — odota!",
      rearLie:
        "takapää matolla — nami annetaan, mutta koulutustaso ei nouse",
    },
    game: {
      initialPrompt: "Tarkkaile koiraa ja klikkaa oikealla hetkellä!",
      walkedAway: "Koira lähti itse liikkeelle. 🐾",
      stoodUp: "Koira nousi ja jatkoi matkaa. 🐾",
      stareWait: "Koira tuijottaa ohjaajaa 👀 – älä klikkaa, odota!",
      sniffFurniture:
        "Koira lähti haistelemaan huonekaluja 🐽 – klikkaa, kun se kääntyy kohti mattoa!",
      randomLie: "Koira meni makaamaan pois matolta. Älä klikkaa tätä! 🚫",
      win: "Valmis! 🏆 10 sekuntia matolla.",
      perfectStay: "Täydellistä! Älä klikkaa – anna koiran pysyä 10 sekuntia! ⏳",
      longerStay: "Koira pysyy jo pidempään! Tavoite: 10 sekuntia.",
      understanding:
        "Koira alkaa ymmärtää! Palkitse nyt, kun pää tai keho on matolla. 🛑",
      goodTiming: "Hyvä ajoitus! 🎉",
      clickedStare: "Klikkasit tuijotusta – se palkitsisi passiivisuutta. ⬇️",
      waitForTreat: "Odota, että koira saa namin ja syö sen!",
      outsideLiePenalty:
        "Palkitsit makaamisen maton ulkopuolella – se ei ole tavoite. ⬇️",
      turnedToCarpet: "Koira kääntyi mattoa kohti – hyvä valinta! ⬆️",
      movingAway: "Koira oli menossa poispäin – palkitsit sitä. ⬇️",
      sideways: "Sivuttaisliike – suunta ei ole selvä.",
      rearLieNeutral:
        "Takapää matolla – nami annetaan, mutta koira ei vielä ymmärrä mattoa. Koulutustaso ei muutu. ⏸️",
      headLieReward: "Pää matolla – hienoa! ⬆️",
      bodyLieReward: "Koko keho matolla – täydellistä! ⬆️",
      wrongTiming: "Hups – väärä hetki.",
    },
    certificate: {
      assistedTitle: "Osallistumistodistus",
      independentTitle: "Koulutustodistus",
      exerciseName: "Naksutinkoulutus • “Paikalle – Pysy!” -harjoitus",
      participantIntro: "Täten todistamme, että vapaaehtoiskollegamme",
      defaultVolunteerName: "Vapaaehtoiskollega",
      assistedSupportLine: "suoritti tehtävän ohjetilan avulla,",
      assistedClickLine: "{clicks} klikkauksella",
      assistedSuccessLine: "ja koulutti pennun onnistuneesti.",
      assistedChallengeBody:
        "Onnittelut! Kokeile seuraavalla kierroksella myös ilman ohjetta — tarkkaile koiran kehonkieltä ja klikkaa itsenäisesti oikealla hetkellä.",
      independentClickLine: "vain {clicks} klikkauksella",
      independentSuccessLine: "koulutti pennun täysin itsenäisesti.",
      independentBadge: "★ Suoritettu ilman ohjetta ★",
      issuedAt: "Päiväys: {date}",
      organizationLine: "Baráthegyin opaskoirakoulu • Vapaaehtoisohjelma",
      modalAssistedSummary:
        "Ohjetilan avulla koulutit pennun {clicks} klikkauksella! 🎉",
      modalIndependentSummary:
        "Koulutit pennun täysin itsenäisesti {clicks} klikkauksella! 🎉",
      nextChallengeTitle: "Seuraava haaste:",
      nextChallengeBody:
        "kokeile ensi kerralla myös ilman ohjetta. Tarkkaile koiran kehonkieltä ja klikkaa itsenäisesti oikealla hetkellä.",
      volunteerNameLabel: "Vapaaehtoiskollegan nimi",
      volunteerNamePlaceholder: "Kirjoita nimesi…",
      downloadPng: "Lataa {document} (PNG)",
      close: "Sulje",
    },
  },
  ar: {
    meta: {
      code: "ar",
      nativeName: "العربية",
      locale: "ar",
      direction: "rtl",
      documentTitle: "تدريب النقر – متطوعو باراثهيغي",
    },
    start: {
      title: "تدريب النقر",
      subtitle: "لمتطوعي باراثهيغي",
      goalLead: "درّب الجرو حتى",
      goalStrong: "يبقى مستلقياً على السجادة بلا حركة لمدة 10 ثوانٍ على الأقل",
      goalTail: "!",
      helpLead: "إذا لم تكن متأكداً، شغّل",
      helpLabel: "المساعدة",
      helpTail: "— سترشدك خلال التدريب.",
      startButton: "ابدأ",
      helpButton: "القواعد وآلية اللعب",
    },
    ui: {
      language: "اللغة",
      appTitle: "تدريب النقر",
      help: "المساعدة",
      reset: "إعادة",
      returnHome: "الرئيسية",
      on: "تشغيل",
      off: "إيقاف",
      training: "التدريب",
      clicks: "النقرات",
      click: "انقر",
      openCertificate: "فتح الشهادة",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      stayProgress: "الثبات لمدة 10 ثوانٍ",
      stayRemaining: "متبقٍ {seconds} ث",
    },
    helpScreen: {
      title: "كيف تعمل اللعبة؟",
      intro:
        "الهدف ليس كثرة النقرات، بل مكافأة السلوك الذي يقرّب الكلب من السجادة بدقة.",
      watchTitle: "راقب الاتجاه",
      watchBody:
        "في البداية، تكون النقرة صحيحة عندما يكون الكلب على السجادة أو يتجه بوضوح نحوها.",
      rewardTitle: "النقرة ترسل مكافأة",
      rewardBody:
        "بعد النقرة يذهب الكلب إلى المدرّب ليأخذ مكافأة. انتظر حتى يأكلها قبل النقر مرة أخرى.",
      avoidTitle: "لا تكافئ السلوك الخاطئ",
      avoidBody:
        "إذا كان الكلب يحدق في المدرّب، أو يشم الأثاث في الاتجاه الخطأ، أو يستلقي بعيداً عن السجادة، فانتظر.",
      progressTitle: "التدريب: حتى 99٪",
      progressBody:
        "يعرض المؤشر التقدم حتى 99٪ فقط. وللإنهاء يجب الانتظار حتى يبقى الكلب على السجادة 10 ثوانٍ.",
      certificateTitle: "الشهادة في النهاية",
      certificateBody:
        "تُثبت نتيجة الإنهاء عند نهاية اللعبة: مع المساعدة تحصل على شهادة مشاركة، وبدونها تحصل على شهادة تدريب.",
      close: "فهمت",
      visualLabels: {
        mat: "السجادة",
        dog: "الكلب",
        handler: "المدرّب",
        click: "نقرة",
        treat: "مكافأة",
        wait: "انتظر",
        doNotClick: "لا تنقر",
        furniture: "أثاث",
        progressStart: "٠٪",
        progressEnd: "٩٩٪",
        stayTenSeconds: "ثبات ١٠ ثوانٍ",
        certificate: "الشهادة",
      },
    },
    hints: {
      frozenCountdown: "ينظر إلى المدرّب… {seconds} ث — انتظر!",
      rearLie:
        "مؤخرته على السجادة — يأخذ مكافأة، لكن مستوى التدريب لا يزيد",
    },
    game: {
      initialPrompt: "راقب الكلب وانقر في اللحظة المناسبة!",
      walkedAway: "تحرّك الكلب من تلقاء نفسه. 🐾",
      stoodUp: "نهض الكلب وتابع الحركة. 🐾",
      stareWait: "الكلب ينظر إلى المدرّب 👀 – لا تنقر، انتظر!",
      sniffFurniture:
        "ذهب الكلب ليشمّ الأثاث 🐽 – انقر عندما يتجه نحو السجادة!",
      randomLie: "استلقى الكلب بعيداً عن السجادة. لا تنقر على هذا! 🚫",
      win: "تم! 🏆 10 ثوانٍ على السجادة.",
      perfectStay: "ممتاز! لا تنقر – دعه يبقى 10 ثوانٍ! ⏳",
      longerStay: "يبقى الكلب لمدة أطول الآن! الهدف: 10 ثوانٍ.",
      understanding:
        "بدأ الكلب يفهم! كافئ الرأس أو الجسم عندما يكون على السجادة. 🛑",
      goodTiming: "توقيت جيد! 🎉",
      clickedStare: "نقرت أثناء التحديق – هذا يكافئ عدم الحركة. ⬇️",
      waitForTreat: "انتظر حتى يحصل الكلب على المكافأة ويأكلها!",
      outsideLiePenalty: "كافأت الاستلقاء خارج السجادة – هذا ليس الهدف. ⬇️",
      turnedToCarpet: "اتجه الكلب نحو السجادة – قرار جيد! ⬆️",
      movingAway: "كان الكلب يبتعد – وهذا ما كافأته. ⬇️",
      sideways: "حركة جانبية – الاتجاه غير واضح.",
      rearLieNeutral:
        "المؤخرة على السجادة – يحصل على مكافأة، لكنه لن يفهم الهدف بعد. التدريب لا يتغير. ⏸️",
      headLieReward: "الرأس على السجادة – رائع! ⬆️",
      bodyLieReward: "الجسم كله على السجادة – ممتاز! ⬆️",
      wrongTiming: "عفواً – لحظة غير مناسبة.",
    },
    certificate: {
      assistedTitle: "شهادة مشاركة",
      independentTitle: "شهادة تدريب",
      exerciseName: "تدريب النقر • تمرين «اذهب إلى مكانك – ابقَ»",
      participantIntro: "نشهد بموجب هذا أن زميلنا المتطوع",
      defaultVolunteerName: "زميل متطوع",
      assistedSupportLine: "أكمل المهمة مع تشغيل وضع المساعدة،",
      assistedClickLine: "باستخدام {clicks} نقرة",
      assistedSuccessLine: "ودرّب الجرو بنجاح.",
      assistedChallengeBody:
        "تهانينا! في الجولة التالية جرّب إيقاف المساعدة أيضاً — راقب لغة جسد الكلب وانقر بنفسك في اللحظة المناسبة.",
      independentClickLine: "باستخدام {clicks} نقرة فقط",
      independentSuccessLine: "درّب الجرو بشكل مستقل تماماً.",
      independentBadge: "★ إنجاز بدون مساعدة ★",
      issuedAt: "تاريخ الإصدار: {date}",
      organizationLine: "مدرسة باراثهيغي لكلاب الإرشاد • برنامج المتطوعين",
      modalAssistedSummary:
        "مع تشغيل المساعدة، درّبت الجرو باستخدام {clicks} نقرة! 🎉",
      modalIndependentSummary:
        "درّبت الجرو بشكل مستقل تماماً باستخدام {clicks} نقرة! 🎉",
      nextChallengeTitle: "التحدي التالي:",
      nextChallengeBody:
        "جرّبها في المرة القادمة بدون مساعدة أيضاً. راقب لغة جسد الكلب وانقر بنفسك في اللحظة المناسبة.",
      volunteerNameLabel: "اسم الزميل المتطوع",
      volunteerNamePlaceholder: "اكتب اسمك…",
      downloadPng: "تنزيل {document} (PNG)",
      close: "إغلاق",
    },
  },
  zh: {
    meta: {
      code: "zh",
      nativeName: "中文",
      locale: "zh-CN",
      direction: "ltr",
      documentTitle: "响片训练 – Baráthegyi 志愿者",
    },
    start: {
      title: "响片训练",
      subtitle: "面向 Baráthegyi 志愿者",
      goalLead: "训练小狗",
      goalStrong: "在垫子上静止趴满至少 10 秒",
      goalTail: "！",
      helpLead: "如果还不确定怎么做，请打开",
      helpLabel: "帮助",
      helpTail: "— 它会引导你完成训练。",
      startButton: "开始",
      helpButton: "规则和机制",
    },
    ui: {
      language: "语言",
      appTitle: "响片训练",
      help: "帮助",
      reset: "重来",
      returnHome: "首页",
      on: "开",
      off: "关",
      training: "训练度",
      clicks: "点击数",
      click: "点击",
      openCertificate: "打开证书",
      darkMode: "深色模式",
      lightMode: "浅色模式",
      stayProgress: "保持 10 秒",
      stayRemaining: "还剩 {seconds} 秒",
    },
    helpScreen: {
      title: "游戏如何运作？",
      intro: "目标不是频繁点击，而是准确奖励能让小狗接近垫子的行为。",
      watchTitle: "观察方向",
      watchBody: "一开始，当小狗在垫子上，或明确转向垫子时，点击就是正确的。",
      rewardTitle: "点击会送出零食",
      rewardBody:
        "点击后，小狗会去训犬员那里拿零食。等它吃完后，再进行下一次点击。",
      avoidTitle: "不要奖励错误行为",
      avoidBody:
        "如果小狗盯着训犬员、朝错误方向闻家具，或在垫子外趴下，请等待。",
      progressTitle: "训练度：最高 99%",
      progressBody:
        "进度条只显示到 99%。要完成游戏，还需要等待小狗在垫子上保持 10 秒。",
      certificateTitle: "最后获得证书",
      certificateBody:
        "游戏结束时会锁定完成结果：使用帮助会获得参与证书，不使用帮助会获得训练证书。",
      close: "明白了",
      visualLabels: {
        mat: "垫子",
        dog: "小狗",
        handler: "训犬员",
        click: "点击",
        treat: "零食",
        wait: "等待",
        doNotClick: "不要点击",
        furniture: "家具",
        progressStart: "0%",
        progressEnd: "99%",
        stayTenSeconds: "保持 10 秒",
        certificate: "证书",
      },
    },
    hints: {
      frozenCountdown: "正在盯着训犬员… {seconds} 秒 — 等待！",
      rearLie: "后半身在垫子上 — 会给零食，但训练度不会增加",
    },
    game: {
      initialPrompt: "观察小狗，在正确时机点击！",
      walkedAway: "小狗自己走开了。🐾",
      stoodUp: "小狗站起来继续走了。🐾",
      stareWait: "小狗正在盯着训犬员 👀 – 不要点击，等待！",
      sniffFurniture: "小狗去闻家具了 🐽 – 当它转向垫子时点击！",
      randomLie: "小狗在垫子外趴下了。不要点击这个！🚫",
      win: "完成！🏆 在垫子上坚持 10 秒。",
      perfectStay: "完美！不要点击 – 让它坚持 10 秒！⏳",
      longerStay: "它停留得更久了！目标：10 秒。",
      understanding: "小狗开始理解了！现在奖励头部/身体在垫子上。🛑",
      goodTiming: "时机很好！🎉",
      clickedStare: "你点击了盯人行为 – 这会奖励不行动。⬇️",
      waitForTreat: "等小狗拿到并吃完零食！",
      outsideLiePenalty: "你奖励了垫子外趴下 – 这不是目标。⬇️",
      turnedToCarpet: "小狗转向垫子 – 很好！⬆️",
      movingAway: "小狗正离开垫子 – 你奖励了这个。⬇️",
      sideways: "横向移动 – 方向不明确。",
      rearLieNeutral:
        "后半身在垫子上 – 会给零食，但小狗还不会理解垫子目标。训练度不变。⏸️",
      headLieReward: "头在垫子上 – 很棒！⬆️",
      bodyLieReward: "整个身体在垫子上 – 完美！⬆️",
      wrongTiming: "哎呀 – 时机不对。",
    },
    certificate: {
      assistedTitle: "参与证书",
      independentTitle: "训练证书",
      exerciseName: "响片训练 • “回到位置 – 保持”练习",
      participantIntro: "兹证明我们的志愿者同事",
      defaultVolunteerName: "志愿者同事",
      assistedSupportLine: "在帮助模式开启的情况下完成任务，",
      assistedClickLine: "使用 {clicks} 次点击",
      assistedSuccessLine: "成功训练了小狗。",
      assistedChallengeBody:
        "恭喜！下一轮也试试关闭帮助模式——观察小狗的身体语言，并独立把握正确点击时机。",
      independentClickLine: "仅用 {clicks} 次点击",
      independentSuccessLine: "完全独立地训练了小狗。",
      independentBadge: "★ 无帮助完成 ★",
      issuedAt: "日期：{date}",
      organizationLine: "Baráthegyi 导盲犬学校 • 志愿者项目",
      modalAssistedSummary: "在帮助模式下，你用 {clicks} 次点击训练好了小狗！🎉",
      modalIndependentSummary: "你用 {clicks} 次点击完全独立训练好了小狗！🎉",
      nextChallengeTitle: "下一个挑战：",
      nextChallengeBody:
        "下次也试试不使用帮助。观察小狗的身体语言，并独立在正确时机点击。",
      volunteerNameLabel: "志愿者同事姓名",
      volunteerNamePlaceholder: "输入你的名字…",
      downloadPng: "下载{document}（PNG）",
      close: "关闭",
    },
  },
};

export const languageOptions = Object.values(translations).map(
  ({ meta }) => meta,
);

export const defaultLanguage: LanguageCode = "hu";
