let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function displayCharts(id) {

  // console.log(id)

  d3.json(url).then(function(data) {

    samples = data.samples

    let selectedSample = samples.filter(sample => sample.id == id);
    
    otuIds = selectedSample[0].otu_ids;
    otuLabels = selectedSample[0].otu_labels;
    sampleValues = selectedSample[0].sample_values;

    // We need to slice the data to get the top 10, also reverse, and we need OTU added to the IDs, one way would be to use .map
    
    
    otuIdAsBar = otuIds.map(otuId => "OTU " + otuId);

    let top10OtuIds = otuIds.slice(0, 10).reverse();
    let top10SampleValues = sampleValues.slice(0,10).reverse();
    let top10OtuLabels = otuLabels.slice(0,10).reverse();
    // Do bar chart
    var barTrace = {
      x: top10SampleValues,
      y: top10OtuIds.map(id => `OTU ${id}`),
      text: top10OtuLabels,
      type: "bar",
      orientation: "h"
    };

    var barData = [barTrace];

    Plotly.newPlot("bar", barData);
    // Do bubble chart
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Viridis"
      }
    };

    var layout = {
      xaxis: { title: "OTU IDs"}
    };

    var bubbleData = [bubbleTrace]

    Plotly.newPlot("bubble", bubbleData);
    // Do panel
    metadata = data.metadata;
    
    let selectedMeta = metadata.filter(m => m.id == id)[0];
    
    console.log(selectedMeta)

    panel = d3.select("#sample-metadata");
    panel.html("");
    panel.append("h6").text("ID: " + selectedMeta["id"]);
    panel.append("h6").text("Ethnicity: " + selectedMeta["ethnicity"]);
    panel.append("h6").text("Gender: " + selectedMeta["gender"]);
    panel.append("h6").text("Age: " + selectedMeta["age"]);
    panel.append("h6").text("Location: " + selectedMeta["location"]);
    panel.append("h6").text("BBType: " + selectedMeta["bbtype"]);
    panel.append("h6").text("WFReq: " + selectedMeta["wfreq"]);
  });
}

function optionChanged(selectedId) {

  displayCharts(selectedId);

}


function init() {

  d3.json(url).then(function(data) {

    // console.log(data);
    // Fill the dropdown menu with all the IDs
    let dropdownMenu = d3.select("#selDataset");

    // console.log(data.names);

    let ids = data.names;

    for(let i=0; i<ids.length; i++) {
      dropdownMenu.append("option").text(ids[i]).property("value", ids[i]);
    }

    first = ids[0]
    // Display the chart and panel with the first ID

    displayCharts(first);

  });

}

init()
