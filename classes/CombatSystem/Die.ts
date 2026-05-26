


export default class Die {

    private faces:undefined|number;

    constructor(faces:number) {
        this.faces=faces;
    };

    roll() {
        if (!this.faces) return;
        const rollValue = Math.floor(Math.random() * this.faces) + 1;
        return rollValue;
    }

}