

// Toggle an elements visibility.
function toggleVisibility(element){
  if (element.style.visibility == "visible") {
    element.style.visibility='hidden';
  } else {
    element.style.visibility='visible';
  }
}

// Maybe we should be using display: none? https://www.w3schools.com/css/css_display_visibility.asp
// Register this as an onclick for any of the districts
function onClickDistrict() {
  // TODO - make this populate with per district info instead of generic
  var card = document.getElementById("floating-card");

  var start_text = document.getElementById("start");
  if (start_text) {
    card.removeChild(start_text);
  }
  // Remove the info if it exists
  var candidate_info = document.getElementsByClassName("card-text");
  while (candidate_info.length > 0) {
    card.removeChild(candidate_info[0]);
  }

  var text_needed = ["Candidate Name:", "Climate Cabinet Ranking:", "Action Needed:", "District Info:", "Quote:"];

  for (var i = 0; i < text_needed.length; ++i){
    var text = text_needed[i];
    var p_node = document.createElement("p");
    var text_node = document.createTextNode(text);
    p_node.className = "card-text"
    p_node.appendChild(text_node);
    card.appendChild(p_node);
  }
}

// Add the onclick listeners
// TODO(jmorg): Use event listeners instead.
function addOnClickToDistricts() {
  // Get all districts with class ".district" and register this onclick
  var districts = document.getElementsByClassName("district-marker");
  for (var i = 0; i < districts.length; ++i) {
    district = districts[i];
    district.onclick = function() {onClickDistrict()};
  }
}

function drawMap() {
  console.log(window.innerWidth);
  console.log(window.innerLength);
  var width = document.getElementById('map-div').clientWidth;
  var height = document.getElementById('map-div').clientHeight;

  var projection = d3.geo.albersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select("div.map-div").append("svg")
      .attr("width", width)
      .attr("height", height).attr("class", "map").attr("id", "map");

  // Can we use this data? Snagged from mbostocks site, looks like it's open source.
  // We should host it on webiste and make an async request instead of bloating the whole site.
  // We need to host this data and run a server instead of the software crime I commit below. Then,
  // make that function a callback with the following signature:
  // 
  // function ready(error, us, congress)
  // 
  // and call the below:
  // 
  // queue()
  //     .defer(d3.json, "http://source-of-data/us.json")
  //     .defer(d3.json, "http://source-of-data/us-congress-113.json")
  //     .await(ready);


  // vars "us" and "congress" are hoisted from the imports in head of index.html. This is terrible practice.

  svg.append("g").append("path")
    .attr("id", "land")
    .datum(topojson.feature(us, us.objects.land))
    .attr("d", path).attr("fill", "#bbb");

  svg.append("clipPath")
    .attr("id", "clip-land")
  .append("use")
    .attr("xlink:href", "#land");

  svg.append("path")
    .attr("class", "state-boundaries")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("d", path);

  d3.select(self.frameElement).style("height", height + "px");

  // NOTE: Backwards from what you get in GoogleMaps (Aka, W / N instead of N/W)
  // This is because we're using an Albers projection.
  var sfPoint = projection([-122.390128, 37.790014]);
  svg.append("circle")
    .attr("cx", sfPoint[0])
    .attr("cy", sfPoint[1])
    .attr("r", 8)
    .attr("fill", "orange")
    .attr("class", "district-marker");
}

// Unused for now
function drawDistricts() {
  svg.append("g")
    .attr("class", "districts")
    .attr("clip-path", "url(#clip-land)")
  .selectAll("path")
    .data(topojson.feature(congress, congress.objects.districts).features)
  .enter().append("path")
    .attr("d", path).attr("class", "district")
  .append("title")
    .text(function(d) { return d.id; });

  svg.append("path")
    .attr("class", "district-boundaries")
    .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
    .attr("d", path);

}

function onResizeRedrawMap() {
  console.log("resize triggered");
  var map = document.getElementById("map");
  while (map.firstChild) {
    map.removeChild(map.firstChild);
  }
  map.remove();
  drawMap();
  addOnClickToDistricts();
}

function main() {
  drawMap();
  addOnClickToDistricts();
  window.addEventListener("resize", onResizeRedrawMap)
}

main();


