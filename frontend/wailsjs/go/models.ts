export namespace main {
	
	export class Conditions {
	    tsumo: boolean;
	    riichi: boolean;
	    doubleriichi: boolean;
	    ippatsu: boolean;
	    menzenchin: boolean;
	    houtei: boolean;
	    haitei: boolean;
	    rinshan: boolean;
	    chankan: boolean;
	    tenhou: boolean;
	    chiihou: boolean;
	    bakaze: number;
	    jikaze: number;
	    dora: number[];
	    uradora: number[];
	
	    static createFrom(source: any = {}) {
	        return new Conditions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tsumo = source["tsumo"];
	        this.riichi = source["riichi"];
	        this.doubleriichi = source["doubleriichi"];
	        this.ippatsu = source["ippatsu"];
	        this.menzenchin = source["menzenchin"];
	        this.houtei = source["houtei"];
	        this.haitei = source["haitei"];
	        this.rinshan = source["rinshan"];
	        this.chankan = source["chankan"];
	        this.tenhou = source["tenhou"];
	        this.chiihou = source["chiihou"];
	        this.bakaze = source["bakaze"];
	        this.jikaze = source["jikaze"];
	        this.dora = source["dora"];
	        this.uradora = source["uradora"];
	    }
	}
	export class Yakuman {
	    value: number;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Yakuman(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.value = source["value"];
	        this.name = source["name"];
	    }
	}
	export class Yaku {
	    han: number;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Yaku(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.han = source["han"];
	        this.name = source["name"];
	    }
	}
	export class Score {
	    yakuList: Yaku[];
	    yakumanList: Yakuman[];
	    yakumanMultiplier: number;
	    han: number;
	    fu: number;
	    points: number;
	    scoreLevel: string;
	    tsumoSplit: number[];
	
	    static createFrom(source: any = {}) {
	        return new Score(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.yakuList = this.convertValues(source["yakuList"], Yaku);
	        this.yakumanList = this.convertValues(source["yakumanList"], Yakuman);
	        this.yakumanMultiplier = source["yakumanMultiplier"];
	        this.han = source["han"];
	        this.fu = source["fu"];
	        this.points = source["points"];
	        this.scoreLevel = source["scoreLevel"];
	        this.tsumoSplit = source["tsumoSplit"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Tile {
	    tileID: number;
	    red: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Tile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tileID = source["tileID"];
	        this.red = source["red"];
	    }
	}

}

