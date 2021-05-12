
let code = "25321";

module.exports.crypt = (txt)=>{
    return txt;
    let str = "";
    let tmpTxt = "";
    let cursorCode = 0;
    for(let i = txt.length-1; i >= 0; i--){
        tmpTxt += txt[i];
    }

    txt = tmpTxt;

    for(let i = 0; i < txt.length; i++){
        let c = txt[i].charCodeAt();

        if(c < 10)
            c = '00' + c;
        else if(c < 100)
            c = '0' + c;

        str += c;
    }

    let str2 = "";
    for(let i = 0; i < str.length; i++){
        let val = (parseInt(str[i]) + parseInt(code[cursorCode])).toString();

        if(val < 10)
            val = '0' + val;

        str2 += val;
        
        if(cursorCode >= code.length-1)
            cursorCode = 0;
        else
            cursorCode ++;
    }

    return str2;
}

module.exports.decrypt = (txt)=>{
    return txt;
    let str = "";
    let cursorCode = 0;
    for(let i = 0; i < txt.length-1; i+=2){
        str += (parseInt(txt[i]+txt[i+1]) - parseInt(code[cursorCode])).toString();
        
        if(cursorCode >= code.length-1)
            cursorCode = 0;
        else
            cursorCode ++;
    }
   
    let original = ""
    for(let i = 0; i < str.length-2; i+=3){
        let c = String.fromCharCode(str[i]+str[i+1]+str[i+2]);
        original += c;
    }

    let tmpTxt = "";
    for(let i = original.length-1; i >= 0; i--){
        tmpTxt += original[i];
    }

    return tmpTxt;

}

function fmt(val){
    if(val < 10)
        return '0' + val;
    return val
}
module.exports.getDate = (u)=>{
    let d = new Date(u);
    let D = fmt(d.getDate());
    let M = fmt(d.getMonth());
    let Y = fmt(d.getFullYear());
    let h = fmt(d.getHours());
    let m = fmt(d.getMinutes());
    let s = fmt(d.getSeconds());

    return '`'+Y+'/'+M+'/'+D+' '+h+':'+m+':'+s+'`';
}