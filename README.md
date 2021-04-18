# gra-w-smoka
Nowa implementacja Gry w Smoka, realizowana w ramach pracy dymplomowej będącej zwieńczeniem studiów inżynierskich na Wydziale Matematyki i Informatyki, Uniwersytetu Wrocławskiego.

## Tworzenie kodu
Pliki tworzymy w odpowiadających im folderach, wszystkie pliki poza tymi do widoków, powinny mieć rozszerzenie .ts (pliki widoków .tsx).

## Uruchomienie
### Potrzebne programy
1. Node.js oraz npm
2. Prosty serwer http (np. serve lub live-server) do lokalnego hostowania strony

### Jak uruchomić
1. npm install
2. npm run start
3. Uruchomienie wybranego przez nas serwera w utworzonym katalogu dist


### Język poziomów
Poziomy są definiowane za pomocą ciągu tokenów oddzielonych znakiem ";". Na razie rozpatrujemy pola typu:
- Puste pole - znak E
- Ściana - znak W
- Strzałka z kierunkiem - znak A oraz jeden znak spośród UDLR

Każde pole posiada atrybut oznaczający czy smok się na nim znajduje.
