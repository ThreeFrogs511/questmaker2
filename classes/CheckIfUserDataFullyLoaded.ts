class CheckIfDataFullyLoaded {
    private pathname: undefined | string;
    constructor(pathname:string) {
        this.pathname = pathname;
    };

    checkingIfPathnameValid() {
        if (!this.pathname) return { err: "Wrong URL" };
    }

}


class CheckIfJournalDataFullyLoaded extends CheckIfDataFullyLoaded {

    constructor(pathname:string) {
        super(pathname);
    };

    
    
}