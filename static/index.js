// Create dropdown menu
function dropDownEvent() {
	Plotly.d3.json("/names", function (error, response) {

		if (error) return console.warn(error);

		// console.log(response);

		var selector = document.getElementById("selDataset")

		for (var i = 0; i < response.length; i++) {
			var currentOption = document.createElement("option");
			currentOption.innerHTML = response[i];
			currentOption.value = response[i];
			selector.appendChild(currentOption);
		}
	});
};

var initSample = "BB_940"

function init(sample) {
	//Get data from metadata route
	//use only second half of id 
	const sampleId = sample.split("_").pop();
	Plotly.d3.json(`/metadata/${sampleId}`, function (error, response) {
		if (error) return console.warn(error);

		console.dir(response);

		var metadataResponse = Object.keys(response);
		var sampleMetadataDiv = document.querySelector("#sampleMetadata");
		sampleMetadataDiv.innerHTML = null;

		//loop through response to get key value pairs to print in div
		for (var i = 0; i < metadataResponse.length; i++) {
			var key = document.createElement('p');
			key.innerHTML = metadataResponse[i] + ": " + response[metadataResponse[i]];
			sampleMetadataDiv.appendChild(key)
		};
	});

	//Get data from sample route
	Plotly.d3.json(`/samples/${sample}`, function (error, samplesResponse) {
		if (error) return console.warn(error);

		console.log(samplesResponse);

		//Grab slice of top 10 values
		var otuId = samplesResponse[0]["otu_ids"].slice(0, 10)
		var sampleValues = samplesResponse[0]["sample_values"].slice(0, 10)
		//set x and y axis for bubble plot later
		var xaxis = samplesResponse[0]["otu_ids"]
		var yaxis = samplesResponse[0]["sample_values"]

		console.log(otuId, sampleValues);


		//get data from otu route
		Plotly.d3.json("/otu", function (error, otuResponse) {

			if (error) return console.warn(error);

			console.log(otuResponse);

			var otuDescription = []
			for (var i = 0; i < otuId.length; i++) {
				otuDescription.push(otuResponse[otuId[i]])
			}

			//set up data for pie chart
			var pieData = [{
				values: sampleValues,
				labels: otuId,
				hovertext: otuDescription,
				type: 'pie',
			}];
			//set up layout
			var pieLayout = {
				height: 600,
				width: 600,
			};
			// plot pie chart
			Plotly.newPlot("pie", pieData, pieLayout);

			//set up data for bubble plot
			var bubbleData = [{
				x: xaxis,
				y: yaxis,
				mode: 'markers',
				hovertext: otuDescription,
				marker: {
					colorscale: 'Earth',
					color: samplesResponse[0]["otu_ids"],
					size: samplesResponse[0]["sample_values"]
				},
				type: "scatter"

			}];
			//set layout
			var bubbleLayout = {
				showlegend: false,
				height: 600,
				width: 825,
				hovermode: 'closest'

			};
			//plot bubble chart
			Plotly.newPlot('bubble', bubbleData, bubbleLayout);

		})
	});
}
//create functions to restyle plots when new sample is selected
function updatePie(newSampleValues, newotuId, newSample) {
	//update pie chart
	var PIE = document.getElementById("pie");
	Plotly.restyle(PIE, "values", [newSampleValues]);
	Plotly.restyle(PIE, "labels", [newotuId])
};

function updateBubble(newX, newY, newSample) {
	//update bubble plot
	var BUBBLE = document.getElementById("bubble");
	Plotly.restyle(BUBBLE, "x", [newX]);
	Plotly.restyle(BUBBLE, "y", [newY]);

};

function optionChanged(newSample) {
	//Get data from metadata route
	//use only second half of id 
	const sampleId = newSample.split("_").pop();
	Plotly.d3.json(`/metadata/${sampleId}`, function (error, response) {
		if (error) return console.warn(error);

		console.dir(response);

		var metadataResponse = Object.keys(response);
		var sampleMetadataDiv = document.querySelector("#sampleMetadata");
		sampleMetadataDiv.innerHTML = null;

		//loop through response to get key value pairs to print in div
		for (var i = 0; i < metadataResponse.length; i++) {
			var key = document.createElement('p');
			key.innerHTML = metadataResponse[i] + ": " + response[metadataResponse[i]];
			sampleMetadataDiv.appendChild(key)
		};
	});

	//Get data from sample route
	Plotly.d3.json(`/samples/${newSample}`, function (error, response) {
		if (error) return console.warn(error);

		//console.log(samplesResponse);

		//Grab slice of top 10 values
		var newotuId = response[0]["otu_ids"].slice(0, 10)
		var newsampleValues = response[0]["sample_values"].slice(0, 10)
		//new x and y axis variables
		var newX = response[0]["otu_ids"]
		var newY = response[0]["sample_values"]

		console.log(newotuId, newsampleValues);

		//get data from otu route
		Plotly.d3.json("/otu", function (error, otuResponse) {

			if (error) return console.warn(error);

			console.log(otuResponse);

			var otuDescription = []
			for (var i = 0; i < newotuId.length; i++) {
				otuDescription.push(otuResponse[newotuId[i]])
			}
			updatePie(newsampleValues, newotuId, newSample);
			updateBubble(newX, newY, newSample);
		})
	})
};
init(initSample);
dropDownEvent();