// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata;
    console.log("Metadata:", metadata);

    // Filter the metadata for the object with the desired sample number
    var result = metadata.filter(meta => meta.id == sample)[0];
    console.log("Filtered Metadata Result for Sample", sample, ":", result);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
      console.log(`Appending to panel - ${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Log the raw data
    console.log("Raw Data for Charts:", data);

    // Get the samples field
    var samples = data.samples;
    console.log("Samples:", samples);

    // Filter the samples for the object with the desired sample number
    var result = samples.filter(sampleObj => sampleObj.id == sample)[0];
    console.log("Filtered Sample Result for Sample", sample, ":", result);

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Sample Values:", sample_values);

    // Build a Bubble Chart
    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    console.log("Bubble Chart Rendered");

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    var barTrace = {
      x: sample_values.slice(0, 10).reverse(), // Slice and reverse the data for the bar chart
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(), // Map to strings for yticks
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h' // For horizontal bar chart
    };

    var barData = [barTrace];

    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
    console.log("Bar Chart Rendered");

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Log the raw data
    console.log("Raw Data on Init:", data);

    // Get the names field
    var sampleNames = data.names;
    console.log("Sample Names:", sampleNames);

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
      console.log(`Added option for sample: ${sample}`);
    });

    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.


    // Get the first sample from the list
    var firstSample = sampleNames[0];
    console.log("First Sample Selected:", firstSample);

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  console.log("Sample Changed to:", newSample);
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
