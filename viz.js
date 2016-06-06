'use strict';
d3.csv("NCD_RisC_Lancet_2016_DM_age_standardised_world.csv", getData, display);

function getData(d) {
	return {
		Country : d.Country,
		ISO: d.ISO,
		Sex: d.Sex,
		Year: +d.Year,
		Prevalence: +d.Prevalence,
		Lower: +d.Lower,
		Upper: +d.Upper
	};
}

function display(data) {
	console.log(data);
}