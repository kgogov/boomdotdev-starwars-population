import { EventEmitter } from "eventemitter3";
import { delay } from "../utils";
import Person from "./Person";

export default class Planet extends EventEmitter {
    constructor(name, config, peopleData) {
        super()

        this.name = name;
        this.config = config;
        this.peopleData = peopleData;

        this.population = [];
        this.peopleCounter = 0;
    }

    static get events() {
        return {
            PERSON_BORN: 'person_born',
            POPULATING_COMPLETED: 'populating_completed'
        }
    }

    get populationCount() {
        return this.population.length;
    }

    async populate() {
        await delay(this.config);

        const currentEntitiy = this.peopleData[this.peopleCounter];
        this.population.push(new Person(currentEntitiy.name, currentEntitiy.height, currentEntitiy.mass));

        this.emit(Planet.events.PERSON_BORN, {
            filmsUrl: currentEntitiy.films
        });

        this.peopleCounter++;

        if (this.peopleCounter !== this.peopleData.length) {
            await this.populate();
        } else {
            this.emit(Planet.events.POPULATING_COMPLETED, this);
        }
    }
}