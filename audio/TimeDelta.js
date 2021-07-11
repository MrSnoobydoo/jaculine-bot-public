// Verison 1.0

class TimeDelta
{	

	constructor(){
		const base = new Date();
		this.offset = base.getTimezoneOffset()/60;

		this.time = {};
		this.date;

		this.time.Y = base.getFullYear();
		this.time.M = base.getMonth();
		this.time.D = base.getDate();

		this.time.h = base.getHours()+this.offset; // les dépassement su'ato régule, donc pas de soucis si h = 24 par exemple
		this.time.m = base.getMinutes();
		this.time.s = base.getSeconds();

		return this;
	}

	Process(offset, prefix=''){
		let v = new TimeDelta();
		v.SetOffset(offset);
		v.NumberString();

		if(v.NewDate().err != undefined) return false;
		else console.log(v.date);

		return "> **"+prefix+v.toString().heure+"** \n> `"+v.toString().date+"`";

	}

	SetOffset(offset){
		this.time.h += offset;
		this.time = this.Recadrage(this.time);
		return this.time;
	}

	NewDate(){
		try{
			return this.date = new Date(this.time.Y+'-'+this.time.M+'-'+this.time.D+'T'+this.time.h+':'+this.time.m+':'+this.time.s+'.000');
		}catch(err){
			this.time.error = true;
			this.time.err = err;
			return this.time;
		}
	}

	toString(){
		let d = this.NumberStringDate();
		return {
			heure : d.h+':'+d.m,
			date : d.D+'/'+d.M+'/'+d.Y
		}
	}

	NumberStringDate(){
		let d = {
			h : this.date.getHours(),
			m : this.date.getMinutes(),
			s : this.date.getSeconds(),
			D : this.date.getDate(),
			M : this.date.getMonth(),
			Y : this.date.getFullYear()
		}

		for(var v in d){
			if(d[v] < 10)
				d[v] = '0' + d[v].toString();
		}

		return d;
	}

	NumberString(){
		for(var v in this.time){
			
			if(this.time[v] < 10)
				this.time[v] = '0' + this.time[v].toString();
		}
		return this.time;
	}

	Recadrage(){
		if(this.time.h < 0){
			this.time.h = 23;
			this.time.D -= 1;
		}
		if(this.time.D < 1){
			this.time.D = 31; // new Date s'auto corrige si 31 n'existe pas
			this.time.M -= 1;
		}
		if(this.time.M < 1){
			this.time.M = 12;
			this.time.Y -= 1;
		}
		return this.time;
	};
}

module.exports = TimeDelta;