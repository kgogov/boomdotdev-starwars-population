import { EventEmitter } from "eventemitter3";
import { fetchAndDecode } from "../utils";
import config from "../../config";
import Planet from "./Planet";
import Film from "./Film";

export default class StarWarsUniverse extends EventEmitter {
    constructor() {
        super();

        this.films = [];
        this.planet = null;
    }

    static get events() {
        return {
            FILM_ADDED: 'film_added',
            UNIVERSE_POPULATED: 'universe_populated'
        }
    }

    _onPopulatingCompleted() {
        console.log(this.planet.populationCount);
        console.log(this.films.length);
        this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED);
    }

    _onPersonBorn(filmsUrl) {
        filmsUrl.forEach(url => {
            let shouldAdd = true;

            this.films.forEach(film => {
                if (film.url === url) {
                    shouldAdd = false;
                }
            })

            if (shouldAdd) {
                const film = new Film(url);
                this.films.push(film);

                this.emit(StarWarsUniverse.events.FILM_ADDED);
            }
        });
    }

    getEmptyPlanet(planets) {
        let planet = null;

        for (let i = 0; i < planets.length; i++) {
            if (planets[i].population === '0') {
                planet = planets[i];
                break;
            }
        }

        return planet;
    }

    async getPlanets() {
        const URL = config.PLANETS_BASE_URL;

        let planets = [];
        let next = URL;

        while (next) {
            const data = await fetchAndDecode(next);
            next = data.next;

            planets = [...planets, ...data.results];
        }

        return planets;
    }

    async getPeople() {
        const data = await fetchAndDecode(config.PEOPLE_BASE_URL);
        return [...data.results];
    }

    async init() {
        const people = await this.getPeople();
        const planets = await this.getPlanets();
        const emptyPlanet = this.getEmptyPlanet(planets);

        const planet = new Planet(emptyPlanet.name, config, people);
        this.planet = planet;

        this.planet.on(Planet.events.PERSON_BORN, (e) => {
            this._onPersonBorn(e.filmsUrl);
        });

        this.planet.on(Planet.events.POPULATING_COMPLETED, () => {
            this._onPopulatingCompleted();
        });

        await this.planet.populate();
    }
}