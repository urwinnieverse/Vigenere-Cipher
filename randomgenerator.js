const row =[];

for(i=0; i<80; i++){

row[i]= Math.random() > 0.5 ? 1 : 0;

}

const ran=[];

for(i=0; i<4; i++){

ran[i]= Math.round( Math.random()*80)


}


console.log(ran)