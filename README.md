# gra-w-smoka
Nowa implementacja Gry w Smoka, realizowana w ramach pracy dymplomowej będącej zwieńczeniem studiów inżynierskich na Wydziale Matematyki i Informatyki, Uniwersytetu Wrocławskiego.

Obecnie dostępna pod adresem: https://gra-w-smoka.herokuapp.com

Gra jest zrealizowana całkowicie po stronie klienckiej przy użyciu biblioteki React.
Zarządzanie stanem realizowane jest na podstawie architektury Flux, jednak bez użycia Redux.
Zamiast tego korzystamy z hooków useReducer oraz useContext.

## Uruchomienie
### Potrzebne programy
1. Node.js oraz npm

### Jak uruchomić
```console
npm install
npm run compile
cp serve.json dist/

npm run start # wersja live
npm run dev # wersja deweloperska z live watch
```

